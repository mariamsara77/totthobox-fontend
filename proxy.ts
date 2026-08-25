// proxy.ts  (project root — app/ এর পাশে)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("laravel_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/messages");

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
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
