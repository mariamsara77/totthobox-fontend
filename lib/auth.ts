// lib/auth.ts

export interface User {
  id: number;
  name: string;
  email: string;
  slug: string;
  avatar_url: string | null;
}

export const getAuthHeaders = (isPost = false): Record<string, string> => ({
  Accept: "application/json",
  ...(isPost ? { "Content-Type": "application/json" } : {}),
});

// The HttpOnly cookie is intentionally invisible to browser JavaScript.
// Protected requests are authenticated by the same-origin backend proxy.
export const isLoggedIn = (): boolean => true;