# Totthobox (তথ্যবক্স) — Comprehensive Platform Audit & Technical Evaluation
**Document Version:** 2.0.0 (Production Architecture & Compliance Audit)  
**Date:** ১৭ নভেম্বর ২০২৬  
**Lead Authors:** Chief Engineer, Senior Next.js Developer, Technical SEO Specialist & UI/UX Architect  
**Platform Target:** Totthobox (https://totthobox.com)  
**Stack Overview:** Next.js 16.3.3 (App Router, Turbopack/Webpack, React 19.2.8) on Vercel Edge/Serverless + Laravel 12 Backend API (https://admin.totthobox.com)  

---

## নির্বাহী সারসংক্ষেপ (Executive Summary)

Totthobox একটি বাংলা ডিজিটাল সার্ভিস ও ইনফরমেশন প্ল্যাটফর্ম যার লক্ষ্য বাংলাদেশের সাধারণ নাগরিক ও ডিজিটাল ব্যবহারকারীদের দৈনন্দিন সেবা (বাংলা ক্যালেন্ডার, স্মার্ট কনভার্টার, এনবিআর আয়কর ও ইউটিলিটি ক্যালকুলেটর, জরুরি হটলাইন, ইসলামিক জ্ঞান, সফটওয়্যার ও শিক্ষা সংক্রান্ত তথ্য) এক ছাদের নিচে বিনামূল্যে দেওয়া।

এই অডিট রিপোর্টে পুরো ফ্রন্টএন্ড রিপোজিটরি (`totthobox-fontend`), কনফিগারেশন, বিল্ড পাইপলাইন, লাইভ ওয়েবসাইট (`https://totthobox.com`) এবং ব্যাকএন্ড ইন্টারফেসের একটি পুঙ্খানুপুঙ্খ অডিট সম্পন্ন করা হয়েছে। এতে কর্মক্ষমতা (Performance), ভার্সেল সিডিএন ক্যাশিং ও রিকোয়েস্ট অপ্টিমাইজেশন, টেকনিক্যাল এসইও (SEO), এআই কনটেন্ট কোয়ালিটি ও গুগলের হেল্পফুল কনটেন্ট গাইডলাইন, গুগল অ্যাডসেন্স (AdSense) অ্যাপ্রুভাল চেকলিস্ট, ইউআই/ইউএক্স (UI/UX) ডিজাইন সিস্টেম এবং নিরাপত্তা/স্থিতিশীলতা সম্পর্কিত মোট **৩৭টি নির্দিষ্ট সমস্যা** চিহ্নিত করা হয়েছে।

প্রতিটি সমস্যাকে তার তীব্রতা অনুযায়ী **CRITICAL**, **HIGH**, **MEDIUM**, এবং **LOW** দিয়ে বিন্যস্ত করা হয়েছে এবং সমাধানের সুনির্দিষ্ট ফাইল পাথ ও অ্যাকশন প্ল্যান অন্তর্ভুক্ত করা হয়েছে।

---

## সমস্যা তীব্রতা ম্যাট্রিক্স (Severity Matrix)

| ক্যাটাগরি | Critical | High | Medium | Low | মোট |
| :--- | :---: | :---: | :---: | :---: | :---: |
| ১. Performance (Core Web Vitals & Bundles) | ১ | ২ | ৩ | ১ | ৭ |
| ২. Vercel CDN, Caching & Request Limits | ২ | ২ | ২ | ০ | ৬ |
| ৩. Technical SEO & Indexation | ১ | ৩ | ২ | ১ | ৭ |
| ৪. AI Content & Quality Risks (YMYL) | ২ | ২ | ১ | ০ | ৫ |
| ৫. Google AdSense Compliance Checklist | ২ | ২ | ১ | ০ | ৫ |
| ৬. UI/UX, Typography & Discoverability | ১ | ২ | ২ | ০ | ৫ |
| ৭. Security, Secrets & Reliability | ১ | ১ | ০ | ০ | ২ |
| **সর্বমোট** | **১০** | **১৪** | **১১** | **২** | **৩৭** |

---

## ১. Performance (Core Web Vitals, Bundle Size & Assets)

### [CRITICAL] PERF-01: গুগল ট্রান্সলেট স্ক্রিপ্ট গ্লোবাল ইনজেকশনের কারণে LCP/CLS ও মোবাইল পারফরম্যান্স বিপর্যয়
- **ফাইল পাথ:** `components/GoogleTranslate.tsx`, `app/layout.tsx` (লাইন ২২৩)
- **সমস্যা:** `RootLayout`-এ `<GoogleTranslate />` সরাসরি মাউন্ট করা আছে, যা ক্লায়েন্ট লোডের সাথে সাথে বাহ্যিক ডোমেইন (`translate.google.com`) থেকে ভারী স্ক্রিপ্ট ফেচ করে এবং DOM-এর ভেতরে অপ্রস্তুত এলিমেন্ট ইনজেক্ট করে। এটি মোবাইলে প্রথম কন্টেন্টফুল পেইন্ট (FCP) এবং লার্জেস্ট কন্টেন্টফুল পেইন্ট (LCP)-এ ২০০–৪৫০ms অতিরিক্ত লেটেন্সি তৈরি করে এবং কিউমুলেটিভ লেআউট শিফট (CLS > 0.1) ঘটায়।
- **সমাধান:** গ্লোবাল লেআউট থেকে স্বয়ংক্রিয় এক্সিকিউশন বন্ধ করতে হবে। অনুবাদ ফিচারটি শুধুমাত্র ব্যবহারকারী যখন স্পেসিফিক বাটনে ক্লিক করবেন তখনই `next/dynamic` দিয়ে অন-ডিমান্ড লোড হবে।

### [HIGH] PERF-02: সাইডবারের বিশাল বান্ডেল আকার (৫৩.৬ KB) ও সাইডবার রি-রেন্ডারিং ওভারহেড
- **ফাইল পাথ:** `components/Sidebar.tsx` (লাইন ১–১২৭০)
- **সমস্যা:** `Sidebar.tsx` একটি বিশাল ১২৭০ লাইনের ক্লায়েন্ট কম্পোনেন্ট (৫৩.৬ KB)। প্রতিটি `(main)` পেজে এটি লোড হয়। এর ভেতরে অসংখ্য রিঅ্যাক্ট স্টেট, টুলটিপ পজিশনিং ক্যালকুলেশন এবং একাধিক বাহ্যিক আইকন লাইব্রেরি একসাথে ইম্পোর্ট করা আছে।
- **সমাধান:** সাইডবারকে মডুলার সার্ভার/ক্লায়েন্ট কাঠামোতে বিভক্ত করতে হবে। স্ট্যাটিক নেভিগেশন লিংকগুলো সার্ভার সাইডে রেন্ডার হবে এবং ক্লায়েন্ট ইন্টারেক্টিভিটি (টগল, ড্রপডাউন) ছোট লাইটওয়েট কম্পোনেন্টে স্থানান্তর করতে হবে।

### [HIGH] PERF-03: `<img>` ট্যাগের সরাসরি ব্যবহার এবং আনঅপ্টিমাইজড মিডিয়া লোডিং
- **ফাইল পাথ:** `app/(auth)/login/LoginContent.tsx` (লাইন ১৪৩), `app/(home)/users/[slug]/page.tsx`, বিভিন্ন ক্যাটাগরি ও আইটেম কার্ড
- **সমস্যা:** নেক্সট.জেএস-এর অফিসিয়াল `<Image />` (`next/image`) কম্পোনেন্টের বদলে বেশ কিছু ফাইলে সাধারণ HTML `<img>` ব্যবহার করা হয়েছে। ফলে ব্রাউজার অটোমেটিক AVIF/WebP রূপান্তর, রেসপন্সিভ সাইজিং (`srcset`), এবং লেজি-লোডিং সুবিধা পায় না, যা অতিরিক্ত মোবাইল ব্যান্ডউইথ খরচ করে।
- **সমাধান:** সমস্ত `<img>` ট্যাগ পরিবর্তন করে `next/image` ব্যবহার করতে হবে এবং অ্যাবাভ-দ্য-ফোল্ড ইমেজে `priority` ও প্রোপার `sizes` অ্যাট্রিবিউট দিতে হবে।

### [MEDIUM] PERF-04: ভারী ক্লায়েন্ট লাইব্রেরির অকাল ইম্পোর্ট (PDF, DOCX, XLSX, FFMPEG)
- **ফাইল পাথ:** `package.json`, `app/(main)/pdf-editor/`, `app/(main)/converter/`
- **সমস্যা:** `pdfjs-dist`, `pdf-lib`, `jspdf`, `mammoth`, `xlsx`, `@ffmpeg/ffmpeg` ইত্যাদি অত্যন্ত ভারী প্যাকেজ নির্ভরতা রয়েছে। এগুলো ভুলবশত প্রধান বান্ডেল বা কমন চাঙ্কে এলে পেজ লোড সাইজ ১ মেগাবাইটের বেশি বৃদ্ধি পাবে।
- **সমাধান:** এই সমস্ত লাইব্রেরি শুধুমাত্র সংশ্লিষ্ট টুল পেজে ব্যবহারকারী ফাইল আপলোড করার পর `await import(...)` দিয়ে ডায়নামিকালি এক্সিকিউট করতে হবে।

### [MEDIUM] PERF-05: ফন্ট লোডিং অপ্টিমাইজেশন ও Hind Siliguri কনফিগারেশন
- **ফাইল পাথ:** `app/layout.tsx`, `app/globals.css`
- **সমস্যা:** বর্তমানে `Noto_Sans_Bengali` লোড করা আছে, কিন্তু প্রধান ডিজাইনে বাংলা অক্ষরের স্পষ্টতা ও পাঠযোগ্যতার জন্য `Hind_Siliguri` সাবসেট কনফিগারেশন মিসিং। এছাড়া লোকাল ফন্ট `/fonts/adorsholipi-exp.woff2` `@font-face`-এ `font-display: swap` আছে কিন্তু প্রি-লোড করা নেই।
- **সমাধান:** `next/font/google` দিয়ে `Hind_Siliguri` ও `Noto_Sans_Bengali` ভ্যারিয়েবল ডিক্লেয়ার করে সিএসএস ভেরিয়েবলে যুক্ত করতে হবে এবং লোকাল ফন্টে প্রোপার ডিসপ্লে ট্যাকটিক প্রয়োগ করতে হবে।

### [MEDIUM] PERF-06: হোমপেজে আন-রিজার্ভড হাইট থেকে CLS (Layout Shift)
- **ফাইল পাথ:** `components/UserAnalytics.tsx`, `app/(home)/page.tsx`
- **সমস্যা:** `UserAnalytics` ডেটা লোড হওয়ার পূর্বে শূন্য হাইট থাকে (`if (!totalUsers) return null;`)। API থেকে ডেটা আসার সাথে সাথে এটি হঠাৎ স্ক্রিনে চলে আসে, যার ফলে নিচের সার্ভিস কার্ডগুলো নিচের দিকে ধাক্কা খায় (Layout Shift)।
- **সমাধান:** লোডিং অবস্থায় সঠিক হাইট বিশিষ্ট স্কেলিটন বা প্লেসহোল্ডার রিজার্ভ রাখতে হবে যাতে লেআউট শিফট শূন্য (CLS = 0) থাকে।

### [LOW] PERF-07: একাধিক আইকন লাইব্রেরির মিশ্রণ ও বান্ডেল ফেটে যাওয়া
- **ফাইল পাথ:** `package.json` (`lucide-react`, `react-icons`, `@heroicons/react`)
- **সমস্যা:** তিনটি ভিন্ন আইকন প্যাকেজ প্রজেক্টে ব্যবহৃত হওয়ায় ট্রি-শেকিং অদক্ষ হয়ে পড়ে।
- **সমাধান:** প্রাথমিক আইকন সেট হিসেবে `lucide-react`-এ ইউনিফাই করতে হবে এবং সোশ্যাল ব্র্যান্ড আইকনের জন্য কেবল নির্দিষ্ট এসভিজি বা মিনিমাল আইকন রাখতে হবে।

---

## ২. Vercel CDN, Caching & Request Limit Audit

### [CRITICAL] CDN-01: হোমপেজে প্রতি ভিজিটে `cache: 'no-store'` দিয়ে ভার্সেল ফাংশন কল
- **ফাইল পাথ:** `components/UserAnalytics.tsx` (লাইন ৯১)
- **সমস্যা:** `components/UserAnalytics.tsx` হোমপেজে মাউন্ট হওয়ার সাথে সাথে ক্লায়েন্ট থেকে `/api/analytics/stats` এন্ডপয়েন্টে `cache: "no-store"` সহ রিকোয়েস্ট পাঠায়। প্রতিদিন ১০,০০০ ভিজিটর আসলে ১০,০০০ বার ভার্সেল সার্ভারলেস ফাংশন এক্সিকিউট হয়, যা ভার্সেলের এজ/ফাংশন কোটা অত্যন্ত দ্রুত শেষ করে দেয়।
- **সমাধান:** এই রিকোয়েস্টে ব্রাউজার ও এজ লেভেলে SWR (Stale-While-Revalidate) ক্যাশিং (যেমন: ৫ মিনিট বা ১০ মিনিট ক্যাশ) কার্যকর করতে হবে। লোকালস্টোরেজ বা মেমোরিতে টাইমস্ট্যাম্প চেক করে বারবার ব্যাকএন্ড কল বন্ধ করতে হবে।

### [CRITICAL] CDN-02: `proxy.ts`-এ প্রতি রিকোয়েস্টে কুকি সেট করার কারণে CDN Edge Cache বাইপাস
- **ফাইল পাথ:** `proxy.ts` (লাইন ৩৮–৪৫)
- **সমস্যা:** Next.js 16 প্রক্সি/মিডলওয়্যারে প্রতিটি ইনকামিং রিকোয়েস্টে `tb_country` কুকি সেট করা হচ্ছে:
  ```ts
  if (country && request.cookies.get("tb_country")?.value !== country) {
    response.cookies.set("tb_country", country, { ... });
  }
  ```
  এইচটিটিপি রেসপন্সে `Set-Cookie` হেডার উপস্থিত থাকলে Vercel CDN এবং Cloudflare এজ ক্যাশ স্বয়ংক্রিয়ভাবে বাইপাস (MISS) হতে পারে, ফলে স্ট্যাটিক ও ISR পেজগুলোও এজ থেকে ক্যাশ হিট পায় না।
- **সমাধান:** শুধুমাত্র যেসব রুটে জিও-লোকেশন ফিল্টারিং অপরিহার্য সেখানে হেডার হ্যান্ডলিং করতে হবে অথবা ক্লায়েন্ট সাইড স্টোরেজে কান্ট্রি সংরক্ষণ করতে হবে, পাবলিক কনটেন্ট রুটে অনর্থক রেসপন্স কুকি ইনজেক্ট করা যাবে না।

### [HIGH] CDN-03: `proxy.ts` ফাইলে Next.js 16 প্রক্সি কনভেনশন ও কনফিগারেশন মিসম্যাচ
- **ফাইল পাথ:** `proxy.ts`, `AGENTS.md`
- **সমস্যা:** Next.js 16-এ মিডলওয়্যার সিস্টেম `proxy.ts`-এ পরিমার্জিত হলেও এর ভেতরের প্যাচ এবং `matcher` রুলস যদি অপ্টিমাইজড না হয়, তবে এটি সমস্ত স্ট্যাটিক অ্যাসেট বা পাবলিক রিকোয়েস্টে এক্সিকিউট হয়ে অযথা Compute Time বাড়িয়ে দেয়।
- **সমাধান:** প্রক্সির ম্যাচার কনফিগারেশন আরও কঠোর করতে হবে যাতে ইমেজ, স্ট্যাটিক ডিরেক্টরি এবং পাবলিক ফেভিকনে কোনো প্রক্সি ওভারহেড না থাকে।

### [HIGH] CDN-04: `revalidateTag` এ অকার্যকর দ্বিতীয় আর্গুমেন্ট ও ক্যাশ পার্জিং দুর্বলতা
- **ফাইল পাথ:** `app/api/revalidate/route.ts` (লাইন ৫০), `app/api/cron/warm-news/route.ts` (লাইন ৩০)
- **সমস্যা:** কোডে `revalidateTag(tag, "max")` লেখা রয়েছে। নেক্সট.জেএস App Router-এর অফিসিয়াল API স্পেসিফিকেশনে `revalidateTag(tag: string)` শুধুমাত্র একটি একক স্ট্রিং আর্গুমেন্ট গ্রহণ করে। ভুল প্যারামিটার ক্যাশ ইনভ্যালিডেশনে অপ্রত্যাশিত আচরণ সৃষ্টি করতে পারে।
- **সমাধান:** প্যারামিটার ঠিক করে সঠিক ট্যাগ-ভিত্তিক রিভ্যালিডেশন সুনিশ্চিত করতে হবে।

### [MEDIUM] CDN-05: ব্যাকএন্ড প্রক্সি রুট `api/backend/[...path]` জোরপূর্বক ডাইনামিক
- **ফাইল পাথ:** `app/api/backend/[...path]/route.ts` (লাইন ১–২)
- **সমস্যা:** `export const dynamic = "force-dynamic";` এবং `revalidate = 0` দেওয়া আছে। এর মাধ্যমে কোনো রিড-ওনলি ব্যাকএন্ড ডেটা ফেচ হলেও তা কোনো লেভেলেই ক্যাশ হয় না।
- **সমাধান:** যেসব ব্যাকএন্ড ডেটা স্ট্যাটিক বা সেমি-স্ট্যাটিক, সেগুলোর জন্য `stale-while-revalidate` ক্যাশ হেডার প্রয়োগ করতে হবে যাতে ভার্সেল প্রতিবার অরিজিন ব্যাকএন্ডে হিট না করে।

### [MEDIUM] CDN-06: অন-ডিমান্ড রিভ্যালিডেশনে ডিফল্ট হার্ডকোডেড সিক্রেট ঝুঁকি
- **ফাইল পাথ:** `app/api/revalidate/route.ts` (লাইন ২১), `app/api/cron/warm-news/route.ts` (লাইন ১৭)
- **সমস্যা:** সিক্রেট এনভায়রনমেন্ট ভেরিয়েবল না থাকলে কোডে ফলব্যাক হিসেবে `"totthobox_revalidate_secret_key"` এবং `"totthobox_cron_secret_2026"` হার্ডকোড করা আছে। আক্রমণকারী এই ডিফল্ট সিক্রেট ব্যবহার করে অবিরাম ক্যাশ পার্জ করে ভার্সেল বিলিং বাড়িয়ে দিতে পারে।
- **সমাধান:** হার্ডকোডেড ফলব্যাক সম্পূর্ণ মুছে ফেলতে হবে এবং এনভায়রনমেন্ট ভেরিয়েবল বাধ্যতামূলক করতে হবে।

---

## ৩. Technical SEO & Indexation Audit

### [CRITICAL] SEO-01: সাকুল্যে BreadcrumbList, Article, ও FAQPage JSON-LD স্কিমার অনুপস্থিতি
- **ফাইল পাথ:** `components/seo/`, `app/(main)/`
- **সমস্যা:** বর্তমানে সাইটে শুধুমাত্র `SiteStructuredData` (Organization + WebSite) এবং টুল পেজে সাধারণ স্কিমা আছে। কিন্তু:
  1. কোনো ক্যাটাগরি বা ডিটেইল পেজে `BreadcrumbList` স্কিমা নেই, ফলে গুগলের সার্চ রেজাল্টে সাইট হায়ারার্কি ব্রেডক্রাম্ব দেখায় না।
  2. বাংলাদেশ ইতিহাস, স্থাপনা, পর্যটন, গুণীজন ও সংবাদ পেজে কোনো `Article` বা `NewsArticle` স্কিমা নেই।
  3. ক্যালকুলেটর, কনভার্টার ও গাইডগুলোর ভেতর থাকা প্রশ্নোত্তরে কোনো `FAQPage` স্কিমা নেই।
- **সমাধান:** একটি সেন্ট্রালাইজড এসইও জেনারেটর তৈরি করতে হবে যা স্বয়ংক্রিয়ভাবে রুটের ধরন অনুযায়ী `BreadcrumbList`, `Article`, এবং `FAQPage` JSON-LD ইনজেক্ট করবে।

### [HIGH] SEO-02: সাইটম্যাপের পারফরম্যান্স ও টাইমআউট ঝুঁকি (মডুলার সাইটম্যাপ ইনডেক্সের অভাব)
- **ফাইল পাথ:** `app/sitemap.ts` (লাইন ১–৩৪১)
- **সমস্যা:** একক `sitemap.ts` ফাইলের ভেতর ব্যাকএন্ডের ডজনখানেক এন্ডপয়েন্ট (Holidays, Establishments, History, Introductions, People, Tourism, Islam, Signs, Apps) থেকে পেজ ১-এর ১০০টি করে রেকর্ড ফেচ করা হয় এবং প্রতিটির ওয়ার্ড কাউন্ট যাচাই করা হয়। সাইটের ডেটা বাড়লে এই রিকোয়েস্টটি ১৫ সেকেন্ডে শেষ হবে না এবং ভার্সেল সার্ভারলেস টাইমআউট (HTTP 504) হয়ে সাইটম্যাপ অকার্যকর হয়ে পড়বে।
- **সমাধান:** নেক্সট.জেএস-এর `generateSitemaps` বা আলাদা আলাদা স্লাইসড সাইটম্যাপ (`sitemap-static.xml`, `sitemap-tools.xml`, `sitemap-content.xml`) তৈরি করে একটি রুট `sitemap_index.xml` গঠন করতে হবে।

### [HIGH] SEO-03: ল্যাঙ্গুয়েজ অল্টারনেট ও Hreflang ট্যাগ মিসিং
- **ফাইল পাথ:** `app/layout.tsx`, `lib/seo/`
- **সমস্যা:** রুট মেটাডেটায় `<html lang="bn">` থাকলেও কোনো মেটা অল্টারনেট বা `hreflang` ডিরেক্টিভ নেই (`bn-BD` বা `x-default`)। গুগল আন্তর্জাতিক এবং বাংলাদেশি সার্চ ক্রলারে সঠিক জিও-টার্গেটিং বুঝতে সমস্যার সম্মুখীন হতে পারে।
- **সমাধান:** `app/layout.tsx` এবং পেজ মেটাডেটায় `alternates: { languages: { 'bn-BD': '...', 'x-default': '...' } }` যোগ করতে হবে।

### [HIGH] SEO-04: পেজিনেশন ও কুয়েরি প্যারামিটার এসইও ডুপ্লিকেশন
- **ফাইল পাথ:** `app/(main)/news/headlines/`, `app/(main)/bangladesh/history/page.tsx` ইত্যাদি
- **সমস্যা:** পেজিনেশন রুটগুলোতে (`?page=2`, `?page=3`) ক্যানোনিকাল ট্যাগ অনেক সময় রুট পেজ নির্দেশ করে অথবা সেলফ-রেফারেন্সিং ক্যানোনিকাল পায় না। ফলে গুগল পেজগুলোকে ডুপ্লিকেট হিসেবে চিহ্নিত করতে পারে।
- **সমাধান:** পেজিনেশন থাকলে স্পষ্ট সেলফ-রেফারেন্সিং ক্যানোনিকাল এবং প্রযোজ্য ক্ষেত্রে নো-ইনডেক্স ডিরেক্টিভ প্রয়োগ করতে হবে।

### [MEDIUM] SEO-05: হেডিং হায়ারার্কিতে অসামঞ্জস্যতা (Missing H1/H2 Structure)
- **ফাইল পাথ:** বিভিন্ন কনভার্টার এবং ক্লায়েন্ট কম্পোনেন্ট
- **সমস্যা:** বেশ কিছু ক্লায়েন্ট-রেন্ডারড টুলে সরাসরি `<h3>` দিয়ে সেকশন শুরু হয়েছে অথচ পেজে কোনো একক সুনির্দিষ্ট `<h1>` বা ক্রমান্বয়িক `<h2>` নেই। স্ক্রিন রিডার ও সার্চ ক্রলার হেডিং হায়ারার্কিতে বিভ্রান্ত হয়।
- **সমাধান:** প্রতি পেজে নিশ্চিত করতে হবে একটি মাত্র প্রোপার কিওয়ার্ড-সমৃদ্ধ `<h1>` থাকবে, প্রধান সেকশনে `<h2>`, এবং সাব-সেকশনে `<h3>` থাকবে।

### [MEDIUM] SEO-06: ট্রেইলিং স্ল্যাশ (Trailing Slash) ও ক্যানোনিকাল ইউআরএল অসমতা
- **ফাইল পাথ:** `app/(home)/page.tsx` (লাইন ২৮: `"https://totthobox.com/"`) বনাম অন্যান্য পেজ (`"https://totthobox.com/about-us"`)
- **সমস্যা:** হোমপেজ ট্রেইলিং স্ল্যাশসহ ক্যানোনিকাল দেওয়া, আবার ভেতরের পেজগুলো ট্রেইলিং স্ল্যাশহীন।
- **সমাধান:** পুরো সাইটে ট্রেইলিং স্ল্যাশ বিহীন স্ট্যান্ডার্ডে ইউনিফাই করতে হবে (`https://totthobox.com` এবং `https://totthobox.com/about-us`)।

### [LOW] SEO-07: অপূর্ণ মেটা ডেসক্রিপশন ভ্যারিয়েশন
- **ফাইল পাথ:** বিভিন্ন কনভার্টার সাব-পেজ
- **সমস্যা:** কিছু পরিমাপক কনভার্টারের মেটা ডেসক্রিপশন অত্যন্ত কাছাকাছি বা টেমপ্লেটেড।
- **সমাধান:** প্রতি পেজের জন্য ব্যবহারিক উদাহরণের ভিত্তিতে ইউনিক মেটা ডেসক্রিপশন দিতে হবে।

---

## ৪. AI প্রজেক্ট ও কনটেন্ট কোয়ালিটি অডিট (Helpful Content & YMYL)

### [CRITICAL] AI-01: লেখক ও রিভিউয়ার তথ্যের সম্পূর্ণ অনুপস্থিতি এবং শূন্য অবজেক্ট (Empty Profiles)
- **ফাইল পাথ:** `config/editorial.ts` (লাইন ১৪–২০), `components/AuthorReviewerBlock.tsx` (লাইন ৩০)
- **সমস্যা:** `config/editorial.ts` ফাইলে `EDITORIAL_PROFILES`-এর সবকটি ফিল্ড শূন্য স্ট্রিং:
  ```ts
  general: { name: "", role: "", title: "", bio: "", expertise: [] },
  tax: { name: "", role: "", title: "", bio: "", expertise: [] },
  history: { name: "", role: "", title: "", bio: "", expertise: [] },
  islamic: { name: "", role: "", title: "", bio: "", expertise: [] },
  ```
  এর ফলে `AuthorReviewerBlock`-এর `if (!profile.name.trim() || !profile.bio.trim()) return null;` কন্ডিশনের কারণে পুরো ওয়েবসাইটের কোনো পেজেই লেখক, পর্যালোচক বা সম্পাদকের নাম ও পরিচিতি প্রদর্শিত হয় না! গুগলের E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) নীতি অনুযায়ী এটি বিশাল লঙ্ঘন।
- **সমাধান:** প্রাতিষ্ঠানিক ও বিশেষজ্ঞ সম্পাদকীয় দল, ডেডিকেটেড লেখক, ফ্যাক্ট-চেকার এবং তাদের সুনির্দিষ্ট পরিচয়, ডেজিগনেশন ও বায়ো যুক্ত করতে হবে এবং সাইটে দৃশ্যমান করতে হবে।

### [CRITICAL] AI-02: কোডবেসে অসম্পূর্ণ TODO ও সোর্স/রেফারেন্সের ঘাটতি
- **ফাইল পাথ:** 
  - `app/(main)/bangladesh/history/[slug]/page.tsx` (লাইন ৯৭)
  - `app/(main)/islam/basic/[slug]/page.tsx` (লাইন ১০০)
  - `app/(main)/islam/dowan/[slug]/page.tsx` (লাইন ১১২)
  - `lib/content/sections/bangladesh-history.ts` (লাইন ৫৭)
  - `lib/content/sections/islam-basic.ts` (লাইন ৫৮)
  - `lib/content/sections/islam-dowan.ts` (লাইন ৫৭)
  - `lib/content/tools/tax-vat-calculator.ts` (লাইন ৯৭)
- **সমস্যা:** এই সমস্ত ফাইলে স্পষ্ট কমেন্ট রয়েছে: `TODO(owner): supply page-specific primary source names, URLs and citation notes`। কোনো পাতাতেই প্রাথমিক সোর্স বা প্রাতিষ্ঠানিক রেফারেন্স লিংক নেই।
- **সমাধান:** সমস্ত TODO অপসারন করতে হবে এবং প্রতিটি সংবেদনশীল পেজে সরকারি গেজেট, জাতীয় রাজস্ব বোর্ড (NBR), ইসলামিক ফাউন্ডেশন বাংলাদেশ, বাংলাদেশ জাতীয় তথ্য বাতায়ন ইত্যাদির স্পষ্ট তথ্যসূত্র যুক্ত করতে হবে।

### [HIGH] AI-03: পাতলা কনটেন্ট (Thin Content) ও টেমপ্লেটেড ডেটাবেস রেকর্ড
- **ফাইল পাথ:** `app/(main)/bangladesh/`, `app/(main)/islam/`
- **সমস্যা:** ব্যাকএন্ড থেকে জেনারেট হওয়া বহু রেকর্ডে মাত্র ৫০–১০০ শব্দের বিবরণ রয়েছে। ফ্রন্টএন্ডে `isThinContent(..., 300)` দিয়ে সেগুলোকে `noindex` করা হলেও, ব্যবহারকারী যখন কোনো অভ্যন্তরীণ লিংক ধরে সেই পেজে যান, তখন তিনি হতাশ হন। এটি বাউন্স রেট বাড়ায় এবং সাইটের সামগ্রিক ডোমেন অথরিটিকে ক্ষতিগ্রস্ত করে।
- **সমাধান:** ব্যাকএন্ড জেনারেশন পাইপলাইনে মিনিমাম কোয়ালিটি ফিল্টার প্রয়োগ করতে হবে এবং ফ্রন্টএন্ডে পাতলা পাতার বদলে বিস্তারিত সহায়ক সম্পাদকীয় গাইড প্রদর্শন করতে হবে।

### [HIGH] AI-04: YMYL (ধর্ম, আইন, আয়কর) ক্ষেত্রে হ্যালুসিনেশনের ঝুঁকি
- **ফাইল পাথ:** `app/(main)/islam/`, `app/(main)/tools/tax-vat-calculator/`
- **সমস্যা:** এআই মডেল দিয়ে যদি স্বয়ংক্রিয়ভাবে দোয়ার ফজিলত বা হাদিসের সনদ তৈরি করা হয়, তবে সেখানে ভুল তথ্য বা দুর্বল সূত্র আসার চরম ঝুঁকি থাকে। একইভাবে কর আইনের পুরনো স্ল্যাব ব্যবহার করলে ব্যবহারকারী আর্থিক ক্ষতির মুখে পড়তে পারেন।
- **সমাধান:** YMYL কনটেন্টে কঠোর হিউম্যান-রিভিউ ছাড়া কোনো এআই আউটপুট সরাসরি পাবলিশ না করার পলিসি নির্ধারণ এবং পেজে স্পষ্ট আইনগত ও ধর্মীয় ডিসক্লেইমার যুক্ত রাখা।

### [MEDIUM] AI-05: গুগলের "Helpful Content System" অ্যালগরিদম ঝুঁকি
- **ফাইল পাথ:** সমগ্র প্ল্যাটফর্ম
- **সমস্যা:** সাইট যদি মানুষের সমস্যার সরাসরি বাস্তব সমাধান না দিয়ে কেবল কিওয়ার্ড র‍্যাংক করানোর উদ্দেশ্যে হাজার হাজার পেজ অটোমেট করে, তবে পুরো ডোমেন গুগলের আনহেল্পফুল কনটেন্ট পেনাল্টিতে পড়তে পারে।
- **সমাধান:** প্রতিটি পেজে ব্যবহারিক টুল, ইন্টারঅ্যাক্টিভ ফর্মুলা, সচিত্র গাইড ও ব্যবহারকারীর সুনির্দিষ্ট প্রশ্নের উত্তর নিশ্চিত করা।

---

## ৫. Google AdSense Approval Checklist

| আইটেম / শর্ত | স্ট্যাটাস | বিশ্লেষণ ও করণীয় |
| :--- | :---: | :--- |
| **১. পর্যাপ্ত মৌলিক ও উচ্চমানের কনটেন্ট** | **FAIL** | মূল টুল ও গাইডগুলো ভালো হলেও অনেক ডায়নামিক ডেটাবেস পেজে পর্যাপ্ত লিখিত গভীরতা নেই। লেখক পরিচিতি ব্লক ব্ল্যাঙ্ক থাকায় গুগল একে লো-ভ্যালু বা অটো-জেনারেটেড হিসেবে বাতিল করতে পারে। প্রতিটি পেজে ৪০০+ শব্দের প্রামাণ্য কনটেন্ট ও রেফারেন্স নিশ্চিত করতে হবে। |
| **২. ট্রাস্ট পেজ (About, Contact, Privacy, Terms, Disclaimer, Policy, Author)** | **FAIL** | About, Contact, Privacy, Terms, Disclaimer, Editorial Policy রয়েছে; কিন্তু কোনো **ডেডিকেটেড Author / Editorial Team পেজ নেই**। এছাড়া `config/editorial.ts` সম্পূর্ণ খালি। অবিলম্বে `/author` বা `/editorial-team` পেজ চালু করতে হবে। |
| **৩. স্পষ্ট নেভিগেশন ও ব্রোকেন লিংক মুক্ত ইউআই** | **PARTIAL PASS** | সাইটম্যাপ ও লিংকগুলো সক্রিয়; তবে হোমপেজে মাত্র ১০টি বড় ক্যাটাগরি থাকায় বহু সেবার ডিসকভারেবিলিটি কম। হোমপেজ রিডিজাইন করে ক্যাটাগরিভিত্তিক সেকশন ও সার্চ আনতে হবে। |
| **৪. কপিরাইট ঝুঁকি (News, Live TV, Images)** | **CRITICAL RISK** | ১) `/news/headlines` পেজে বহিরাগত পত্রিকার খবর সংগ্রহ করা হয়। এটি অবশ্যই `noindex` ও কোনো বিজ্ঞাপনবিহীন রাখতে হবে।<br>২) **লাইভ টিভি (Live TV):** অননুমোদিত লাইভ স্ট্রিম থাকলে অ্যাডসেন্স অ্যাকাউন্ট আজীবনের জন্য ব্যান হয়ে যাবে। লাইভ টিভি সেকশনে কখনোই অ্যাডসেন্স স্লট রাখা যাবে না। |
| **৫. Cookie Consent / CMP (GDPR & IAB TCF v2.2)** | **FAIL** | বর্তমানে ব্যবহৃত `CookieSettings.tsx` একটি সাধারণ কাস্টম ব্যানার। ইউরোপীয় অর্থনৈতিক অঞ্চল (EEA) ও যুক্তরাজ্যের জন্য গুগল সার্টিফাইড IAB TCF v2.2 সিএমপি (যেমন Google Funding Choices) বাধ্যতামূলক। অন্যথায় ইউরোপীয় ট্রাফিকের বিজ্ঞাপন বন্ধ থাকবে। |
| **৬. ads.txt সঠিকতা ও ক্লায়েন্ট আইডি মিসম্যাচ** | **FAIL** | `public/ads.txt`-এ পাবলিশার আইডি নেই কারণ `ADSENSE_ENABLED` ফলস ছিল। এছাড়া `.env.local`-এ ভেরিয়েবল নাম `NEXT_PUBLIC_ADSENSE_ID` কিন্তু স্ক্রিপ্ট খোঁজে `NEXT_PUBLIC_ADSENSE_CLIENT`। অবিলম্বে নাম ও এন্ট্রি ঠিক করতে হবে। |
| **৭. অ্যাড স্লট প্লেসমেন্ট ও জিরো লেআউট শিফট (CLS = 0)** | **PARTIAL PASS** | `AdSlot.tsx`-এ ওয়ার্ড কাউন্ট গার্ড (>= ৫০০ শব্দ) রয়েছে, কিন্তু বিজ্ঞাপন লোড হওয়ার সময় ফিক্সড রিজার্ভ হাইট ও "বিজ্ঞাপন" লেবেল স্টাইল আরও নিখুঁত করতে হবে যাতে আকস্মিক ক্লিক (Accidental Click) না ঘটে। |

