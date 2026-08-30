const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

interface LaravelFetchInit extends Omit<RequestInit, "headers"> {
  token?: string | null;
  headers?: Record<string, string>;
}

// Raw fetch — শুধু generic proxy route ব্যবহার করবে (status/body হুবহু passthrough দরকার)
export async function laravelFetch(path: string, init: LaravelFetchInit = {}): Promise<Response> {
  const { token, headers, ...rest } = init;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const isFormData = rest.body instanceof FormData;

  return fetch(`${LARAVEL_API_URL}${normalizedPath}`, {
    ...rest,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
}

// JSON convenience — সব dedicated auth route এটাই ব্যবহার করবে
export async function laravelJson<T = any>(
  path: string,
  init: LaravelFetchInit = {},
): Promise<{ status: number; data: T | null }> {
  const res = await laravelFetch(path, init);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json().catch(() => null) : null;
  return { status: res.status, data };
}