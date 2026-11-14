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
      path,
      url,
      is_pwa,
      has_installed,
    } = body as Record<string, unknown>;

    // Real client URL: prioritize client's window.location.href, fallback to req.nextUrl
    const fullUrl =
      typeof url === "string" && url.trim().length > 0
        ? url
        : `${req.nextUrl.origin}${path || "/"}`;

    const currentPath =
      typeof path === "string" && path.trim().length > 0
        ? path
        : new URL(fullUrl).pathname;

    const clientIp =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    const userAgent =
      req.headers.get("user-agent") || "TotthoboxFrontend/1.0";

    // Send heartbeat event to Laravel tracking/event
    const trackingPayload = {
      category: "heartbeat",
      action: "ping",
      js_visitor_id: String(visitor_id || "vis_anonymous"),
      session_id: String(session_id || "ses_anonymous"),
      payload: {
        path: currentPath,
        url: fullUrl,
        is_pwa: Boolean(is_pwa),
        has_installed: Boolean(has_installed),
        timestamp: Date.now(),
      },
    };

    const res = await fetch(`${LARAVEL_API}/tracking/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": userAgent,
        "X-Forwarded-For": clientIp,
        "X-Real-IP": clientIp,
      },
      body: JSON.stringify(trackingPayload),
      signal: AbortSignal.timeout(5000),
    });

    // Also sync PWA state if PWA mode is active
    if (Boolean(is_pwa) || Boolean(has_installed)) {
      void fetch(`${LARAVEL_API}/tracking/sync-pwa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-App-Mode": Boolean(is_pwa) ? "standalone" : "browser",
          "User-Agent": userAgent,
          "X-Forwarded-For": clientIp,
          "X-Real-IP": clientIp,
        },
        body: JSON.stringify({
          is_pwa: Boolean(is_pwa),
          has_installed: Boolean(has_installed),
        }),
        signal: AbortSignal.timeout(5000),
      }).catch(() => null);
    }

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
