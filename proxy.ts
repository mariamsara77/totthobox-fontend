// middleware.ts   অথবা proxy.ts (যে নামে ফাইল আছে)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/profile", "/settings"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value; // ✅ সঠিক cookie নাম
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};