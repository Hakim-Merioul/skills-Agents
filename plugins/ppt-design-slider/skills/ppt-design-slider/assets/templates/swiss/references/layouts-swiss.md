# Layouts · Style B — Swiss International Style

22 original registered layouts · Strict modular grid · Each layout documents purpose, skeleton, key class names, and dedicated animation recipe.

> ⚠️ These layouts are **not interchangeable** with Style A (editorial magazine / e-ink). Class names may be the same but have different semantics (e.g. `h-hero` in Style A is a serif font; in Style B it is an ultra-thin sans-serif at weight 200). One deck can only use one style.

---

## Swiss locked mode (read this first)

The golden source for this theme is:

`<reference-deck.html>`

When generating body slides, do not treat Swiss as a "freely composable style package." By default, only layouts registered as `S01-S22` in `references/swiss-layout-lock.md` may be used. Every slide must carry `data-layout="Sxx"` on its `<section>`.

**Key constraints**:

- Top Chinese headings are left-aligned by default and placed on the top-left content axis; do not center headings.
- Inventing body structures outside the original 22 layouts is not allowed. P23/P24 at the end of this document are legacy experimental entries and are disabled by default.
- For a single large image, use `S22 Image Hero`; for multiple images, adapt `S15/S16` original matrix/brief skeletons into image grids.
- For locations, routes, characters' residences, and urban relationships, use `S08 + Swiss Map Component`; this is still an extension of S08's right-side slot, not a new body slide. Read `swiss-map-component.md` first.
- SVG draws geometry only; no visible text. Labels go in HTML.
- After generating, run `node scripts/validate-swiss-deck.mjs index.html`.

---

## Design language baseline

**Color** (`--accent` is determined by theme; see `themes-swiss.md`)
- `--paper` paper-white base #ffffff (main background)
- `--ink` black-ink text #0a0a0a (main text / Ink reversed block)
- `--accent` single-color anchor (IKB blue by default / yellow / green / orange — four sets)
- `--text-primary / secondary / helper` three-level text grey scale
- `--border-subtle` 1px hairline #e0e0e0

**Typography**
- Fonts: `var(--sans)` Inter / Helvetica Neue + `var(--mono)` JetBrains Mono
- Weights: **200 (ExtraLight) for large text** / **300 (Light) for body** / **600 (SemiBold) for t-cat small headings**
- Large headings follow the actual page usage of the original PPT: main heading `font-weight:200`, emphasis words/numbers `font-weight:300`; do not set Swiss large headings to 800/900 just because old CSS helpers contain those values
- Large text tracking: `letter-spacing:-.04em` / `line-height:.9`
- Mono numbers: `font-feature-settings:"tnum","ss01"`

**Chinese large heading size tiers**
Chinese block characters have a larger visual mass than Latin letters — do not directly apply the English page `6.8vw-7vw`. Scale down based on Chinese heading length before generating:

| Chinese heading form | Recommended size |
|---|---|
| 1 line, ≤ 8 characters | `min(6.4vw,11.2vh)` |
| 2 lines, each ≤ 8 characters | `min(5.8vw,10.2vh)` |
| 2 lines, any line 9-12 characters | `min(5.2vw,9.2vh)` |
| 3 lines or longer | Rewrite; if unavoidable use `min(4.6vw,8.2vh)` |

Rule: prefer shortening Chinese headings; reduce font size as a fallback; never let headings crowd the image/text area below. English and number-heavy heroes may go larger; Chinese methodology slides must be more restrained.

**Minimum presentation font sizes and weight ladder**
Swiss style is not a web documentation page; 10-12px annotation text must not appear on a projected screen. Default lower limits:

| Text type | Minimum size |
|---|---|
| Body paragraph / main description | `18px` |
| Card description / list / timeline note / caption / figure caption | `16px` |
| meta / kicker / mono label / chart label | `14px` |

When there is too much content, compress the copy, split the slide, or change the Sxx layout; do not reduce small text sizes to solve crowding. Figure captions, timeline notes, KPI annotations, and bottom notes especially must respect this limit.

**Font size and weight ladder (Swiss core)** — "the larger the text, the lighter the weight" is not subjective:

| Size range | Recommended weight | Typical context |
|---|---|---|
| ≥ 8vw | 200 (ExtraLight) | Cover large text, giant KPI, h-statement |
| 4-7.9vw | 200-300 | Section headings (h-xl/h-xl-zh), large numbers |
| 1.8-3.9vw | 300-400 | Mid-size headings, takeaway titles (≈1.8vw), medium numbers |
| 1-1.7vw / 16-20px | 400-500 | Body paragraphs, card descriptions, explanatory text |
| 13-15px (small text) | 500-600 | meta, kicker, badges, chart labels, caption emphasis |

**Hard rules:**
- On the same slide, elements with smaller font sizes must have weight ≥ elements with larger font sizes (16px body at 300 while 1.8vw heading is at 500 is not allowed)
- Small text around 16px must not use weight 300 (too thin to read); minimum 400, recommended 500
- Emphasis words inside cover/IKB reversed large headings use `italic + weight 300`; do not use accent color (blue on blue is invisible)

**Grid** (IBM Carbon 2x Grid adapted)
- 16-column grid: `grid-template-columns:repeat(16,1fr)` + `gap:16px`
- Spacing tokens: `--sp-3` 8 / `--sp-4` 12 / `--sp-5` 16 / `--sp-6` 24 / `--sp-7` 32 / `--sp-8` 40 / `--sp-9` 48 / `--sp-10` 64 / `--sp-11` 80 / `--sp-12` 96 / `--sp-13` 160

**Canvas**
- `.canvas-card`: `100vw × 100vh`, square corners, padding `5.6vh 5vw 4.4vh`
- `body{background:var(--paper)}` — no WebGL background
- The `B Static` keyboard shortcut in the bottom-right must be preserved. Low-power mode uses `body.low-power`, stops WebGL/ASCII canvas RAF and Motion entry animations, and persists the user's choice via `localStorage` on refresh.

---

### P0 Alignment rules (check these 4 before generating every slide — violation = discard the entire slide)

**1. Do not double-stack horizontal padding** ⚠️ Most frequently violated
`.canvas-card` already has `padding:5.6vh 5vw 4.4vh`.
chrome-min (header), body content, and bottom footnote are all children of canvas-card — they **share the same 5vw edge line**.
If the body layer also gets `padding:5vh 5vw 4vh`, the horizontal padding becomes `5vw + 5vw = 10vw`, indenting the body one ring more than chrome-min and causing left-right misalignment.

```html
<!-- ❌ Wrong: body is indented 5vw extra -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:5vh 5vw 4vh;...">Body content</div>
</div>

<!-- ✅ Correct: body padding is 0; use grid gap for vertical spacing only -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:3vh">Body content</div>
</div>
```

Exception: `.slide.split .canvas-card{padding:0}` is overridden by CSS; in split mode each `.half` controls its own padding (commonly `5.6vh 3.6vw 4.4vh`), which does not conflict with this rule.

**2. Kicker must be above the main heading — do not force them side by side**
The small label (`.t-meta` / `.t-cat`) and the main heading have a subordinate relationship; the layout must use a **vertical stack**.

