import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/api/auth/google/redirect`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    const url = data && typeof data === "object" && "url" in data
      ? (data as { url?: unknown }).url
      : null;

    if (!response.ok || typeof url !== "string" || !url.startsWith("https://accounts.google.com/")) {
      return NextResponse.json(
        { message: "Google লগইন শুরু করা যায়নি।" },
        { status: response.ok ? 502 : response.status, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.redirect(url, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { message: "Google লগইন সার্ভারের সাথে সংযোগ করা যায়নি।" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }
}
