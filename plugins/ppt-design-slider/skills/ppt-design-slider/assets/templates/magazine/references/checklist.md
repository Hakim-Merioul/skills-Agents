# Quality Checklist

This checklist comes from the real iteration process of sharing "solo company" PPTs. Every item was learned through mistakes and is ordered by importance.

Read through it once before generating a PPT; run through it item by item after generating.

---

## 🔴 P0 · Errors That Must Never Be Made

### 0-S. Swiss Locked Mode: Body Pages Must Come from the Original 22 Layouts

**Symptom**: Colors and fonts look Swiss-like, but the heading has shifted to the center, images are off-grid, and the page structure is completely different from the original 22 layouts.

**Root cause**: During generation, Swiss was treated as a style package and new P23/P24/custom-drawn SVG pages were freely assembled instead of selecting from the 22 registered layouts in the original reference PPT.

**Approach**:
- First read `references/swiss-layout-lock.md`
- Body pages may only use `S01-S22`; new cover/closing pages may only use `SWISS-COVER-ASCII` / `SWISS-CLOSING-ASCII`
- Every `<section class="slide">` must carry `data-layout="Sxx"`
- After generating, run:

```bash
node <SKILL_ROOT>/scripts/validate-swiss-deck.mjs path/to/index.html
```

**Validation will block**:
- Unregistered layouts / missing `data-layout`
- P23/P24 experimental structures
- Visible text inside SVG
- S22 image without `s22-hero-21x9` binding
- S22 photo using `object-position:top center`

### 0-S-2. Swiss Top Heading Defaults to Top-Left, Not Center

**Symptom**: The topmost heading is centered on the page, looking like a self-made poster rather than the original PPT.

**Approach**:
- Except for statement/split layouts such as `S03/S09/S10`, the top heading must align to the top-left content axis of the original template.
- Do not place a small heading in the left column and a large heading in the right wide column — this causes the heading to appear visually centered.
- If you need heading + description in two columns, you must copy the exact skeleton of `S11` or `S17` — do not write your own `4fr 8fr`.

### 0-S-3. Swiss Map Pages Must Use the S08 Map Component

**Symptom**: Location/historical content only shows a simple SVG map with no real markers, relationship cards, zoom/drag controls, or scroll events triggering PPT navigation.

**Approach**:
- Use `data-layout="S08"`.
- First read `references/swiss-map-component.md`.
- The right-side map component must include marker points, connecting lines, location cards, and `+` / `-` / `DRAG` controls.
- Scroll zoom and drag pan are disabled by default; the user must click `DRAG` before panning is allowed.
- A static fallback must be retained so the map remains readable if the CDN or tiles fail.

**Check**:
- `grep -n "data-map-ctrl" index.html`
- `grep -n "maplibregl.Map" index.html`
- Browser test: `+` zooms in, `DRAG` toggles to `DRAG ON`

### 0-S-4. Swiss Presentation Font Sizes Must Be Legible + The Weight Ladder Must Be Respected

**Symptom**: The Swiss-style page structure is fine, but annotations, descriptions, timelines, KPI notes, and small card text are unreadable when projected; or 16px small text uses weight 300, making it both small and thin.

**Approach (minimum font sizes)**:
- Body paragraphs / main descriptions ≥ `18px`
- Card descriptions / lists / timeline annotations / captions ≥ `16px`
- Meta / kicker / mono labels / chart labels ≥ `14px`
- When content overflows, cut the copy, split the page, or switch to a different Sxx layout — do not hard-squeeze with 10/11/12/13px text.

**Approach (weight ladder ⭐)**:
Swiss style holds to "bigger = thinner, smaller = heavier" — font size and weight must form an inverse ladder:
- ≥ 8vw → weight **200** (ExtraLight)
- 4–7.9vw → weight **200–300**
- 1.8–3.9vw → weight **300–400**
- 1–1.7vw / 16–20px → weight **400–500**
- 13–15px → weight **500–600**
- On any page, elements with smaller font sizes must have weight ≥ those with larger font sizes.
- **16px small text must not use weight 300** (too thin to read) — minimum 400, 500 recommended.
- Emphasis text in cover/IKB reversed-out large headings uses `italic + weight 300` — do not use the accent color.