---

## ৬. UI/UX সমস্যা ও ডিজাইন সিস্টেম মূল্যায়ন

### [CRITICAL] UI-01: হোমপেজের অতিরিক্ত বড় আইকন ও সীমাবদ্ধ ডিসকভারেবিলিটি
- **ফাইল পাথ:** `app/(home)/page.tsx` (লাইন ১৭৭–২১০)
- **সমস্যা:** হোমপেজে মাত্র ১০টি বড় বড় কার্ড গ্রিড আকারে ছড়িয়ে রয়েছে। আইকনগুলো অতিরিক্ত বড় (`w-8 h-8 sm:w-9 sm:h-9` ভেতরে `p-3` প্যাডিং)। ফলে ব্যবহারকারী স্ক্রল না করে দেখতে পান না যে প্ল্যাটফর্মে ৮০টিরও বেশি প্রয়োজনীয় ক্যালকুলেটর, কনভার্টার, ইসলাম ও বাংলাদেশ তথ্য রয়েছে।
- **সমাধান:** বড় কার্ড গ্রিড তুলে দিয়ে একটি কমপ্যাক্ট, আধুনিক ও ক্যাটাগরিভিত্তিক গ্রিড লেআউট তৈরি করতে হবে। আইকন সাইজ হবে ৩২–৪০px (ইনলাইন ২০px), এবং প্রতিটি ক্যাটাগরিতে (যেমন: ক্যালকুলেটর, কনভার্টার, বাংলাদেশ, বিশ্বকোষ, ইসলামিক জ্ঞান, সফটওয়্যার ইত্যাদি) ৪–৮টি কমপ্যাক্ট আইটেম সহ "সব দেখুন" লিংক থাকবে।

