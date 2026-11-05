export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { laravelFetch } from "@/lib/server/laravel";
import { getAuthToken, clearAuthCookie } from "@/lib/auth/session";

const headers = { "Cache-Control": "private, no-store, no-cache, must-revalidate" };

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params;
    const token = await getAuthToken();

    const isFormData = (request.headers.get("content-type") || "").includes("multipart/form-data");
    const body = ["GET", "HEAD"].includes(request.method)
      ? undefined
      : isFormData
        ? await request.formData().catch(() => undefined)
        : await request.text().catch(() => "");

    const socketId = request.headers.get("x-socket-id");
    const extraHeaders: Record<string, string> = {};
    if (socketId && typeof socketId === "string" && socketId.trim().length > 0) {
      extraHeaders["X-Socket-ID"] = socketId.trim();
    }

    const visitorId = request.headers.get("x-visitor-id")?.trim();
    if (path[0] === "ai" && visitorId) {
      extraHeaders["X-Visitor-Id"] = visitorId;
    }

    let laravelRes: Response;
    try {
      laravelRes = await laravelFetch(`/${path.join("/")}${request.nextUrl.search}`, {
        method: request.method,
        token,
        headers: extraHeaders,
        body,
      });
    } catch {
      return NextResponse.json(
        { success: false, data: [], message: "Backend সার্ভারে সংযোগ করা যায়নি।" },
        { status: 200, headers }
      );
    }

    const isJson = laravelRes.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await laravelRes.json().catch(() => null) : await laravelRes.text().catch(() => "");

    const response = isJson
      ? NextResponse.json(data ?? { success: false, data: [] }, { status: laravelRes.status, headers })
      : new NextResponse(data as string, { status: laravelRes.status, headers });

    if (laravelRes.status === 401 && token) {
      clearAuthCookie(response);
    }

    return response;
  } catch (error) {
    console.error("Backend proxy fatal error:", error);
    return NextResponse.json(
      { success: false, data: [], message: "সার্ভারে সমস্যা হয়েছে।" },
      { status: 200, headers }
    );
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
