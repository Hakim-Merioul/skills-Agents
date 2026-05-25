# Swiss International Style · Theme Color Presets (Swiss Themes)

4 high-contrast color sets based on the Swiss International Style. **Every set follows the minimalist principle of "premium grey-white base + single high-saturation highlight color"** — this is the soul of Swiss style; mixing multiple highlight colors is not allowed.

---

## How to Apply

1. Ask the user which set they want (or recommend one based on the content)
2. Open the `<style>` block in `assets/template-swiss.html`
3. Find the `:root{` block at the top
4. **Replace as a whole** all variables marked with "theme color" comments: `--paper` / `--paper-rgb` / `--ink` / `--ink-rgb` / `--grey-1` / `--grey-2` / `--grey-3` / `--accent` / `--accent-rgb` / `--accent-on`
5. All other CSS uses `var(--...)` — no other changes are needed

---

## 🔵 International Klein Blue (IKB · International Klein Blue)

**Suited for**: General use, business launches, AI/tech products, design community presentations. The most classic Swiss color palette — always reliable.
**Tone**: Pure white base + IKB Klein Blue — extremely calm, rational, and academic, like the work of Helvetica Forever or Massimo Vignelli.

```css
--paper:#fafaf8;
--paper-rgb:250,250,248;
--ink:#0a0a0a;
--ink-rgb:10,10,10;
--grey-1:#f0f0ee;
--grey-2:#d4d4d2;
--grey-3:#737373;
--accent:#002FA7;
--accent-rgb:0,47,167;
--accent-on:#ffffff;
```

**Usage notes**:
- IKB is a high-saturation deep blue; it delivers strong visual impact in large blocks (e.g. `.accent-block`)
- KPI numbers with the `.accent` class use blue, but do not flood the screen with blue — IKB loses its premium feel when overused
- Recommended to alternate with `dark` theme pages; black background with highlighted IKB is equally premium

---

## 🟡 Lemon Yellow (Lemon · Cadmium Yellow)

**Suited for**: Youth, sports, retail, consumer goods, energetic themes, Y2K retro design.
**Tone**: Light off-white base + lemon yellow — vivid, energetic, strong alert quality, like the visual language of IKEA or Beck Design.

```css
--paper:#fafaf8;
--paper-rgb:250,250,248;
--ink:#0a0a0a;
--ink-rgb:10,10,10;
--grey-1:#f0f0ee;
--grey-2:#d4d4d2;
--grey-3:#737373;
--accent:#FFD500;
--accent-rgb:255,213,0;
--accent-on:#0a0a0a;
```

**Usage notes**:
- Lemon yellow is a light high-saturation color — **`--accent-on` must use pure black** (not white) for legibility
- Do not place white text on yellow blocks — it will blur
- Lemon yellow works best as a single-character highlight (`.mark` / `.underline-accent`)

---

## 🟢 Lemon Green (Lemon Green · Highlighter Green)

**Suited for**: Ecology, sustainability, health, emerging technology, Gen-Z brands, AI startups.
**Tone**: Light off-white base + fluorescent lemon green — futuristic, youthful, contemporary, like the visual style of Acne Studios or Off-White.

```css
--paper:#fafaf8;
--paper-rgb:250,250,248;
--ink:#0a0a0a;
--ink-rgb:10,10,10;
--grey-1:#f0f0ee;
--grey-2:#d4d4d2;
--grey-3:#737373;
--accent:#C5E803;
--accent-rgb:197,232,3;
--accent-on:#0a0a0a;
```

**Usage notes**:
- Fluorescent green, like yellow, is a light color — **`--accent-on` must use pure black**
- Screen rendering is more attractive than print; suits presentation projection environments
- Recommended for "emerging technology" and "future" themes

---

## 🟠 Safety Orange (Safety Orange)

**Suited for**: Industrial, warning, sports, construction, automotive, "caution/emphasis" slides at tech launch events.
**Tone**: Light off-white base + safety orange — industrial feel, urgency, strong visual anchor, like a Saul Bass poster or Highway Gothic signage system.

```css
--paper:#fafaf8;
--paper-rgb:250,250,248;
--ink:#0a0a0a;
--ink-rgb:10,10,10;
--grey-1:#f0f0ee;
--grey-2:#d4d4d2;
--grey-3:#737373;
--accent:#FF6B35;
--accent-rgb:255,107,53;
--accent-on:#ffffff;
```

**Usage notes**:
- Orange falls between light and dark — **white text is barely readable; bold weight (600+) is recommended**
- Strong industrial feel; suited for content involving "warning," "decision," or "turning points"
- A full-page `.accent` mode is not recommended for orange; it is too aggressive at full screen — use it for local highlights only

---

## Recommended Selection Reference

| If the content is… | Recommended theme |
|---|---|
| Unsure / first time / AI / tech / design | 🔵 International Klein Blue |
| Youth, energy, consumer, retail | 🟡 Lemon Yellow |
| Ecology, future, Gen-Z, emerging | 🟢 Lemon Green |
| Industrial, warning, automotive, urgency | 🟠 Safety Orange |

---

## Switching Principles

- **One deck uses one theme only** — do not change accent color mid-deck
- The grey-scale variables (`--grey-1/2/3`) are identical across all 4 themes; no adjustment needed
- The WebGL grid background automatically reads `--accent`; near the cursor, a trace of the highlight color bleeds through during page turns
- After selecting a theme, reinforce it with a related word in the chrome copy (e.g. IKB with `International / Helvetica`; lemon yellow with `Active / Living`)

---

## ❌ What Not to Do

- ❌ **No mixing** (e.g. IKB blue + lemon yellow simultaneously as highlights) — this fundamentally violates the Swiss "single anchor color" principle
- ❌ **No custom hex values from users** — politely decline; show the 4 presets for selection
- ❌ **Do not modify grey-scale variables** — `--paper` / `--grey-1/2/3` / `--ink` are unified across themes; only swap the accent
- ❌ **No gradients** — Swiss style refuses any gradient; all color blocks must be flat
- ❌ **Do not add shadow / rounded corners / opacity to accent** — square corners, flat color, fully opaque; these are the hard rules of Swiss style

---

## On Grey Scale (unified across themes)

| Variable | Value | Purpose |
|---|---|---|
| `--paper` | `#fafaf8` | Primary base color (very light warm white) |
| `--grey-1` | `#f0f0ee` | Light grey background (for `.grey-block` / zone fills) |
| `--grey-2` | `#d4d4d2` | Mid grey (dividing lines, borders) |
| `--grey-3` | `#737373` | Dark grey (supplementary text / meta) |
| `--ink` | `#0a0a0a` | Primary text color (near-black) |

This grey scale is calibrated "premium grey" — it does not compete with any accent color. **Do not** change to pure white (`#fff`) or pure black (`#000`) — this would diminish the "restraint" quality of Swiss style.

---

After selecting a theme, inform the user: "Using 🔵 International Klein Blue / 🟡 Lemon Yellow ..." and note it in the deck project record for consistency in future iterations.
