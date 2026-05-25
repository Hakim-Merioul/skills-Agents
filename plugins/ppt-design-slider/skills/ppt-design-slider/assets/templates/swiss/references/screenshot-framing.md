# Screenshot Framing Semantic Rules

For processing user-provided product screenshots, web screenshots, code screenshots, and design mockups into template-ratio image assets. The goal is a CleanShot X-style "screenshot centered + background fill + unified ratio" approach — not defaulting to GPT-M 2.0 for redrawing.

## Priority

1. **Programmatic adaptation first**: when screenshot content, text, and UI detail require fidelity, do not redraw; create a target-ratio canvas, proportionally scale the original screenshot, and place it in the canvas.
2. **GPT-M 2.0 only for reconstruction**: only use "screenshot redesign / UI context image" when the original is too long, too narrow, too cluttered, or needs UI contextualization or conceptual expression.
3. **Template slot first**: determine the slide layout and image slot ratio first, then decide the screenshot adaptation parameters.

## Ask before starting

In the main flow Step 1, whenever the user might provide screenshots, ask first:

- Which folder are the screenshots in? Do they include web pages, apps, code, dashboards, design mockups, or old PPTs?
- Should these screenshots be **displayed as-is**, **uniformly beautified**, **redesigned as UI context images**, or mixed treatment?
- Which slots will they go into: 21:9 top banner, 16:10 main image, 4:3 side image, 1:1 square, or multi-image grid?
- Must all text and data be preserved? Does any account information, avatar, or project name need to be hidden?
- Should the composition be centered, top-left, bottom-right, or automatically determined from page content?

Clarify through conversation; no specific tool calls needed.

## Processing pipeline

1. **Match layout first**: choose the template layout based on content; determine the screenshot slot size and ratio.
2. **Choose processing method**:
   - Needs fidelity: programmatic adaptation, do not redraw.
   - Needs visual unity without changing content: programmatic adaptation + theme background.
   - Original unusable or needs concept explanation: then use GPT-M 2.0 screenshot redesign.
3. **Choose background**: prefer built-in background assets; do not generate a new style for each screenshot on the fly.
4. **Composite screenshot last**: create target-ratio canvas, background covers it, proportionally scaled screenshot placed with `padding` and `alignment`.

Do not crop screenshot content by default. Only crop when the screenshot was regenerated to the target slot ratio, or when the user explicitly allows cropping.

## Semantic parameters

Before processing each screenshot, determine these 7 parameters:

| Parameter | Options | How to decide |
|---|---|---|
| `ratio` | `21:9` / `16:10` / `16:9` / `4:3` / `1:1` | Follow the template image slot; do not follow the original screenshot ratio |
| `background` | `plain` / `gradient` / `wallpaper` / `blurred` / `grid` / `paper` | Follow the current PPT style and theme |
| `padding` | `compact` / `standard` / `spacious` | Standard for normal screenshots; spacious for text-dense or tall screenshots; compact for small panel groups |
| `inset` | `none` / `subtle` / `balanced` | Use balanced when the screenshot needs to float above the background; Swiss style mostly uses none/subtle |
| `shadow` | `none` / `soft` / `editorial` | Style A: soft/editorial acceptable; Style B: none by default |
| `corners` | `square` / `small` / `medium` | Style B: square; Style A: small/medium |
| `alignment` | `center` / `top-left` / `top-right` / `bottom-left` / `bottom-right` | Follow page composition; not always centered |

## Style mapping

### Style A · Editorial magazine

- Background: `paper` / `blurred` / low-saturation `gradient`
- Texture: paper, ink, film grain, warm white, low contrast
- Screenshots: may use subtle rounding and light shadows, but must not look like SaaS marketing cards
- Background assets: prefer the 16:9 crop-safe WebP files in `assets/screenshot-backgrounds/style-a/` matching the current theme; crop to the target slot when compositing
- Recommended semantics:

```text
ratio:16:10, background:paper, padding:standard, inset:balanced, shadow:editorial, corners:small, alignment:center
```

### Style B · Swiss International Style

- Background: `plain` / `grid` / `dot-matrix`
- Color: only the current anchor color as a very low percentage accent; no large bright color blocks
- Screenshots: square corners, no shadows, no rounding, minimal hairlines or one top accent line
- Background assets: prefer the 16:9 crop-safe WebP files in `assets/screenshot-backgrounds/style-b/` matching the current theme accent; use only the current accent color; do not mix colors
- Recommended semantics:

```text
ratio:21:9, background:grid, padding:standard, inset:subtle, shadow:none, corners:square, alignment:center
```

## Background strength rules

Screenshot backgrounds are a "quiet base," not the main visual.

