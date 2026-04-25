import { get } from "../client.js";

// ── inputSchema: discover / browse_apis (alias) で共有 ─────────────
// D-059 Phase 3a: capability / agent_ready は server 側で silently ignore のため
//   inputSchema からは除外。alias の browse_apis も同じ schema。
// MCP layer は intent only。HTTP layer (server query param) では task に変換して送る。
const discoverInputSchema = {
  type: "object",
  properties: {
    intent: {
      type: "string",
      description: "Natural-language intent. Mapped to the server's 'task' query parameter.",
    },
    tag: {
      type: "string",
      description: "Filter by capability tag (e.g. 'Market Data', 'Risk Score').",
    },
    budget: {
      type: "number",
      description: "Maximum USDC cost per call",
    },
    latency_tier: {
      type: "string",
      enum: ["low", "medium", "high"],
      description: "Filter by latency tier",
    },
    execution_mode: {
      type: "string",
      enum: ["sync", "async"],
      description: "Filter by execution mode",
    },
    pricing_model: {
      type: "string",
      enum: ["per_call", "subscription", "hybrid"],
      description: "Filter by pricing model",
    },
    min_similarity: {
      type: "number",
      minimum: 0.2,
      maximum: 0.9,
      description: "Similarity threshold for vector search. Default 0.3. Out-of-range returns 400.",
    },
    sort: {
      type: "string",
      enum: ["relevance", "price_asc", "price_desc", "latency_asc", "trust", "calls"],
      description:
        "Sort preset. 'relevance' uses Phase 3 normalized score. " +
        "'calls' is deprecated and will be removed in Phase 4. " +
        "Default: relevance.",
    },
    limit: {
      type: "integer",
      minimum: 1,
      maximum: 50,
      description: "Number of results per page. Default: 20",
    },
    offset: {
      type: "integer",
      minimum: 0,
      description: "Pagination offset. Default: 0",
    },
  },
  required: ["intent"],
} as const;

// ── tool definitions ──────────────────────────────────────────────
export const discoverTool = {
  name: "discover",
  description:
    "List APIs ranked by intent. Returns multiple candidates so the agent can choose. " +
    "Decixa uses Phase 3 vector + scoring to rank verified-x402 APIs. " +
    "Use this when you want to see options — use resolve when you want a single recommendation.",
  inputSchema: discoverInputSchema,
};

export const browseApisTool = {
  name: "browse_apis",
  description:
    "DEPRECATED in v0.1.7. Use 'discover' instead. This alias will be removed in v1.0.0. " +
    "[Original behavior preserved in this version: List APIs ranked by intent.]",
  inputSchema: discoverInputSchema,
};

// ── handler: discover / browse_apis 共有 ──────────────────────────
interface DiscoverInput {
  intent: string;
  tag?: string;
  budget?: number;
  latency_tier?: string;
  execution_mode?: string;
  pricing_model?: string;
  min_similarity?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}

export async function handleDiscover(args: unknown): Promise<string> {
  const a = (args ?? {}) as DiscoverInput;

  const params: Record<string, string | number | boolean> = {};
  if (a.intent)         params.task           = a.intent;  // MCP intent → HTTP task
  if (a.tag)            params.tag            = a.tag;
  if (a.budget !== undefined) params.budget   = a.budget;
  if (a.latency_tier)   params.latency_tier   = a.latency_tier;
  if (a.execution_mode) params.execution_mode = a.execution_mode;
  if (a.pricing_model)  params.pricing_model  = a.pricing_model;
  if (a.min_similarity !== undefined) params.min_similarity = a.min_similarity;
  if (a.sort)           params.sort           = a.sort;
  if (a.limit !== undefined)  params.limit  = a.limit;
  if (a.offset !== undefined) params.offset = a.offset;

  // server から全 fields を pass-through
  // (apis / total / limit / offset / next / prev / search_mode /
  //  min_similarity_applied / no_match_reason / top_candidates_below_threshold)
  const result = await get<Record<string, unknown>>("/api/agent/discover", params);
  return JSON.stringify(result, null, 2);
}
