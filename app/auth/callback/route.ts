import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  NO_STORE_HEADERS,
  revokeToken,
  verifyToken,
} from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const error = request.nextUrl.searchParams.get("error");

  if (error || !token) {
    return NextResponse.redirect(new URL("/login?error=google-auth-failed", request.url));
  }

  let verifyResponse: Response;
  try {
    verifyResponse = await verifyToken(token);
  } catch {
    return NextResponse.redirect(new URL("/login?error=auth-server-unavailable", request.url));
  }

  if (!verifyResponse.ok) {
    return NextResponse.redirect(new URL("/login?error=invalid-auth-token", request.url));
  }

  const user = await verifyResponse.json().catch(() => null);
  if (!user || typeof user !== "object" || !("id" in user)) {
    return NextResponse.redirect(new URL("/login?error=invalid-auth-user", request.url));
  }

  const cookieStore = request.cookies;
  const previousToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (previousToken && previousToken !== token) {
    await revokeToken(previousToken);
  }

  const response = NextResponse.redirect(new URL("/", request.url), {
    headers: NO_STORE_HEADERS,
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
  return response;
}