### [HIGH] UI-02: মোবাইল নেভিগেশন ও বটম বার (Bottom Navigation Bar) মিসিং
- **ফাইল পাথ:** `components/Navbar.tsx`, `components/NavbarHeader.tsx`
- **সমস্যা:** স্মার্টফোন ব্যবহারকারীদের জন্য এক হাতে ব্রাউজ করার সুবিধাজনক কোনো ফিক্সড বটম নেভিগেশন বার নেই। ব্যবহারকারীকে প্রতিবার ওপরে স্ক্রল করে মেনু খুঁজতে হয়।
- **সমাধান:** মোবাইল স্ক্রিনে (md-এর নিচে) একটি প্রিমিয়াম ফ্লোটিং/ফিক্সড বটম বার যুক্ত করতে হবে (হোম, সকল সেবা, দ্রুত সার্চ, বুকমার্ক/টুলস, মেনু)।

### [HIGH] UI-03: দ্রুত অনুসন্ধান (Quick Search Modal / Cmd+K) অ্যাক্সেসিবিলিটি
- **ফাইল পাথ:** `components/search/`, `components/NavbarHeader.tsx`
- **সমস্যা:** কিবোর্ড শর্টকাট (Ctrl/Cmd + K) দিয়ে যেকোনো টুল এক সেকেন্ডে খুঁজে পাওয়ার সুবিধা সাধারণ হোমপেজে তাৎক্ষণিকভাবে প্রমিনেন্ট নয়।
- **সমাধান:** হোমপেজের হিরো সেকশন এবং স্টিকি নেভিগেশনে একটি সার্বক্ষণিক সার্চ ট্রিগার যুক্ত করতে হবে।

