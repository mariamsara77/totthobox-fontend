import { NextRequest, NextResponse } from "next/server";
import { laravelFetch } from "@/lib/server/laravel";
import { getAuthToken, clearAuthCookie } from "@/lib/auth/session";

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const token = await getAuthToken();

  const isFormData = (request.headers.get("content-type") || "").includes("multipart/form-data");
  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : isFormData
      ? await request.formData()
      : await request.text();

  // Laravel Echo প্রতিটা outgoing request-এ X-Socket-ID header attach করে,
  // যাতে broadcast(...)->toOthers() sender-কে বাদ দিয়ে বাকিদের event পাঠাতে পারে।
  // আগে এই header প্রক্সি করার সময় হারিয়ে যাচ্ছিল।
  const socketId = request.headers.get("x-socket-id");
  const extraHeaders: Record<string, string> = {};
  if (socketId) extraHeaders["X-Socket-ID"] = socketId;

  let laravelRes: Response;
  try {
    laravelRes = await laravelFetch(`/${path.join("/")}${request.nextUrl.search}`, {
      method: request.method,
      token,
      headers: extraHeaders,
      body,
    });
  } catch {
    return NextResponse.json({ message: "Backend সার্ভারে সংযোগ করা যায়নি।" }, { status: 502 });
  }

  const isJson = laravelRes.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await laravelRes.json().catch(() => null) : await laravelRes.text();

  const response = isJson
    ? NextResponse.json(data, { status: laravelRes.status })
    : new NextResponse(data, { status: laravelRes.status });

  if (laravelRes.status === 401 && token) {
    clearAuthCookie(response);
  }

  return response;
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };