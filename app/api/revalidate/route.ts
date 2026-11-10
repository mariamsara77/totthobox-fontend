import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * On-Demand Cache Revalidation API for Totthobox
 * Allows backend Laravel CMS to instantly purge Next.js cache
 * when records are created, updated, or deleted.
 *
 * Headers:
 *   x-revalidate-secret: <REVALIDATE_SECRET>
 * Body JSON:
 *   { "tag": "history" } OR { "tag": "history:shat-gombuj-masjid" }
 *   OR { "path": "/bangladesh/history/shat-gombuj-masjid" }
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("x-revalidate-secret");
    const querySecret = request.nextUrl.searchParams.get("secret");
    const providedSecret = authHeader || querySecret;
    const expectedSecret =
      process.env.REVALIDATE_SECRET || "totthobox_revalidate_secret_key";

    if (!providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid revalidation secret" },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { tag, path, type } = body as {
      tag?: string;
      path?: string;
      type?: "page" | "layout";
    };

    if (!tag && !path) {
      return NextResponse.json(
        {
          success: false,
          message: "Please specify either a 'tag' or 'path' to revalidate",
        },
        { status: 400 },
      );
    }

    const revalidated: { tag?: string; path?: string } = {};

    if (tag) {
      revalidateTag(tag, "max");
      revalidated.tag = tag;
    }

    if (path) {
      revalidatePath(path, type);
      revalidated.path = path;
    }

    return NextResponse.json({
      success: true,
      message: "Cache revalidation executed successfully",
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Unexpected revalidation error",
      },
      { status: 500 },
    );
  }
}
