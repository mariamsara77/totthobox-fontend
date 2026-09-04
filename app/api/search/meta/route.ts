import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/search/meta`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // 5 minutes cache
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      prefixes: data.prefixes || [],
      hints: data.hints || {},
    });
  } catch (err) {
    console.error("[search/meta]", err);
    return NextResponse.json({
      prefixes: [],
      hints: {},
    });
  }
}