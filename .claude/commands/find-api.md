---
description: Find the right x402 API for a task using Decixa
---

Use the decixa MCP server to find APIs for the user's task.

1. Call `search_apis` with the user's intent as the `intent` parameter.
2. If the user mentions a budget, pass it as `budget` (USDC per call).
3. If the user mentions a latency requirement, pass it as `latency`.
4. Return the top 3 results with: name, price per call, endpoint URL, trust score, and a one-line description.
5. If no results match, call `browse_apis` with a broader `task` keyword search.

Format the output as a numbered list. For each API, show:
- **Name** (provider)
- Price: `$X per call`
- Endpoint: `https://...`
- Trust: `X.X / 1.0`
- What it does: one sentence
