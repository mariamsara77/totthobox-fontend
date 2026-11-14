# Totthobox SEO & AdSense Compliance Progress

## Checklist

### Search Console Optimization Pass
- [x] **Group 1 (/international/country/[slug]):** Direct-answer "দ্রুত তথ্য" block under H1 with H2 questions ("{দেশ}-এর আয়তন কত?", "{দেশ}-এর জনসংখ্যা কত?", "{দেশ} কোন মহাদেশে অবস্থিত?", "{দেশ}-এর রাজধানীর নাম কী?"), title <= 60 chars, description 120-160 chars, 3-4 related country internal links, FAQPage JSON-LD synchronized with direct answers, all 600+ words editorial text retained. (DONE)
- [x] **Group 2 (Land converter, Percentage tool, Number to word):** Land tables computed from repo constants (1 shotangsho = 435.6 sq ft, 1 katha = 720 sq ft, 1-100 shotangsho anchor table, mini tables), direct answers for 4/20 shotangsho, percentage & number-to-word worked examples and metadata update. (DONE)
- [x] **Group 3 (Holiday pages):** Holiday detail date+weekday+holiday status direct sentence under H1, today's Bangla date server-rendering island, last updated display. (DONE)
- [x] **Group 4 (Software/fonts):** Additive info, install steps, FAQ, and SOFTWARE_AUDIT.md scan of all download links. (DONE)
- [x] **Group 5 (Bangladesh info pages & signs):** Direct answers under H1 from record fields only; missing data logged to SEO_CHANGELOG.md. (DONE)
- [x] **Group 6 (Verification, Build & Report):** check-seo.mjs (20/20 pass), curl live test on 2 URLs per group (all 200, 1 H1, valid JSON-LD), lint (0 errors), production build (606 static pages generated). (DONE)

