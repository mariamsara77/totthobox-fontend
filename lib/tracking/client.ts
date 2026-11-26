import { isBot, isIgnoredRoute, hasAnalyticsConsent } from "@/lib/analytics";
import { getVisitorId } from "@/lib/tracking/visitor-id";
import {
  enqueueActivity,
  readQueue,
  removeQueuedIds,
  type ActivityItem,
  type ActivityValue,
} from "@/lib/tracking/queue";

export type TrackingPayload = Record<string, unknown>;

export interface TrackEventInput {
  category: string;
  action: string;
  label?: string;
  payload?: TrackingPayload;
  keepalive?: boolean;
  eventUuid?: string;
}

export interface PageViewPayload {
  url: string;
  path: string;
  title: string;
  referrer: string;
  route_name?: string;
  load_time_ms: number;
  is_pwa: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

export interface PageLeavePayload {
  url: string;
  duration_ms: number;
}

export interface SystemPayload {
  timezone: string;
  screen_res: string;
  device_model?: string;
  app_version: string;
}

interface TrackingEventBody {
  event_uuid: string;
  category: string;
  action: string;
  label?: string;
  visitor_id: string;
  payload: TrackingPayload;
}

interface TrackingSyncBody {
  visitor_id: string;
  activities: ActivityItem[];
}

interface SyncPwaBody {
  is_pwa: boolean;
  has_installed: boolean;
  visitor_id: string;
}

function getApiOrigin(): string {
  const raw = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""
  ).trim();
  if (!raw) return "";
  return raw.replace(/\/+$/, "").replace(/\/api$/i, "");
}

const API_BASE = getApiOrigin();
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0";

const SYSTEM_TRACKED_KEY = "tb_system_tracked";
const PWA_INSTALLED_KEY = "pwa_installed";
const AUTH_CACHE_KEY = "totthobox_auth_user_cache";

const MAX_PAYLOAD_KEYS = 100;
const MAX_PAYLOAD_BYTES = 32 * 1024;
const MAX_SYNC_CHUNK = 100;
const MAX_REQUESTS_PER_MINUTE = 30;
const RATE_WINDOW_MS = 60_000;
const MEDIA_HEARTBEAT_INTERVAL_MS = 30_000;

const SENSITIVE_QUERY_PARAMS = new Set([
  "token",
  "code",
  "state",
  "password",
  "email",
  "otp",
  "access_token",
  "id_token",
  "refresh_token",
  "key",
  "secret",
  "signature",
  "session",
]);

const SENSITIVE_AUTH_PATHS = [
  "/auth/callback",
  "/auth/github/callback",
  "/reset-password",
  "/login",
];

const requestTimestamps: number[] = [];
const mediaHeartbeatTimestamps = new Map<string, number>();

let cachedAuthToken: string | null = null;
let cachedAuthTokenAt = 0;
let authTokenPromise: Promise<string | null> | null = null;
let isFlushingQueue = false;

function devDebug(message: string, detail?: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(`[Tracking] ${message}`, detail ?? "");
  }
}

function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isPreviewMode(): boolean {
  if (typeof document === "undefined") return false;
  try {
    return /(?:^|;\s*)(?:__prerender_bypass|__next_preview_data)=/.test(
      document.cookie,
    );
  } catch {
    return false;
  }
}

function canTrack(pathname?: string): boolean {
  if (typeof window === "undefined") return false;
  if (!API_BASE) return false;
  if (isBot() || isPreviewMode()) return false;
  if (pathname && isIgnoredRoute(pathname)) return false;
  if (!hasAnalyticsConsent()) return false;
  return true;
}

export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const standaloneMedia = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    const iosStandalone =
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    return standaloneMedia || iosStandalone;
  } catch {
    return false;
  }
}

export function hasInstalledPwa(): boolean {
  if (typeof window === "undefined") return false;
  if (isStandalonePwa()) return true;
  try {
    return window.localStorage.getItem(PWA_INSTALLED_KEY) === "true";
  } catch {
    return false;
  }
}

