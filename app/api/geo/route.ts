import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const country = (
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-country-code") ||
    ""
  ).toUpperCase();

  return NextResponse.json(
    { country },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "Cloudflare-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
