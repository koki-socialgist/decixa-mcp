import { post, get } from "../client.js";

export const searchApisTool = {
  name: "search_apis",
  description:
    "Find the best API for a task using natural language. Returns the top recommendation and up to 2 alternatives. " +
    "Only returns APIs verified to accept x402 payments (payment_req_parsed === true). " +
    "Use this when you know what you want to do (intent) but not which API to call. " +
    "Optionally narrow results by capability, budget, or latency.",
  inputSchema: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        description: "What you want to do in natural language (e.g. 'summarize news articles', 'get token price')",
      },
      capability: {
        type: "string",
        enum: ["Search", "Extract", "Transform", "Analyze", "Generate", "Modify", "Communicate", "Transact", "Store"],
        description: "Primary capability verb. Use list_capabilities if unsure which to pick.",
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
      agent_ready: {
        type: "boolean",
        description: "Only return APIs verified for autonomous agent use. Defaults to true.",
      },
    },
    required: ["intent"],
  },
};

interface SearchApisInput {
  intent: string;
  capability?: string;
  budget?: number;
  latency?: "low" | "medium" | "high";
  agent_ready?: boolean;
}

export async function handleSearchApis(args: unknown): Promise<string> {
  const { intent, capability, budget, latency, agent_ready } = args as SearchApisInput;

  // capability が指定されている場合: /api/agent/resolve（スコアリング+推薦）
  if (capability) {
    const body: Record<string, unknown> = {
      capability,
      intent,
      agent_ready: agent_ready ?? true,
    };
    const constraints: Record<string, unknown> = {};
    if (budget !== undefined) constraints.budget = budget;
    if (latency) constraints.latency = latency;
    if (Object.keys(constraints).length > 0) body.constraints = constraints;

    const result = await post<Record<string, unknown>>("/api/agent/resolve", body);

    if (!result.recommended) {
      return JSON.stringify({
        message: result.message ?? "No APIs matched your query.",
        is_fallback: result.is_fallback,
        fallback_reason: result.fallback_reason,
        tip: "Try list_capabilities to choose a different capability, or browse_apis to explore without constraints.",
      }, null, 2);
    }

    return JSON.stringify({
      recommended: result.recommended,
      alternatives: result.alternatives,
      is_fallback: result.is_fallback,
      fallback_reason: result.fallback_reason ?? undefined,
      relaxed_constraints: result.relaxed_constraints ?? undefined,
    }, null, 2);
  }

  // capability が未指定の場合: /api/agent/discover でキーワード検索し上位を返す
  const params: Record<string, string | number | boolean> = {
    task: intent,
    sort: "trust",
    limit: 5,
  };
  if (agent_ready ?? true) params.agent_ready = "true";
  if (budget !== undefined) params.budget = budget;
  if (latency) params.latency_tier = latency;

  const discoverResult = await get<{ total: number; apis: unknown[] }>("/api/agent/discover", params);
  const apis = discoverResult.apis ?? [];

  if (apis.length === 0) {
    return JSON.stringify({
      message: "No APIs matched your query.",
      tip: "Try list_capabilities to explore by capability, or browse_apis with no filters.",
    }, null, 2);
  }

  return JSON.stringify({
    recommended: apis[0],
    alternatives: apis.slice(1),
    is_fallback: false,
    note: "capability was not specified — results ranked by trust score. For better recommendations, specify a capability.",
  }, null, 2);
}
