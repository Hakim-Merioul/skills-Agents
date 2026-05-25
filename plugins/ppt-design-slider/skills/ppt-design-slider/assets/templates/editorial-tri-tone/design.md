---
version: alpha
name: Editorial Tri-Tone
description: A literary magazine-meets-annual-report presentation system built on a strict three-color palette — blush pink, golden butter, and deep burgundy wine. Despite having eleven CSS variable names, only three hex values exist in the entire system; every alias is a semantic rename of one of those three. Headlines run Bricolage Grotesque (a variable grotesque with an optical-size axis) at extreme weights and negative letter-spacing. Instrument Serif (italic-cut only) appears as the expressive accent face for chapter numerals, pull-quotes, years, and signatures. JetBrains Mono carries all metadata, labels, and section markers at tight uppercase tracking. The aesthetic is "independent arts publication" — the kind with a colophon, hand-numbered editions, and an editorial desk.

colors:
  pink: "#F2B6C6"
  butter: "#F2D86A"
  burgundy: "#7A1F35"

color-aliases:
  pink-deep: pink
  sky: pink
  cream: butter
  lime: butter
  terracotta: butter
  navy: burgundy
  forest: burgundy
  ink: burgundy

typography:
  display-wordmark:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 300px
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: -0.04em
  display-closer:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 320px
    fontWeight: 700
    lineHeight: 0.82
    letterSpacing: -0.05em
  display-stat:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 540px
    fontWeight: 700
    lineHeight: 0.78
    letterSpacing: -0.06em
  display-stat-unit:
    fontFamily: "Instrument Serif, serif"
    fontSize: 220px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
  chapter-num:
    fontFamily: "Instrument Serif, serif"
    fontSize: 240px
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: 0
  quote-mark:
    fontFamily: "Instrument Serif, serif"
    fontSize: 200px
    fontWeight: 400
    lineHeight: 0.6
    letterSpacing: 0
  display-xl:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 84px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: -0.02em
  display-lg:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 76px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: -0.02em
  signature:
    fontFamily: "Instrument Serif, serif"
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
  endorsement-num:
    fontFamily: "Instrument Serif, serif"
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
    color: pink
  timeline-year:
    fontFamily: "Instrument Serif, serif"
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
  subhead-serif:
    fontFamily: "Instrument Serif, serif"
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: 0
  lede:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.02em
  cover-pill:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  chart-title:
    fontFamily: "Instrument Serif, serif"
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0
  card-title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: -0.02em
  quote-heading:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: -0.02em
  body-lg:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  body-md:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  body-sm:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.15em
    textTransform: uppercase
  label-wide:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.18em
    textTransform: uppercase
  label-mid:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.12em
    textTransform: uppercase
  label-tight:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.10em
    textTransform: uppercase
  footer:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.12em
    textTransform: uppercase
    opacity: 0.75

spacing:
  slide-pad: 96px
  chrome-gutter: 64px
  section-gap: 48px
  card-pad: 28px 28px 30px
  chart-pad: 48px 48px 56px
  footer-bottom: 36px
  grid-gap: 24px
  endorsement-pad: 20px 0

canvas:
  width: 1920px
  height: 1080px

components:
  pill:
    borderRadius: 999px
    padding: 0.35em 0.9em
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontWeight: 500
    lineHeight: 1.0
  cover-pill:
    borderRadius: 999px
    padding: 16px 38px
    fontSize: 44px
    fontWeight: 500
  closer-pill:
    borderRadius: 999px
    padding: 12px 28px
    fontSize: 22px
  value-card:
    borderRadius: 28px
    padding: 28px 28px 30px
    height: 340px
  value-card-dark:
    background: "{colors.burgundy}"
    color: "{colors.butter}"
  value-card-light:
    background: "{colors.butter}"
    color: "{colors.burgundy}"
  chart-card:
    background: "{colors.butter}"
    color: "{colors.burgundy}"
    borderRadius: 32px
    padding: 48px 48px 56px
  timeline-ribbon:
    background: "{colors.burgundy}"
    color: "{colors.butter}"
    borderRadius: 999px
    padding: 24px 44px
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 24px
    letterSpacing: 0.15em
    textTransform: uppercase
  timeline-ribbon-accent:
    fontFamily: "Instrument Serif, serif"
    fontSize: 30px
    fontWeight: 400
    letterSpacing: 0
    textTransform: none
    color: "{colors.pink}"
  footer-chrome:
    position: absolute
    left: 64px
    right: 64px
    bottom: 36px
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 16px
    letterSpacing: 0.12em
    textTransform: uppercase
    opacity: 0.75
  footer-dot:
    width: 8px
    height: 8px
    borderRadius: 999px
    background: currentColor
    opacity-inactive: 0.3
    opacity-active: 1.0
  swatch-circle:
    width: 36px
    height: 36px
    borderRadius: 999px
  stat-breakdown-bar:
    height: 10px
    borderRadius: 999px
    background: "rgba(246,237,220,0.15)"
  stat-breakdown-divider:
    borderTop: "1px solid rgba(246,237,220,0.25)"
  endorsement-divider:
    borderTop: "1px solid rgba(246,237,220,0.30)"
  avatar:
    width: 72px
    height: 72px
    borderRadius: 999px
    background: "{colors.burgundy}"
    border: "3px solid {colors.burgundy}"
  timeline-axis:
    height: 4px
    background: "{colors.burgundy}"
    opacity: 0.15
  timeline-dot:
    width: 28px
    height: 28px
    borderRadius: 999px
    border: "4px solid {colors.butter}"
    background: "{colors.burgundy}"
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