```html
<!-- ❌ Wrong: auto 1fr forces kicker and heading into two side-by-side columns -->
<div data-anim="head" style="display:grid;grid-template-columns:auto 1fr;gap:3vw;align-items:end">
  <div class="t-meta">METHODOLOGY · 03</div>
  <h2 class="h-xl-zh">Why N+1</h2>
</div>

<!-- ✅ Correct: flex column stacks vertically -->
<div data-anim="head" style="display:flex;flex-direction:column;gap:1.4vh">
  <div class="t-meta">METHODOLOGY · 03</div>
  <h2 class="h-xl-zh">Why N+1</h2>
</div>
```

**3. Dual height constraint `min(Xvw, Yvh)` requires Y ≥ X × 1.6**
On a standard 16:9 screen 1vw : 1vh ≈ 1.78. If Y is too tight (e.g. `min(7vw, 10vh)`), the large font size is capped by the height limit to 10vh rather than being governed by 7vw, making the overall layout look shrunken.
Reference values:

| Use | Recommended |
|---|---|
| h-hero declaration | `min(11.6vw, 19vh)` |
| h-xl section heading | `min(7vw, 12vh)` ~ `min(7.4vw, 13vh)` |
| Large KPI number | `min(8.4vw, 14vh)` |
| Medium number / index | `min(4.6vw, 8.5vh)` ~ `min(5.6vw, 10vh)` |

