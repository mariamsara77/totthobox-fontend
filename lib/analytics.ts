declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * 32 European Economic Area (EEA) + UK (GB) + Switzerland (CH) country codes
 * requiring explicit opt-in consent for analytics and tracking.
 */
export const EEA_UK_CH_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO",
  "GB", "CH",
]);

export function isEeaCountry(countryCode: string | null | undefined): boolean {
  if (!countryCode) return false;
  return EEA_UK_CH_COUNTRIES.has(countryCode.trim().toUpperCase());
}

export function getClientCountry(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const match = document.cookie.match(/(?:^|;\s*)tb_country=([A-Z]{2})/i);
    if (match?.[1]) return match[1].toUpperCase();
  } catch {}

  try {
    const sessionCountry = window.sessionStorage.getItem("tb_country");
    if (sessionCountry) return sessionCountry.toUpperCase();
  } catch {}

  return null;
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;

  // Respect Do-Not-Track
  if (
    navigator.doNotTrack === "1" ||
    (window as unknown as { doNotTrack?: string }).doNotTrack === "1"
  ) {
    return false;
  }

  // 1. Saved visitor choice overrides defaults
  try {
    const raw = window.localStorage.getItem("cookie_consent");
    if (raw) {
      const saved = JSON.parse(raw) as Record<string, unknown>;
      if (typeof saved.analytics === "boolean") {
        return saved.analytics === true;
      }
    }
  } catch {}

  // 2. No saved choice: check region
  // EEA, UK and Switzerland are denied by default (must opt-in)
  const country = getClientCountry();
  if (country && isEeaCountry(country)) {
    return false;
  }

  // All other regions and unknown country are granted by default
  return true;
}

/**
 * Checks if current user-agent is a known bot, crawler, or automated runner.
 */
export function isBot(): boolean {
  if (typeof window === "undefined" || !navigator) return true;
  const ua = navigator.userAgent || "";
  return (
    /bot|crawler|spider|slurp|lighthouse|headlesschrome|headless/i.test(ua) ||
    Boolean(navigator.webdriver)
  );
}

/**
 * Checks if a route should be ignored for analytics tracking.
 */
export function isIgnoredRoute(path: string | null | undefined): boolean {
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

/**
 * Strips sensitive query params and auth callback query strings before analytics push.
 */
export function sanitizeAnalyticsUrl(rawUrl: string): string {
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
    const toDelete: string[] = [];
    parsed.searchParams.forEach((_, k) => {
      if (SENSITIVE_QUERY_PARAMS.has(k.toLowerCase())) {
        toDelete.push(k);
      }
    });
    for (const k of toDelete) {
      parsed.searchParams.delete(k);
    }
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "";
  }
}

/**
 * Push arbitrary analytics event to window.dataLayer safely.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || isBot()) return;
  if (!hasAnalyticsConsent()) return;
  const pathname = window.location.pathname;
  if (isIgnoredRoute(pathname)) return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: name,
      ...params,
    });
  } catch {
    // Fail silently
  }
}

/**
 * Track when a user interacts with a tool.
 */
export function trackToolUsed(toolName: string, extra: Record<string, unknown> = {}): void {
  trackEvent("tool_used", {
    tool_name: toolName,
    ...extra,
  });
}

/**
 * Track when a user interacts with a converter.
 */
export function trackConverterUsed(converterName: string, extra: Record<string, unknown> = {}): void {
  trackEvent("converter_used", {
    converter_name: converterName,
    ...extra,
  });
}

/**
 * Track search queries and result count.
 */
export function trackSearch(query: string, resultCount?: number): void {
  if (!query.trim()) return;
  trackEvent("search", {
    search_term: query.trim(),
    result_count: resultCount ?? 0,
  });
}

/**
 * Track outbound clicks to external sites.
 */
export function trackOutboundClick(url: string, targetType?: string): void {
  trackEvent("outbound_click", {
    destination: url,
    target_type: targetType ?? "external",
  });
}

/**
 * Track infinite scroll pagination loads.
 */
export function trackInfiniteScrollLoad(feedType: string, pageNumber: number): void {
  trackEvent("infinite_scroll_load", {
    feed_type: feedType,
    page_number: pageNumber,
  });
}

/**
 * Track sharing actions.
 */
export function trackShare(method: string, contentTitle?: string): void {
  trackEvent("share", {
    method,
    title: contentTitle ?? (typeof document !== "undefined" ? document.title : ""),
  });
}

/**
 * Track 404 page impressions.
 */
export function track404View(path: string): void {
  trackEvent("404_view", {
    requested_path: path,
  });
}

/**
 * Track contact clicks (phone, email, emergency helpline).
 */
export function trackContactClick(contactType: string, detail?: string): void {
  trackEvent("contact_click", {
    contact_type: contactType,
    detail: detail ?? "",
  });
}
