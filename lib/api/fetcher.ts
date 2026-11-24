import { CACHE_TTL } from "../cache-config";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export interface FetcherOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Standardized server-side fetcher with Next.js ISR and cache tagging.
 * Guaranteed to run with next: { revalidate, tags }.
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options: FetcherOptions = {},
): Promise<T | null> {
  const {
    revalidate = CACHE_TTL.STATIC_CONTENT,
    tags = [],
    params,
    headers,
    ...rest
  } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  try {
    const res = await fetch(url, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...headers,
      },
      next: {
        revalidate: revalidate === false ? false : revalidate,
        ...(tags.length > 0 ? { tags } : {}),
      },
    });

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[fetchApi] HTTP ${res.status} when fetching: ${url}`,
        );
      }
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[fetchApi] Network error for: ${url}`, err);
    }
    return null;
  }
}
