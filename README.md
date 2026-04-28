# decixa-mcp

**Find the right API for your AI agent.**
30,000+ listings tracked. 5,500+ verified live as of April 2026.

MCP Server for [Decixa](https://decixa.ai) — The decision layer for AI Agents.

> **v0.1.7**: intent-driven update. New `resolve` / `discover` tools replace `search_apis` / `browse_apis` (kept as deprecated aliases). See [CHANGELOG.md](CHANGELOG.md) for migration guide.

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
resolve({ intent: "get real-time BTC price" })
→ Returns top recommendation + up to 2 alternatives, ranked by Phase 3 vector + scoring

resolve({ intent: "summarize Reddit posts", budget: 0.005 })
→ Filters by cost, returns trust_evidence and latency tier

discover({ intent: "transcribe audio", budget: 0.01, sort: "price_asc" })
→ Returns multiple x402-verified candidates so the agent can choose
```

---

## Why Decixa

Unlike x402.direct, Decixa verifies x402 compliance by actually probing each endpoint — not just metadata analysis.

| | Decixa | x402.direct |
|--|--------|-------------|
| Listings tracked | 30,000+ | ~4,000 |
| x402 verification | HTTP 402 probe (real) | Metadata scoring |
| Capability classification | 9 verb-based axes | — |
| Intent → API resolution | `/api/agent/resolve` | — |
| MCP server | `npx decixa-mcp` | — |

---

## Tools

### `resolve` (recommended, replaces `search_apis`)

Find the best API for a task using natural language. Returns top recommendation + up to 2 alternatives. Decixa uses Phase 3 vector + scoring (vector 0.70 + latency 0.05 + price 0.05 + tiebreak 0.20). When no candidate clears the similarity threshold, returns `recommendation_status='no_match'` with up to 2 suggestions.

| Parameter | Type | Description |
|-----------|------|-------------|
| `intent` (required) | string | What you want to do (e.g. `"summarize news articles"`) |
| `budget` | number | Max USDC per call (e.g. `0.01`) |
| `latency` | string | `low` / `medium` / `high` |
| `min_similarity` | number | Similarity threshold (0.2–0.9, default `0.5`). Out-of-range → 400 |

Response includes `recommendation_status` (`"resolved"` or `"no_match"`).

---

### `discover` (recommended, replaces `browse_apis`)

List APIs ranked by intent. Returns multiple candidates so the agent can choose. Verified-x402 only.

| Parameter | Type | Description |
|-----------|------|-------------|
| `intent` (required) | string | Natural-language intent (mapped to server's `task` query param) |
| `tag` | string | Filter by capability tag (e.g. `"Market Data"`, `"Risk Score"`) |
| `budget` | number | Max USDC per call |
| `latency_tier` | string | `low` / `medium` / `high` |
| `execution_mode` | string | `sync` / `async` |
| `pricing_model` | string | `per_call` / `subscription` / `hybrid` |
| `min_similarity` | number | Similarity threshold (0.2–0.9, default `0.3`). Out-of-range → 400 |
| `sort` | string | `relevance` (default) / `price_asc` / `price_desc` / `latency_asc` / `trust` / `calls` (deprecated) |
| `limit` | integer | Results per page (1–50, default 20) |
| `offset` | integer | Pagination offset |

Response includes `search_mode`, `min_similarity_applied`, `no_match_reason`, `top_candidates_below_threshold`.

---

### `search_apis` (deprecated alias for `resolve`)

> **DEPRECATED in v0.1.7. Will be removed in v1.0.0.** Use `resolve` instead. Shares schema and handler with `resolve`.

---

### `browse_apis` (deprecated alias for `discover`)

> **DEPRECATED in v0.1.7. Will be removed in v1.0.0.** Use `discover` instead. Shares schema and handler with `discover`.

---

### `get_api_detail`

Get full details for a specific API by ID.

| Parameter | Type | Description |
|-----------|------|-------------|
| `api_id` | string | API ID from `resolve` or `discover` |

Returns: endpoint URL, pricing, capability, tags, agent_compatibility, schema info, use_cases, **trust_evidence** (score / uptime_7d / p95_latency_ms / payment_req_parsed / last_checked / last_probed_at), provider, and `verified_live` flag. Prefer `trust_evidence.score` over legacy `trust_score` for new clients.

---

### `get_index`

Entry point for agents new to Decixa. Returns platform overview, endpoints, and usage guidance.

No parameters required.

---

## Migration from v0.1.6

| Old | New | Notes |
|-----|-----|-------|
| `search_apis({intent, capability, agent_ready})` | `resolve({intent, min_similarity?})` | Drop `capability` / `agent_ready`. They are silently ignored server-side (D-059). |
| `browse_apis({task, capability, agent_ready, sort})` | `discover({intent, sort})` | `task` → `intent`, drop `capability` / `agent_ready`. Default sort changed `trust` → `relevance`. |
| `list_capabilities({})` | *(removed)* | Capability filtering is no longer needed. Pass intent text + optional `tag` filter. |

**Strict MCP clients note**: if your MCP client validates `additionalProperties: false`, it will reject `capability` / `agent_ready` arguments at the client side. Tolerant clients let them through, but Decixa silently ignores them server-side. Either way, remove them.

See [CHANGELOG.md](CHANGELOG.md) for full details.

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
