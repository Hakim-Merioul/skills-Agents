# Prompting techniques (curated)

The optimizer in `optimizer-prompt.md` is told to draw from this catalogue. Each entry: name, when-to-use, sketch.

## Chain-of-Thought (CoT)
**When:** reasoning, math, multi-step tasks.
**Sketch:** Add "Think step by step. First identify X, then Y, then conclude Z." or end with "Let's reason through this step by step:". Zero-shot CoT is a one-liner; few-shot CoT shows worked examples.

## Few-shot
**When:** classification, formatting tasks, anything where the desired output shape isn't obvious from instructions.
**Sketch:** 3–5 input→output pairs in the user prompt. Diminishing returns after 5–8. Pick examples that *cover the failure modes* you've seen, not random ones.

## Self-consistency
**When:** reasoning, brittle answers.
**Sketch:** Sample K times at higher temperature, take majority answer. Costly; Gaya can simulate by raising `temperature` + checking if the model self-stabilizes.

## Tree of Thoughts (ToT)
**When:** planning, search, problems with branchy intermediate decisions.
**Sketch:** Ask the model to enumerate candidate steps, evaluate each, then commit. Expensive — usually only worth it for hard reasoning.

## Role / persona priming
**When:** style or expertise mismatch.
**Sketch:** "You are a senior {role}. Your output is read by {audience}." Avoid theatrical personas — they hurt as often as they help.

## Output-format steering
**When:** structure mismatch (judge's `structure` rubric is low).
**Sketch:** Show the exact structure: "Return a markdown document with these sections: ...". Add an example skeleton. For strict shapes, set `response_format`.

## Decomposition
**When:** task is multi-part and the model conflates parts.
**Sketch:** "First, do A. Then, separately, do B. Then combine." Make the seams explicit.

## Self-critique / reflexion
**When:** the model's first draft is close but wrong in known ways.
**Sketch:** Two-shot user prompt: draft → critique → revise. Or single-shot: "Draft, then list three things wrong with your draft, then rewrite."

## Constraint priming
**When:** the model adds preamble, hedges, or off-topic content.
**Sketch:** "Do not include preamble, apologies, or 'Here is...'. Emit only the output." Combine with `presence_penalty` ~ 0.5.

## Negative instructions
**When:** consistent failure mode you can name.
**Sketch:** "Do NOT do X. Do NOT do Y." Effective in moderation; long don't-lists degrade performance.

## Worked example with rationale
**When:** the model gets the right shape but wrong logic.
**Sketch:** Show one input, the desired output, AND a sentence explaining *why* that output is right. Teaches the principle, not just the form.

## Self-ask / question decomposition
**When:** information lookup, multi-hop questions.
**Sketch:** "Before answering, list the sub-questions you must answer. Then answer each. Then synthesize." Pairs well with CoT.

## Anti-pattern: "be helpful" / "be accurate"
Vague injunctions don't work. Replace with a measurable instruction.
