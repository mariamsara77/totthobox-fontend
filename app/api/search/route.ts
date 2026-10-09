import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://admin.totthobox.com"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 160);
  const requestedLimit = Number(req.nextUrl.searchParams.get("limit") || 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 50)
    : 10;

  if (q.length < 2) {
    return NextResponse.json({
      items: [],
      scope: null,
      hasMore: false,
      total: 0,
    });
  }

  try {
    const url = new URL("/api/search", BACKEND_URL);
    url.searchParams.set("q", q);
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error("Backend returned " + res.status);
    }

    const data = await res.json();

    return NextResponse.json({
      items: Array.isArray(data.items) ? data.items : [],
      scope: data.scope ?? null,
      hasMore: Boolean(data.hasMore),
      total: Number(data.total) || 0,
    });
  } catch (err) {
    console.error("[search/route]", err);
    return NextResponse.json(
      {
        items: [],
        scope: null,
        hasMore: false,
        total: 0,
        error: "Search unavailable",
      },
      { status: 502 },
    );
  }
}
