const VISITOR_STORAGE_KEY = "totthobox_visitor_id";
const VISITOR_ID_PREFIX = "visitor_";

let memoryVisitorId: string | null = null;

function isValidVisitorId(value: string | null | undefined): value is string {
  return (
    typeof value === "string" &&
    value.startsWith(VISITOR_ID_PREFIX) &&
    value.length > VISITOR_ID_PREFIX.length
  );
}

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
        ? isValidVisitorId(existingId)
          ? existingId
          : createVisitorId()
        : `${VISITOR_ID_PREFIX}${existingId}`;

      memoryVisitorId = visitorId;

      if (visitorId !== existingId) {
        window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
      }

      return visitorId;
    }

    const visitorId = isValidVisitorId(memoryVisitorId)
      ? memoryVisitorId
      : createVisitorId();

    memoryVisitorId = visitorId;
    window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);

    return visitorId;
  } catch {
    if (!isValidVisitorId(memoryVisitorId)) {
      memoryVisitorId = createVisitorId();
    }

    return memoryVisitorId;
  }
}
