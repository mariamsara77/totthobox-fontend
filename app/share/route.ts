import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim().slice(0, 200);
    const text = String(form.get("text") ?? "").trim().slice(0, 2000);
    const rawUrl = String(form.get("url") ?? "").trim();

    let sharedUrl = "";
    if (rawUrl) {
      try {
        const parsed = new URL(rawUrl);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          sharedUrl = parsed.toString().slice(0, 2000);
        }
      } catch {}
    }

    const destination = new URL("/", request.url);
    if (title) destination.searchParams.set("shared_title", title);
    if (text) destination.searchParams.set("shared_text", text);
    if (sharedUrl) destination.searchParams.set("shared_url", sharedUrl);

    return NextResponse.redirect(destination, 303);
  } catch {
    return NextResponse.redirect(new URL("/", request.url), 303);
  }
}

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/", request.url), 303);
}
