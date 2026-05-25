# Extending a template (when the user needs a layout the template doesn't have)

Sometimes the user's content needs a layout the chosen template's demo deck doesn't include. **Design the missing slide using the template's existing design system**. Do not bail to a different template. Do not import a new visual language.

## Rules for extension

- **Same fonts.** Same `font-family` declarations the template uses for h1 / h2 / body / mono. Same weights, line-heights, letter-spacing.
- **Same color palette.** Use the existing `:root` CSS variables. If a "warning" or "highlight" color isn't in the palette, pick the closest existing accent — don't introduce new hex values.
- **Same decorative vocabulary.** If the template uses corner brackets, paper grain, hand-drawn doodles, geometric shapes — your new slide uses the same vocabulary. A bare slide in a template full of ornament looks broken.
- **Same spacing rhythm.** If the template uses `padding: 64px`, your new slide does too. Same grid, same gutter.
- **Same component grammar.** If stat cards follow `big-number → label → description → mono-caption`, reuse that structure.
- **Same chrome.** Top label / bottom page-number / corner mark — match what the rest of the deck shows.
- **Same nav behavior.** If the template uses `deck-stage.js`, your new slide integrates the same way.

## The test

Open your new slide between two existing slides. If it visibly *belongs* — same fonts, same colors, same decorations, same rhythm — you've succeeded.

If it looks like a different template grafted on, redo it.

## What NOT to do

- Don't mash layouts from two templates together. Each template is a closed visual system.
- Don't strip "extra" decorations thinking they're noise. Corner brackets, paper grain, ornaments — they're identity.
- Don't "modernize" old templates. Pick a different template instead.

## Swiss template is locked

The `swiss` template uses a strict 22-layout lock (S01–S22). Every body slide must declare `data-layout="Sxx"`. You may not invent new layouts unless the user explicitly requests an experimental layout. Always run `node assets/scripts/validate-deck.mjs <deck.html>` before delivery.