**Check**:
- `rg -n "font-size:(10px|11px|12px|13px)|max\\((9|10|11|12|13)px" index.html`
- `rg -n "font-weight:(300)" index.html | rg -v "min\(|h-xl|h-hero|h-statement|num-mega|kpi-thin|name-mega|8vw|9vw|1[1-9]vw|cover-|\.multi"` — checks whether weight 300 has landed on small text
- View in the browser at 100% zoom: bottom notes, captions, timeline labels, and card descriptions must be readable at a glance.

### 0-A. Swiss Canvas Alignment Rule (Check Every Page · Most Frequently Violated)

**Symptom**: The `chrome-min` header and bottom footer both align to the 5vw edge, but the middle content area is indented further, and left-right alignment is off.

**Root cause**: `.canvas-card` already has `padding:5.6vh 5vw 4.4vh`. Adding `padding:5vh 5vw 4vh` to the body area doubles the horizontal padding to `5vw + 5vw = 10vw`, making the body 5vw more indented than `chrome-min`.

**Approach**:
- The body layer should have `padding:0` — use only grid `gap` to control vertical spacing
- The gap between `chrome-min` and the body is provided by `.chrome-min{margin-bottom:48px}` — **do not** stack `margin-top` / `padding-top` on top of the body
- Exception for split mode: `.slide.split .canvas-card{padding:0}`, with each `.half` defining its own `padding:5.6vh 3.6vw 4.4vh`

```html
<!-- ❌ Wrong: body is over-indented by 5vw, left-right misaligned -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:5vh 5vw 4vh;...">body</div>
</div>
<!-- ✅ Correct -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:3vh">body</div>
</div>
```

**Self-check command**: `grep "padding:.*5vw" index.html` — if a match hits `padding:Xvh 5vw Yvh` inside a direct child of `canvas-card`, it is wrong (exceptions: `.half` / decorative layers).

### 0-B. Swiss Head Area: Kicker Must Be "Above" the Large Heading (Not Side by Side)

**Symptom**: The small heading (`.t-meta` / `.t-cat`) and the large heading are squeezed onto the same row — a cluster of small text on the left, a large heading on the right — destroying the hierarchy of the head area.

**Root cause**: `grid-template-columns:auto 1fr` forces two elements that should stack vertically into two side-by-side columns.

**Approach**:
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

Exception: if the head row simultaneously holds "left: kicker + large heading (stacked vertically within)" and "right: small footnote", the outer layer may use `display:grid;grid-template-columns:1fr auto`, but the **inner layer** must still maintain flex column.

### 0-B-2. Swiss Cover / Closing Default: Full IKB + ASCII Breathing Field + White Weight 200 (Enforced)

**Symptom**: The cover uses `slide light` white background + black text + a large "01" — but the chrome corner already shows `01 / 07`, so the screen has two "01"s, a visual repetition; and the white background is too plain, completely lacking the ceremonial sense of an opening statement.

**Root cause**: The old `layouts-swiss.md` default recommended a left-ink + right-paper spread; in practice this easily becomes "white background + big black text + large number", losing the IKB blue's opening impact as a signature color.

**Approach** (Swiss style mandatory rules):
- **Cover must use `<section class="slide accent">`** (full IKB), not `slide.light` or `slide.dark`; inside `.canvas-card`, insert `<canvas class="ascii-bg">` as the **first child element** (ASCII character breathing field — the template includes a self-contained IIFE that activates it automatically)
- **Do not write large number labels like "01"**: `.chrome-min` already shows `01 / N` — placing another giant "01" on the cover is pure redundancy, just delete it
- **Emphasis text must use italic**: `font-style:italic;font-weight:300` — **forbidden** to use `color:var(--accent)` — IKB blue on IKB blue, the eye sees no emphasis at all
- **Closing page must use `slide.split`** — two half-screens: left half `.half.b-accent` + ASCII canvas (completing the color loop with the cover), right half paper-white with 3 takeaways; **item 03** uses `var(--accent)` for color, completing the "full IKB opening ↔ half-IKB closing" color loop
- The ASCII canvas in the template `<style>` already has `mix-blend-mode:screen;opacity:.92` preset — do not change these values
- Cover/closing main heading font size double constraint: `min(11.6vw,19vh)` ~ `min(8vw,14vh)` (follow the Y ≥ X × 1.6 rule)

**Self-check commands**:
- `grep -c "ascii-bg" index.html` — cover + closing should hit ≥ 2 (one canvas each)
- `grep -E '"slide accent"' index.html | head -1` — cover should be `slide accent`, not `slide light`
- `grep "color:var(--accent)" index.html` — if a matched line also contains `font-style:italic` it is a danger signal (blue on blue) — change to italic only, no accent; only the closing "03 takeaway" line using `var(--accent)` is valid (the background there is white)
- Visual check: open the page and look at the cover — delete any large number labels like "01"

