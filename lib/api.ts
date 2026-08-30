// lib/api.ts
const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com"
).replace(/\/$/, "");

interface FetcherOptions extends RequestInit {
  revalidate?: number | false;
}

export async function fetcher<T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { revalidate, headers, ...rest } = options;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const res = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    // Next.js ক্যাশিং: API ডাউন থাকলেও সার্ভার ক্যাশ থেকে ডেটা রেন্ডার করবে
    next: {
      revalidate: revalidate ?? 3600, // ডিফল্ট ১ ঘণ্টা ক্যাশ থাকবে
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("API থেকে সঠিক JSON পাওয়া যায়নি (সম্ভবত সার্ভার এরর)");
  }

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "API অনুরোধ ব্যর্থ হয়েছে");
  }

  return json.data;
}