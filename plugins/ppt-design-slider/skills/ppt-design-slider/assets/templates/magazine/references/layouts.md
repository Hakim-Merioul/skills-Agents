# Page Layout Library (Layouts)

This document collects the 10 most commonly used page layout skeletons. Each is a complete, paste-ready `<section class="slide ...">...</section>` code block — just replace the copy and images to use.

---

## ⚠️ Required Reading Before Generating (Pre-flight)

### A. Class Names Must Come From template.html

All classes used in layouts.md (`h-hero` / `h-xl` / `h-sub` / `h-md` / `lead` / `meta-row` / `stat-card` / `stat-label` / `stat-nb` / `stat-unit` / `stat-note` / `pipeline-section` / `pipeline-label` / `pipeline` / `step` / `step-nb` / `step-title` / `step-desc` / `grid-2-7-5` / `grid-2-6-6` / `grid-2-8-4` / `grid-3-3` / `grid-6` / `grid-3` / `grid-4` / `frame` / `frame-img` / `img-cap` / `callout` / `callout-src` / `kicker`) are pre-defined in the `<style>` block of `assets/template.html`.

**Do not invent new class names.** If you must customize, use `style="..."` inline. If you are unsure whether a class exists before generating, grep template.html to confirm.

### B. Image Aspect Ratio Rules (Very Important)

**Always use standard ratios** — never use an original image's native ratio like `aspect-ratio: 2592/1798`:

| Use Case | Recommended Ratio | Syntax |
|------|---------|------|
| Left-text right-image main image | 16:10 or 4:3 | `.frame-img.r-16x10` or `.frame-img.r-4x3` |
| Image grid (multi-image comparison) | Uniform | `.frame-img.h-22` / `.frame-img.h-26` — no aspect-ratio |
| Small panel groups | Uniform | `.frame-img.h-16` / `.frame-img.h-18` — same height within each group |
| Small image left + text right | 1:1 or 3:2 | `.frame-img.r-1x1` or `.frame-img.r-3x2` |
| Full-screen hero visual | 16:9 | `.frame-img.r-16x9` |
| Infographic / redesigned screenshot | 16:9 or 16:10 | `.frame-img.r-16x9.fit-contain` or `.frame-img.r-16x10.fit-contain` |
| Mixed-layout small insert | 3:2 or 3:4 | `.frame-img.r-3x2` or `.frame-img.r-3x4` |

Images must be wrapped in `<figure class="frame-img">`. Default photos use `object-fit:cover + object-position:top center` — only the bottom is cropped, never the top, left, or right. Infographics and redesigned screenshots must use `.fit-contain` to prevent text or annotations from being clipped.

### B2. Vertical Alignment of Images with Content

Images should align with the body content area, not default to the very top of the headline. Especially for left-text-right-image and mixed layouts:

- If the left column has kicker + large heading + body + callout, the right column image typically starts at body height — add `style="margin-top:7vh"` to `9vh` to the image
- For infographics or UI scene images, align to the first line of body text or the descriptive copy, not the top of the oversized heading
- If a screenshot or UI scene image becomes a long strip when stretched to full width, do not force it to fill the full width — switch to an ultra-wide horizontal image asset, or break it into 2–3 same-size panels side by side
- Multi-image panels must use the same height class — never mix `h-16` / `h-22` or hand-write different `height` values

### B3. Spacing Between Heading and Body

- Two-part pages (top heading + lower body / quote / chart) must have a visible gap between heading and content — recommended `margin-top:6vh` to `8vh`
- Centered headline pages must genuinely center the main heading on the page — use `.center` or `text-align:center; margin-inline:auto`
- Complex content pages (large heading + subheading + detailed content) should clearly separate the main heading from the lower content — use a left–right grid or rowline for the lower content rather than stacking everything on a single center axis

### C. Image Positioning Rules (Prevents Images Sinking to the Bottom and Being Obscured by the Browser Toolbar)

**Wrong approaches** (already burned — never repeat):
- Using `align-self:end` inside a non-grid container: `align-self` has no effect outside flex/grid, and the image will sink to the end of the document flow
- Using `position:absolute + bottom:0` to "pin" an image to the bottom: it will be covered by the bottom `.foot` and `#nav` dots
- Writing only `height:N vh` on a single image without `max-height`: on low-resolution screens it will overflow the viewport

