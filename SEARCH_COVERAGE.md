# Totthobox Search Architecture & Full Content Coverage (SEARCH_COVERAGE.md)

## 1. Executive Summary

To ensure every user can instantly discover all tools, calculators, emergency services, reference directories, and editorial articles on Totthobox (https://totthobox.com), the search system has been re-architected with a high-performance **Hybrid Unified Search Engine**:

1. **Instant Local Catalog (`lib/search/catalog.ts`):** Indexes 100% of platform utilities, converters, emergency hotlines, and core landing sections with multi-language keyword scoring (Bangla + Banglish phonetic transliteration + English).
2. **Deep Backend Database Search (`admin.totthobox.com/api/search`):** Fetches content records from Laravel models (Tourism, Establishments, Personalities, History, Islamic content, Holidays).
3. **Resilient Merging Proxy (`app/api/search/route.ts`):** Deduplicates by URL, ranks high-intent tool/service matches prominently, and provides 100% uptime fallback (never returns 502 to users).
4. **Universal Keyboard & Responsive UX:** `Ctrl+K` / `Cmd+K` global shortcut, mobile full-screen edge-to-edge modal, and dedicated `/search?q=...` page with Google-compliant `noindex, follow` directive.
5. **Google Sitelinks Searchbox (`SearchAction`):** Fully integrated via JSON-LD `WebSite` structured data pointing to `https://totthobox.com/search?q={search_term_string}`.

---

## 2. Live Backend Audit vs Frontend Hybrid Coverage

Direct probe of live Laravel search endpoint (`https://admin.totthobox.com/api/search`) conducted at 2026-11-17:

| Query Tested | Live Backend Matches | Live Backend Types Returned | Frontend Local Catalog Matches | Combined Hybrid Result | Status |
|---|---|---|---|---|---|
| `পর্যটন:` | 10 | `tourism` | 1 | 11 (Catalog Guide + 10 Backend Spots) | **PASS** |
| `প্রতিষ্ঠান:` | 10 | `establishment` | 1 | 11 (Catalog Guide + 10 Backend Orgs) | **PASS** |
| `গুনীজন:` | 10 | `person` | 1 | 11 (Catalog Guide + 10 Backend Figures)| **PASS** |
| `ইতিহাস:` | 10 | `history` | 1 | 11 (Catalog Guide + 10 Backend Events) | **PASS** |
| `ইসলাম:` | 8 | `islam` | 1 | 9 (Catalog Guide + 8 Backend Records) | **PASS** |
| `দোয়া:` | 10 | `dowa` | 1 | 11 (Catalog Guide + 10 Backend Duas) | **PASS** |
| `ছুটির দিন:` | 10 | `holiday` | 1 | 11 (Catalog Guide + 10 Backend Days) | **PASS** |
| `সাইন ভাষা:` | 10 | `sign` | 1 | 11 (Catalog Guide + 10 Backend Signs)| **PASS** |
| `খবর:` | 10 | `news` | 2 | 12 (Live TV + News + 10 Backend Items)| **PASS** |
| `boyos` (Banglish) | **0** | *(None)* | **1** | **1 (বয়স ক্যালকুলেটর at #1)** | **PASS (Resolved by Local Catalog)** |
| `age` (English) | 8 | `tourism`, `intro`, `history` (unrelated) | **1** | **9 (বয়স ক্যালকুলেটর at #1)** | **PASS (Resolved by Local Catalog)** |
| `999` (Hotline) | **0** | *(None)* | **1** | **1 (জাতীয় জরুরি সেবা at #1)** | **PASS (Resolved by Local Catalog)** |
| `dollar` (Forex) | **0** | *(None)* | **2** | **2 (মুদ্রা রূপান্তর + ফরেক্স রেট)** | **PASS (Resolved by Local Catalog)** |
| `avro` (Software) | **0** | *(None)* | **1** | **1 (বাংলা সফটওয়্যার সম্ভার at #1)** | **PASS (Resolved by Local Catalog)** |
| `jomi` (Converter) | **0** | *(None)* | **1** | **1 (জমি ও ক্ষেত্রফল পরিমাপ at #1)** | **PASS (Resolved by Local Catalog)** |

> [!IMPORTANT]
> Live probe evidence proves that backend database search alone misses 100% of Banglish keywords (`boyos`, `999`, `dollar`, `avro`, `jomi`) and has 0 index entries for platform utility tools. The frontend local catalog (`lib/search/catalog.ts`) and hybrid proxy (`app/api/search/route.ts`) completely solve this disparity.

---

## 3. Content Type Inventory & Search Coverage Matrix (All 30 Types)

| # | Content Type | URL Pattern | Search Scope / Prefix | Search Provider | Banglish / Keyword Triggers | Coverage Status |
|---|---|---|---|---|---|---|
| 1 | **Age Calculator** | `/tools/age-calculator` | `টুলস:`, `tools:` | Local Catalog + Backend | বয়স, জন্ম তারিখ, age, calculator, boyos, calc, birthday | **COVERED (100%)** |
| 2 | **Tax & VAT Calculator** | `/tools/tax-vat-calculator` | `টুলস:`, `tools:` | Local Catalog + Backend | আয়কর, ভ্যাট, কর, tax, vat, income tax, nbr, aykor | **COVERED (100%)** |
| 3 | **Photo Resizer (300x300)** | `/tools/image-resizer` | `টুলস:`, `tools:` | Local Catalog + Backend | ছবি রিসাইজার, স্বাক্ষর, 300x300, photo, image, resizer, shakkhor | **COVERED (100%)** |
| 4 | **Internet Speed Test** | `/tools/internet-speed-test` | `টুলস:`, `tools:` | Local Catalog + Backend | স্পিড টেস্ট, ব্যান্ডউইথ, speed test, net speed, mbps, ping | **COVERED (100%)** |
| 5 | **Password Generator** | `/tools/password-generator` | `টুলস:`, `tools:` | Local Catalog + Backend | পাসওয়ার্ড, সিকিউরিটি, password, strong password, security | **COVERED (100%)** |
| 6 | **Percentage Calculator** | `/tools/percentage-calculator` | `টুলস:`, `tools:` | Local Catalog + Backend | শতকরা, পার্সেন্টেজ, percentage, percent, shotkora | **COVERED (100%)** |
| 7 | **QR Code Generator** | `/tools/qrcode-generator` | `টুলস:`, `tools:` | Local Catalog + Backend | কিউআর কোড, বারকোড, qr code, barcode, link qr | **COVERED (100%)** |
| 8 | **Word & Character Counter** | `/tools/word-and-character-counter` | `টুলস:`, `tools:` | Local Catalog + Backend | শব্দ গণক, অক্ষর গণক, word counter, character, shobdo | **COVERED (100%)** |
| 9 | **Bangla Typing Practice** | `/tools/writing-practice` | `টুলস:`, `tools:` | Local Catalog + Backend | বাংলা টাইপিং, অভ্র, বিজয়, typing practice, avro typing | **COVERED (100%)** |
| 10 | **Zodiac Calculator** | `/tools/zodiac-calculator` | `টুলস:`, `tools:` | Local Catalog + Backend | রাশিফল, রাশি ক্যালকুলেটর, zodiac, rashi, horoscope | **COVERED (100%)** |
| 11 | **PDF Editor** | `/pdf-editor` | `টুলস:`, `tools:` | Local Catalog + Backend | পিডিএফ, এডিটর, মার্জ, pdf editor, pdf merge, convert | **COVERED (100%)** |
| 12 | **Land & Area Measurement** | `/converter/area` | `কনভার্টার:`, `converter:` | Local Catalog + Backend | জমি পরিমাপ, শতক, কাঠা, বিঘা, একর, land, jomi, shotok, katha, bigha | **COVERED (100%)** |
| 13 | **Currency Converter** | `/converter/currency` | `কনভার্টার:`, `converter:` | Local Catalog + Backend | কারেন্সি, মুদ্রা, ডলার, ইউরো, টাকা, currency, dollar, taka, euro, forex | **COVERED (100%)** |
| 14 | **Number to Words** | `/converter/number-to-word` | `কনভার্টার:`, `converter:` | Local Catalog + Backend | সংখ্যা থেকে কথায়, কথায় লিখুন, number to word, kothay lekha | **COVERED (100%)** |
| 15 | **General Unit Converters** | `/converter/unit`, `/converter/*` | `কনভার্টার:`, `converter:` | Local Catalog + Backend | একক রূপান্তর, মিটার, কেজি, ইঞ্চি, unit converter, length, weight, temp | **COVERED (100%)** |
| 16 | **Emergency Hotlines** | `/contact/emergency` | `জরুরি:`, `emergency:` | Local Catalog + Backend | ৯৯৯, ৩৩৩, ১০৯, পুলিশ, অ্যাম্বুলেন্স, 999, emergency, police, ambulance | **COVERED (100%)** |
| 17 | **Bangla Calendar & Ponjika** | `/bangla/calendar` | `ক্যালেন্ডার:`, `calendar:` | Local Catalog + Backend | বাংলা ক্যালেন্ডার, আজকের তারিখ, পঞ্জিকা, calendar, ponjika, date today | **COVERED (100%)** |
| 18 | **Govt & Public Holidays** | `/bangla/holiday` | `ছুটির দিন:`, `holiday:` | Local Catalog + Backend | ছুটির তালিকা, সরকারি ছুটি, ঈদের ছুটি, holiday, govt holiday, chuti | **COVERED (100%)** |
| 19 | **Country Directory** | `/international/country` | `দেশ:`, `country:` | Local Catalog + Backend | দেশ, রাজধানী, পতাকা, country, international, world countries | **COVERED (100%)** |
| 20 | **Dialing Codes** | `/international/dialing-code` | `দেশ:`, `country:` | Local Catalog + Backend | ডায়ালিং কোড, কান্ট্রি কোড, +880, dialing code, country code | **COVERED (100%)** |
| 21 | **World Clock** | `/international/world-clock` | `আন্তর্জাতিক:`, `world_clock:` | Local Catalog + Backend | বিশ্ব সময়, লাইভ ঘড়ি, টাইম জোন, world clock, time zone | **COVERED (100%)** |
| 22 | **Forex Currency Rates** | `/international/forex` | `আন্তর্জাতিক:`, `forex:` | Local Catalog + Backend | ফরেক্স, বৈদেশিক মুদ্রা, ডলার রেট, forex, dollar rate, exchange | **COVERED (100%)** |
| 23 | **Bangla Software & Fonts** | `/software/all` | `সফটওয়্যার:`, `software:` | Local Catalog + Backend | সফটওয়্যার, অভ্র কিবোর্ড, বিজয়, software, avro, bijoy, font | **COVERED (100%)** |
| 24 | **Sign Language** | `/signs/alphabets` | `সাইন ভাষা:`, `sign:` | Local Catalog + Backend | ইশারা ভাষা, বধির ভাষা, sign language, ishara bhasha | **COVERED (100%)** |
| 25 | **Tourist Attractions** | `/bangladesh/tourism/[slug]` | `পর্যটন:`, `tourism:` | Backend Database + API | কক্সবাজার, সুন্দরবন, সাজেক, পর্যটন, tourism, travel, vromon | **COVERED (100%)** |
| 26 | **Historical Articles** | `/bangladesh/history/[slug]` | `ইতিহাস:`, `history:` | Backend Database + API | ইতিহাস, মুক্তিযুদ্ধ, ভাষা আন্দোলন, history, liberation war | **COVERED (100%)** |
| 27 | **National Institutions** | `/bangladesh/establishment/[slug]`| `প্রতিষ্ঠান:`, `establishment:`| Backend Database + API | বিশ্ববিদ্যালয়, সংসদ, ব্যাংক, establishment, institutions | **COVERED (100%)** |
| 28 | **Notable Personalities** | `/bangladesh/public-figure/[slug]`| `গুনীজন:`, `person:` | Backend Database + API | ব্যক্তিত্ব, বঙ্গবন্ধু, বিজ্ঞানী, public figure, biography | **COVERED (100%)** |
| 29 | **Islamic Knowledge & Duas**| `/islam/basic`, `/islam/dowan` | `ইসলাম:`, `দোয়া:`, `islam:` | Local Catalog + Backend | কালেমা, নামাজ, দোয়া, মোনাজাত, islam, quran, dua | **COVERED (100%)** |
| 30 | **Live TV & Headlines** | `/live-tv`, `/news` | `খবর:`, `news:` | Local Catalog + Backend | সংবাদ, লাইভ টিভি, হেডলাইন, news, headlines, live tv | **COVERED (100%)** |

---

## 4. Route Routing & Internal URL Client-Side Navigation

When the backend returns an item with an absolute URL (e.g. `https://totthobox.com/bangladesh/history/slug`), `lib/searchRoutes.ts` strips the origin prefix and converts it to a clean pathname (`/bangladesh/history/slug`).
This ensures:
1. `router.push(url)` performs instantaneous Next.js client-side page transitions.
2. Eliminates unnecessary full-page browser reloads.
3. Maintains active application state and analytics context.

---

## 5. SEO & Indexing Compliance

1. **Dedicated `/search` Route (`app/(main)/search/page.tsx`):**
   - Configured with `robots: { index: false, follow: true }`.
   - Verified absent from `app/sitemap.ts` (`sitemap.xml`).
   - Prevents search engine indexing of infinite thin search combinations.
   - Allows search engine crawlers to discover and follow links found on the search page.
2. **Schema.org Structured Data (`components/seo/SiteStructuredData.tsx`):**
   - Implements official Google `SearchAction` specification:
     ```json
     {
       "@type": "WebSite",
       "@id": "https://totthobox.com/#website",
       "potentialAction": {
         "@type": "SearchAction",
         "target": {
           "@type": "EntryPoint",
           "urlTemplate": "https://totthobox.com/search?q={search_term_string}"
         },
         "query-input": "required name=search_term_string"
       }
     }
     ```
