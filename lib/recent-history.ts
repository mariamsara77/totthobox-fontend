import { ALL_NAV_ITEMS } from "@/config/navigation";

export interface RecentVisitItem {
  href: string;
  label: string;
  visitedAt: number;
}

const RECENT_HISTORY_KEY = "totthobox_recent_history";
const MAX_RECENT_ITEMS = 8;

export function recordRecentVisit(pathname: string, fallbackTitle?: string): void {
  if (typeof window === "undefined" || !pathname || pathname === "/") return;
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/offline") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/api")
  ) {
    return;
  }

  const matched = ALL_NAV_ITEMS.find((item) => item.href === pathname);
  const label =
    matched?.label ||
    (fallbackTitle ? fallbackTitle.replace(/\s*\|\s*Totthobox.*$/i, "").trim() : "") ||
    pathname;

  try {
    const raw = window.localStorage.getItem(RECENT_HISTORY_KEY);
    const prev: RecentVisitItem[] = raw ? JSON.parse(raw) : [];
    const filtered = Array.isArray(prev)
      ? prev.filter((entry) => entry && entry.href !== pathname)
      : [];
    const next: RecentVisitItem[] = [
      { href: pathname, label, visitedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_RECENT_ITEMS);
    window.localStorage.setItem(RECENT_HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
}

export function getRecentVisits(): RecentVisitItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearRecentVisits(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(RECENT_HISTORY_KEY);
  } catch {
    // ignore
  }
}
