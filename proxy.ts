import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route-level auth guard.
 * A cookie's presence is not treated as proof of authentication; the session
 * is verified by the same /api/auth/me endpoint used by the client.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/messages");

  if (!isAuthRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("__Host-totthobox_session")?.value;
  const authenticated = sessionCookie
    ? await verifySession(request)
    : false;

  if (isAuthRoute && authenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedRoute && !authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

async function verifySession(request: NextRequest): Promise<boolean> {
  try {
    const url = new URL("/api/auth/me", request.url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    return response.ok;
  } catch {
    // Fail closed for protected routes and fail open for login/register.
    return false;
  }
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile/:path*",
    "/settings/:path*",
    "/messages/:path*",
  ],
};
