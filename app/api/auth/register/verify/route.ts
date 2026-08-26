import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

function noStore<T extends NextResponse>(res: T): T {
  res.headers.set("Cache-Control", "private, no-store, no-cache, max-age=0, must-revalidate");
  return res;
}

export async function POST(request: Request) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/api/auth/register/verify`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: await request.text(),
      cache: "no-store",
    });
  } catch {
    return noStore(
      NextResponse.json(
        { message: "সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।" },
        { status: 503 }
      )
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return noStore(NextResponse.json(stripAuthTokens(data), { status: response.status }));
  }

  const token: string | undefined =
    data?.token ??
    data?.access_token ??
    data?.data?.token ??
    data?.data?.access_token;

  if (!token || typeof token !== "string") {
    return noStore(NextResponse.json(stripAuthTokens(data), { status: response.status }));
  }

  const safeData = stripAuthTokens(data) as Record<string, unknown>;
  const result = NextResponse.json(safeData, { status: response.status });

  result.cookies.set("laravel_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return noStore(result);
}
