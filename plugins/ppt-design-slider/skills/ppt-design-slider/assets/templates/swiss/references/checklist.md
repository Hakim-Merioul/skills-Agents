# Quality Checklist

This checklist comes from the real iteration process of sharing a "solo company" PPT. Every item was learned from a mistake, ordered by importance.

Read through once before generating; check each item after generating.

---

## 🔴 P0 · Errors you must never make

### 0-S. Swiss locked mode: body slides must come from the original 22 layouts

**Symptom**: Colors and fonts look Swiss, but headings drift to the center, images are off-grid, and the page structure has nothing to do with the original 22 registered layouts.

**Root cause**: Swiss was treated as a style package and new P23/P24/custom-SVG pages were freely composed instead of selecting from the 22 registered layouts in the original reference PPT.

**What to do**:
- Read `references/swiss-layout-lock.md` first
- Body slides may only use `S01-S22`; new cover/closing slides may only use `SWISS-COVER-ASCII` / `SWISS-CLOSING-ASCII`
- Every `<section class="slide">` must carry `data-layout="Sxx"`
- After generating, run:

```bash
node <SKILL_ROOT>/scripts/validate-swiss-deck.mjs path/to/index.html
```

**The validator will flag**:
- Unregistered layouts / missing `data-layout`
- P23/P24 experimental structures
- Visible text inside SVG
- S22 image missing `s22-hero-21x9` binding
- S22 photo using `object-position:top center`

### 0-S-2. Swiss top heading defaults to top-left — not centered

**Symptom**: The topmost heading sits in the middle of the page, looking like a hand-made poster rather than the original PPT.

**What to do**:
- Except for `S03/S09/S10` statement/split layouts, top headings must hug the top-left content axis of the original template.
- Do not place a small heading in the left column and a large heading in the right wide column — this creates a visually centered heading.
- If you need a two-column heading + caption arrangement, copy the skeleton of the original `S11` or `S17` exactly; do not write your own `4fr 8fr`.

### 0-S-3. Swiss map slides must use the S08 Map Component

**Symptom**: Location/history content only has a simple SVG map with no real pins, relationship cards, zoom/drag controls, or scroll events triggering PPT page turns.

**What to do**:
- Use `data-layout="S08"`.
- Read `references/swiss-map-component.md` first.
- The right-side map component must include marker pins, connecting lines, location cards, and `+` / `-` / `DRAG` controls.
- Scroll zoom and drag pan are disabled by default; the user clicks `DRAG` to enable panning.
- A static fallback must be preserved so the slide is readable if the map CDN or tiles fail.

**Check**:
- `grep -n "data-map-ctrl" index.html`
- `grep -n "maplibregl.Map" index.html`
- Browser test: `+` zooms in, `DRAG` toggles to `DRAG ON`

### 0-S-4. Swiss presentation font sizes must be legible + the weight ladder must be followed

**Symptom**: The overall Swiss page structure is fine, but captions, descriptions, timelines, KPI notes, and small card text are unreadable on a projected screen; or 16px small text uses weight 300, making it both small and thin.

**What to do (minimum font sizes)**:
- Body paragraphs / main descriptions ≥ `18px`
- Card descriptions / lists / timeline notes / captions / figure captions ≥ `16px`
- meta / kicker / mono labels / chart labels ≥ `14px`
- When content overflows, trim the copy, split the slide, or switch to a different Sxx layout — do not force 10/11/12/13px text.

**What to do (weight ladder ⭐)**:
Swiss style insists on "the larger the text, the lighter the weight" — font size and weight must form an inverse ladder:
- ≥ 8vw → weight **200** (ExtraLight)
- 4-7.9vw → weight **200-300**
- 1.8-3.9vw → weight **300-400**
- 1-1.7vw / 16-20px → weight **400-500**
- 13-15px → weight **500-600**
- On the same slide, elements with smaller font sizes must have weight ≥ elements with larger font sizes.
- **Small text around 16px must not use weight 300** (too thin to read) — minimum 400, recommended 500.
- Emphasis words inside cover/IKB reversed large headings use `italic + weight 300`, not the accent color.