**4. Use grid `gap` between canvas-card children — do not rely on margin/padding stacking**
`.canvas-card` defaults to `display:flex;flex-direction:column`; chrome-min has `margin-bottom:48px` (`--sp-9`).
For the body area with several rows (head / content / footnote), **prefer** `display:grid;grid-template-rows:...;gap:Nvh`; **second choice** flex column + gap; **forbidden**: adding `margin-top` / `padding-top` to each child block to adjust spacing (this clashes with or tears open chrome-min's `margin-bottom`).

**5. Bottom pagination safe zone: the lowest content must not touch nav**
The bottom pagination dots are fixed at `bottom:2vh`, visually occupying the area from about `93vh` downward. The lowest edge of body content, image captions, chart annotations, and timeline labels must stop above the safe zone.

- The template provides `--nav-safe-bottom:8vh`, usable via `.nav-safe-bottom` / `.nav-safe-bottom-tight`
- P23 with `.swiss-img-split.align-image-bottom` automatically adds a bottom safe zone to prevent image captions from being blocked by the pagination component
- If you manually write `align-items:end` / `margin-top:auto` / `position:absolute;bottom:...` for a slide, visually inspect whether the lowest content crosses nav
- Visual self-check: open the page to that slide; confirm at least `3vh` of breathing room between the lowest content edge and the pagination dots

---

**Card fill rules (must follow)**
| Type | Class | Role | Usage |
|---|---|---|---|
| Ink dark | `.card-ink` | Reversed / declaration | Hero block, closing half-page |
| Accent blue fill | `.card-accent` | Unique focus | Highlight one item in a group |
| Grey fill | `.card-fill` | Default neutral | Parallel cards, stat cards |
| Outlined | `.card-outlined` | Anchor (not a card) | Hairline divider frame |

❌ Mixing is forbidden (blue background + blue border, grey background + border, etc.)

**Decoration minimalism principle**
- 1px hairline separator (`hr-hairline` / `border-bottom`)
- 8×8 / 12×12 square-cornered small blocks instead of round dots
- Dot matrix `dot-mat` / outlined circle `ring-mat` / cross `cross-mat` (SVG mask)

**Image usage principles (Swiss + GPT-M 2.0)**
- Images are "evidence blocks" in the grid, not decorative backgrounds; every image must have a clear function: case study, documentary evidence, UI screenshot, system diagram, or conceptual infographic
- All image containers remain square-cornered with no shadows, no rounded corners; **no image border by default** — captions or the page grid handle hierarchy
- White-background infographics / flowcharts / UI images: container background must be `var(--paper)`; do not wrap white images in grey backgrounds, and do not add `.swiss-keyline` borders
- Only use `.swiss-lined` (one top accent line) when the image's own edges cannot be distinguished from the page; do not apply a border to every image
- Documentary photos use `object-fit:cover` cropping only at the bottom/edges; original screenshots or text-dense images use `.fit-contain` to prevent text being cropped
- If infographics, flowcharts, or UI context images were regenerated to S15/S16 slot ratios, use `.frame-img.r-21x9` / `.frame-img.r-16x10` to fill the slot fully; do not add `.fit-contain` again, which would make the image float in a white frame
- Swiss preferred image ratios: S22 top banner `21:9`; S15/S16 multi-image grids unified `21:9` or unified `16:10`
- When generating 2-3 images, first bind them to original layout slots: single image = S22; multiple images = S15/S16 grid adaptation; do not use unregistered P23/P24
- S22 photo subjects must be in the central safe zone; use `object-position:center 35%` or `center center` in HTML; do not use `top center` for portraits/meeting scenes
- GPT-M 2.0 generated images must follow: single accent color, Helvetica/Inter aesthetic, 12/16-column grid, square solid color, no gradients/shadows/rounded corners
- Generated images keep only the core image; do not draw page headers, footers, headings, page numbers, badges, borders, or attributions into the image

**Layout diversity hard rule**
The Swiss theme has 22 registered layouts; always demonstrate the layout system actively during generation — do not turn all content into `head + grid-reveal + card`:

- A 7-8 slide deck must use at least **6 different S-number layouts**
- Three or more consecutive slides with the same main structure are not allowed (e.g. three consecutive S19 / plain card pages)
- For a "test template" or "show me the effect" request, coverage must include: cover, closing, at least 1 comparison/timeline (S08/S11/S02), at least 1 structure diagram (S14/S17/S15), at least 1 image layout (S22 or S15/S16 image grid)
- Image pages do not mean inventing new slides. Single image = S22; multiple images = adapt S15/S16 original grid skeleton
- Before writing code for each slide, list `slide number → data-layout → reason for choosing it → image slot`; after generating, run the validator

**Animation principles (one semantic recipe per slide)**
- Not uniform fade-up, but **coupled with visual semantics**: numbers scale-spring in, bars scaleY pull up, SVG rings stroke-dashoffset trace in, timeline nodes light up in sequence
- Easing: `EASE_PROD` `cubic-bezier(.2,0,.38,.9)` for productive (120-240ms); `EASE_ENTRY` `cubic-bezier(0,0,.3,1)` for expressive (400-700ms)
- The `playSlide` entry point should reveal all `[data-anim]` containers to `opacity:1`; recipes then use motion `{opacity:[0,1]}` to override

---

## Visual + code dual review (required after generating)

Do not look at HTML/CSS alone. Fidelity to the Swiss template must be judged from both **browser visual** and **code structure**:

1. Open three pages simultaneously: the original reference PPT, the current `template-swiss.html` or generated page, and the test PPT being modified. Original reference path: `<reference-deck.html>`.
2. Wait for entry animations to settle (about 1-2 seconds) before screenshotting. Do not mistake an animation mid-state for "missing content" or "blank layout."
3. Look at the visual first: heading weight, header spacing, image placement, bottom safe zone, whether captions are blocked by nav.
4. Compare against the same type of layout in the original reference PPT — not just CSS helpers; judge by actual page structure and visual output.
5. Then return to the code: check whether the slide mistakenly uses components that do not belong to that layout, e.g. stuffing P24's three-image evidence wall into P23, or using P7's chart for a concept list with no real values.
6. If visuals are inconsistent, first determine whether it is a **wrong layout choice**, **missing required component**, **overused optional component**, or **spacing/safe zone issue** — do not try to fix it by adjusting `margin` directly.
7. When modifying the template, isolate new capabilities with new classes; do not change global base classes because of one slide's problem.

### Original PPT visual anchors (prioritize these when comparing)

| Visual anchor | Original PPT actual practice | Rule when generating |
|---|---|---|
| Heading weight | Actual pages use `font-weight:200/300` heavily; even if raw CSS helpers contain 700/800/900, those cannot be the visual standard | Keep headings at light weight; the larger the font, the lighter the weight |
| Whitespace | Pages often only occupy the upper half or middle of the screen; the bottom is left for nav and a few footnotes | Do not push content to the bottom just to "fill space" |
| Dividing lines | Only used at section boundaries, evidence walls, and card hierarchy levels — 1px hairline only | Do not add a line to every content block |
| Heading and content | There is obvious breathing room between the heading area and body/charts | Use grid `gap` for complex pages; do not let content sit right against the heading |
| Timeline | Axis in the lower-middle area; labels do not touch the bottom nav | Horizontal timelines must check both upper/lower labels and nav safe zone |
| Image slides | Images are evidence blocks — either S22 main visual or placed in S15/S16 original grid | Do not use unregistered image/text structures |

### Components: required / optional / omissible

| Component | Rule |
|---|---|
| `.canvas-card` / `.chrome-min` | Required for base slides; split slides have chrome-min in each half |
| `t-meta` / `t-cat` kicker | Required in head area; may be omitted inside body cards; must be above the main heading |
| Main heading | Required for section/thesis slides; list-type small-card slides may use a smaller heading, but a page-level anchor cannot be absent |
| `lead` description | Optional; if the heading is self-explanatory, may be omitted, but a long body paragraph right against the heading is not allowed |
| Image caption | Required for S15/S16 multi-image grids; optional for S22 large image (the image is already the main visual and there are KPIs/descriptions below) |
| Hairline / border-bottom | Optional; only to establish hierarchy — do not stack lines as decoration |
| KPI / number | Only when real data is available; do not fabricate values for conceptual explanations |
| `footnote` / bottom note | Optional; if used, must avoid the nav safe zone |
| `S08 + Swiss Map Component` | Dedicated to locations/routes/character residences; right-side map must have pins, connecting lines, cards, and `+` / `-` / `DRAG` controls; see `swiss-map-component.md` |

### General-purpose vs. non-general-purpose layouts

| Type | Layouts | Usage boundary |
|---|---|---|
| General-purpose | S01, S03, S08, S09, S10, S11, S19 | Most narrative decks can use these, but content shape must still match |
| Conditionally general | S04, S05, S13, S16 | Depends on whether the count exactly matches: 3/4/6 items |
| Data-specific | S02, S06, S07, S18, S20, S21, S22 | Must have real time data, values, metrics, or case study data |
| Structure-specific | S14, S15, S17 | Must have a closed loop, matrix, or hierarchical/ecosystem relationship; not suitable for ordinary paragraphs |

---

## 22 Registered Layouts

### P1 · Cover · Cover Page

**Purpose**: Opening of the entire deck / thematic declaration.
**Applicable content types**: Cover / chapter opening / thematic declaration. **Pure text structure** (main heading + subtitle + metadata); does not carry data.

**Default recommendation: full-screen IKB + ASCII breathing field** ⭐
- `<section class="slide accent">` full-screen IKB — **not** white background
- Insert `<canvas class="ascii-bg" aria-hidden="true">` as the first child of `.canvas-card`; the template's IIFE auto-drives the sin/cos 2D noise breathing field
- Main heading reversed white at weight 200; minor emphasis uses italic (`font-style:italic;font-weight:300`) rather than IKB blue (background is already blue — blue on blue is invisible)
- **Do not** add a large number like "01" — chrome-min already shows 01/NN
- Pairs with the P9 Closing half-screen IKB to form the "full IKB opening ↔ half IKB closing" color loop

**Key classes**: `.slide.accent` `.ascii-bg` + `min(11.6vw,19vh)` dual-constraint large text
**Animation recipe**: `hero` — ASCII breathing field continuously runs; text fade-up sequence entry

**Example code (IKB default variant)**:
```html
<section class="slide accent" data-animate="hero">
  <div class="canvas-card">
    <canvas class="ascii-bg" aria-hidden="true"></canvas>
    <div class="chrome-min">
      <div class="l">[required] Deck title · Issue/Field Note number</div>
      <div class="r">SS · 26.05.10 · 01 / NN</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:2.6vh">
      <div data-anim="kicker" class="t-meta" style="color:rgba(255,255,255,.78);letter-spacing:.22em">[required] Section English / Section En</div>
      <h1 data-anim="title" style="align-self:center;font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(11.6vw,19vh);line-height:.94;letter-spacing:-.025em;color:#fff">[required] Main heading<br/>(add <span style="font-style:italic;font-weight:300">italic</span> on a word for micro-emphasis)</h1>
      <div data-anim="bottom" style="display:grid;grid-template-rows:auto auto;gap:1.6vh;border-top:1px solid rgba(255,255,255,.22);padding-top:2vh">
        <div data-anim="lead" class="lead" style="max-width:52ch;color:rgba(255,255,255,.86);font-weight:300">[required] 1-2 line subtitle / hook to set the tone.</div>
        <div style="display:flex;justify-content:space-between;align-items:end">
          <div class="t-meta" style="color:rgba(255,255,255,.6)">[optional] Author · Date · Source</div>
          <div class="t-meta" style="color:rgba(255,255,255,.6)">→ swipe / arrow keys</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Classic variant (left ink + right paper split)** — only use when full IKB does not suit the content tone:
```html
<section class="slide" data-animate="cover-reveal">
  <div class="canvas-card cover-split">
    <div class="cover-ink">
      <span class="t-cat">Volume 18 · 2026</span>
      <h1 class="h-hero">Thin Harness,<br>Fat Skills.</h1>
      <span class="t-meta">— Kevin · 2026-05</span>
    </div>
    <div class="cover-paper">
      <p class="lead">Thin harness. Fat skills.</p>
      <ul class="meta-list">
        <li>22 PAGES</li><li>SWISS · IKB</li><li>MP-75</li>
      </ul>
    </div>
  </div>
</section>
```

---

### P2 · Vertical Timeline · Vertical Timeline

**Purpose**: Evolutionary comparison, chronological change, version iterations (2-5 time nodes).
**Applicable content types**: **Time-based evolution with quantitative data.** Each node must have a "year + quantitative value (e.g. 1× / 4× multiplier / unit number) + description" trio. If there are only node names without data, use P11 Horizontal Timeline instead.
**Skeleton**: Left axis column — 12px circles + 1px dashed axis / Right node info (year + large data + sub-label + description).
**Key classes**: `.timeline-v` `.tl-node` `.tl-axis` (12px fixed column width, absolute-positioned dot prevents misalignment) `.kpi-row-4`
**Animation recipe**: `timeline-vertical` — nodes light up top-to-bottom in chronological order (dot pops and expands first → text slides in horizontally)
**Grid rule**: axis column = 12px fixed; dot uses `position:absolute;left:50%;transform:translateX(-50%)` to align with the dashed line
**Example code**:
```html
<section class="slide" data-animate="timeline-vertical">
  <div class="canvas-card">
    <header class="chrome-min">...</header>
    <div class="timeline-v">
      <div class="tl-node">
        <div class="tl-axis"><span class="dot"></span></div>
        <div class="tl-body">
          <span class="yr">2023</span>
          <span class="multi">1<small>×</small></span>
          <p class="desc">Prompt Engineering Era</p>
        </div>
      </div>
      <!-- Repeat N tl-nodes; axis column runs through -->
    </div>
  </div>
</section>
```

---

### P3 · Statement · Minimal Statement

**Purpose**: Central thesis, chapter opening, slogan. One sentence + simple decoration per page.
**Applicable content types**: **Pure qualitative assertion / slogan / chapter transition.** Compress to 8-12 words; **no data or lists.** If data support is needed, use P18 Why Now; if it is a cover, use P1.
**Skeleton**: Left 1/3 whitespace + center giant statement (8-10vw, weight 200) + bottom-right small footnote + bottom hairline.
**Key classes**: `.h-statement` (9.6vw, letter-spacing:-.05em) `.stmt-anchor`
**Animation recipe**: `statement-rise` — large text rises staggered by word (180ms per word delay) + footnote fades in
**Example code**:
```html
<section class="slide" data-animate="statement-rise">
  <div class="canvas-card">
    <header class="chrome-min">...</header>
    <h1 class="h-statement">
      <span>Build it</span> <span>once.</span><br>
      <span>It runs</span> <span>forever.</span>
    </h1>
    <span class="stmt-anchor">— Statement 03</span>
  </div>
</section>
```

---

### P4 · Six Cells · Six-Cell Definition

**Purpose**: 6 parallel concept definitions, 6 feature comparisons.
**Applicable content types**: **6 equal concepts / feature listings** (count must = 6; use P5 if fewer, P15/P16 if more). Each cell carries only "icon + number + short title + one-line description" — **no expandable data / paragraphs**.
**Skeleton**: 2×3 grid / each cell has Lucide icon + number + short title + one-line description above / cells separated by hairlines.
**Key classes**: `.cell-6` `.cell-icon-row` `.cell-num`
**Animation recipe**: `six-cells` — 6 cells light up in Z-order (L→R, T→B, 90ms delay per cell)
**Note**: **Do not draw SVG icons** — use `<i data-lucide="bookmark"></i>` from the Lucide CDN.
**Example code**:
```html
<div class="cell-6">
  <div class="cell">
    <i data-lucide="square-stack"></i>
    <span class="cell-num">01</span>
    <h4>Skill File</h4>
    <p>Pure markdown — hand-writable, rewritable</p>
  </div>
  <!-- 5 more -->
</div>
```

---

### P5 · Three Sub-cards · Three Sub-cards

**Purpose**: Three-step flow, three-way comparison (light differences).
**Applicable content types**: **3 equal concepts / steps** (count must = 3). Same structure, **no strong data contrast** (if data is comparable, use P6 KPI Tower instead). Each card carries slightly more content than P4 (number + title + 1-2 line description).
**Skeleton**: Left large heading + description + top hairline / right 3 horizontally stacked sub-cards.
**Key classes**: `.sub-card-stack` `.sub-card` (`.card-fill` grey background, square corners)
**Animation recipe**: `sub-stack` — main heading enters first → 3 cards slide in from the right in a staircase (140ms delay per card)
**Example code**:
```html
<div class="grid-2-9">
  <div class="lead-col">
    <span class="t-cat">Three Forces</span>
    <h2 class="h-xl">Three facts compressed</h2>
  </div>
  <div class="sub-card-stack">
    <article class="card-fill sub-card">
      <span class="big-num">01</span>
      <h4>Skill File</h4>
      <p>...</p>
    </article>
    <!-- 2 more -->
  </div>
</div>
```

---

### P6 · KPI Tower · Unequal-Height KPI Tower

**Purpose**: 4 data items expressing hierarchy through visual height.
**Applicable content types**: **4 comparable quantitative data items** (must have real values; bar heights are determined by data). Typical: cost, capacity, count, efficiency metrics. **Forbidden** for concept listings without data (that is P4/P5's domain).
**Skeleton**: 4 equal columns; each has an IKB blue rectangle of varying height at the bottom (height determined by data) + icon at the top + giant number in the middle + label at the bottom.
**Key classes**: `.kpi-tower-row` `.bar-tower` (min-height:6vh, max:36vh) `.tower-cap`
**Animation recipe**: `tower-grow` — label enters first → number scales in → tower scaleY pulls up from 0 (transform-origin:bottom)
**Example code**:
```html
<div class="kpi-tower-row">
  <div class="tower-col">
    <i data-lucide="layers"></i>
    <span class="num-mega">90K</span>
    <span class="lbl">Skills</span>
    <div class="bar-tower" style="--h:36vh"></div>
  </div>
  <!-- 3 more with different h values -->
</div>
```

---

### P7 · H-Bar Chart · Horizontal Bar Chart

**Purpose**: Multi-item ranking comparison / ratio comparison (5-10 items).
**Applicable content types**: **5-10 comparable quantitative data items** (must have real percentages / scores / values; bar widths determined by data). Typical: benchmark rankings, market share, survey ratios. ⚠️ **Strictly forbidden for concept listings without quantitative data** (that is P4/P5/P15) — fabricated numbers will be exposed.
**Skeleton**: Top large heading / middle empty space / lower half bar list (each row: text label + 1px blue bar 0→target width + end number).
**Key classes**: `.h-bar-chart` `.bar-row` `.bar-fill` (scaleX animation)
**Animation recipe**: `hbar-grow` — large heading enters first → each row expands 0→target width in sequence (transform-origin:left) + end number counts up
**Example code**:
```html
<div class="h-bar-chart">
  <div class="bar-row">
    <span class="bar-lbl">Anthropic Advisor</span>
    <span class="bar-fill" style="--w:84%"></span>
    <span class="bar-num">84</span>
  </div>
  <!-- N more -->
</div>
```

---

### P8 · Duo Compare · Dual-Track Comparison

**Purpose**: Before/After, A vs B, old/new comparison.
**Applicable content types**: **Binary comparison** (must be exactly 2 items). Both sides have the same structure (t-cat label + large text heading + paragraph / list description). Typical: old/new workflow, traditional/AI, customer perspective/team perspective.
**Skeleton**: Left and right half-screens separated by a vertical 1px long line / each has t-cat + large heading + description below.
**Key classes**: `.duo-compare` `.duo-half` `.vrule` (scaleY opens)
**Animation recipe**: `duo-mirror` — center vrule scaleY 0→1 first → left and right headings and text mirror each other in
**Example code**:
```html
<div class="duo-compare">
  <div class="duo-half">
    <span class="t-cat">Before</span>
    <h2>Hand it to the model</h2>
  </div>
  <span class="vrule"></span>
  <div class="duo-half">
    <span class="t-cat">After</span>
    <h2>Hand it to code</h2>
  </div>
</div>
```

---

### P9 · Closing Manifesto · Closing Manifesto

**Purpose**: Final closing slide of the entire deck.
**Applicable content types**: **Deck closing** (one per deck only). Fixed structure: left manifesto short phrase + right 3 takeaways (number + title + one-line note). **Cannot be used in the middle of a deck** (it would duplicate the P1 cover function).

**Default recommendation: left IKB+ASCII / right paper takeaway** ⭐
- Use `<section class="slide split">` + left half `.half.b-accent` + ASCII canvas + right half white takeaways
- Forms the "full IKB opening ↔ half IKB closing" color loop with the P1 cover
- Right side takeaway 03 uses `var(--accent)` for emphasis, threading IKB blue from the left half to the right half to complete the color seam
- Large heading reversed white at weight 200; emphasis uses italic (background is already blue — do not add `var(--accent)` again)

**Key classes**: `.slide.split` `.half.b-accent` `.ascii-bg` (IIFE auto-starts)
**Animation recipe**: `split-statement` — left ink/IKB heading characters rise in sequence → right white half's 3 takeaways follow

**Example code (IKB default variant)**:
```html
<section class="slide split" data-animate="split-statement">
  <div class="canvas-card">
    <div class="split-half">
      <!-- Left half · IKB + ASCII breathing field -->
      <div class="half b-accent" style="padding:5.6vh 3.6vw 4.4vh;justify-content:space-between;position:relative;overflow:hidden">
        <canvas class="ascii-bg" aria-hidden="true"></canvas>
        <div class="chrome-min" style="margin-bottom:0;position:relative;z-index:1">
          <div class="l">NN / NN</div>
          <div class="r">CLOSING</div>
        </div>
        <div data-anim="manifesto" style="display:flex;flex-direction:column;gap:2vh;position:relative;z-index:1">
          <div class="t-meta" style="color:rgba(255,255,255,.78);letter-spacing:.22em;margin-bottom:1.6vh">MANIFESTO</div>
          <h2 style="font-family:var(--sans),var(--sans-zh);font-size:min(8vw,14vh);line-height:.94;letter-spacing:-.025em;font-weight:200;color:#fff">[required] Build a model.<br/>Run <span style="font-style:italic;font-weight:300">forever</span>.</h2>
          <div style="font-family:var(--sans),var(--sans-zh);font-size:max(13px,1vw);line-height:1.6;color:rgba(255,255,255,.82);font-weight:300;max-width:36ch;margin-top:1.4vh">[required] One closing line in English and/or Chinese.</div>
        </div>
        <div data-anim="signature" style="display:flex;justify-content:space-between;align-items:end;border-top:1px solid rgba(255,255,255,.22);padding-top:2vh;position:relative;z-index:1">
          <div class="t-meta" style="color:rgba(255,255,255,.62)">[optional] Author · Title</div>
          <div class="t-meta" style="color:rgba(255,255,255,.62)">YY.MM.DD</div>
        </div>
      </div>
      <!-- Right half · white background takeaways; item 03 uses IKB blue accent to complete the color loop -->
      <div class="half" style="padding:5.6vh 3.6vw 4.4vh;justify-content:space-between">
        <div class="chrome-min"><div class="l">TAKEAWAYS</div><div class="r">03 RULES</div></div>
        <div data-anim="rules">...</div>
        <div class="t-meta" style="color:var(--text-helper);text-align:right">→ END OF FIELD NOTE</div>
      </div>
    </div>
  </div>
</section>
```

**Classic variant (`.closing-split` ink dual half-screens)** — use classic ink closing when the cover does not use full-screen IKB:
```html
<div class="closing-split">
  <div class="cl-ink">
    <p class="line-mega">Build it<br>once.</p>
    <p class="line-mega">It runs<br>forever.</p>
  </div>
  <div class="cl-paper">
    <ul class="takeaway-list">
      <li><span class="num">01</span><h4>Skill</h4><p>...</p></li>
      <!-- 2 more -->
    </ul>
  </div>
</div>
```

---

### P10 · Dot Matrix Statement · Dot Matrix Statement

**Purpose**: Second statement page / chapter transition / visual breathing page.
**Applicable content types**: **Slogan / metaphor / chapter transition** (same as P3, but with geometric dot-matrix decoration). Used within a deck to **avoid two consecutive P3 pages**; usually serves as a visual palate-cleanser before a "concept definition" page.
**Skeleton**: Center 7vw giant three-line statement / top-right 36vw circle dot matrix + bottom-left outlined ring matrix.
**Key classes**: `.dot-mat` (SVG mask solid dots) `.ring-mat` (outlined circles) `.cross-mat` (× grid)
**Animation recipe**: `matrix-statement` — text enters line by line → dot matrix mask-position sweeps left to right
**Example code**:
```html
<div class="canvas-card">
  <span class="ring-mat" style="left:5vw;bottom:5vh;width:18vw;height:18vw"></span>
  <h1 class="h-statement">Build a thin harness.<br>Write fat skills.<br>Codify everything.</h1>
  <span class="dot-mat" style="right:0;top:0;width:36vw;height:36vw"></span>
</div>
```

---

### P11 · Horizontal Timeline · Horizontal Timeline

**Purpose**: Multi-step flow (4-7 steps), time progression.
**Applicable content types**: **4-7 linear steps** (each step has one name; no need to expand data/description). If each step needs expansion, use P5; if there are quantitative data points, use P2. **Forbidden for cyclic structures** (that is P14's domain).
**Skeleton**: Top large heading / center 1px hairline horizontal line + N evenly distributed nodes (8×8 square corner block + mono index above + step name below).
**Key classes**: `.timeline-h` `.tl-h-node` `.tl-h-axis`
**Animation recipe**: `timeline-walk` — nodes light up left to right along the axis (220ms per node)
**Alignment note**: Horizontal timeline label CSS relies on `translateX(-50%)` for centering. If the animation involves vertical displacement, write the full `transform: translate(-50%, y)` sequence — do not write only `y`, as the label will be offset from the dot after the animation ends.
**Example code**:
```html
<div class="timeline-h">
  <span class="tl-h-axis"></span>
  <div class="tl-h-node">
    <span class="num">01</span>
    <span class="dot"></span>
    <span class="lbl">Investigate</span>
  </div>
  <!-- 4-6 more -->
</div>
```

---

### P12 · Manifesto + Ink Banner · Manifesto + Full-Width Ink Strip

**Purpose**: Intermediate conclusion, chapter closing, slogan + strong visual wrap-up.
**Applicable content types**: **Chapter-level closing / intermediate declaration** (used mid-deck, not as the final closing — P9 is the deck end). Carries "main argument + brief explanation + ink full-width declaration" three-part structure; no data.
**Skeleton**: Upper half left t-cat + 4-line large declaration + right brief paragraph / lower half full-width ink strip (no left/right/bottom margin) + reversed-white short phrase + Lucide icon matrix.
**Key classes**: `.manifesto-top` `.ink-banner-full` (`margin:0 -5vw -4.4vh` cancels parent padding)
**Animation recipe**: `manifesto` — large text three sections rise staggered → bottom ink strip scaleX 0→1 spreads → reversed-white text fades in
**Note**: The small Skill File text **aligns to the top at the right side's large text baseline** (`align-items:flex-start;padding-top:1.2vw`)

---

### P13 · Three Forces Cards · Three Forces Card Brief

**Purpose**: 3 equal concepts displayed (each = giant number + title + two-column description).
**Applicable content types**: **3 equal concepts in depth** (count = 3; carries more text than P5). Each card is content-rich (giant number + title + two-column paragraph description). 01/02/03 are numbered anchors, not real data. Typical: three rebuttals, three forces, three main arguments.
**Skeleton**: Left 5/16 ink hero block (t-cat + 4-line heading + dot-matrix decoration) / right 11/16 three horizontally stacked cards.
**Key classes**: `.three-forces` `.hero-ink-col` `.force-card` (`.card-fill`) `.force-num` (9.2vw IKB blue)
**Animation recipe**: `three-forces` — left hero slides in horizontally → right 3 cards staircase-slide from right → giant blue numbers pop individually
**Note**: **All 3 cards must have a uniform style** (all use `.card-fill` grey background; do not mix outlined/blue backgrounds); to highlight one card, switch it to `.card-accent`; **blue background + border is forbidden**.

---

### P14 · Loop Diagram · Closed-Loop Diagram

**Purpose**: Self-learning cycle, automated flow (3-5 step loop).
**Applicable content types**: **Cyclic / closed-loop flow** (endpoint returns to start, 3-5 steps). Examples: self-learning cycle, CI/CD, feedback loop, agent loop. **Linear flows are forbidden** (that is P11's domain).
**Skeleton**: Left 4 numbered steps (top-aligned) / right SVG concentric rings / center giant text LOOP / nodes use uniform grey square-corner blocks (no alternating color circle dots).
**Key classes**: `.loop-diagram` `.loop-steps` `.loop-svg`
**Animation recipe**: `loop-form` — left steps sequence vertically → right SVG ring stroke-dashoffset traces → nodes light up in sequence
**Note**: Left and right **horizontally centered overall** (top-aligned + equal height)

---

### P15 · Image Matrix + Hero Stat · Matrix + Large-Number Footer

**Purpose**: Large number of same-type items (8-12 skills / team members / case icons) with one summary data point at the bottom.
**Applicable content types**: **8-12 same-type small items + one summary metric.** Each item carries only a short title (no expansion); the bottom giant number is a "summary value" (total count / total traffic / total users). **Fewer items → use P4 (6 items).**
**Skeleton**: Top heading (9vh gap) / middle 4×3 matrix cards (each fixed at 12vh) / bottom giant number + label (margin-top:auto pushed to bottom).
**Key classes**: `.matrix-fill` (grid-template-columns:repeat(4,1fr)) `.matrix-cell` (`.card-fill` grey background, **no border**) `.hero-stat-bottom`
**Animation recipe**: `matrix-fill` — 12 cells appear in random chessboard order (random delay per cell) → bottom giant number counts up
**Note**: Card height is fixed (prevents large numbers from overflowing); **all cards use `.card-fill` grey background**; only switch to `.card-accent` to highlight a single item

---

### P16 · Multi-card Brief · Micro-Card Brief

**Purpose**: 6 small parallel cards (news, tip collection, feature overview).
**Applicable content types**: **6 lightweight short items / tips / footnotes** (count = 6; each item has a short main text + small footnote). More fragmented than P4; suited for news-brief style. **Only one accent blue highlight allowed** (single focus rule).
**Skeleton**: Top large heading (9vh gap) / below 3×2 micro-cards (each card: top-left main text + bottom-right small text + center empty space).
**Key classes**: `.brief-grid` `.brief-card` (`.card-fill` grey background) `.brief-card.is-accent` (single blue highlight)
**Animation recipe**: `field-notes` — 6 cards light up in Z-order (L→R, T→B, 90ms stagger)
**Note**: Card layout **top-left main text + bottom-right small text**, center empty (avoids scattered content); **only one accent blue card allowed**

---

### P17 · System Diagram · Concentric Circle System Diagram

**Purpose**: Hierarchical architecture (core→middle→outer), ecosystem map.
**Applicable content types**: **Strictly three-layer nested relationship** (core / middle layer / outer ring). Typical: technology stack layers, ecosystem tiers, influence radiation. **Non-three-layer structures are forbidden** (flat → use P4; unclear hierarchy → use P5).
**Skeleton**: Left half heading + three-paragraph description / right half SVG three concentric rings + label leader lines.
**Key classes**: `.system-diagram` `.sys-svg` `.sys-label`
**Animation recipe**: `system-diagram` — concentric rings scale in from outside to inside → labels appear in sequence

---

### P18 · Why Now · Three-Column Progression + Giant Number

**Purpose**: Three arguments + supporting data (why now).
**Applicable content types**: **3 arguments, each with one quantitative data point.** Each argument structure = t-cat label + one sentence heading + paragraph + one bottom giant number (percentage/year/multiplier). The last column uses IKB blue emphasis to represent the "key supporting argument."
**Skeleton**: Top large heading / middle 3 columns (each: t-cat + heading + description) / bottom of each column has one 8.4vw giant number (01/02/03; last column IKB blue emphasis).
**Key classes**: `.why-now-grid` `.why-col` `.why-num-bottom` (8.4vw, weight 200)
**Animation recipe**: `why-now` — three columns progress vertically → bottom giant numbers count up
**Note**: Giant numbers have uniform size; use only color (IKB blue) to highlight the last column — **do not** use bold

---

### P19 · Four Cards · Four Equal-Column Cards

**Purpose**: 4 parallel features/characteristics (equal weight).
**Applicable content types**: **4 equal-weight features / modules** (count = 4; completely homogeneous structure). Each item = t-meta number + large text heading + one descriptive paragraph. No data dimension, purely qualitative. More balanced than P5 (three steps), more purely textual than P6 (data height).
**Skeleton**: Top 80px IKB blue short hairline top line + large double-row heading / below 4 equal-column cards (each: t-meta top "— 01 / SLASH" + large text heading + paragraph description).
**Key classes**: `.four-cards` `.fc-col`
**Animation recipe**: `four-cards` — top blue line width 0→100% → 4 columns push up from below (110ms stagger per column)
**Note**: **Do not** use 9px circular decoration dots (not part of the square-corner language); use `.t-meta` text instead

---

### P20 · Stacked KPI Ledger · Vertical Ledger KPI

**Purpose**: 4-6 rows of core data in ledger style (each row = number + label + icon).
**Applicable content types**: **4-6 core data ledger entries** (each row must have a real value + label + icon). Vertical ledger form suits financial data, KPI dashboards, and key metric lists. Accommodates more data than P6 KPI Tower but is less visually impactful (no bar height comparison).
**Skeleton**: Each row separated by a hairline / left giant number (max height `min(13vw,16vh)` to prevent overflow) / center label / right Lucide icon.
**Key classes**: `.stacked-ledger` `.ledger-row` (border-bottom:1px solid var(--border-subtle)) `.ledger-num`
**Animation recipe**: `stacked-ledger` — each row's number rises → label slides left → icon pops (180ms stagger per row)
**Note**: **Font size must be height-constrained** (`font-size:min(13vw, 16vh)`); otherwise lower rows will be pushed off the screen on a standard 16:9 display

---

### P21 · Tech Spec Sheet · Tech Spec Sheet

**Purpose**: Product specs, benchmark data, and performance baseline display (multiple KPIs + vertical line visual decoration).
**Applicable content types**: **Product specs / benchmark / performance baseline** (must have real multi-dimensional data: 3 KPIs + 9 vertical lines = 12+ data points). Typical: model scores, API performance, load test results. The highest data density layout in the deck.
**Skeleton**: Left 4-line large heading / middle 3 KPIs (top hairline + number + unit) / bottom-right 9 vertical bars of varying heights / bottom giant number + yearly goal + three tags + bottom-right MP-XX + page number.
**Key classes**: `.tech-spec` `.spec-title-col` `.spec-kpi-grid` `.spec-bars` (`.bar-vert`, scaleY spring, transform-origin:bottom)
**Animation recipe**: `tech-spec` — hero area fades in → heading enters → KPI top lines draw one by one → bottom giant number pops → vertical bars spring up from the bottom (50ms stagger)
**Note**: Bottom-right bar matrix must be **bottom-aligned** and **must not overflow the right margin**

---

### P22 · Image Hero · Image Hero

**Purpose**: Case study display, product image + data, chapter cover with image.
**Applicable content types**: **Case study / product launch / chapter cover with image** (must have real image assets + 3 core data points). Typical: product screenshot + key metrics, case image + ROI, user feedback image + repurchase rate. **Forbidden without a real image source** (placeholder grey images destroy the visual).
**Skeleton**: Upper 60% full-width image + top-left white background title block overlay (top:11vh, with generous buffer) / lower 40% long description + three-column KPIs ($ / 127× / 100%).
**Key classes**: `.image-hero` `.hero-img-wrap` (60vh) `.hero-overlay-block` `.hero-stats`
**Animation recipe**: `image-hero` — image slowly zooms out (scale 1.05→1) → white block scaleX 0→1 pushes open → three KPI top lines draw in sequence
**Notes**:
- Prefer local file `images/{slide-number}-{semantic}.png` (GPT-M 2.0 or user-provided asset); do not default to external Unsplash links
- Content below the image should not sit directly against the image bottom edge; use `.image-hero-body` to add consistent top buffer for the lower half
- Three-column KPI large font size must be height-constrained (`min(4.6vw, 7.6vh)`); small text uses `margin-top:auto` anchored at the column bottom to prevent overflow into nav dots
- Column heights are uniform (grid must not use `align-items:start`; let columns stretch to the same height)

**Example code**:
```html
<section class="slide light" data-animate="image-hero">
  <div class="canvas-card" style="padding:0;display:flex;flex-direction:column;overflow:hidden">
    <div data-anim="img" style="position:relative;flex:0 0 60%;overflow:hidden;background:var(--grey-1)">
      <img src="images/22-product-scene.png" alt="[required] Image description" loading="eager"
           style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%">
      <div class="chrome-min" style="position:absolute;top:0;left:0;right:0;color:rgba(255,255,255,.9);padding:5.6vh 5vw 0">
        <div class="l">Section · Case / Visual Evidence</div>
        <div class="r">22 / NN</div>
      </div>
      <div data-anim="title-block" style="position:absolute;left:5vw;top:11vh;background:var(--paper);padding:3.2vh 3.2vw;max-width:40vw">
        <div style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(5.2vw,9vh);line-height:1;letter-spacing:-.035em;color:var(--text-primary)">
          [required] Image<br>Evidence
        </div>
      </div>
    </div>
    <div data-anim="kpi" class="image-hero-body">
      <div style="max-width:48ch;font-family:var(--sans),var(--sans-zh);font-size:max(15px,1.3vw);line-height:1.55;font-weight:300;color:var(--text-primary);letter-spacing:-.005em">
        [required] 1-2 lines explaining why this image matters; do not repeat the heading.
      </div>
      <div class="image-hero-stats" style="gap:4vw">
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">Metric 01</div><div style="font-family:var(--sans);font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em">12×</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">[required] Metric explanation</p></div>
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">Metric 02</div><div style="font-family:var(--sans);font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em">3.4h</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">[required] Metric explanation</p></div>
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">Metric 03</div><div style="font-family:var(--sans);font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em;color:var(--accent)">100%</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">[required] Metric explanation</p></div>
      </div>
    </div>
  </div>
</section>
```

---

## Legacy Experimental Area (disabled by default)

The P23/P24 layouts below were added early on to explore mixed image/text arrangements. They are not part of the original 22 layouts and must not be used for official generation by default. Unless the user explicitly says "I want to try a new image/text layout," use S22 or the S15/S16 image slots instead.

### P23 · Swiss Image Split · Left-Text/Right-Image or Right-Text/Left-Image (experimental, disabled by default)

**Purpose**: Pairing a viewpoint explanation with a documentary photo, infographic, UI context image, or system diagram.
**Applicable content types**: **One core argument + one core image.** Suitable for "left large heading + right image evidence" or "left image + right explanation." If the image is the starring element and needs KPIs, use P22; if there are multiple images, use P24.
**Skeleton**: Head stacked vertically inside `.canvas-card` / body `.swiss-img-split` two columns (5:7 or reverse 7:5) / image below `.swiss-img-caption`.
**Key classes**: `.swiss-img-split` `.swiss-img-copy` `.frame-img.r-16x10.fit-contain|cover` `.swiss-img-caption`
**Animation recipe**: `grid-reveal` — head enters first; image and text block appear staggered
**Notes**:
- The image typically aligns with the first line of body text, not the top of the large heading; add `padding-top:1vh` to `3vh` to the image column if needed
- To bottom-align the left content block with the right image bottom, use `.swiss-img-split.align-image-bottom`; do not force it with extra blank lines
- `.align-image-bottom` has a built-in bottom nav safe zone; do not push the image or caption further toward the page bottom
- Avoid meaningless dividing lines in the left content block; do not add an extra `.rule` unless a chapter sense is needed
- Infographics/UI images must use `.fit-contain`; documentary photos default to cover
- With a wide right image, the heading must not exceed 3 lines, and body text should be 2-3 short paragraphs or 3 bullet points

```html
<section class="slide light" data-animate="grid-reveal">
  <div class="canvas-card">
    <div class="chrome-min">
      <div class="l">Section · Visual Argument</div>
      <div class="r">23 / NN</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr;gap:5vh">
      <div data-anim="head" style="display:flex;flex-direction:column;gap:1.4vh">
        <div class="t-meta">Evidence · GPT-M 2.0</div>
        <h2 style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(7vw,12vh);line-height:.96;letter-spacing:-.035em">[required] One core argument</h2>
      </div>
      <div class="swiss-img-split align-image-bottom" data-anim="up">
        <div class="swiss-img-copy">
          <div class="t-cat" style="color:var(--accent)">Why it matters</div>
          <p class="lead" style="font-weight:300;max-width:36ch">[required] 2-3 lines explaining the relationship between the image and the argument.</p>
          <div class="body" style="font-weight:300;color:var(--text-secondary)">[required] 2-3 short bullets or a brief explanation; maintain left alignment and generous whitespace.</div>
        </div>
        <figure class="tile">
          <div class="frame-img r-16x10 fit-contain">
            <img src="images/23-visual-evidence.png" alt="[required] Image description">
          </div>
          <figcaption class="swiss-img-caption"><strong>[required] Image title</strong><span>16:10 · fit-contain</span></figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>
```

---

### P24 · Swiss Evidence Grid · Multi-Image Evidence Wall (experimental, disabled by default)

**Purpose**: Three same-type images/screenshots/charts in parallel — displaying an evidence chain or multi-case comparison.
**Applicable content types**: **2-3 same-type images.** Suitable for UI screenshot redesigns, three-stage flowcharts, three documentary shots, three small data charts. Mixing different types breaks Swiss order.
**Skeleton**: Head stacked vertically / `.swiss-img-grid` three columns / each tile uses the same `.h-22` or `.h-26`.
**Key classes**: `.swiss-img-grid` `.frame-img.h-22|h-26` `.fit-contain` `.swiss-img-caption`
**Animation recipe**: `grid-reveal`
**Notes**:
- Images in the same group must have the same aspect ratio, same height, and same margin density; do not mix 16:9, 4:3, and long strip screenshots
- There must be obvious buffer between the heading area and image area; `.swiss-img-grid` has built-in top spacing by default; only add `.tight` when the outer grid already provides enough gap
- UI/infographics uniformly use `.fit-contain`; photos uniformly use cover
- If user original screenshot ratios are inconsistent, first apply the CleanShot-X-style programmatic approach from `screenshot-framing.md`; only use GPT-M 2.0 to regenerate a "screenshot redesign" to the same ratio if the image is too long, too narrow, or requires information restructuring

```html
<section class="slide light" data-animate="grid-reveal">
  <div class="canvas-card">
    <div class="chrome-min">
      <div class="l">Section · Evidence Grid</div>
      <div class="r">24 / NN</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr;gap:6vh">
      <div data-anim="head" style="display:flex;flex-direction:column;gap:1.4vh">
        <div class="t-meta">Three visual proofs</div>
        <h2 style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(6.6vw,11.6vh);line-height:.96;letter-spacing:-.035em">[required] Three pieces of evidence, one conclusion</h2>
      </div>
      <div class="swiss-img-grid" data-anim="up">
        <figure class="tile"><div class="frame-img h-26 fit-contain"><img src="images/24-proof-a.png" alt="[required]"></div><figcaption class="swiss-img-caption"><strong>01</strong><span>[required] Evidence A</span></figcaption></figure>
        <figure class="tile"><div class="frame-img h-26 fit-contain"><img src="images/24-proof-b.png" alt="[required]"></div><figcaption class="swiss-img-caption"><strong>02</strong><span>[required] Evidence B</span></figcaption></figure>
        <figure class="tile"><div class="frame-img h-26 fit-contain swiss-lined"><img src="images/24-proof-c.png" alt="[required]"></div><figcaption class="swiss-img-caption"><strong>03</strong><span>[required] Key evidence</span></figcaption></figure>
      </div>
    </div>
  </div>
</section>
```

---

## Layout Selection Index (decision table for LLM)

| Content intent | Recommended layout |
|---|---|
| Deck opening cover | P1 Cover |
| Evolutionary comparison / timeline (vertical) | P2 Vertical Timeline |
| One slogan / chapter opening | P3 Statement / P10 Dot Matrix |
| 6 concept definitions | P4 Six Cells |
| Three-step flow (light) | P5 Three Sub-cards |
| 4 data items with visual height comparison | P6 KPI Tower |
| 5-10 item ranking comparison | P7 H-Bar Chart |
| Before/After / dual-track comparison | P8 Duo Compare |
| Entire deck closing | P9 Closing Manifesto |
| Multi-step flow (horizontal, 4-7 steps) | P11 Horizontal Timeline |
| Intermediate conclusion + ink full-width strip | P12 Manifesto + Banner |
| 3 equal concepts in depth | P13 Three Forces Cards |
| Closed-loop flow / self-learning cycle | P14 Loop Diagram |
| 8-12 item matrix + total data | P15 Image Matrix |
| 6 quick-note micro-cards | P16 Multi-card Brief |
| Hierarchical architecture / concentric system | P17 System Diagram |
| Three arguments + data support | P18 Why Now |
| 4 equal-weight features | P19 Four Cards |
| 4-6 row ledger KPI | P20 Stacked Ledger |
| Product specs / benchmark | P21 Tech Spec |
| Case image + data landing | P22 Image Hero |
| Location / route / character residences | S08 + Swiss Map Component |
| Single image explaining an argument / mixed image/text | P23 Swiss Image Split |
| 2-3 images/screenshots/charts evidence chain | P24 Swiss Evidence Grid |

---

## Layout Selection P0 Rule: content data type must match the layout

> This is **the easiest pitfall** when writing a deck. A layout's capacity for content is fixed — you must look at the content first, then choose the layout. **Never choose a layout first and then force content into it.**

| Content type | Must use | Strictly forbidden |
|---|---|---|
| Real quantitative data (percentages/values) | P6 KPI Tower / P7 H-Bar / P20 Ledger / P21 Tech Spec | P3 / P4 / P10 / P13 (no-data layouts) |
| No data, purely qualitative assertion | P3 / P10 Statement / P12 / P13 / P19 | ⚠️ **P7 H-Bar / P6 KPI Tower** (fabricated numbers will be exposed) |
| 4 equal items | P19 Four Cards / P6 (with data) | Do not force-count to 6 and use P4 |
| 6 equal items | P4 Six Cells / P16 Brief | Do not force-count to 4 and use P19 |
| 3 equal items | P5 Sub-cards / P13 Three Forces | |
| Before/After | P8 Duo Compare (must be exactly 2 items) | |
| Location/route/city relationship | S08 + Swiss Map Component | Ordinary S04/S16 card listing |
| Closed-loop structure | P14 Loop Diagram | P11 horizontal flow (linear ≠ closed loop) |
| Three-layer nesting | P17 System Diagram | |
| Time evolution (with data) | P2 Vertical Timeline | |
| Multi-step flow (no data) | P11 Horizontal Timeline | |
| 8-12 same-type items | P15 Image Matrix | |
| Deck closing | P9 Closing (once per deck) | |
| 1 core image + explanation | P23 Swiss Image Split | P22 (unless image is the star and has KPIs) |
| 2-3 same-type images | P24 Evidence Grid | P4/P16 (text cards, not image evidence) |

**Landmine example**: using P7 H-Bar Chart for "intelligent completion / real-time collaboration / autonomous agent" — a **concept listing with no comparable percentages** — and fabricating numbers like 96/88/78 → **data is untrustworthy, layout is abused.** This content should use P2 (if there is a time dimension) or P3 Statement (if it is an assertion).

---

## Common Errors (P0 checklist)

1. ❌ Adding `border-radius` to cards → ✅ Square corners are mandatory
2. ❌ Adding an outline to `.card-accent` → ✅ Card fill types are mutually exclusive
3. ❌ Drawing SVG icons yourself → ✅ Use the `lucide` online library; angular style
4. ❌ Using grid `justify-self` to align timeline dot with dashed line → ✅ Axis column fixed at 12px + dot absolute-positioned
5. ❌ Large font size without height constraint (`13vw`) → ✅ Always `min(Xvw, Yvh)` dual constraint
6. ❌ ESC index view thumbnails can't show animated content → ✅ Add visibility-override CSS to cloned slides
7. ❌ All pages use the same fade-up recipe → ✅ One semantic recipe per page, coupled with visual structure
8. ❌ Heading + card gap < 5vh → ✅ Section-level headings need at least 9vh
9. ❌ 9px circular decoration dots → ✅ 8×8 square-corner blocks / mono `t-meta` text
10. ❌ Decorative elements overflowing page margins → ✅ Strictly inside the grid; no edge-hugging
