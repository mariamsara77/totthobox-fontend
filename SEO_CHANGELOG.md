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

## GROUP 2: Land Converter, Percentage Calculator, Number to Word

### 1. Land Converter (`/converter/land`)
- **Page Affected**: `/converter/land`
- **Date**: 2026-11-14
- **Before Title**: `জমি পরিমাপ ক্যালকুলেটর - শতাংশ, কাঠা, বিঘা কনভার্টার | Totthobox` (65 chars)
- **After Title**: `শতাংশ থেকে কাঠা ও বিঘা হিসাব ক্যালকুলেটর` (39 chars, <= 60 chars)
- **Before Description**: `সহজেই শতাংশ, কাঠা, বিঘা, স্কয়ার ফিট ও একর কনভার্ট করুন। Totthobox-এর নিখুঁত Land Area Converter ও বিস্তারিত ভূমি পরিমাপ নির্দেশিকা।` (128 chars)
- **After Description**: `৪ শতাংশ কত কাঠা বা ২০ শতাংশ কত কাঠা? ১ শতাংশ = ০.৬০৫ কাঠা ও ১ বিঘা = ২০ কাঠা হিসেবে শতাংশ থেকে কাঠা ও কাঠা থেকে শতাংশ রূপান্তরের পূর্ণাঙ্গ চার্ট ও হিসাব দেখুন।` (158 chars)
- **Added Blocks**:
  1. H2 quick-answer sections for top ~10 common queries ("৪ শতাংশ কত কাঠা?", "২০ শতাংশ কত কাঠা?", etc.) with exact worked mathematical breakdown based on repo constants (1 shotangsho = 435.6 sq ft, 1 katha = 720 sq ft, ratio = 0.605).
  2. Server-rendered 1-100 "শতাংশ থেকে কাঠা" conversion chart, with per-row anchors (`#shotangsho-1` to `#shotangsho-100`).
  3. Mini charts: "কাঠা থেকে শতাংশ" (anchors `#katha-N`) and "বিঘা থেকে কাঠা" (anchors `#bigha-N`).
  4. Regional variation notice clarifying local customs vs government land registry standard (720 sq ft katha).

### 2. Percentage Tool (`/tools/percentage-calculator`)
- **Page Affected**: `/tools/percentage-calculator`
- **Date**: 2026-11-14
- **Before Title**: `পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব | তথ্যবক্স` (56 chars)
- **After Title**: `কত পারসেন্ট কীভাবে বের করবেন - শতকরা হিসাব ক্যালকুলেটর` (53 chars, <= 60 chars)
- **Before Description**: `সহজ বাংলায় পার্সেন্টেজ ক্যালকুলেটর। কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মার্জিন ও পার্থক্য — সূত্র ও ব্যাখ্যাসহ তাৎক্ষণিক ফলাফল। রেজিস্ট্রেশন লাগবে না।` (156 chars)
- **After Description**: `কত পারসেন্ট কীভাবে বের করবেন? X টাকার Y% কত, প্রাপ্ত নম্বরের শতকরা হার ও ডিসকাউন্ট নির্ণয়ের সহজ সূত্র ও উদাহরণসহ হিসাব করুন তথ্যবক্স ক্যালকুলেটরে।` (152 chars)
- **Added Blocks**:
  1. Direct-answer block: "কত পারসেন্ট কীভাবে বের করবেন: সহজ গাইড ও সূত্র".
  2. 3 verified worked examples with arithmetic checked in code:
     - Example 1: `X টাকার Y% কত?` (৫,০০০ টাকার ১৫% = ৭৫০ টাকা)
     - Example 2: `প্রাপ্ত নম্বরের শতকরা হার` (৮০০ তে ৬০০ = ৭৫%)
     - Example 3: `কেনাকাটায় ডিসকাউন্ট` (১,২০০ টাকায় ২০% ছাড় = ২৪০ টাকা ছাড়, বিক্রয়মূল্য ৯৬০ টাকা)

