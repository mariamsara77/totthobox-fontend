const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    credentials: "include", // সার্ভারে কুকি পাঠানোর জন্য এটি বাধ্যতামূলক
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, ...err };
  }

  return res.json();
}

export default apiFetch;