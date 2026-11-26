import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value?.trim() || null;

  return NextResponse.json(
    { token },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      },
    },
  );
}
