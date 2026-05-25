# Theme Color Presets (Themes)

5 carefully curated color palettes to keep the "digital magazine × e-ink" aesthetic intact. **Users are not allowed to define custom colors — a wrong color combination instantly ruins the look.** Choose only from the presets below.

---

## How to Apply

1. Ask the user which palette they want (or recommend one based on the content)
2. Open `assets/template.html` and locate the `<style>` block
3. Find the `:root{` block at the top
4. **Replace in full** the lines marked with the "theme color" comment: `--ink` / `--ink-rgb` / `--paper` / `--paper-rgb` / `--paper-tint` / `--ink-tint`
5. All other CSS uses `var(--...)` — no other changes needed

---

## 🖋 Ink Classic (Monocle Default)

**Best for**: General sharing, business releases, tech products — safe default for any context.
**Mood**: Pure ink black + warm off-white. The strongest magazine feel. Monocle / Apricot / A Book Apart vibes.

```css
--ink:#0a0a0b;
--ink-rgb:10,10,11;
--paper:#f1efea;
--paper-rgb:241,239,234;
--paper-tint:#e8e5de;
--ink-tint:#18181a;
```

---

## 🌊 Indigo Porcelain

**Best for**: Tech / research / data sharing, engineering culture, deep content, technical launches.
**Mood**: Deep indigo + porcelain white. Cool, rational, and deep — like an academic journal or blue-and-white porcelain.

```css
--ink:#0a1f3d;
--ink-rgb:10,31,61;
--paper:#f1f3f5;
--paper-rgb:241,243,245;
--paper-tint:#e4e8ec;
--ink-tint:#152a4a;
```

---

## 🌿 Forest Ink

**Best for**: Nature / sustainability / culture / non-fiction content, outdoor brands, environmental themes.
**Mood**: Deep forest green + ivory. Grounded and breathable — like classic National Geographic.

```css
--ink:#1a2e1f;
--ink-rgb:26,46,31;
--paper:#f5f1e8;
--paper-rgb:245,241,232;
--paper-tint:#ece7da;
--ink-tint:#253d2c;
```

---

## 🍂 Kraft Paper

**Best for**: Nostalgic / humanist / reading / history / literary sharing, indie magazines, handcraft brands.
**Mood**: Deep brown + warm beige — like a kraft envelope or an old notebook. Warm and vintage.

```css
--ink:#2a1e13;
--ink-rgb:42,30,19;
--paper:#eedfc7;
--paper-rgb:238,223,199;
--paper-tint:#e0d0b6;
--ink-tint:#3a2a1d;
```

---

## 🌙 Dune

**Best for**: Art / design / creative / fashion sharing, gallery booklets, aesthetic-first private gatherings.
**Mood**: Charcoal + sand. Restrained, refined, and neutral — like a desert dusk or an architecture monograph.

```css
--ink:#1f1a14;
--ink-rgb:31,26,20;
--paper:#f0e6d2;
--paper-rgb:240,230,210;
--paper-tint:#e3d7bf;
--ink-tint:#2d2620;
```

---

## Recommended Selection Guide

| If the content is... | Recommended Palette |
|---|---|
| Unsure / first time using | 🖋 Ink Classic |
| AI / tech / product launch | 🌊 Indigo Porcelain |
| Content / industry insight / culture | 🌿 Forest Ink |
| Book reviews / lifestyle / humanities | 🍂 Kraft Paper |
| Design / art / branding | 🌙 Dune |

---

## Switching Rules

- **One deck, one palette** — do not switch colors mid-deck
- The WebGL shader's default primary tones (titanium dispersion / silver flow) work with all 5 palettes (tested and acceptable)
- `currentColor`-driven borders and icons automatically follow the section's text color — no extra adjustment needed
- Once a palette is chosen, the `<title>` text and `chrome` copy can reinforce its semantic mood (e.g., Kraft Paper paired with "Vol.03 · Autumn" style labels)

## ❌ Things to Avoid

- ❌ **No mixing palettes** (e.g., `ink` from Ink Classic, `paper` from Dune) — it will look completely off
- ❌ **Do not accept arbitrary hex values from the user** — politely decline and show the 5 presets to choose from
- ❌ **Do not edit colors elsewhere in template.html** — all scattered `rgba` values use `var()`; changing `:root` in one place is sufficient

Once a palette is chosen, tell the user in the skill conversation: "Using 🖋 Ink Classic / 🌊 Indigo Porcelain ..." and note it in the deck project record for consistent future iterations.
