import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE, AUTH_COOKIE, AUTH_COOKIE_OPTIONS, NO_STORE_HEADERS, clearAuthCookie, extractUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ message: "অবৈধ authentication request।" }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const code = body && typeof body === "object" && typeof (body as Record<string, unknown>).code === "string"
    ? (body as Record<string, unknown>).code.trim()
    : "";

  if (!code || code.length > 512) {
    return NextResponse.json({ message: "অবৈধ বা অনুপস্থিত Google authentication code।" }, { status: 400, headers: NO_STORE_HEADERS });
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(`${API_BASE}/api/auth/google/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "authentication সার্ভারের সাথে সংযোগ করা যায়নি।" }, { status: 503, headers: NO_STORE_HEADERS });
  }

  const data = await laravelRes.json().catch(() => ({}));
  if (!laravelRes.ok) {
    const response = NextResponse.json(
      { message: data?.message || "Google authentication code গ্রহণ করা যায়নি।" },
      { status: laravelRes.status, headers: NO_STORE_HEADERS },
    );
    clearAuthCookie(response);
    return response;
  }

  const token = data?.token ?? data?.access_token ?? data?.data?.token ?? data?.data?.access_token;
  if (typeof token !== "string" || !token) {
    const response = NextResponse.json({ message: "authentication সার্ভার token দেয়নি।" }, { status: 502, headers: NO_STORE_HEADERS });
    clearAuthCookie(response);
    return response;
  }

  let verifyRes: Response;
  let verifyPayload: unknown = null;
  try {
    verifyRes = await fetch(`${API_BASE}/api/user`, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}`, "Cache-Control": "no-store" },
      cache: "no-store",
    });
    const text = await verifyRes.text();
    try { verifyPayload = text ? JSON.parse(text) : null; } catch {}
  } catch {
    const response = NextResponse.json({ message: "authentication token যাচাই করা যায়নি।" }, { status: 503, headers: NO_STORE_HEADERS });
    clearAuthCookie(response);
    return response;
  }

  if (verifyRes.status === 401 || !verifyRes.ok) {
    const response = NextResponse.json({ message: "Google authentication session যাচাই করা যায়নি।" }, { status: verifyRes.status === 401 ? 401 : 502, headers: NO_STORE_HEADERS });
    clearAuthCookie(response);
    return response;
  }

  const user = extractUser(verifyPayload);
  if (!user) {
    const response = NextResponse.json({ message: "Google account information পাওয়া যায়নি।" }, { status: 502, headers: NO_STORE_HEADERS });
    clearAuthCookie(response);
    return response;
  }

  const cookieStore = await cookies();
  const previousToken = cookieStore.get(AUTH_COOKIE)?.value;
  if (previousToken && previousToken !== token) {
    try {
      await fetch(`${API_BASE}/api/logout`, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${previousToken}` },
        cache: "no-store",
      });
    } catch {}
  }

  const response = NextResponse.json({ success: true, user }, { status: 200, headers: NO_STORE_HEADERS });
  response.cookies.set(AUTH_COOKIE, token, AUTH_COOKIE_OPTIONS);
  return response;
}