**Correct approaches**:
- Mixed image-text layouts **must use `.frame.grid-2-7-5`** (or `.grid-2-6-6` / `.grid-2-8-4`) grid structures
- Grid containers default to `align-items:start` (already set in the template) — images naturally align to the top of their cell
- To "bottom-align" an image to the left column's callout: **use flex column + `justify-content:space-between` on the left column** (so the callout anchors itself to the left column's bottom), and **keep the right column figure at `align-items:start`** — do not add `align-self:end`
- All grid parent containers should have inline `style="padding-top:6vh"` to leave breathing room for the heading area

### D. Theme Color and Theme Rhythm

- Choose a theme palette from the 5 presets in `references/themes.md` — custom hex values are not allowed
- The theme rhythm (which of light / dark / hero light / hero dark each page uses) has hard rules in the "Theme Rhythm Planning" section below — required reading before generating
- Decide both of these before picking layouts, to avoid rework

### E. Animation System (Enabled by Default · Powered by Motion One)

**Core mechanism**: The module script at the bottom of template.html triggers entry animations on page navigation. All elements with `data-anim` start invisible and are faded in by Motion One one by one when the page becomes active.

**Animation strategy**: Add `data-animate="<recipe>"` on `<section>` to choose an animation style; add `data-anim` to each element that needs an entry animation (optional values such as `left` / `right` / `line` / `step`).

| Recipe | Usage | Suitable Layouts |
|---|---|---|
| Default (cascade) | Add nothing — auto cascading fade-in | Most body pages (Layout 3 / 4 / 5 / 10) |
| `hero` | Auto-enabled on `.hero` pages — slower, more ceremonial | Layout 1 / 2 / 7 (all hero pages) |
| `quote` | Reveals one sentence at a time, slow pace (550ms stagger) | Layout 8 Big Quote |
| `directional` | Left enters → divider → right enters — used for comparisons | Layout 9 Before/After |
| `pipeline` | Manual advance — press →/Space to light up each step | Layout 6 Pipeline |

**Graceful degradation**: If both local motion.min.js and CDN fail to load, the script forces all `data-anim` elements to `opacity:1` — content is always readable.

**Pages that need no animation**: If a page should skip animation entirely, add no `data-anim` at all — Motion One only acts on marked elements.

---

## 0. Base Structure (Same for All Slides)

```html
<section class="slide [light|dark|hero light|hero dark]">
  <div class="chrome">
    <div>Context label · Sub-label</div>
    <div>ACT · Page / Total</div>
  </div>
  <!-- Main content -->
  <div class="foot">
    <div>Page description · Page Description</div>
    <div>— · —</div>
  </div>
</section>
```

- Non-hero pages should use `light` or `dark`; hero pages use `hero light` or `hero dark` (participates in WebGL theme interpolation)
- `chrome` and `foot` are optional but recommended metadata strips for the four corners
- **Hero pages are for act covers / openers / closers / transitions** — non-hero pages are for body content

### ⚠️ Chrome and Kicker Must Not Repeat the Same Message

This is the most common content duplication issue. They operate on completely different semantic dimensions:

| Position | Role | Nature of Content | Example |
|------|------|---------|------|
| `.chrome` top-left | **Magazine header / navigation metadata** | Stable "section name" or "chapter category" — can be the same across multiple pages | "Act II · Workflow" / "Data · Result" / "lukew.com · 2026.04" |
| `.chrome` top-right | **Page number + act number** | Fixed format | "Act II · 15 / 25" |
| `.kicker` | **This page's unique hook sentence** | A "small prefix" for the main heading — like the one line above a magazine headline; should be different on every page | "BUT" / "One person. What did they build?" / "Phase 01 · Design Stage" |

**Anti-example** (already burned): chrome says "Design First · Design-led", kicker says "Phase 01 · Design Stage" — same idea repeated, instantly feels AI-generated.

**Correct approach**: chrome is a **section label** (stable, reusable across pages), kicker is **this page's hook** (short, dramatic) — they complement each other and must not be translations of each other.

### ⚠️ Theme Rhythm Planning (Required Reading · Must Be Done Before Generating)

