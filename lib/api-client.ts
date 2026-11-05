import { getEcho } from "@/lib/echo";

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
  try {
    const echo = getEcho();
    const socketId = echo?.socketId();
    if (socketId) {
      extraHeaders["X-Socket-ID"] = socketId;
    }
  } catch {}

  const res = await fetch(`/api/backend${normalizedPath}`, {
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...extraHeaders,
      ...init.headers,
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(data?.message || "অনুরোধ ব্যর্থ হয়েছে।", res.status, data?.errors);
  }

  return data as T;
}
