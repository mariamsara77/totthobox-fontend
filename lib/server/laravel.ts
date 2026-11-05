function getApiUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.LARAVEL_API_URL ||
    (process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "")}/api`
      : null) ||
    "https://admin.totthobox.com/api";
  return url.replace(/\/+$/, "");
}

interface LaravelFetchInit extends Omit<RequestInit, "headers"> {
  token?: string | null;
  headers?: Record<string, string | undefined | null>;
}

export async function laravelFetch(path: string, init: LaravelFetchInit = {}): Promise<Response> {
  const { token, headers, ...rest } = init;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const isFormData = rest.body instanceof FormData;

  const cleanHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  if (!isFormData) {
    cleanHeaders["Content-Type"] = "application/json";
  }

  if (token && typeof token === "string" && token.trim().length > 0) {
    cleanHeaders["Authorization"] = `Bearer ${token.trim()}`;
  }

  if (headers && typeof headers === "object") {
    for (const [key, val] of Object.entries(headers)) {
      if (typeof val === "string" && val.trim().length > 0) {
        cleanHeaders[key] = val.trim();
      }
    }
  }

  return fetch(`${getApiUrl()}${normalizedPath}`, {
    ...rest,
    cache: "no-store",
    headers: cleanHeaders,
  });
}

export async function laravelJson<T = any>(
  path: string,
  init: LaravelFetchInit = {},
): Promise<{ status: number; data: T | null }> {
  try {
    const res = await laravelFetch(path, init);
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await res.json().catch(() => null) : null;
    return { status: res.status, data };
  } catch (error) {
    console.warn("laravelJson network error:", error);
    return { status: 502, data: null };
  }
}
