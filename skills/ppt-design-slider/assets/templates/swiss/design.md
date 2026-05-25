# Swiss — Design System

International Typographic-style deck. Strict 12-col grid. 22 locked body layouts.

## Visual identity

- **Type**: sans-serif only (Inter, Helvetica, Noto Sans SC). Any serif = wrong.
- **Display weight**: 200 (extra-light) at large sizes. Smaller text gets heavier
  weight (16px body = 400+ minimum). Never use weight 600/700/800 at hero sizes.
- **Accent**: ONE color per deck. Pick from: IKB blue, lemon yellow, lime, safety orange.
  Mixing multiple accents = visual incoherence.
- **Geometry**: right angles only. No gradients, no shadows, no `border-radius`.
- **Decoration**: hairlines, dot matrices, small `8×8` solid squares. No round dots.
- **Icons**: Lucide. Angular variants. Never emoji.

## Locked layouts (S01–S22)

Body slides MUST declare `data-layout="Sxx"` matching one of these:

S01 Cover · S02 Vertical timeline + KPI · S03 Split statement · S04 Six cells
S05 Three layers · S06 KPI tower · S07 H-bar chart · S08 Duo compare
S09 Dot-matrix statement · S10 Split closing · S11 Horizontal timeline
S12 Manifesto + ink banner · S13 Three forces · S14 Loop · S15 Matrix + hero stat
S16 Multi-card brief · S17 System diagram · S18 Why now · S19 Four cards
S20 Stacked KPI ledger · S21 Tech spec · S22 Image hero

See `references/swiss-layout-lock.md` (read first) and `references/layouts-swiss.md` for
paste-ready blocks. Do NOT invent new layouts (e.g. P23/P24) without explicit user request.

## Hard rules (any violation breaks the style)

1. Sans-serif only — no `--serif` CSS variable usage anywhere.
2. ONE accent color in the entire deck.
3. No `border-radius`, no `box-shadow`, no `linear-gradient` (rule hairlines excepted).
4. Display text uses double-clamp: `font-size: min(Xvw, Yvh)`. Single-clamp will overflow.
5. Card fill types are exclusive: `card-ink` / `card-accent` / `card-fill` / `card-outlined`.
   Don't mix on the same slide.
6. Helvetica/Inter must fall back to `"Microsoft YaHei UI", "Noto Sans SC"` for Chinese
   on Windows (where 苹方 is absent).
7. Body min font sizes for projection: 18px body / 16px captions / 14px meta. Don't
   compress smaller to fit content — split the slide instead.

## Map component (S08 extension)

If the deck needs locations, routes, or city relationships, the S08 layout has a
MapLibre-based component documented in `references/swiss-map-component.md`. Use it
instead of inventing geographic SVG.

## Low-power mode

Press `B` during presentation to drop to a static mode (kills WebGL/canvas RAF, cancels
in-flight animations). Required for low-spec projection.

## Validation

Run `node assets/scripts/validate-deck.mjs <deck.html>` before delivery. Zero errors required.
See `references/checklist.md` for full P0/P1/P2/P3 list.
