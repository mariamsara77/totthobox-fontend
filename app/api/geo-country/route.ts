import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase() || null;

  return NextResponse.json(
    { country },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