Editorial Tri-Tone is a **literary magazine presentation system** built on the strictest possible palette: three hex values, eleven CSS variable names. The naming system reveals editorial intent — `--pink` and `--sky` point at the same blush; `--cream`, `--butter`, `--lime`, and `--terracotta` all resolve to the same golden yellow; `--burgundy`, `--navy`, `--forest`, and `--ink` all collapse to the same deep wine. The aliases exist to communicate the role of the color in context, not to introduce variation.

The typeface stack is a deliberate three-way conversation:
1. **Bricolage Grotesque** — a variable grotesque with an optical-size axis. Used at weights 500, 600, 700, and 800 for all display and body sans text.
2. **Instrument Serif** — used exclusively in weight 400, often in its italic guise. Reserved for chapter numerals, pull-quote marks, timeline years, signatures, endorsement ordinals, and stat percentage symbols.
3. **JetBrains Mono** — all metadata, labels, section markers, footnotes, footer chrome.

The editorial voice is that of an independent magazine with a colophon — the deck's last slide is literally called "Colophon." Section markers use the section sign (§) followed by a number and a title. The tone is measured, literary, and warm rather than corporate or high-energy.

**Key Characteristics:**
- Three-color palette with semantic aliases: blush pink (#F2B6C6), golden butter (#F2D86A), deep burgundy (#7A1F35).
- Mixed typography: Bricolage Grotesque grotesque for display and body; Instrument Serif for expressive accent numerals, quotes, and years; JetBrains Mono for all labels.
- The `em` tag within Bricolage Grotesque headlines always triggers a switch to Instrument Serif italic — the system's primary typographic mix.
- Pills (border-radius 999px) are the universal tag component; used at three different sizes across cover, chart legend, and closer.
- Value cards have a generous 28px border-radius — soft, rounded, not brutalist.
- Dividers on dark surfaces use low-opacity rgba (0.25–0.30) rather than solid colors — whispered separators.
- Footer dot row: a progress indicator using 8px circles at 30% opacity (inactive) and 100% opacity (active).
- The sole SVG chart combines four series types on a single canvas: filled area, vertical bars, connected circles, dotted line.

## Colors

### The Three Actual Colors
Despite many CSS variable names, the palette is:

| Name | Hex | Role |
|---|---|---|
| Blush Pink | #F2B6C6 | Accent / highlight on dark surfaces; stat figure color; quote mark glow |
| Golden Butter | #F2D86A | Warm mid-tone; background for light slides; accent text on dark surfaces |
| Deep Burgundy | #7A1F35 | Primary dark surface; ink color; structural tone |

### Alias Map
All aliases resolve to one of the three values above. The alias name signals context:

| Alias | Points to | Context of use |
|---|---|---|
| `--pink` | #F2B6C6 | Default accent label |
| `--pink-deep` | #F2B6C6 | (unused distinct value — same as pink) |
| `--sky` | #F2B6C6 | Segment D bar in breakdown |
| `--cream` | #F2D86A | Light surface background |
| `--butter` | #F2D86A | Accent text on dark; card backgrounds |
| `--lime` | #F2D86A | Ribbon accent text; kicker label on dark surfaces |
| `--terracotta` | #F2D86A | Italic em highlights in lede or body |
| `--navy` | #7A1F35 | Alternate label for dark surface contexts |
| `--forest` | #7A1F35 | Dark panel or column background |
| `--burgundy` | #7A1F35 | Structural background color |
| `--ink` | #7A1F35 | All text color |


## Typography

### Font Families
- **Bricolage Grotesque**: The primary typeface. Variable with optical-size axis (opsz 12..96) and weights from 400 to 800. The weight range is the expressive tool — 400 for body, 500 for lede, 600 for card titles and quote headers, 700 for section headlines, 800 for the wordmark.
- **Instrument Serif**: Weight 400 only, italic variant loaded. Functions as the expressive counterpoint to Bricolage Grotesque. Never used for body copy; always for large numerals, quotation marks, signatures, years, endorsement ordinals, and the stat percentage symbol. The key insight is that the system never uses Instrument Serif for "normal" running text — only for moments of human expressiveness.
- **JetBrains Mono**: Weights 400 and 500. All labels are uppercase with 0.10–0.18em letter-spacing. Always secondary information: section markers, metadata, footnotes, legend categories, kickers, footer chrome.

### The `em` Rule
Within any Bricolage Grotesque headline, an `<em>` tag triggers a switch to Instrument Serif at weight 400. This is the system's primary in-line typographic mix — a grotesque headline interrupted by a serif aside. Example: "A short trajectory, told in *five stops*." The em portion reads as a quieter, more reflective counterpoint.

### The `b` Rule (Quote Slide Only)
Within Instrument Serif blockquotes, a `<b>` tag triggers a switch back to Bricolage Grotesque weight 600 in burgundy. The reverse of the em rule — a serif quote punctuated by a grotesk emphasis.

### Display Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.display-stat}` | 540px | Bricolage Grotesque | 700 | Full-bleed oversized stat or number figure |
| `{typography.display-closer}` | 320px | Bricolage Grotesque | 700 | Jumbo title or closing wordmark |
| `{typography.display-wordmark}` | 300px | Bricolage Grotesque | 800 | Primary wordmark or deck title |
| `{typography.display-stat-unit}` | 220px | Instrument Serif | 400 | Accent symbol alongside a stat figure |
| `{typography.chapter-num}` | 240px | Instrument Serif | 400 | Large chapter or section numeral |
| `{typography.quote-mark}` | 200px | Instrument Serif | 400 | Decorative large quotation mark |
| `{typography.display-xl}` | 84px | Bricolage Grotesque | 700 | Section headline for data or chart layouts |
| `{typography.display-lg}` | 76px | Bricolage Grotesque | 700 | Section headlines |
| `{typography.signature}` | 64px | Instrument Serif | 400 | Signature or sign-off element |
| `{typography.lede}` | 56px | Bricolage Grotesque | 500 | Lede or opening statement |
| `{typography.quote-heading}` | 56px | Bricolage Grotesque | 600 | Panel heading or editorial subhead |
| `{typography.endorsement-num}` | 56px | Instrument Serif | 400 | Endorsement or list ordinals |
| `{typography.timeline-year}` | 56px | Instrument Serif | 400 | Year stamps or large ordinal accents |
| `{typography.subhead-serif}` | 48px | Instrument Serif | 400 | Secondary subheads on dark surfaces |
| `{typography.cover-pill}` | 44px | Bricolage Grotesque | 500 | Large tag cloud or keyword pills |
| `{typography.chart-title}` | 40px | Instrument Serif | 400 | Card or panel title |
| `{typography.card-title}` | 40px | Bricolage Grotesque | 600 | Card or value title |

### Body and Label Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.body-lg}` | 28px | Bricolage Grotesque | 400 | Manifesto right-column body |
| `{typography.body-md}` | 26px | Bricolage Grotesque | 600/400 | Attribution name, endorsement body |
| `{typography.body-sm}` | 24px | Bricolage Grotesque | 400 | Card descriptions, stat annotation, closer index |
| `{typography.label}` | 24px | JetBrains Mono | 400 | Standard section labels (0.15em tracking) |
| `{typography.label-wide}` | 24px | JetBrains Mono | 400 | Kickers on dark slides (0.18em tracking) |
| `{typography.label-mid}` | 24px | JetBrains Mono | 400 | Manifesto bottom meta (0.12em) |
| `{typography.label-tight}` | 24px | JetBrains Mono | 400 | Legend categories, breakdown labels (0.10em) |
| `{typography.footer}` | 16px | JetBrains Mono | 400 | Page footer chrome (0.12em, opacity 0.75) |

### Principles
Bricolage Grotesque's optical-size axis makes the face significantly more expressive at large sizes and more legible at small sizes without changing weight. At 540px and 300px (stat and wordmark), the display renders with wide, open letterforms; at 24px (body), it compresses. Both are weight 700 or 800 at display; both are weight 400 at body. The face is never used in intermediate sizes (48–72px) — that zone belongs to Instrument Serif.

Letter-spacing on Bricolage Grotesque is always negative at display: -0.04em at 300px, -0.05em at 320px, -0.06em at 540px. At body sizes (24–28px), no letter-spacing is applied.

JetBrains Mono label tracking is always positive and varies by use: 0.10em for dense data contexts, 0.12em for secondary meta, 0.15em for standard section labels, 0.18em for headline kickers on dark slides.

## Layout

### Canvas System
Every slide is exactly 1920×1080px. The `deck-stage` custom element handles centering and scaling.

### Gutter System
- **Chrome gutter** (64px left/right): Used by footer chrome and most content edges.
- **Generous slide padding** (96px): Most slides use `padding: 96px 64px` — the top/bottom pad is larger than the sides, giving a portrait-publication feel even on landscape slides.
- **Wide slide padding** (88px top on chart slide): Slight reduction to accommodate the two-column layout.


### Slide Internal Spacing Pattern
Each slide follows a top-to-bottom reading order:
1. Section marker (`§ XX — Title`, JetBrains Mono, 24px, label tracking)
2. Headline or major content
3. Body / grid content
4. Footer meta (absolute, bottom 36px)

## Elevation and Depth

The system uses **no box shadows at all**. Depth comes entirely from:

### Color Surface Contrast
The burgundy/butter/pink trio creates its own depth hierarchy:
- Butter surfaces feel "forward" (warm, light)
- Pink feels "accented" (warm, mid)
- Burgundy feels "recessed" (dark, anchoring)

Alternating surface colors within split slides (cream left / burgundy right on manifesto; lime left / burgundy right on quote) creates depth through edge contrast rather than shadow.

### Opacity Dividers
On dark (burgundy) surfaces, all dividers and structural lines use rgba rather than solid colors:
- Row separators in stat breakdown: `rgba(246,237,220,0.25)`
- Endorsement rows in quote slide: `rgba(246,237,220,0.30)`
- Timeline axis: `opacity: 0.15` on solid burgundy

The cream values (246,237,220) in those rgba strings approximate the butter color at full opacity — dividers feel like recessed etchings rather than drawn lines.

### Chart Card Lift
The chart card (slide 6) achieves its "lifted" feeling through border-radius 32px on a butter card placed over a burgundy background. No shadow — the rounded corner on a contrasting surface signals elevation.

## Shapes and Treatment

### Border Radius Scale
| Value | Use |
|---|---|
| 999px | All pills, timeline ribbon, swatch circles, avatar, breakdown bars, timeline dots, footer dots, chart data circles |
| 32px | Chart card (slide 6) |
| 28px | Value cards (slide 3) |
| 4px | SVG chart bars (rx="4") |
| 0px | Section headlines, grid cells (no rounding) |

The system has a strong binary: either fully rounded (pills, circles) or square (content blocks). The exception is the chart card (32px) and value cards (28px) — large enough radius to feel "soft" but geometric rather than circular.

### Pill System
Pills are the universal label/tag component. Three size variants:
- **Cover pills**: 44px font, 16px 38px padding — large enough to read as headline elements in the tag cloud
- **Standard pills** (section labels, legend items): 22–24px font, 10–12px 24–28px padding
- **Color assignments** alternate: burgundy-bg/pink-text and butter-bg/burgundy-text on cover; burgundy/cream or lime/ink on closer

### SVG Chart (Slide 6)
The inline SVG chart at 720×380 viewBox combines four series types deliberately to demonstrate the range of a single chart surface:
- **Area series** (Series A): Filled path with pink fill at 0.85 opacity, burgundy stroke at weight 3
- **Bar series** (Series C): Burgundy rectangles with rx="4"
- **Connected circle series** (Series B): Butter circles (r=8) with burgundy stroke/fill on a burgundy line at weight 3
- **Dotted line** (Series D): Burgundy dashed stroke (stroke-dasharray="2 10", stroke-linecap="round") at 60% opacity

Y-axis labels are JetBrains Mono 24px at 60% opacity, left-aligned to x=0.

## Do's and Don'ts

### Do
- Treat the three hex values as a closed system. Every element uses pink, butter, or burgundy — no neutrals, no grays, no white.
- Use Instrument Serif only for moments of human expressiveness: numerals, years, signatures, quotation marks, endorsement ordinals. Never for running body text.
- Use the `em` tag in Bricolage Grotesque headlines to trigger the serif switch. This is the system's primary inline mix and its clearest editorial voice.
- Give all label text (JetBrains Mono) positive letter-spacing between 0.10em and 0.18em. Monospace without tracking reads as code, not editorial.
- Alternate surface colors across the two-column split slides. One side is always butter, the other always burgundy.
- Keep body text in Bricolage Grotesque at weights 400 (text) and 500–600 (emphasized labels). The weight axis is the tonal dial.
- Use pills at multiple sizes — the pill is the universal tag and its size signals context: 44px for headline-level categorization, 22–24px for utility labels.
- Section markers follow the pattern `§ NN — Title` in JetBrains Mono — every slide opens with this convention.

### Don't
- Don't introduce a fourth color. The tri-tone constraint is the design premise.
- Don't use Instrument Serif at small sizes or in body paragraphs. It is purely an accent face.
- Don't break the em rule — using Bricolage Grotesque italic instead of Instrument Serif for inline emphasis loses the typographic mix.
- Don't use letter-spacing on Bricolage Grotesque at display sizes — only negative tracking via `letter-spacing: -0.02em` to `-0.06em` depending on size.
- Don't add solid-color dividers on dark (burgundy) surfaces. All structural lines on dark backgrounds must use low-opacity rgba.
- Don't apply box shadows. The system has none. Depth comes from surface contrast and border-radius on contrasting backgrounds.
- Don't round large content containers (section panels, grid backgrounds). Rounding applies only to pill-scale and card-scale elements (value cards, chart card).
- Don't use Bricolage Grotesque weight 800 except in the wordmark. The weight 800 is reserved for the single largest typographic moment.

## Responsive Behavior

This template is designed **exclusively for 1920x1080 presentation display**. The `deck-stage` web component handles viewport scaling via CSS transforms; the 1920x1080 canvas scales proportionally to any screen without layout changes.

### Presenter Behavior
- Slide advancement via keyboard or presentation clicker (handled by `deck-stage.js`).
- No hover states are defined.
- No interactive elements.

### Print / Export
- At 96dpi, 1920x1080 maps to a 20x11.25 inch frame.
- The stat figure at 540px renders at ~405pt — suitable for large-format print.
- The three-color palette is print-safe; burgundy is a deep PMS-range wine tone, butter is a warm yellow, pink is a muted blush — all reproduce well in CMYK offset.

## Iteration Guide

1. Section labels always use the `§ NN — Title` convention in JetBrains Mono with `{typography.label}` tracking.
2. Every headline with an em/italic moment uses `<em>` to trigger Instrument Serif. Never use `font-style: italic` on Bricolage Grotesque directly.
3. Value card alternation: odd-numbered cards (c1, c3, c5, c7) are dark (burgundy/butter); even-numbered (c2, c4, c6, c8) are light (butter/burgundy).
4. New dark-surface sections use `rgba(246,237,220,0.25)` for dividers — not `{colors.butter}` at full opacity.
5. New pills follow the existing alternation: burgundy-bg/pink-text and butter-bg/burgundy-text for variety in clusters.
6. Adding a chart series: use the four established visual encodings (area, bars, circles, dotted line) before inventing a new one.
7. All section backgrounds must be one of the three palette colors — never mix (no half-pink half-butter).
8. Footer chrome is shared across all slides: `position:absolute; left:64px; right:64px; bottom:36px; font-family:JetBrains Mono; font-size:16px; opacity:0.75`.

## Known Gaps

- The `deck-stage.js` script is an external dependency not documented here.
- The footer dot-row progress indicator (`.footer .dotrow`) is rendered in the HTML but the dots are all styled with class "on" or left as inactive — a presenter would need to update slide state dynamically.
- The SVG chart uses hardcoded paths, coordinates, and placeholder values — no data-binding layer exists.
- The breakdown bars in slide 4 use inline `width: XX%` as a style — percentages must be set manually.
- The timeline stop dots (`.stop .dot`) have `display: none` — they are styled but not visible. A presenter populating this slide would enable them via CSS.
- Instrument Serif italic is loaded as a font variant but is not explicitly called with `font-style: italic` in every context — in some cases the browser selects it from the variable font's italic axis automatically based on surrounding context.
- Color swatch circles on slide 4 reference `--terracotta` and `--sky`, which resolve identically to `--butter` and `--pink` — the visual distinction exists only semantically in the source, not visually.
