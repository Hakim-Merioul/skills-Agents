# PPTX export rules

Every deck delivers **two** outputs by default: `deck.pdf` (lossless vector) and
`deck.pptx` (native PowerPoint, double-click-editable). No exceptions — the
editable PPTX is never optional.

The image-based PPTX (every slide as a PNG inside a 16:9 PPTX) is a third,
**opt-in** output. Only produce it if the user explicitly asks for it. It is
redundant with the PDF for the typical use case and the export pipeline is more
failure-prone (one missed Playwright timing window and slides ship blank).

## Output 1 — `deck.pdf` (always works)

Via `export-pdf.mjs`. Vector text, lossless, every template. Recommended
delivery format for everything that doesn't need editing.

## Output 2 — `deck.pptx` (native PowerPoint, mandatory, editable)

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

The resulting deck doesn't reproduce gradients/WebGL backdrops exactly — but the
text is fully editable, every shape uses native PowerPoint primitives, and the
PDF is the design-faithful reference if the user wants to see the original.

See `references/editable-fallback.md` for the full skeleton + mapping guide.

## Hard rule — "no editable PPTX" is never a valid answer

`pptx_editable: false` means *"the auto HTML→PPTX converter can't preserve this
template's CSS"* — it does NOT mean *"an editable PPTX is impossible"*. The native
fallback always works.

**Never tell the user that editable PPTX is unavailable.** If the auto path fails,
build the native one. The editable PPTX must be offered and built by default for
every deck.

## Optional opt-in output — `deck-image.pptx`

If the user explicitly requests it (e.g. "give me the design-faithful PPTX
including the WebGL backdrop", or "I need a PPTX with the gradient preserved
exactly"), produce an image-based PPTX:

```
node scripts/export-pptx-image.mjs --slides index.html --out deck-image.pptx
```

Each slide is rendered as a PNG and embedded full-bleed. Pixel-perfect to the
HTML; text is NOT editable. **Do not produce this by default** — it's redundant
with the PDF and the export pipeline is more failure-prone than PDF+PPTX-editable.

## Routing decision

```
For every deck delivery, do BOTH of these:

deck.pdf   ← export-pdf.mjs
deck.pptx  ← if template.pptx_editable === true:
                 export-pptx-editable.mjs (auto HTML→PPTX)
             else:
                 customize build-editable-pptx-skeleton.mjs and run it
                 (native pptxgenjs)

Optional (only if the user asks):
deck-image.pptx  ← export-pptx-image.mjs (pixels, not editable)
```

## Slide-count sanity check (mandatory before delivery)

Both outputs must contain the same number of slides as the source HTML. Verify
after export and before handing over the files:

```bash
# Source slide count
grep -c 'class="slide' index.html

# PDF page count
mdls -name kMDItemNumberOfPages deck.pdf     # macOS
pdfinfo deck.pdf | grep Pages                 # Linux

# PPTX slide count
unzip -p deck.pptx ppt/presentation.xml | grep -c '<p:sldId '
```

If the PDF or PPTX has fewer slides than the source HTML, an export script
silently dropped content. Investigate before delivering. The most common cause
(fixed in v1.3.0) was the export scripts toggling `el.style.display = ''` on
templates that use `.slide { display: none } .slide.active { display: flex }` —
re-pull the scripts from `<SKILL_ROOT>/assets/scripts/` if you see this on an
older workspace.

## Curating `pptx_editable: true`

The flag controls only which build path is chosen (auto vs native). Setting it to
`true` requires confirming the HTML passes all four constraints. As of v1.3.0:
- 2 flagship templates: permanent `false` (WebGL backdrops)
- 34 editorial templates: most `false`, ~3-6 (Monochrome, Cartesian, Blue Professional,
  Long Table) could be flipped to `true` after a one-time audit.

Either way, every deck ships with an editable PPTX. The flag only changes how it's
built, not whether.
