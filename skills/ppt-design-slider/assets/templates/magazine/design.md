# Magazine — Design System

Editorial deck with fluid WebGL background, serif headlines, and ink-toned palettes.
Reads like a print magazine spread.

## Visual identity

- **Headlines**: serif (Noto Serif SC + Playfair Display). Display sizes only.
- **Body**: sans-serif. Reading sizes only.
- **Metadata**: monospace. Page numbers, dates, attributions.
- **Background**: WebGL fluid effect, visible only on hero slides.
- **Decoration**: hairline rules + framed image captions. No drop shadows.
- **Icons**: Lucide. Never emoji.

## Theme palettes (5 presets — do not invent custom hex)

Open `references/themes.md`. Pick ONE palette for the entire deck. Do not mix:
1. 🖋 Ink Classic — universal default
2. 🌊 Indigo Porcelain — tech / research / data
3. 🌿 Forest Ink — nature / sustainability / culture
4. 🍂 Kraft Paper — humanist / literary / independent
5. 🌙 Dune — art / design / creative

The selected palette injects 6 CSS variables in `:root`: `--ink`, `--ink-rgb`, `--paper`,
`--paper-rgb`, `--paper-tint`, `--ink-tint`. The rest of the template uses `var(--*)` and
needs no further edits.

## Layout grammar (10 layouts)

Body slides pick from one of these 10 in `references/layouts.md`:
1. Cover · 2. Chapter break · 3. Data poster · 4. Quote + image
5. Image grid · 6. Pipeline · 7. Suspense closer · 8. Big quote
9. Before/After compare · 10. Lead image + side text

Paste, don't invent. See `references/components.md` for fonts, icons, callouts, stat-cards.

## Hero rhythm

Insert a hero (cover / chapter break / big quote) every 3-4 body slides. Continuous body
slides exhaust the eye.

## Image rules

- Standard ratios only (16:9 / 16:10 / 4:3 / 3:2 / 1:1)
- Image grid uses `height: Nvh`, not `aspect-ratio` (which can blow out)
- Don't use `align-self: end` on images — they drift to the page bottom

## QA

Open `references/checklist.md` before delivery. P0 items must all pass.
