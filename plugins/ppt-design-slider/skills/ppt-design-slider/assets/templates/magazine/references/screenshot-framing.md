# Screenshot Framing Rules

Used to process product screenshots, web screenshots, code screenshots, and design-file screenshots provided by the user into image assets that conform to the template's aspect ratios. The goal is a CleanShot X-style "centered screenshot + background fill + unified ratio" — not defaulting to GPT-M 2.0 to redraw the screenshot.

## Priority

1. **Programmatic adaptation first**: When the screenshot content, text, and UI details need to be faithfully preserved, do not redraw — create a target-ratio canvas and place the original screenshot scaled proportionally into it.
2. **GPT-M 2.0 is for reconstruction only**: Only use "screenshot redesign / UI scene image" when the original is too tall, too narrow, too cluttered, or needs UI contextualization or conceptual visualization.
3. **Template slot first**: Determine the slide layout and image slot ratio before deciding on the screenshot adaptation parameters.

## Ask First

In main flow Step 1, whenever the user may be providing screenshots, clarify the following upfront:

- Where are the screenshots? Do they include web pages, apps, code, dashboards, design files, or old PPT slides?
- Should this batch be **faithfully displayed**, **uniformly beautified**, **redesigned as UI scene images**, or processed with a mix of approaches?
- Which slots will they go into: 21:9 top banner, 16:10 main image, 4:3 side image, 1:1 square, or a multi-image grid?
- Must all text and data be preserved? Does any account name, avatar, or project name need to be hidden?
- Should the composition be centered, top-left, bottom-right, or determined automatically based on page content?

Clarify through conversation — no specific tool call needed.

## Processing Chain

1. **Match the layout first**: Based on the content, select a template layout and determine the screenshot slot size and ratio.
2. **Then choose the processing approach**:
   - Needs to be faithful: programmatic adaptation — do not redraw the screenshot.
   - Needs visual unification without changing content: programmatic adaptation + theme background.
   - Original is unusable or needs conceptual explanation: proceed to GPT-M 2.0 screenshot redesign.
3. **Then choose the background**: Prioritize built-in background assets — do not generate a new style on the fly for each screenshot.
4. **Finally composite the screenshot**: Create a target-ratio canvas, cover the background to fill, then place the proportionally scaled screenshot into the canvas at the specified `padding` and `alignment`.

Do not crop screenshot content by default. Only use cover-cropping when the screenshot was regenerated to the target slot specifically, or when the user explicitly allows cropping.

## Semantic Parameters

Before processing each screenshot, determine these 7 parameters:

| Parameter | Options | How to Decide |
|---|---|---|
| `ratio` | `21:9` / `16:10` / `16:9` / `4:3` / `1:1` | Follow the template image slot — do not follow the original screenshot ratio |
| `background` | `plain` / `gradient` / `wallpaper` / `blurred` / `grid` / `paper` | Follow the current PPT style and palette |
| `padding` | `compact` / `standard` / `spacious` | Standard for regular screenshots; spacious for text-dense or tall screenshots; compact for small panel groups |
| `inset` | `none` / `subtle` / `balanced` | Use balanced when the screenshot needs to float above the background; Swiss style prefers none/subtle |
| `shadow` | `none` / `soft` / `editorial` | Style A can use soft/editorial; Style B defaults to none |
| `corners` | `square` / `small` / `medium` | Style B: square; Style A: small/medium |
| `alignment` | `center` / `top-left` / `top-right` / `bottom-left` / `bottom-right` | Follow the page composition — not always centered |

## Style Mapping

### Style A · Digital Magazine Style

- Background: `paper` / `blurred` / low-saturation `gradient`
- Texture: paper, ink, film grain, warm white, low contrast
- Screenshots: light rounded corners and gentle shadows are acceptable — but should not look like SaaS marketing cards
- Background assets: prioritize `assets/screenshot-backgrounds/style-a/` — use the crop-safe 16:9 WebP for the matching palette, then crop to the slot ratio during compositing
- Recommended semantics:

```text
ratio:16:10, background:paper, padding:standard, inset:balanced, shadow:editorial, corners:small, alignment:center
```

### Style B · Swiss International Style

- Background: `plain` / `grid` / `dot-matrix`
- Color: only the current anchor color as a very low-proportion accent — no large bright color blocks
- Screenshots: square corners, no shadows, no rounded corners, sparse hairlines or a top accent line
- Background assets: prioritize `assets/screenshot-backgrounds/style-b/` — use the crop-safe 16:9 WebP for the current theme color; use only the current accent, no mixed colors
- Recommended semantics:

```text
ratio:21:9, background:grid, padding:standard, inset:subtle, shadow:none, corners:square, alignment:center
```

## Background Intensity Rules

The screenshot background is a "quiet base" — not a primary visual.

