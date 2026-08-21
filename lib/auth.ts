// lib/auth.ts

export interface User {
  id: number;
  name: string;
  email: string;
  slug: string;
  avatar_url: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const setToken = (token: string) => {
  localStorage.setItem("auth_token", token);
};

export const removeToken = () => {
  localStorage.removeItem("auth_token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// 🛠️ যোগ করা হলো: InteractiveActions.tsx এর জন্য
export const isLoggedIn = (): boolean => {
  return isAuthenticated();
};

// 🛠️ যোগ করা হলো: Auth Header পাওয়ার জেনেরিক ফাংশন
export const getAuthHeaders = (isPost = false): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (isPost) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/api/user`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      removeToken();
      return null;
    }

    return await res.json();
  } catch (error) {
    removeToken();
    return null;
  }
};

export const logoutRequest = async () => {
  const token = getToken();
  if (!token) return;

  try {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
  } catch (e) {
    // ignore
  }
};