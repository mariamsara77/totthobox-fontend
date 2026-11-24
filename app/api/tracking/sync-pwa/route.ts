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
        { status: "error", message: "Invalid PWA sync payload." },
        { status: 400 },
      );
    }

    const appMode = req.headers.get("x-app-mode") || "browser";

    // Forward PWA status to Laravel backend (fire-and-forget)
    void fetch(`${LARAVEL_API}/tracking/sync-pwa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-App-Mode": appMode,
        "User-Agent": req.headers.get("user-agent") || "TotthoboxFrontend/1.0",
        "X-Forwarded-For":
          req.headers.get("x-forwarded-for") ||
          req.headers.get("x-real-ip") ||
          "unknown",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    }).catch(() => {
      // Backend unreachable — silently ignore
    });

    return NextResponse.json({ status: "success" }, { status: 202 });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Unable to process PWA sync." },
      { status: 400 },
    );
  }
}
