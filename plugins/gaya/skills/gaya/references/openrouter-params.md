# OpenRouter chat-completion parameters

Every knob the Gaya optimizer is allowed to turn. Source: <https://openrouter.ai/docs/api-reference/parameters>.

## Sampling

| Param | Type | Range | Default | What it does |
|---|---|---|---|---|
| `temperature` | float | 0.0–2.0 | 1.0 | Softmax scale. 0 = deterministic argmax, >1 = flatter, more random. |
| `top_p` | float | 0.0–1.0 | 1.0 | Nucleus sampling. Keep smallest set of tokens whose cumulative prob ≥ top_p. |
| `top_k` | int | 0–N | 0 | Keep only the K highest-probability tokens. 0 disables. |
| `min_p` | float | 0.0–1.0 | 0.0 | Drop tokens whose prob < min_p × P(top token). Adaptive nucleus. |
| `top_a` | float | 0.0–1.0 | 0.0 | Drop tokens whose prob < top_a × P(top token)². Stricter than min_p. |
| `repetition_penalty` | float | 0.0–2.0 | 1.0 | Multiplicative penalty on logits of already-seen tokens. >1 discourages repetition. |
| `frequency_penalty` | float | -2.0–2.0 | 0.0 | Additive logit penalty proportional to token frequency. |
| `presence_penalty` | float | -2.0–2.0 | 0.0 | Additive logit penalty for any token that has appeared. |
| `seed` | int | any | unset | Deterministic sampling when the provider supports it. |

## Output control

| Param | Type | Default | What it does |
|---|---|---|---|
| `max_tokens` | int | unset | Hard cap on completion tokens. |
| `stop` | string \| string[] | unset | Stop generation when any sequence is produced. |
| `response_format` | object | unset | `{"type": "json_object"}` forces JSON. Some providers also accept `{"type": "json_schema", "json_schema": {...}}`. |

## Messages

| Param | Type | Notes |
|---|---|---|
| `messages` | array | Standard chat-completion array. `system` first (optional), then alternating `user`/`assistant`. |

## Tuning heuristics for Gaya

- **Reduce variance** → lower `temperature` (0.2–0.5), tighten `top_p` (0.85–0.95).
- **Encourage exploration** → raise `temperature` (1.0–1.3) with `top_p` ≥ 0.95.
- **Repetition loops** → `repetition_penalty` 1.1–1.3 OR `frequency_penalty` 0.3–0.7.
- **Padding / preamble** → `presence_penalty` 0.5–1.0 or stricter `stop`.
- **Need JSON** → set `response_format`, lower `temperature` to 0.0–0.3.
- **Need reproducibility while tuning** → set `seed` to a fixed integer.

## Anti-patterns

- Don't combine `top_p < 1`, `top_k > 0`, `min_p > 0`, and `top_a > 0` all at once — providers compose them differently and the result is unpredictable. Pick one.
- Don't raise `temperature` to "fix" wrong answers — variance ≠ knowledge.
- Don't set `max_tokens` so low it truncates JSON mid-key.
