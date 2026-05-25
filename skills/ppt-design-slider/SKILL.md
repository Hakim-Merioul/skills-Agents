---
name: ppt-design-slider
description: Use when the user wants to turn raw slide content into a designed PowerPoint deck. Picks from 36 embedded HTML templates (magazine + swiss + 34 editorial styles), splits user content into slides, exports an editable or image-based .pptx plus PDF. Cross-platform (Claude Code, Codex, Claude Desktop). Triggers on "/ppt-design-slider", "make slides", "design a deck", "build a presentation", "PowerPoint from this", "slides from outline", "pitch deck", "présenter", "diapositives", "transformer en PPT".
---

# PPT Design Slider

Turn raw slide content into a designed PowerPoint deck. The user provides text and optional images, picks a template from the 36-design catalog (or defines a custom style in 5 questions), and you produce `.pptx` (editable or image-based) plus `.pdf`.

## When to use

✅ Suitable
- Pitch deck, launch deck, industry talk, internal share
- Designed slides from an outline / blog / paper / brief
- One-off deck with a specific tone (editorial / swiss / playful / institutional / brutalist / retro)

❌ Not suitable
- Live collaborative editing (this is static HTML → static PPTX)
- Bulk auto-generated reports (decks here are hand-tuned, not template-filled in volume)
- 100% pre-existing PowerPoint that just needs cleanup (edit the .pptx directly)

## The six-step workflow

### Step 1 — Brief the deck

Ask the user, in one go (do NOT batch-fire questions):

> Two quick questions before I pick a template:
> 1. **What's the occasion?** (e.g. founder pitch, research synthesis, brand manifesto, classroom kickoff, data report, …)
> 2. **What mood / vibe do you want?** (e.g. confident & punchy, quiet & literary, warm & playful, dark & moody, clinical & technical, …)

Wait for the answer. Even if the brief seems obvious, ask. The user's *taste* always reveals something the brief alone hides.

If the user also gives raw content (outline, doc, paste), acknowledge it but don't start writing slides yet.

### Step 2 — Pick a template OR define a custom style

**Default path: pick three template candidates from the catalog.**

Read `index.json`. Match the user's occasion + mood against each template's `mood`, `tone`, `best_for`, `formality`. Pick **three** templates whose tones genuinely fit — and that differ from each other (e.g. one safe editorial pick, one warmer alternative, one wildcard re-interpretation).

For each candidate, clone its first slide (the cover) to `_previews/0N-<slug>.html` in the project workspace. Replace placeholder text with the user's actual deck title / subtitle / author / date — make the preview real, not generic. Keep sibling assets (`styles.css`, `deck-stage.js`, etc.) so the preview opens cleanly.

Open all three previews. (On macOS: `open <path>`. On other platforms: tell the user the file paths.) Send the user:

