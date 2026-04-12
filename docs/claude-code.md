# Using decixa-mcp with Claude Code

## 1-minute setup

Run this once in your terminal:

```bash
npx decixa-mcp
```

Claude Code will auto-detect the MCP server and make the Decixa tools available in your session.

---

## What you can do in Claude Code

Once connected, ask Claude Code directly:

```
Find the cheapest x402 API to get real-time BTC price
```

```
What APIs can analyze wallet risk? Budget: $0.005 per call
```

```
Find an x402-ready API to transcribe audio under $0.01
```

Claude Code will call `search_apis` and return the best options with pricing, endpoint, and trust score.

---

## Slash command

This repo includes a pre-built Claude Code slash command.

Add it to your project:

```bash
mkdir -p .claude/commands
curl -o .claude/commands/find-api.md \
  https://raw.githubusercontent.com/koki-socialgist/decixa-mcp/main/.claude/commands/find-api.md
```

Then use it in Claude Code:

```
/find-api transcribe audio to text
/find-api get blockchain token price, budget 0.001
```

---

## Adding to a project's MCP config

For teams using a shared `.mcp.json`:

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

---

## Available tools

| Tool | When to use |
|------|-------------|
| `search_apis` | You know what you want to do, need the best API |
| `browse_apis` | Exploring options, filtering by tag/capability/budget |
| `get_api_detail` | Inspecting a specific API before calling it |
| `list_capabilities` | Unsure which capability category applies |
| `get_index` | First time — get platform overview |

---

## Trust score explained

Decixa verifies x402 compliance by actually sending HTTP GET requests to each endpoint and checking for a 402 response. This is different from metadata-based scoring.

- `1.0` — HTTP 402 confirmed + high uptime
- `0.5–0.9` — Probe succeeded, some uptime issues
- `null` — Not yet probed or probe failed (DNS/timeout)

2,269 APIs currently have a confirmed live x402 probe.
