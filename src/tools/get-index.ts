import { get } from "../client.js";

export const getIndexTool = {
  name: "get_index",
  description:
    "Fetch the Decixa agent index — a machine-readable overview of the platform including available endpoints, " +
    "total API count, and usage guidance for AI agents. Good starting point for agents new to Decixa.",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export async function handleGetIndex(): Promise<string> {
  const result = await get<Record<string, unknown>>("/.well-known/agent-index.json");
  return JSON.stringify(result, null, 2);
}
