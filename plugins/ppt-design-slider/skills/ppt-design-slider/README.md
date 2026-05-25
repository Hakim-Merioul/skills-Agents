# ppt-design-slider

Skill that turns raw slide content into a designed PowerPoint deck.

## What it does

1. Asks the user for the deck's occasion and mood.
2. Shows 3 template candidates from the 36-design catalog with live title-slide previews — OR builds a custom style spec in 5 questions if the user wants bespoke.
3. Splits the user's raw content into slides matching the chosen design system's layout grammar.
4. Exports `.pptx` (editable text boxes when possible, image-based as universal fallback) and `.pdf`.

## Compatibility

Any [Agent Skills](https://agentskills.io) runtime (Codex CLI, plugin-based agents,
desktop apps). The skill body uses runtime-neutral phrasing ("ask the user",
"open the file") with no platform-specific tool calls, so the same workflow runs
everywhere.

## Template library

36 designs total, organized into two tiers:

- **Flagship** — 2 themed mega-templates (Magazine, Swiss). Each comes with its own
  layout grammar (10 and 22 named layouts respectively), motion system, theme palettes,
  and validation rules.
- **Editorial** — 34 single-aesthetic templates. Each has one fonts/palette/decorative
  vocabulary tuned for a specific tone.

Browse `references/catalog.md` for the full list, or read `index.json` for the
machine-readable catalog.

## Custom style path

If no template fits, the skill asks 5 minimum-viable questions (paper/ink colors,
accent, type stack, mood, decorations) and writes a `_design-spec.md` in the project
workspace. The deck is then built against that custom spec — same workflow, same
exporters.

## Scripts

- `assets/scripts/export-pptx-editable.mjs` — converts HTML deck → editable PPTX (text boxes)
- `assets/scripts/export-pptx-image.mjs` — converts HTML deck → image-based PPTX (universal)
- `assets/scripts/export-pdf.mjs` — PDF export, works on every template
- `assets/scripts/validate-deck.mjs` — lints a finished deck before delivery

The export scripts must be copied into your project workspace before running (Node ESM resolves dependencies relative to each script file). See `SKILL.md` Step 6 for the full installation flow.

Dependencies (installed in your project workspace, not the skill):
```bash
npm install pptxgenjs playwright sharp pdf-lib
npx playwright install chromium
```

## License

MIT. See `NOTICES.md` for third-party attribution.
