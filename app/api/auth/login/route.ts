import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "অবৈধ রিকোয়েস্ট বডি।" },
      { status: 400 }
    );
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।" },
      { status: 503 }
    );
  }

  const data = await laravelRes.json().catch(() => ({}));

  // Propagate non-2xx errors (422 validation, 401 wrong password, 429 rate-limit, etc.)
  if (!laravelRes.ok) {
    return NextResponse.json(stripAuthTokens(data), { status: laravelRes.status });
  }

  // Extract token — support multiple Laravel response shapes
  const token: string | undefined =
    data?.token ??
    data?.access_token ??
    data?.data?.token ??
    data?.data?.access_token;

  const safeData = stripAuthTokens(data) as Record<string, unknown>;
  const result = NextResponse.json(
    { ...safeData, token_received: !!token },
    { status: 200 }
  );

  if (token) {
    result.cookies.set("laravel_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  } else {
    // Login succeeded but no token — log for debugging
    console.warn("[/api/auth/login] Laravel returned 200 but no token");
  }

  return result;
}