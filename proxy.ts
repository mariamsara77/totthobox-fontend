// proxy.ts  (project root — app/ এর পাশে)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("laravel_token")?.value;
  const { pathname } = request.nextUrl;

  // Guest routes: লগইন থাকলে এই পেজগুলোতে যাওয়া যাবে না
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Protected routes
  const isProtectedRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/settings");

  // ১. লগইন করা থাকলে login/register-এ যেতে পারবে না → হোমে পাঠাও
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ২. লগইন না থাকলে protected পেজে যেতে পারবে না → login-এ পাঠাও
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/profile/:path*", "/settings/:path*"],
};