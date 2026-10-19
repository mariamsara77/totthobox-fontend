const VISITOR_STORAGE_KEY = "totthobox_visitor_id";

let memoryVisitorId: string | null = null;

function createVisitorId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `visitor_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Returns the browser-stable visitor ID used to associate guest AI chats.
 * Falls back to an in-memory ID if localStorage is unavailable.
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const existingId = window.localStorage.getItem(VISITOR_STORAGE_KEY)?.trim();

    if (existingId) {
      memoryVisitorId = existingId;
      return existingId;
    }

    const visitorId = memoryVisitorId ?? createVisitorId();
    window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
    memoryVisitorId = visitorId;

    return visitorId;
  } catch {
    memoryVisitorId ??= createVisitorId();
    return memoryVisitorId;
  }
}
