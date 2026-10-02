import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase() || "";

  return NextResponse.json(
    { country },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
