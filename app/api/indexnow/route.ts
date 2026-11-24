import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || "4f46e5b643c4bef5203c9ac56e815769";
const HOST = "totthobox.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const urlList: string[] = Array.isArray(body?.urls)
      ? body.urls
      : body?.url
      ? [body.url]
      : [];

    if (urlList.length === 0) {
      return NextResponse.json(
        { error: "Missing 'url' or 'urls' array in request body" },
        { status: 400 },
      );
    }

    // Submit payload to IndexNow endpoint
    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlList.map((u) =>
        u.startsWith("http") ? u : `https://${HOST}${u.startsWith("/") ? "" : "/"}${u}`,
      ),
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      submittedUrls: payload.urlList,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "IndexNow submission failed" },
      { status: 500 },
    );
  }
}
