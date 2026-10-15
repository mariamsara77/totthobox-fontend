import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/profile", "/settings", "/messages"];

const noStorePaths = /^\/(?:api\/auth|auth|login|register|forgot-password|reset-password|dashboard|profile|settings|messages|account|admin|ai\/chat|offline)(?:\/|$)/i;

function applyNoStoreHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  return response;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("login", "required");
    loginUrl.searchParams.set("returnTo", pathname + request.nextUrl.search);
    return applyNoStoreHeaders(NextResponse.redirect(loginUrl));
  }

  const response = NextResponse.next();
  return noStorePaths.test(pathname) ? applyNoStoreHeaders(response) : response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/messages/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth/:path*",
    "/api/auth/:path*",
    "/offline",
  ],
};
