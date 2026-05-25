# Brand asset protocol

When the deck represents a specific brand (DJI, Linear, Stripe, the user's own company, …), running this protocol is the single biggest quality lever. Skip it and the deck looks like every other AI-generated page.

## Trigger

The deck mentions a specific brand/product/company by name.

## Asset priority (resource > spec)

| asset | identifier weight | required for |
|---|---|---|
| **Logo** | highest | any brand |
| **Product photos / renders** | very high | physical-product brands |
| **UI screenshots** | very high | digital-product brands |
| Color values | medium | always nice |
| Type stack | low | always nice |

CSS silhouettes / hand-drawn SVG do **not** substitute real product imagery. They produce "generic tech animation" — black ground + orange accent + rounded rectangles — that any brand could be. Identifying the brand requires the brand's actual artifacts.

## Five steps (each has a fallback; never silently skip)

### Step 1 — Ask the user for everything at once

> "What do you have for <brand>? Listed in priority:
> 1. Logo (SVG / high-res PNG) — required for any brand
> 2. Product photos / official renders — required for physical products
> 3. UI screenshots — required for digital products
> 4. Color values (HEX / brand palette)
> 5. Type stack (display / body)
> 6. Brand guidelines PDF / Figma / brand URL
>
> Send what you have. I'll fetch the rest."

### Step 2 — Search official channels

- Logo: `<brand>.com/brand`, `/press`, `/press-kit`, inline `<svg>` in homepage
- Product photos: product detail page hero image, official press kit, launch-video frames (`yt-dlp` + `ffmpeg`)
- UI: App Store / Play Store screenshots, official screenshots section, demo video frames
- Colors: inline CSS / Tailwind config / brand PDF
- Type: `<link rel="stylesheet">` in homepage, Google Fonts loads

### Step 3 — Download with quality gates

**Logo:** any logo is better than no logo. Save to `assets/<brand>-brand/logo.svg` and `logo-white.svg`.

**Other assets (5-10-2-8 rule):** do 5 search rounds, gather 10 candidates, pick 2 best, each scoring ≥8/10. Better to ship fewer high-quality assets than pad with mediocre ones.

8/10 scoring axes (record in brand-spec.md):
- Resolution ≥ 2000px (≥ 3000px for large-screen / print)
- Source clarity: official > public domain > free stock > suspected stolen (0 if suspicious)
- Fits the brand's mood keywords
- Visual consistency with the other selected asset
- Independent narrative role (not just decoration)

### Step 4 — Validate

| asset | check |
|---|---|
| Logo | opens / two versions (dark+light bg) / transparent background |
| Product | ≥1 image at 2000px+ / clean background / multiple angles |
| UI | real resolution (1x/2x) / current version / no leaked user data |
| Color | `grep -hoE '#[0-9A-Fa-f]{6}' assets/<brand>-brand/*.{svg,html,css} \| sort \| uniq -c \| sort -rn \| head -20` |

Beware "demo brand pollution": when a screenshot of tool X shows a demo of brand Y, the colors in the screenshot belong to Y, not X.

### Step 5 — Write `brand-spec.md`

```markdown
# <Brand> · Brand Spec
> Collected: YYYY-MM-DD · Asset completeness: full / partial / inferred

## Core assets
### Logo
- main: assets/<brand>-brand/logo.svg
- white-bg: assets/<brand>-brand/logo-white.svg
- usage: <intro/outro/footer/global>

### Product photos (if physical)
- hero: assets/<brand>-brand/product-hero.png (2000×1500)
- detail: assets/<brand>-brand/product-detail-1.png
- scene: assets/<brand>-brand/product-scene.png

### UI screenshots (if digital)
- main: assets/<brand>-brand/ui-home.png
- features: assets/<brand>-brand/ui-feature-<name>.png

## Auxiliary
### Palette
- Primary: #XXXXXX <source>
- Background: #XXXXXX
- Ink: #XXXXXX
- Accent: #XXXXXX

### Type
- Display: <stack>
- Body: <stack>
- Mono: <stack>

### Signature details (the "120% details")
### Forbidden (colors / patterns brand specifically rejects)
### Mood (3-5 adjectives)
```

The HTML deck MUST reference these files via `<img src="assets/.../logo.svg">` and `var(--brand-primary)`. Do not redraw the logo. Do not approximate the color.

## Fallback table

| missing | action |
|---|---|
| Logo entirely unfindable | **Stop** and ask the user — logo is the identification root |
| Product photos for physical product | AI-generate via nano-banana-pro using official reference → ask user → honest placeholder ("Product image TBD") |
| UI screenshots for digital product | Ask the user to screenshot their own account → official demo video frames |
| Color values entirely unfindable | Switch to the "design-direction advisor" mode and recommend 3 directions with flagged assumptions |

## Cost vs cost-of-skipping

| | time |
|---|---|
| Run protocol correctly | logo 5m + 3-5 photos/UI 10m + colors 5m + write spec 10m = **30 min** |
| Skip and ship generic | 1-2 hours of rework or full redo |

For commissioned / launch / important-client decks this protocol pays for itself many times over.
