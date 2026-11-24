export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { laravelFetch } from "@/lib/server/laravel";
import { getAuthToken } from "@/lib/auth/session";

const headers = { "Cache-Control": "private, no-store, no-cache, must-revalidate" };

export async function POST(request: NextRequest) {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401, headers });
  }

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
      { message: "Backend সার্ভারে সংযোগ করা যায়নি。" },
      { status: 502, headers },
    );
  }

  const isJson = laravelRes.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson
    ? await laravelRes.json().catch(() => null)
    : await laravelRes.text();

  return isJson
    ? NextResponse.json(data, { status: laravelRes.status, headers })
    : new NextResponse(data as string, { status: laravelRes.status, headers });
}
