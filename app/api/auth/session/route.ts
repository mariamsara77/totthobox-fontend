import { NextResponse } from "next/server";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

// GET /api/auth/session?token=xxx  — used by OAuth callback redirect
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing-token", request.url));
  }

  const res = NextResponse.redirect(new URL("/", request.url));
  res.cookies.set("laravel_token", token, COOKIE_OPTIONS);
  return res;
}

// POST /api/auth/session  — used by JS clients (OAuth popups, etc.)
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = body?.token as string | undefined;

  if (!token) {
    return NextResponse.json({ message: "token অনুপস্থিত।" }, { status: 400 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("laravel_token", token, COOKIE_OPTIONS);
  return res;
}