### 0-C. Swiss Large Font Size Double Constraint: In `min(Xvw, Yvh)`, Y ≥ X × 1.6

**Symptom**: On standard 16:9 screens (MacBook 13/14/16, common monitors), the heading font size appears smaller than expected — the whole page looks sparse or shrunken.

**Root cause**: 1vw : 1vh ≈ 1.78. If written as `min(7vw, 10vh)`, on a 16:9 screen 7vw = 12.46vh, which gets capped by the 10vh upper bound, reducing the font size by 20%.

**Approach** — quick reference values:
| Purpose | Recommended |
|---|---|
| h-hero giant declaration | `min(11.6vw, 19vh)` |
| h-xl section heading | `min(7vw, 12vh)` ~ `min(7.4vw, 13vh)` |
| Large KPI number | `min(8.4vw, 14vh)` |
| Medium number / index | `min(4.6vw, 8.5vh)` ~ `min(5.6vw, 10vh)` |
| Subheading | `min(7.6vw, 13vh)` |

**Self-check command**: `grep -E "font-size:min\([0-9.]+vw,\s*[0-9.]+vh\)" index.html` — review all matched X/Y pairs; correct any where Y/X < 1.6.

### 0-D. Swiss Image Layout: Square Corners, Uniform Height, Evidence Only

**Symptom**: Images look like generic PPT illustrations — rounded corners, shadows, mixed proportions; multiple screenshots vary in height; or GPT-M 2.0-generated images come with their own titles/footers that duplicate the page chrome.

**Root cause**: In Swiss style, images are not decoration — they are evidence blocks inside the grid. Without first selecting a layout and image slot, any image gets crammed into the page.

**Approach**:
- Choose the layout first: single large image + KPI uses `S22`; multiple images adapt `S15/S16` original grid skeletons
- S22 generated image ratio is fixed at `21:9`, and must have `data-image-slot="s22-hero-21x9"` on the `<img>`
- Photos default to `object-position:center 35%` or `center center` — do not use `top center` to crop faces
- Image containers use only `.frame-img`; **no** `border-radius` / `box-shadow`
- UI / infographic / flowchart images from user's original screenshots or text-dense images use `.fit-contain`; if regenerated to the slot, must use the corresponding ratio class filled to the container, e.g. `.frame-img.r-21x9` — do not use a fixed short height that shrinks the image
- All images in the same group must use the same slot, ratio, and height — no mixing
- For user's original screenshots, first read `references/screenshot-framing.md`: prioritize using `assets/screenshot-backgrounds/` built-in theme backgrounds + programmatic scaling/padding/alignment — do not redraw screenshot content just to achieve a uniform ratio
- Screenshot backgrounds must follow the current theme color and must be croppable to `21:9` / `16:10` / `4:3` / `1:1`; backgrounds must not contain titles, footers, borders, logos, people, or prominent subjects
- GPT-M 2.0 prompts must specify: Swiss Style, single accent, square corners, no gradients/shadows/rounded corners, no headers/footers/titles/corner labels

**Self-check commands**:
- `grep -E "frame-img.*border-radius|box-shadow" index.html` — delete any matches
- `grep -n "data-image-slot" index.html` — every local image should have a slot declaration
- Visual check: if an image has its own large title, page number, footer, or corner label baked in, prioritize regenerating it rather than trying to crop or mask it in the PPT
- Visual check: the screenshot background should be a quiet base — it must not attract more attention than the screenshot itself; Swiss-style screenshots must not have rounded corners or drop shadows

### 0-D-2. Swiss Bottom Safe Zone: The Lowest Content Must Not Touch the Nav

**Symptom**: Image captions, footnotes, timeline bottom labels, and bottom KPIs are covered by the pagination dots, or appear visually too close to them.

**Root cause**: `#nav` is fixed at `bottom:2vh`. If the main content uses `align-self:end` / `align-items:end` / `margin-top:auto` to anchor to the bottom, the lowest edge will enter the pagination area.

**Approach**:
- Leave at least `3vh` breathing space between the lowest edge of main content and the pagination component
- For image-text pages needing bottom alignment, first control the image height, then add `.nav-safe-bottom` / `.nav-safe-bottom-tight` to the main container
- For other pages that need to anchor to the bottom, add `.nav-safe-bottom` or `.nav-safe-bottom-tight` to the main container
- Do not hand-write `bottom:2vh` / `bottom:0` for descriptive text — this competes with nav for position

