declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
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
    path.startsWith("/settings/")
  );
}

/**
 * Push arbitrary analytics event to window.dataLayer safely.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || isBot()) return;
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
 * Track file or data download clicks.
 */
export function trackDownload(filename: string, fileType?: string): void {
  trackEvent("download_click", {
    filename,
    file_type: fileType ?? "unknown",
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
