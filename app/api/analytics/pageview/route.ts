import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API =
  process.env.LARAVEL_API_URL || "https://admin.totthobox.com/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    // Forward non-blocking to Laravel backend
    void fetch(`${LARAVEL_API}/analytics/pageview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": req.headers.get("user-agent") || "TotthoboxFrontend/1.0",
        "X-Forwarded-For":
          req.headers.get("x-forwarded-for") ||
          req.headers.get("x-real-ip") ||
          "unknown",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {
      // Backend not ready or unreachable - fail silently
    });

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch {
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }
}
