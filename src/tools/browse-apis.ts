import { get } from "../client.js";

export const browseApisTool = {
  name: "browse_apis",
  description:
    "Browse and filter the Decixa API catalog. Returns a paginated list of APIs matching the given criteria. " +
    "Only returns APIs verified to accept x402 payments (payment_req_parsed === true). " +
    "All parameters are optional — call with no arguments to get the top APIs by trust score. " +
    "Use search_apis instead when you have a specific intent and want a single recommendation.",
  inputSchema: {
    type: "object",
    properties: {
      task: {
        type: "string",
        description: "Keyword to search across API name and description",
      },
      capability: {
        type: "string",
        enum: ["Search", "Extract", "Transform", "Analyze", "Generate", "Modify", "Communicate", "Transact", "Store"],
        description: "Filter by primary capability verb",
      },
      tag: {
        type: "string",
        description: "Filter by capability tag (e.g. 'Market Data', 'Risk Score'). Use list_capabilities to see available tags.",
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
      sort: {
        type: "string",
        enum: ["trust", "price_asc", "price_desc"],
        description: "Sort order. Default: trust (highest trust score first)",
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
  },
};

interface BrowseApisInput {
  task?: string;
  capability?: string;
  tag?: string;
  budget?: number;
  latency_tier?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export async function handleBrowseApis(args: unknown): Promise<string> {
  const { task, capability, tag, budget, latency_tier, sort, limit, offset } = args as BrowseApisInput;

  const params: Record<string, string | number | boolean> = {};
  if (task)         params.task         = task;
  if (capability)   params.capability   = capability;
  if (tag)          params.tag          = tag;
  if (budget !== undefined) params.budget = budget;
  if (latency_tier) params.latency_tier = latency_tier;
  if (sort)         params.sort         = sort;
  if (limit !== undefined)  params.limit  = limit;
  if (offset !== undefined) params.offset = offset;

  const result = await get<Record<string, unknown>>("/api/agent/discover", params);

  return JSON.stringify(result, null, 2);
}
