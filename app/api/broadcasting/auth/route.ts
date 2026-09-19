import { NextRequest, NextResponse } from "next/server";
import { laravelFetch } from "@/lib/server/laravel";
import { getAuthToken } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Pusher/Echo socket_id + channel_name সাধারণত
  // application/x-www-form-urlencoded আকারে পাঠায়
  const rawBody = await request.text();
  const contentType =
    request.headers.get("content-type") || "application/x-www-form-urlencoded";

  let laravelRes: Response;
  try {
    laravelRes = await laravelFetch("/broadcasting/auth", {
      method: "POST",
      token,
      headers: { "Content-Type": contentType },
      body: rawBody,
    });
  } catch {
    return NextResponse.json(
      { message: "Backend সার্ভারে সংযোগ করা যায়নি।" },
      { status: 502 },
    );
  }

  const isJson = laravelRes.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson
    ? await laravelRes.json().catch(() => null)
    : await laravelRes.text();

  return isJson
    ? NextResponse.json(data, { status: laravelRes.status })
    : new NextResponse(data as string, { status: laravelRes.status });
}