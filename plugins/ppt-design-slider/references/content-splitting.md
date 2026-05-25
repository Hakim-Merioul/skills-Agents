# Splitting raw content into slides

The user gives you raw text — an outline, a doc, a stream-of-consciousness brief. Your job is to chunk it into N slides that fit the chosen template's layout grammar.

## Default narrative arc (use when user has no outline)

```
Hook       → 1 slide  : reversal / question / hard number that stops the reader
Context    → 1-2      : background / who you are / why this matters
Core       → 3-5      : main content, mix layouts (stat / text / image / pipeline)
Shift      → 1        : break expectation / new perspective
Takeaway   → 1-2      : punchline / open question / call to action
```

Page-count calibration:
- 15 min talk ≈ 10 slides
- 30 min talk ≈ 20 slides
- 45 min talk ≈ 25-30 slides

## Chunking rules

1. **One idea per slide.** If a chunk has two competing ideas, split.
2. **Match layout to content shape:**
   - Hard number → stat-card / KPI tower layout
   - Quote → quote/lead layout
   - List of 3-6 items → grid layout
   - Workflow / steps → pipeline / timeline layout
   - Before / After → split-compare layout
   - Image-driven → image-hero / image-grid
3. **Hero rhythm.** Every 3-4 slides, insert a hero (cover / chapter break / big quote). Continuous body-slides exhaust the eye.
4. **Light/dark rhythm** (for templates that support both schemes): no more than 3 same-scheme slides in a row.

## Drafting protocol

1. Save the user's outline as `_outline.md` in the project workspace.
2. Produce a slide table BEFORE writing HTML:
   | # | Layout | Headline | Body content | Image slot |
   |---|---|---|---|---|
3. Share the table with the user. Wait for OK.
4. Only then start writing each slide.

## Image handling

When the user has images:
- Save under `<project>/deck/images/`
- Name `NN-<semantic>.{jpg,png}` (e.g. `01-cover.jpg`, `03-team.jpg`)
- Standard ratios only: 16:9 / 16:10 / 4:3 / 3:2 / 1:1 / 21:9. Never use raw EXIF aspect ratios.

When the user has no images:
- Block out the layout with placeholder color blocks + labels.
- Tell the user which slots need images so they can supply them.
- Do not invent SVG illustrations to fill space.
