# Gaya Optimization Report — {slug}

**Generated:** {timestamp}
**Task:** {task_oneliner}
**Candidate model:** `{small_model}`
**Reference model:** `anthropic/claude-opus-4-7`
**Iterations:** {n_iterations}
**Best score:** **{best_score} / 100** (iteration #{best_iteration})
**Total OpenRouter spend:** ${total_usd}

## Score evolution

| # | Score | Δ | Lever changed | Rationale (excerpt) |
|---|---|---|---|---|
{score_table}

```
{score_chart}
```

## Final prompt (ready to paste)

**System prompt:**
````````
{best_system_prompt}
````````

**User prompt template:**
````````
{best_user_prompt}
````````

**Parameters:**
```json
{best_params_json}
```

## Integration snippet (Python, OpenRouter)

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)

resp = client.chat.completions.create(
    model="{small_model}",
    messages=[
        {"role": "system", "content": """{best_system_prompt}"""},
        {"role": "user",   "content": """{best_user_prompt}"""},
    ],
    # Spread the optimized params:
    **{best_params_dict_literal},
)
print(resp.choices[0].message.content)
```

## All iterations

<details>
<summary>Expand full iteration log ({n_iterations} entries)</summary>

{full_iteration_dump}

</details>

## Reference output (Opus 4.7, score 100 by definition)

````````
{reference}
````````
