import { get } from "../client.js";

export const getApiDetailTool = {
  name: "get_api_detail",
  description:
    "Get full details for a specific API by its ID. " +
    "Returns endpoint URL, pricing, capability, tags, agent compatibility, schema info, use cases, trust signals (trust_evidence), and provider. " +
    "Prefer trust_evidence.score (with uptime_7d / p95_latency_ms / payment_req_parsed) over legacy trust_score for new clients. " +
    "The top-level `verified_live` boolean indicates whether this API is verified to accept x402 payments; " +
    "unlike resolve/discover, detail also returns APIs that are not yet verified. " +
    "Use this after resolve or discover to inspect a specific API before calling it.",
  inputSchema: {
    type: "object",
    properties: {
      api_id: {
        type: "string",
        description: "The API ID returned by search_apis (recommended.id) or browse_apis (apis[].id)",
      },
    },
    required: ["api_id"],
  },
};

interface GetApiDetailInput {
  api_id: string;
}

export async function handleGetApiDetail(args: unknown): Promise<string> {
  const { api_id } = args as GetApiDetailInput;

  const result = await get<Record<string, unknown>>(`/api/agent/detail/${encodeURIComponent(api_id)}`);

  return JSON.stringify(result, null, 2);
}
