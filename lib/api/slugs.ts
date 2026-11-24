import { API_BASE_URL } from "./fetcher";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractItems(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (!isRecord(json)) return [];

  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.items)) return json.items;

  if (isRecord(json.data)) {
    if (Array.isArray(json.data.items)) return json.data.items;
    if (Array.isArray(json.data.data)) return json.data.data;

    return Object.values(json.data).flatMap((value) =>
      Array.isArray(value) ? value : [],
    );
  }

  return [];
}

/**
 * Fetches slugs for generateStaticParams during build or revalidation.
 * Timeouts after 5 seconds to ensure builds never hang.
 */
export async function getSlugsForPath(
  endpoint: string,
  options: {
    revalidateSeconds?: number;
    maxPages?: number;
    timeoutMs?: number;
  } = {},
): Promise<{ slug: string }[]> {
  const { revalidateSeconds = 86400, maxPages = 5, timeoutMs = 5000 } = options;
  const slugs: { slug: string }[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= maxPages; page += 1) {
    try {
      const separator = endpoint.includes("?") ? "&" : "?";
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(
        `${API_BASE_URL}${endpoint}${separator}per_page=100&page=${page}`,
        {
          next: { revalidate: revalidateSeconds },
          signal: controller.signal,
          headers: { Accept: "application/json" },
        },
      ).finally(() => clearTimeout(timer));

      if (!response.ok) break;

      const json = await response.json();
      const items = extractItems(json);

      if (items.length === 0) break;

      for (const item of items) {
        if (!isRecord(item)) continue;
        const slug = typeof item.slug === "string" ? item.slug.trim() : "";
        if (slug && !seen.has(slug)) {
          seen.add(slug);
          slugs.push({ slug });
        }
      }

      // Check if more pages exist
      const meta = isRecord(json) && isRecord(json.meta) ? json.meta : null;
      if (meta && typeof meta.has_more === "boolean" && !meta.has_more) {
        break;
      }
      if (
        meta &&
        typeof meta.current_page === "number" &&
        typeof meta.last_page === "number" &&
        meta.current_page >= meta.last_page
      ) {
        break;
      }
    } catch {
      break;
    }
  }

  return slugs;
}
