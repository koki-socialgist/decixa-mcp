# Changelog

## v0.1.8 (2026-04-27)

### Changed
- README: numbers synced with Decixa April 2026 state-of-x402 report. `20,072+ APIs indexed / 2,269 x402 proven live` → `30,000+ listings tracked / 5,500+ verified live as of April 2026`. Comparison table label `APIs indexed` → `Listings tracked` (D-040 narrative alignment — "indexed" is deprecated, "verified live" is the only public number).

No code or schema changes — README-only release to keep the npm-listed numbers consistent with what the public report shows.

## v0.1.7 (2026-04-25)

Phase 3b step 2 — intent-driven update aligned with Decixa Agent Hub API v1.1.0.

### Removed
- `list_capabilities` tool — capability is now silently ignored server-side (D-059 Phase 3a). The taxonomy no longer drives agent decisions; intent text + Phase 3 vector ranking handles the matching. (`src/taxonomy.ts` is retained for the decixa.ai web UI but is no longer used by the MCP server.)

### Deprecated (will be removed in v1.0.0)
- `search_apis` — use `resolve` instead. Kept as alias with shared handler.
- `browse_apis` — use `discover` instead. Kept as alias with shared handler.

### New
- `resolve` tool — single recommendation with Phase 3 scoring. Replaces `search_apis`.
- `discover` tool — ranked list with intent + filters. Replaces `browse_apis`.
- `min_similarity` parameter on both tools (range 0.2–0.9, out-of-range → 400 from server).
- `execution_mode` / `pricing_model` filters on `discover`.

### Breaking
- `capability` / `agent_ready` parameters removed from `resolve` / `discover` inputSchema. The server already silently ignores these (D-059), so existing agents that pass them will not error server-side.
- The alias tools (`search_apis` / `browse_apis`) share the new inputSchema; **the deprecated `capability` / `agent_ready` arguments are not accepted in alias schemas either**. The alias only preserves handler compatibility for callers using the old tool name.
- If your agent passes `capability` or `agent_ready` arguments:
  - **Strict MCP clients** (with `additionalProperties: false` validation) will reject these arguments at the client side. Remove them.
  - **Tolerant MCP clients** will let them through, but Decixa silently ignores them server-side. Remove them anyway for clarity.

### Updated
- `discover` sort enum: `["relevance", "price_asc", "price_desc", "latency_asc", "trust", "calls"]`. Default `relevance` (was `trust`). `calls` is deprecated and will be removed in Phase 4.
- `discover` MCP layer parameter is now `intent` (mapped to the server's `task` query param). Old `task` MCP parameter removed for clarity.
- `get_api_detail` description: prefer `trust_evidence.score` (with `uptime_7d` / `p95_latency_ms` / `payment_req_parsed`) over legacy `trust_score` for new clients.
- Tool count: 5 → 6 (resolve, discover, search_apis, browse_apis, get_api_detail, get_index). Effective tool count after v1.0.0 removes aliases: 4.

### Fixed
- Version drift: `src/index.ts` (was hardcoded `0.1.4` while package.json was `0.1.6`), `src/client.ts` User-Agent (was `decixa-mcp/0.1.0`), `server.json` (was `0.1.6`). All synced to `0.1.7`.

### Migration guide
1. Replace `search_apis` calls → `resolve`. Drop `capability` / `agent_ready` arguments. Optionally add `min_similarity` (default 0.5).
2. Replace `browse_apis` calls → `discover`. Drop `capability` / `agent_ready`. Replace `task` argument with `intent`. Update `sort` if you used a non-default value (default is now `relevance`).
3. `list_capabilities` callers: remove the call. Capability filtering is no longer needed; pass intent text + optional `tag` filter instead.

---

## v0.1.6 (2026-04-13)
- Tool descriptions updated to clarify verified-only retrieval (D-048).

## v0.1.5 (2026-04-13)
- README rebuild, Claude Code support added.

## v0.1.4 and earlier
- Initial release, registry registration, version sync workflow.
