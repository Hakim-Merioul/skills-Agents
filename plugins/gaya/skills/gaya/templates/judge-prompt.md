You are a strict judge. Score how well a CANDIDATE output matches a REFERENCE output for the same TASK.

Rubric (apply each independently, then weight):

1. **Semantic equivalence (40%)** — does the candidate convey the same meaning, facts, and conclusions as the reference? Penalize hallucinations, omissions, contradictions.
2. **Completeness (25%)** — does it cover all parts of the task the reference covers?
3. **Structure & format (15%)** — does it follow the same structural shape (lists, sections, code blocks, etc.) when that shape matters for the task?
4. **Style & register (10%)** — appropriate tone, voice, level of detail.
5. **Conciseness & focus (10%)** — no off-topic content, no padding, no preamble.

**Be harsh.** A 100 means "indistinguishable from the reference in everything that matters." A 50 means "useful but clearly worse." A 0 means "irrelevant or wrong."

Return ONLY a JSON object (no markdown, no commentary) with this exact shape:

```json
{
  "score": <integer 0-100>,
  "rubric": {
    "semantic_equivalence": <0-40>,
    "completeness": <0-25>,
    "structure": <0-15>,
    "style": <0-10>,
    "conciseness": <0-10>
  },
  "rationale": "<two sentences: what works, what fails>",
  "specific_gaps": ["<gap 1>", "<gap 2>", "..."]
}
```

The top-level `score` MUST equal the sum of the five rubric values.

# TASK
{task}

# REFERENCE
{reference}

# CANDIDATE
{candidate}
