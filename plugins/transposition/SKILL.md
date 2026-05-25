---
name: transposition
description: Use when the user wants to transfer the current conversation's context to another window — another Claude Code session, ChatGPT, Claude.ai, Gemini, or a human teammate. Triggers on /transposition, "transfer this context", "hand this off", "context dump", "save this session for later", "brief the next window", "I need to switch windows".
---

# Transposition

Transfer the context of the current conversation into another window.
Inspired by Ino Yamanaka's *Shintenshin no Jutsu* — transposing a mind
from one body to another. Here, we transpose a conversation from one
window to another.

This skill is **not code-specific**. It works for code, writing,
research, brainstorming, learning sessions — anything that happens in
a context window.

## Workflow

When invoked, execute these steps in order.

### 1. Pick the mode

Ask the user with `AskUserQuestion` which mode they want:

- `transposition-brief` — short checkpoint (~150 words): TL;DR, key
  decisions, next step.
- `transposition-full` — complete recap (~500 words) suitable for
  serious resumption.
- `transposition-prompt` — `transposition-full` plus a ready-to-paste
  prompt that briefs the receiving window to immediately resume work.
- `transposition-code` — `transposition-full` plus dev-specific
  sections: diff summary, commands run, explicit TODOs.

### 2. Derive the topic slug

Short kebab-case identifier (e.g., `auth-refactor`, `naruto-research`,
`wedding-speech-draft`). If you cannot infer a clean slug from the
conversation, ask the user for one.

### 3. Render the markdown

Read the matching template at
`~/.claude/skills/transposition/templates/<mode>.md`
(e.g., `transposition-full.md` for the `transposition-full` mode).
Fill in every section by extracting the relevant content from the
current conversation. Replace each `{placeholder}` with real content.
Do not leave placeholders in the final output. If a section has no
relevant content, write `_n/a_` rather than removing the section.

### 4. Write the file

Write the rendered markdown to:
`.transposition/YYYY-MM-DD-HHMM-<slug>.md`
at the project root.

- Create `.transposition/` if it does not exist.
- If a file with the same name already exists, append `-2`, `-3`, etc.
  before `.md`.

### 5. Print for copy-paste

Print the **same rendered markdown** in the terminal, wrapped in triple
backticks, so the user can copy it directly into ChatGPT, Claude.ai,
Gemini, or another tool. Precede the block with a one-line note:
`Copy-paste this into the next window:`.

## Edge cases

- **Conversation too short** (fewer than 3 substantive exchanges) —
  warn the user and offer to continue the conversation before
  transposing. Do not produce a file until the conversation has enough
  substance.
- **No clear topic** — ask the user for a slug.
- **`.transposition/` missing** — create it.
- **Filename collision** — append `-2`, `-3`, etc.

## Templates

The four templates live in `templates/`:

- `templates/transposition-brief.md`
- `templates/transposition-full.md`
- `templates/transposition-prompt.md`
- `templates/transposition-code.md`

Read the matching template, then substitute the values from the
conversation into the placeholders.
