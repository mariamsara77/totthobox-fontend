export const AUTH_COOKIE_NAME = "laravel_token";

/**
 * Authentication is server-session based. Client components must never
 * persist or derive the authenticated identity from localStorage/sessionStorage.
 */
export const AUTH_FETCH_OPTIONS: RequestInit = {
  credentials: "include",
  cache: "no-store",
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-store",
  },
};
