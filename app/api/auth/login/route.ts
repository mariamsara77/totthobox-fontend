import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "অবৈধ রিকোয়েস্ট বডি।" }, { status: 400 });
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।" }, { status: 503 });
  }

  const data = await laravelRes.json().catch(() => ({}));
  if (!laravelRes.ok) {
    return NextResponse.json(stripAuthTokens(data), { status: laravelRes.status });
  }

  const token: string | undefined =
    data?.token ?? data?.access_token ?? data?.data?.token ?? data?.data?.access_token;

  // Never keep a stale session when Laravel does not issue a fresh token.
  if (!token) {
    const response = NextResponse.json(
      { message: "লগইন সফল হলেও authentication token পাওয়া যায়নি।" },
      { status: 502 }
    );
    response.cookies.set("laravel_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  const result = NextResponse.json(
    { ...(stripAuthTokens(data) as Record<string, unknown>), token_received: true },
    { status: 200 }
  );

  result.cookies.set("laravel_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return result;
}
