# Template selection

## The picking workflow

1. Ask the user TWO things explicitly:
   - **Occasion**: founder pitch / research synthesis / brand manifesto / classroom kickoff / data report / launch / …
   - **Mood**: confident & punchy / quiet & literary / warm & playful / dark & moody / clinical & technical / …
   Even if the brief feels obvious — ask. Stated taste reveals what the brief hides.

2. Load `index.json`. Match user occasion + mood against each template's `mood`, `tone`, `best_for`, `formality`.

3. Pick **three** candidates that genuinely differ from each other (don't pick three editorial templates if brief is editorial — pick one editorial, one warmer alternative, one wildcard).

4. For each candidate, clone its first slide (the cover) into a temp folder, swap placeholder text for the user's actual deck title / subtitle / author / date. Save as `_previews/0N-<slug>.html` in the project workspace.

5. Open all three previews (in Codex/Desktop: tell the user the file paths and ask them to open; in Claude Code: use `open` via the shell) and ask: "Three options to compare. Which feels right?"

6. Wait. Do not start the full deck until the user picks one.

## Schema fields in index.json

| field | meaning | how to match |
|---|---|---|
| `mood` | emotional adjectives | against user's *feeling* words |
| `tone` | voice / personality | against descriptors like "playful", "serious" |
| `occasion` | example use cases | soft signal, not hard filter |
| `formality` | low / medium / high | sanity check vs audience seniority |
| `density` | content-per-slide capacity | match against content volume |
| `scheme` | light / dark / mixed | hard signal if user requested a side |
| `best_for` | feeling + contexts | lead with this when narrating your pick |
| `avoid_for` | tone clashes | soft warning |
| `slide_count` | demo deck size | hint at layout variety |
| `tier` | `flagship` or `editorial` | flagship templates have richer layout grammars + validators |
| `pptx_editable` | true ⇒ can export editable PPTX | false ⇒ image-based PPTX only |

## Tone-first matching

Templates have **tones, not industries**. A confident editorial deck can carry a tech talk. A pastel deck can carry a finance review if the user is rejecting the formal-finance look.

- Lead with `mood` + `tone` + `best_for`.
- `avoid_for` is a soft warning, not a hard rule.
- `formality` and `density` are sanity checks.
- Do not over-fit on `occasion` — it's example contexts.
- Ask about *tone*, not *industry*.

## Renaming for the user's project

The skill's `assets/templates/<slug>/` is immutable. When the user picks a template:
- Copy the whole template folder into `<project>/deck/`
- The user can rename the folder freely (e.g. `<project>/deck/q3-board-review/`)
- Update internal relative paths if the user moves sub-assets