**Core mechanism**: Every page `<section>` must carry one of `light` / `dark` / `hero light` / `hero dark`. JS infers the theme from the class to decide whether to add `light-bg` to the body, thereby switching which of the two WebGL canvases sits on top. Missing a theme class or using a custom name = fallback error.

#### Default Theme per Layout

| Layout | Default Theme | Reason |
|---|---|---|
| 1. Opening Cover | `hero dark` | Ceremonial opening, dark background for impact |
| 2. Act Divider | `hero dark` and `hero light` **must alternate** | Breathing rhythm |
| 3. Big Numbers Board | `light` | Numbers need a paper-white base; can occasionally insert `dark` across multiple acts |
| 4. Left Text Right Image | **`light` / `dark` alternating** | Primary driver of body rhythm |
| 5. Image Grid | `light` | Screenshots need a bright base |
| 6. Pipeline | `light` | Process diagrams need clarity |
| 7. Question Page | `hero dark` | Strong visual impact by default |
| 8. Big Quote | **`dark` preferred**, occasionally `light` | Ceremonial pull-quote feel requires dark base |
| 9. Comparison Page | `light` | Dual columns need clarity |
| 10. Mixed Image-Text | **`light` / `dark` alternating** | Rhythm |

#### Rhythm Hard Rules (Grep to Self-Check After Generating)

- ❌ **Forbidden**: 3 or more consecutive pages with the same theme (including stacked light or stacked dark)
- ❌ **Forbidden**: A deck with 8+ pages that has no `hero dark` + no `hero light`
- ❌ **Forbidden**: An entire deck of only `light` body pages with no `dark` body pages at all — will look flat and breathless
- ✅ **Recommended**: Insert 1 hero (cover / act divider / question / big quote) every 3–4 pages

#### 8-Page Rhythm Template (Copy and Adapt)

| Page | Theme | Layout | Note |
|---|---|---|---|
| 1 | `hero dark` | Cover | Opening |
| 2 | `light` | Big Numbers | Data reveal |
| 3 | `dark` | Left Text Right Image | Contrast / story |
| 4 | `light` | Pipeline | Process |
| 5 | `hero light` | Act Divider | Breath |
| 6 | `dark` | Left Text Right Image or Big Quote | |
| 7 | `hero dark` | Question Page | Suspense close |
| 8 | `light` | Big Quote / Closing | Wrap-up |

**Plan this table first, then write the slides.** Skipping the planning and pasting skeletons directly = everything ends up `light`.

---

## Layout 1: Opening Cover (Hero Cover)

```html
<section class="slide hero dark">
  <div class="chrome">
    <div>A Talk · 2026.04.22</div>
    <div>Vol.01</div>
  </div>
  <div class="frame" style="display:grid; gap:4vh; align-content:center; min-height:80vh">
    <div class="kicker" data-anim>Private Session · Guizang</div>
    <h1 class="h-hero" data-anim>Solo Company</h1>
    <h2 class="h-sub" data-anim>Organizations Folded by AI</h2>
    <p class="lead" style="max-width:60vw" data-anim>
      One AI creator — 110,000 lines of code in 64 days, continuous output across 9 platforms, with almost no change to their life rhythm.
    </p>
    <div class="meta-row" data-anim>
      <span>Guizang</span><span>·</span><span>Independent creator / CodePilot author</span>
    </div>
  </div>
  <div class="foot">
    <div>A conversation about AI · Organizations · Individuals</div>
    <div>— 2026 —</div>
  </div>
</section>
```

**Key points**:
- Use `hero dark` to let the WebGL background show through most of the canvas
- `h-hero` is the largest size (10vw) — the primary visual for the title
- Use `min-height:80vh + align-content:center` to vertically center the content block
- The `.chrome` does not need a page number — the cover page stands alone

---

## Layout 2: Act Divider

