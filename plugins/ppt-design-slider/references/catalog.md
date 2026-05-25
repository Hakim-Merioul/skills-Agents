# Template catalog (human-readable)

For the machine-readable version, see `../index.json`.

## Flagship templates (2)

The flagship tier is a pair of themed mega-templates. Each ships its own layout grammar
(10 and 22 named layouts respectively), motion system, theme palettes, and validator.

| slug | name | mood | best for |
|---|---|---|---|
| `magazine` | Magazine | editorial, warm, humanist | industry talks, founder pitches, thoughtful launches |
| `swiss` | Swiss | minimal, structured, technical | product launches, KPI reports, engineering shares |

## Editorial tier (34)

The editorial tier is 34 single-aesthetic decks. Each has its own font stack + palette +
decorative vocabulary tuned for a specific tone. Group them by feel:

### Warm + editorial
- `soft-editorial` — Cormorant Garamond on warm paper, sage/blush/lemon
- `editorial-forest` — forest green + dusty pink + warm cream
- `cartesian` — quiet warm-neutrals, classical Playfair
- `daisy-days` — pastel + daisies + soft warmth
- `playful` — sun-warm peach + Syne display
- `coral` — cream + coral on near-black, oversized Bebas Neue
- `pin-and-paper` — yellow paper with safety-pins and ink-blue handwriting
- `sakura-chroma` — Japanese cassette aesthetic with diagonal rainbow ribbons

### Confident + modern
- `neo-grid-bold` — neo-brutalist, single neon-yellow accent
- `cobalt-grid` — electric cobalt italic on graph paper
- `blue-professional` — cream + electric cobalt, clean
- `block-frame` — pastel-neon blocks with chunky black borders
- `raw-grid` — neo-brutalist, thick borders, pink/sage/ink
- `emerald-editorial` — emerald + navy + paper, double-rule masthead
- `bold-poster` — Shrikhand + fire-engine red

### Dark / nocturnal
- `pink-script` — black + hot pink + Instrument Serif
- `studio` — black canvas + electric yellow type
- `vellum` — deep navy + warm-yellow italic Cormorant
- `broadside` — dark canvas + fire-orange accent, bilingual Latin/Chinese
- `mat` — dark sage + bone paper + burnt orange
- `grove` — forest green canvas, cream type, rust accent
- `signal` — deep navy + bone paper + muted gold

### Playful / retro
- `8-bit-orbit` — pixel-art neon arcade on navy void
- `retro-windows` — Windows 95 chrome, MS Sans Serif
- `retro-zine` — beige paper + green accent, Bebas Neue + Caveat, riso-printed feel
- `scatterbrain` — post-it notes + Caveat handwriting
- `creative-mode` — cream paper + multi-color accents + Archivo Black
- `stencil-tablet` — bone paper + stencil headlines + earth palette
- `capsule` — modular pill-cards on warm bone + pastel-pop

### Editorial / institutional
- `editorial-tri-tone` — dusty pink + mustard cream + deep burgundy
- `monochrome` — ivory ledger paper, all-black Lora + Jost
- `biennale-yellow` — solar yellow + warm parchment + indigo serif
- `long-table` — warm cream + rust-red supper-club, italic Fraunces

### Civic / activist
- `peoples-platform` — blue + orange + red on cream, Alfa Slab + Caveat Brush

## Browsing inside a project

When you copy a template to a project, the user can rename the folder freely. The skill workflow always references templates by the **slug** in `index.json`, not by the folder name in the project.

## Custom style (no template fits)

If none of the 36 catalog entries match, the skill switches to the custom-style path —
the user answers 5 minimum-viable questions and the skill writes a `_design-spec.md` in
the project workspace that the deck is then built against. See
`references/custom-style.md` for the full questionnaire + spec template.