export function markPwaInstalled(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PWA_INSTALLED_KEY, "true");
  } catch {
    // Ignore storage errors
  }
}

/**
 * Strips sensitive auth/PII query parameters from URLs and referrers.
 */
export function sanitizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof window === "undefined") return "";
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    const isSensitivePath = SENSITIVE_AUTH_PATHS.some(
      (p) => parsed.pathname === p || parsed.pathname.startsWith(`${p}/`),
    );
    if (isSensitivePath) {
      parsed.search = "";
      parsed.hash = "";
      return parsed.toString();
    }

    const keysToDelete: string[] = [];
    parsed.searchParams.forEach((_, key) => {
      if (SENSITIVE_QUERY_PARAMS.has(key.toLowerCase())) {
        keysToDelete.push(key);
      }
    });
    for (const key of keysToDelete) {
      parsed.searchParams.delete(key);
    }
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function sanitizePayload(raw: TrackingPayload | undefined): TrackingPayload | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const entries = Object.entries(raw).slice(0, MAX_PAYLOAD_KEYS);
  const clean: TrackingPayload = {};
  for (const [k, v] of entries) {
    if (SENSITIVE_QUERY_PARAMS.has(k.toLowerCase())) continue;
    clean[k] = v;
  }
  try {
    const serialized = JSON.stringify(clean);
    if (serialized.length >= MAX_PAYLOAD_BYTES) {
      return null;
    }
  } catch {
    return null;
  }
  return clean;
}

function isLikelyLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.sessionStorage.getItem(AUTH_CACHE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { user?: unknown };
    return Boolean(parsed?.user);
  } catch {
    return false;
  }
}

async function getBearerToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!isLikelyLoggedIn()) {
    cachedAuthToken = null;
    return null;
  }

  const now = Date.now();
  if (cachedAuthToken && now - cachedAuthTokenAt < 60_000) {
    return cachedAuthToken;
  }
  if (authTokenPromise) return authTokenPromise;

  authTokenPromise = fetch("/api/auth/token", {
    method: "GET",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = (await res.json()) as { token?: unknown };
      const token =
        typeof data?.token === "string" && data.token.trim().length > 0
          ? data.token.trim()
          : null;
      cachedAuthToken = token;
      cachedAuthTokenAt = Date.now();
      return token;
    })
    .catch(() => null)
    .finally(() => {
      authTokenPromise = null;
    });

  return authTokenPromise;
}

export function clearCachedAuthToken(): void {
  cachedAuthToken = null;
  cachedAuthTokenAt = 0;
}

async function buildHeaders(includeAuth = true): Promise<Record<string, string>> {
  const visitorId = getVisitorId();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Visitor-Id": visitorId,
    "X-App-Mode": isStandalonePwa() ? "standalone" : "browser",
    "X-App-Version": APP_VERSION,
  };

  if (includeAuth) {
    const token = await getBearerToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

function isWithinRateLimit(): boolean {
  const now = Date.now();
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] >= RATE_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  requestTimestamps.push(now);
  return true;
}

function toActivityValue(payload: TrackingPayload): ActivityValue {
  try {
    const json = JSON.stringify(payload);
    if (json.length <= 4096) return payload;
    return json.slice(0, 4096);
  } catch {
    return null;
  }
}

