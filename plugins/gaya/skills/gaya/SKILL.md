---
name: gaya
description: Use when the user wants to distill a powerful model's output quality into a cheap/small model — iteratively optimizes prompt and every OpenRouter API parameter against an Opus 4.7 reference, scored by an LLM judge, and outputs a markdown report with the final prompt ready to paste into an app. Triggers on /gaya, "optimize this prompt", "distill opus into a cheap model", "prompt search", "prompt tuning loop", "find best prompt for", "iterate until score is good", "auto-prompt", "OPRO".
---

# Gaya

Distill the quality of a heavyweight reference model (Opus 4.7) into a small/cheap model by iteratively searching over the prompt and every API parameter OpenRouter exposes. Named after Gaïa, mother of the Titans — the skill births a production-grade prompt from a primordial reference.

Inspired by Karpathy's [autoresearch](https://github.com/karpathy/autoresearch) — one human-editable spec, a fixed-budget loop, a single metric.

## What it does

Given a task description, Gaya:

1. Generates a gold **reference** with Opus 4.7 (score = 100 by definition).
2. Runs N iterations (10–20 default) of a small model with a candidate (system prompt, user prompt, sampling params).
3. Scores each candidate output 0–100 with Opus 4.7 as judge.
4. An optimizer (also Opus 4.7) proposes the next candidate using full history and a catalogue of prompting techniques.
5. Emits `report.md`: score chart, every config tried, the best prompt + params, and a copy-paste integration snippet.

## Workflow

When invoked, execute these steps **in order**.

### 1. Gather inputs

Ask the user with `AskUserQuestion`:

- **Task description** — one paragraph describing what the prompt must do (input → desired output). If the user already provided it in the conversation, summarize and confirm.
- **Iteration budget** — integer, default `10`. Allowed range 5–30. Above 20 is rarely worth the cost.
- **Small candidate model** — the model Gaya will optimize *for*. See step 2.

### 2. Pick the candidate model

Detection priority:

1. **Project context** — grep the current working tree (excluding `node_modules`, `.venv`, `.git`) for `openai`, `anthropic`, `openrouter`, `model=`, `model:`, `MODEL =` and surface any explicit model IDs the project already uses. If exactly one cheap model is referenced, propose it as default.
2. **Otherwise**, propose three sensible defaults via `AskUserQuestion`:
   - `google/gemini-flash-1.5` — fast, very cheap
   - `mistralai/mistral-small-latest` — open-weights, cheap
   - `openai/gpt-4o-mini` — broad capability per $

The chosen model ID must be a valid OpenRouter slug (`provider/name` form).

### 3. Slugify the task and scaffold the working directory

Compute a short kebab-case `<slug>` from the task (e.g. `summarize-legal-clauses`, `classify-support-tickets`). If ambiguous, ask.

Create `.gaya/<slug>/` at the project root:

```
.gaya/<slug>/
├── task.md            # the task description (write it now)
├── reference.md       # populated in step 4
├── iterations.jsonl   # one JSON line per iteration
└── report.md          # populated in step 6
```

Add `.gaya/` to `.git/info/exclude` (do **not** modify `.gitignore` — see project convention).

### 4. Copy the runtime into the working directory

Copy `examples/gaya.py`, `examples/requirements.txt`, and `examples/.env.example` from the skill into `.gaya/<slug>/`.

Ensure `OPENROUTER_API_KEY` is set. If not in the user's environment, instruct them to create `.gaya/<slug>/.env` from `.env.example` and add their key. **Do not** read the key yourself — let `python-dotenv` handle it.

Install dependencies if needed:
```bash
python3 -m pip install -r .gaya/<slug>/requirements.txt
```

### 5. Run the loop

From the project root:
```bash
python3 .gaya/<slug>/gaya.py \
    --work-dir ".gaya/<slug>" \
    --skill-dir "<absolute path to skills/gaya>" \
    --small-model "<chosen model id>" \
    --iterations <N>
```

The script:
- Generates `reference.md` if it does not exist (Opus 4.7).
- Appends one JSON line to `iterations.jsonl` per iteration with `{iteration, candidate, output, score, rationale, usage, timestamp}`.
- Prints `[i/N] score=XX` per iteration.
- On completion, writes `report.md`.

The agent should run this in the foreground with reasonable timeout (iterations × ~60s).

### 6. Surface the report

Read `.gaya/<slug>/report.md` and:
- Print the **Score evolution** section to the chat.
- Print the **Final prompt** block fenced for copy-paste.
- Print the **Integration snippet** fenced for copy-paste.
- Mention the full report path so the user can open it.

## Inputs the user might also provide

- **A pre-existing reference output.** If the user supplies their own gold answer instead of letting Opus 4.7 generate one, write it directly to `reference.md` and skip step 4 of the loop.
- **Fixed params.** If the user wants temperature pinned, pass `--pin "temperature=0.2,top_p=0.9"` — the optimizer will be told these are off-limits.

## Edge cases

- **No API key** — refuse to run; ask the user to add `OPENROUTER_API_KEY` to `.env`.
- **Reference too short (< 50 chars)** — re-run reference generation with a stricter prompt; warn the user the task may be underspecified.
- **Score regression for ≥ 3 iterations** — the optimizer is told in `optimizer-prompt.md` to fall back to the current best candidate and perturb from there.
- **Loop crashes mid-run** — `iterations.jsonl` is append-only; re-running with the same `--work-dir` resumes from the last completed iteration.
- **Cost ceiling** — if the user gives `--max-usd <X>`, the script aborts (and still writes the partial report) once cumulative OpenRouter spend exceeds it.

## References

- `references/openrouter-params.md` — every API parameter the optimizer may tune, with valid ranges.
- `references/prompting-techniques.md` — catalogue of techniques the optimizer is told to consider.

## Templates

- `templates/reference-prompt.md` — gold reference generator.
- `templates/judge-prompt.md` — strict JSON-output rubric for the judge.
- `templates/optimizer-prompt.md` — OPRO-style next-candidate proposer.
- `templates/report.md` — final markdown report template.
