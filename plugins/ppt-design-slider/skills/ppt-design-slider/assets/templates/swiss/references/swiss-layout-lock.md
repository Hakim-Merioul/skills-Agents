# Swiss Layout Lock

This file defines the hard constraints for the Swiss theme. Its purpose is not to add inspiration, but to prevent generation from "looking Swiss while having already departed from the original template."

## Golden Source

Original reference file:

`<reference-deck.html>`

When generating for the Swiss theme, except when the user explicitly requests experimental layouts, only the 22 registered layouts below may be used. New cover/closing pages may use the IKB ASCII version from the Skill, but body slides must come from these 22 layouts.

## Hard Rules Before Generating

1. Every body slide must select a registered layout first, and write `data-layout="Sxx"` on `<section>`.
2. Inventing body structures like `P23/P24` that do not appear in the original 22 layouts is not allowed. When images are needed, prefer `S22 Image Hero` for a single image; for multiple images use the original `S15/S16` grid skeleton adapted into image grids — do not invent new evidence walls. The only registered interactive extension is `S08 + Swiss Map Component`; see `references/swiss-map-component.md`.
3. Top Chinese headings are left-aligned by default and placed on the top-left content axis. Except for original `S03/S09/S10` statement/split layouts, do not center a large heading horizontally on the page.
4. SVG handles only geometric lines, circles, arrows, and paths. Do not write visible text in SVG; all text labels go in HTML via grid, card, or caption elements.
5. Image slots and generated image aspect ratios must be bound together. Determine the layout and slot first, then generate the image.

## Registered Layouts

| ID | Original slide | Name | Skeleton to preserve | Image rule |
|---|---:|---|---|---|
| S01 | 01 | Index Cover | Three `cover-row` lines, large index on the left, large heading on the right | None |
| S02 | 02 | Vertical Timeline + KPI | Top left-aligned heading, middle `.timeline-v`, bottom `.kpi-row-4` | None |
| S03 | 03 | Split Statement | `.slide.split` dual half-screen, left giant text, right grey-background explanation | None |
| S04 | 04 | Six Cells | Top left-aligned heading, below `.sub-grid-3-2` six cards | May replace card interior with small icon; no large image |
| S05 | 05 | Three Layers | Top left-aligned heading, below `.stack-row` three large blocks | None |
| S06 | 06 | KPI Tower | Left heading + right description, below unequal-height KPI tower | None |
| S07 | 07 | Horizontal Bar | Left-aligned heading, horizontal bar chart | None |
| S08 | 08 | Duo Compare | `.duo-compare` two columns + center line | None; location/route content may use `S08 + Swiss Map Component` to replace the right-side slot |
| S09 | 09 | Dot Matrix Statement | Large statement + dot-matrix decoration | None |
| S10 | 10 | Split Closing | `.slide.split` left giant text / right list | None |
| S11 | 11 | Horizontal Timeline | Original `grid-template-columns:auto 1fr` header + `.timeline-h` | None |
| S12 | 12 | Manifesto + Ink Banner | Large statement + bottom full-width ink strip | None |
| S13 | 13 | Three Forces | Left ink hero block + right 3 cards | None |
| S14 | 14 | Loop Form | Left 4-step list + right geometric loop | SVG text forbidden; labels changed to HTML |
| S15 | 15 | Matrix + Hero Stat | Top left-aligned heading, middle 6×2 matrix, bottom giant number | Multi-image grid adaptation: unified `21:9` per group |
| S16 | 16 | Multi-card Brief | Top left-aligned heading, below 3×2 micro-cards | Multi-image card adaptation: unified `21:9` per group |
| S17 | 17 | System Diagram | Top small heading (left) + paragraph (right), middle geometric system diagram, bottom three-column explanation | SVG text forbidden; labels changed to HTML |
| S18 | 18 | Why Now | Three-column progression + bottom giant number | None |
| S19 | 19 | Four Cards | Top blue line + four equal columns | None |
| S20 | 20 | Stacked KPI Ledger | Vertical ledger-style giant numbers | None |
| S21 | 21 | Tech Spec Sheet | Large heading + three KPIs + bottom-right vertical bar matrix | None |
| S22 | 22 | Image Hero | Top full-width image + top-left white-block heading + bottom three-column KPIs | Main image generated at `21:9`; key subject in the central safe zone |

## Registered Extension Components

### S08 + Swiss Map Component

- Use case: geography, history, urban routes, store/campus/event locations, character residence relationships.
- Layout identity: still `data-layout="S08"` — not a new body slide.
- Page structure: top left-aligned heading + left relationship/description cards + right MapLibre map card.
- Marker structure: pin + connecting line + HTML card; SVG draws only fallback relationship lines, no text.
- Interaction controls: top-right must have `+` / `-` / `DRAG`; scroll zoom and drag pan are disabled by default to avoid triggering PPT page turns.
- Detailed code and data contract: see `references/swiss-map-component.md`.

## Image Slot Rules

### S22 · Hero Strip

- Generated ratio: `21:9`
- Image use: real scenes, product scenes, UI context images.
- Generation prompts must include: `21:9 ultra-wide strip`, `subject centered in the safe middle area`, `no title, no footer, no page chrome, no logo, no border`.
- HTML container must use the original S22 top full-width image skeleton; do not change it to an ordinary centered large image.
- Photos use `object-fit:cover;object-position:center 35%`. For portrait/meeting scenes, do not use `top center`.
- Infographics/UI screenshots placed in S22 must be regenerated close to `21:9` and use `object-fit:contain`, or ensure the core content is within the central 70% safe zone.

### S15/S16 · Multi Image Grid

- Generated ratio: unified `21:9` or unified `16:10` — do not mix.
- All images in the same group must have the same height, width, and container background.
- Image grids must snap to the original card grid; do not let images determine their own width/height.
- If images were regenerated to the `s15-grid-21x9` / `s16-brief-21x9` slot, the container must use `.frame-img.r-21x9` to fill the slot fully — do not add `.fit-contain` again, and do not use a fixed short `height:18vh` that shrinks long images.
- `.fit-contain` is only for user screenshots or text-dense images that must preserve the original ratio; once the decision to regenerate is made, generate to the slot ratio and fill it.
- If the original screenshot ratio is uncontrolled, first follow `references/screenshot-framing.md` for programmatic ratio adaptation; only use GPT-M 2.0 to regenerate a "screenshot redesign" for very long, very narrow, or information-restructuring cases.

## Prohibition List

- Forbidden: `text-align:center` on top-level Chinese large headings.
- Forbidden: writing the top heading in the right `7.8fr` column, causing visual centering.
- Forbidden: unregistered body slides — e.g. ad hoc `Swiss Image Split`, `Evidence Grid`, or self-drawn three-circle pages.
- Forbidden: grey-background container wrapping a white-background infographic.
- Forbidden: `<text>` in SVG used as visible labels.
- Forbidden: `object-position:top center` on photos by default.