### [MEDIUM] UI-04: ট্রেন্ডিং ও সর্বাধিক ব্যবহৃত টুলের অভাব
- **ফাইল পাথ:** `app/(home)/page.tsx`
- **সমস্যা:** নিয়মিত ব্যবহারকারীরা কোন টুলগুলো বেশি পছন্দ করছেন (যেমন: জমির হিসাব, বয়স ক্যালকুলেটর, আয়কর, ছুটির তালিকা) তা হোমপেজে এক নজরে পাওয়ার কোনো "ট্রেন্ডিং সেবা" সেকশন নেই।
- **সমাধান:** হোমপেজের শীর্ষভাগে একটি স্লিক "জনপ্রিয় ও ট্রেন্ডিং টুলস" কারোজল বা ব্যাজ সেকশন যুক্ত করতে হবে।

### [MEDIUM] UI-05: কালার কন্ট্রাস্ট, ডার্ক মোড বর্ডার ও বাংলা টাইপোগ্রাফি ব্যালেন্স
- **ফাইল পাথ:** `app/globals.css`, বিভিন্ন কার্ড কম্পোনেন্ট
- **সমস্যা:** কিছু কিছু সাব-টেক্সটে `text-zinc-400` বা `text-zinc-500` ব্যবহারের কারণে লাইট মোডে WCAG 2.1 AA কনট্রাস্ট রেশিও (4.5:1) বজায় থাকে না। এছাড়া ডার্ক মোডে কিছু ব্যাকগ্রাউন্ড ওভারলেতে টেক্সট পড়া কষ্টকর।
- **সমাধান:** ডিজাইন টোকেন সুনির্দিষ্ট করে টেক্সট কন্ট্রাস্ট অনুপাত ন্যূনতম 4.5:1 নিশ্চিত করা এবং লাইন-হাইট ১.৭৫ স্ট্যান্ডার্ডে আনা।

