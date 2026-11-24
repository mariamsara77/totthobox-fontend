import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BACKEND_URL ||
  "https://admin.totthobox.com";

export const revalidate = 1800;

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
  "CDN-Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
  "Cloudflare-CDN-Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
};

const DEFAULT_PREFIXES = [
  "টুলস",
  "কনভার্টার",
  "জরুরি",
  "দেশ",
  "ক্যালেন্ডার",
  "ছুটির দিন",
  "সফটওয়্যার",
  "পর্যটন",
  "পরিচিতি",
  "প্রতিষ্ঠান",
  "গুনীজন",
  "ইতিহাস",
  "ইসলাম",
  "দোয়া",
  "খবর",
];

const DEFAULT_HINTS: Record<string, string> = {
  টুলস: "tools",
  কনভার্টার: "converter",
  জরুরি: "emergency",
  দেশ: "country",
  ক্যালেন্ডার: "calendar",
  "ছুটির দিন": "holiday",
  সফটওয়্যার: "software",
  পর্যটন: "tourism",
  পরিচিতি: "introduction",
  প্রতিষ্ঠান: "establishment",
  গুনীজন: "person",
  ইতিহাস: "history",
  ইসলাম: "islam",
  দোয়া: "dua",
  খবর: "news",
};

export async function GET() {
  let backendPrefixes: string[] = [];
  let backendHints: Record<string, string> = {};

  try {
    const res = await fetch(`${BACKEND_URL}/api/search/meta`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 1800 },
    });

    if (res.ok) {
      const data = await res.json();
      backendPrefixes = Array.isArray(data.prefixes) ? data.prefixes : [];
      backendHints = data.hints && typeof data.hints === "object" ? data.hints : {};
    }
  } catch (err) {
    console.warn("[search/meta] Backend unavailable, using default search meta:", err);
  }

  // Combine unique prefixes
  const combinedPrefixes = Array.from(
    new Set([...DEFAULT_PREFIXES, ...backendPrefixes]),
  );
  const combinedHints = { ...DEFAULT_HINTS, ...backendHints };

  return NextResponse.json(
    {
      prefixes: combinedPrefixes,
      hints: combinedHints,
    },
    { headers: CACHE_HEADERS },
  );
}
