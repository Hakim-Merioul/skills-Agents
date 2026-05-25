---
name: ppt-design-slider
description: Use when the user wants to turn raw slide content into a designed PowerPoint deck. Picks from 36 embedded HTML templates (magazine + swiss + 34 editorial styles), splits user content into slides, exports an editable or image-based .pptx plus PDF. Cross-platform (Claude Code, Codex, Claude Desktop). Triggers on "/ppt-design-slider", "make slides", "design a deck", "build a presentation", "PowerPoint from this", "slides from outline", "pitch deck", "présenter", "diapositives", "transformer en PPT".
license: MIT
---

# PPT Design Slider

Turn raw slide content into a designed PowerPoint deck. The user provides text and optional images, picks a template from the 36-design catalog (or defines a custom style in 5 questions), and you produce `.pptx` (editable or image-based) plus `.pdf`.

## Architecture (read this first)

This skill ships with deterministic **harness scripts** that do the orchestration. The agent does NOT manage paths, file copying, or dependency installs in prose — it calls the scripts and works with their structured output. This avoids the classic LLM failure mode of skipping steps or inventing paths.

| Script | Purpose | When to run |
|---|---|---|
| `assets/scripts/show-catalog.mjs` | List all 36 templates grouped by mood/style | Step 1 — always, before any questions |
| `assets/scripts/init-deck.mjs` | Clone a picked template + scripts into the user's workspace | Step 3 — after user picks a slug |
| `assets/scripts/export-pdf.mjs` | Render deck HTML to PDF | Step 7 — export |
| `assets/scripts/export-pptx-image.mjs` | Render deck HTML to image-based PPTX | Step 7 — export |
| `assets/scripts/export-pptx-editable.mjs` | Render to editable PPTX (only if template supports it) | Step 7 — conditional |
| `assets/scripts/validate-deck.mjs` | Lint a Swiss-template deck against the 22 locked layouts | Step 6 — QA, swiss only |
| `assets/scripts/build-index.mjs` | Rebuild `index.json` from per-template `template.json` files | Dev-only |

`<SKILL_ROOT>` below means the path to this skill folder on the user's machine.

## When to use

✅ Suitable
- Pitch deck, launch deck, industry talk, internal share, LinkedIn carousel
- Designed slides from an outline / blog / paper / brief
- One-off deck with a specific tone (editorial / swiss / playful / institutional / brutalist / retro)

❌ Not suitable
- Live collaborative editing (this is static HTML → static PPTX)
- Bulk auto-generated reports (decks here are hand-tuned, not template-filled in volume)
- 100% pre-existing PowerPoint that just needs cleanup (edit the .pptx directly)

## The seven-step workflow

### Step 1 — ALWAYS surface the catalog FIRST

Before asking ANY questions, run the catalog script and show its output to the user:

```bash
node <SKILL_ROOT>/assets/scripts/show-catalog.mjs
```

The script prints the 36 templates grouped by mood (Flagship · Warm + editorial · Confident + modern · Dark / nocturnal · Playful / retro · Editorial / institutional · Civic / activist), each with slug + tagline.

**This step is non-negotiable.** Do not skip it because the brief feels obvious. Do not ask "what's the occasion?" before the user has seen the available designs. The point of this skill is letting the user *choose* among 36 designs, not guessing one.

If the user gave you a brief, you may suggest 1-3 candidates in your reply too — but always show the full catalog first.

End your message with:

> Pick a template by slug (e.g. `monochrome`), or say "recommend" / "choose for me" and I'll ask about occasion + mood to propose 3 candidates.

**Wait for the user's reply before moving on.**

### Step 2 — Handle the user's choice

Three possible user replies, each routes to a different next step:

**(a) User picks a specific slug** (e.g. "monochrome", "pink-script", "use swiss")
- Validate the slug against `index.json` — if it's a typo, re-run `show-catalog.mjs --filter <fuzzy-match>` and ask again.
- Go to Step 3.

