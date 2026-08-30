import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ACCESS_COOKIE  = "auth_token";
export const REFRESH_COOKIE = "refresh_token";

const IS_PROD = process.env.NODE_ENV === "production";

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
): void {
  // Access token — 1 দিন
  response.cookies.set({
    name:     ACCESS_COOKIE,
    value:    accessToken,
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60 * 24,
  });

  // Refresh token — 30 দিন
  response.cookies.set({
    name:     REFRESH_COOKIE,
    value:    refreshToken,
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60 * 24 * 30,
  });
}

export function clearAuthCookies(response: NextResponse): void {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE]) {
    response.cookies.set({
      name,
      value:    "",
      httpOnly: true,
      secure:   IS_PROD,
      sameSite: "lax",
      path:     "/",
      maxAge:   0,
    });
  }
}

// পুরনো single-cookie helper — backward compat এর জন্য রাখা
export function setAuthCookie(response: NextResponse, token: string): void {
  setAuthCookies(response, token, "");
}

export function clearAuthCookie(response: NextResponse): void {
  clearAuthCookies(response);
}