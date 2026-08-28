const API_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://admin.totthobox.com";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let lastUnauthorizedAt = 0;

function dispatchUnauthorized(): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (now - lastUnauthorizedAt < 2000) return;
  lastUnauthorizedAt = now;
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const server = typeof window === "undefined";
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = server
    ? `${API_BASE}/api${path}`
    : `/api/backend${path}`;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (server) {
    try {
      const { cookies } = await import("next/headers");
      const token = (await cookies()).get("__Host-totthobox_session")?.value;
      if (token) headers.set("Authorization", `Bearer ${token}`);
    } catch {
      // Server-only cookie access can fail outside a request context.
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("নেটওয়ার্ক সমস্যা — সার্ভারে পৌঁছানো যায়নি।", 0);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && !server) dispatchUnauthorized();

    throw new ApiError(
      data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : "অনুরোধ ব্যর্থ হয়েছে।",
      response.status,
      data,
    );
  }

  return data as T;
}
