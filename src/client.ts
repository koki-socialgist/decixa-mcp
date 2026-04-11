/**
 * Decixa API HTTP client
 *
 * BASE_URL: DECIXA_API_URL env var (default: production)
 * API key:  DECIXA_API_KEY env var (placeholder — currently unused)
 */

const BASE_URL = (process.env.DECIXA_API_URL ?? "https://api.decixa.ai").replace(/\/$/, "");
const API_KEY  = process.env.DECIXA_API_KEY ?? "";

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "decixa-mcp/0.1.0",
  };
  if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;
  return headers;
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Decixa API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: buildHeaders(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Decixa API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
