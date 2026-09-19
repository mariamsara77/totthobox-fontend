import { NextRequest, NextResponse } from "next/server";

type TrackingPayload = Record<string, unknown>;

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
    const payload = isRecord(body.payload)
      ? (body.payload as TrackingPayload)
      : {};

    if (!category || !action || !visitorId || !sessionId) {
      return NextResponse.json(
        { status: "error", message: "Required tracking fields are missing." },
        { status: 400 },
      );
    }

    // This endpoint intentionally accepts tracking data without blocking the UI.
    // Persistence belongs to the configured analytics/backend service.
    void payload;

    return NextResponse.json({ status: "success" }, { status: 202 });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Unable to process tracking event." },
      { status: 400 },
    );
  }
}