### 3. Number to Word (`/converter/number-to-word`)
- **Page Affected**: `/converter/number-to-word`
- **Date**: 2026-11-14
- **Before Title**: `সংখ্যা থেকে কথায় রূপান্তরকারী | Number to Word Converter Bangla | Totthobox` (73 chars)
- **After Title**: `অংক থেকে কথায় বাংলা - সংখ্যা থেকে কথায় রূপান্তর` (51 chars, <= 60 chars)
- **Before Description**: `যেকোনো সংখ্যাকে সহজে বাংলা ও ইংরেজি শব্দে রূপান্তর করুন। ব্যাংক চেক, দলিল ও চালানের জন্য টাকা-পয়সা, ইউনিকোড বাংলা ও আদর্শলিপি (ANSI) ফরম্যাট সমর্থিত।` (143 chars)
- **After Description**: `অংক থেকে কথায় বাংলা রূপান্তর করুন সহজে। ব্যাংক চেক, দলিল ও ভাউচারের জন্য সংখ্যা থেকে কথায় টাকা লেখার সঠিক ফরম্যাট ও বাস্তব উদাহরণ জানুন তথ্যবক্সে।` (148 chars)
- **Added Blocks**:
  1. Direct-answer block: "অংক থেকে কথায় বাংলা: লেখার নিয়ম ও চেক স্টাইল উদাহরণ".
  2. 3 verified bank-cheque style examples:
     - Example 1: ২৫,৫০০ -> `পঁচিশ হাজার পাঁচ শত টাকা মাত্র` (Twenty-Five Thousand Five Hundred Taka Only)
     - Example 2: ১,৫০,০০০ -> `এক লক্ষ পঞ্চাশ হাজার টাকা মাত্র` (One Lakh Fifty Thousand Taka Only)
     - Example 3: ৫,৭৫,৩৫০ -> `পাঁচ লক্ষ পঁচাত্তর হাজার তিন শত পঞ্চাশ টাকা মাত্র` (Five Lakh Seventy-Five Thousand Three Hundred Fifty Taka Only)

---

## Group 3 — Holiday Detail Pages & Bangla Calendar (2026-11-15)

### Pages Changed

#### `/bangla/holiday/[slug]` (all holiday detail pages)
**Before title:** `{holiday.title} | ছুটির ক্যালেন্ডার`
**After title:** `{holiday.title} {yearBn} কত তারিখ ছুটি | ছুটির ক্যালেন্ডার` (≤60 chars, truncated if needed)

**Before description:** `seo.description` or generic fallback without date/type
**After description:** Includes `date_formatted`, `day_name_bn`, and holiday type (সরকারি/ঐচ্ছিক ছুটি), 120-160 chars

**Added blocks:**
- Direct-answer paragraph immediately under H1: `{holiday.title} {date_formatted} রোজ {day_name_bn} পালিত হবে এবং এটি একটি {সরকারি/ঐচ্ছিক} ছুটি ({type})।`
- Conditional `সর্বশেষ হালনাগাদ` display (only if `holiday.updated_at` exists in API — currently not present, block hidden)
- All existing content (date card, gallery, editorial text, FAQ JSON-LD) retained unchanged

#### `/bangla/calendar`
**Before:** `<AdvancedBanglaCalendar initialHolidays={initialHolidays} />`
**After:** `<AdvancedBanglaCalendar initialHolidays={initialHolidays} initialDateIso={ssrDateIso} />`

**AdvancedBanglaCalendar.tsx changes:**
- Added `initialDateIso?: string` prop
- `useState` for `todayDate`, `selectedDate`, `viewDate` now initialized from `initialDateIso` (stable SSR fallback prevents hydration mismatch)
- `useEffect` on mount updates `todayDate` to actual client local date (client-side island pattern — no ISR cache breakage)
- Satisfies query: "আজকের বাংলা তারিখ" — Bangla date shown server-side from `ssrDateIso`

---

## Group 4 — Software Pages & Audit (2026-11-15)

### SOFTWARE_AUDIT.md Created
- Scanned all 15 software records via `/api/apps/{slug}`
- **Critical finding:** ALL 15 download links point to `github.com/mariamsara77/recuva/releases/download/...` (single unofficial repo)
- 3 HIGH-risk entries: Bijoy Bayanno, Microsoft Office 2007, Microsoft Office 2010 (commercial copyrighted software)
- 6 MEDIUM-risk: VLC, LibreOffice, Avro, Recuva, Refuse USB, Proshika Shabda (open-source or unclear on unofficial repo)
- 2 NEEDS REVIEW: Kalpurush, SutonnyMJ (license not stated in API data)
- Full findings in `SOFTWARE_AUDIT.md` — no records edited, human review required

### `/software/[slug]` — Additive Sections (all slugs)

**Before:** Platform/version info table + "সফটওয়্যার তথ্য" section + strong notice
**After:** Added below the strong notice (additive):
1. **কিভাবে ইনস্টল করবেন** — 4-step numbered install guide (server-rendered, from API `platform` and `version` fields; conditional on `app.platform` existing)
2. **সচরাচর জিজ্ঞাসা** — FAQ section with FAQPage JSON-LD (up to 3 Q&A built from real API fields: name+description, platform+version, developer; conditional — only renders when at least 1 Q&A can be built)
- No titles, URLs, slugs changed
- No "crack", "full version free", "zip file free" added
- All existing content retained

---