**(b) User says "recommend" / "choose for me" / "I don't know"**
- Ask the brief questions:
  > Two quick questions so I can pick three candidates:
  > 1. **What's the occasion?** (founder pitch, research synthesis, brand manifesto, classroom kickoff, data report, LinkedIn carousel, …)
  > 2. **What mood / vibe?** (confident & punchy, quiet & literary, warm & playful, dark & moody, clinical & technical, …)
- After the user answers, re-run `show-catalog.mjs --filter <key-word>` if the answer maps to a filter, then propose **three** candidates that differ from each other. Wait for the user to pick one. Go to Step 3.

**(c) User says "custom" / "none of these"**
- Switch to the custom-style path documented in `references/custom-style.md`. Ask the 5 minimum-viable questions in ONE round. Write `<project>/deck/_design-spec.md`. Then go to Step 3 with the closest-in-spirit catalog template as the skeleton (the user picked "custom" not "no template at all").

### Step 3 — Initialize the deck workspace via init-deck.mjs

Run the harness script:

```bash
node <SKILL_ROOT>/assets/scripts/init-deck.mjs \
  --slug <picked-slug> \
  --project <user-project-path>
```

The script:
1. Validates the slug
2. Creates `<project>/deck/`
3. Copies the template + its assets/references/design.md
4. Renames `template.html` → `index.html`
5. Copies all export scripts + `package.json` into `<project>/deck/scripts/`
6. Writes `<project>/deck/_brief.md` (placeholder for the user's outline)
7. Writes `<project>/deck/NEXT_STEPS.md` (exact commands for steps 4-7)

If the user's project path isn't clear, ask: "Where should the deck workspace live? (e.g. `./my-deck`, `~/Documents/q3-review`)"

### Step 4 — Read the design rulebook + brief

Read TWO files in full:

1. `<project>/deck/design.md` — the template's design system: fonts, palette, decorative vocabulary, hero rhythm, image rules, hard constraints.
2. The template's layouts reference if it has one (path printed by `init-deck.mjs` in `NEXT_STEPS.md`).

**This is non-negotiable.** Every later decision about slides references the rulebook. Don't trust your design instincts over what `design.md` says.

If the deck mentions a specific brand or product, also run the brand asset protocol now — read `references/brand-protocol.md` and find the real logo, product photos, UI screenshots, colors. This is the single biggest quality lever; do not skip.

Help the user fill `<project>/deck/_brief.md` with their content (or accept what they paste in chat).

### Step 5 — Plan the slide list as a table

Before editing HTML, build:

| # | Layout | Headline | Body content | Image slot |
|---|---|---|---|---|

Use the narrative arc (Hook · Context · Core · Shift · Takeaway) from `references/content-splitting.md` if the user has no opinion on structure.

Share the table. **Wait for sign-off** before writing slide HTML.

### Step 6 — Build + QA the deck

Edit `<project>/deck/index.html`:
- Find the existing `<section class="slide">` (or equivalent) matching the desired layout.
- Duplicate it for each slide in the plan. Replace placeholder text + images with the user's content.
- If a needed layout doesn't exist in the template's demo, **design it in the active design system** — same fonts, palette, decorations, rhythm. See `references/extending-templates.md`. Do not bail to a different template, do not mash layouts.
- Update page-number labels (`NN / TT`).

**Swiss-specific:** every body slide MUST declare `data-layout="Sxx"` (S01–S22). Run validation periodically:

```bash
node <project>/deck/scripts/validate-deck.mjs <project>/deck/index.html
```

**Magazine-specific:** pick ONE of the 5 ink themes in `assets/templates/magazine/references/themes.md`. Do not mix themes mid-deck.

Open the deck in the browser (`open <project>/deck/index.html` on macOS, `start` on Windows, `xdg-open` on Linux) and send the user the path mid-build. Iterate on tone before iterating on layout.

QA against `references/checklist.md` — all P0 must pass, P1 should pass.

### Step 7 — Export

```bash
cd <project>/deck/scripts && npm install && npx playwright install chromium && cd ..
```

Then export:

```bash
# PDF — recommended default (always works, vector text)
node scripts/export-pdf.mjs --slides index.html --out deck.pdf

# PPTX (image-based — universal fallback, works with every template)
node scripts/export-pptx-image.mjs --slides index.html --out deck.pptx

# PPTX (editable text) — ONLY if template.json has "pptx_editable": true
node scripts/export-pptx-editable.mjs --slides index.html --out deck-editable.pptx
```

The `--slides` argument accepts either:
- A single HTML file (most templates ship this way — one file with multiple `<section class="slide">`)
- A directory of per-slide HTML files

After export, open each output (`open deck.pdf`) and verify it visually matches the HTML. Send the user the file paths.

## Cross-platform notes

The shell commands above (`node`, `cp`, `open`) work on macOS, Linux, and WSL.
Pure Windows: replace `open` with `start`. The skill body uses no agent-
specific tool calls — the same workflow runs on Claude Code, Codex CLI
(skills live at `~/.agents/skills/` or `<repo>/.agents/skills/`), and any
agent that can run Node.

## Why a harness, not just prose

A prose-only SKILL.md works in theory, but LLMs are non-deterministic. Steps get skipped, paths get invented, dependencies get installed in the wrong place. The harness scripts (`show-catalog.mjs`, `init-deck.mjs`) make the high-value steps deterministic:

- **Catalog surfacing** is a script output, not a prompt instruction the model might decide to skip.
- **Template cloning** is one shell command with validated arguments, not 6 ad-hoc `cp` commands the model might typo.
- **Export environment setup** is a documented `NEXT_STEPS.md` written by `init-deck.mjs`, not prose the model has to recall.

This is the "harness" pattern — orchestration in code, judgment in prose.

## File map

```
ppt-design-slider/
├── SKILL.md                  ← you are here (the orchestrator)
├── README.md                 ← human-facing overview
├── NOTICES.md                ← third-party attribution
├── index.json                ← 36-design catalog (machine-readable)
├── assets/
│   ├── templates/            ← 36 embedded templates (immutable)
│   │   ├── magazine/         ← flagship
│   │   ├── swiss/            ← flagship
│   │   └── … (34 editorial)
│   └── scripts/              ← harness + export pipeline
│       ├── show-catalog.mjs       ← Step 1
│       ├── init-deck.mjs          ← Step 3
│       ├── build-index.mjs        ← dev-only, regenerates index.json
│       ├── html2pptx.js
│       ├── export-pptx-editable.mjs
│       ├── export-pptx-image.mjs
│       ├── export-pdf.mjs
│       ├── export-pdf-stage.mjs
│       └── validate-deck.mjs
└── references/               ← progressive disclosure docs (load on demand)
    ├── template-selection.md
    ├── content-splitting.md
    ├── brand-protocol.md
    ├── pptx-export-rules.md
    ├── extending-templates.md
    ├── custom-style.md
    ├── catalog.md
    └── checklist.md
```

## Core principles

1. **Always surface the catalog first.** The user must see the 36 designs before answering any questions about taste. The skill's value is letting them choose — not auto-picking.
2. **Templates are closed visual systems.** Don't mash layouts from two templates. Don't substitute fonts. Don't introduce new colors.
3. **`design.md` is the rulebook.** Read it in full before writing slides.
4. **Tone first, industry second.** A confident editorial deck can carry a tech talk.
5. **Brand assets > brand spec.** A real logo + product photo identifies a brand far more strongly than a hex value list.
6. **One idea per slide.** Hero rhythm every 3-4 slides.
7. **Honest placeholders > clever fakes.** If the image isn't there, leave a labeled color block.
8. **PDF is the lossless format.** Always ship PDF; PPTX is for downstream editing/presentation.