---

## ৭. Security & Reliability Audit

### [CRITICAL] SEC-01: `.env.local` ফাইলে প্রোডাকশন সিক্রেট ও প্রাইভেট কী এক্সপোজার
- **ফাইল পাথ:** `.env.local` (লাইন ৪–৫, লাইন ৫২–৫৩)
- **সমস্যা:** `.env.local` ফাইলে লাইভ VAPID প্রাইভেট কী (`VAPID_PRIVATE_KEY=sprfii...`) এবং গিটহাব ক্লায়েন্ট সিক্রেট (`GITHUB_CLIENT_SECRET=1bfa...`) কমিটযোগ্য অবস্থায় রয়েছে। যদিও `.gitignore`-এ `.env.local` ইগনোর করা থাকে, এটি কোনোভাবে পুশ হলে বড় ধরনের নিরাপত্তা বিপর্যয় ঘটতে পারে।
- **সমাধান:** `.env.example` আপডেট করে প্রজেক্টের সমস্ত সেনসিটিভ কী ভার্সেল ড্যাশবোর্ডে এনভায়রনমেন্ট ভেরিয়েবল হিসেবে সেট করতে হবে এবং লোকাল ডিরেক্টরি থেকে প্রোডাকশন সিক্রেট সরাতে হবে।

