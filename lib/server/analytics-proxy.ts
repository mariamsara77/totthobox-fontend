import { NextRequest, NextResponse } from "next/server";

/**
 * ============================================================================
 * ANALYTICS UPSTREAM PROXY & FALLBACK ENGINE
 * ============================================================================
 * 
 * Capability-aware proxy that routes client analytics telemetry to the
 * appropriate Laravel backend endpoints.
 * 
 * 1. MODERN FIRST: Tries the dedicated modern REST endpoints first:
 *    - POST /api/analytics/pageview
 *    - POST /api/analytics/heartbeat
 *    - GET  /api/analytics/stats
 * 
 * 2. 10-MINUTE CAPABILITY CACHE: Caches whether an endpoint is modern or
 *    requires legacy fallback in-memory for 10 minutes. When 404/405 is returned,
 *    it flags that route as fallback-needed and caches that decision.
 * 
 * 3. FALLBACK TO WORKING ENDPOINTS:
 *    - /api/analytics/pageview  -> /api/tracking/event
 *    - /api/analytics/heartbeat -> /api/tracking/event (+ /api/tracking/sync-pwa)
 *    - /api/analytics/stats     -> /api/analytics/user-count
 * 
 * 4. CLIENT IP & HEADERS:
 *    Forwards client's real IP (X-Forwarded-For, X-Real-IP) and User-Agent so
 *    Laravel rate limiting (throttle:120,1) and visitor uniqueness work accurately.
 * 
 * 5. DEV vs PROD BEHAVIOR:
 *    - In Development: Returns real backend status & body + 'x-tracking-upstream' header.
 *    - In Production: Returns 200/204 without leaking internal errors.
 *                     Rate-limited console.error for backend failures.
 * 
 * TO REMOVE FALLBACK IN THE FUTURE:
 * Once the Laravel backend implements /api/analytics/pageview, /heartbeat, and /stats:
 * Simply set `FORCE_MODERN_ONLY = true` or remove the fallback branches in this file.
 */

const LARAVEL_API =
  process.env.LARAVEL_API_URL || "https://admin.totthobox.com/api";

const REQUEST_TIMEOUT_MS = 3500; // Short 3.5s timeout to keep proxy lightweight
const CAPABILITY_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Toggle to disable fallbacks once backend implements new endpoints
const FORCE_MODERN_ONLY = false;

type CapabilityStatus = "modern" | "fallback";

interface CacheEntry {
  status: CapabilityStatus;
  expiresAt: number;
}

const capabilityCache = new Map<string, CacheEntry>();

let lastErrorLogTime = 0;
const ERROR_LOG_INTERVAL_MS = 60 * 1000; // At most once per minute in prod

function logUpstreamErrorRateLimited(message: string, error?: unknown): void {
  const now = Date.now();
  if (now - lastErrorLogTime >= ERROR_LOG_INTERVAL_MS) {
    lastErrorLogTime = now;
    console.error(`[Analytics Proxy Error] ${message}`, error ?? "");
  }
}

export function getClientHeaders(
  req: NextRequest,
  visitorId?: string | null,
): Record<string, string> {
  const clientIp =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1";

  const userAgent = req.headers.get("user-agent") || "TotthoboxFrontend/1.0";
  const referer = req.headers.get("referer");
  const resolvedVisitorId =
    visitorId?.trim() || req.headers.get("x-visitor-id")?.trim() || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": userAgent,
    "CF-Connecting-IP": clientIp,
    "X-Forwarded-For": clientIp,
    "X-Real-IP": clientIp,
  };

  if (resolvedVisitorId) {
    headers["X-Visitor-Id"] = resolvedVisitorId;
  }

  if (referer) {
    headers.Referer = referer;
  }

  return headers;
}

export function isBotOrIgnored(req: NextRequest, path?: string | null): boolean {
  const ua = req.headers.get("user-agent") || "";
  if (/bot|crawler|spider|slurp|lighthouse|headlesschrome|headless/i.test(ua)) {
    return true;
  }
  if (!path) return false;
  return (
    path === "/offline" ||
    path.startsWith("/offline/") ||
    path === "/auth" ||
    path.startsWith("/auth/") ||
    path === "/settings" ||
    path.startsWith("/settings/") ||
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path === "/preview" ||
    path.startsWith("/preview/")
  );
}

function getCapability(endpointKey: string): CapabilityStatus | null {
  if (FORCE_MODERN_ONLY) return "modern";
  const entry = capabilityCache.get(endpointKey);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    capabilityCache.delete(endpointKey);
    return null;
  }
  return entry.status;
}

function setCapability(endpointKey: string, status: CapabilityStatus): void {
  capabilityCache.set(endpointKey, {
    status,
    expiresAt: Date.now() + CAPABILITY_CACHE_TTL_MS,
  });
}

// ---------------------------------------------------------------------------
// 1. PAGEVIEW PROXY
// ---------------------------------------------------------------------------

