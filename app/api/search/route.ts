import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://admin.totthobox.com";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit") || 10),
    50,
  );

  if (q.length < 2) {
    return NextResponse.json({
      items: [],
      scope: null,
      hasMore: false,
      total: 0,
    });
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      },
    );

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
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