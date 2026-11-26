const VISITOR_STORAGE_KEY = "totthobox_visitor_id";
const LEGACY_VISITOR_KEY = "tb_visitor_id";
const VISITOR_COOKIE_KEY = "totthobox_visitor_id";
const VISITOR_ID_PREFIX = "visitor_";
const VISITOR_ID_PATTERN = /^visitor_[A-Za-z0-9_-]{8,100}$/;
const VISITOR_COOKIE_MAX_AGE_S = 365 * 24 * 60 * 60; // 1 year

let memoryVisitorId: string | null = null;

export function isValidVisitorId(
  value: string | null | undefined,
): value is string {
  return typeof value === "string" && VISITOR_ID_PATTERN.test(value);
}

function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function createVisitorId(): string {
  return `${VISITOR_ID_PREFIX}${generateUuid()}`;
}

function normalizeCandidate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidate = trimmed.startsWith(VISITOR_ID_PREFIX)
    ? trimmed
    : `${VISITOR_ID_PREFIX}${trimmed}`;

  return isValidVisitorId(candidate) ? candidate : null;
}

function readVisitorCookie(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${VISITOR_COOKIE_KEY}=([^;]+)`),
    );
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function writeVisitorCookie(visitorId: string): void {
  if (typeof document === "undefined") return;
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${VISITOR_COOKIE_KEY}=${encodeURIComponent(visitorId)}; path=/; max-age=${VISITOR_COOKIE_MAX_AGE_S}; SameSite=Lax${secure}`;
  } catch {
    // Ignore cookie write errors when storage is restricted
  }
}

/**
 * Returns the persistent first-party visitor ID shared across tracking and AI chat.
 * Format: /^visitor_[A-Za-z0-9_-]{8,100}$/
 * Persisted in localStorage + first-party cookie, with an in-memory fallback.
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let fromStorage: string | null = null;
  let fromLegacy: string | null = null;
  try {
    fromStorage = normalizeCandidate(
      window.localStorage.getItem(VISITOR_STORAGE_KEY),
    );
    if (!fromStorage) {
      fromLegacy = normalizeCandidate(
        window.localStorage.getItem(LEGACY_VISITOR_KEY),
      );
    }
  } catch {
    // localStorage blocked or unavailable
  }

  const fromCookie = normalizeCandidate(readVisitorCookie());
  const existing = fromStorage || fromCookie || fromLegacy || memoryVisitorId;

  const visitorId = isValidVisitorId(existing) ? existing : createVisitorId();
  memoryVisitorId = visitorId;

  if (fromStorage !== visitorId) {
    try {
      window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
    } catch {
      // Ignore storage write errors
    }
  }

  if (fromCookie !== visitorId) {
    writeVisitorCookie(visitorId);
  }

  return visitorId;
}

export function clearVisitorId(): void {
  memoryVisitorId = null;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(VISITOR_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_VISITOR_KEY);
    window.localStorage.removeItem("tb_visited_before");
  } catch {
    // Ignore storage errors
  }
  try {
    document.cookie = `${VISITOR_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${LEGACY_VISITOR_KEY}=; path=/; max-age=0; SameSite=Lax`;
  } catch {
    // Ignore cookie errors
  }
}
