// lib/api.ts
const configuredBase =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const candidateBase =
  configuredBase.startsWith("https://") || configuredBase.startsWith("http://")
    ? configuredBase
    : "https://admin.totthobox.com";
let BASE_URL = candidateBase;
while (BASE_URL.endsWith("/")) {
  BASE_URL = BASE_URL.slice(0, -1);
}

interface FetcherOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
}

export async function fetcher<T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { revalidate = 3600, tags, headers, cache, ...rest } = options;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const nextOptions = cache === "no-store"
    ? undefined
    : { revalidate, ...(tags?.length ? { tags } : {}) };

  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...rest,
    ...(cache ? { cache } : {}),
    headers: {
      Accept: "application/json",
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(nextOptions ? { next: nextOptions } : {}),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new Error("API response is not valid JSON.");

  const json: unknown = await response.json();
  if (!json || typeof json !== "object") return json as T;
  const payload = json as Record<string, unknown>;
  if ("success" in payload) {
    if (payload.success !== true) {
      throw new Error(typeof payload.message === "string" ? payload.message : "API request failed.");
    }
    if ("data" in payload) return payload.data as T;
  }
  // Laravel may return { success, data }, { data, meta }, or a direct payload.
  return json as T;
}