import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { stripAuthTokens } from "@/lib/auth-response";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  NO_STORE_HEADERS,
  apiUrl,
  revokeToken,
} from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { message: "অবৈধ রিকোয়েস্ট বডি।" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  await revokeToken(previousToken);

  let laravelRes: Response;
  try {
    laravelRes = await fetch(apiUrl("/v1/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    const response = NextResponse.json(
      { message: "সার্ভারে সংযোগ স্থাপন করতে সমস্যা হচ্ছে।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  const data = await laravelRes.json().catch(() => ({}));

  if (!laravelRes.ok) {
    const response = NextResponse.json(stripAuthTokens(data), {
      status: laravelRes.status,
      headers: NO_STORE_HEADERS,
    });
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  const token =
    data?.token ??
    data?.access_token ??
    data?.data?.token ??
    data?.data?.access_token;

  if (typeof token !== "string" || !token.trim()) {
    const response = NextResponse.json(
      { message: "লগইন সফল হলেও authentication session তৈরি করা যায়নি।" },
      { status: 502, headers: NO_STORE_HEADERS }
    );
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  const response = NextResponse.json(
    { ...stripAuthTokens(data), authenticated: true },
    { status: 200, headers: NO_STORE_HEADERS }
  );
  response.cookies.set(AUTH_COOKIE_NAME, token.trim(), AUTH_COOKIE_OPTIONS);
  return response;
}
