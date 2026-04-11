/**
 * Capability taxonomy — static data (no API call needed)
 * Mirrors scripts/api-scraper/taxonomy.ts in the main repo.
 */

export const CAPABILITIES = [
  "Search",
  "Extract",
  "Transform",
  "Analyze",
  "Generate",
  "Modify",
  "Communicate",
  "Transact",
  "Store",
] as const;

export type Capability = typeof CAPABILITIES[number];

export const CAPABILITY_DESCRIPTIONS: Record<Capability, string> = {
  Search:      "Find data based on conditions",
  Extract:     "Retrieve known data (read-only)",
  Transform:   "Change format without changing meaning",
  Analyze:     "Add interpretation or new meaning",
  Generate:    "Create new content",
  Modify:      "Change external system state",
  Communicate: "Send messages or notifications",
  Transact:    "Transfer value (payments)",
  Store:       "Persist data",
};

export const CAPABILITY_TAGS: Record<Capability, string[]> = {
  Extract: [
    "Price Data", "Token Data", "Wallet Data", "Market Data",
    "News & Media", "On-chain Data", "Web Scraping",
    "File & Document", "Directory & Index",
    "Social Media", "Sports Data", "Weather Data",
    "Location Data", "Public Records", "Science & Reference",
  ],
  Analyze: [
    "Risk Score", "Sentiment", "Price Signal", "Wallet PnL",
    "Contract Risk", "Activity Pattern", "Text Summary",
    "Identity & Validation", "Language & Text Processing",
    "Data Enrichment", "Web Audit",
  ],
  Search: [
    "Token & Coin", "Wallet & Address", "Social & People",
    "Web & News", "NFT & Ordinals", "Project & Protocol",
    "Data & Records",
  ],
  Generate: [
    "Image & Video", "Text & Copy", "Code",
    "General Text", "Structured Output", "Answer & Reasoning",
    "AI Agent", "Data & Report", "Audio & Speech", "3D & Animation",
    "Text Summary",
  ],
  Transform: [
    "Format Conversion", "Translation", "Encoding & Decoding",
    "Data Normalization", "Text Processing",
  ],
  Modify: [
    "State Update", "Record Management", "Configuration",
  ],
  Communicate: [
    "Email", "SMS", "Push Notification", "Webhook",
    "Chat & Messaging", "Voice & Call",
  ],
  Transact: [
    "On-chain Payment", "Fiat Payment", "Commerce & Payment",
    "Token Transfer", "Settlement",
  ],
  Store: [
    "Database", "File Storage", "Key-Value", "Cache",
  ],
};