```html
<section class="slide hero light">
  <div class="chrome">
    <div>Act I · Hard Data</div>
    <div>Act I · 01 / 25</div>
  </div>
  <div class="frame" style="display:grid; gap:6vh; align-content:center; min-height:80vh">
    <div class="kicker" data-anim>Act I</div>
    <h1 class="h-hero" style="font-size:8.5vw" data-anim>Hard Data</h1>
    <p class="lead" style="max-width:55vw" data-anim>
      Look at the numbers first, then discuss the method.
    </p>
  </div>
  <div class="foot">
    <div>Act I Intro</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Minimal — only needs kicker + large heading + one-line pull quote
- Alternate between `hero light` and `hero dark` for successive act covers to create rhythm
- `h-hero` font size can be adjusted from 10vw down to 8.5vw to fit longer or shorter titles

---

## Layout 3: Big Numbers Board (Big Numbers Grid)

```html
<section class="slide light">
  <div class="chrome">
    <div>Past 64 Days · Development</div>
    <div>Act I / Dev · 02 / 25</div>
  </div>
  <div class="frame" style="padding-top:6vh">
    <div class="kicker" data-anim>One person. What did they build?</div>
    <h2 class="h-xl" data-anim>Past 64 Days</h2>
    <p class="lead" style="margin-bottom:5vh" data-anim>From zero to open-source CodePilot.</p>

    <div class="grid-6" style="margin-top:6vh">
      <div class="stat-card" data-anim>
        <div class="stat-label">Duration</div>
        <div class="stat-nb">64 <span class="stat-unit">days</span></div>
        <div class="stat-note">From zero to now</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">Lines of Code</div>
        <div class="stat-nb">110K+</div>
        <div class="stat-note">Written line by line to 110,000+</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">GitHub Stars</div>
        <div class="stat-nb">5,166</div>
        <div class="stat-note">One open-source repository</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">Downloads</div>
        <div class="stat-nb">41K+</div>
        <div class="stat-note">Installed on tens of thousands of machines</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">AI Providers</div>
        <div class="stat-nb">19</div>
        <div class="stat-note">Cross-platform integrations</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">Commits</div>
        <div class="stat-nb">608+</div>
        <div class="stat-note">No collaborators</div>
      </div>
    </div>
  </div>
  <div class="foot">
    <div>Project · CodePilot　|　github.com/codepilot</div>
    <div>Act I · Dev Numbers</div>
  </div>
</section>
```

**Key points**:
- A 3×2 or 4×2 grid is the most stable (see `.grid-6`)
- Each `stat-card` has a fixed structure: label (small English text) → nb (large number) → note (annotation)
- Numbers should be 2–3 characters (longer ones will overflow) — use K / M shorthand
- Leave at least 5vh of buffer above to let the title area draw attention first

---

## Layout 4: Left Text Right Image (Quote + Image)

```html
<section class="slide light">
  <div class="chrome">
    <div>Identity Contrast · The Twist</div>
    <div>03 / 25</div>
  </div>
  <div class="frame grid-2-7-5" style="padding-top:6vh">
    <!-- Left column: heading + body + callout, flex column pushes callout to the bottom -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; gap:3vh">
      <div>
        <div class="kicker" data-anim>BUT</div>
        <h2 class="h-xl" style="white-space:nowrap; font-size:7.2vw" data-anim>
          I'm not a programmer.
        </h2>
        <p class="lead" style="margin-top:3vh" data-anim>
          Never wrote a single line of code after graduating. The past ten years were UI design and AI effects.
        </p>
      </div>
      <div class="callout" data-anim>
        "Three years ago, this would have needed<br>
        a ten-person team working for a year."
        <div class="callout-src">— An observer's assessment</div>
      </div>
    </div>
    <!-- Right column: image at standard 16/10 ratio + max-height — no align-self:end -->
    <figure class="frame-img r-16x10" data-anim>
      <img src="images/codepilot.png" alt="CodePilot product screenshot">
      <figcaption class="img-cap">CodePilot · Product Screenshot</figcaption>
    </figure>
  </div>
  <div class="foot">
    <div>Page 03 · I'm Not a Programmer</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Use `grid-2-7-5` (left 7 parts, right 5 parts) — `align-items:start` is already preset in the template
- **Left column**: flex column + `justify-content:space-between` — heading anchors to the top, callout naturally anchors to the bottom
- **Right column image**: **do not add `align-self:end`** — it slides the image to the cell's bottom and on low-resolution screens it gets covered by the browser toolbar
- Images must use **standard ratio classes `.r-16x10` or `.r-4x3`** — never use the original image's raw ratio (`2592/1798` and similar)

---

## Layout 5: Image Grid (Multi-Image Comparison)

