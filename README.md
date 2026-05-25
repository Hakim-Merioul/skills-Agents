# skills-Agents

> Agent Skills built for real engineering — not vibe coding.

A growing collection of [Agent Skills](https://agentskills.io) following the open
specification. Each plugin is a self-contained skill — install one, all, or any
subset. Hackable, cloneable, no vendor lock-in.

## Install — one-command, per agent runtime

This repo is published as both an Agent Skills marketplace (for `/plugin install`)
and a set of spec-compliant `SKILL.md` directories (for `degit` / manual copy).

### Codex CLI

Codex CLI reads skills from `~/.agents/skills/` (user-global) or
`<repo>/.agents/skills/` (project-local) — see the
[official Codex skills docs](https://developers.openai.com/codex/skills).

```bash
# User-global install (available in every Codex session)
npx degit Hakim-Merioul/skills-Agents/plugins/ppt-design-slider/skills/ppt-design-slider \
  ~/.agents/skills/ppt-design-slider

npx degit Hakim-Merioul/skills-Agents/plugins/gaya/skills/gaya \
  ~/.agents/skills/gaya

npx degit Hakim-Merioul/skills-Agents/plugins/transposition/skills/transposition \
  ~/.agents/skills/transposition
```

For **project-local** install (only inside one repo):

```bash
mkdir -p .agents/skills
npx degit Hakim-Merioul/skills-Agents/plugins/ppt-design-slider/skills/ppt-design-slider \
  .agents/skills/ppt-design-slider
```

Inside Codex, invoke skills with `/skills` (explicit) or by typing `$` to
mention a skill by name. Codex also auto-triggers a skill when your task
matches its `description` field.

### Plugin marketplace (Anthropic agent runtime)

Add the marketplace once, then install plugins by name:

```bash
/plugin marketplace add Hakim-Merioul/skills-Agents
/plugin install ppt-design-slider@skills-Agents
/plugin install gaya@skills-Agents
/plugin install transposition@skills-Agents
```

To manage later: `/plugin list`, `/plugin uninstall <name>`, `/plugin update`.

### Manual copy (any agent runtime, desktop apps)

Clone the repo and copy any single skill into your runtime's skills directory
(e.g. `~/.claude/skills/`, `~/.agents/skills/`, or wherever your agent looks):

```bash
git clone https://github.com/Hakim-Merioul/skills-Agents.git
cp -r skills-Agents/plugins/transposition/skills/transposition ~/.agents/skills/
```

Or copy a single `SKILL.md` file manually if you prefer.

## Plugins

### ppt-design-slider
Turn raw slide content into a designed PowerPoint deck. The user provides text and
optional images, picks from a 36-template catalog (or defines a custom style in 5
questions), and the skill produces `.pptx` (editable or image-based) plus `.pdf`.

**Template library** — 36 designs in two tiers. Pick a slug from the visual catalog below.

#### Flagship (2)

|  |  |
|:---:|:---:|
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/magazine.png" width="260"><br>**Magazine**<br>`magazine` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/swiss.png" width="260"><br>**Swiss**<br>`swiss` |

#### Editorial tier (34)

|  |  |  |
|:---:|:---:|:---:|
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/8-bit-orbit.png" width="260"><br>**8-Bit Orbit**<br>`8-bit-orbit` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/biennale-yellow.png" width="260"><br>**Biennale Yellow**<br>`biennale-yellow` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/block-frame.png" width="260"><br>**BlockFrame**<br>`block-frame` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/blue-professional.png" width="260"><br>**Blue Professional**<br>`blue-professional` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/bold-poster.png" width="260"><br>**Bold Poster**<br>`bold-poster` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/broadside.png" width="260"><br>**Broadside**<br>`broadside` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/capsule.png" width="260"><br>**Capsule**<br>`capsule` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/cartesian.png" width="260"><br>**Cartesian**<br>`cartesian` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/cobalt-grid.png" width="260"><br>**Cobalt Grid**<br>`cobalt-grid` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/coral.png" width="260"><br>**Coral**<br>`coral` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/creative-mode.png" width="260"><br>**Creative Mode**<br>`creative-mode` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/daisy-days.png" width="260"><br>**Daisy Days**<br>`daisy-days` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/editorial-forest.png" width="260"><br>**Editorial Forest**<br>`editorial-forest` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/editorial-tri-tone.png" width="260"><br>**Editorial Tri-Tone**<br>`editorial-tri-tone` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/emerald-editorial.png" width="260"><br>**Emerald Editorial**<br>`emerald-editorial` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/grove.png" width="260"><br>**Grove**<br>`grove` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/long-table.png" width="260"><br>**Long Table**<br>`long-table` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/mat.png" width="260"><br>**Mat**<br>`mat` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/monochrome.png" width="260"><br>**Monochrome**<br>`monochrome` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/neo-grid-bold.png" width="260"><br>**Neo-Grid Bold**<br>`neo-grid-bold` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/peoples-platform.png" width="260"><br>**People's Platform**<br>`peoples-platform` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/pin-and-paper.png" width="260"><br>**Pin & Paper**<br>`pin-and-paper` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/pink-script.png" width="260"><br>**Pink Script — After Hours**<br>`pink-script` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/playful.png" width="260"><br>**Playful**<br>`playful` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/raw-grid.png" width="260"><br>**Raw Grid**<br>`raw-grid` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/retro-windows.png" width="260"><br>**Retro Windows**<br>`retro-windows` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/retro-zine.png" width="260"><br>**Retro Zine**<br>`retro-zine` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/sakura-chroma.png" width="260"><br>**Sakura Chroma**<br>`sakura-chroma` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/scatterbrain.png" width="260"><br>**Scatterbrain**<br>`scatterbrain` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/signal.png" width="260"><br>**Signal**<br>`signal` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/soft-editorial.png" width="260"><br>**Soft Editorial**<br>`soft-editorial` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/stencil-tablet.png" width="260"><br>**Stencil & Tablet**<br>`stencil-tablet` | <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/studio.png" width="260"><br>**Studio**<br>`studio` |
| <img src="plugins/ppt-design-slider/skills/ppt-design-slider/assets/previews/vellum.png" width="260"><br>**Vellum**<br>`vellum` |  |  |

See `plugins/ppt-design-slider/skills/ppt-design-slider/references/catalog.md` for the
full machine-readable catalog and `index.json` for the JSON schema.

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

**Runtime-neutral** — the SKILL.md body uses agent-neutral phrasing (no platform-
specific tool calls). The same workflow runs on any Agent Skills runtime.

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

Or invoke the skill in your agent runtime and let it scaffold the working directory,
detect the model from project context, and orchestrate everything:
`/gaya`, "optimize this prompt", "distill opus into a cheap model", etc.

[→ plugins/gaya](plugins/gaya/)

### transposition
Transfer the context of the current conversation into another window —
another agent session, ChatGPT, Claude.ai, Gemini, or a human
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
│   └── marketplace.json          ← Marketplace manifest (Agent Skills spec)
├── plugins/                       ← Each subdir is a plugin
│   ├── ppt-design-slider/
│   │   ├── .claude-plugin/plugin.json
│   │   └── skills/ppt-design-slider/   ← Skill content (SKILL.md, etc.)
│   ├── gaya/
│   │   ├── .claude-plugin/plugin.json
│   │   └── skills/gaya/
│   └── transposition/
│       ├── .claude-plugin/plugin.json
│       └── skills/transposition/
└── README.md
```

## License

MIT.
