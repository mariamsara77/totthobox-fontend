import { NextResponse } from "next/server";

const LARAVEL_API =
  process.env.LARAVEL_API_URL || "https://admin.totthobox.com/api";

export async function GET() {
  try {
    const res = await fetch(`${LARAVEL_API}/analytics/stats`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { status: "success", data: { total: null, online: null } },
        { status: 200 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { status: "success", data: { total: null, online: null } },
      { status: 200 },
    );
  }
}