```html
<section class="slide light">
  <div class="chrome">
    <div>Platform Follower Evidence</div>
    <div>Act I / Ops · 05 / 27</div>
  </div>
  <div class="frame" style="padding-top:5vh">
    <div class="kicker" data-anim>Proof · Follower Evidence</div>
    <h2 class="h-xl" data-anim>10 Platforms · 6 Screenshots</h2>

    <div class="grid-3-3" style="margin-top:4vh">
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/weibo.png" alt="Weibo 289K">
        <figcaption class="img-cap">Weibo · 289K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/twitter.png" alt="Twitter 137K">
        <figcaption class="img-cap">Twitter · 137K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/wechat.png" alt="WeChat Public 96K">
        <figcaption class="img-cap">WeChat Official · 96K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/jike.png" alt="Jike 26K">
        <figcaption class="img-cap">Jike · 26K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/xhs.png" alt="Xiaohongshu 19K">
        <figcaption class="img-cap">Xiaohongshu · 19K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/douyin.png" alt="Douyin 10K">
        <figcaption class="img-cap">Douyin · 10K</figcaption>
      </figure>
    </div>
  </div>
  <div class="foot">
    <div>Screenshot date · 2026.04</div>
    <div>Page 05 · Follower Evidence</div>
  </div>
</section>
```

**Key points**:
- Critical: every `frame-img` must have a hard-coded `height:NNvh` (never use `aspect-ratio`) — otherwise the grid will break
- Images auto-apply `object-fit:cover + object-position:top`, cropping only the bottom
- Use `.grid-3-3` (3×2) or `.grid-3` (3×1) as the container

---

## Layout 6: Two-Column Pipeline

```html
<section class="slide light" data-animate="pipeline">
  <div class="chrome">
    <div>My Workflow</div>
    <div>Act II · 15 / 27</div>
  </div>
  <div class="frame">
    <div class="kicker">Pipeline · Two Pipelines</div>
    <h2 class="h-xl">Two Pipelines</h2>

    <!-- Group 1: Text side -->
    <div class="pipeline-section">
      <div class="pipeline-label">Text Side · Text Pipeline</div>
      <div class="pipeline">
        <div class="step" data-anim="step">
          <div class="step-nb">01</div>
          <div class="step-title">Draft</div>
          <div class="step-desc">AI drafts the initial version</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">02</div>
          <div class="step-title">Polish</div>
          <div class="step-desc">AI polishes to remove AI-sounding tone</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">03</div>
          <div class="step-title">Morph</div>
          <div class="step-desc">AI transforms into Twitter / Xiaohongshu format</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">04</div>
          <div class="step-title">Illustrate</div>
          <div class="step-desc">AI generates infographics</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">05</div>
          <div class="step-title">Distribute</div>
          <div class="step-desc">One-click distribution to 9 platforms</div>
        </div>
      </div>
    </div>

    <!-- Group 2: Video side -->
    <div class="pipeline-section">
      <div class="pipeline-label">Visual · Video Side · Video Pipeline</div>
      <div class="pipeline">
        <div class="step" data-anim="step">
          <div class="step-nb">06</div>
          <div class="step-title">Cut</div>
          <div class="step-desc">AI assists with editing</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">07</div>
          <div class="step-title">Wrap</div>
          <div class="step-desc">AI assists with packaging</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">08</div>
          <div class="step-title">Cover</div>
          <div class="step-desc">AI generates cover images</div>
        </div>
      </div>
    </div>
  </div>
  <div class="foot">
    <div>Page 15 · My Content Factory</div>
    <div>Workflow</div>
  </div>
</section>
```

**Key points**:
- Group steps with `.pipeline-section` + label them with `.pipeline-label`
- Two groups are separated by a 3.6vh gap + top hairline separator (already set in CSS)
- Each step has a fixed nb → title → desc structure
- No limit on step count but a single pipeline row works best with ≤5 steps; otherwise use a second pipeline
- **Animation**: Add `data-animate="pipeline"` to `<section>`, add `data-anim="step"` to each `.step`. On page arrival, steps default to `opacity:.15`; pressing →/Space/scrolling down lights up one step at a time. **Navigation to the next page is blocked until all steps are lit** — this creates an interactive presentation rhythm intentionally, not a bug

