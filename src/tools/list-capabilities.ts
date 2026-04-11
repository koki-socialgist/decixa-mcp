import { CAPABILITIES, CAPABILITY_DESCRIPTIONS, CAPABILITY_TAGS } from "../taxonomy.js";

export const listCapabilitiesTool = {
  name: "list_capabilities",
  description:
    "List all Decixa capability verbs with descriptions. " +
    "Use this to choose the right capability before calling search_apis or browse_apis. " +
    "Decixa classifies APIs by what they DO (verb), not what domain they belong to.",
  inputSchema: {
    type: "object",
    properties: {
      include_tags: {
        type: "boolean",
        description: "If true, also return the available capability_tags for each capability. Default: false",
      },
    },
  },
};

interface ListCapabilitiesInput {
  include_tags?: boolean;
}

export function handleListCapabilities(args: unknown): string {
  const { include_tags = false } = (args ?? {}) as ListCapabilitiesInput;

  const capabilities = CAPABILITIES.map((cap) => {
    const entry: Record<string, unknown> = {
      capability: cap,
      description: CAPABILITY_DESCRIPTIONS[cap],
    };
    if (include_tags) {
      entry.tags = CAPABILITY_TAGS[cap];
    }
    return entry;
  });

  return JSON.stringify({ capabilities }, null, 2);
}
