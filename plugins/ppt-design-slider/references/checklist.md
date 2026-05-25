# Pre-delivery checklist

Run before handing the deck back to the user. Group P0 issues block delivery; P1 should be fixed; P2/P3 are polish.

## P0 — must pass

- [ ] Deck title in `<title>` and on cover slide matches the user's brief (no leftover `[required] Replace with PPT title` placeholders).
- [ ] All `images/NN-*.{jpg,png}` files exist and load (no broken `<img>`).
- [ ] No emoji used as icons (use Lucide / SVG icons matching the template).
- [ ] Color palette: every `color`, `background`, `border-color` references a `var(--*)` from the template's `:root`. No invented hex values mid-deck.
- [ ] Fonts: every `font-family` references the families the template imports (no `Inter` / `Arial` substitution if the template uses `Cormorant Garamond`).
- [ ] No raw text in `<div>` if the deck targets editable PPTX (rule #1 of pptx-export-rules.md).
- [ ] If the chosen template is `swiss`: `node assets/scripts/validate-deck.mjs <deck.html>` returns zero errors.

## P1 — should pass

- [ ] Hero rhythm: a cover/section-break/big-quote slide every 3-4 slides.
- [ ] Light/dark balance: no more than 3 consecutive slides in the same scheme.
- [ ] Image aspect ratios are standard (16:9 / 16:10 / 4:3 / 3:2 / 1:1 / 21:9), not raw EXIF.
- [ ] Page numbers updated (`NN / TT` consistent with actual deck length).
- [ ] One idea per slide. No slide carries two competing ideas.
- [ ] Brand spec referenced via `<img src="…/logo.svg">` and `var(--brand-*)`, not redrawn / re-approximated.

## P2 — polish

- [ ] Spacing rhythm consistent with the template's demo deck (same `padding`, same gap).
- [ ] Decorative ornaments (corner brackets, paper grain, hairlines) present on every slide where the template's demo shows them.
- [ ] No `align-self: end` on `<img>` (drifts to footer; collides with nav controls).
- [ ] Chinese big-headline font sizes graded by character count (see magazine/swiss design notes).

## P3 — nice-to-have

- [ ] Speaker notes in `<aside class="speaker-notes">` per slide.
- [ ] Source citations in chrome/footnote area for any quoted stat.
- [ ] If the deck will be presented live: a "B" key handler that drops to a low-power static mode (Swiss template ships this).

## Final sanity check

Open the final deck in the browser (`open <deck.html>`). Walk through page-by-page. If anything makes you wince, fix it before exporting PPTX/PDF.
