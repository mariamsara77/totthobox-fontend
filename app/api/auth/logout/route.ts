import { NextResponse } from "next/server";
import { laravelFetch } from "@/lib/server/laravel";
import { getAuthToken, getRefreshToken, clearAuthCookies } from "@/lib/auth/session";

export async function POST() {
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

  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}