---

## Layout 7: Suspense Close / Question Page (Hero Question)

```html
<section class="slide hero dark">
  <div class="chrome">
    <div>The Question for You</div>
    <div>24 / 27</div>
  </div>
  <div class="frame" style="display:grid; gap:8vh; align-content:center; min-height:80vh">
    <div class="kicker" data-anim>The Question</div>
    <h1 class="h-hero" style="font-size:7vw; line-height:1.15">
      <span data-anim style="display:block">In your organization,</span>
      <span data-anim style="display:block">which roles were never meant</span>
      <span data-anim style="display:block">to be filled by people?</span>
    </h1>
    <p class="lead" style="max-width:50vw" data-anim>
      This is not a technology question. It's an architecture question.
    </p>
  </div>
  <div class="foot">
    <div>Page 24 · The Question</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Hero pages benefit from maximum whitespace — only one question
- `h-hero` font size adjusts to length (7vw suits 3 lines, 10vw suits 1 line)
- Use `<br>` for manual line breaks to ensure breaks fall at semantic boundaries
- A `lead` line at the end can provide the pointed follow-up

---

## Layout 8: Big Quote Page (Big Quote · Serif Pull Quote)

```html
<section class="slide light" data-animate="quote">
  <div class="chrome">
    <div>The Takeaway · Core Pull Quote</div>
    <div>18 / 25</div>
  </div>
  <div class="frame" style="display:grid; gap:5vh; align-content:center; min-height:80vh">
    <div class="kicker" data-anim>Quote · Pull Quote</div>
    <blockquote style="font-family:var(--serif-zh); font-weight:700; font-size:5.8vw; line-height:1.2; letter-spacing:-.01em; max-width:72vw">
      <span data-anim="line" style="display:block">"Without the handoff,</span>
      <span data-anim="line" style="display:block">everyone builds."</span>
    </blockquote>
    <p class="lead" style="max-width:55vw; opacity:.65" data-anim>
      Without the handoff, everyone builds.<br>
      And that makes all the difference.
    </p>
    <div class="meta-row" data-anim>
      <span>— Luke Wroblewski</span><span>·</span><span>2026.04.16</span>
    </div>
  </div>
  <div class="foot">
    <div>Page 18 · Pull Quote</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Full whitespace — only one big quote and its attribution
- `<blockquote>` uses inline style to size up independently (5–6vw) — do not use `h-hero` (that class name is for page main headings)
- Follow with the English original (lead · opacity:.65) to create hierarchy
- Use `meta-row` for attribution and date

---

## Layout 9: Side-by-Side Comparison (A vs B · Old vs New)

```html
<section class="slide light" data-animate="directional">
  <div class="chrome">
    <div>Old vs New · The Shift</div>
    <div>12 / 25</div>
  </div>
  <div class="frame" style="padding-top:5vh">
    <div class="kicker" data-anim>Before / After · Paradigm Shift</div>
    <h2 class="h-xl" style="margin-bottom:4vh" data-anim>From Handoff to Co-build</h2>

    <div class="grid-2-6-6" style="gap:5vw 4vh">
      <!-- Left column: old -->
      <div data-anim="left" style="padding:3vh 2vw; border-left:3px solid currentColor; opacity:.55">
        <div class="kicker" style="opacity:.9">Before · Old Model</div>
        <h3 class="h-md" style="margin-top:2vh">Design → Dev → Handoff</h3>
        <ul style="margin-top:3vh; padding-left:1.2em; display:flex; flex-direction:column; gap:1.4vh; font-family:var(--sans-zh); font-size:max(14px,1.1vw); line-height:1.55">
          <li>Designer produces files in Figma</li>
          <li>Developer translates pixels by staring at the file</li>
          <li>Repeated PR rounds to align</li>
          <li>Non-technical staff cannot touch the code</li>
        </ul>
      </div>
      <!-- Right column: new -->
      <div data-anim="right" style="padding:3vh 2vw; border-left:3px solid currentColor">
        <div class="kicker" style="opacity:.9">After · New Model</div>
        <h3 class="h-md" style="margin-top:2vh">Same tool · Parallel · Co-build</h3>
        <ul style="margin-top:3vh; padding-left:1.2em; display:flex; flex-direction:column; gap:1.4vh; font-family:var(--sans-zh); font-size:max(14px,1.1vw); line-height:1.55">
          <li>Three roles working simultaneously in Intent</li>
          <li>agents.md as shared context</li>
          <li>Agents handle alignment / conflicts / animations</li>
          <li>Anyone can safely contribute code</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="foot">
    <div>Page 12 · Paradigm Shift</div>
    <div>Before / After</div>
  </div>
</section>
```

