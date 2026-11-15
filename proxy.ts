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

  const country = (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    ""
  ).trim().toUpperCase();

  if (country && request.cookies.get("tb_country")?.value !== country) {
    response.cookies.set("tb_country", country, {
      path: "/",
      maxAge: 86400 * 7,
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return noStorePaths.test(pathname) ? applyNoStoreHeaders(response) : response;
}

export const config = {
  matcher: [
    "/((?!api/|auth/|sw\\.js|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2|woff|ttf|css|js|txt|xml)$).*)",
  ],
};