async function sendWithRetry(
  url: string,
  body: TrackingEventBody,
  keepalive: boolean,
): Promise<void> {
  const retryDelays = [1000, 3000];
  const headers = await buildHeaders(!keepalive);

  for (let attempt = 0; attempt <= retryDelays.length; attempt += 1) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        keepalive,
      });

      if (res.status === 200) {
        return;
      }
      if (res.status === 413) {
        devDebug("Dropped 413 payload too large", { category: body.category, action: body.action });
        return;
      }
      if (res.status === 422) {
        devDebug("Dropped 422 validation error", { category: body.category, action: body.action });
        return;
      }
      if (res.status >= 500 && !keepalive && attempt < retryDelays.length) {
        await new Promise((r) => setTimeout(r, retryDelays[attempt]));
        continue;
      }

      if (res.status >= 500) {
        enqueueActivity({
          id: body.event_uuid,
          type: body.category,
          key: body.action,
          value: toActivityValue(body.payload),
          timestamp: Date.now(),
        });
      }
      return;
    } catch (err) {
      if (!keepalive && attempt < retryDelays.length) {
        await new Promise((r) => setTimeout(r, retryDelays[attempt]));
        continue;
      }
      devDebug("Tracking event failed, buffering offline", err);
      enqueueActivity({
        id: body.event_uuid,
        type: body.category,
        key: body.action,
        value: toActivityValue(body.payload),
        timestamp: Date.now(),
      });
      return;
    }
  }
}

export async function trackEvent(input: TrackEventInput): Promise<void> {
  try {
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : undefined;
    if (!canTrack(pathname)) return;

    const cleanPayload = sanitizePayload(input.payload);
    if (!cleanPayload) {
      devDebug("Dropped oversized payload (>= 32KB)", input);
      return;
    }

    const visitorId = getVisitorId();
    if (!visitorId) return;

    const eventUuid = input.eventUuid || generateUuidV4();
    const category = input.category.trim().slice(0, 50);
    const action = input.action.trim().slice(0, 50);
    const label = input.label ? input.label.trim().slice(0, 100) : undefined;

    if (!category || !action) return;

    const body: TrackingEventBody = {
      event_uuid: eventUuid,
      category,
      action,
      ...(label ? { label } : {}),
      visitor_id: visitorId,
      payload: cleanPayload,
    };

    if (
      (typeof navigator !== "undefined" && navigator.onLine === false) ||
      (!input.keepalive && !isWithinRateLimit())
    ) {
      enqueueActivity({
        id: eventUuid,
        type: category,
        key: action,
        value: toActivityValue(cleanPayload),
        timestamp: Date.now(),
      });
      return;
    }

    await sendWithRetry(
      `${API_BASE}/api/tracking/event`,
      body,
      Boolean(input.keepalive),
    );
  } catch (err) {
    devDebug("trackEvent error", err);
  }
}

export interface TrackPageViewOptions {
  routeName?: string;
  isSpaNavigation?: boolean;
  transitionMs?: number;
}

function measureInitialLoadTimeMs(): number {
  if (typeof window === "undefined" || typeof performance === "undefined") {
    return 0;
  }
  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav && nav.loadEventEnd > 0) {
      const ms = Math.round(nav.loadEventEnd - nav.startTime);
      return ms >= 0 && ms < 60_000 ? ms : 0;
    }
    const nowMs = Math.round(performance.now());
    return nowMs >= 0 && nowMs < 60_000 ? nowMs : 0;
  } catch {
    return 0;
  }
}

export function trackPageView(
  pathname: string,
  options: TrackPageViewOptions = {},
): { sanitizedUrl: string } {
  if (!canTrack(pathname)) return { sanitizedUrl: "" };

  const sanitizedUrl = sanitizeUrl(window.location.href);
  const sanitizedReferrer = sanitizeUrl(document.referrer || "");
  const searchParams = new URLSearchParams(window.location.search);

  let loadTimeMs = 0;
  if (options.isSpaNavigation) {
    const raw = Math.round(options.transitionMs ?? 0);
    loadTimeMs = Number.isFinite(raw) && raw >= 0 && raw < 60_000 ? raw : 0;
  } else {
    loadTimeMs = measureInitialLoadTimeMs();
  }

  const payload: PageViewPayload = {
    url: sanitizedUrl,
    path: pathname,
    title: document.title || "",
    referrer: sanitizedReferrer,
    ...(options.routeName ? { route_name: options.routeName } : {}),
    load_time_ms: loadTimeMs,
    is_pwa: isStandalonePwa(),
    utm_source: searchParams.get("utm_source"),
    utm_medium: searchParams.get("utm_medium"),
    utm_campaign: searchParams.get("utm_campaign"),
  };

  void trackEvent({
    category: "page",
    action: "view",
    payload: payload as unknown as TrackingPayload,
  });

  return { sanitizedUrl };
}