**Self-check**:
- Visual: navigate to the page and check whether the last caption/label line is clearly above the pagination component
- Code: `grep -E "align-items:end|align-self:end|bottom:0|bottom:2vh|margin-top:auto" index.html` — for each match, confirm whether a nav safe zone exists

---

### 0-E. Swiss Template Fidelity Guard: Original PPT Is the Golden Source

**Symptom**: The generated page looks Swiss, but the actual font weight, spacing, timeline, and card density differ from the original reference PPT; the further it iterates, the more it diverges.

**Root cause**: New image layouts or experimental structures were written as global style changes, or the original base classes were unintentionally altered — for example `.h-hero` / `.h-xl` font weight, `.tl-node` column width, `.duo-compare` spacing.

**Approach**:
- The original reference file `/Users/guohao/Documents/op7418-repos/projects/Thin-Harness-Fat-Skills/ppt/index.html` is the Swiss theme golden source — follow its **actual page usage** as the standard, not only the unused CSS helpers
- The original page heavily uses `font-weight:200` for large headings, with emphasis words/numbers at `300`; `.h-hero` / `.h-xl` / `.h-hero-zh` / `.h-xl-zh` in this template must maintain light weight — do not revert to 800/900
- Beyond adding the new cover/closing ASCII mechanism, S22 image slot fixes, horizontal timeline label centering fixes, and correcting heading helpers to the actual light weight, do not alter the original base CSS/JS recipes
- New image capabilities must be bound to the S22/S15/S16 original slots — do not invent new body structures
- Before modifying `assets/template-swiss.html`, compare against the original reference; acceptable differences are limited to: ASCII-related changes, S22 image positioning, light-weight heading helpers, and known animation fixes

**Self-check commands**:
- Run `compare-swiss-base.mjs` in the current test directory — confirm the output shows `missing in template: 0`
- Visual comparison against the same type of page in the original PPT: heading weight, chrome-min position, timeline dot/label, and card density must be consistent

### 0-F. Dual-Check Visual + Code: Do Not Only Look at HTML

**Symptom**: Class names look correct in the code, but the actual page is cramped, the image-text relationship is off, optional components are stacked too heavily, or an inappropriate layout was chosen for the content.

**Approach**:
- Open the original reference PPT, the current template or generated page, and the test PPT side by side — make visual judgments first
- Wait for entry animations to stabilize before taking screenshots or making judgments — do not mistake an animation mid-state for missing content
- First browse the page visually: heading weight, head spacing, body density, image alignment, nav safe zone
- Then check the code structure: did this page use the correct layout, are required components present, are optional components overused
- When comparing against the original PPT, use the actual rendered view as the standard; raw CSS helpers can only assist — they cannot substitute for visual judgment
- Identify the source of any issue: wrong layout selection / missing required component / overuse of optional components / spacing or safe-zone problems
- General-purpose layouts (S03/S08/S11/S19) can be used liberally; data-specific layouts (S06/S07/S20/S21/S22) must have real data or cases; structure-specific layouts (S14/S15/S17) must have closed loops, matrices, or hierarchical relationships

---

### 0. Required Class Name Validation Before Generating (Most Important)

**Symptom**: Pasting a skeleton from layouts.md directly into new HTML results in all styles being lost — large headings revert to sans-serif, data numbers are as small as body text, pipeline multi-groups collapse into a mess, and images pile up at the bottom of the browser.

**Root cause**: If the current template's `<style>` does not define these classes, the browser falls back to default styles.

**Approach**:
- **Before generating a PPT, you must `Read` the template for the current style**: Style A reads `assets/template.html`, Style B reads `assets/template-swiss.html` — confirm that every class used in layouts is already defined
- Most commonly missing classes: `h-hero / h-xl / h-sub / h-md / lead / meta-row / stat-card / stat-label / stat-nb / stat-unit / stat-note / pipeline-section / pipeline-label / pipeline / step / step-nb / step-title / step-desc / grid-2-7-5 / grid-2-6-6 / grid-2-8-4 / grid-3-3 / frame / img-cap / callout / callout-src`
- If a class is genuinely missing, **add it inside the template's `<style>` block** — do not re-write it inline on every page
- After generating, open in a browser: if you see "large heading in sans-serif" or "pipeline steps crowded onto one row", this is almost certainly the cause

