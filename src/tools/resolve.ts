import { post } from "../client.js";

// ── inputSchema: resolve / search_apis (alias) で共有 ─────────────
// D-059 Phase 3a: capability / agent_ready は server 側で silently ignore のため
//   inputSchema からは除外。alias の search_apis も同じ schema。
const resolveInputSchema = {
  type: "object",
  properties: {
    intent: {
      type: "string",
      description: "What you want to do in natural language (e.g. 'summarize news articles', 'get token price')",
    },
    budget: {
      type: "number",
      description: "Maximum USDC cost per call (e.g. 0.01)",
    },
    latency: {
      type: "string",
      enum: ["low", "medium", "high"],
      description: "Required response latency tier",
    },
    min_similarity: {
      type: "number",
      minimum: 0.2,
      maximum: 0.9,
      description: "Similarity threshold for vector search. Default 0.5. Out-of-range returns 400.",
    },
  },
  required: ["intent"],
} as const;

// ── tool definitions ──────────────────────────────────────────────
export const resolveTool = {
  name: "resolve",
  description:
    "Find the best API for a task using natural language. Returns the top recommendation and up to 2 alternatives. " +
    "Decixa uses Phase 3 vector + scoring to rank verified-x402 APIs by intent. " +
    "When no candidate clears the similarity threshold, returns recommendation_status='no_match' with suggestions. " +
    "Use this when you want Decixa to pick — use discover when you want to see the list.",
  inputSchema: resolveInputSchema,
};

export const searchApisTool = {
  name: "search_apis",
  description:
    "DEPRECATED in v0.1.7. Use 'resolve' instead. This alias will be removed in v1.0.0. " +
    "[Original behavior preserved in this version: Find the best API for a task using natural language.]",
  inputSchema: resolveInputSchema,
};

// ── handler: resolve / search_apis 共有 ───────────────────────────
interface ResolveInput {
  intent: string;
  budget?: number;
  latency?: "low" | "medium" | "high";
  min_similarity?: number;
}

export async function handleResolve(args: unknown): Promise<string> {
  const { intent, budget, latency, min_similarity } = (args ?? {}) as ResolveInput;

  const body: Record<string, unknown> = { intent };
  const constraints: Record<string, unknown> = {};
  if (budget !== undefined) constraints.budget = budget;
  if (latency) constraints.latency = latency;
  if (Object.keys(constraints).length > 0) body.constraints = constraints;
  if (min_similarity !== undefined) body.min_similarity = min_similarity;

  // server から全 fields を pass-through
  // (recommendation_status / recommended / alternatives / no_match_reason /
  //  suggestions / search_mode / is_fallback / fallback_reason / relaxed_constraints /
  //  strict_match_count / fallback_match_count)
  const result = await post<Record<string, unknown>>("/api/agent/resolve", body);
  return JSON.stringify(result, null, 2);
}
