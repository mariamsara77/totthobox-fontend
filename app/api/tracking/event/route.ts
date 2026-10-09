import { NextRequest, NextResponse } from "next/server";
import { laravelFetch } from "@/lib/server/laravel";
import { getAuthToken } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const token = await getAuthToken();

    const response = await laravelFetch("/tracking/event", {
      token,
      method: "POST",
      headers: {
        "Content-Type":
          request.headers.get("content-type") || "application/json",
      },
      body,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text();

    return contentType.includes("application/json")
      ? NextResponse.json(data, { status: response.status })
      : new NextResponse(data as string, { status: response.status });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Tracking service unavailable." },
      { status: 502 },
    );
  }
}
