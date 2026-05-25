# PPTX export rules

Every deck delivers **three** outputs: `deck.pdf` (lossless), `deck.pptx` (image-based,
universal), and `deck-editable.pptx` (native PowerPoint, double-click-editable). No
exceptions — the editable PPTX is never optional.

## Output 1 — `deck.pdf` (always works)

Via `export-pdf.mjs`. Vector text, lossless, every template. This is the recommended
delivery format.

## Output 2 — `deck.pptx` (image-based, universal)

Via `export-pptx-image.mjs`. Each slide rendered as PNG, embedded full-bleed in a 16:9
PPTX. Design-faithful (gradients, WebGL, ornaments all preserved exactly). Text is
pixels, not editable.

**Use when:** the user needs the deck inside PowerPoint for presenting (slide-numbering,
speaker notes UI, projector-mode) but doesn't need to edit text.

## Output 3 — `deck-editable.pptx` (native PowerPoint, mandatory)

Routes by `template.json`:

### Path (a) — `pptx_editable: true` → use `export-pptx-editable.mjs`

The auto HTML→PPTX converter via pptxgenjs. Converts DOM elements to native shapes
and text boxes.

**Four hard constraints on the HTML** (any violation breaks the auto-conversion):
1. All visible text lives inside `<p>` / `<h1>`–`<h6>`. A `<div>` cannot contain raw text directly.
2. No CSS gradients (`linear-gradient`, `radial-gradient`).
3. `<p>` and `<h*>` elements cannot have `background`, `border`, or `box-shadow`. Wrap them in a `<div>` with those styles instead.
4. `<div>` elements cannot use `background-image`. Use an `<img>` tag instead.

The HTML `<body>` width × height must match the PowerPoint layout (default `960pt × 540pt`).
The converter throws on mismatch or overflow.

### Path (b) — `pptx_editable: false` → build natively via pptxgenjs

For the ~30 templates where the auto-converter can't handle the CSS, the agent
**writes a deck-specific `build-editable-pptx.mjs`** starting from the skeleton at
`<SKILL_ROOT>/assets/scripts/build-editable-pptx-skeleton.mjs`.

The script uses pptxgenjs primitives directly:
- `pptx.addSlide()` per slide
- `slide.addText()` for every text element (pulling fontFace/fontSize/color from the template's `design.md`)
- `slide.addShape(pptx.ShapeType.rect | line | ellipse | ...)` for layout blocks, hairlines, badges, dot grids
- `slide.addTable(rows, options)` for KPI ledgers
- `slide.addImage({ path })` for hero images, logos, photos

The resulting deck doesn't reproduce gradients/WebGL backdrops exactly — the image
PPTX serves that purpose. The editable PPTX exists so the user can EDIT the deck
inside PowerPoint. Every line of text is double-click-editable.

See `references/editable-fallback.md` for the full skeleton + mapping guide.

## Hard rule — "no editable PPTX" is never a valid answer

`pptx_editable: false` means *"the auto HTML→PPTX converter can't preserve this
template's CSS"* — it does NOT mean *"an editable PPTX is impossible"*. The native
fallback always works.

**Never tell the user that editable PPTX is unavailable.** If the auto path fails,
build the native one. If the user only wants the image-based PPTX, they'll say so —
but the editable variant must be offered and built by default.

## Routing decision

```
For every deck delivery, do all THREE:

deck.pdf            ← export-pdf.mjs
deck.pptx           ← export-pptx-image.mjs

deck-editable.pptx  ← if template.pptx_editable === true:
                          export-pptx-editable.mjs (auto HTML→PPTX)
                      else:
                          customize build-editable-pptx-skeleton.mjs and run it
                          (native pptxgenjs)
```

## Curating `pptx_editable: true`

The flag controls only which build path is chosen (auto vs native). Setting it to
`true` requires confirming the HTML passes all four constraints. As of v1.2.0:
- 2 flagship templates: permanent `false` (WebGL backdrops)
- 34 editorial templates: most `false`, ~3-6 (Monochrome, Cartesian, Blue Professional,
  Long Table) could be flipped to `true` after a one-time audit.

Either way, every deck ships with an editable PPTX. The flag only changes how it's
built, not whether.
