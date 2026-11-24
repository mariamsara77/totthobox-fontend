import { NextRequest, NextResponse } from "next/server";
import { searchLocalCatalog } from "@/lib/search/catalog";
import type { SearchItem } from "@/types/search";

const BACKEND_URL = process.env.BACKEND_URL || "https://admin.totthobox.com";

export const revalidate = 1800;

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
  "CDN-Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
  "Cloudflare-CDN-Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit") || 10),
    50,
  );

  if (q.length < 2) {
    return NextResponse.json(
      {
        items: [],
        scope: null,
        hasMore: false,
        total: 0,
      },
      { headers: CACHE_HEADERS },
    );
  }

  // 1. Instant local search from platform catalog (Tools, Converters, Emergency, Services)
  const localMatches = searchLocalCatalog(q, limit);

  // 2. Query backend search API for deep database content
  let backendItems: SearchItem[] = [];
  let backendHasMore = false;
  let backendTotal = 0;
  let backendScope: string | null = null;

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 1800 },
      },
    );

    if (res.ok) {
      const data = await res.json();
      backendItems = Array.isArray(data.items) ? data.items : [];
      backendHasMore = Boolean(data.hasMore);
      backendTotal = Number(data.total) || 0;
      backendScope = data.scope ?? null;
    }
  } catch (err) {
    console.warn("[search/route] Backend search unavailable, serving local catalog:", err);
  }

  // 3. Deduplicate and merge: local catalog matches first, followed by backend items
  const seenUrls = new Set<string>();
  const mergedItems: SearchItem[] = [];

  for (const item of localMatches) {
    const key = (item._search_url || "").toLowerCase().replace(/\/$/, "");
    if (!seenUrls.has(key)) {
      seenUrls.add(key);
      mergedItems.push(item);
    }
  }

  for (const item of backendItems) {
    const key = (item._search_url || "").toLowerCase().replace(/\/$/, "");
    if (key && !seenUrls.has(key)) {
      seenUrls.add(key);
      mergedItems.push(item);
    }
  }

  const finalItems = mergedItems.slice(0, limit);
  const total = localMatches.length + backendTotal;

  return NextResponse.json(
    {
      items: finalItems,
      scope: backendScope,
      hasMore: backendHasMore || mergedItems.length > limit,
      total,
    },
    { headers: CACHE_HEADERS },
  );
}
