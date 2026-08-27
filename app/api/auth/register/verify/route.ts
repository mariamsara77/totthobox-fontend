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
  let laravelRes: Response;

  try {
    laravelRes = await fetch(apiUrl("/auth/register/verify"), {
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
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const data = await laravelRes.json().catch(() => ({}));

  if (!laravelRes.ok) {
    return NextResponse.json(stripAuthTokens(data), {
      status: laravelRes.status,
      headers: NO_STORE_HEADERS,
    });
  }

  const token =
    data?.token ??
    data?.access_token ??
    data?.data?.token ??
    data?.data?.access_token;

  const result = NextResponse.json(stripAuthTokens(data), {
    status: laravelRes.status,
    headers: NO_STORE_HEADERS,
  });

  if (typeof token !== "string" || !token.trim()) {
    return result;
  }

  const previousToken = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (previousToken && previousToken !== token) {
    await revokeToken(previousToken);
  }

  result.cookies.set(AUTH_COOKIE_NAME, token.trim(), AUTH_COOKIE_OPTIONS);
  return result;
}