export async function proxyPageView(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const {
      visitor_id,
      session_id,
      is_first_visit,
      is_pwa,
      has_installed,
      referrer,
      path,
      url,
      title,
      utm_source,
      utm_medium,
      utm_campaign,
      load_time_ms,
      screen_res,
      timezone,
      device_type,
      language,
      timestamp,
    } = body as Record<string, unknown>;

    const currentPath =
      typeof path === "string" && path.trim().length > 0 ? path : "/";

    if (isBotOrIgnored(req, currentPath)) {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const fullUrl =
      typeof url === "string" && url.trim().length > 0
        ? url
        : `${req.nextUrl.origin}${currentPath}`;

    const headers = getClientHeaders(
      req,
      typeof visitor_id === "string" ? visitor_id : null,
    );
    const isDev = process.env.NODE_ENV !== "production";
    const cachedCapability = getCapability("pageview");

    // Try modern endpoint if capability is modern or unknown
    if (cachedCapability !== "fallback") {
      const modernUrl = `${LARAVEL_API}/analytics/pageview`;
      try {
        const modernRes = await fetch(modernUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            visitor_id: String(visitor_id || "vis_anonymous"),
            session_id: String(session_id || "ses_anonymous"),
            is_first_visit: Boolean(is_first_visit),
            is_pwa: Boolean(is_pwa),
            has_installed: Boolean(has_installed),
            referrer: referrer || "",
            path: currentPath,
            url: fullUrl,
            title: title || "",
            utm_source: utm_source || null,
            utm_medium: utm_medium || null,
            utm_campaign: utm_campaign || null,
            load_time_ms: Number(load_time_ms) || 0,
            screen_res: screen_res || "",
            timezone: timezone || "Asia/Dhaka",
            device_type: device_type || "desktop",
            language: language || "bn",
            timestamp: Number(timestamp) || Date.now(),
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (modernRes.status === 404 || modernRes.status === 405) {
          // Backend doesn't support modern route yet -> flag fallback
          setCapability("pageview", "fallback");
        } else {
          // Backend responded (success or non-404) -> mark modern
          setCapability("pageview", "modern");
          const modernData = await modernRes.json().catch(() => null);
          if (isDev) {
            return NextResponse.json(modernData ?? { status: "ok" }, {
              status: modernRes.status,
              headers: { "x-tracking-upstream": modernUrl },
            });
          }
          return NextResponse.json({ status: "ok" }, { status: 200 });
        }
      } catch (err) {
        // Network or timeout on modern route -> try fallback
        logUpstreamErrorRateLimited("Modern pageview attempt failed", err);
      }
    }

    // --- FALLBACK ROUTE: /api/tracking/event ---
    const fallbackUrl = `${LARAVEL_API}/tracking/event`;
    const fallbackPayload = {
      category: "page",
      action: "view",
      js_visitor_id: String(visitor_id || "vis_anonymous"),
      session_id: String(session_id || "ses_anonymous"),
      payload: {
        path: currentPath,
        url: fullUrl,
        title: title || null,
        referrer: referrer || null,
        is_pwa: Boolean(is_pwa),
        has_installed: Boolean(has_installed),
        is_first_visit: Boolean(is_first_visit),
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        load_time_ms: Number(load_time_ms) || 0,
        screen_res: screen_res || null,
        timezone: timezone || null,
        device_type: device_type || "desktop",
        language: language || "bn",
      },
    };

    const res = await fetch(fallbackUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(fallbackPayload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const data = await res.json().catch(() => null);

    if (isDev) {
      return NextResponse.json(data ?? { status: "ok" }, {
        status: res.status,
        headers: { "x-tracking-upstream": fallbackUrl },
      });
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    logUpstreamErrorRateLimited("Pageview proxy failure", error);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 502 },
      );
    }
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }
}

// ---------------------------------------------------------------------------
// 2. HEARTBEAT PROXY
// ---------------------------------------------------------------------------

export async function proxyHeartbeat(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const {
      visitor_id,
      session_id,
      path,
      url,
      is_pwa,
      has_installed,
      timestamp,
    } = body as Record<string, unknown>;

    const currentPath =
      typeof path === "string" && path.trim().length > 0 ? path : "/";

    if (isBotOrIgnored(req, currentPath)) {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const fullUrl =
      typeof url === "string" && url.trim().length > 0
        ? url
        : `${req.nextUrl.origin}${currentPath}`;

    const headers = getClientHeaders(
      req,
      typeof visitor_id === "string" ? visitor_id : null,
    );
    const isDev = process.env.NODE_ENV !== "production";
    const cachedCapability = getCapability("heartbeat");

    // Try modern endpoint if capability is modern or unknown
    if (cachedCapability !== "fallback") {
      const modernUrl = `${LARAVEL_API}/analytics/heartbeat`;
      try {
        const modernRes = await fetch(modernUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            visitor_id: String(visitor_id || "vis_anonymous"),
            session_id: String(session_id || "ses_anonymous"),
            path: currentPath,
            url: fullUrl,
            is_pwa: Boolean(is_pwa),
            has_installed: Boolean(has_installed),
            timestamp: Number(timestamp) || Date.now(),
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (modernRes.status === 404 || modernRes.status === 405) {
          setCapability("heartbeat", "fallback");
        } else {
          setCapability("heartbeat", "modern");
          const modernData = await modernRes.json().catch(() => null);
          if (isDev) {
            return NextResponse.json(modernData ?? { status: "ok" }, {
              status: modernRes.status,
              headers: { "x-tracking-upstream": modernUrl },
            });
          }
          return NextResponse.json({ status: "ok" }, { status: 200 });
        }
      } catch (err) {
        logUpstreamErrorRateLimited("Modern heartbeat attempt failed", err);
      }
    }

    // --- FALLBACK ROUTE: /api/tracking/event (+ /api/tracking/sync-pwa) ---
    const fallbackUrl = `${LARAVEL_API}/tracking/event`;
    const fallbackPayload = {
      category: "heartbeat",
      action: "ping",
      js_visitor_id: String(visitor_id || "vis_anonymous"),
      session_id: String(session_id || "ses_anonymous"),
      payload: {
        path: currentPath,
        url: fullUrl,
        is_pwa: Boolean(is_pwa),
        has_installed: Boolean(has_installed),
        timestamp: Number(timestamp) || Date.now(),
      },
    };

    const res = await fetch(fallbackUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(fallbackPayload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    // Also sync PWA state if PWA mode is active
    if (Boolean(is_pwa) || Boolean(has_installed)) {
      void fetch(`${LARAVEL_API}/tracking/sync-pwa`, {
        method: "POST",
        headers: {
          ...headers,
          "X-App-Mode": Boolean(is_pwa) ? "standalone" : "browser",
        },
        body: JSON.stringify({
          is_pwa: Boolean(is_pwa),
          has_installed: Boolean(has_installed),
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }).catch(() => null);
    }

    const data = await res.json().catch(() => null);

    if (isDev) {
      return NextResponse.json(data ?? { status: "ok" }, {
        status: res.status,
        headers: { "x-tracking-upstream": fallbackUrl },
      });
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    logUpstreamErrorRateLimited("Heartbeat proxy failure", error);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 502 },
      );
    }
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }
}

// ---------------------------------------------------------------------------
// 3. STATS PROXY
// ---------------------------------------------------------------------------

export async function proxyStats(): Promise<NextResponse> {
  const isDev = process.env.NODE_ENV !== "production";
  const cachedCapability = getCapability("stats");

  // Try modern endpoint if capability is modern or unknown
  if (cachedCapability !== "fallback") {
    const modernUrl = `${LARAVEL_API}/analytics/stats`;
    try {
      const modernRes = await fetch(modernUrl, {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (modernRes.status === 404 || modernRes.status === 405) {
        setCapability("stats", "fallback");
      } else {
        setCapability("stats", "modern");
        const modernData = await modernRes.json().catch(() => null);
        const cacheHeaders = {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        };
        if (isDev) {
          return NextResponse.json(modernData ?? { status: "ok" }, {
            status: modernRes.status,
            headers: { ...cacheHeaders, "x-tracking-upstream": modernUrl },
          });
        }
        return NextResponse.json(modernData, {
          status: modernRes.status,
          headers: cacheHeaders,
        });
      }
    } catch (err) {
      logUpstreamErrorRateLimited("Modern stats attempt failed", err);
    }
  }

  // --- FALLBACK ROUTE: /api/analytics/user-count ---
  const fallbackUrl = `${LARAVEL_API}/analytics/user-count`;
  try {
    const res = await fetch(fallbackUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (isDev) {
        return NextResponse.json(
          data ?? { error: "Backend /analytics/user-count failed" },
          {
            status: res.status,
            headers: { "x-tracking-upstream": fallbackUrl },
          },
        );
      }
      return NextResponse.json(
        { status: "success", data: { total: null, online: null } },
        { status: 200 },
      );
    }

    const fallbackCacheHeaders = {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    };
    if (isDev) {
      return NextResponse.json(data, {
        status: res.status,
        headers: { ...fallbackCacheHeaders, "x-tracking-upstream": fallbackUrl },
      });
    }

    return NextResponse.json(data, {
      status: res.status,
      headers: fallbackCacheHeaders,
    });
  } catch (error) {
    logUpstreamErrorRateLimited("Stats fallback fetch failure", error);
    if (isDev) {
      return NextResponse.json(
        { error: (error as Error).message },
        {
          status: 502,
          headers: { "x-tracking-upstream": fallbackUrl },
        },
      );
    }
    return NextResponse.json(
      { status: "success", data: { total: null, online: null } },
      { status: 200 },
    );
  }
}
