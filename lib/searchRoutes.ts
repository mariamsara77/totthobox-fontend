import type { SearchItem } from "@/types/search";

const SEARCH_ROUTES: Record<string, (item: SearchItem) => string> = {
  // Bangladesh Content
  tourism: (item) => `/bangladesh/tourism/${item._search_slug}`,
  introduction: (item) => `/bangladesh/introduction/${item._search_slug}`,
  establishment: (item) => `/bangladesh/establishment/${item._search_slug}`,
  person: (item) => `/bangladesh/public-figure/${item._search_slug}`,
  history: (item) => `/bangladesh/history/${item._search_slug}`,

  // International Content
  country: (item) => `/international/country/${item._search_slug}`,
  dialing_code: (item) => `/international/dialing-code/${item._search_slug}`,
  "dialing-code": (item) => `/international/dialing-code/${item._search_slug}`,
  world_clock: (item) => `/international/world-clock/${item._search_slug}`,
  "world-clock": (item) => `/international/world-clock/${item._search_slug}`,
  forex: (item) => `/international/forex/${item._search_slug}`,

  // Contact & Emergency
  contact: (item) => `/contact/${item._search_slug}`,
  emergency: (item) => `/contact/${item._search_slug}`,

  // Islam
  islam: (item) => `/islam/basic/${item._search_slug}`,
  dowa: (item) => `/islam/dowan/${item._search_slug}`,

  // Bangla Calendar & Holidays
  holiday: (item) => `/bangla/holiday/${item._search_slug}`,
  calendar: () => `/bangla/calendar`,

  // Software & Fonts
  software: (item) => `/software/${item._search_slug}`,
  font: (item) => `/software/${item._search_slug}`,

  // News
  news: (item) => `/news/${item._search_slug}`,

  // Signs & Language
  sign: (item) => {
    const category = item._search_extra?.category;
    if (category) return `/signs/${category}`;
    return `/signs`;
  },

  // Tools & Converters
  tool: (item) => item._search_url || `/tools/${item._search_slug}`,
  converter: (item) => item._search_url || `/converter/${item._search_slug}`,
  service: (item) => item._search_url || "/",
};

export function getSearchUrl(item: SearchItem): string {
  const type = item._search_type || "";
  const builder = SEARCH_ROUTES[type];
  if (builder) return builder(item);

  if (item._search_url && item._search_url !== "#") {
    // Strip host domain if internal to enable Next.js client-side router navigation
    try {
      if (
        item._search_url.startsWith("https://totthobox.com") ||
        item._search_url.startsWith("http://totthobox.com")
      ) {
        const parsed = new URL(item._search_url);
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      // ignore
    }
    return item._search_url;
  }
  return "/";
}
