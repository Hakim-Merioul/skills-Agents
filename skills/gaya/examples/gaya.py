"""Gaya — prompt + parameter optimization loop.

Usage:
    python3 gaya.py \\
        --work-dir .gaya/<slug> \\
        --skill-dir /path/to/skills/gaya \\
        --small-model openai/gpt-4o-mini \\
        --iterations 10
"""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import sys
import time

from dotenv import load_dotenv
from openai import OpenAI

REFERENCE_MODEL = "anthropic/claude-opus-4-7"
JUDGE_MODEL = "anthropic/claude-opus-4-7"
OPTIMIZER_MODEL = "anthropic/claude-opus-4-7"

ALLOWED_PARAMS = {
    "temperature", "top_p", "top_k", "min_p", "top_a",
    "repetition_penalty", "frequency_penalty", "presence_penalty",
    "seed", "max_tokens", "stop", "response_format",
}


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument("--work-dir", required=True, type=pathlib.Path)
    p.add_argument("--skill-dir", required=True, type=pathlib.Path)
    p.add_argument("--small-model", required=True)
    p.add_argument("--iterations", type=int, default=10)
    p.add_argument("--pin", default="", help="Comma-separated param=value pairs to pin")
    p.add_argument("--max-usd", type=float, default=10.0)
    return p.parse_args()


def make_client() -> OpenAI:
    load_dotenv()
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key:
        sys.exit("OPENROUTER_API_KEY is not set. Add it to .env or your shell env.")
    return OpenAI(api_key=key, base_url="https://openrouter.ai/api/v1")


def call(client: OpenAI, model: str, messages: list[dict], **params) -> tuple[str, dict]:
    clean = {k: v for k, v in params.items() if k in ALLOWED_PARAMS and v is not None}
    resp = client.chat.completions.create(model=model, messages=messages, **clean)
    content = resp.choices[0].message.content or ""
    usage = resp.usage.model_dump() if resp.usage else {}
    return content, usage


def load_template(skill_dir: pathlib.Path, name: str) -> str:
    return (skill_dir / "templates" / name).read_text(encoding="utf-8")


def generate_reference(client: OpenAI, skill_dir: pathlib.Path, task: str) -> tuple[str, dict]:
    tmpl = load_template(skill_dir, "reference-prompt.md")
    prompt = tmpl.replace("{task}", task)
    text, usage = call(client, REFERENCE_MODEL,
                       [{"role": "user", "content": prompt}],
                       temperature=0.3)
    return text.strip(), usage


def judge(client: OpenAI, skill_dir: pathlib.Path, task: str, reference: str, candidate: str) -> tuple[dict, dict]:
    tmpl = load_template(skill_dir, "judge-prompt.md")
    prompt = (
        tmpl.replace("{task}", task)
            .replace("{reference}", reference)
            .replace("{candidate}", candidate)
    )
    text, usage = call(client, JUDGE_MODEL,
                       [{"role": "user", "content": prompt}],
                       temperature=0.0,
                       response_format={"type": "json_object"})
    try:
        return json.loads(text), usage
    except json.JSONDecodeError:
        return ({"score": 0, "rationale": f"Judge returned invalid JSON: {text[:200]}",
                 "specific_gaps": ["judge_parse_error"]}, usage)


def optimize(
    client: OpenAI,
    skill_dir: pathlib.Path,
    task: str,
    reference: str,
    history: list[dict],
    pinned: dict,
) -> tuple[dict, dict]:
    tmpl = load_template(skill_dir, "optimizer-prompt.md")
    techniques = (skill_dir / "references" / "prompting-techniques.md").read_text(encoding="utf-8")
    compact_history = [
        {
            "iteration": h["iteration"],
            "score": h["score"],
            "rationale": h["rationale"],
            "candidate": h["candidate"],
            "output_preview": h["output"][:300],
        }
        for h in history
    ]
    prompt = (
        tmpl.replace("{task}", task)
            .replace("{reference}", reference)
            .replace("{history}", json.dumps(compact_history, indent=2))
            .replace("{pinned_params}", json.dumps(pinned) if pinned else "none")
            .replace("{techniques_catalogue}", techniques)
    )
    text, usage = call(client, OPTIMIZER_MODEL,
                       [{"role": "user", "content": prompt}],
                       temperature=0.6,
                       response_format={"type": "json_object"})
    try:
        proposal = json.loads(text)
    except json.JSONDecodeError:
        return ({"rationale": "optimizer_parse_error; fallback baseline",
                 "system_prompt": "", "user_prompt": task, "params": {"temperature": 0.3}},
                usage)
    proposal.setdefault("system_prompt", "")
    proposal.setdefault("user_prompt", task)
    proposal.setdefault("params", {})
    proposal["params"] = {k: v for k, v in proposal["params"].items() if k in ALLOWED_PARAMS}
    for k, v in pinned.items():
        proposal["params"][k] = v
    return proposal, usage


