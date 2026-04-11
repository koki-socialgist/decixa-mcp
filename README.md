# decixa-mcp

MCP Server for [Decixa](https://decixa.ai) — The decision layer for AI Agents.

Give your AI agent the ability to discover and evaluate APIs from a catalog of 20,000+ endpoints, ranked by trust score, cost, and latency.

## Quickstart

```bash
npx decixa-mcp
```

## Claude Desktop Setup

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "decixa": {
      "command": "npx",
      "args": ["-y", "decixa-mcp"]
    }
  }
}
```

**Config file location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### With custom API URL (optional)

```json
{
  "mcpServers": {
    "decixa": {
      "command": "npx",
      "args": ["-y", "decixa-mcp"],
      "env": {
        "DECIXA_API_URL": "https://api.decixa.ai"
      }
    }
  }
}
```

## Tools

### `search_apis`

Find the best API for a task using natural language. Returns the top recommendation and up to 2 alternatives.

**When to use:** You know what you want to do, but not which API to call.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `intent` | string | ✅ | What you want to do (e.g. `"summarize news articles"`) |
| `capability` | string | — | Capability verb (`Search` / `Extract` / `Analyze` / ...). If omitted, results are ranked by trust score. |
| `budget` | number | — | Max USDC per call (e.g. `0.01`) |
| `latency` | string | — | `low` / `medium` / `high` |
| `agent_ready` | boolean | — | Only return agent-verified APIs. Default: `true` |

**Example:**
```
search_apis({ intent: "get token price from blockchain" })
search_apis({ intent: "analyze wallet risk", capability: "Analyze", budget: 0.005 })
```

---

### `browse_apis`

Browse the Decixa catalog with optional filters. All parameters are optional.

**When to use:** Exploring what's available, or looking for APIs by tag / budget / capability.

| Parameter | Type | Description |
|-----------|------|-------------|
| `task` | string | Keyword search across name and description |
| `capability` | string | Filter by capability verb |
| `tag` | string | Filter by capability tag (e.g. `"Market Data"`, `"Risk Score"`) |
| `budget` | number | Max USDC per call |
| `latency_tier` | string | `low` / `medium` / `high` |
| `sort` | string | `trust` (default) / `price_asc` / `price_desc` |
| `limit` | integer | Results per page (1–50, default 20) |
| `offset` | integer | Pagination offset |

**Example:**
```
browse_apis({ capability: "Analyze", tag: "Risk Score", sort: "price_asc" })
browse_apis({ task: "news", budget: 0.001 })
```

---

### `get_api_detail`

Fetch full details for a specific API by ID.

**When to use:** After `search_apis` or `browse_apis` to inspect an API before calling it.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_id` | string | ✅ | API ID from `search_apis` (`recommended.id`) or `browse_apis` (`apis[].id`) |

Returns: endpoint URL, pricing, capability, tags, agent compatibility, schema, use cases, trust score, provider.

---

### `list_capabilities`

List all 9 Decixa capability verbs with descriptions.

**When to use:** Before calling `search_apis` when you're unsure which capability applies.

Decixa classifies APIs by what they **do** (verb), not what domain they belong to:

| Capability | Description |
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
| `include_tags` | boolean | Also return capability tags for each capability. Default: `false` |

---

### `get_index`

Fetch the Decixa agent index (`/.well-known/agent-index.json`).

**When to use:** Entry point for agents new to Decixa — returns platform overview, available endpoints, and usage guidance.

No parameters required.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DECIXA_API_URL` | `https://api.decixa.ai` | Decixa API base URL |
| `DECIXA_API_KEY` | *(empty)* | API key — reserved for future use |

## License

MIT