- If `alignment` is uncertain, the background center and all four corners must be quiet — no prominent color blocks.
- If the screenshot is placed at the bottom-right, the bottom-right corner must not have strong color blocks; same applies to other positions.
- Swiss accent color should only occupy `5%–8%` of the visual area as faint lines, dot matrices, or very light geometric patterns — do not generate bright blue strips, large color blocks, or neon gradients.
- The background must contain no text, logos, icons, people, devices, borders, prominent subjects, or directional compositions.
- The background must be crop-safe: cropping to `21:9`, `16:10`, `4:3`, or `1:1` must not reveal any sign of "being cropped."

## Built-In Theme Background Assets

This skill includes a set of GPT-M 2.0 pre-generated backgrounds. **Prioritize these assets** when processing screenshots — do not call GPT-M 2.0 in real time to generate new backgrounds. Only generate a new background when the user explicitly requests a new style, the current palette is missing, or the background clearly does not match the content.

Background images are reused programmatically across all screenshots. Do not treat a background image as a standalone slide — the background image must contain no titles, footers, borders, logos, people, or prominent subjects.

### Style A · 5 Theme Backgrounds

| Palette | Built-in Asset | Background Semantic |
|---|---|---|
| Ink Classic | `assets/screenshot-backgrounds/style-a/monocle-classic.webp` | Black/white/grey paper texture, soft shadows, fine grain |
| Indigo Porcelain | `assets/screenshot-backgrounds/style-a/indigo-porcelain.webp` | Indigo low-saturation ink tone, paper-feel gradient, light noise |
| Forest Ink | `assets/screenshot-backgrounds/style-a/forest-ink.webp` | Blurred plant shadow, low-saturation green, paper grain |
| Kraft Paper | `assets/screenshot-backgrounds/style-a/kraft-paper.webp` | Warm paper tone, faint ink shadows, vintage print grain |
| Dune | `assets/screenshot-backgrounds/style-a/dune.webp` | Sand/grey soft gradient, low contrast, quiet and airy whitespace |

### Style B · 4 Theme Backgrounds

| Accent Color | Built-in Asset | Background Semantic |
|---|---|---|
| IKB Blue | `assets/screenshot-backgrounds/style-b/ikb-dot-gradient.webp` | Dot matrix + low-contrast blue gradient — avoids bright blue blocks |
| Lemon Yellow | `assets/screenshot-backgrounds/style-b/lemon-grid.webp` | Pure grid + sparse dot matrix — yellow used only as low-opacity thin lines/dots |
| Lime Green | `assets/screenshot-backgrounds/style-b/lemon-green-dot-shadow.webp` | Dot matrix + shadow field — green used only as faint luminosity |
| Safety Orange | `assets/screenshot-backgrounds/style-b/safety-orange-halftone.webp` | Modular halftone dot matrix + dark shadow — orange at low proportion |

All built-in backgrounds are 1920×1080 16:9 WebP. During programmatic compositing, cover the background to the target canvas, then crop to `21:9` / `16:10` / `4:3` / `1:1` as required by the screenshot slot. Backgrounds must be quiet in all four corners, because screenshots may be centered, top-left, bottom-right, or cropped to different sizes.

## Screenshot Type Decision Guide

| Original Asset | Recommended Treatment |
|---|---|
| Regular webpage / app / desktop screenshot | Programmatic adaptation to target ratio |
| Product UI detail is important | Programmatic adaptation with `fit-contain` — do not redraw |
| Long webpage screenshot | Crop to the key area or break into 2–3 same-size panels |
| Very narrow / very tall screenshot | Try `spacious + side alignment` first; if still too small then redesign |
| Code screenshot | Style A: paper-textured background; Style B: light grid background; text must remain readable |
| UI scene image for conceptual explanation | Can use GPT-M 2.0 to redesign |

## Background Generation Prompts

Only use this section when new background assets need to be added. Do not generate backgrounds in real time for regular screenshot framing — use the built-in assets above instead.

### Style A Background

```text
16:9 crop-safe screenshot background for an editorial magazine / e-ink PPT system. Warm off-white paper texture, subtle ink wash, fine film grain, low contrast, quiet center and quiet corners, no text, no logo, no objects, no border, no focal subject. Suitable for cropping to 21:9, 16:10, 4:3, or 1:1.
```

### Style B Background

```text
16:9 crop-safe screenshot background for a Swiss International Style PPT system. Pure off-white base, ultra-subtle 16-column grid and sparse dot matrix, one accent color only: [theme color], used at very low opacity as thin lines or tiny dots, no large bright color blocks. Quiet center and quiet corners, no text, no logo, no objects, no border, no focal subject. Suitable for cropping to 21:9, 16:10, 4:3, or 1:1.
```
