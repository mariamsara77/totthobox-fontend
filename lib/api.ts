const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // auth_token এবং token দুটিই চেক করা হচ্ছে
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth_token") || localStorage.getItem("token")
      : null;

  const defaultHeaders: HeadersInit = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };

  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token");
  }

  return response;
}

// 🛠️ TypeScript এরর TS2613 ফিক্স করার জন্য default export যোগ করা হলো
export default apiFetch;