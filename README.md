# decixa-mcp

**Find the right API for your AI agent.**
20,072+ APIs indexed. 2,269 x402 proven live.

MCP Server for [Decixa](https://decixa.ai) — The decision layer for AI Agents.

---

## Quickstart

```bash
# Claude Code
npx decixa-mcp
```

```json
// Claude Desktop — claude_desktop_config.json
{
  "mcpServers": {
    "decixa": {
      "command": "npx",
      "args": ["-y", "decixa-mcp"]
    }
  }
}
```

```json
// Cursor / Windsurf — .cursor/mcp.json or .windsurf/mcp.json
{
  "mcpServers": {
    "decixa": {
      "command": "npx",
      "args": ["-y", "decixa-mcp"]
    }
  }
}
```

---

## What you can do

```
search_apis({ intent: "get real-time BTC price" })
→ Returns cheapest x402-ready option with price and endpoint

search_apis({ intent: "summarize Reddit posts", budget: 0.005 })
→ Filters by cost, returns trust score and latency tier

search_apis({ intent: "transcribe audio", budget: 0.01 })
→ Only APIs verified to charge under $0.01 per call
```

---

## Why Decixa

Unlike x402.direct, Decixa verifies x402 compliance by actually probing each endpoint — not just metadata analysis.

| | Decixa | x402.direct |
|--|--------|-------------|
| APIs indexed | 20,072+ | ~4,000 |
| x402 verification | HTTP 402 probe (real) | Metadata scoring |
| Capability classification | 9 verb-based axes | — |
| Intent → API resolution | `/api/agent/resolve` | — |
| MCP server | `npx decixa-mcp` | — |

---

## Tools

### `search_apis`

Find the best API for a task using natural language. Returns top recommendation + up to 2 alternatives.

| Parameter | Type | Description |
|-----------|------|-------------|
| `intent` | string | What you want to do (e.g. `"summarize news articles"`) |
| `capability` | string | Capability verb: `Search` / `Extract` / `Analyze` / `Generate` / ... |
| `budget` | number | Max USDC per call (e.g. `0.01`) |
| `latency` | string | `low` / `medium` / `high` |
| `agent_ready` | boolean | Only agent-verified APIs. Default: `true` |

---

### `browse_apis`

Browse with filters. All parameters optional.

| Parameter | Type | Description |
|-----------|------|-------------|
| `task` | string | Keyword search across name and description |
| `capability` | string | Filter by capability verb |
| `tag` | string | Filter by tag (e.g. `"Market Data"`, `"Risk Score"`) |
| `budget` | number | Max USDC per call |
| `latency_tier` | string | `low` / `medium` / `high` |
| `sort` | string | `trust` (default) / `price_asc` / `price_desc` |
| `limit` | integer | Results per page (1–50, default 20) |
| `offset` | integer | Pagination offset |

---

### `get_api_detail`

Get full details for a specific API by ID.

| Parameter | Type | Description |
|-----------|------|-------------|
| `api_id` | string | API ID from `search_apis` or `browse_apis` |

Returns: endpoint URL, pricing, capability, tags, trust score, schema info, use cases, provider.

---

### `list_capabilities`

List all 9 capability verbs with descriptions and tags.

| Capability | What it does |
|------------|-------------|
| `Search` | Find data based on conditions |
| `Extract` | Retrieve known data (read-only) |
| `Transform` | Change format without changing meaning |
| `Analyze` | Add interpretation or new meaning |
| `Generate` | Create new content |
| `Modify` | Change external system state |
| `Communicate` | Send messages or notifications |
| `Transact` | Transfer value (payments) |
| `Store` | Persist data |

| Parameter | Type | Description |
|-----------|------|-------------|
| `include_tags` | boolean | Also return capability tags. Default: `false` |

---

### `get_index`

Entry point for agents new to Decixa. Returns platform overview, endpoints, and usage guidance.

No parameters required.

---

## Claude Code setup

See [docs/claude-code.md](docs/claude-code.md) for step-by-step Claude Code integration.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DECIXA_API_URL` | `https://api.decixa.ai` | Decixa API base URL |
| `DECIXA_API_KEY` | *(empty)* | API key — reserved for future use |

## License

MIT