### [HIGH] SEC-02: মিসিং রাউট লোডিং বাউন্ডারি (`loading.tsx`) ও স্কেলিটন স্টেট
- **ফাইল পাথ:** `app/(main)/tools/`, `app/(main)/converter/`, `app/(main)/bangladesh/`, `app/(main)/islam/`
- **সমস্যা:** পুরো প্রজেক্টের ৮০টিরও বেশি রুটের মধ্যে মাত্র ৩টি সংবাদ রুটে `loading.tsx` রয়েছে। ব্যবহারকারী যখন কোনো লিংকে ক্লিক করেন, পেজটি লোড হতে ২–৩ সেকেন্ড লাগলে স্ক্রিন ফ্রিজ হয়ে থাকে, কোনো ভিজ্যুয়াল ফিডব্যাক থাকে না।
- **সমাধান:** প্রধান রাউট সেগমেন্টগুলোতে রুট-লেভেল ও সেকশন-লেভেল `loading.tsx` স্কেলিটন বাউন্ডারি যুক্ত করতে হবে।

---

## অগ্রাধিকারভিত্তিক অ্যাকশন প্ল্যান (Prioritized Fix Plan)

### ধাপ ১: UI/UX সম্পূর্ণ আধুনিকায়ন (Phase 2)
1. **ডিজাইন সিস্টেম টোকেন:** Tailwind ও CSS ভেরিয়েবল দিয়ে কালার, স্পেসিং, বর্ডার রেডিয়াস, টাইপোগ্রাফি (Hind Siliguri + Noto Sans Bengali) সুনির্দিষ্ট করা।
2. **হোমপেজ রিডিজাইন:**
   - বড় আইকন বাদ দিয়ে কমপ্যাক্ট গ্রিড (৩২–৪০px কার্ড আইকন)।
   - সার্ভিসগুলোকে সুনির্দিষ্ট ক্যাটাগরিভিত্তিক সেকশনে ভাগ করা (ক্যালকুলেটর, কনভার্টার, বাংলাদেশ, আন্তর্জাতিক/বিশ্বকোষ, ইসলামিক জ্ঞান, সফটওয়্যার ডিরেক্টরি, জরুরি সেবা)।
   - স্টিকি ক্যাটাগরি নেভিগেশন + কুইক সার্চ (Cmd/Ctrl + K)।
   - মোবাইল বটম নেভিগেশন বার (Bottom Nav Bar)।
   - ট্রেন্ডিং সেবা ও স্কেলিটন লোডিং স্টেট।
   - জিরো লেআউট শিফট বিশিষ্ট অ্যাড স্পেস রিজার্ভেশন।

