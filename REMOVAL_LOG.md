# Totthobox — অপসারণ ও পরিবর্তন লগ (REMOVAL_LOG.md)

**শাখা (Branch):** `redesign/fresh-2026-v3`  
**তারিখ:** ১৭ নভেম্বর, ২০২৬  
**উদ্দেশ্য:** এই ডকুমেন্ট Phase 1–6 জুড়ে সমস্ত অপসারিত ডুপ্লিকেট লিংক, মৃত কোড, অব্যবহৃত ফাইল এবং আর্কিটেকচারাল পরিবর্তনের সম্পূর্ণ তালিকা।

---

## ১. ডুপ্লিকেট নেভিগেশন লিংক অপসারণ (Phase 1)

`NAV_DUPLICATES.md`-এ শনাক্তকৃত ১২টি ডুপ্লিকেট গ্রুপ সমাধান করা হয়েছে। প্রতিটি `href`-এর জন্য একটিমাত্র ক্যানোনিকাল লেবেল রাখা হয়েছে।

| গন্তব্য (href) | অপসারিত লেবেলসমূহ | রক্ষিত ক্যানোনিকাল লেবেল | উৎস ফাইল |
| :--- | :--- | :--- | :--- |
| `/tools/image-resizer` | পাসপোর্ট ও ৩০০×৩০০ | **ছবি ও স্বাক্ষর রিসাইজার** | `lib/services-catalog.ts` |
| `/tools/age-calculator` | বছর, মাস ও দিন | **বয়স ক্যালকুলেটর** | `lib/services-catalog.ts` |
| `/tools/tax-vat-calculator` | এনবিআর কর স্ল্যাব | **আয়কর ও ভ্যাট গণক** | `lib/services-catalog.ts` |
| `/converter/land` | কাঠা, শতক, বিঘা | **জমির পরিমাপ ও হিসাব** | `lib/services-catalog.ts` |
| `/converter/number-to-word` | চেক ও রসিদ তৈরি | **সংখ্যা থেকে কথায় লেখা** | `lib/services-catalog.ts` |
| `/bangla/calendar` | ১৪৩২ বঙ্গাব্দ ও ছুটি | **বাংলা ক্যালেন্ডার ১৪৩২** | `lib/services-catalog.ts` |
| `/contact/police` | ফায়ার সার্ভিস, অ্যাম্বুলেন্স, হাসপাতাল, শিশু হেল্পলাইন, নারী সহায়তা ১০৯, পুলিশ ও অ্যাম্বুলেন্স (৭টি ডুপ্লিকেট) | **জরুরি সেবা ৯৯৯ ডিরেক্টরি** | `lib/services-catalog.ts` |
| `/international/world-clock` | সকল দেশের সময় | **বিশ্ব ঘড়ি (World Clock)** | `lib/services-catalog.ts` |
| `/islam/basic` | কালেমা ও অর্থ, নামাজের নিয়ম | **ইসলামিক মৌলিক জ্ঞান** | `lib/services-catalog.ts` |
| `/news/headlines` | জাতীয় সংবাদপত্র, আন্তর্জাতিক খবর, মিডিয়া সোর্স | **গুরুত্বপূর্ণ শিরোনাম** | `lib/services-catalog.ts` |
| `/live-tv` | বিটিভি জাতীয়, সংসদ টিভি, বিটিভি ওয়ার্ল্ড, বেতার | **লাইভ সম্প্রচার ডিরেক্টরি** | `lib/services-catalog.ts` |
| `/contact-us` | দ্বিতীয় "যোগাযোগ" লিংক | **যোগাযোগ** (একটিমাত্র) | `components/Footer.tsx` |

**মোট অপসারিত ডুপ্লিকেট এন্ট্রি:** ≈ ২৫টি (১২ গ্রুপ)

---

## ২. অব্যবহৃত / রিফ্যাক্টরড কম্পোনেন্ট ও কোড (Phase 1–2)

| ফাইল / কোড ব্লক | কেন অপসারিত/রিফ্যাক্টরড | প্রতিস্থাপন |
| :--- | :--- | :--- |
| `lib/services-catalog.ts` এর hardcoded মেনু আইটেম | ডুপ্লিকেট href ও অসামঞ্জস্য লেবেল | `config/navigation.ts` (NAVIGATION_REGISTRY) |
| `components/home/TrendingServices.tsx` এর hardcoded href | একই href-এ ভিন্ন নামে একাধিক কার্ড | NAVIGATION_REGISTRY থেকে রেন্ডার |
| `components/home/CategorySection.tsx` এর hardcoded লিংক | NAVIGATION_REGISTRY-র বাইরে পৃথক ডেটা | NAVIGATION_REGISTRY থেকে রেন্ডার |
| `components/navigation/StickyCategoryNav.tsx` এর hardcoded ক্যাটাগরি | NAVIGATION_REGISTRY-তে একীভূত | NAVIGATION_REGISTRY-র ক্যাটাগরি ব্যবহার |
| Arbitrary Tailwind ক্লাস (৩৯টি) | `text-[13px]`, `w-[37px]`, `h-[52px]` ইত্যাদি | প্রমিত টোকেন: `text-2xs`, `h-9`, `size-5` |

---

## ৩. রেন্ডার-ব্লকিং স্ক্রিপ্ট ও পারফরম্যান্স সমস্যা (Phase 3)

