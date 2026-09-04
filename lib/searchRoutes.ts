import type { SearchItem } from "@/types/search";

const SEARCH_ROUTES: Record<string, (item: SearchItem) => string> = {
  // Bangladesh
  tourism: (item) => `/bangladesh/tourism/${item._search_slug}`,
  introduction: (item) => `/bangladesh/introduction/${item._search_slug}`,
  establishment: (item) => `/bangladesh/establishment/${item._search_slug}`,
  person: (item) => `/bangladesh/public-figure/${item._search_slug}`,
  history: (item) => `/bangladesh/history/${item._search_slug}`,

  // Islam
  islam: (item) => `/islam/basic/${item._search_slug}`,
  dowa: (item) => `/islam/dowan/${item._search_slug}`,

  // Holiday
  holiday: (item) => `/bangla/holiday/${item._search_slug}`,

  // Signs
  sign: (item) => {
    const category = item._search_extra?.category;
    if (category) return `/signs/${category}`;
    return `/signs`;
  },
};

export function getSearchUrl(item: SearchItem): string {
  const type = item._search_type || "";
  const builder = SEARCH_ROUTES[type];
  if (builder) return builder(item);
  return item._search_url && item._search_url !== "#" ? item._search_url : "/";
}