### Polish Pass: Analytics, Visitor Tracking, SEO, Sitemap & Responsive UI/UX
- [x] **Phase P1 (Analytics + Tag Manager):** Single GTM container (`GTM-5RFHKJJJ`) via `next/script` (`strategy="afterInteractive"`) + `<noscript>` fallback; duplicate GA4 script eliminated; Consent Mode v2 default denied + dynamic updates; `<RouteTracker>` SPA pageview tracking; shared event helpers in `lib/analytics.ts`; noise excluded (/offline, /auth/*, /settings/*, bots); `ANALYTICS_SETUP.md` created.
- [x] **Phase P2 (Custom Visitor Tracking):** First-party privacy-safe `lib/visitor-tracker.ts` + `<VisitorTracker>` component; anonymous visitor ID + 30-min session ID + PWA detection; sendBeacon/fetch-keepalive on idle; 60s tab visibility heartbeat; `UserAnalytics.tsx` renders only real API stats and hides if unavailable (no fake fallbacks); API proxy routes added; backend contract documented in `BACKEND_CHANGES.md`.
- [x] **Phase P3 (SEO + Sitemap):** `metadataBase`, `bn_BD` locale, title template, OG/Twitter image; zero `keywords` meta tags across pages; clean canonicals stripping tracking params; `app/robots.ts` disallowing private routes; `app/sitemap.ts` with real API `lastModified`; 404 page navigation shortcuts + view tracking; `scripts/check-seo.mjs` passes 20/20 routes.
- [x] **Phase P4 (UI/UX Sizing, Padding & Responsive):** Global CSS tokens, Bangla line-height (1.75), clamp() headings, responsive table containers; shared layout components (`PageContainer`, `Section`, `Card`, `PageHeader`); `scripts/check-responsive.mjs` Playwright audit across 5 viewports (360, 390, 768, 1024, 1440px); zero horizontal overflow; all tap targets >= 44px (calendar >= 40px); audit screenshots saved and verified.
- [x] **Phase P5 (Final Verification):** `npm run lint` (0 errors), `npm run build` (0 errors), `npm run test:pwa-cache` (pass), `scripts/check-seo.mjs` (pass), `scripts/check-responsive.mjs` (pass); `AUDIT_REPORT.md` updated with full Polish Pass details and env requirements.
- [x] **Service Worker & Visitor Tracking Fix:** Fixed `sw.js` `ReferenceError: publicDocumentPath is not defined` by embedding inline self-contained RegExp pattern matching in `next.config.ts` Workbox `runtimeCaching`; added explicit NetworkOnly handler for `/api/*` (GET & POST) and excluded `/api/` from HTML document caching; added defense fallback in `sw-cache-cleanup.js`.
- [x] **Visitor Tracking Consolidation (Zero New Laravel Work):** Consolidated duplicate trackers into single `<DeferredVisitorTracker />` (retaining consent check, idle sendBeacon/fetch-keepalive, tab visibility heartbeat, and bot filter); purged obsolete `lib/tracker.ts` and `components/VisitorTracker.tsx`; pointed `/api/analytics/pageview` and `/api/analytics/heartbeat` proxy routes to existing Laravel `/tracking/event` & `/tracking/sync-pwa`; pointed `/api/analytics/stats` to `/analytics/user-count`; verified live curl tests against real backend (real HTTP 200 responses with exact data).

### Phase 1: Trust & Compliance Files
- [x] Create `public/ads.txt`
- [x] Remove global meta keywords from `app/layout.tsx`
- [x] Create `/editorial-policy` page (`app/(home)/editorial-policy/page.tsx`)
- [x] Update `/privacy-policy` with AdSense, vendor, CMP and opt-out links
- [x] Rewrite `/about-us` (authentic mission, editorial team, verification, SSR, no fake stats)
- [x] Update `/contact-us` with real contact channels and editorial grievance contact
- [x] Update `/disclaimer` (general, tax, Islamic, emergency, calculation estimates)
- [x] Update `components/Footer.tsx` with all policy and compliance links
- [x] Run `npm run lint` & `npm run build` for Phase 1
- [x] Git commit `c490b7b` (`phase-1: trust and compliance files`)

### Phase 2: Fake Claims & Client-Only Rendering Fix
- [x] Remove `113.29k+` fallback and `লক্ষাধিক মানুষ` claim from Home & `UserAnalytics`
- [x] Remove hardcoded stats (110k, 12.5k, etc.) from `AboutUs`
- [x] SSR initial contacts in `/contact/[slug]`
- [x] SSR initial signs list in `/signs/[category]`
- [x] SSR current holidays and editorial guide in `/bangla/calendar`
- [x] Run `npm run lint` & `npm run build` for Phase 2
- [x] Git commit `0d74229` (`phase-2: fake claims removal and server-side rendering fixes`)

### Phase 3: Caching Architecture (Data Always Cached)
- [x] Central API fetcher `lib/api/fetcher.ts` with `next: { revalidate, tags }`
- [x] Cache TTL constants and tags in `lib/cache-config.ts`
- [x] Helper `lib/api/slugs.ts` for build-time slug collection with timeout guard
- [x] `generateStaticParams` & `dynamicParams = true` across all dynamic routes (600 static pages generated)
- [x] On-demand revalidation endpoint `app/api/revalidate/route.ts` (POST, `REVALIDATE_SECRET`)
- [x] Cache warming script `scripts/warm-cache.mjs` and npm script `npm run warm`
- [x] Hourly news warming cron `app/api/cron/warm-news/route.ts` (`CRON_SECRET`)
- [x] News headlines set to 1 hour (3600s) cache with `noindex`
- [x] `next.config.ts` cache headers, compression, and `poweredByHeader: false`
- [x] `BACKEND_CHANGES.md` documenting Laravel Model Observers, response caching, and `/api/sitemap-data`
- [x] Run `npm run lint` & `npm run build` for Phase 3 (exit 0)
- [x] Git commit `phase-3: caching architecture and static params generation`

### Phase 4: Infinite Scroll with SEO-Safe Pagination
- [x] Create reusable `<InfiniteList>` component with IntersectionObserver (rootMargin ~600px)
- [x] Cached feed route handlers `/api/feed/[type]?page=N` (s-maxage + stale-while-revalidate)
- [x] Crawlable `<a href="?page=N">` pagination fallback links with correct canonical
- [x] Accessible `aria-live`, keyboard fallback button, no layout shift (reserved skeleton heights)
- [x] Run `npm run lint` & `npm run build` for Phase 4 (0 errors, 600 static pages generated)
- [x] Git commit `phase-4: infinite scroll and crawlable pagination`

### Phase 5: Indexing Control & Thin-Page Guard
- [x] Bangla-aware word counter helper `lib/seo/word-count.ts`
- [x] Auto `robots: noindex, follow` and ad suppression if content < 300 words
- [x] Verify `noindex, nofollow` on private/auth/settings/ai/messages routes
- [x] Dynamic `app/sitemap.ts` and `app/robots.ts` excluding noindex pages
- [x] Run `npm run lint` & `npm run build` for Phase 5 (0 errors, 600 static pages)
- [x] Git commit `phase-5: indexing control and thin guard`

### Phase 6: Content Depth (Tools & Converters)
- [x] Reusable `<ToolGuide>` and `<EditorialSection>` server layout components
- [x] 700-1200 words of unique Bangla guide for 10 tools and 17 converters (3+ examples, 5+ FAQs, JSON-LD FAQPage schema)
- [x] Editorial wrappers & FAQs for listing pages (Holidays, Establishments, History, Intro, Figures, Tourism, Dialing Codes, World Clock, Forex, Islam, Signs, Software)
- [x] Duplicate-sentence checker script `scripts/check-duplicate-sentences.mjs` (audited 40 content files, passed < 10% overlap threshold)
- [x] Drafts & editorial expansion templates in `/content-drafts/` for thin records
- [x] Content count audit script `scripts/count-content-pages.mjs` (40 comprehensive content files)
- [x] Run `npm run lint` & `npm run build` for Phase 6 (0 errors, 600 static pages)
- [x] Git commit `phase-6: rich content depth for tools and converters`

### Phase 7: Trust, Authorship & YMYL Safety
- [ ] TODO(owner): supply actual author/editor names, approved bios, reviewer identities and verified credentials; byline component remains hidden until supplied
- [ ] TODO(owner): provide or approve page-specific primary source links and citation notes for History, Islamic basics, dua and Tax/VAT
- [x] General Islamic caution/disclaimer retained; exact sources remain TODO(owner) and are not displayed until supplied
- [x] Cookie Policy and Copyright/DMCA contact-guidance pages linked from the public footer
- [ ] TODO(owner): supply real named reviewers/credentials and record-level primary references
- [ ] Verify the published contact mailbox and legal wording
- [ ] Software source attribution and emergency/health record-level references still require owner/backend review

### Phase 8: Ad Slots & Compliance
- [x] Environment-gated AdSense script and publisher meta (no fallback publisher ID)
- [x] Consent-gated AdSense/GA4/GTM and first-party visitor analytics
- [x] Server-side `<AdSlot>` eligibility guard: article/guide only, 500+ publisher words, no search/filter/private/error/tool pages
- [ ] No ad slot IDs or page placements were found; add placements only after real slot IDs and page-level editorial approval
- [ ] Install and verify a Google-certified CMP with IAB TCF for EEA/UK/Switzerland before setting `ADSENSE_CMP_READY=true`
- [ ] Git commit and preview verification required before enabling production ads

### Phase 9: Performance Optimization
- [x] Audit `next/image` width/height, sizes, and priority on LCP
- [x] Audit `next/font` with `display: swap`
- [x] Dynamic import heavy libraries (pdf, mammoth, ffmpeg)
- [x] Git commit `phase-9: performance and Core Web Vitals optimizations`

### Phase 10: Structured Data & Linking
- [x] Organization & WebSite JSON-LD already present in the root layout
- [x] Existing detail-page BreadcrumbList and Tool WebApplication schema retained
- [x] Existing news detail NewsArticle schema retained
- [x] Visual breadcrumbs and schema coverage validated across all detail and listing routes
- [ ] Article/VideoObject coverage only where the matching publisher-owned content exists

### Phase 11: Final Verification & Audit
- [x] CI includes lint, explicit TypeScript check, production build and PWA cache-security test
- [ ] CI must pass on the Pull Request before merge approval
- [ ] Run cache warm script and route-level live audit in Preview
- [ ] Generate final AdSense, SEO and Core Web Vitals reports after Preview review
- [ ] Test 320 / 375 / 768 / 1024 / 1440 px and keyboard/screen-reader flows

---

## NEXT STEP
1. Review CI results and the Vercel Preview before considering merge.
2. Install and verify a Google-certified CMP with IAB TCF, then wire its signals into the consent gate before enabling AdSense.
3. Confirm real editorial contacts, named reviewers/credentials, record-level sources, formal copyright-agent details and channel/content rights.
4. Complete browser checks for 320 / 375 / 768 / 1024 / 1440 px, keyboard navigation and real-user Core Web Vitals.
5. Keep Phase 9 and the remaining Phase 10/11 checks open until measured and reported.
