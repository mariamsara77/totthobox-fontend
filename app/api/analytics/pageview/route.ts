import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API =
  process.env.LARAVEL_API_URL || "https://admin.totthobox.com/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const {
      visitor_id,
      session_id,
      is_first_visit,
      is_pwa,
      referrer,
      path,
      device_type,
      language,
    } = body as Record<string, unknown>;

    // Map to Laravel tracking/event schema
    const trackingPayload = {
      category: "page",
      action: "view",
      js_visitor_id: String(visitor_id || "vis_anonymous"),
      session_id: String(session_id || "ses_anonymous"),
      payload: {
        path: path || "/",
        url: `https://totthobox.com${path || "/"}`,
        referrer: referrer || null,
        is_pwa: Boolean(is_pwa),
        is_first_visit: Boolean(is_first_visit),
        device_type: device_type || "desktop",
        language: language || "bn",
      },
    };

    const res = await fetch(`${LARAVEL_API}/tracking/event`, {
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
      body: JSON.stringify(trackingPayload),
      signal: AbortSignal.timeout(5000),
    });

    const data = await res.json().catch(() => null);

    if (process.env.NODE_ENV === "development" && !res.ok) {
      return NextResponse.json(data ?? { error: "Backend failed" }, {
        status: res.status,
      });
    }

    return NextResponse.json(data ?? { status: "ok" }, { status: res.status });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 502 },
      );
    }
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }
}
