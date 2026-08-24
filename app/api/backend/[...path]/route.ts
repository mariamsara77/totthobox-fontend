import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const NO_BODY_METHODS = new Set(["GET", "HEAD"]);

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

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const targetUrl = `${API_BASE}/api/${path.join("/")}${reqUrl.search}`;

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
      { status: 503 }
    );
  }

  // Strip hop-by-hop headers that cause issues in Next.js
  const responseHeaders = new Headers(laravelRes.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("connection");

  const result = new NextResponse(laravelRes.body, {
    status: laravelRes.status,
    headers: responseHeaders,
  });

  // If token was rejected, clear it so the client doesn't keep sending it
  if (laravelRes.status === 401) {
    result.cookies.set("laravel_token", "", {
      httpOnly: true,
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