import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const fingerprint = process.env.TWA_SHA256_CERT_FINGERPRINT?.trim();

  if (!fingerprint) {
    return NextResponse.json(
      { error: "TWA_SHA256_CERT_FINGERPRINT is not configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.totthobox.app",
          sha256_cert_fingerprints: [fingerprint],
        },
      },
    ],
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
      },
    }
  );
}
