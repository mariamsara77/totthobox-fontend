import { isBot, isIgnoredRoute, hasAnalyticsConsent } from "@/lib/analytics";

export interface VisitorPageviewPayload {
  visitor_id: string;
  session_id: string;
  is_first_visit: boolean;
  is_pwa: boolean;
  has_installed: boolean;
  referrer: string;
  path: string;
  url: string;
  title: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  load_time_ms: number;
  screen_res: string;
  timezone: string;
  device_type: "mobile" | "tablet" | "desktop";
  language: string;
  timestamp: number;
}

export interface VisitorHeartbeatPayload {
  visitor_id: string;
  session_id: string;
  path: string;
  url: string;
  is_pwa: boolean;
  has_installed: boolean;
  timestamp: number;
}

interface OfflineTrackingActivity {
  id: string;
  type: string;
  key: string;
  value: unknown;
  timestamp: number;
}

const STORAGE_VISITOR_KEY = "tb_visitor_id";
const COOKIE_VISITOR_KEY = "tb_visitor_id";
const STORAGE_FIRST_VISIT_KEY = "tb_visited_before";
const STORAGE_INSTALLED_KEY = "pwa_installed";
const SESSION_ID_KEY = "tb_session_id";
const SESSION_ACTIVITY_KEY = "tb_session_last_active";
const OFFLINE_QUEUE_KEY = "tb_tracking_queue";
const MAX_OFFLINE_QUEUE = 50;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const VISITOR_COOKIE_MAX_AGE_S = 365 * 24 * 60 * 60; // 1 year

function getOrGenerateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