def run_candidate(client: OpenAI, small_model: str, candidate: dict) -> tuple[str, dict]:
    messages = []
    if candidate.get("system_prompt"):
        messages.append({"role": "system", "content": candidate["system_prompt"]})
    messages.append({"role": "user", "content": candidate["user_prompt"]})
    return call(client, small_model, messages, **candidate.get("params", {}))


def parse_pinned(pin_str: str) -> dict:
    if not pin_str:
        return {}
    out = {}
    for pair in pin_str.split(","):
        if "=" not in pair:
            print(f"Warning: ignoring malformed --pin entry: {pair!r}", file=sys.stderr)
            continue
        k, v = pair.split("=", 1)
        k, v = k.strip(), v.strip()
        try:
            out[k] = float(v) if "." in v else int(v)
        except ValueError:
            out[k] = v
    return out


def estimate_usd(usage: dict) -> float:
    # Rough upper-bound: Opus 4.7 pricing ($15/M input, $75/M output). Most calls
    # in the loop ARE Opus (reference, judge, optimizer); the small-model call is
    # cheaper but we treat it as Opus for a conservative ceiling. Replace with
    # per-model pricing if you need accuracy.
    pin = usage.get("prompt_tokens", 0)
    pout = usage.get("completion_tokens", 0)
    return (pin * 15 + pout * 75) / 1_000_000


def ascii_chart(scores: list[int], width: int = 50) -> str:
    if not scores:
        return ""
    lines = []
    for i, s in enumerate(scores):
        bar = "█" * int(s * width / 100)
        lines.append(f"{i:>3} | {bar} {s}")
    return "\n".join(lines)


def write_report(
    work_dir: pathlib.Path,
    skill_dir: pathlib.Path,
    task: str,
    reference: str,
    history: list[dict],
    small_model: str,
    total_usd: float,
) -> None:
    best = max(history, key=lambda h: h["score"])
    scores = [h["score"] for h in history]
    table_rows = []
    prev = 0
    for h in history:
        delta = h["score"] - prev
        lever = h["candidate"].get("rationale", "")[:60].replace("|", "\\|").replace("\n", " ")
        rationale = h.get("rationale", "")[:80].replace("|", "\\|").replace("\n", " ")
        table_rows.append(f"| {h['iteration']} | {h['score']} | {delta:+d} | {lever} | {rationale} |")
        prev = h["score"]
    full_dump = "\n".join(
        f"### Iteration {h['iteration']} — score {h['score']}\n"
        f"**Rationale:** {h.get('rationale', '')}\n\n"
        f"**System prompt:**\n```\n{h['candidate'].get('system_prompt', '')}\n```\n\n"
        f"**User prompt:**\n```\n{h['candidate']['user_prompt']}\n```\n\n"
        f"**Params:** `{json.dumps(h['candidate'].get('params', {}))}`\n\n"
        f"**Output:**\n```\n{h['output']}\n```\n"
        for h in history
    )
    best_params = best["candidate"].get("params", {})
    tmpl = load_template(skill_dir, "report.md")
    rendered = (
        tmpl
        .replace("{slug}", work_dir.name)
        .replace("{timestamp}", time.strftime("%Y-%m-%d %H:%M:%S"))
        .replace("{task_oneliner}", task.split("\n")[0][:120])
        .replace("{small_model}", small_model)
        .replace("{n_iterations}", str(len(history)))
        .replace("{best_score}", str(best["score"]))
        .replace("{best_iteration}", str(best["iteration"]))
        .replace("{total_usd}", f"{total_usd:.4f}")
        .replace("{score_table}", "\n".join(table_rows))
        .replace("{score_chart}", ascii_chart(scores))
        .replace("{best_system_prompt}", best["candidate"].get("system_prompt", ""))
        .replace("{best_user_prompt}", best["candidate"]["user_prompt"])
        .replace("{best_params_json}", json.dumps(best_params, indent=2))
        .replace("{best_params_dict_literal}", json.dumps(best_params))
        .replace("{full_iteration_dump}", full_dump)
        .replace("{reference}", reference)
    )
    (work_dir / "report.md").write_text(rendered, encoding="utf-8")