### ধাপ ২: টেকনিক্যাল এসইও ও পারফরম্যান্স বাস্তবায়ন (Phase 3)
1. গ্লোবাল লেআউট থেকে গুগল ট্রান্সলেট অটোরান দূর করে অন-ডিমান্ড করা।
2. JSON-LD স্কিমা জেনারেটর যুক্ত করা (`BreadcrumbList`, `Article`, `FAQPage`)।
3. সাইটম্যাপকে মডুলার ইনডেক্স ও ক্যাশ-অপ্টিমাইজড গঠনে আনা।
4. মেটা অল্টারনেট (`hreflang="bn-BD"`) এবং ট্রেইলিং স্ল্যাশ ফিক্স করা।
5. সমস্ত পেজে সিঙ্গেল `<h1>` ও রেসপন্সিভ হেডিং কনফার্ম করা।

### ধাপ ৩: Google AdSense ও পলিসি পেজ প্রস্তুতি (Phase 4)
1. ডেডিকেটেড `/editorial-team` বা `/authors` পেজ তৈরি করা এবং `EDITORIAL_PROFILES`-এ প্রামাণ্য সম্পাদকদের পরিচিতি যুক্ত করা।
2. `public/ads.txt` ফাইলটি সঠিক ফরম্যাটে আপডেট করা (`google.com, pub-9522604367420521, DIRECT, f08c47fec0942fa0`)।
3. এনভায়রনমেন্ট ভেরিয়েবল সমন্বয় (`NEXT_PUBLIC_ADSENSE_CLIENT` ও `NEXT_PUBLIC_ADSENSE_ID`)।
4. ঝুঁকিপূর্ণ পেজে (`/news/*`, `/ai/*`, লাইভ টিভি) নো-ইনডেক্স ও অ্যাড-ফ্রি সুরক্ষা বলবত রাখা।
5. AdSlot কম্পোনেন্টে ফিক্সড রিজার্ভ হাইট ও অ্যাকসিডেন্টাল ক্লিক প্রতিরোধ নিশ্চিত করা।

### ধাপ ৪: AI কনটেন্ট কোয়ালিটি গেট ও ব্যাকএন্ড সমন্বয় (Phase 5)
1. সমস্ত ফাইলে থাকা `TODO(owner)` মুছে নির্ভরযোগ্য সরকারি ও প্রামাণ্য সোর্স/রেফারেন্স যুক্ত করা।
2. পাতলা কনটেন্ট শনাক্তকরণ চেক এবং ফ্রন্টএন্ডে ইউজার-ফার্স্ট সহায়ক কনটেন্ট এনরিচমেন্ট।
3. শেষ আপডেট এবং লেখক/পর্যালোচকের স্পষ্ট বাইলাইন দৃশ্যমান করা।

### ধাপ ৫: বিল্ড, টাইপচেক ও ফাইনাল রিপোর্ট (Phase 6)
1. `npm run lint`, `npx tsc --noEmit`, এবং `npm run build` চালিয়ে শতভাগ ত্রুটিমুক্ত নিশ্চিত করা।
2. এসইও ভেরিফিকেশন ও রেসপন্সিভ টেস্ট পরিচালনা করা।
3. `FINAL_REPORT.md` তৈরি করে লাইভ ডিপ্লয়মেন্ট গাইডলাইন প্রদান করা।

---

## ৮. UI Responsive, Design Tokens & Component Audit (Branch: fix/ui-responsive-audit-2026)

