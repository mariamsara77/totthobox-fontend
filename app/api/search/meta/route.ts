import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export const revalidate = 1800;

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
  "CDN-Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
  "Cloudflare-CDN-Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
};

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/search/meta`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(
      {
        prefixes: data.prefixes || [],
        hints: data.hints || {},
      },
      { headers: CACHE_HEADERS },
    );
  } catch (err) {
    console.error("[search/meta]", err);
    return NextResponse.json(
      {
        prefixes: [],
        hints: {},
      },
      { status: 502 },
    );
  }
}
