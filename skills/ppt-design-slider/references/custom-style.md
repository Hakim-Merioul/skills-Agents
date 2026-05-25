# Custom style — minimum-viable design spec

Use this when no template in the 36-design catalog fits the user's needs — bespoke
brand work, an unusual aesthetic, or the user has very specific opinions. The output is
a `_design-spec.md` file in the project workspace that plays the same role for the deck
that `design.md` plays for an embedded template.

## Trigger

After Step 2 of the SKILL.md workflow (showing 3 candidates), the user might say:
- "None of these fit"
- "I want something custom"
- "Can we do my brand colors instead?"
- "I have a specific look in mind"

When that happens, switch to this path.

## The five questions (ask in ONE round, not iteratively)

Send the user a single message with these 5 questions. Wait for all answers before
writing the spec. If the user already answered some via the brief or the brand asset
protocol (e.g. they already gave you logo + colors), skip those.

> Five quick questions to build the custom style spec:
>
> 1. **Palette** — what are the paper (background) and ink (text) colors? Hex codes if
>    you have them, or named colors like "warm cream" / "deep navy". One accent color
>    too (the highlight).
> 2. **Type stack** — serif headlines (literary, considered) or sans-serif headlines
>    (clinical, modern)? Specific font families you want, or should I pick?
> 3. **Mood** — pick 2-3 adjectives: editorial / playful / clinical / warm / brutalist
>    / institutional / etc.
> 4. **Decorations** — grid + hairlines (Swiss-style) / paper texture + ornaments
>    (editorial-style) / corner brackets + frames (zine-style) / none (pure minimalism)?
> 5. **Brand assets** — do you have a logo file, product photos, or UI screenshots to
>    embed? If yes, where are they? If no, I'll leave honest placeholders.

## The spec template

Once the user answers, write `<project>/deck/_design-spec.md`:

```markdown
# <Deck name> — Custom Design Spec
> Authored: YYYY-MM-DD · Source: user brief

## Palette
- Paper / background: `#XXXXXX`  <e.g. warm cream / deep navy>
- Ink / text:        `#XXXXXX`
- Accent:            `#XXXXXX`
- (Optional) Secondary accent: `#XXXXXX`

CSS injection (paste into the deck's `:root`):
```css
:root {
  --paper: #XXXXXX;
  --ink: #XXXXXX;
  --accent: #XXXXXX;
  --paper-tint: rgba(<paper-rgb>, 0.1);
  --ink-tint: rgba(<ink-rgb>, 0.08);
}
```

## Type
- Display (headlines): <family stack> — weight <N>
- Body: <family stack> — weight <N>
- Mono (metadata): <family stack> — weight <N>

Google Fonts `<link>` if applicable: `https://fonts.googleapis.com/...`

## Mood
<2-3 adjectives the user picked>

## Decorative vocabulary
- Grid: <12-col / 8-col / free>
- Hairlines: <yes / no — color, weight>
- Corner ornaments: <yes / no>
- Paper texture: <yes / no — opacity>
- Image frames: <hairline / heavy / none>
- Icons: <Lucide angular / Lucide rounded / none>

## Brand assets (if any)
- Logo:        `<project>/deck/assets/logo.svg`         (or "TBD — placeholder")
- Product:     `<project>/deck/assets/product-hero.png` (or "TBD")
- UI:          `<project>/deck/assets/ui-home.png`      (or "TBD")

## Hard rules (carry over to every slide)
1. Use only the CSS variables above. Don't introduce new hex codes mid-deck.
2. Use only the declared type families. No font substitution.
3. Match the decorative vocabulary on every slide — consistent ornaments, consistent
   image framing.
4. One idea per slide. Hero rhythm every 3-4 slides.
5. Standard image ratios only (16:9 / 16:10 / 4:3 / 3:2 / 1:1 / 21:9).
```

## Building the deck against the custom spec

After the spec is written:

1. Pick a structural skeleton — clone the **closest-in-spirit template** from the catalog
   as a starting layout shell (e.g. clone `monochrome` if the spec says "minimal sans-serif
   on cream", clone `cobalt-grid` if the spec says "structured grid with electric accent").
2. Strip out the source template's `:root` colors and font imports. Replace with the
   spec's palette + type stack.
3. Adapt each slide's content using the existing layout structure but with the new
   design system applied.
4. Run the same QA (`references/checklist.md`) and export (`SKILL.md` Step 6) flow.

## When to refuse custom style

If the user's request is incoherent ("I want it minimalist but with lots of decorative
elements", "use these 7 unrelated accent colors"), push back. The custom-style path
produces good decks only when the spec has internal coherence.

For genuine ambiguity, ask one follow-up question. For obvious incoherence, suggest
two refined directions and let the user pick.