export function trackPageLeave(url: string, durationMs: number): void {
  if (!canTrack()) return;
  const rounded = Math.round(durationMs);
  if (!url || !Number.isFinite(rounded) || rounded <= 0) return;

  const payload: PageLeavePayload = {
    url,
    duration_ms: rounded,
  };

  void trackEvent({
    category: "page",
    action: "leave",
    payload: payload as unknown as TrackingPayload,
    keepalive: true,
  });
}

export function trackSystem(): void {
  if (!canTrack()) return;
  try {
    if (window.sessionStorage.getItem(SYSTEM_TRACKED_KEY) === "1") return;
    window.sessionStorage.setItem(SYSTEM_TRACKED_KEY, "1");
  } catch {
    // Proceed once if sessionStorage is unavailable
  }

  const payload: SystemPayload = {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka",
    screen_res: `${Math.max(0, Math.round(window.screen.width))}x${Math.max(0, Math.round(window.screen.height))}`,
    app_version: APP_VERSION,
  };

  void trackEvent({
    category: "system",
    action: "session_start",
    payload: payload as unknown as TrackingPayload,
  });
}

export async function syncPwa(installedOverride?: boolean): Promise<void> {
  try {
    if (!canTrack()) return;
    if (installedOverride) {
      markPwaInstalled();
    }
    const visitorId = getVisitorId();
    if (!visitorId) return;

    const body: SyncPwaBody = {
      is_pwa: isStandalonePwa(),
      has_installed: Boolean(installedOverride) || hasInstalledPwa(),
      visitor_id: visitorId,
    };

    const headers = await buildHeaders(true);
    await fetch(`${API_BASE}/api/tracking/sync-pwa`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch (err) {
    devDebug("syncPwa error", err);
  }
}

export async function flushQueue(): Promise<void> {
  if (isFlushingQueue) return;
  if (!canTrack()) return;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;

  const items = readQueue();
  if (items.length === 0) return;

  isFlushingQueue = true;
  try {
    const visitorId = getVisitorId();
    if (!visitorId) return;
    const headers = await buildHeaders(true);

    for (let i = 0; i < items.length; i += MAX_SYNC_CHUNK) {
      const chunk = items.slice(i, i + MAX_SYNC_CHUNK);
      const body: TrackingSyncBody = {
        visitor_id: visitorId,
        activities: chunk,
      };

      const res = await fetch(`${API_BASE}/api/tracking/sync`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        keepalive: true,
      });

      if (!res.ok) {
        if (res.status >= 500) break;
        continue;
      }

      const data = (await res.json().catch(() => null)) as {
        status?: unknown;
      } | null;
      if (data?.status === "success") {
        removeQueuedIds(chunk.map((item) => item.id));
      }
    }
  } catch (err) {
    devDebug("flushQueue error", err);
  } finally {
    isFlushingQueue = false;
  }
}

export function trackMediaHeartbeat(channelSlug: string): void {
  if (!channelSlug || !canTrack()) return;
  const now = Date.now();
  const last = mediaHeartbeatTimestamps.get(channelSlug) ?? 0;
  if (now - last < MEDIA_HEARTBEAT_INTERVAL_MS) return;
  mediaHeartbeatTimestamps.set(channelSlug, now);

  void trackEvent({
    category: "media",
    action: "heartbeat",
    label: channelSlug,
    payload: { channel: channelSlug },
  });
}