**Check**:
- `rg -n "font-size:(10px|11px|12px|13px)|max\\((9|10|11|12|13)px" index.html`
- `rg -n "font-weight:(300)" index.html | rg -v "min\(|h-xl|h-hero|h-statement|num-mega|kpi-thin|name-mega|8vw|9vw|1[1-9]vw|cover-|\.multi"` — check whether weight 300 lands on small text sizes
- View in browser at 100% zoom; bottom notes, captions, timeline labels, and card descriptions should be readable at a glance.

### 0-A. Swiss canvas alignment rule (check every slide — most frequently violated)

**Symptom**: The `chrome-min` header and the bottom footer both align to the 5vw edge, but the middle body content is indented further inward, out of alignment left and right.

**Root cause**: `.canvas-card` already has `padding:5.6vh 5vw 4.4vh`. If the body area also gets `padding:5vh 5vw 4vh`, the horizontal padding becomes `5vw + 5vw = 10vw`, indenting the body 5vw more than `chrome-min`.

**What to do**:
- Set `padding:0` on the body layer; use only grid `gap` for vertical spacing
- The gap between `chrome-min` and the body is provided by `.chrome-min{margin-bottom:48px}` — **do not** add a `margin-top` / `padding-top` to the top of the body
- Exception in split mode: `.slide.split .canvas-card{padding:0}`, with each `.half` defining its own `padding:5.6vh 3.6vw 4.4vh`

```html
<!-- ❌ Wrong: body is indented 5vw extra, left-right misalignment -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:5vh 5vw 4vh;...">Body</div>
</div>
<!-- ✅ Correct -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:3vh">Body</div>
</div>
```

**Self-check command**: `grep "padding:.*5vw" index.html` — if any hit matches `padding:Xvh 5vw Yvh` on a direct child of `canvas-card`, it is wrong (exceptions: `.half` / decorative layers).

### 0-B. Swiss head area: kicker must be **above** the main heading (not side by side)

**Symptom**: The small label (`.t-meta` / `.t-cat`) and the main heading are squeezed into the same row — a blob of small text on the left, a blob of large text on the right — losing the hierarchy in the header.

**Root cause**: `grid-template-columns:auto 1fr` forces two elements that should stack vertically into side-by-side columns.

**What to do**:
```html
<!-- ❌ Wrong -->
<div data-anim="head" style="display:grid;grid-template-columns:auto 1fr;gap:3vw;align-items:end">
  <div class="t-meta">METHODOLOGY · 03</div>
  <h2 class="h-xl-zh">Why N+1</h2>
</div>
<!-- ✅ Correct -->
<div data-anim="head" style="display:flex;flex-direction:column;gap:1.4vh">
  <div class="t-meta">METHODOLOGY · 03</div>
  <h2 class="h-xl-zh">Why N+1</h2>
</div>
```

Exception: when the head row simultaneously holds "left: kicker + main heading (stacked vertically)" and "right: small footnote", the outer wrapper may use `display:grid;grid-template-columns:1fr auto`, but the **inner** wrapper must still be flex column.

### 0-B-2. Swiss cover / closing default: full-screen IKB + ASCII breathing field + white weight 200 (enforced)

**Symptom**: The cover uses `slide light` white background + black text + a large "01" — while the chrome corner already shows `01 / 07`, producing two "01"s on screen; the white background is too ordinary and completely lacks the ceremonial impact of an opening.

**Root cause**: An older version of `layouts-swiss.md` defaulted to a left-ink + right-paper split; in practice this easily became "white background + black large text + large number", losing the IKB opening impact.