function readVisitorCookie(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${COOKIE_VISITOR_KEY}=([^;]+)`),
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
    document.cookie = `${COOKIE_VISITOR_KEY}=${encodeURIComponent(visitorId)}; path=/; max-age=${VISITOR_COOKIE_MAX_AGE_S}; SameSite=Lax${secure}`;
  } catch {}
}

export function getVisitorId(): { visitorId: string; isFirstVisit: boolean } {
  try {
    const fromCookie = readVisitorCookie();
    const fromStorage = localStorage.getItem(STORAGE_VISITOR_KEY);
    const hasVisitedBefore = localStorage.getItem(STORAGE_FIRST_VISIT_KEY) === "true";
    const existing = fromCookie || fromStorage;

    if (existing) {
      if (!fromCookie) writeVisitorCookie(existing);
      if (!fromStorage) localStorage.setItem(STORAGE_VISITOR_KEY, existing);
      return { visitorId: existing, isFirstVisit: false };
    }

    const newId = getOrGenerateUUID();
    writeVisitorCookie(newId);
    localStorage.setItem(STORAGE_VISITOR_KEY, newId);
    localStorage.setItem(STORAGE_FIRST_VISIT_KEY, "true");
    return { visitorId: newId, isFirstVisit: !hasVisitedBefore };
  } catch {
    return { visitorId: getOrGenerateUUID(), isFirstVisit: false };
  }
}

function getSessionId(): string {
  try {
    const existingId = sessionStorage.getItem(SESSION_ID_KEY);
    const lastActive = sessionStorage.getItem(SESSION_ACTIVITY_KEY);
    const now = Date.now();

    if (existingId && lastActive && now - Number(lastActive) < SESSION_TIMEOUT_MS) {
      sessionStorage.setItem(SESSION_ACTIVITY_KEY, String(now));
      return existingId;
    }

    const newId = "ses_" + getOrGenerateUUID();
    sessionStorage.setItem(SESSION_ID_KEY, newId);
    sessionStorage.setItem(SESSION_ACTIVITY_KEY, String(now));
    return newId;
  } catch {
    return "ses_" + getOrGenerateUUID();
  }
}

function detectPwa(): boolean {
  if (typeof window === "undefined") return false;
  const isDisplayMode =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches;
  const isIos = (navigator as unknown as { standalone?: boolean }).standalone === true;
  const isAndroidReferrer = document.referrer?.includes("android-app://") || false;
  return isDisplayMode || isIos || isAndroidReferrer;
}

function hasInstalledPwa(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_INSTALLED_KEY) === "true" || detectPwa();
  } catch {
    return detectPwa();
  }
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getLoadTimeMs(): number {
  if (typeof window === "undefined") return 0;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav && nav.loadEventEnd > 0) {
      const ms = Math.round(nav.loadEventEnd - nav.startTime);
      return ms > 0 && ms < 60000 ? ms : 0;
    }
  } catch {}
  return 0;
}

function readOfflineQueue(): OfflineTrackingActivity[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OfflineTrackingActivity[]) : [];
  } catch {
    return [];
  }
}

function writeOfflineQueue(items: OfflineTrackingActivity[]): void {
  try {
    if (items.length === 0) {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
      return;
    }
    localStorage.setItem(
      OFFLINE_QUEUE_KEY,
      JSON.stringify(items.slice(-MAX_OFFLINE_QUEUE)),
    );
  } catch {}
}

function enqueueOfflineActivity(type: string, key: string, value: unknown): void {
  const queue = readOfflineQueue();
  queue.push({
    id: getOrGenerateUUID(),
    type,
    key,
    value,
    timestamp: Date.now(),
  });
  writeOfflineQueue(queue);
}

let isFlushingQueue = false;

export async function flushOfflineTrackingQueue(): Promise<void> {
  if (typeof window === "undefined" || isBot() || !hasAnalyticsConsent()) return;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;
  if (isFlushingQueue) return;

  const queue = readOfflineQueue();
  if (queue.length === 0) return;

  isFlushingQueue = true;
  try {
    const { visitorId } = getVisitorId();
    const res = await fetch("/api/tracking/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Visitor-Id": visitorId,
      },
      body: JSON.stringify({
        visitor_id: visitorId,
        activities: queue,
      }),
      keepalive: true,
    });

    if (res.ok) {
      const remaining = readOfflineQueue().filter(
        (item) => !queue.some((sent) => sent.id === item.id),
      );
      writeOfflineQueue(remaining);
    }
  } catch {
    // Keep queued items for next retry
  } finally {
    isFlushingQueue = false;
  }
}

function sendPayload(
  url: string,
  payload: unknown,
  visitorId: string,
  queueMeta?: { type: string; key: string },
): void {
  try {
    const dataString = JSON.stringify(payload);

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      if (queueMeta) enqueueOfflineActivity(queueMeta.type, queueMeta.key, payload);
      return;
    }

    void fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Visitor-Id": visitorId,
      },
      body: dataString,
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok && res.status >= 500 && queueMeta) {
          enqueueOfflineActivity(queueMeta.type, queueMeta.key, payload);
          return;
        }
        if (res.ok) {
          void flushOfflineTrackingQueue();
        }
      })
      .catch(() => {
        if (queueMeta) enqueueOfflineActivity(queueMeta.type, queueMeta.key, payload);
      });
  } catch {
    // Fail silently
  }
}

const PV_DEDUPE_STORAGE_KEY = "tb_pv_dedupe";
const DEDUPE_WINDOW_MS = 30 * 60 * 1000; // 30 minutes per path
const memoryDedupeMap = new Map<string, number>();

function shouldSkipDuplicatePageView(routeKey: string, now: number): boolean {
  try {
    const raw = sessionStorage.getItem(PV_DEDUPE_STORAGE_KEY);
    const map: Record<string, number> = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const lastSeen = map[routeKey];
    if (typeof lastSeen === "number" && now - lastSeen < DEDUPE_WINDOW_MS) {
      return true;
    }
    // Prune expired entries to keep sessionStorage compact
    for (const key of Object.keys(map)) {
      if (now - map[key] >= DEDUPE_WINDOW_MS) {
        delete map[key];
      }
    }
    map[routeKey] = now;
    sessionStorage.setItem(PV_DEDUPE_STORAGE_KEY, JSON.stringify(map));
    return false;
  } catch {
    const lastSeen = memoryDedupeMap.get(routeKey);
    if (typeof lastSeen === "number" && now - lastSeen < DEDUPE_WINDOW_MS) {
      return true;
    }
    memoryDedupeMap.set(routeKey, now);
    return false;
  }
}

export function trackVisitorPageView(pathname: string): void {
  if (typeof window === "undefined" || isBot()) return;
  if (!hasAnalyticsConsent() || isIgnoredRoute(pathname)) return;

  const search = window.location.search || "";
  const routeKey = `${pathname}${search}`;
  const now = Date.now();
  if (shouldSkipDuplicatePageView(routeKey, now)) {
    return;
  }

  const { visitorId, isFirstVisit } = getVisitorId();
  const sessionId = getSessionId();
  const searchParams = new URLSearchParams(search);

  const payload: VisitorPageviewPayload = {
    visitor_id: visitorId,
    session_id: sessionId,
    is_first_visit: isFirstVisit,
    is_pwa: detectPwa(),
    has_installed: hasInstalledPwa(),
    referrer: document.referrer || "",
    path: pathname,
    url: window.location.href,
    title: document.title || "",
    utm_source: searchParams.get("utm_source"),
    utm_medium: searchParams.get("utm_medium"),
    utm_campaign: searchParams.get("utm_campaign"),
    load_time_ms: getLoadTimeMs(),
    screen_res: typeof window !== "undefined" ? `${screen.width}x${screen.height}` : "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka",
    device_type: getDeviceType(),
    language: navigator.language || "bn",
    timestamp: now,
  };

  sendPayload("/api/analytics/pageview", payload, visitorId, {
    type: "page_view",
    key: routeKey,
  });
}

export function sendVisitorHeartbeat(pathname: string): void {
  if (typeof window === "undefined" || isBot()) return;
  if (!hasAnalyticsConsent() || isIgnoredRoute(pathname)) return;
  if (document.visibilityState !== "visible") return;

  const { visitorId } = getVisitorId();
  const sessionId = getSessionId();

  const payload: VisitorHeartbeatPayload = {
    visitor_id: visitorId,
    session_id: sessionId,
    path: pathname,
    url: window.location.href, // Preserves real origin (localhost:3000 vs totthobox.com)
    is_pwa: detectPwa(),
    has_installed: hasInstalledPwa(),
    timestamp: Date.now(),
  };

  sendPayload("/api/analytics/heartbeat", payload, visitorId);
}

export function sendPageDurationBeacon(pathname: string, durationMs: number): void {
  if (typeof window === "undefined" || isBot()) return;
  if (!hasAnalyticsConsent() || isIgnoredRoute(pathname)) return;
  if (!Number.isFinite(durationMs) || durationMs < 500) return;

  const { visitorId } = getVisitorId();
  const sessionId = getSessionId();
  const body = JSON.stringify({
    category: "page",
    action: "duration",
    js_visitor_id: visitorId,
    session_id: sessionId,
    payload: {
      path: pathname,
      url: window.location.href,
      duration_ms: Math.round(durationMs),
    },
  });

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/tracking/event", blob)) {
        return;
      }
    }

    void fetch("/api/tracking/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Visitor-Id": visitorId,
      },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
