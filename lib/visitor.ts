const VISITOR_STORAGE_KEY = "totthobox_visitor_id";
const VISITOR_ID_PREFIX = "visitor_";

let memoryVisitorId: string | null = null;

function createVisitorId(): string {
  const uniqueId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;

  return `${VISITOR_ID_PREFIX}${uniqueId}`;
}

/**
 * Returns the browser-stable visitor ID used to associate guest AI chats.
 * Legacy unprefixed IDs are migrated in place to avoid changing the visitor
 * identity unnecessarily. An in-memory ID is used if browser storage is unavailable.
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const existingId = window.localStorage.getItem(VISITOR_STORAGE_KEY)?.trim();

    if (existingId) {
      const visitorId = existingId.startsWith(VISITOR_ID_PREFIX)
        ? existingId
        : `${VISITOR_ID_PREFIX}${existingId}`;

      if (visitorId !== existingId) {
        window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
      }

      memoryVisitorId = visitorId;
      return visitorId;
    }

    const visitorId =
      memoryVisitorId?.startsWith(VISITOR_ID_PREFIX)
        ? memoryVisitorId
        : createVisitorId();

    window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
    memoryVisitorId = visitorId;

    return visitorId;
  } catch {
    if (!memoryVisitorId?.startsWith(VISITOR_ID_PREFIX)) {
      memoryVisitorId = createVisitorId();
    }

    return memoryVisitorId;
  }
}
