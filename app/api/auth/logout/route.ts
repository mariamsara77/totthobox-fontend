export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { laravelFetch } from "@/lib/server/laravel";
import { getAuthToken, getRefreshToken, clearAuthCookies } from "@/lib/auth/session";

const headers = { "Cache-Control": "private, no-store, no-cache, must-revalidate" };

export async function POST() {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      getAuthToken(),
      getRefreshToken(),
    ]);

    if (accessToken) {
      await laravelFetch("/v1/logout", {
        method: "POST",
        token: accessToken,
        body: JSON.stringify({ refresh_token: refreshToken ?? "" }),
      }).catch(() => null);
    }

    const response = NextResponse.json({ success: true }, { status: 200, headers });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    console.warn("Logout error:", error);
    const response = NextResponse.json({ success: true }, { status: 200, headers });
    clearAuthCookies(response);
    return response;
  }
}
