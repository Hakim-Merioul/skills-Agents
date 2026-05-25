# Component Reference · Components

This is the component handbook for the `guizang-ppt-skill` skill. All styles are already defined in template.html — this document only covers "what each component looks like and how to use it."

## Table of Contents

- [Basic Slide Shell](#basic-slide-shell)
- [Typography](#typography)
- [Chrome & Foot](#chrome--foot)
- [Callout Quote Box](#callout-quote-box)
- [Stat Number Grid](#stat-number-grid)
- [Platform Card](#platform-card)
- [Rowline Table Row](#rowline-table-row)
- [Pillar Card](#pillar-card)
- [Tag & Kicker](#tag--kicker)
- [Figure Image Frame](#figure-image-frame)
- [Icons](#icons)
- [Ghost Oversized Background Text](#ghost-oversized-background-text)
- [Highlight Marker](#highlight-marker)
- [Motion Animation System](#motion-animation-system)

---

## Basic Slide Shell

Every page is a `<section class="slide ...">`. It must include a `data-theme` attribute (`light` or `dark`) — JS uses this to switch the background when navigating between slides.

```html
<section class="slide light" data-theme="light">   <!-- Light page -->
<section class="slide dark" data-theme="dark">     <!-- Dark page -->
<section class="slide light hero" data-theme="light">  <!-- Hero page: light + thin mask to reveal WebGL -->
<section class="slide dark hero" data-theme="dark">    <!-- Hero page: dark + thin mask -->
```

**light vs dark usage: alternate them** — switch theme every 2–3 pages, never run more than 3 consecutive pages in the same theme. The WebGL background will smoothly transition between the two shaders on navigation.

**hero class usage**: Only apply to visually dominant pages (cover, key quote, act transition, closing). Adding `hero` drops the overlay to 12–16%, revealing the WebGL background prominently — so do not place dense text on hero pages.

---

## Typography

The typographic hierarchy is the most important rule of this template — mixing fonts is strictly forbidden.

| Class | Purpose | Font |
|---|---|---|
| `.display` | Oversized English text (Hero pages) | Playfair Display 700, 11vw |
| `.display-zh` | Oversized Chinese headline | Noto Serif SC 700, 7.8vw |
| `.h1-zh` | Page main heading | Noto Serif SC 700, 4.6vw |
| `.h2-zh` | Subheading | Noto Serif SC 600, 3.2vw |
| `.h3-zh` | Pipeline step title | Noto Serif SC 500, 1.9vw |
| `.lead` | Lead paragraph (larger than body) | Noto Serif SC 400, 1.9vw |
| `.body-zh` | **Body / description (sans-serif)** | Noto Sans SC 400, 1.22vw |
| `.body-serif` | Body (serif) | Noto Serif SC 400, 1.3vw |
| `.kicker` | Section hint (above heading) | IBM Plex Mono, 12px uppercase |
| `.meta` | Metadata label | IBM Plex Mono, 0.88vw uppercase |
| `.big-num` | Giant number | Playfair Display 800, 10vw |
| `.mid-num` | Medium number | Playfair Display 700, 5.5vw |

**Core rules**:
- **Serif** (`serif-zh` / `serif-en`): headings, key pull quotes, numbers — used as "visual accent"
- **Sans-serif** (`sans-zh`): body descriptions, long reading content — used for "information density"
- **Monospace** (`mono`): kicker, meta, foot English labels — used for "decorative rhythm"

**Emphasis techniques**:
- `<em class="en">English word</em>` — renders the English word in Playfair Display italic (looks great)
- `<em style="opacity:.65">phrase</em>` — fades out the second half of a headline to create rhythm

---

## Chrome & Foot

The top and bottom metadata strips on each page. Nearly every page should include them.

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
  <div class="title">Project · CodePilot　|　github.com/codepilot</div>
  <div>Act I · Dev Numbers</div>
</div>
```

**Rules**:
- `chrome.right` always holds the page number `NN / TOTAL` (TOTAL = total page count)
- `foot.title` is the descriptive label, `foot.right` is the English act marker
- Together chrome and foot form the magazine-style "header and footer"

---

## Callout Quote Box

Displays a key quote / core insight / attributed statement.

```html
<div class="callout" style="max-width:80vw">
  <div class="q-big">"Three years ago, this would have<br>needed a ten-person team working for a year."</div>
  <span class="cite">— An observer's assessment</span>
</div>
```

Variants:
- Without cite: remove the `<span class="cite">` element
- With an English pull quote: `<em class="en">"Thin Harness, Fat Skills."</em>`
- Used on a hero page: add `style="position:relative;z-index:2"` to the outer element (to prevent it being covered by the background overlay)

---

## Stat Number Grid

Displays data metrics — commonly used with `.grid-6` / `.grid-4`.

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

Three-part structure: `.m` monospace small label → `.n` giant number → `.l` descriptive note. The unit after the number uses `<em>` to scale down to 0.4em at opacity 0.5.

**Common layout containers**:
- `.grid-6` — 3×2 grid (most common, 6 stats)
- `.grid-4` — 2×2 grid (4 stats)
- `.grid-3` — 3-equal single row (3 stats / pillars)

---

## Platform Card

Displays a social platform / channel along with its follower count.

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
  Including cross-posted to Little Green Book
</div>
```

**"Also On" variant** (secondary platforms):
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

List-style content with one item per row.

```html
<div class="rowline">
  <div class="k">AGENTS.md</div>
  <div class="v">How to get things done — behavioral rules, work preferences, and prohibitions</div>
  <div class="m">EMPLOYEE · HANDBOOK</div>
</div>
```

Three-column structure: `.k` serif keyword · `.v` body description · `.m` monospace label (right-aligned). The first and last rowline automatically get top and bottom borders.

**Variant: 2 columns**: `style="grid-template-columns:1fr 3fr"` and remove the `.m` column.

---

## Pillar Card

Three-pillar structure, commonly used for "concept parallel" type pages.

```html
<div class="grid-3">
  <div class="pillar">
    <div class="ic">01</div>
    <div class="t">Three-layer<br>Document System</div>
    <div class="d">AGENTS.md<br>+ Project knowledge base<br>+ Guardrail files</div>
  </div>
  <!-- ... more pillars ... -->
</div>
```

**Icon pillar (for emphasis pages)**:
```html
<div class="pillar" style="padding:4vh 2vw;border:1px solid currentColor;border-color:rgba(10,10,11,.2)">
  <div class="ic"><i data-lucide="compass" class="ico-lg"></i></div>
  <div class="t">Judgment</div>
  <div class="d">The authority on decisions and direction.<br>Trade-offs, taste, and a sense of bearing.</div>
</div>
```

`.ic` can be a sequence number (`01 / 02 / 03` or `A. / B. / C.`), or a Lucide icon.

---

## Tag & Kicker

**Kicker** is a small hint text above the heading (monospace, all-caps, small size):
```html
<div class="kicker">Past 64 Days · Development</div>
<div class="h1-zh">One person. What did they build?</div>
```

**Tag** is a standalone label capsule (with border):
```html
<div style="display:flex;gap:1.6vw;flex-wrap:wrap">
  <div class="tag">Up at 10am</div>
  <div class="tag">Gym on Tue / Thu afternoons</div>
  <div class="tag">Still watching shows and gaming at night</div>
</div>
```

---

## Figure Image Frame

**This is the most error-prone component in the template. The rules below must be followed.**

### Basic Structure

```html
<figure class="tile">
  <div class="frame-img" style="height:26vh">
    <img src="images/xxx.png" alt="description">
  </div>
  <figcaption class="frame-cap">
    <span class="pf">Twitter</span>
    <span class="nb">137K</span>
  </figcaption>
</figure>
```

### Key Constraints (Learned the hard way — do not break these)

1. **Image grids must use `height:Nvh` to fix height** — never use `aspect-ratio`.
   - Reason: `aspect-ratio` inside a grid can blow out the parent container and cause images to stack.
   - Recommended sizes: `.h-16` (small panel) / `.h-18` (compact strip) / `.h-22` (standard grid) / `.h-26` (featured display) / `.h-28` (large image).
   - Single hero images may use template ratio classes: `.r-16x9` / `.r-16x10` / `.r-4x3` / `.r-3x2` / `.r-3x4` / `.r-1x1`.
   - All images in the same group must use the same height class — never mix `25vh` for one and `21vh` for another.

2. **`object-position:top center` (already set in CSS)** — only crop from the bottom.
   - Never crop left, right, or top edges — those are the image's core identity zone.

3. **For multiple images in a grid, use inline grid rather than `.grid-3`**:
   ```html
   <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1vh 1.2vw">
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
   </div>
   ```

4. **Align images with other layout elements**: Use `.grid-2-7-5` / `.grid-2-6-6` / `.grid-2-8-4` grid structures for natural top-alignment. Do not add `align-self:end` to images.

5. **Infographics / redesigned screenshots**: Add `.fit-contain` to `.frame-img` to prevent text or annotations from being cropped.

6. **When a user's original screenshot has an unsuitable aspect ratio**: First follow `screenshot-framing.md` for a CleanShot X-style programmatic adaptation. Only re-generate a "screenshot redesign / UI scene image" when the screenshot is too tall, too narrow, or needs structural rethinking.

### Frame Caption Variants

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

### Image Placeholder (for the design stage)

When an image is not yet available, use a dashed placeholder:
```html
<div class="img-slot r-4x3">  <!-- r-4x3 / r-16x9(default) / r-3x2 / r-1x1 -->
  <span class="plus">+</span>
  <span class="label">GitHub screenshot placeholder</span>
</div>
```

---

## Icons

**Emoji are strictly forbidden.** Use Lucide via CDN (already imported in template.html).

```html
<i data-lucide="compass" class="ico-lg"></i>     <!-- Large icon (for pillars) -->
<i data-lucide="target" class="ico-md"></i>      <!-- Medium icon (for list items) -->
<i data-lucide="check-circle" class="ico-sm"></i>  <!-- Small icon (for inline use) -->
```

**Common Lucide icon names** (grouped by meaning):

- Judgment: `compass`, `target`, `crosshair`, `search-check`
- Relationships: `share-2`, `users`, `network`, `link`, `handshake`
- Brand: `crown`, `gem`, `award`, `star`, `badge-check`
- Process: `workflow`, `route`, `arrow-right-left`, `repeat`
- Data: `grid-2x2`, `bar-chart-3`, `trending-up`, `activity`
- Aesthetic: `palette`, `brush`, `eye`, `sparkles`
- Right / wrong: `check-circle`, `x-circle`, `check`, `x`
- Direction: `arrow-right`, `arrow-up-right`, `corner-down-right`

**Icon + text inline combination**:
```html
<div class="h3-zh" style="display:flex;align-items:center;gap:.8em">
  <i data-lucide="target" class="ico-md"></i>
  Judgment — what is worth writing
</div>
```

---

## Ghost Oversized Background Text

Used as decorative background text at very low opacity to create a magazine feel.

```html
<div class="ghost" style="right:-6vw;top:-8vh">BUT</div>
<div class="ghost" style="left:-8vw;bottom:-18vh;font-style:italic">Harness</div>
```

- Font size 34vw, opacity 0.06
- Common positioning: `right:-6vw;top:-8vh` (overflows top-right) / `left:-8vw;bottom:-18vh` (overflows bottom-left)
- Content: English words or numbers (section numbers 01/02/03, keywords BUT/NOW/HERE)

**Note**: Other content on pages using ghost text must have `position:relative;z-index:2` to avoid being pushed behind it.

---

## Highlight Marker

An inline "highlighter pen" effect for short phrases:

```html
<span class="hi">not</span>
<span class="hi">a one-time burst</span>
```

Renders a semi-transparent highlight bar under the text. Dark themes use a bright bar; light themes use a dark bar (handled in CSS).

**When to use**: Only 1–3 key words at a time — do not apply broadly.

---

## Motion Animation System

The entire deck comes with page-entry animations enabled by default, powered by Motion One (the vanilla version of Framer Motion, ~4KB).

### Loading Method

The module script at the bottom of `assets/template.html` first tries to load from the **local** `assets/motion.min.js`, then falls back to **jsdelivr CDN**, and if both fail, it forces all elements with `data-anim` to `opacity:1` — content is always readable, and the presentation does not depend on network availability.

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

### Data-Attribute Driven

You only need to add two types of attributes in the HTML:

```html
<!-- 1. On the section, choose a recipe (optional — defaults to cascade / hero auto) -->
<section class="slide light" data-animate="quote">

<!-- 2. On elements that need an entry animation, add data-anim (optional values: left/right/line/step/divider) -->
<h1 class="h-xl" data-anim>Main heading</h1>
<div class="stat-card" data-anim>...</div>
<div data-anim="left">Left column content</div>
<span data-anim="line" style="display:block">First line of quote</span>
```

### Overview of the 5 Recipes

| Recipe | Trigger | Behavior | Representative Layout |
|---|---|---|---|
| `cascade` (default) | No `data-animate` needed | All `data-anim` elements stagger-fade in, 75ms/step | Layout 3 / 4 / 5 / 10 |
| `hero` | Auto-applied to `.hero` slides | Slow-paced stagger with a more ceremonial feel, 160ms/step | Layout 1 / 2 / 7 |
| `quote` | `data-animate="quote"` | Other elements appear first; `data-anim="line"` rows reveal one sentence at a time, 550ms intervals | Layout 8 |
| `directional` | `data-animate="directional"` | `data-anim="left"` slides in from the left → divider → `data-anim="right"` slides in from the right | Layout 9 |
| `pipeline` | `data-animate="pipeline"` | Steps remain at 15% opacity on arrival; pressing →/Space/scroll lights them up one at a time; navigation is blocked until the last step | Layout 6 |

### Decision Tree for Choosing a Recipe

1. **Is it a `.hero` slide?** → No need to add `data-animate` — `hero` is applied automatically
2. **Is it a large pull-quote page?** → `data-animate="quote"`, each sentence in `<span data-anim="line" style="display:block">`
3. **Is it a left/right Before/After comparison?** → `data-animate="directional"`, left column `data-anim="left"`, right column `data-anim="right"`
4. **Is it a step-by-step pipeline walkthrough?** → `data-animate="pipeline"`, each step `data-anim="step"`
5. **Any other body page** → Add nothing; `cascade` is applied automatically

### Which Elements Should Get `data-anim`?

- ✅ Every block with its own semantic meaning: kicker / h1 / h-xl / lead / callout / stat-card / figure / tag / rowline
- ✅ Each column in a multi-column structure, so they fade in column by column rather than all at once
- ❌ Do not add to containers (`.grid-6` / `.frame`) — only add to leaf elements
- ❌ Do not add to every `<li>` — adding it at the `<ul>` level is usually sufficient
- ❌ If a page should have no animation at all (e.g., a transition page), simply add no `data-anim` — Motion One only acts on marked elements

### Frequently Asked Questions

- **Image flashes then appears?** This is expected behavior — the animation triggers at the 450ms mid-point of the page transition
- **Pipeline page is stuck and won't advance?** That's correct — press → to light up each step in sequence; only after all steps are revealed will the next page become accessible
- **Content not visible even in static mode?** Check that `motion.min.js` exists under `assets/`; or check the browser console for errors