**Key points**:
- Use `.grid-2-6-6` (1:1) to split left and right equally
- Left column `opacity:.55` visually de-emphasizes "the old"; right column at full brightness highlights "the new"
- Both columns use `border-left:3px solid` + `padding-left` for a block-quote feel
- Consistent structure in each column: `kicker` → `h-md` → `<ul>` bullet points

---

## Layout 10: Mixed Image-Text (Lead Image + Side Text)

```html
<section class="slide light">
  <div class="chrome">
    <div>Design First · Design-Led</div>
    <div>08 / 16</div>
  </div>
  <div class="frame grid-2-8-4" style="padding-top:6vh">
    <!-- Left column: long body + quote -->
    <div>
      <div class="kicker" data-anim>Phase 01 · Design Stage</div>
      <h2 class="h-xl" style="margin-top:1vh; margin-bottom:3vh" data-anim>Design First · 2 Weeks</h2>

      <p class="lead" style="margin-bottom:3vh" data-anim>
        Visual exploration and design system completed in Figma — grid, typography, color variables, reusable components, multiple rounds of feedback on desktop and mobile mockups.
      </p>

      <p data-anim style="font-family:var(--sans-zh); font-size:max(14px,1.15vw); line-height:1.75; opacity:.78; margin-bottom:2.4vh">
        Within two weeks, visual style, rough structure, and directional content were all locked. A solid traditional design process — nothing remarkable at this stage yet.
      </p>

      <div class="callout" style="margin-top:3vh" data-anim>
        "This phase was pretty standard.<br>Just a solid Web design process."
        <div class="callout-src">— Luke Wroblewski</div>
      </div>
    </div>
    <!-- Right column: supporting image · portrait or square -->
    <figure class="frame-img r-3x4" data-anim>
      <img src="images/figma.png" alt="Figma design system">
      <figcaption class="img-cap">Figma · Design System</figcaption>
    </figure>
  </div>
  <div class="foot">
    <div>Page 08 · Design First</div>
    <div>~2 weeks</div>
  </div>
</section>
```

**Key points**:
- `.grid-2-8-4` (8:4) gives the text the dominant space — the image acts as support
- The left column contains multiple information layers: kicker → large heading → lead → body paragraph → callout (quote)
- Right column image uses **portrait 3:4** or square 1:1 to avoid competing for attention with the left column text
- This layout suits **pages with heavier information density** (unlike Layout 4, which has only a single pull quote)

---

## Appendix: Common Grid Templates

| Class | Ratio | Purpose |
|---|---|---|
| `.grid-2-6-6` | 6:6 (1:1) | Equal split |
| `.grid-2-7-5` | 7:5 | Text-dominant + supporting image |
| `.grid-2-8-4` | 8:4 (2:1) | Long body text + small image / data |
| `.grid-3` | 1:1:1 | 3 parallel items (cases / screenshots) |
| `.grid-3-3` | 3×2 | 6-image matrix |
| `.grid-6` | 3×2 | 6 data cards |

All grids come with a preset `gap: 3vw 4vh` (horizontal 3vw, vertical 4vh) — this can be individually overridden.

---

## Page Rhythm Recommendations

For a 25–30 page talk, the recommended rhythm is:

1. **Hero Cover** (page 1)
2. **Act Divider** (first act opener — hero light or hero dark)
3. **Big Numbers** (throw out hard data for impact)
4. **Quote + Image** (tell the identity contrast / hook)
5. **Image Grid** (evidence support)
6. **Hero Question** (act close — leave suspense)
7. ... second act, third act follow the same rhythm ...
8. **Hero Close** (last page — question or acknowledgment)

Hero pages and non-hero pages should alternate at roughly a **2–3:1 ratio** — never more than 3 consecutive non-hero pages, and never more than 2 consecutive hero pages.
