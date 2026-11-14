import { isBot, isIgnoredRoute } from "@/lib/analytics";

export interface VisitorPageviewPayload {
  visitor_id: string;
  session_id: string;
  is_first_visit: boolean;
  is_pwa: boolean;
  referrer: string;
  path: string;
  device_type: "mobile" | "tablet" | "desktop";
  language: string;
  timestamp: number;
}

export interface VisitorHeartbeatPayload {
  visitor_id: string;
  session_id: string;
  path: string;
  is_pwa: boolean;
  timestamp: number;
}

const STORAGE_VISITOR_KEY = "tb_visitor_id";
const STORAGE_FIRST_VISIT_KEY = "tb_visited_before";
const SESSION_ID_KEY = "tb_session_id";
const SESSION_ACTIVITY_KEY = "tb_session_last_active";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;

  // Respect Do-Not-Track
  if (
    navigator.doNotTrack === "1" ||
    (window as unknown as { doNotTrack?: string }).doNotTrack === "1"
  ) {
    return false;
  }

  try {
    const raw = window.localStorage.getItem("cookie_consent");
    if (!raw) return false;
    const saved = JSON.parse(raw) as Record<string, unknown>;
    return saved.analytics === true;
  } catch {
    return false;
  }
}

function getOrGenerateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

function getVisitorId(): { visitorId: string; isFirstVisit: boolean } {
  try {
    const existing = localStorage.getItem(STORAGE_VISITOR_KEY);
    const hasVisitedBefore = localStorage.getItem(STORAGE_FIRST_VISIT_KEY) === "true";

    if (existing) {
      return { visitorId: existing, isFirstVisit: false };
    }

    const newId = getOrGenerateUUID();
    localStorage.setItem(STORAGE_VISITOR_KEY, newId);
    localStorage.setItem(STORAGE_FIRST_VISIT_KEY, "true");
    return { visitorId: newId, isFirstVisit: !hasVisitedBefore };
  } catch {
    return { visitorId: "anon_" + getOrGenerateUUID(), isFirstVisit: false };
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

    const newId = getOrGenerateUUID();
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
  return isDisplayMode || isIos;
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function sendPayload(url: string, payload: unknown): void {
  try {
    const dataString = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([dataString], { type: "application/json" });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    }

    // Fallback: fetch with keepalive
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: dataString,
      keepalive: true,
    }).catch(() => {
      // Fail silently
    });
  } catch {
    // Fail silently
  }
}

function runWhenIdle(callback: () => void): void {
  if (typeof window === "undefined") return;
  if ("requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback: (cb: IdleRequestCallback, opt?: IdleRequestOptions) => number }).requestIdleCallback(
      () => callback(),
      { timeout: 3000 },
    );
  } else {
    setTimeout(callback, 1000);
  }
}

let lastTrackedPath = "";
let lastTrackedTime = 0;
const DEDUPE_WINDOW_MS = 5000;

export function trackVisitorPageView(pathname: string): void {
  if (typeof window === "undefined" || isBot()) return;
  if (!hasAnalyticsConsent() || isIgnoredRoute(pathname)) return;

  const now = Date.now();
  if (lastTrackedPath === pathname && now - lastTrackedTime < DEDUPE_WINDOW_MS) {
    return;
  }
  lastTrackedPath = pathname;
  lastTrackedTime = now;

  runWhenIdle(() => {
    const { visitorId, isFirstVisit } = getVisitorId();
    const sessionId = getSessionId();

    const payload: VisitorPageviewPayload = {
      visitor_id: visitorId,
      session_id: sessionId,
      is_first_visit: isFirstVisit,
      is_pwa: detectPwa(),
      referrer: document.referrer || "",
      path: pathname,
      device_type: getDeviceType(),
      language: navigator.language || "bn",
      timestamp: now,
    };

    sendPayload("/api/analytics/pageview", payload);
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
    is_pwa: detectPwa(),
    timestamp: Date.now(),
  };

  sendPayload("/api/analytics/heartbeat", payload);
}
