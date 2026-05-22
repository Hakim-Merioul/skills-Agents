# Skills

> Agent skills I built and use every day for real engineering — not vibe coding.

A growing collection of Claude Code skills, designed for the work I actually
do. Hackable, cloneable, no vendor lock-in. Each skill is a single folder
under `skills/` — install only what you need.

## Installation

Clone the repo and copy any skill into your `~/.claude/skills/`:

```bash
git clone https://github.com/Hakim-Merioul/skills-Agents.git
cp -r skills-Agents/skills/transposition ~/.claude/skills/
```

Or copy a single `SKILL.md` file manually if you prefer.

## Skills

### transposition
Transfer the context of the current conversation into another window —
another Claude Code session, ChatGPT, Claude.ai, Gemini, or a human
teammate. Inspired by Ino Yamanaka's *Shintenshin no Jutsu*: transposing
a mind from one body into another.

Outputs a markdown file in `.transposition/` and a copy-paste-ready block
for any other tool. Multi-domain — works for code, writing, research,
brainstorming.

Modes:
- `transposition-brief` — short checkpoint
- `transposition-full` — full recap
- `transposition-prompt` — full + ready-to-paste prompt for the next window
- `transposition-code` — full + dev sections (diff, commands, TODOs)

[→ skills/transposition](skills/transposition/)

### gaya
Distill a heavyweight reference model's output (Opus 4.7) into a cheap small model
by iteratively searching over the prompt and every OpenRouter API parameter,
scored by an LLM-as-judge. Named after Gaïa, mother of the Titans. Inspired by
Karpathy's [autoresearch](https://github.com/karpathy/autoresearch) loop pattern.

**What it does**

Given a task description, Gaya runs a closed optimization loop with three LLM roles
behind a single OpenRouter-compatible client:

1. **Reference generation** — Opus 4.7 produces the gold output for the task. This
   is the score-100 ceiling by definition.
2. **Candidate execution** — a small/cheap model (e.g. `openai/gpt-4o-mini`,
   `google/gemini-flash-1.5`, `mistralai/mistral-small-latest`) generates a candidate
   output using the current `(system_prompt, user_prompt, params)` triple.
3. **Judging** — Opus 4.7 scores the candidate 0–100 against the reference using a
   strict five-axis rubric (semantic equivalence, completeness, structure, style,
   conciseness) and returns a JSON verdict with rationale and specific gaps.
4. **Optimization** — Opus 4.7, in OPRO-style, reads the full iteration history
   and proposes the next candidate. It tunes any subset of the OpenRouter sampling
   surface (`temperature`, `top_p`, `top_k`, `min_p`, `top_a`, `repetition_penalty`,
   `frequency_penalty`, `presence_penalty`, `seed`, `max_tokens`, `stop`,
   `response_format`) and rewrites the prompts, drawing from a curated catalogue
   of techniques (CoT, few-shot, self-consistency, ToT, role priming, output-format
   steering, decomposition, self-critique, constraint priming, …).
5. **Reporting** — after N iterations (5–30, default 10), Gaya emits a markdown
   report with the full score curve, every configuration tried, and the best
   prompt + params block — ready to paste into an application along with a Python
   integration snippet that already wires the OpenRouter client.

**Core functions** (`skills/gaya/examples/gaya.py`)

| Function | Role |
|---|---|
| `make_client()` | Build an OpenRouter-compatible OpenAI SDK client from `OPENROUTER_API_KEY` (loaded via `python-dotenv`). |
| `call(client, model, messages, **params)` | Filter `**params` against `ALLOWED_PARAMS` (the 12-knob whitelist) and call the chat-completion endpoint. Returns `(content, usage)`. |
| `generate_reference(client, skill_dir, task)` | Render `templates/reference-prompt.md` with the task and ask Opus 4.7 for the gold reference. |
| `judge(client, skill_dir, task, reference, candidate)` | Render `templates/judge-prompt.md`, call Opus 4.7 with `response_format=json_object`, parse the verdict, return `(verdict_dict, usage)`. |
| `optimize(client, skill_dir, task, reference, history, pinned)` | Render `templates/optimizer-prompt.md` (history + techniques catalogue + pinned params) and ask Opus 4.7 for the next candidate. Filters its `params` proposal through `ALLOWED_PARAMS` and re-applies pins. |
| `run_candidate(client, small_model, candidate)` | Execute the candidate on the small model. Exceptions are caught and stored as `[CANDIDATE_ERROR]`. |
| `parse_pinned(pin_str)` | Parse `--pin "temperature=0.2,top_p=0.9"` into a dict; warn on malformed entries. |
| `estimate_usd(usage)` | Conservative cost estimate using Opus 4.7 pricing as upper bound. |
| `ascii_chart(scores)` | Render a per-iteration score bar chart for the report. |
| `write_report(work_dir, skill_dir, task, reference, history, small_model, total_usd)` | Substitute all 16 placeholders in `templates/report.md` and write the final `report.md`. |
| `main()` | Orchestrate: load/generate reference → resume from `iterations.jsonl` if present → loop → write report. Respects `--max-usd` ceiling across restarts. |

**Templates** (`skills/gaya/templates/`)

- `reference-prompt.md` — instructs Opus 4.7 to produce the gold output.
- `judge-prompt.md` — five-axis rubric returning strict JSON.
- `optimizer-prompt.md` — OPRO-style next-candidate proposer with full parameter surface.
- `report.md` — final markdown report skeleton.

**References** (`skills/gaya/references/`)

- `openrouter-params.md` — every sampling/output knob with valid ranges, defaults, and tuning heuristics.
- `prompting-techniques.md` — curated catalogue the optimizer is told to draw from.

**Restart-safe & cost-bounded**

- `iterations.jsonl` is append-only — re-running with the same `--work-dir` resumes from the last completed iteration.
- `total_usd` is reconstructed from history on restart, so the `--max-usd` ceiling holds across runs.
- Candidate errors short-circuit the judge call (no wasted Opus tokens) and inject a synthetic `score=0` verdict.

**CLI**

```bash
python3 .gaya/<slug>/gaya.py \
    --work-dir .gaya/<slug> \
    --skill-dir <abs path to skills/gaya> \
    --small-model openai/gpt-4o-mini \
    --iterations 10 \
    --pin "seed=42" \
    --max-usd 5.0
```

Or just invoke the skill in Claude Code and let it scaffold the working directory,
detect the model from project context, and orchestrate everything for you:
`/gaya`, "optimize this prompt", "distill opus into a cheap model", etc.

[→ skills/gaya](skills/gaya/)

## License

MIT.
