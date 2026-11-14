# SEO Changelog - Search Console Optimization Pass

Date: 2026-11-14
Pass: Search Console Optimization Pass
Rules: Additive only, no invented facts, preserved existing content, titles <= 60 chars, descriptions 120-160 chars.

---

## GROUP 1: /international/country/[slug] (250 country encyclopedia pages)

- **Pages Affected**: `/international/country/[slug]` (All ~250 dynamic routes, e.g., `/international/country/bangladesh`, `/international/country/united-states`, `/international/country/india`, etc.)
- **Date**: 2026-11-14
- **Before Title**: `{দেশ} ({English Name}) - রাজধানী, জনসংখ্যা, আয়তন, মানচিত্র ও বিস্তারিত তথ্য | Totthobox` (often > 75 chars)
- **After Title**: `{দেশ}-এর আয়তন কত? জনসংখ্যা, রাজধানী ও মহাদেশ` (dynamically shortened to `{দেশ}-এর আয়তন কত? জনসংখ্যা ও রাজধানী` if > 60 chars; guaranteed <= 60 chars)
- **Before Description**: Verbose text without strict length bounds, missing targeted question-answering keywords.
- **After Description**: `{দেশ}-এর মোট আয়তন {area}, জনসংখ্যা প্রায় {population}, রাজধানী {capital}, মহাদেশ {continent}। বিস্তারিত ভৌগোলিক অবস্থান, মানচিত্র ও তথ্য জানুন তথ্যবক্সে।` (120-160 chars, verified on data)
- **Added Blocks**:
  1. Server-rendered **"দ্রুত তথ্য"** section directly beneath the H1 hero card featuring dedicated H2 headings matching exact Search Console queries:
     - H2: `{দেশ}-এর আয়তন কত?` (First sentence direct answer in km² & sq miles + context)
     - H2: `{দেশ}-এর জনসংখ্যা কত?` (First sentence direct answer + density)
     - H2: `{দেশ} কোন মহাদেশে অবস্থিত?` (First sentence direct answer + region, status, maritime/borders)
     - H2: `{দেশ}-এর রাজধানীর নাম কী?` (First sentence direct answer + administrative role)
  2. **Related internal links**: 3-4 genuinely related country links (immediate neighbors or countries within the same continent, not global block).
  3. **FAQPage JSON-LD**: Directly populated with the exact Q&A pairs from data and validated schema output.
- **Notes**: All existing 600+ word overview, mega stats, maps, codes, timezones, currencies, and FAQs retained without deletion. Population "As of" year omitted as database does not contain population year timestamps.

---