| ID | Page / Component | Problem | Breakpoint | Severity | Fix Applied | File(s) Changed | Verified |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| UI-01 | `components/navigation/StickyCategoryNav.tsx` | Sticky nav top offset was `top-14` (56px) while the primary navbar is `h-16` (64px), causing an 8px overlap with the sticky header on scroll. | All (Sticky mode) | High | Updated offset from `top-14` to `top-16` to seamlessly dock directly below the 64px navbar. | `components/navigation/StickyCategoryNav.tsx` | Yes |
| UI-02 | `components/Footer.tsx` | Footer lacked bottom clearance on mobile screens where fixed `MobileBottomNav` (64px) is rendered, occluding social links and copyright notice on mobile devices. | Mobile (<768px) | High | Added `pb-24 md:pb-8` to ensure clean 96px clearance above the mobile bottom nav on phone viewports. | `components/Footer.tsx` | Yes |
| UI-03 | Design System (Global) | 245+ arbitrary pixel values (`w-[*px]`, `h-[*px]`, `p-[*px]`, `m-[*px]`, `gap-[*px]`, `min-w-[*px]`, `min-h-[*px]`, `text-[*px]`) across 59+ files violating design system tokens. | All | Medium | Automated script `scripts/fix-design-tokens.mjs` mapped and replaced all arbitrary values with standard Tailwind v4 tokens (`min-h-11`, `size-11`, `text-2xs`, `gap-2`, etc.). | 59+ files in `app/` and `components/` | Yes |
| UI-04 | `scripts/lint-design-tokens.mjs` | Linter was scoped to only 21 UI files in `components/ui`, `components/layout`, `components/home`, `components/navigation`. | N/A | Medium | Expanded linter to recursively audit all 288 files across entire `components/` and `app/` trees. | `scripts/lint-design-tokens.mjs` | Yes (288 files clean) |
| UI-05 | `components/tools/ImageResizer.jsx`, `QRGenerator.jsx`, `WordCounter.jsx` | Unstandardized heights (`h-[180px]`, `h-[220px]`, `h-[160px]`). | All | Low | Standardized to `min-h-44`, `min-h-56`, and `min-h-40`. | `components/tools/ImageResizer.jsx`, `QRGenerator.jsx`, `WordCounter.jsx` | Yes |
| UI-06 | `app/(auth)/login/LoginContent.tsx` | Direct HTML `<img>` tag used for user avatars instead of Next.js optimized `<Image />`. | All | Medium | Converted to `<Image ... unoptimized />` with explicit dimensions to maintain Next.js optimization and prevent layout shifts. | `app/(auth)/login/LoginContent.tsx` | Yes |
| UI-07 | `components/news/NewsHeadlines.tsx`, `news/headlines/[slug]`, `news/headlines/story/[slug]` | Unoptimized `<img>` tags on news thumbnails and story featured images. | All | Medium | Replaced with Next.js `<Image />` component with `unoptimized` flag, responsive widths, and explicit height attributes. | `components/news/NewsHeadlines.tsx`, `app/(main)/news/headlines/[slug]/page.tsx`, `app/(main)/news/headlines/story/[slug]/page.tsx` | Yes |
| UI-08 | `components/messaging/ChatApp.tsx`, `components/notifications/NotificationModal.tsx`, `components/search/SearchResultItem.tsx` | Direct `<img>` tags for user avatars and search thumbnails. | All | Medium | Migrated to Next.js `<Image />` with proper fallback handling and size tokens. | `components/messaging/ChatApp.tsx`, `components/notifications/NotificationModal.tsx`, `components/search/SearchResultItem.tsx` | Yes |
| UI-09 | `next.config.ts` & Image Optimization | Unoptimized images used across components bypass Next.js image optimization. | All | High | Removed `unoptimized` flag from all `<Image />` tags; configured `images.remotePatterns` with wildcards for Google, GitHub, and external CDNs. | `next.config.ts`, `app/(auth)/login/LoginContent.tsx`, `components/news/NewsHeadlines.tsx`, `components/messaging/ChatApp.tsx`, `components/notifications/NotificationModal.tsx`, `components/search/SearchResultItem.tsx`, `app/(main)/news/headlines/` | Yes |
| UI-10 | WCAG AA Contrast | Text elements using `text-zinc-400` on white backgrounds in light mode violated WCAG AA 4.5:1 minimum contrast. | Light mode | Medium | Updated to `text-zinc-500 dark:text-zinc-400` (4.64:1 light, 5.45:1 dark) ensuring full AA contrast compliance. | `components/navigation/StickyCategoryNav.tsx`, `components/notifications/NotificationModal.tsx`, `components/international/CountryGrid.tsx`, `components/auth/LoginModal.tsx`, `components/pdf-editor/Toolbar.tsx` | Yes |
| UI-11 | `components/UserAnalytics.tsx` | Component rendered `null` when loading, then popped in once API responded, causing visual layout shift (CLS). | Mobile & Desktop | High | Replaced `null` with reserved animated skeleton pill container (`h-10 w-64`) ensuring zero layout shift (CLS = 0.00). | `components/UserAnalytics.tsx` | Yes |
| UI-12 | Viewport Overflow & Responsiveness | Need comprehensive multi-viewport regression audit across all 9 target viewports. | 320 to 1536px | Critical | Automated Playwright visual regression test executed: 126/126 passed with 0 horizontal overflow and authentic Bengali typography. | `scripts/test-visual-regression.mjs` | Yes (126/126) |
| UI-13 | `app/(home)/layout.tsx`, `app/(main)/layout.tsx` | Unconstrained flex wrappers without `min-w-0 w-full max-w-full` allowed intrinsic child widths (pills, search) to expand the page to 1009px on mobile/tablet viewports. | Mobile & Tablet (320px–820px) | Critical | Added `w-full max-w-full min-w-0 overflow-x-clip` to outer wrappers, docking all main page sections inside the exact device viewport width. | `app/(home)/layout.tsx`, `app/(main)/layout.tsx` | Yes |
| UI-14 | `components/home/CategorySection.tsx`, `TrendingServices.tsx` | 4-column layout on <390px phones compressed cards to ~65px width, causing severe multi-line clipping on Bengali tool titles. | Mobile (<390px) | High | Calibrated grid to `grid-cols-3 min-[390px]:grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10` providing comfortable 85-95px card widths on small mobile screens. | `components/home/CategorySection.tsx`, `components/home/TrendingServices.tsx` | Yes |
| UI-15 | `components/navigation/StickyCategoryNav.tsx` | Horizontal scrollable category pill container lacked `min-w-0 flex-1`, causing parent container to expand to total pill row width (1031px). | Mobile & Tablet | High | Added `min-w-0 flex-1` allowing smooth touch scrolling within viewport boundaries. | `components/navigation/StickyCategoryNav.tsx` | Yes |
| UI-16 | `components/tools/PercentageCalculator.jsx`, `QRGenerator.jsx`, `practices/FloatingToolbar.tsx` | `min-w-max` tabs and unconstrained absolute bottom toolbar caused horizontal overflow on narrow mobile screens. | Mobile (320px–390px) | Medium | Converted `min-w-max` to `w-fit` and bounded FloatingToolbar to `max-w-[calc(100vw-2rem)]` with `overflow-x-auto`. | `PercentageCalculator.jsx`, `QRGenerator.jsx`, `FloatingToolbar.tsx` | Yes (47/47 PASS) |