### 1. Do Not Use Emoji as Icons

**Symptom**: Using emoji (🎯 💡 ✅) in a magazine-style design instantly destroys the aesthetic.

**Approach**: Use the Lucide icon library, referenced via CDN:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
...
<i data-lucide="target" class="ico-md"></i>
...
<script>lucide.createIcons();</script>
```

Common icon names: `target / palette / search-check / compass / share-2 / crown / check-circle / x-circle / plus / arrow-right / grid-2x2 / network`

### 2. Images May Only Be Cropped at the Bottom — Left, Right, and Top Must Never Be Cut

**Symptom**: Using `aspect-ratio` to size images causes the grid to either stack or cut critical information (such as the title bar at the top of a screenshot) when the parent container is insufficient.

**Approach**: Use a **fixed height + overflow hidden** for image containers, and use `object-fit:cover + object-position:top` on the image:

```html
<figure class="frame-img" style="height:26vh">
  <img src="screenshot.png">
</figure>
```

`.frame-img img` already has `object-position:top` preset in the CSS — only the bottom is cropped.

**Never use this pattern** (will blow out the container in a grid):

```html
<!-- Bad example -->
<figure class="frame-img" style="aspect-ratio: 16/9">...</figure>
```

**Exception**: A single hero visual (not inside a grid) may use `aspect-ratio + max-height`, since the parent container will contain it.

### 2b. Light Page + Dark WebGL = Washed-Out Grey (Theme Switch Not Working)

**Symptom**: All light page backgrounds appear to have a grey cast — even hero light pages are grey.

**Root cause**: JS switches the opacity of two canvases based on the slide's theme. If the entire deck opens as `hero dark` with no mechanism to switch the background to light, `body` never gets the `light-bg` class, and `canvas#bg-dark` stays on top forever.

**Approach**:
- The `go()` function in the template already infers the theme from `classList` (`light` / `dark`) — so **slides must explicitly carry `light` or `dark` as a class**. Do not omit them, and do not use other custom theme names
- Hero pages use `hero light` / `hero dark`; body pages use `light` / `dark`. Writing only `hero` without a theme color is incorrect
- A deck must have at least one **non-hero light page** to ensure `body` has the opportunity to gain `light-bg`

### 2b-2. Entire Deck Is All Light — No Rhythm

**Symptom**: Aside from the `hero dark` cover, all other pages default to `light` — visually flat, no breathing room, a wall of white.

**Root cause**: The skeletons in layouts.md default to `light` across the board; if you paste them without adjusting themes, everything will be light.

**Approach**:
- **Plan a "theme rhythm table" before generating**: write down for each page which of `hero dark` / `hero light` / `light` / `dark` it uses, align it, then write the code
- **Hard rules**: 3 or more consecutive pages with the same theme = not allowed; decks with 8+ pages must have ≥1 `hero dark` + ≥1 `hero light`; cannot have all `light` body pages — must include `dark` body pages
- **Choose themes by layout** (see "Theme Rhythm Planning" at the beginning of layouts.md):
  - Left text right image (Layout 4), big quote (Layout 8), mixed image-text (Layout 10) → **`light` / `dark` alternating**
  - Data billboard, image grid, pipeline, comparison → `light` (screenshots/numbers/processes need a bright base)
  - Cover, question page → `hero dark`
  - Act dividers → `hero dark` and `hero light` alternating
- **Post-generation self-check**: `grep 'class="slide' index.html` — visually confirm that themes alternate

### 2c. Chrome and Kicker Must Not Say the Same Thing

**Symptom**: The top-left `.chrome` says "Design First · Design-Led" while the `.kicker` on the same page says "Phase 01 · Design Stage" — synonymous paraphrase, very AI-generated-feeling.

**Approach**:
- **chrome = magazine header / navigation label**: can be the same across multiple pages (e.g. "Act II · Workflow", "Data · Result", "lukew.com · 2026.04")
- **kicker = this page's unique hook**: short, has a hook, is the "small prefix" before the main heading (e.g. "BUT", "One person, what did they build?", "The Question")
- One describes the section, one describes this page — they must never be translations of each other

### 3. Large Heading Font Size Must Not Exceed Screen Width / Character Count

**Symptom**: Chinese large headings set too large (e.g. 13vw) result in only 1 character per line, with forced breaks that look terrible.

