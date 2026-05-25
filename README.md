# skills-Agents

> A Claude Code marketplace of agent skills built for real engineering — not vibe coding.

Each plugin in this marketplace is a self-contained Claude Code skill. Install one,
all, or any subset. Hackable, cloneable, no vendor lock-in.

## Install (Claude Code)

In Claude Code, add this marketplace once, then install plugins by name:

```bash
/plugin marketplace add Hakim-Merioul/skills-Agents
/plugin install ppt-design-slider@skills-Agents
/plugin install gaya@skills-Agents
/plugin install transposition@skills-Agents
```

That's it — Claude Code fetches and registers the plugins automatically. To list,
remove, or update later: `/plugin list`, `/plugin uninstall <name>`, `/plugin update`.

## Install (Codex CLI)

Codex CLI reads skills from `~/.agents/skills/` (user-global) or
`<repo>/.agents/skills/` (project-local) — see the
[official Codex skills docs](https://developers.openai.com/codex/skills).
Each plugin in this repo is already a spec-compliant skill (`SKILL.md` +
`assets/` + `references/`), so a direct subdirectory copy with `degit`
works:

```bash
# User-global install (available in every Codex session)
npx degit Hakim-Merioul/skills-Agents/plugins/ppt-design-slider/skills/ppt-design-slider \
  ~/.agents/skills/ppt-design-slider

npx degit Hakim-Merioul/skills-Agents/plugins/gaya/skills/gaya \
  ~/.agents/skills/gaya

npx degit Hakim-Merioul/skills-Agents/plugins/transposition/skills/transposition \
  ~/.agents/skills/transposition
```

Or for **project-local** install (only available inside one repo):

```bash
mkdir -p .agents/skills
npx degit Hakim-Merioul/skills-Agents/plugins/ppt-design-slider/skills/ppt-design-slider \
  .agents/skills/ppt-design-slider
```

Inside Codex, invoke skills with `/skills` (explicit) or by typing `$` to
mention a skill by name. Codex also auto-triggers a skill when your task
matches its `description` field — same behavior as Claude Code.

## Install (Claude Desktop or manual)

Clone the repo and copy any single skill into your `~/.claude/skills/`:

```bash
git clone https://github.com/Hakim-Merioul/skills-Agents.git
cp -r skills-Agents/plugins/transposition/skills/transposition ~/.claude/skills/
```

Or copy a single `SKILL.md` file manually if you prefer.

## Plugins

### ppt-design-slider
Turn raw slide content into a designed PowerPoint deck. The user provides text and
optional images, picks from a 36-template catalog (or defines a custom style in 5
questions), and the skill produces `.pptx` (editable or image-based) plus `.pdf`.

**Template library** — 36 designs in two tiers:
- **Flagship** (2): `magazine` (editorial WebGL spread, 10 layouts, 5 ink palettes) and
  `swiss` (International Typographic, 22 locked layouts S01–S22, single accent).
- **Editorial** (34): single-aesthetic decks tuned per tone — `monochrome`, `cobalt-grid`,
  `pink-script`, `studio`, `peoples-platform`, `retro-zine`, `daisy-days`, etc. See
  `plugins/ppt-design-slider/skills/ppt-design-slider/references/catalog.md` for the
  full list.

**Six-step workflow**
1. Brief the deck (occasion + mood — always asked, even if the topic seems obvious).
2. Show three template candidates with live cover previews — OR switch to a 5-question
   custom style spec (`_design-spec.md`) if no template fits.
3. Plan the slide list as a table (Layout / Headline / Body / Image slot) and wait for
   sign-off before writing HTML.
4. Build the deck against the template's design system (`design.md`). Don't mash
   layouts. Don't substitute fonts. Don't introduce new colors.
5. QA against `references/checklist.md` — P0 must pass.
6. Export `.pdf` (default, lossless), image-based `.pptx` (universal), and editable
   `.pptx` (only for templates flagged `pptx_editable: true`).

**Export pipeline** (`assets/scripts/`)

- `export-pdf.mjs` — Playwright + pdf-lib. Handles both multi-file decks and single-file
  decks with `<section class="slide">` siblings.
- `export-pptx-image.mjs` — full-bleed PNG screenshots embedded in a 16:9 PPTX. Works
  with every template.
- `export-pptx-editable.mjs` — native PowerPoint text boxes via pptxgenjs + html2pptx.js.
  Requires the deck to satisfy four HTML constraints (no gradients, no border-on-text,
  no `<div>` raw text, no `background-image` on `<div>`).
- `validate-deck.mjs` — lints a Swiss-template deck against the 22 locked layouts.
- `build-index.mjs` — regenerates `index.json` from the per-template `template.json` files.

Scripts must be copied into the project workspace before running (Node ESM resolves
dependencies relative to each script file). See SKILL.md Step 6 for the install flow.

**Cross-platform** — the SKILL.md body uses platform-neutral phrasing (no Claude-Code-
specific tool calls). Same workflow runs on Claude Code, Codex, and Claude Desktop.

[→ plugins/ppt-design-slider](plugins/ppt-design-slider/)

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

**CLI**

```bash
python3 .gaya/<slug>/gaya.py \
    --work-dir .gaya/<slug> \
    --skill-dir <abs path to plugins/gaya/skills/gaya> \
    --small-model openai/gpt-4o-mini \
    --iterations 10 \
    --pin "seed=42" \
    --max-usd 5.0
```

Or just invoke the skill in Claude Code and let it scaffold the working directory,
detect the model from project context, and orchestrate everything:
`/gaya`, "optimize this prompt", "distill opus into a cheap model", etc.

[→ plugins/gaya](plugins/gaya/)

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

[→ plugins/transposition](plugins/transposition/)

## Repo layout

```
skills-Agents/
├── .claude-plugin/
│   └── marketplace.json          ← Claude Code marketplace manifest
├── plugins/                       ← Each subdir is a Claude Code plugin
│   ├── ppt-design-slider/
│   │   ├── .claude-plugin/plugin.json
│   │   └── skills/ppt-design-slider/   ← Skill content (SKILL.md, etc.)
│   ├── gaya/
│   │   ├── .claude-plugin/plugin.json
│   │   └── skills/gaya/
│   └── transposition/
│       ├── .claude-plugin/plugin.json
│       └── skills/transposition/
├── .dev/                          ← Repo dev tooling (not user-facing)
└── README.md
```

## License

MIT.
