export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { clearAuthCookies } from "@/lib/auth/session";

const headers = { "Cache-Control": "private, no-store, no-cache, must-revalidate" };

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value ?? null;

    if (!token) return NextResponse.json({ user: null }, { status: 200, headers });

    const { status, data } = await laravelJson("/v1/user", { token });

    if (status !== 200) {
      const response = NextResponse.json({ user: null }, { status: 200, headers });
      clearAuthCookies(response);
      return response;
    }

    return NextResponse.json({ user: data?.user ?? null }, { status: 200, headers });
  } catch (error) {
    console.error("Auth me check failed:", error);
    return NextResponse.json({ user: null }, { status: 200, headers });
  }
}
