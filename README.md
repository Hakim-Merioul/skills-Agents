# Skills

> Agent skills I built and use every day for real engineering — not vibe coding.

A growing collection of Claude Code skills, designed for the work I actually
do. Hackable, cloneable, no vendor lock-in. Each skill is a single folder
under `skills/` — install only what you need.

## Installation

Clone the repo and copy any skill into your `~/.claude/skills/`:

```bash
git clone https://github.com/Hakim-Merioul/skills-Agents.git
cp -r skills-Agents/skills/transposition ~/.claude/skills/
```

Or copy a single `SKILL.md` file manually if you prefer.

## Skills

### transposition
Transfer the context of the current conversation into another window —
another Claude Code session, ChatGPT, Claude.ai, Gemini, or a human
teammate. Inspired by Ino Yamanaka's *Shintenshin no Jutsu*: transposing
a mind from one body into another.

Outputs a markdown file in `.transposition/` and a copy-paste-ready block
for any other tool. Multi-domain — works for code, writing, research,
brainstorming.

Modes:
- `transposition-brief` — short checkpoint
- `transposition-full` — full recap
- `transposition-prompt` — full + ready-to-paste prompt for the next window
- `transposition-code` — full + dev sections (diff, commands, TODOs)

[→ skills/transposition](skills/transposition/)

### gaya
Distill a heavyweight reference model's output (Opus 4.7) into a cheap small model
by iteratively searching over the prompt and every OpenRouter API parameter,
scored by an LLM-as-judge. Named after Gaïa, mother of the Titans. Inspired by
Karpathy's [autoresearch](https://github.com/karpathy/autoresearch) loop pattern.

Outputs a markdown report with the score curve, every configuration tried, and a
final prompt + params block ready to paste into an application.

[→ skills/gaya](skills/gaya/)

## License

MIT.
