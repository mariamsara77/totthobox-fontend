/**
 * Centralized Authentication Configuration for Totthobox
 *
 * Provides a single source of truth for OAuth Client IDs, Redirect URIs,
 * and configuration state checks across both client and server environments.
 */

const IS_DEV = process.env.NODE_ENV === "development";

/**
 * Returns the Google OAuth Client ID if configured.
 */
export function getGoogleClientId(): string | null {
  const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || null;
  if (!id && IS_DEV && typeof window !== "undefined") {
    // Only warn once in development if client code requests an unconfigured provider
    if (!(window as unknown as { __warnedGoogleId?: boolean }).__warnedGoogleId) {
      console.warn(
        "[auth-config] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined. Set it in .env.local and your hosting dashboard.",
      );
      (window as unknown as { __warnedGoogleId?: boolean }).__warnedGoogleId = true;
    }
  }
  return id;
}

/**
 * Returns the GitHub OAuth Client ID if configured.
 * Defaults to the established Totthobox GitHub OAuth application ID if env var is unset.
 */
export function getGithubClientId(): string | null {
  const id =
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID?.trim() ||
    (typeof window === "undefined"
      ? process.env.GITHUB_CLIENT_ID?.trim()
      : null) ||
    "Ov23li78Wl6unzKg6n59"; // Default Totthobox GitHub OAuth App Client ID

  if (!id && IS_DEV && typeof window !== "undefined") {
    if (!(window as unknown as { __warnedGithubId?: boolean }).__warnedGithubId) {
      console.warn(
        "[auth-config] NEXT_PUBLIC_GITHUB_CLIENT_ID is not defined. Set it in .env.local and your hosting dashboard.",
      );
      (window as unknown as { __warnedGithubId?: boolean }).__warnedGithubId = true;
    }
  }
  return id;
}

/**
 * Builds the runtime redirect URI for GitHub OAuth based on the current origin.
 * Automatically adapts between localhost (development) and production domains.
 */
export function getGithubRedirectUri(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/auth/github/callback`;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://totthobox.com";
  return `${siteUrl.replace(/\/+$/, "")}/auth/github/callback`;
}

/**
 * Builds the runtime redirect URI for Google OAuth callback if redirect flow is used.
 */
export function getGoogleRedirectUri(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/auth/callback`;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://totthobox.com";
  return `${siteUrl.replace(/\/+$/, "")}/auth/callback`;
}

export const isGoogleConfigured = Boolean(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim(),
);

export const isGithubConfigured = Boolean(
  process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID?.trim() ||
    process.env.GITHUB_CLIENT_ID?.trim() ||
    "Ov23li78Wl6unzKg6n59",
);
