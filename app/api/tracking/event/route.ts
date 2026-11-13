import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API =
  process.env.LARAVEL_API_URL || "https://admin.totthobox.com/api";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    if (!isRecord(body)) {
      return NextResponse.json(
        { status: "error", message: "Invalid tracking payload." },
        { status: 400 },
      );
    }

    const category = typeof body.category === "string" ? body.category : null;
    const action = typeof body.action === "string" ? body.action : null;
    const visitorId =
      typeof body.js_visitor_id === "string" ? body.js_visitor_id : null;
    const sessionId =
      typeof body.session_id === "string" ? body.session_id : null;
    const payload = isRecord(body.payload) ? body.payload : {};

    if (!category || !action || !visitorId || !sessionId) {
      return NextResponse.json(
        { status: "error", message: "Required tracking fields are missing." },
        { status: 400 },
      );
    }

    // Forward tracking data to Laravel backend (fire-and-forget)
    const forwardBody = JSON.stringify({
      category,
      action,
      js_visitor_id: visitorId,
      session_id: sessionId,
      payload,
    });

    // Non-blocking: don't await — let the response return immediately
    void fetch(`${LARAVEL_API}/tracking/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": req.headers.get("user-agent") || "TotthoboxFrontend/1.0",
        "X-Forwarded-For":
          req.headers.get("x-forwarded-for") ||
          req.headers.get("x-real-ip") ||
          "unknown",
      },
      body: forwardBody,
      signal: AbortSignal.timeout(10_000),
    }).catch(() => {
      // Backend unreachable — silently ignore to avoid blocking UI
    });

    return NextResponse.json({ status: "success" }, { status: 202 });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Unable to process tracking event." },
      { status: 400 },
    );
  }
}
