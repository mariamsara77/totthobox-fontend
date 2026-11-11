import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/fetcher";

const FEED_MAP: Record<string, string> = {
  holidays: "/api/holidays",
  establishment: "/api/establishment-bd",
  history: "/api/history-bd",
  introduction: "/api/intro-bd",
  "public-figure": "/api/people",
  tourism: "/api/tourism-bd",
  "islam-basic": "/api/islam/basic",
  "islam-dowan": "/api/islam/dowan",
  software: "/api/apps",
  contacts: "/api/contacts",
  signs: "/api/signs/all",
};

/**
 * Cached Feed Route Handler for Infinite Scroll
 * Edge cached with s-maxage=3600 and stale-while-revalidate=86400
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const endpoint = FEED_MAP[type];

  if (!endpoint) {
    return NextResponse.json(
      { success: false, message: `Unknown feed type: ${type}` },
      { status: 404 },
    );
  }

  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "15";
  const search = searchParams.get("search") || "";

  const query = new URLSearchParams();
  query.set("page", page);
  query.set("per_page", perPage);
  if (search) query.set("search", search);

  // Forward extra filters
  searchParams.forEach((val, key) => {
    if (!["page", "per_page", "search"].includes(key)) {
      query.set(key, val);
    }
  });

  const url = `${API_BASE_URL}${endpoint}?${query.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: `Upstream error: ${res.status}` },
        { status: res.status },
      );
    }

    const json = await res.json();
    let items = [];
    let hasMore = false;
    let total = 0;

    if (Array.isArray(json)) {
      items = json;
    } else if (Array.isArray(json.data)) {
      items = json.data;
      hasMore = json.meta?.has_more ?? (items.length >= Number(perPage));
      total = json.meta?.total ?? items.length;
    } else if (json.data && Array.isArray(json.data.items)) {
      items = json.data.items;
      hasMore = json.data.has_more ?? (items.length >= Number(perPage));
      total = json.data.total ?? items.length;
    } else if (json.data && typeof json.data === "object") {
      items = Object.values(json.data).flat();
      hasMore = false;
      total = items.length;
    }

    return NextResponse.json(
      {
        success: true,
        data: items,
        meta: {
          current_page: Number(page),
          per_page: Number(perPage),
          has_more: hasMore,
          total,
        },
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
          "CDN-Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch feed" },
      { status: 500 },
    );
  }
}