**Approach**:
- `h-hero` (largest): 10vw, **and heading length ≤ 5 characters**
- `h-xl` (next largest): 6vw–7vw
- Long headings use `<br>` for manual line breaks — do not rely on automatic wrapping
- Add `white-space:nowrap` when necessary

**Example**: "I'm not a programmer." (6 characters) uses `h-xl` at 7.2vw + nowrap, fitting on one line.

### 4. Typographic Assignment: Serif for Headings, Sans-Serif for Body

**Approach**:
- Large headings, key pull quotes, large number displays → **serif** (Noto Serif SC + Playfair Display + Source Serif)
- Body text, descriptions, pipeline step names → **sans-serif** (Noto Sans SC + Inter)
- Metadata, code, labels → **monospace** (IBM Plex Mono + JetBrains Mono)

All fonts are loaded via Google Fonts CDN — already preset in the template.

### 4b. Do Not Use `align-self:end` to Anchor Images to the Bottom

**Symptom**: In a left-text right-image layout, `align-self:end` is added to the `<figure>` to align the bottom of the right column image with the bottom of the left column callout. The result:
- If the parent container is not a grid (e.g. the class is undefined), `align-self` has no effect at all — the image falls to the bottom of the document flow, covered by the browser toolbar
- Even in a grid, the image pins to the bottom of the cell, and on low-resolution screens it is still covered by `.foot` and `#nav` dots

**Approach**:
- Mixed image-text layouts **must use `.frame.grid-2-7-5`** (or `.grid-2-6-6` / `.grid-2-8-4`)
- The right column `<figure class="frame-img r-16x10">` or `<figure class="frame-img r-4x3">` should simply align to the top
- To make the left column callout appear "anchored to the bottom", add flex column + `justify-content:space-between` to the **left column** — do not touch the right column
- If the image and the large heading should align at the top while body text starts below the heading, add `margin-top:7vh` to `9vh` to the image to align it with the body content area

### 4c. Do Not Use Odd Aspect Ratios from the Original Image

**Symptom**: Using an original image's native ratio like `aspect-ratio: 2592/1798` results in strange whitespace or overflow at different screen sizes.

**Approach**: Regardless of the original image ratio, always use standard ratios for placeholders: **16/10 / 4/3 / 3/2 / 1/1 / 16/9**. Images auto-apply `object-fit:cover + object-position:top` — the top is never cropped, and a slight crop at the bottom is harmless.

### 5. Do Not Add Thick Borders / Heavy Shadows to Images

**Symptom**: Adding strong shadows or black frames for a "premium feel" instantly makes it look like a generic business PPT.

**Approach**: At most 1–4px of subtle rounded corners + **very faint background noise** (already in the template). No `box-shadow`, no `border` (except a 1px very faint grey at most).

---

## 🟡 P1 · Typographic Rhythm

### 6. Hero Pages and Non-Hero Pages Must Alternate

**Recommended rhythm** (25–30 pages):
```
Hero Cover → Act Divider (hero) → 3-4 pages non-hero → Act Divider (hero)
→ 4-5 pages non-hero → Hero Question → ... → Hero Close
```

Two or more consecutive hero pages cause fatigue; four or more consecutive non-hero pages kill the rhythm.

### 7. Big-Number Pages and Dense Pages Must Alternate

Big number pages (big numbers / hero questions) and dense pages (pipeline / image grid) should alternate — otherwise the audience's eyes tire quickly.

### 8. English/Chinese Usage for the Same Concept Must Be Consistent

**Symptom**: Alternating between "Skills", "skills", "thin harness fat skills" across the deck with no consistency.

**Approach**:
- Terminology should prefer **English words** (Skills / Harness / Pipeline / Workflow) — these are familiar terms in the field
- **Don't force-translate** — forced translations feel awkward
- One concept, one spelling throughout the entire deck

### 9. Page Numbers in the Bottom Chrome Must Be Consistent

Use the format `XX / total` (e.g. `05 / 27`). **Do not add dynamic page numbers in the top right** (it will duplicate the `.chrome`).

### 9b. Animation System: Every Page Must Have data-anim Markers

**Symptom**: After generating, opening the browser shows content "popping" into place on each page turn with no sense of rhythm — the magazine feel relies entirely on the typesetting, lacking the ceremonial quality of layered reveals.

**Root cause**: No `data-anim` was added to any elements. Motion One finds nothing to animate, and the entire page appears statically.

