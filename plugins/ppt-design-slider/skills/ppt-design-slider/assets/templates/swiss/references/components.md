# Component Reference · Components

This is the component manual for the `guizang-ppt-skill` skill. `template.html` already defines all styles; this document only covers "what each component looks like and how to use it."

## Table of Contents

- [Basic Slide Shell](#basic-slide-shell)
- [Typography](#typography)
- [Chrome & Foot](#chrome--foot)
- [Callout Quote Box](#callout-quote-box)
- [Stat Number Matrix](#stat-number-matrix)
- [Platform Card](#platform-card)
- [Rowline Table Row](#rowline-table-row)
- [Pillar Card](#pillar-card)
- [Tag & Kicker](#tag--kicker)
- [Figure Image Frame](#figure-image-frame)
- [Icons](#icons)
- [Ghost Giant Background Text](#ghost-giant-background-text)
- [Highlight Marker](#highlight-marker)
- [Motion Animation System](#motion-animation-system)

---

## Basic Slide Shell

Every page is a `<section class="slide ...">`. It must include a `data-theme` attribute (`light` or `dark`); JS uses this when turning pages to switch the background.

```html
<section class="slide light" data-theme="light">   <!-- Light page -->
<section class="slide dark" data-theme="dark">     <!-- Dark page -->
<section class="slide light hero" data-theme="light">  <!-- Hero page: light + thin overlay lets WebGL through -->
<section class="slide dark hero" data-theme="dark">    <!-- Hero page: dark + thin overlay -->
```

**light vs dark usage: alternate**, switching every 2-3 pages to avoid more than 3 consecutive same-color pages. The WebGL background automatically transitions between the two shaders when turning pages.

**hero class usage**: only add to visually dominant pages (cover, key-quote page, section transition, closing). Adding `hero` drops the overlay to 12-16%, letting the WebGL background show strongly — do not put too much text on a hero page.

---

## Typography

Font roles are the most important rule in this template — mixing is strictly forbidden.

| Class | Purpose | Font |
|---|---|---|
| `.display` | Oversized English (Hero page) | Playfair Display 700, 11vw |
| `.display-zh` | Oversized Chinese heading | Noto Serif SC 700, 7.8vw |
| `.h1-zh` | Page main heading | Noto Serif SC 700, 4.6vw |
| `.h2-zh` | Subheading | Noto Serif SC 600, 3.2vw |
| `.h3-zh` | Pipeline step heading | Noto Serif SC 500, 1.9vw |
| `.lead` | Lead paragraph (larger than body) | Noto Serif SC 400, 1.9vw |
| `.body-zh` | **Body / description (sans-serif)** | Noto Sans SC 400, 1.22vw |
| `.body-serif` | Body text (serif) | Noto Serif SC 400, 1.3vw |
| `.kicker` | Section cue (above heading) | IBM Plex Mono, 12px uppercase |
| `.meta` | Metadata label | IBM Plex Mono, 0.88vw uppercase |
| `.big-num` | Giant number | Playfair Display 800, 10vw |
| `.mid-num` | Medium number | Playfair Display 700, 5.5vw |

**Core rules**:
- **Serif** (`serif-zh` / `serif-en`): headings, key quotes, numbers — used for "visual accent"
- **Sans-serif** (`sans-zh`): body descriptions, long reading content — used for "information density"
- **Monospace** (`mono`): kicker, meta, footer English labels — used for "decorative rhythm"

**Emphasis techniques**:
- `<em class="en">English word</em>` — renders English words in Playfair Display italic (looks excellent)
- `<em style="opacity:.65">phrase</em>` — fades out the latter part of a heading for rhythmic effect

---

## Chrome & Foot

The top and bottom metadata strips on every page. Nearly all pages should have them.

```html
<div class="chrome">
  <div class="left">
    <span>Act I · Hard Data</span>
    <span class="sep"></span>
    <span>Act I</span>
  </div>
  <div class="right"><span>02 / 27</span></div>
</div>

<!-- ... page body ... -->

<div class="foot">
  <div class="title">Project Name · CodePilot　|　github.com/codepilot</div>
  <div>Act I · Dev Numbers</div>
</div>
```

**Rules**:
- `chrome.right` always holds the page number `NN / TOTAL` (TOTAL = total page count)
- `foot.title` is a short description; `foot.right` is the English act marker
- chrome and foot together create the "magazine header/footer" feel

---

## Callout Quote Box

Displays a key quote / key insight / citation.

```html
<div class="callout" style="max-width:80vw">
  <div class="q-big">"Three years ago,<br>this needed a ten-person team a full year."</div>
  <span class="cite">— An observer's assessment</span>
</div>
```

Variants:
- Without cite: remove `<span class="cite">`
- With English quote: `<em class="en">"Thin Harness, Fat Skills."</em>`
- Used on a hero page: wrap the outer element with `style="position:relative;z-index:2"` (to prevent the background overlay from covering it)

---

## Stat Number Matrix

Displays data metrics; commonly used with `.grid-6` / `.grid-4`.

```html
<div class="grid-6">
  <div class="stat">
    <span class="m">Duration</span>
    <span class="n">64<em style="font-size:.4em;opacity:.5;font-style:normal"> days</em></span>
    <span class="l">From zero to now</span>
  </div>
  <!-- ... more stats ... -->
</div>
```

Three-part structure: `.m` monospace small label → `.n` giant number → `.l` description. Units after numbers use `<em>` scaled to 0.4em, opacity 0.5.

**Common layout containers**:
- `.grid-6` — 3×2 grid (most common, 6 stats)
- `.grid-4` — 2×2 grid (4 stats)
- `.grid-3` — 3-column single row (3 stats / pillars)

---

## Platform Card

Displays a social platform / channel + follower count.

```html
<div class="plat">
  <div class="sub">Weibo</div>
  <div class="name">Weibo</div>
  <div class="nb">289K</div>
</div>
```

Optional fourth line (supplementary note):
```html
<div class="body-zh" style="font-size:max(11px,.8vw);opacity:.5;margin-top:.6vh">
  Including Xiaohongshu sync
</div>
```

**"Also On" variant** (supplementary platforms):
```html
<div class="plat" style="border-top-style:dashed;opacity:.72">
  <div class="sub">Also On</div>
  <div class="body-zh" style="font-weight:600;margin-top:.8vh">
    Bilibili　·　Zhihu
  </div>
</div>
```

---

## Rowline Table Row

List-style content; one entry per row.

```html
<div class="rowline">
  <div class="k">AGENTS.md</div>
  <div class="v">How you should work — behavior rules + work preferences + prohibited actions</div>
  <div class="m">EMPLOYEE · HANDBOOK</div>
</div>
```

Three-column structure: `.k` serif keyword · `.v` body description · `.m` monospace label (right-aligned). The first and last rowline automatically get top and bottom borders.

**Two-column variant**: `style="grid-template-columns:1fr 3fr"` — remove the `.m` column.

---

## Pillar Card

Three-pillar structure; commonly used for "parallel concepts" pages.

```html
<div class="grid-3">
  <div class="pillar">
    <div class="ic">01</div>
    <div class="t">Three-layer<br>documentation system</div>
    <div class="d">AGENTS.md<br>+ project knowledge base<br>+ guardrail files</div>
  </div>
  <!-- ... more pillars ... -->
</div>
```

**Icon pillar (for emphasis pages)**:
```html
<div class="pillar" style="padding:4vh 2vw;border:1px solid currentColor;border-color:rgba(10,10,11,.2)">
  <div class="ic"><i data-lucide="compass" class="ico-lg"></i></div>
  <div class="t">Judgment</div>
  <div class="d">Authority over decisions and direction.<br>Trade-offs, taste, and a sense of direction.</div>
</div>
```

`.ic` can be an index number (`01 / 02 / 03` or `A. / B. / C.`) or a Lucide icon.

---

## Tag & Kicker

**Kicker** is a small cue text above the heading (monospace, all-caps, small):
```html
<div class="kicker">Past 64 days · Development</div>
<div class="h1-zh">One person — what they did.</div>
```

**Tag** is a standalone label capsule (with border):
```html
<div style="display:flex;gap:1.6vw;flex-wrap:wrap">
  <div class="tag">Wake up at 10am</div>
  <div class="tag">Gym Tuesday / Thursday afternoons</div>
  <div class="tag">Still watching shows · playing games at night</div>
</div>
```

---

## Figure Image Frame

**This is the most error-prone component in the template — the following rules are mandatory.**

### Basic structure

```html
<figure class="tile">
  <div class="frame-img" style="height:26vh">
    <img src="images/xxx.png" alt="Description">
  </div>
  <figcaption class="frame-cap">
    <span class="pf">Twitter</span>
    <span class="nb">137K</span>
  </figcaption>
</figure>
```

### Critical constraints (hard-won experience — do not violate)

1. **Image grids must use `height:Nvh` for a fixed height** — do not use `aspect-ratio`.
   - Reason: `aspect-ratio` inside a grid easily overflows the parent container, causing images to stack.
   - Recommended sizes: `.h-16` (small panel) / `.h-18` (compact strip) / `.h-22` (standard grid) / `.h-26` (featured) / `.h-28` (large image).
   - A standalone main image may use the template's aspect ratio classes: `.r-16x9` / `.r-16x10` / `.r-4x3` / `.r-3x2` / `.r-3x4` / `.r-1x1`.
   - All images in the same group must use the same height class; do not mix `25vh` for one and `21vh` for another.

2. **`object-position:top center` (already set in CSS)** — only the bottom may be cropped.
   - Cropping left, right, or top is strictly forbidden — these areas hold the core identity of the image.

3. **For multiple images in a grid, use inline grid rather than `.grid-3`**:
   ```html
   <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1vh 1.2vw">
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
   </div>
   ```

4. **Aligning images with other layout elements**: use the `.grid-2-7-5` / `.grid-2-6-6` / `.grid-2-8-4` grid structure for natural top alignment. Do not add `align-self:end` to images.

5. **Infographics / screenshots**: add `.fit-contain` to `.frame-img` to prevent text and annotations inside the image from being cropped.

6. **When a user's original screenshot has an incompatible aspect ratio**: prioritize the programmatic CleanShot-X-style approach from `screenshot-framing.md`; only regenerate a "redesigned screenshot / UI context image" if the screenshot is too long, too narrow, or requires information restructuring.

### Frame Caption variants

```html
<!-- Standard: figure name on the left, number on the right -->
<figcaption class="frame-cap">
  <span class="pf">Twitter</span>
  <span class="nb">137K</span>
</figcaption>

<!-- With index number -->
<figcaption class="frame-cap">
  <span class="idx">01</span>
  <span class="pf">AI Polish</span>
  <span>Polish</span>
</figcaption>
```

### Image placeholder (design-phase placeholder)

When an image is not yet available, use a dashed-border placeholder:
```html
<div class="img-slot r-4x3">  <!-- r-4x3 / r-16x9(default) / r-3x2 / r-1x1 -->
  <span class="plus">+</span>
  <span class="label">GitHub screenshot position</span>
</div>
```

---

## Icons

**Emoji are strictly forbidden.** Use Lucide via CDN (already included in `template.html`).

```html
<i data-lucide="compass" class="ico-lg"></i>     <!-- Large icon (for pillars) -->
<i data-lucide="target" class="ico-md"></i>      <!-- Medium icon (for list items) -->
<i data-lucide="check-circle" class="ico-sm"></i>  <!-- Small icon (for inline use) -->
```

**Common Lucide icon names** (grouped by meaning):

- Judgment: `compass`, `target`, `crosshair`, `search-check`
- Relationship: `share-2`, `users`, `network`, `link`, `handshake`
- Brand: `crown`, `gem`, `award`, `star`, `badge-check`
- Process: `workflow`, `route`, `arrow-right-left`, `repeat`
- Data: `grid-2x2`, `bar-chart-3`, `trending-up`, `activity`
- Aesthetic: `palette`, `brush`, `eye`, `sparkles`
- Right/wrong: `check-circle`, `x-circle`, `check`, `x`
- Direction: `arrow-right`, `arrow-up-right`, `corner-down-right`

**Inline icon + text combination**:
```html
<div class="h3-zh" style="display:flex;align-items:center;gap:.8em">
  <i data-lucide="target" class="ico-md"></i>
  Judgment — what is worth writing
</div>
```

---

## Ghost Giant Background Text

Used as a "decorative background word" at extremely low opacity to create a magazine feel.

```html
<div class="ghost" style="right:-6vw;top:-8vh">BUT</div>
<div class="ghost" style="left:-8vw;bottom:-18vh;font-style:italic">Harness</div>
```

- Font size 34vw, opacity 0.06
- Common positions: `right:-6vw;top:-8vh` (extends beyond top-right) / `left:-8vw;bottom:-18vh` (extends beyond bottom-left)
- Content: English words or numbers (section numbers 01/02/03, keywords BUT/NOW/HERE)

**Note**: Other content on pages using ghost must have `position:relative;z-index:2` to avoid being buried beneath it.

---

## Highlight Marker

"Highlighter" effect for inline phrases:

```html
<span class="hi">not</span>
<span class="hi">a one-time burst</span>
```

Generates a semi-transparent highlight bar at the bottom of the text. Dark themes use a light bar; light themes use a dark bar (handled by CSS).

**Appropriate use**: only on 1-3 key words; do not apply broadly.

---

## Motion Animation System

The entire deck has entry animations enabled by default, powered by Motion One (the vanilla version of Framer Motion, ~4KB).

### Loading

The module script at the bottom of `assets/template.html` first tries **local** `assets/motion.min.js`, falls back to **jsdelivr CDN**, and if both fail, forces all elements with `data-anim` to `opacity:1` — content is always readable and presentation does not depend on a network.

```js
// Core loader in the template (do not modify)
let motion;
try { motion = await import('./assets/motion.min.js'); }
catch(e1) {
  try { motion = await import('https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm'); }
  catch(e2) {
    document.querySelectorAll('[data-anim]').forEach(el=>{el.style.opacity='1';el.style.transform='none'});
  }
}
```

### Data-attribute driven

You only need to add two types of attributes in HTML:

```html
<!-- 1. Select recipe on the section (optional; defaults to cascade / hero auto) -->
<section class="slide light" data-animate="quote">

<!-- 2. Add data-anim to elements that should have entry animations (optional values: left/right/line/step/divider) -->
<h1 class="h-xl" data-anim>Main heading</h1>
<div class="stat-card" data-anim>...</div>
<div data-anim="left">Left column content</div>
<span data-anim="line" style="display:block">Quote line one</span>
```

### 5 recipes at a glance

| Recipe | Trigger | Behavior | Representative layouts |
|---|---|---|---|
| `cascade` (default) | No `data-animate` needed | All `data-anim` elements stagger-fade in, 75ms/step | Layout 3 / 4 / 5 / 10 |
| `hero` | `.hero` slide uses this automatically | Slower stagger, more ceremonial, 160ms/step | Layout 1 / 2 / 7 |
| `quote` | `data-animate="quote"` | Other elements appear first; `data-anim="line"` rows reveal one sentence at a time with 550ms interval | Layout 8 |
| `directional` | `data-animate="directional"` | `data-anim="left"` slides in from left → divider → `data-anim="right"` slides in from right | Layout 9 |
| `pipeline` | `data-animate="pipeline"` | Steps start at 15% opacity when the slide appears; pressing →/space/scroll lights up each step; only after all steps are lit does → advance the slide | Layout 6 |

### Decision tree for choosing a recipe

1. **Is it a `.hero` slide?** → No `data-animate` needed; `hero` is used automatically
2. **Is it a large quote page?** → `data-animate="quote"`, each sentence uses `<span data-anim="line" style="display:block">`
3. **Is it a left/right Before/After comparison?** → `data-animate="directional"`, left column `data-anim="left"`, right column `data-anim="right"`
4. **Is it a step-by-step pipeline?** → `data-animate="pipeline"`, each step `data-anim="step"`
5. **All other body pages** → nothing to add; `cascade` is used automatically

### Which elements should get `data-anim`?

- ✅ Every block with independent semantic meaning: kicker / h1 / h-xl / lead / callout / stat-card / figure / tag / rowline
- ✅ Each column in a multi-column structure, so columns fade in sequentially rather than simultaneously
- ❌ Do not add to containers (`.grid-6` / `.frame`); only add to leaf elements
- ❌ Do not add to every `<li>`; adding at the `<ul>` level is generally sufficient
- ❌ If a page should have no animation (e.g. a transition page), omit all `data-anim` — Motion One only acts on marked elements

### Common issues

- **Image flashes then appears?** Expected behavior; animation triggers at 450ms into the page turn
- **Pipeline page stuck, can't advance?** Correct — press → step by step to light up each step; only after all are lit does → advance the slide
- **Content invisible even in static mode?** Check whether `motion.min.js` is in `assets/`; or check the browser console for errors
