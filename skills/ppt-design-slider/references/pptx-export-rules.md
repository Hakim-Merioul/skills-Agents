# PPTX export rules

The skill ships two PPTX exporters. Pick the right one for the template + use case.

## Editable PPTX (`export-pptx-editable.mjs`)

Converts HTML DOM elements into native PowerPoint shapes/text-boxes via pptxgenjs. The user can double-click to edit text inside PowerPoint.

**Use when:**
- `template.json` has `"pptx_editable": true`, AND
- The user explicitly wants editable text in the final deck.

**Four hard constraints on the HTML** (any violation breaks the export):
1. All visible text lives inside `<p>` / `<h1>`–`<h6>`. A `<div>` cannot contain raw text directly.
2. No CSS gradients (`linear-gradient`, `radial-gradient`).
3. `<p>` and `<h*>` elements cannot have `background`, `border`, or `box-shadow`. Wrap them in a `<div>` with those styles instead.
4. `<div>` elements cannot use `background-image`. Use an `<img>` tag instead.

Templates marked `pptx_editable: false` (most of the 36) cannot pass these constraints because their visual identity depends on gradients, decorative SVG, paper textures, or border-on-text effects. Don't try to coerce them.

**Body dimensions must match:** the HTML `<body>` width × height must equal the PowerPoint layout (default `960pt × 540pt` = 16:9 wide). The script throws if they don't match or if content overflows.

## Image-based PPTX (`export-pptx-image.mjs`)

Renders each slide HTML to a 1920×1080 PNG via Playwright, embeds it full-bleed in a 16:9 PPTX slide.

**Use when:**
- The template uses gradients, SVG ornaments, WebGL backgrounds, paper textures, or any of the visual features that break editable export.
- OR the user only needs PPTX for "show + slide-numbering in PowerPoint", not for downstream text editing.

**Trade-off:** the text in the output PPTX is pixels, not text. Editing requires going back to the HTML source and re-exporting.

## Default routing

In the skill's workflow:

```
if (template.pptx_editable === true && user_wants_editable_text) {
  use export-pptx-editable.mjs
} else {
  use export-pptx-image.mjs   // universal fallback
}
```

Always offer PDF too via `export-pdf.mjs` — it's the lossless format and works for every template.

## Curating `pptx_editable: true`

After Task 6 (this), do a one-time human audit of the 34 beautiful templates:
- Open the template in a browser.
- Check the HTML against the four constraints above.
- Set `pptx_editable: true` only if it passes all four.

Expected outcome: ~3-6 of the 34 templates qualify (mostly Monochrome, Cartesian, Blue Professional, Long Table, and similarly-restrained designs). The other ~28 stay on image-based export.

Magazine and Swiss (guizang) are `pptx_editable: false` permanently — their WebGL backgrounds and shader canvases cannot be PPTX-native.