**Approach**:
- On all body pages, **at minimum add `data-anim` to leaf elements like kicker / main heading / lead / callout / stat-card / figure**
- **Hero pages** (cover/act divider/question/closing): all core blocks (kicker + large heading + lead + meta-row) must have it
- **Pages that need no special recipe**: write nothing — the default cascade looks great
- **4 page types that need special recipes**: add the corresponding `data-animate` to `<section>`
  - Big quote → `data-animate="quote"` + each line `<span data-anim="line" style="display:block">`
  - Before/After comparison → `data-animate="directional"` + left column `data-anim="left"` + right column `data-anim="right"`
  - Pipeline → `data-animate="pipeline"` + each step has `data-anim="step"`
  - Hero page (automatically uses the hero recipe — but elements still need `data-anim`)

**Self-check**: After generating, run `grep -c 'data-anim' index.html` — the result should be several dozen or more. Single-digit counts mean elements were missed.

### 9c. Pipeline Pages Must Have data-animate="pipeline"

**Symptom**: The pipeline page fades in all at once, losing the "step-by-step presentation" rhythm, and when navigating to the next page, the only option is to go back — there is no way to return to the previous step.

**Approach**: Layout 6's `<section>` must have `data-animate="pipeline"`. During presentation, pressing →/Space/scroll down **lights up one step at a time**; only after all steps are lit does pressing → advance to the next page. This rhythm is intentional, not a bug.

---

## 🟢 P2 · Visual Polish

### 10. WebGL Background Overlay Opacity

**Dark hero**: overlay 12–15% (WebGL clearly shows through)
**Light hero**: overlay 16–20% (WebGL subtly visible, does not compete with text)
**Regular light/dark pages**: overlay 92–95% (nearly opaque)

If the page has very little text (hero question), the overlay can be thinner; if body content is dense, the overlay must be thickened to ensure readability.

### 11. Light Hero Shader Must Not Have a Strong Center Point

**Symptom**: Spiral Vortex and radial ripple effects are too conspicuous on a light theme — looks like a Windows 98 screensaver.

