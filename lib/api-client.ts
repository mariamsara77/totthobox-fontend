export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const isFormData = init.body instanceof FormData;

  const extraHeaders: Record<string, string> = {};

  // Safely read socket ID only in browser runtime without top-level server bundle issues
  if (typeof window !== "undefined") {
    try {
      const pusherInstances = (window as any).Pusher?.instances;
      const socketId = pusherInstances?.[0]?.connection?.socket_id;
      if (typeof socketId === "string" && socketId.trim().length > 0) {
        extraHeaders["X-Socket-ID"] = socketId.trim();
      }
    } catch {}
  }

  const cleanHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  if (!isFormData) {
    cleanHeaders["Content-Type"] = "application/json";
  }

  if (init.headers) {
    const rawHeaders =
      init.headers instanceof Headers
        ? Object.fromEntries(init.headers.entries())
        : Array.isArray(init.headers)
          ? Object.fromEntries(init.headers)
          : (init.headers as Record<string, unknown>);

    for (const [k, v] of Object.entries(rawHeaders)) {
      if (typeof v === "string" && v.trim().length > 0) {
        cleanHeaders[k] = v.trim();
      }
    }
  }

  for (const [k, v] of Object.entries(extraHeaders)) {
    if (typeof v === "string" && v.trim().length > 0) {
      cleanHeaders[k] = v.trim();
    }
  }

  // Safe URL fallback for edge runtime
  const baseUrl =
    typeof window !== "undefined"
      ? ""
      : (process.env.NEXT_PUBLIC_SITE_URL || "https://totthobox.com").replace(/\/+$/, "");

  const fullUrl = `${baseUrl}/api/backend${normalizedPath}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  if (init.signal) {
    init.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(fullUrl, {
      cache: "no-store",
      ...init,
      headers: cleanHeaders,
      signal: controller.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    let data: any = null;

    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      const text = await res.text().catch(() => "");
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || "Response parsing failed" };
      }
    }

    if (!res.ok) {
      return (data || { success: false, data: [] }) as T;
    }

    return (data ?? { success: true }) as T;
  } catch (error) {
    console.warn("apiFetch edge network error:", error);
    return { success: false, data: [] } as T;
  } finally {
    clearTimeout(timeoutId);
  }
}
