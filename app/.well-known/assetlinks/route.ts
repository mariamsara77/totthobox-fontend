import { NextResponse } from "next/server";

const PACKAGE_NAME = "com.totthobox.app";

export function GET() {
  const fingerprint = process.env.TWA_SHA256_CERT_FINGERPRINT?.trim();

  if (!fingerprint) {
    return NextResponse.json(
      [],
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const assetLinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: PACKAGE_NAME,
        sha256_cert_fingerprints: [fingerprint],
      },
    },
  ];

  return NextResponse.json(assetLinks, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}