def main() -> int:
    args = parse_args()
    work_dir = args.work_dir.resolve()
    skill_dir = args.skill_dir.resolve()
    work_dir.mkdir(parents=True, exist_ok=True)

    task_path = work_dir / "task.md"
    if not task_path.exists():
        sys.exit(f"Missing {task_path}. Write the task description there first.")
    task = task_path.read_text(encoding="utf-8").strip()

    client = make_client()
    pinned = parse_pinned(args.pin)

    ref_path = work_dir / "reference.md"
    if ref_path.exists():
        reference = ref_path.read_text(encoding="utf-8").strip()
        print(f"Using existing reference ({len(reference)} chars).")
    else:
        print("Generating reference with Opus 4.7…")
        reference, ref_usage = generate_reference(client, skill_dir, task)
        ref_path.write_text(reference, encoding="utf-8")
        total_usd_init_extra = estimate_usd(ref_usage)

    log_path = work_dir / "iterations.jsonl"
    history: list[dict] = []
    if log_path.exists():
        for line in log_path.read_text(encoding="utf-8").splitlines():
            if line.strip():
                history.append(json.loads(line))
        print(f"Resumed with {len(history)} prior iterations.")

    total_usd = sum(estimate_usd(h.get("usage", {})) for h in history)
    total_usd += locals().get("total_usd_init_extra", 0.0)
    start = len(history)
    for i in range(start, args.iterations):
        if i == 0:
            candidate = {
                "rationale": "baseline: raw task as user prompt, default params",
                "system_prompt": "",
                "user_prompt": task,
                "params": {"temperature": 1.0, **pinned},
            }
        opt_usage: dict = {}
        if i != 0:
            candidate, opt_usage = optimize(client, skill_dir, task, reference, history, pinned)

        candidate_error = False
        try:
            output, usage = run_candidate(client, args.small_model, candidate)
        except Exception as e:
            output, usage = f"[CANDIDATE_ERROR] {e}", {}
            candidate_error = True

        if candidate_error:
            verdict, judge_usage = ({"score": 0, "rationale": "candidate_error; judge skipped",
                                     "specific_gaps": ["candidate_error"]}, {})
        else:
            verdict, judge_usage = judge(client, skill_dir, task, reference, output)

        total_usd += (estimate_usd(usage) + estimate_usd(opt_usage) + estimate_usd(judge_usage))

        entry = {
            "iteration": i,
            "candidate": candidate,
            "output": output,
            "score": int(verdict.get("score", 0)),
            "rationale": verdict.get("rationale", ""),
            "specific_gaps": verdict.get("specific_gaps", []),
            "usage": usage,
            "timestamp": time.time(),
        }
        history.append(entry)
        with log_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")

        print(f"[{i+1}/{args.iterations}] score={entry['score']} usd≈{total_usd:.4f}")

        if total_usd > args.max_usd:
            print(f"Cost ceiling ${args.max_usd} hit; stopping early.")
            break

    if not history:
        print("No iterations were run. Nothing to report.", file=sys.stderr)
        return 1
    write_report(work_dir, skill_dir, task, reference, history, args.small_model, total_usd)
    best = max(history, key=lambda h: h["score"])
    print(f"\nDone. Best score: {best['score']} (iteration #{best['iteration']}).")
    print(f"Report: {work_dir / 'report.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
