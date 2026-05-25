# Editable PPTX — the mandatory fallback

## The rule

**Every deck ships with an editable PPTX.** No exceptions.

When `template.json` has `"pptx_editable": false`, that means *"the automatic HTML→PPTX
conversion can't preserve this template's CSS"* — it does NOT mean *"editable PPTX is
impossible"*. It only rules out the lazy auto-conversion path.

For these templates, you build a **native editable PPTX from scratch** using
`pptxgenjs` directly. You read the deck's content, the template's `design.md`, and
emit a deck composed of native PowerPoint primitives (`addText`, `addShape`,
`addTable`, `addImage`). Every line of text becomes a double-click-editable
PowerPoint text box.

**Never tell the user that an editable PPTX is unavailable without first offering
or creating this native `pptxgenjs` fallback.**

## When to use which exporter

```
template.json says pptx_editable: true
                                │
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
   export-pdf.mjs                          export-pptx-editable.mjs
   → deck.pdf                              → deck.pptx (auto HTML→PPTX)

template.json says pptx_editable: false
                                │
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
   export-pdf.mjs                          build-editable-pptx.mjs  ←  THIS FILE
   → deck.pdf                              → deck.pptx (native pptxgenjs from scratch)
```

In BOTH cases, the user receives TWO outputs: `deck.pdf` and `deck.pptx`. The
PPTX is always editable.

(`export-pptx-image.mjs` exists but is opt-in only — see `pptx-export-rules.md`.)

## How to build the native editable PPTX

The agent writes a deck-specific script at `<project>/deck/scripts/build-editable-pptx.mjs`.
Start from the skeleton at `<SKILL_ROOT>/assets/scripts/build-editable-pptx-skeleton.mjs`
and adapt to the deck's content.

### Skeleton pattern

```javascript
import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();
pptx.defineLayout({ name: 'CUSTOM_16x9', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_16x9';

// Read these from <template-folder>/design.md
const DESIGN = {
  paper: 'F2EFE6',       // hex without #
  ink: '0F0F0F',
  accent: 'F06CA8',
  fontDisplay: 'DM Serif Display',
  fontBody: 'Inter',
  fontMono: 'JetBrains Mono',
};

// Slide 1 — cover
const cover = pptx.addSlide();
cover.background = { color: DESIGN.paper };

cover.addText('A Magazine-Style Deck', {
  x: 0.8, y: 1.2, w: 11.7, h: 2.5,
  fontFace: DESIGN.fontDisplay, fontSize: 64, bold: false,
  color: DESIGN.ink,
});

cover.addText('Built for the modern founder.', {
  x: 0.8, y: 4.5, w: 11.7, h: 0.8,
  fontFace: DESIGN.fontBody, fontSize: 18,
  color: DESIGN.ink,
});

cover.addShape(pptx.ShapeType.rect, {
  x: 0.8, y: 6.5, w: 0.5, h: 0.05,
  fill: { color: DESIGN.accent }, line: { type: 'none' },
});

// Slide 2 — section break
const section = pptx.addSlide();
section.background = { color: DESIGN.ink };
section.addText('01 / Chapter One', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.5,
  fontFace: DESIGN.fontMono, fontSize: 12,
  color: DESIGN.accent,
});
section.addText('The story begins where the numbers end', {
  x: 0.8, y: 2.8, w: 11.7, h: 2.0,
  fontFace: DESIGN.fontDisplay, fontSize: 48,
  color: DESIGN.paper,
});

// ... repeat per slide

await pptx.writeFile({ fileName: '../deck.pptx' });
console.log('✓ Wrote deck.pptx');
```

### Mapping rules

| HTML element | pptxgenjs equivalent |
|---|---|
| `<h1>`, `<h2>`, `<p>` | `slide.addText(...)` with appropriate fontSize |
| `<div>` background block | `slide.addShape(pptx.ShapeType.rect, ...)` |
| `<svg>` simple shapes | `slide.addShape(pptx.ShapeType.ellipse | line | triangle | ...)` |
| Tables | `slide.addTable(rows, options)` |
| `<img>` | `slide.addImage({ path: '...' })` |
| Decorative borders | `pptx.ShapeType.line` with stroke |

Don't try to reproduce gradients, WebGL backdrops, or complex SVG ornaments — the
editable deck is for editing, not for visual fidelity. The PDF is the
design-faithful reference.

### Pull values from design.md

The template's `design.md` is the source of truth. Read it BEFORE writing the script:
- Colors → use the hex values declared in the design.md palette section
- Fonts → use the exact font-family declarations
- Spacing → match the margins/gaps the design.md describes
- Hierarchy → respect the type-scale tokens (display / lead / body / micro)

## Verification step (mandatory)

After generating both outputs (PDF + editable PPTX), run:

```bash
node <SKILL_ROOT>/assets/scripts/verify-deck.mjs --html <project>/deck/index.html
```

The verifier checks:

| Check | Failure mode |
|---|---|
| Each slide content fits its viewport | `overflow detected on slide N: <element> extends Xpx beyond container` |
| No two text elements visually overlap | `overlap on slide N: <elementA> overlaps <elementB>` |
| Headlines preserve their line breaks (no auto-flow into a single line) | `line break lost on slide N <h1>: expected <br>, got single line` |
| Every `var(--*)` in CSS resolves to a value declared in `:root` (no undeclared variables) | `undeclared CSS var on slide N: var(--missing) has no fallback` |
| Required text (deck title, page numbers) is present | `missing required text on slide N: <expected>` |

If verification fails, fix the HTML and re-run before delivery. Do NOT ship a deck
with verification errors.

After exporting, ALSO verify slide counts match between source HTML, PDF, and PPTX
(see `pptx-export-rules.md` → "Slide-count sanity check"). This catches the failure
mode where the export script silently dropped slides.

## Delivery

When you tell the user the deck is ready, list both outputs:

```
✓ deck.pdf   — lossless vector reference
✓ deck.pptx  — native PowerPoint, fully editable
```

Tell the user explicitly:

> Open `deck.pptx` in PowerPoint — every text element is double-click-editable.
> `deck.pdf` is the lossless reference if you want to share the design as-is.

Never deliver only the PDF without offering the editable PPTX. The editable PPTX
is part of the default deliverable, not an extra.
