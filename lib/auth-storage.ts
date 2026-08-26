import { mutate } from "swr";

const USER_DATA_KEY_PATTERNS = [
  /auth/i,
  /user/i,
  /profile/i,
  /session/i,
  /token/i,
];

/**
 * Remove browser-stored authentication/user data owned by this app.
 * Non-auth application preferences are intentionally preserved.
 */
export function clearClientAuthState(): void {
  if (typeof window === "undefined") return;

  const clearStorage = (storage: Storage) => {
    const keysToRemove: string[] = [];

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key && USER_DATA_KEY_PATTERNS.some((pattern) => pattern.test(key))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => storage.removeItem(key));
  };

  try {
    clearStorage(window.localStorage);
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }

  try {
    clearStorage(window.sessionStorage);
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }

  // Notify custom user-scoped stores that do not live in browser storage.
  window.dispatchEvent(new CustomEvent("auth:session-reset"));
}

/**
 * Clear client-side data caches so a new account cannot inherit the previous
 * account's in-memory response data. Server-side Next.js authenticated fetches
 * use no-store and are therefore not shared through this cache.
 */
export async function clearClientCaches(): Promise<void> {
  try {
    // SWR's default global cache is process-local to the browser tab.
    await mutate(() => true, undefined, { revalidate: false });
  } catch {
    // SWR cache may be backed by a custom provider or be unavailable.
  }

  if (typeof window === "undefined" || !("caches" in window)) return;

  try {
    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
  } catch {
    // Cache Storage may be unavailable or restricted.
  }
}
