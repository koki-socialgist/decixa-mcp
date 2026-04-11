#!/usr/bin/env node
/**
 * Decixa MCP Server
 *
 * Usage:
 *   npx decixa-mcp
 *
 * Environment variables:
 *   DECIXA_API_URL  — Base URL of the Decixa API (default: https://api.decixa.ai)
 *   DECIXA_API_KEY  — API key (placeholder, currently unused)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { searchApisTool,     handleSearchApis     } from "./tools/search-apis.js";
import { browseApisTool,     handleBrowseApis     } from "./tools/browse-apis.js";
import { getApiDetailTool,   handleGetApiDetail   } from "./tools/get-api-detail.js";
import { listCapabilitiesTool, handleListCapabilities } from "./tools/list-capabilities.js";
import { getIndexTool,       handleGetIndex       } from "./tools/get-index.js";

const server = new Server(
  { name: "decixa-mcp", version: "0.1.1" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    searchApisTool,
    browseApisTool,
    getApiDetailTool,
    listCapabilitiesTool,
    getIndexTool,
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let text: string;

    switch (name) {
      case "search_apis":
        text = await handleSearchApis(args);
        break;
      case "browse_apis":
        text = await handleBrowseApis(args);
        break;
      case "get_api_detail":
        text = await handleGetApiDetail(args);
        break;
      case "list_capabilities":
        text = handleListCapabilities(args);
        break;
      case "get_index":
        text = await handleGetIndex();
        break;
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }

    return { content: [{ type: "text", text }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Decixa MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
