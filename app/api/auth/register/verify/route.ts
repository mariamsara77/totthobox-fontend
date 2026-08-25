import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export async function POST(request: Request) {
  const response = await fetch(`${API_BASE}/api/auth/register/verify`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: await request.text(),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json(stripAuthTokens(data), { status: response.status });
  }
  const token = data.token ?? data.access_token;
  const safeData = stripAuthTokens(data) as Record<string, unknown>;
  if (!token) return NextResponse.json(safeData);
  const result = NextResponse.json(safeData);
  result.cookies.set("laravel_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return result;
}