- If `alignment` is undecided, the center and all corners of the background must be quiet — no prominent color blocks.
- If the screenshot will be placed in the bottom-right corner, the bottom-right must not have a strong color block; the same applies for other positions.
- Swiss accent color should be only `5%-8%` visual occupancy as faint lines, dot matrix, or very light geometric fields — do not generate bright blue strips, large color blocks, or neon gradients.
- Background must not contain text, logos, icons, people, devices, borders, obvious subjects, or directional compositions.
- Background must be crop-safe: cropping to `21:9`, `16:10`, `4:3`, or `1:1` must not reveal "cropped" edges.

## Built-in theme background assets

This Skill includes a set of pre-generated GPT-M 2.0 backgrounds. **Prefer these assets** when processing screenshots — do not call GPT-M 2.0 in real time to generate a background. Only generate new backgrounds when the user explicitly requests a new style, the current theme is missing, or the background clearly does not match the content.

Background images are then reused programmatically for each screenshot. Do not treat background images as individual slides to draw; background images must not contain headings, footers, borders, logos, people, or obvious subjects.

### Style A · 5 theme backgrounds

| Theme | Built-in asset | Background semantics |
|---|---|---|
| Ink Classic | `assets/screenshot-backgrounds/style-a/monocle-classic.webp` | Black-white-grey paper texture, soft shadow, fine grain |
| Indigo Porcelain | `assets/screenshot-backgrounds/style-a/indigo-porcelain.webp` | Indigo low-saturation ink color, paper-feel gradient, light noise |
| Forest Ink | `assets/screenshot-backgrounds/style-a/forest-ink.webp` | Blurred plant shadow, low-saturation green, paper grain |
| Kraft Paper | `assets/screenshot-backgrounds/style-a/kraft-paper.webp` | Warm paper color, faint ink shadow, vintage print grain |
| Dune | `assets/screenshot-backgrounds/style-a/dune.webp` | Sandy/grey soft gradient, low contrast, quiet whitespace |

### Style B · 4 theme backgrounds

| Accent color | Built-in asset | Background semantics |
|---|---|---|
| IKB Blue | `assets/screenshot-backgrounds/style-b/ikb-dot-gradient.webp` | Dot matrix + low-contrast blue gradient; avoids bright blue blocks |
| Lemon Yellow | `assets/screenshot-backgrounds/style-b/lemon-grid.webp` | Pure grid + sparse dot matrix; yellow only as low-opacity thin lines/dots |
| Lemon Green | `assets/screenshot-backgrounds/style-b/lemon-green-dot-shadow.webp` | Dot matrix + shadow field; green only as subtle glow |
| Safety Orange | `assets/screenshot-backgrounds/style-b/safety-orange-halftone.webp` | Modular halftone dot matrix + dark shadow; orange at low occupancy |

All built-in backgrounds are 1920×1080 16:9 WebP files. When compositing programmatically, cover the background to the target canvas first, then crop to `21:9` / `16:10` / `4:3` / `1:1` screenshot slots. Backgrounds must have quiet corners since screenshots may be centered, top-left, bottom-right, or cropped to different sizes.

## Screenshot type decisions

| Original asset | Recommended processing |
|---|---|
| Regular web / app / desktop screenshot | Programmatic adaptation to target ratio |
| Product UI detail is critical | Programmatic adaptation; use `fit-contain`; do not redraw |
| Long web page screenshot | Crop the key area or split into 2-3 same-size panels |
| Extremely narrow / tall screenshot | Try `spacious + side alignment` first; if still too small, redesign |
| Code screenshot | Style A: paper-feel background; Style B: light grid background; text must be readable |
| UI context image for concept explanation | May use GPT-M 2.0 redesign |

## Background generation prompts

Only use this section when new background assets are needed. Do not generate backgrounds in real time for regular screenshot beautification — use the built-in assets above.

### Style A background

```text
16:9 crop-safe screenshot background for an editorial magazine / e-ink PPT system. Warm off-white paper texture, subtle ink wash, fine film grain, low contrast, quiet center and quiet corners, no text, no logo, no objects, no border, no focal subject. Suitable for cropping to 21:9, 16:10, 4:3, or 1:1.
```

### Style B background

```text
16:9 crop-safe screenshot background for a Swiss International Style PPT system. Pure off-white base, ultra-subtle 16-column grid and sparse dot matrix, one accent color only: [theme color], used at very low opacity as thin lines or tiny dots, no large bright color blocks. Quiet center and quiet corners, no text, no logo, no objects, no border, no focal subject. Suitable for cropping to 21:9, 16:10, 4:3, or 1:1.
```
