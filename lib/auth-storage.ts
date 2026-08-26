const USER_DATA_KEY_PATTERNS = [
  /auth/i,
  /user/i,
  /profile/i,
  /session/i,
  /token/i,
];

/**
 * Remove only browser-stored authentication/user data owned by this app.
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

  // Notify any user-scoped client caches/stores that do not live in storage.
  window.dispatchEvent(new CustomEvent("auth:session-reset"));
}

/**
 * Best-effort cleanup of browser Cache Storage entries created by the app.
 * Next.js server/data cache is handled server-side and is never shared here.
 */
export async function clearClientCaches(): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) return;

  try {
    const cacheNames = await window.caches.keys();
    await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
  } catch {
    // Cache Storage may be unavailable or restricted; auth remains cookie-scoped.
  }
}
