/**
 * Central Cache Configuration for Totthobox
 * Controls ISR revalidation windows and Cache Tags for on-demand revalidation.
 */

export const CACHE_TTL = {
  // Static database-driven content: 24 hours (86,400s)
  // History, tourism, establishment, islam, signs, holidays, countries, software
  STATIC_CONTENT: 86400,

  // Static editorial & policy pages: 24 hours
  EDITORIAL_PAGES: 86400,

  // News headlines: exactly 1 hour (3,600s)
  NEWS_HEADLINES: 3600,

  // High-frequency volatile data: 60s
  CRYPTO_FOREX: 60,

  // Search autocomplete & metadata: 30 minutes
  SEARCH_META: 1800,
} as const;

export const CACHE_TAGS = {
  HOLIDAY: "holiday",
  ESTABLISHMENT: "establishment",
  HISTORY: "history",
  INTRODUCTION: "introduction",
  PUBLIC_FIGURE: "public-figure",
  TOURISM: "tourism",
  ISLAM_BASIC: "islam-basic",
  ISLAM_DOWAN: "islam-dowan",
  SIGNS: "signs",
  COUNTRIES: "countries",
  SOFTWARE: "software",
  CONTACTS: "contacts",
  NEWS: "news",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
