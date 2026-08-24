const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Prevent duplicate auth:unauthorized events within a short window
let lastUnauthorizedAt = 0;
function dispatchUnauthorized() {
  const now = Date.now();
  if (now - lastUnauthorizedAt < 2000) return; // debounce 2s
  lastUnauthorizedAt = now;
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isServer = typeof window === "undefined";

  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Server-side: directly to Laravel  →  /api/...
  // Client-side: through Next.js proxy →  /api/backend/...
  const url = isServer
    ? `${API_BASE}/api${formattedEndpoint}`
    : `/api/backend${formattedEndpoint}`;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (isServer) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("laravel_token")?.value;
      if (token) headers.set("Authorization", `Bearer ${token}`);
    } catch {
      console.warn("[apiFetch] Could not read cookies on the server.");
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
  } catch (err) {
    throw new ApiError("নেটওয়ার্ক সমস্যা — সার্ভারে পৌঁছানো যায়নি।", 0);
  }

  // Parse body once
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Only trigger global logout on client-side 401s
    if (response.status === 401 && !isServer) {
      dispatchUnauthorized();
    }

    throw new ApiError(
      (data as { message?: string } | null)?.message || "অনুরোধ ব্যর্থ হয়েছে",
      response.status,
      data
    );
  }

  return data as T;
}