export type ActivityValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | null;

export interface ActivityItem {
  id: string;
  type: string;
  key: string;
  value: ActivityValue;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = "tb_tracking_queue";
const MAX_QUEUE_ITEMS = 500;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidActivityItem(item: unknown, now: number): item is ActivityItem {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return false;
  }
  const rec = item as Record<string, unknown>;
  if (typeof rec.id !== "string" || !UUID_V4_PATTERN.test(rec.id)) {
    return false;
  }
  if (
    typeof rec.type !== "string" ||
    rec.type.length === 0 ||
    rec.type.length > 50
  ) {
    return false;
  }
  if (
    typeof rec.key !== "string" ||
    rec.key.length === 0 ||
    rec.key.length > 50
  ) {
    return false;
  }
  if (typeof rec.timestamp !== "number" || !Number.isFinite(rec.timestamp)) {
    return false;
  }
  if (rec.timestamp > now + 60_000 || now - rec.timestamp > THIRTY_DAYS_MS) {
    return false;
  }
  return true;
}

export function readQueue(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed.filter((item): item is ActivityItem =>
      isValidActivityItem(item, now),
    );
  } catch {
    return [];
  }
}

export function writeQueue(items: ActivityItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const now = Date.now();
    const valid = items
      .filter((item) => isValidActivityItem(item, now))
      .slice(-MAX_QUEUE_ITEMS);
    if (valid.length === 0) {
      window.localStorage.removeItem(OFFLINE_QUEUE_KEY);
      return;
    }
    window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(valid));
  } catch {
    // Ignore storage quota or access errors
  }
}

export function enqueueActivity(item: ActivityItem): void {
  const now = Date.now();
  const safeItem: ActivityItem = {
    id: item.id,
    type: item.type.slice(0, 50),
    key: item.key.slice(0, 50),
    value: item.value,
    timestamp: Math.min(item.timestamp, now),
  };
  if (!isValidActivityItem(safeItem, now)) return;

  const current = readQueue();
  current.push(safeItem);
  writeQueue(current);
}

export function removeQueuedIds(ids: ReadonlyArray<string>): void {
  if (ids.length === 0) return;
  const idSet = new Set(ids);
  const remaining = readQueue().filter((item) => !idSet.has(item.id));
  writeQueue(remaining);
}

export function getQueueLength(): number {
  return readQueue().length;
}
