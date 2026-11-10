import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-config";

export const dynamic = "force-dynamic";

/**
 * Hourly News Cache Warming Cron Job
 * Protected by CRON_SECRET or Authorization Bearer header.
 * Triggered hourly by Vercel Cron, GitHub Actions, or server cron.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const querySecret = request.nextUrl.searchParams.get("secret");
    const expectedSecret =
      process.env.CRON_SECRET || "totthobox_cron_secret_2026";

    const isAuthorized =
      authHeader === `Bearer ${expectedSecret}` || querySecret === expectedSecret;

    if (!isAuthorized && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid cron secret" },
        { status: 401 },
      );
    }

    // Revalidate news tags and paths
    revalidateTag(CACHE_TAGS.NEWS, "max");
    revalidatePath("/news/headlines", "page");
    revalidatePath("/news", "page");

    // Pre-warm the main headlines page in background
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://totthobox.com";
    try {
      await fetch(`${siteUrl}/news/headlines`, {
        headers: { "User-Agent": "Totthobox-Cache-Warmer/1.0" },
      });
    } catch {
      // Ignore network errors during warm-up
    }

    return NextResponse.json({
      success: true,
      message: "News cache successfully refreshed and pre-warmed",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Warm news failed" },
      { status: 500 },
    );
  }
}
