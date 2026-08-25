import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subscription = body?.subscription;
    const endpoint = typeof subscription?.endpoint === "string" ? subscription.endpoint : "";
    const p256dh = typeof subscription?.keys?.p256dh === "string" ? subscription.keys.p256dh : "";
    const auth = typeof subscription?.keys?.auth === "string" ? subscription.keys.auth : "";

    if (!endpoint || !p256dh || !auth || !endpoint.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid push subscription" }, { status: 400 });
    }

    // Persistence and server-side delivery must be connected to the project's
    // authenticated database/notification layer before production push delivery.
    // The endpoint remains intentionally storage-agnostic so it does not invent
    // a persistence strategy that could conflict with the existing backend.
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