**Approach**: Light hero should use centerless FBM domain-warped flow. The base color should remain silver/paper (close to #F0F0F0 / #FBF8F3) with very subtle color shift (below 0.05).

### 12. Dark Hero Allows More Visual Impact

Dark hero can use Holographic Dispersion (titanium color dispersion) and other shaders with central structures, since a black background can accommodate more visual information.

### 13. Left Text Right Image Alignment

- Left column text group: `justify-content:space-between` — heading anchors to the top, quote frame anchors to the bottom
- Right column image keeps natural top alignment — do not add `align-self:end`
- Right column image should typically align with the body content area, not the top edge of the large heading; add `margin-top:7vh` to `9vh` if needed
- Grid overall: `align-items:start` (not `center` / `end`)

### 13b. Spacing Between Heading and Body

- Two-part layout (top heading + long body/quote/chart below) must have visible spacing between heading and content — recommended `margin-top:6vh` to `8vh`
- Centered large-heading pages must genuinely center the entire content block horizontally — do not just center-align the text block and leave it left-anchored
- Complex content pages: use the large heading to set the tone, the content below should use grid / rowline with justified edges — do not pile the large heading, subheading, and body text in one mass

### 13c. Do Not Stretch UI Scene Images into Long Strips

- If a single UI screenshot becomes a long strip after filling the full width, break it into 2–3 local panels
- When arranging multiple panels, each `.frame-img` should use the same fixed height class such as `.h-16` / `.h-18` / `.h-22` — do not use one oversized container to force-fit everything
- Images in the same group must be visually the same size — do not mix different heights, different scales, and different margin densities
- If full-width is truly necessary, generate a sufficiently wide landscape image and explicitly specify "ultra-wide horizontal strip" in the prompt

### 13d. Generated Images Must Not Include Slide Elements

- GPT-M 2.0 generated images are embedded assets — do not let the image contain headers, footers, titles, page numbers, corner labels, attributions, or decorative borders
- Flowcharts / infographics should only retain the core graphic and necessary short labels — the PPT handles the heading, footer, and chrome
- If a generated image already has these elements, prioritize regenerating it; do not stack another layer of chrome on top in the PPT

### 13e. Swiss Image-Text Mixing Must Use Variety

- A 7–8 page Swiss test deck should use at least 6 different S-number layouts
- When there are 2–3 images, use at least two different image-bearing approaches: S22 hero visual / S15 matrix / S16 tabloid / S08 paired image-text / S19 four-card evidence
- When left-text-right-image or right-text-left-image pages need bottom alignment, control image height and main-body safe zone — do not push the entire block close to the pagination component
- White-background infographic containers must have white backgrounds and no borders — do not wrap a white image in a grey frame

### 13f. Swiss Chinese Large Headings Need to Scale Down

- Two-line Chinese headings start from `min(5.8vw,10.2vh)` by default — do not directly use the English page `6.8vw–7vw`
- When any single line has 9–12 Chinese characters, reduce to `min(5.2vw,9.2vh)`
- Three-line headings should be rewritten first — do not squeeze the image-text content below just to keep the heading large

### 14. Subtle Rounded Corners on Images

Style A can have gentle rounded corners. Style B Swiss must use square corners: `.frame-img` and the image itself must have no rounded corners, no shadows, and no consumer-app card aesthetics.

---

## 🔵 P3 · Operational Details

### 15. Use Relative Paths for Images

Place images in the `images/` folder and use relative paths `images/xxx.png` in the HTML — do not use absolute paths.

### 16. Page Numbers Are Hard-Coded in `.chrome`

JS dynamically calculates the total page count and extends the bottom pagination dots, but the `XX / N` in `.chrome` is hard-coded. When adding or removing pages, update N manually.

### 17. Keep the Navigation Controls

The template supports by default: ← → / scroll wheel / touch swipe / bottom dots / Home · End. Do not delete the navigation logic from JS.

### 18. Do Not Hard-Set `height:100vh` — Use `min-height:80vh`

`100vh` makes content fit exactly to the screen, but the browser toolbar and tab bar eat into that height, causing content to overflow. Using `min-height:80vh + align-content:center` is more reliable.

---

## 🧪 Final Self-Check List

After generating the PPT, go through this checklist item by item (check each one):

```
Pre-check (before generating)
  □ Read the <style> in template.html — confirmed all required classes exist
  □ Decided which Layout (1-10) each page uses
  □ Drew out a "theme rhythm table": every page explicitly assigned hero dark / hero light / light / dark
  □ Rhythm table satisfies hard rules: no 3 consecutive same-theme pages / at least ≥1 hero dark + ≥1 hero light (for 8+ pages) / at least 1 dark body page
  □ <title> updated to the actual deck title (grep "[REQUIRED]" should return no results)
  □ Swiss: cover is `slide accent` full IKB + `<canvas class="ascii-bg">` (not `slide light` white background)
  □ Swiss: closing is `slide split` + left `b-accent` + ASCII canvas / right paper with 3 takeaways, item 03 uses var(--accent)
  □ Swiss: `grep -c "ascii-bg" index.html` ≥ 2 (one each for cover and closing)
  □ Swiss: cover has no large number labels like "01" (chrome already shows 01/N — no duplicates)
  □ Swiss: emphasis text on IKB background uses `font-style:italic` — color:var(--accent) is forbidden (blue on blue)

Content
  □ The page count ratio across acts is balanced (no heavy front, light back)
  □ No emoji used as icons
  □ Terms like Skills / Harness are used consistently
  □ Every page has clear kicker + heading + body — three levels of information hierarchy

Typography
  □ No large headings with 1 character per line
  □ Image grids use height:Nvh instead of aspect-ratio
  □ Images only cropped at the bottom — top and sides intact
  □ Serif/sans-serif typographic assignment follows the template
  □ Clear separation between pipeline groups

Visual
  □ Hero pages and non-hero pages alternate
  □ WebGL background is visible on hero pages
  □ Images have subtle rounded corners
  □ No heavy shadows or borders

Interaction
  □ ← → navigation works
  □ Bottom dot count matches total page count
  □ Chrome page numbers match actual page numbers
  □ ESC key triggers the index view (if retained)
  □ B key toggles static/low-power mode, bottom-right indicator switches between `B Static` / `B Animated`

Animation
  □ `assets/motion.min.js` exists (local fallback)
  □ In low-power mode, WebGL/ASCII canvas RAF loops are stopped, but all current page content remains visible
  □ Content fades in one by one on page turns — no "pop" appearance
  □ Big quote page `<section>` has `data-animate="quote"`, each line has `<span data-anim="line">`
  □ Before/After comparison page `<section>` has `data-animate="directional"`, left and right columns marked left/right
  □ Pipeline page `<section>` has `data-animate="pipeline"`, each step marked data-anim="step"
  □ `grep -c 'data-anim' index.html` count ≥ pages × 3 (average of 3+ markers per page)
```

Only when everything is checked is the PPT considered complete.
