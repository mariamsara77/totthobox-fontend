import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set("laravel_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days (login/register-এর সাথে মিল)
  });

  return NextResponse.redirect(new URL("/", request.url));
}