import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

function clearTokenCookie(res: NextResponse) {
  res.cookies.set("laravel_token", "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "অবৈধ রিকোয়েস্ট বডি।" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // A browser can arrive here with another account's cookie still present.
  // Invalidate that server-side token before creating a new session so a
  // failed/new login can never fall back to the previous account.
  const cookieStore = await cookies();
  const previousToken = cookieStore.get("laravel_token")?.value;

  if (previousToken) {
    try {
      await fetch(`${API_BASE}/api/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${previousToken}`,
        },
        cache: "no-store",
      });
    } catch {
      // The old browser credential is cleared below regardless.
    }
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
    const res = NextResponse.json(
      { message: "সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
    clearTokenCookie(res);
    return res;
  }

  const data = await laravelRes.json().catch(() => ({}));

  // Never return or retain the previous account's credential on failure.
  if (!laravelRes.ok) {
    const res = NextResponse.json(stripAuthTokens(data), {
      status: laravelRes.status,
      headers: { "Cache-Control": "no-store" },
    });
    clearTokenCookie(res);
    return res;
  }

  const token: string | undefined =
    data?.token ??
    data?.access_token ??
    data?.data?.token ??
    data?.data?.access_token;

  const safeData = stripAuthTokens(data) as Record<string, unknown>;
  const result = NextResponse.json(
    { ...safeData, token_received: !!token },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );

  if (token) {
    result.cookies.set("laravel_token", token, COOKIE_OPTIONS);
  } else {
    // A successful login without a credential is not a usable authenticated
    // session. Do not leave any previous credential in the browser.
    clearTokenCookie(result);
    console.warn("[/api/auth/login] Laravel returned 200 but no token");
  }

  return result;
}
