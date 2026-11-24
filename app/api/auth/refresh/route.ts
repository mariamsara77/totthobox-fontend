export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { laravelJson } from "@/lib/server/laravel";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/session";

const headers = { "Cache-Control": "private, no-store, no-cache, must-revalidate" };

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value ?? null;

    if (!refreshToken) {
      return NextResponse.json({ message: "সেশন শেষ হয়ে গেছে।" }, { status: 401, headers });
    }

    const { status, data } = await laravelJson("/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (status === 401 || status === 403) {
      const response = NextResponse.json(
        { message: "সেশন শেষ হয়ে গেছে।" },
        { status: 401, headers },
      );
      clearAuthCookies(response);
      return response;
    }

    if (status < 200 || status >= 300 || !data?.access_token) {
      return NextResponse.json(
        data ?? { message: "সেশন রিফ্রেশ করা যায়নি।" },
        { status: status >= 400 ? status : 502, headers },
      );
    }

    const response = NextResponse.json({ user: data.user }, { status: 200, headers });
    setAuthCookies(response, data.access_token, data.refresh_token);
    return response;
  } catch (error) {
    console.error("Auth refresh error:", error);
    return NextResponse.json({ message: "সার্ভার সংযোগ সমস্যা।" }, { status: 502, headers });
  }
}
