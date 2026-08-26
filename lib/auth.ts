// Single authentication contract for the frontend.
//
// The authoritative session is AuthContext + the HttpOnly `laravel_token`
// cookie. Browser JavaScript must never read or store the Sanctum token.

export interface User {
  id: number;
  name: string;
  email: string;
  slug: string;
  avatar_url: string | null;
}

/**
 * Compatibility bridge for older interactive components.
 * AuthContext updates this value whenever the authoritative session changes.
 * New code should prefer useAuth().user / useAuth().isLoggedIn.
 */
let currentUser: User | null = null;

export function setAuthUser(user: User | null): void {
  currentUser = user;

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("auth:state-changed", {
        detail: { user },
      })
    );
  }
}

export function getAuthUser(): User | null {
  return currentUser;
}

export const getAuthHeaders = (isPost = false): Record<string, string> => ({
  Accept: "application/json",
  ...(isPost ? { "Content-Type": "application/json" } : {}),
});

/**
 * Backward-compatible synchronous check for legacy interactive components.
 * It is NEVER based on localStorage/cookies/tokens.
 */
export const isLoggedIn = (user?: User | null): boolean =>
  user !== undefined ? Boolean(user) : Boolean(currentUser);