**What to do** (required for Swiss):
- **Cover must use `<section class="slide accent">`** (full-screen IKB) — not `slide.light`, not `slide.dark`; insert `<canvas class="ascii-bg">` as the **first child** of `.canvas-card` (the ASCII breathing field — the template's IIFE auto-activates it)
- **Do not add large number characters like "01"**: `.chrome-min` already shows `01 / N`; placing a giant "01" on the cover is redundant — delete it
- **Emphasis text must use italic**: `font-style:italic;font-weight:300` — **do not** use `color:var(--accent)` — IKB blue on IKB blue is invisible
- **Closing must use `slide.split`** — left half `.half.b-accent` + ASCII canvas (closing the color loop with the cover), right half paper white with 3 takeaways; **item 03** uses `var(--accent)` for color, completing the "full IKB opening ↔ half IKB closing" color loop
- The ASCII canvas already has `mix-blend-mode:screen;opacity:.92` set in the template `<style>` — do not change this value
- Cover / closing main heading dual constraint: `min(11.6vw,19vh)` ~ `min(8vw,14vh)` (follow the Y ≥ X × 1.6 rule)

**Self-check commands**:
- `grep -c "ascii-bg" index.html` — cover + closing should hit ≥ 2 (one canvas each)
- `grep -E '"slide accent"' index.html | head -1` — cover should be `slide accent`, not `slide light`
- `grep "color:var(--accent)" index.html` — if any hit also contains `font-style:italic`, that is a danger signal (blue on blue); change it to italic only without accent; only the closing "03 takeaway" line is allowed to use `var(--accent)` (white background there)
- Visual: open the page and check the cover for any large number like "01" — remove if present

### 0-C. Swiss large font dual constraint: in `min(Xvw, Yvh)`, Y ≥ X × 1.6

**Symptom**: On a standard 16:9 screen (MacBook 13/14/16, common monitors), headings appear smaller than expected, making the whole slide look sparse or undersized.

**Root cause**: 1vw : 1vh ≈ 1.78. If you write `min(7vw, 10vh)`, on a 16:9 screen 7vw = 12.46vh, which gets capped to 10vh, shrinking the font by 20%.

**What to do** — recommended values at a glance:
| Use | Recommended |
|---|---|
| h-hero declaration | `min(11.6vw, 19vh)` |
| h-xl section heading | `min(7vw, 12vh)` ~ `min(7.4vw, 13vh)` |
| Large KPI number | `min(8.4vw, 14vh)` |
| Medium number / index | `min(4.6vw, 8.5vh)` ~ `min(5.6vw, 10vh)` |
| Subtitle | `min(7.6vw, 13vh)` |

**Self-check command**: `grep -E "font-size:min\([0-9.]+vw,\s*[0-9.]+vh\)" index.html` — scan all hits for X/Y; change any case where Y/X < 1.6.

### 0-D. Swiss mixed image layout: square corners, same height, evidence only

**Symptom**: Images look like ordinary PPT illustrations — rounded corners, shadows, inconsistent aspect ratios; multiple screenshots differ in height; GPT-M 2.0 generated images have built-in titles/footers that duplicate the page chrome.

**Root cause**: In Swiss style, images are not decorations — they are evidence blocks inside a grid. Choosing the layout and image slots first is mandatory; arbitrary images should never be forced onto a slide.

**What to do**:
- Choose the layout first: single large image + KPI → `S22`; multiple images → `S15/S16` original grid skeleton
- S22 generated image aspect ratio is fixed at `21:9`; write `data-image-slot="s22-hero-21x9"` on the `<img>`
- Photo default `object-position:center 35%` or `center center`; do not use `top center` to crop faces
- Image containers use only `.frame-img`; **no** `border-radius` / `box-shadow`
- UI / infographic / flowchart: if these are original user screenshots or text-dense images, use `.fit-contain`; if regenerated to fit a slot, use the corresponding aspect ratio class to fill the container (e.g. `.frame-img.r-21x9`) — do not use a fixed short height that shrinks the image
- Multiple images in the same group must share the same slot, aspect ratio, and height; do not mix
- For user original screenshots, read `references/screenshot-framing.md` first: prefer `assets/screenshot-backgrounds/` built-in theme backgrounds + programmatic scaling/padding/alignment; do not redraw screenshot content just to unify aspect ratios
- Screenshot backgrounds must follow the current theme color and must be croppable to `21:9` / `16:10` / `4:3` / `1:1`; backgrounds must contain no headings, footers, borders, logos, people, or obvious subjects
- GPT-M 2.0 prompts must specify: Swiss Style, single accent, square corners, no gradient/shadow/rounded corners, no header/footer/title/badge

**Self-check commands**:
- `grep -E "frame-img.*border-radius|box-shadow" index.html` — remove any hit
- `grep -n "data-image-slot" index.html` — every local image should have a slot declaration
- Visual: if any image has its own heading, page number, footer, or badge inside it, regenerate it — do not try to crop and rescue in the page
- Visual: the background behind screenshots should be a quiet base, not more eye-catching than the screenshot itself; Swiss screenshots must have no rounded corners or drop shadows

### 0-D-2. Swiss slide safe zone at the bottom: the lowest content must not overlap nav

**Symptom**: Image captions, footnotes, timeline bottom labels, and bottom KPIs are covered by the pagination dots, or sit uncomfortably close.

**Root cause**: `#nav` is fixed at `bottom:2vh`. If the body content uses `align-self:end` / `align-items:end` / `margin-top:auto` to push to the bottom, the lowest content enters the pagination zone.

**What to do**:
- Leave at least `3vh` of breathing room between the lowest content edge and the pagination component
- For image/text pages that need bottom alignment, control the image height first, then add `.nav-safe-bottom` / `.nav-safe-bottom-tight` to the body container
- For other pages that need bottom alignment, add `.nav-safe-bottom` or `.nav-safe-bottom-tight` to the body container
- Do not place text with `bottom:2vh` / `bottom:0` — this conflicts with nav

**Self-check**:
- Visual: navigate to the slide, check whether the last caption/label is clearly above the pagination component
- Code: `grep -E "align-items:end|align-self:end|bottom:0|bottom:2vh|margin-top:auto" index.html` — verify each hit has a nav safe zone

---

### 0-E. Swiss template fidelity guard: the original PPT is the golden source

**Symptom**: Generated slides look Swiss, but the actual font weights, spacing, timeline, and card density differ from the original reference PPT; each iteration drifts further from the reference.

**Root cause**: New image layouts or experimental structures were written as global style changes, or the original base classes were unintentionally modified — e.g. `.h-hero` / `.h-xl` font weight, `.tl-node` column width, `.duo-compare` spacing.

**What to do**:
- The original reference file `<reference-deck.html>` is the golden source for the Swiss theme; judge by **actual page usage**, not unused CSS helpers
- The original page uses `font-weight:200` heavily for large headings, with emphasis words/numbers at `300`; `.h-hero` / `.h-xl` / `.h-hero-zh` / `.h-xl-zh` must keep light weights — do not restore them to 800/900
- Outside of the new cover/closing ASCII mechanism, S22 image slot fix, horizontal timeline label centering fix, and correcting heading helpers to match actual light weights, do not modify the original base CSS/JS recipe
- New image capabilities must be bound to the S22/S15/S16 original slots; do not invent new body structures
- If modifying `assets/template-swiss.html`, compare against the original reference first; acceptable differences should only be ASCII-related, S22 image positioning, light-weight heading helpers, and known animation fixes

**Self-check commands**:
- Run `compare-swiss-base.mjs` in the current test directory; confirm `missing in template: 0` in the output
- Visually compare the same type of slide in the original PPT: heading weight, chrome-min position, timeline dot/label, and card density must match

### 0-F. Visual + code dual verification: do not rely on HTML alone

**Symptom**: Class names look correct in code, but the actual page is cramped, image/text relationships are wrong, too many optional components are stacked, or an inappropriate layout is used for the content.

**What to do**:
- Open the original reference PPT, the current template or generated page, and the test PPT side by side; make a visual comparison first
- Wait for the entry animations to settle before screenshotting or making judgments — do not mistake an animation mid-state for missing content
- First browse the page slide by slide, looking visually at: heading weight, header spacing, body density, image alignment, nav safe zone
- Then review the code structure: whether the correct layout is used, whether required components are present, whether optional components are overused
- When comparing against the original PPT, the actual visual is authoritative; raw CSS helpers are a reference, not a substitute for visual judgment
- Identify the source of the problem: wrong layout choice / missing required component / overused optional component / spacing or safe zone issue
- General-purpose layouts (S03/S08/S11/S19) can be used broadly; data-specific (S06/S07/S20/S21/S22) require real data or a case study; structure-specific (S14/S15/S17) require a closed loop, matrix, or hierarchical relationship

---

### 0. Class name validation required before generating (most important)

**Symptom**: Pasting the skeleton from `layouts.md` directly into a new HTML file results in all styles missing — large headings fall back to sans-serif, data giant-number font is as small as body text, pipeline pages collapse into one lump, images stack at the bottom of the browser.

**Root cause**: If the current template's `<style>` block does not define these classes, the browser falls back to default styles.

**What to do**:
- **Before generating a PPT, always `Read` the template for the current style**: Style A reads `assets/template.html`, Style B reads `assets/template-swiss.html`; confirm all classes used in the layout are already defined
- Most commonly missing classes: `h-hero / h-xl / h-sub / h-md / lead / meta-row / stat-card / stat-label / stat-nb / stat-unit / stat-note / pipeline-section / pipeline-label / pipeline / step / step-nb / step-title / step-desc / grid-2-7-5 / grid-2-6-6 / grid-2-8-4 / grid-3-3 / frame / img-cap / callout-src`
- If a class is genuinely missing, **add it inside the template's `<style>`** — do not inline-rewrite it on every page
- After generating, open the browser; if you see "large heading is sans-serif" or "pipeline steps squeezed into one line", this is almost certainly the issue

### 1. Do not use emoji as icons

**Symptom**: Using emoji (🎯 💡 ✅) in a Swiss/magazine style instantly destroys the tone.

**What to do**: Use the Lucide icon library, referenced via CDN:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
...
<i data-lucide="target" class="ico-md"></i>
...
<script>lucide.createIcons();</script>
```

Common icon names: `target / palette / search-check / compass / share-2 / crown / check-circle / x-circle / plus / arrow-right / grid-2x2 / network`

### 2. Images may only be cropped at the bottom — never left, right, or top

**Symptom**: Using `aspect-ratio` to size images causes grid overflow or crops critical information (e.g. the title bar at the top of a screenshot).

**What to do**: Use a **fixed height + overflow hidden** container; image uses `object-fit:cover + object-position:top`:

```html
<figure class="frame-img" style="height:26vh">
  <img src="screenshot.png">
</figure>
```

The CSS rule `.frame-img img` already presets `object-position:top`, so only the bottom is cropped.

**Never use this** (will overflow grid containers):

```html
<!-- Bad -->
<figure class="frame-img" style="aspect-ratio: 16/9">...</figure>
```

**Exception**: A single standalone main visual (not inside a grid) may use `aspect-ratio + max-height`, because the parent container provides a fallback.

### 2b. Light page + dark WebGL = grey haze (theme switch did not fire)

**Symptom**: All light page backgrounds look grey, even a hero light page.

**Root cause**: JS infers the theme from the slide's class and toggles opacity on two canvas elements. If the entire deck starts with hero dark and no mechanism ever adds `light-bg` to body, `canvas#bg-dark` stays on top forever.

**What to do**:
- The `go()` function in the template already infers the theme from `classList` (`light` / `dark`), so **slides must explicitly carry a `light` or `dark` class**. Do not omit it, and do not use custom theme names.
- Hero pages use `hero light` / `hero dark`; body pages use `light` / `dark`. Writing `hero` without a color class is wrong.
- Every deck must have at least one **non-hero light page** to ensure body gets the `light-bg` class at some point.

### 2b-2. The entire deck is light with no rhythm

**Symptom**: Except for the `hero dark` cover, all other pages default to `light` — visually flat, no breathing, a wall of white.

**Root cause**: The skeletons in `layouts.md` default to `light` throughout; copy-pasting without adjusting themes produces all-light output.

**What to do**:
- **Before generating, draw a "theme rhythm table"**: write down `hero dark` / `hero light` / `light` / `dark` for each page, then write the code
- **Hard rule**: three or more consecutive slides with the same theme = not allowed; in a deck of 8+ slides, there must be ≥1 `hero dark` + ≥1 `hero light`; a deck cannot be all-`light` body slides — there must be `dark` body slides
- **Choose theme by layout** (see "theme rhythm planning" at the top of `layouts.md`):
  - Left-text/right-image (Layout 4), large quote (Layout 8), mixed image/text (Layout 10) → **`light` / `dark` alternating**
  - Large poster, image grid, Pipeline, comparison → `light` (screenshots/numbers/flow need a light base)
  - Cover, question page → `hero dark`
  - Section dividers → alternate `hero dark` and `hero light`
- **After generating, self-check**: `grep 'class="slide' index.html` — confirm there is rhythmic alternation

### 2c. Chrome and kicker must not say the same thing

**Symptom**: `.chrome` in the top-left reads "Design First · Design-Led", and `.kicker` on the same page reads "Phase 01 · Design Phase" — synonymous, unmistakably AI-generated.

**What to do**:
- **chrome = magazine header / navigation tab**: may repeat across multiple pages (e.g. "Act II · Workflow", "Data · Result", "lukew.com · 2026.04")
- **kicker = unique hook for this page only**: short, attention-grabbing, a "small prefix" for the main heading (e.g. "BUT", "One person. What did they do.", "The Question")
- One describes the section, the other describes this specific page — they must never be paraphrases of each other

### 3. Large heading font size must not exceed screen width / character count

**Symptom**: A Chinese heading font set too large (e.g. 13vw) results in only one character per line, forcing ugly line breaks.

**What to do**:
- `h-hero` (largest): 10vw, **and heading length ≤ 5 characters**
- `h-xl` (next largest): 6vw-7vw
- For long headings, use `<br>` for manual line breaks; do not rely on automatic wrapping
- Add `white-space:nowrap` when needed

**Example**: "I am not a developer." (6 characters) uses `h-xl` at 7.2vw + nowrap, fitting in one line.

### 4. Font roles: serif for headings, sans-serif for body

**What to do**:
- Large headings, key quotes, large number displays → **serif** (Noto Serif SC + Playfair Display + Source Serif)
- Body text, descriptions, pipeline step names → **sans-serif** (Noto Sans SC + Inter)
- Metadata, code, labels → **monospace** (IBM Plex Mono + JetBrains Mono)

All fonts are loaded via Google Fonts CDN; the template already includes these.

### 4b. Do not use `align-self:end` to bottom-anchor images

**Symptom**: In a left-text/right-image layout, `align-self:end` is added to `<figure>` to align the bottom of the right image with the bottom of the left callout. Result:
- If the parent container is not a grid (e.g. the class is undefined), `align-self` has no effect and the image falls to the bottom of the document flow, obscured by the browser toolbar
- Even in a grid, the image hugs the cell bottom and is still obscured by `.foot` and `#nav` dots on low-resolution screens

**What to do**:
- Mixed image/text layouts **must use `.frame.grid-2-7-5`** (or `.grid-2-6-6` / `.grid-2-8-4`)
- The right column `<figure class="frame-img r-16x10">` or `<figure class="frame-img r-4x3">` naturally aligns to the top
- To make the left callout appear "bottom-aligned", add flex column + `justify-content:space-between` to the **left column** — do not touch the right column
- If the image and the main heading have the same top edge but body text starts below the heading, add `margin-top:7vh` to `9vh` to the image so it aligns with the body content area

### 4c. Do not use the original image's unusual aspect ratio

**Symptom**: A ratio like `aspect-ratio: 2592/1798` copied from the source image produces strange whitespace or overflow on different screens.

**What to do**: Regardless of the source image's ratio, always use a standard ratio for the placeholder: **16/10 / 4/3 / 3/2 / 1/1 / 16/9**. The image uses `object-fit:cover + object-position:top` automatically; a little bottom cropping is harmless.

### 5. Do not add thick borders / shadows to images

**Symptom**: Adding a strong shadow or black border for "premium feel" immediately makes it look like a corporate PPT.

**What to do**: At most 1-4px subtle rounding + **barely perceptible base noise** (already in the template). No `box-shadow`, no `border` (unless an extremely faint 1px grey line).

---

## 🟡 P1 · Typographic rhythm

### 6. Hero pages and non-hero pages must alternate

**Recommended rhythm** (25-30 pages):
```
Hero Cover → Act Divider (hero) → 3-4 pages non-hero → Act Divider (hero)
→ 4-5 pages non-hero → Hero Question → ... → Hero Close
```

Two or more consecutive hero pages causes fatigue; four or more consecutive non-hero pages kills the rhythm.

### 7. Large-type pages and dense pages must alternate

Large-type pages (big numbers / hero question) and dense pages (pipeline / image grid) should alternate so the audience's eyes do not tire.

### 8. English/Chinese terminology must be consistent throughout

**Symptom**: Sometimes "Skills", sometimes "thin skill", sometimes "thin harness fat skills" — inconsistent throughout.

**What to do**:
- Prefer **English terms** (Skills / Harness / Pipeline / Workflow) — these are recognized within the field
- **Do not force-translate** — literal translations sound unnatural
- Use one form per term throughout the entire deck

### 9. Bottom chrome page numbers must be consistent

Use the `XX / total` format (e.g. `05 / 27`). **Do not add dynamic page numbers in the top-right corner** (they will duplicate `.chrome`).

### 9b. Animation system: every slide must have `data-anim` markers

**Symptom**: After generating, content just "pops" in when the page turns — no rhythm at all; the Swiss style relies entirely on the layout with none of the ceremonial layer-by-layer reveal.

**Root cause**: No `data-anim` attributes were added; the Motion One script has no elements to animate, so the entire slide appears statically.

**What to do**:
- On all body slides, **at minimum add `data-anim` to leaf elements: kicker / main heading / lead / callout / stat-card / figure**
- **Hero pages** (opening / section divider / question / closing): all core blocks (kicker + large heading + lead + meta-row) must be marked
- **Pages that don't need a special recipe**: nothing extra needed; the default cascade looks good
- **4 types of pages that need a special recipe**: must add the corresponding `data-animate` to `<section>`:
  - Large quote → `data-animate="quote"` + each line `<span data-anim="line" style="display:block">`
  - Before/After comparison → `data-animate="directional"` + left column `data-anim="left"` + right column `data-anim="right"`
  - Pipeline → `data-animate="pipeline"` + each step `data-anim="step"`
  - Hero pages (automatically use hero recipe, but elements still need `data-anim`)

**Self-check**: After generating, `grep -c 'data-anim' index.html` — should return dozens. If it's only single digits, markers were missed.

### 9c. Pipeline slides must have `data-animate="pipeline"`

**Symptom**: The pipeline slide fades in all at once, losing the "one step at a time" rhythm; but on moving to the next slide, there is no way to go back to the previous step.

**What to do**: The `<section>` for Layout 6 must have `data-animate="pipeline"`. During presentation, pressing →/space/scroll reveals **each step individually**; only after all steps are revealed does the next → advance the slide. This pacing is intentional, not a bug.

---

## 🟢 P2 · Visual polish

### 10. WebGL background overlay opacity

**dark hero**: overlay 12-15% (WebGL prominently shows through)
**light hero**: overlay 16-20% (WebGL barely visible, not competing with text)
**Normal light/dark pages**: overlay 92-95% (nearly opaque)

If a slide has very little text (hero question), the overlay can be thinner; if body content is dense, thicken the overlay to ensure readability.

### 11. Light hero shader must not have a strong center point

**Symptom**: Spiral Vortex and radial ripple effects are too prominent in a light theme, resembling a Windows 98 screensaver.

**What to do**: Light hero should use FBM domain-warped centerless flow, with a base color that is silver/off-white (close to #F0F0F0 / #FBF8F3) and very subtle rainbow tinting (below 0.05).

### 12. Dark hero allows more visual impact

Dark hero can use Holographic Dispersion (titanium color dispersion) and other center-structured shaders, because a dark background can absorb more visual information.

### 13. Left-text/right-image alignment

- Left column text group: `justify-content:space-between` — heading anchored to top, quote box anchored to bottom
- Right column image: natural top alignment; do not add `align-self:end`
- The right column image typically aligns with the body content area, not the heading top; add `margin-top:7vh` to `9vh` if needed
- Grid overall: `align-items:start` (not `center` / `end`)

### 13b. Spacing between heading and body

- Two-section layout with top heading + long body/quote/chart below requires obvious separation — recommended `margin-top:6vh` to `8vh`
- Centered large-heading pages must be horizontally centered as a whole; do not just left-align the text block and place it in the center
- For complex content pages, use a large heading to set the tone and lay out the body content below with grid / rowline; do not stack heading, sub-heading, and body into one cramped block

### 13c. UI context images must not be stretched into giant strips

- If a single UI screenshot becomes a long strip when placed at full width, prefer splitting it into 2-3 panel segments
- When laying out multiple panels, each `.frame-img` uses the same fixed height class (e.g. `.h-16` / `.h-18` / `.h-22`); do not force them into one ultra-wide container
- Images in the same group must have consistent visual size — do not mix different heights, zoom levels, or margin densities
- If full width is truly needed, generate an image wide enough with "ultra-wide horizontal strip" explicitly in the prompt

### 13d. Generated images must not contain slide elements

- GPT-M 2.0 generated images are embedded assets; do not let them include headers, footers, headings, page numbers, badges, attributions, or decorative borders
- Flowcharts / infographics retain only core graphics and necessary short labels — the PPT handles headings, footers, and chrome
- If a generated image already contains these elements, regenerate; do not layer more chrome on top in the PPT

### 13e. Swiss mixed image/text layouts must use variety

- A 7-8 slide Swiss test deck must use at least 6 different S-number layouts
- With 2-3 images, use at least two image-carrying methods: S22 main visual / S15 matrix / S16 brief / S08 comparison / S19 four-card evidence
- For left-text/right-image or right-text/left-image that needs bottom alignment, control image height and body safe zone first; do not push the entire content block near the pagination component
- White-background infographic containers must have a white background with no border; do not wrap white images in grey frames

### 13f. Swiss Chinese large headings must be scaled down

- Chinese 2-line headings start at `min(5.8vw,10.2vh)` by default; do not use the English page `6.8vw-7vw` directly
- If any line has 9-12 Chinese characters, reduce to `min(5.2vw,9.2vh)`
- 3-line headings should be rewritten; do not shrink them to squeeze large headings at the expense of the image/text content below

### 14. Subtle rounded corners on images

Style A may have light rounding. Style B Swiss must be square: `.frame-img` and the image itself must have no rounded corners, no shadows, and no consumer-app card feel.

---

## 🔵 P3 · Operational details

### 15. Use relative paths for images

Place images in the `images/` folder; use relative paths (`images/xxx.png`) in HTML; do not use absolute paths.

### 16. Page numbers in `.chrome` are hard-coded

JS dynamically calculates the total page count and expands the bottom pagination dots, but `XX / N` in `.chrome` is hard-coded. Update N manually when adding or removing slides.

### 17. Keep the navigation controls

The template supports out of the box: ← → / scroll wheel / touch swipe / bottom dots / Home·End. Do not remove the navigation logic from the JS.

### 18. Do not hard-set `height:100vh`; use `min-height:80vh`

`100vh` fits content exactly to the screen height, but the browser toolbar and tab bar eat into available height, causing overflow. Use `min-height:80vh + align-content:center` for stability.

---

## 🧪 Final self-check list

After generating the PPT, check each item in order:

```
Pre-check (before generating)
  □ Read template.html <style>; confirmed all required classes exist
  □ Decided which Layout (1-10) to use for each page
  □ Drew a "theme rhythm table": each page explicitly marked hero dark / hero light / light / dark
  □ Rhythm table satisfies hard rules: no 3 consecutive same-theme pages / ≥1 hero dark + ≥1 hero light (8+ pages) / at least 1 dark body page
  □ <title> updated to the actual deck title (grep "[required]" should return no results)
  □ Swiss: cover is `slide accent` full-screen IKB + `<canvas class="ascii-bg">` (not `slide light` white background)
  □ Swiss: closing is `slide split` + left `b-accent` + ASCII canvas / right paper 3 takeaways, item 03 uses var(--accent)
  □ Swiss: `grep -c "ascii-bg" index.html` ≥ 2 (one each for cover + closing)
  □ Swiss: cover has no large number like "01" (chrome already shows 01/N; no duplication)
  □ Swiss: emphasis text on IKB background uses `font-style:italic`; `color:var(--accent)` is forbidden (blue on blue)

Content
  □ Page count per act is proportional (no top-heavy or tail-heavy distribution)
  □ No emoji used as icons
  □ Terms like Skills / Harness are used consistently
  □ Each page has clear three-level hierarchy: kicker + heading + body

Typography
  □ No large heading produces a one-character-per-line line break
  □ Image grids use height:Nvh, not aspect-ratio
  □ Images are only cropped at the bottom; top and sides are intact
  □ Serif/sans-serif font roles match the template
  □ Multiple pipeline groups have clear separators

Visual
  □ Hero and non-hero pages alternate
  □ WebGL background is visible on hero pages
  □ Images have subtle rounding
  □ No heavy shadows or borders

Interaction
  □ ← → navigation works
  □ Bottom dot count matches total page count
  □ Page numbers in chrome match actual slide numbers
  □ ESC triggers index view (if retained)
  □ B key toggles static/low-power mode; bottom-right shows `B Static` / `B Dynamic`

Animation
  □ `assets/motion.min.js` exists (local fallback)
  □ In low-power mode, WebGL/ASCII canvas RAF loops are stopped; current page content is fully visible
  □ On page turn, content fades in one by one rather than all at once
  □ Large quote page `<section>` has `data-animate="quote"`; each line has `<span data-anim="line">`
  □ Before/After comparison page `<section>` has `data-animate="directional"`; left and right columns marked left/right
  □ Pipeline page `<section>` has `data-animate="pipeline"`; each step marked with data-anim="step"
  □ `grep -c 'data-anim' index.html` count ≥ pages × 3 (at least 3 markers per page on average)
```

Only when every item is checked is the PPT considered complete.