| উপাদান | সমস্যা | ব্যবস্থা |
| :--- | :--- | :--- |
| `<GoogleTranslate />` কম্পোনেন্ট | LCP ৪.২s → রেন্ডার-ব্লকিং `translate.google.com` JS | সম্পূর্ণ অপসারণ (সাইট ১০০% বাংলা) |
| `proxy.ts` মিডলওয়্যারে `Set-Cookie: tb_country` | CDN ক্যাশ বাইপাস করে TTFB ৫০০+ ms | পেজ রিকোয়েস্টে `Set-Cookie` নিষিদ্ধ; `/api/geo`-এ পৃথক |
| ইউজার অ্যানালিটিক্স `cache: "no-store"` fetch | স্ট্যাটিক পেজ ডায়নামিক রেন্ডারিংয়ে বাধ্য | ক্লায়েন্ট-সাইড ৫ মিনিটের sessionStorage ক্যাশ |

---

## ৪. SEO ও ইনডেক্সিং পরিবর্তন (Phase 4)

| পরিবর্তন | বিবরণ |
| :--- | :--- |
| `/live-tv` — `robots: { index: false }` | কপিরাইট সুরক্ষার জন্য সার্চ ইঞ্জিন থেকে বাদ |
| `/news/*` — `robots: { index: false }` | স্ক্র্যাপ করা নিউজ AdSense পলিসি লঙ্ঘন রোধ |
| `/ai/chat` — `adsEnabled: false` | অমডারেটেড AI আউটপুটে বিজ্ঞাপন নিষিদ্ধ |
| AI training bots ব্লক (robots.txt) | `GPTBot`, `ClaudeBot`, `Google-Extended` ব্লক |
| AI search bots অনুমতি (robots.txt) | `OAI-SearchBot`, `PerplexityBot`, `Bingbot` অনুমতি |

---

## ৫. নতুন সৃষ্ট ফাইল তালিকা (এই শাখায়)

### কনফিগারেশন ও রেজিস্ট্রি
- `config/navigation.ts` — কেন্দ্রীয় নেভিগেশন রেজিস্ট্রি (৪৪ আইটেম, ১০ ক্যাটাগরি)

### কম্পোনেন্ট লাইব্রেরি (Phase 2)
- `components/ui/Icon.tsx` — Lucide র‍্যাপার (xs/sm/md/lg টোকেন)
- `components/ui/Button.tsx` — ইউনিফায়েড বাটন
- `components/ui/Card.tsx` — ইউনিফায়েড কার্ড
- `components/ui/Chip.tsx` — ইউনিফায়েড চিপ/ব্যাজ
- `components/ui/Tabs.tsx` — ইউনিফায়েড ট্যাব
- `components/ui/Breadcrumb.tsx` — ব্রেডক্রাম্ব + JSON-LD
- `components/ui/Skeleton.tsx` — লোডিং স্কেলিটন
- `components/ui/EmptyState.tsx` — শূন্য অবস্থা প্লেসহোল্ডার
- `components/ui/Pagination.tsx` — পেজিনেশন
- `components/ui/PageHeader.tsx` — পেজ হেডার
- `components/ui/Section.tsx` — সেকশন র‍্যাপার
- `components/ui/ConsentBanner.tsx` — কুকি কনসেন্ট (GDPR/CMP)

### SEO ও AI-Search (Phase 4)
- `public/llms.txt` — LLM ইনজেশন ক্যাটালগ
- `public/4f46e5b643c4bef5203c9ac56e815769.txt` — IndexNow ভেরিফিকেশন কী
- `app/api/indexnow/route.ts` — IndexNow এন্ডপয়েন্ট
- `app/feed.xml/route.ts` — RSS 2.0 ফিড

### পলিসি পেজ (Phase 5)
- `app/(home)/corrections-policy/page.tsx` — সংশোধন নীতি

### ব্যাকএন্ড প্যাচ (Phase 5)
- `backend-changes/ContentQualityJudge.patch` — AI কনটেন্ট কোয়ালিটি গেট
- `backend-changes/AI_PUBLISHING_POLICY.md` — AI প্রকাশনা নীতি

### টেস্ট ও স্ক্রিপ্ট
- `scripts/test-nav-registry.mjs` — নেভিগেশন ডুপ্লিকেট টেস্ট
- `scripts/lint-design-tokens.mjs` — ডিজাইন টোকেন লিন্টার
- `scripts/test-visual-regression.mjs` — Playwright ভিজুয়াল রিগ্রেশন (৪২ টেস্ট)
- `scripts/measure-perf.mjs` — কোর ওয়েব ভাইটালস পরিমাপক

### ডকুমেন্টেশন
- `NAV_DUPLICATES.md` — নেভিগেশন ডুপ্লিকেট অডিট
- `PERF_REPORT.md` — পারফরম্যান্স রিপোর্ট
- `ADSENSE_CHECKLIST.md` — অ্যাডসেন্স চেকলিস্ট
- `AUDIT_MATRIX.csv` — ৮৭ রুটের সম্পূর্ণ অডিট ম্যাট্রিক্স
- `owner-inputs.md` — সাইট ওনারের প্রদানযোগ্য তথ্য
- `REMOVAL_LOG.md` — এই ফাইল

---

## ৬. সারসংক্ষেপ

| মেট্রিক | সংখ্যা |
| :--- | ---: |
| অপসারিত ডুপ্লিকেট মেনু এন্ট্রি | ≈ ২৫ |
| অপসারিত hardcoded href | সমস্ত (এখন ০) |
| অপসারিত arbitrary Tailwind ক্লাস | ৩৯ |
| অপসারিত রেন্ডার-ব্লকিং স্ক্রিপ্ট | ১ (GoogleTranslate) |
| নতুন সৃষ্ট ফাইল | ২৫+ |
| noindex করা ঝুঁকিপূর্ণ রুট | ৩ ক্যাটাগরি (live-tv, news, ai/chat) |
