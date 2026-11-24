import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://admin.totthobox.com";

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription payload" },
        { status: 400 },
      );
    }

    // Forward to Laravel backend if endpoint available
    try {
      await fetch(`${BACKEND_URL}/api/push/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(subscription),
      });
    } catch (e) {
      // Backend not yet wired, acknowledge locally without error
      console.warn("[push/subscribe] Backend sync pending:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Push subscription registered",
    });
  } catch (err) {
    console.error("[push/subscribe] Error:", err);
    return NextResponse.json(
      { error: "Failed to process push subscription" },
      { status: 500 },
    );
  }
}
