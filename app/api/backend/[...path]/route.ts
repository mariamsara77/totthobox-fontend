import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const NO_BODY_METHODS = new Set(["GET", "HEAD"]);

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Vary: "Cookie, Authorization",
};

async function forward(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const reqUrl = new URL(request.url);
  const token = (await cookies()).get("laravel_token")?.value;

  const headers = new Headers();
  headers.set("Accept", "application/json");

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Cache-Control", "no-store, no-cache, max-age=0");
    headers.set("Pragma", "no-cache");
  }

  // Never let an upstream cache/proxy treat authenticated requests as one
  // shared GET response. The raw token is never placed in the URL.
  const paramsForUpstream = new URLSearchParams(reqUrl.searchParams);
  if (token) {
    const sessionKey = createHash("sha256")
      .update(token)
      .digest("hex")
      .slice(0, 32);
    paramsForUpstream.set("__auth_scope", sessionKey);
  }

  const query = paramsForUpstream.toString();
  const targetUrl = `${API_BASE}/api/${path.join("/")}${query ? `?${query}` : ""}`;

  let laravelRes: Response;
  try {
    laravelRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: NO_BODY_METHODS.has(request.method)
        ? undefined
        : await request.arrayBuffer(),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "ব্যাকএন্ড সার্ভার অনুপলব্ধ।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const responseHeaders = new Headers(laravelRes.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("connection");

  Object.entries(NO_STORE_HEADERS).forEach(([key, value]) => {
    responseHeaders.set(key, value);
  });

  const result = new NextResponse(laravelRes.body, {
    status: laravelRes.status,
    headers: responseHeaders,
  });

  if (laravelRes.status === 401) {
    result.cookies.set("laravel_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  }

  return result;
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
