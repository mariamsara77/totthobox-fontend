import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export async function POST(request: Request) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/api/auth/register/verify`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: await request.text(),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।" },
      { status: 503 }
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(stripAuthTokens(data), {
      status: response.status,
    });
  }

  // Support all token response shapes used by the Laravel API.
  const token: string | undefined =
    data?.token ??
    data?.access_token ??
    data?.data?.token ??
    data?.data?.access_token;

  const safeData = stripAuthTokens(data) as Record<string, unknown>;
  const result = NextResponse.json(safeData, { status: response.status });

  if (token) {
    // Replace the active session cookie atomically. This guarantees that the
    // newly registered account becomes the active account immediately.
    result.cookies.set("laravel_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return result;
}