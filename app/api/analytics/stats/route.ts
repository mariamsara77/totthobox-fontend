import { NextResponse } from "next/server";

const LARAVEL_API =
  process.env.LARAVEL_API_URL || "https://admin.totthobox.com/api";

export async function GET() {
  try {
    const res = await fetch(`${LARAVEL_API}/analytics/user-count`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(
          data ?? { error: "Backend /analytics/user-count failed" },
          { status: res.status },
        );
      }
      return NextResponse.json(
        { status: "success", data: { total: null, online: null } },
        { status: 200 },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { status: "success", data: { total: null, online: null } },
      { status: 200 },
    );
  }
}