> Three options to compare:
> 1. **<Template A>** — <one-line tone description> · `_previews/01-<slug>.html`
> 2. **<Template B>** — <one-line tone description> · `_previews/02-<slug>.html`
> 3. **<Template C>** — <one-line tone description> · `_previews/03-<slug>.html`
>
> Which one feels right? (Or say "custom" if none fit and you'd rather define a bespoke style.)

Wait. Do not start the full deck until the user picks.

(Full picking heuristics in `references/template-selection.md`.)

**Custom-style path: if no template fits.**

If the user says "custom" / "none of these" / "I want something bespoke" — OR if the brief already includes a specific brand identity / specific palette / specific aesthetic that doesn't match any cataloged template — switch to the custom-style path documented in `references/custom-style.md`.

Ask the 5 minimum-viable questions in ONE round (palette / type stack / mood / decorations / brand assets). Wait for all answers. Write `<project>/deck/_design-spec.md` from the answers. From here on, the spec plays the same role for the deck that `design.md` plays for an embedded template — every subsequent step references it instead of an embedded template's design system.

The remaining steps (3 through 6) are identical regardless of which path you took.

### Step 3 — Plan the slide list

The user picked a template (or you wrote `_design-spec.md`). Before writing any HTML:

1. Save the user's raw content / outline to `<project>/deck/_outline.md`.
2. **Read the design system rulebook in full.**
   - Template path: read `<template-folder>/design.md` end-to-end. This is the rulebook — fonts, palette, decorative vocabulary, hero rhythm, image rules, hard constraints. Every later slide-writing decision references it.
   - Custom path: read `<project>/deck/_design-spec.md` — same role.
3. If the deck mentions a specific brand or product, run the brand asset protocol (`references/brand-protocol.md`) first — find the real logo, product photos, UI screenshots, colors. This is the single biggest quality lever; do not skip.
4. Build a slide table:

   | # | Layout | Headline | Body content | Image slot |
   |---|---|---|---|---|

   Use the narrative arc (Hook · Context · Core · Shift · Takeaway) from `references/content-splitting.md` if the user has no opinion on structure.

5. Share the table. Wait for OK before writing slide HTML.

### Step 4 — Build the deck

**Template path**: clone the picked template's folder into `<project>/deck/`. The user may rename this folder freely.

**Custom path**: clone the closest-in-spirit catalog template as a layout skeleton, then strip its `:root` colors and font imports and replace with the values from `_design-spec.md` (see `references/custom-style.md` for the "skeleton swap" pattern).

In both cases, for each slide in your approved table:
- Find the closest matching layout in the cloned template's existing slides.
- Duplicate it. Replace placeholder text + images with the user's content.
- If a needed layout doesn't exist, **design it in the active design system** — same fonts, same palette, same decorations, same rhythm (see `references/extending-templates.md`). Do not bail to a different template, do not mash layouts.
- Update page-number labels (`NN / TT`) as you add/remove slides.

For the `swiss` template specifically: every body slide MUST declare `data-layout="Sxx"` (S01–S22). Run `node assets/scripts/validate-deck.mjs <deck.html>` periodically.

For the `magazine` template: pick ONE of the 5 ink themes in `assets/templates/magazine/references/themes.md`. Do not mix themes mid-deck. Do not accept arbitrary user hex values.

Open the deck in the browser (`open <project>/deck/<file>.html`) and send the user the path mid-build (do not wait until the end). Iterate on tone before you iterate on layout.

### Step 5 — QA

Run through `references/checklist.md`. All P0 must pass; P1 should pass. Then open the deck and walk page-by-page in the browser. If anything makes you wince, fix it before export.

### Step 6 — Export

The user has three output formats available. Default to all three unless told otherwise.

**First-time setup** — copy the export scripts into your project workspace and install dependencies. The scripts must live alongside their `node_modules/` because Node ESM resolves dependencies relative to each script file.

```bash
cd <project>/deck/
mkdir -p ./scripts && cp <SKILL_ROOT>/assets/scripts/* ./scripts/
cd ./scripts && npm install && npx playwright install chromium && cd ..
```

Where `<SKILL_ROOT>` is the path to this skill folder on the user's machine.

**Then export:**

```bash
# PDF (always works, every template) — recommended default
node ./scripts/export-pdf.mjs --slides <deck.html or directory> --out deck.pdf

# PPTX (universal image-based fallback — works for every template)
node ./scripts/export-pptx-image.mjs --slides <deck.html or directory> --out deck.pptx

# PPTX (editable text) — ONLY if the chosen template has "pptx_editable": true in template.json
# AND the deck respects the 4 constraints in references/pptx-export-rules.md
node ./scripts/export-pptx-editable.mjs --slides <deck.html or directory> --out deck-editable.pptx
```

`--slides` accepts either a single-file deck (`./index.html` with `<section class="slide">` siblings) or a multi-file directory (`./slides/` with one `.html` per slide).

After export, open each output file (`open deck.pdf`, `open deck.pptx`) and verify it visually matches the HTML deck. Send the user the file paths.

## Cross-platform notes

This skill body uses platform-neutral phrasing:
- "Ask the user X" — works in any chat-based environment
- "Open the file at <path>" — user opens via shell (`open` on macOS, `start` on Windows, `xdg-open` on Linux)

There are no Claude-Code-specific tool calls in the workflow above. The same SKILL.md runs identically on Claude Code, Codex, and Claude Desktop.

## File map

```
ppt-design-slider/
├── SKILL.md                  ← you are here
├── README.md                 ← human-facing overview
├── NOTICES.md                ← third-party attribution (not advertised in workflow)
├── index.json                ← 36-design catalog
├── assets/
│   ├── templates/            ← 36 embedded templates (immutable; clone to project)
│   │   ├── magazine/         ← flagship
│   │   ├── swiss/            ← flagship
│   │   └── … (34 editorial)
│   └── scripts/              ← Node.js export pipeline
│       ├── build-index.mjs
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
    ├── custom-style.md       ← 5-question bespoke-design spec
    ├── catalog.md
    └── checklist.md
```

## Core principles

1. **Templates are closed visual systems.** Don't mash layouts from two templates. Don't substitute fonts. Don't introduce new colors.
2. **`design.md` (or `_design-spec.md`) is the rulebook.** Read it in full before writing slides. Every decision about font / color / decoration / spacing references the rulebook, not your instincts.
3. **Tone first, industry second.** A confident editorial deck can carry a tech talk if the user wants design-led tone. Match the user's *feeling*, not their industry.
4. **Brand assets > brand spec.** A real logo + real product photo + real UI screenshot identifies a brand far more strongly than a hex value list.
5. **One idea per slide.** Split competing ideas. Hero rhythm every 3-4 slides.
6. **Honest placeholders > clever fakes.** If the image isn't there, leave a labeled color block. Don't draw a wonky SVG.
7. **PDF is the lossless format.** Always ship PDF; PPTX is for downstream editing/presentation in PowerPoint.
