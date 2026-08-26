// Authentication helpers shared by the frontend.
//
// The actual authenticated session is owned by AuthContext + the HttpOnly
// laravel_token cookie. Browser JavaScript must never read the token.

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

/**
 * Legacy helper kept for compatibility.
 * Do not use this as the source of truth for authentication state.
 * Use useAuth().isLoggedIn / useAuth().user instead.
 */
export const isLoggedIn = (user?: User | null): boolean => Boolean(user);
