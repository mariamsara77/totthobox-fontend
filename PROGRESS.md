# Totthobox SEO & AdSense Compliance Progress

## Checklist

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
- [ ] Bangla-aware word counter helper `lib/seo/word-count.ts`
- [ ] Auto `robots: noindex, follow` and ad suppression if content < 300 words
- [ ] Verify `noindex, nofollow` on private/auth/settings/ai/messages routes
- [ ] Dynamic `app/sitemap.ts` and `app/robots.ts` excluding noindex pages
- [ ] Run `npm run lint` & `npm run build` for Phase 5
- [ ] Git commit `phase-5: indexing control and thin guard`

### Phase 6: Content Depth (Tools & Converters)
- [ ] Reusable `<PageContent>` server layout
- [ ] 700-1200 words of unique Bangla guide for 10 tools and 18 converters (3+ examples, 5+ FAQs, JSON-LD)
- [ ] Editorial wrappers & FAQs for listing pages (600+ words)
- [ ] Duplicate-sentence checker script (fails on > 10% overlap)
- [ ] Drafts in `/content-drafts/` for thin records
- [ ] Git commit `phase-6: rich content depth for tools and converters`

### Phase 7: Trust, Authorship & YMYL Safety
- [ ] Author/reviewer block on content pages (`config/editorial.ts` fallback)
- [ ] Sources section on Islamic, Tax, Health, Emergency, and History pages
- [ ] Reusable `<Disclaimer type="...">` component (tax, islamic, health, emergency, general)
- [ ] Software official download links only disclaimer & verification
- [ ] Git commit `phase-7: trust authorship and ymyl disclaimers`

### Phase 8: Ad Slots & Compliance
- [ ] Single `<AdSlot>` component (guarded by `NEXT_PUBLIC_ADS_ENABLED=false`, thin-page guard, max 3 slots, no CLS)
- [ ] Place AdSlots only on verified slot candidates
- [ ] Git commit `phase-8: ad slots compliance and inventory protection`

### Phase 9: Performance Optimization
- [ ] Audit `next/image` width/height and priority on LCP
- [ ] Audit `next/font` with `display: swap`
- [ ] Dynamic import heavy libraries (pdf, mammoth, ffmpeg)
- [ ] Git commit `phase-9: performance and Core Web Vitals optimizations`

### Phase 10: Structured Data & Linking
- [ ] Visual breadcrumbs + `BreadcrumbList` schema
- [ ] Organization & WebSite schema on homepage; Article & WebApplication on inner pages
- [ ] Git commit `phase-10: json-ld schemas and internal navigation`

### Phase 11: Final Verification & Audit
- [ ] Verification script `scripts/audit-pages.mjs`
- [ ] Run cache warm script and audit
- [ ] Generate `AUDIT_REPORT.md`, `AUDIT_RESULTS.md`, `PERFORMANCE_REPORT.md`
- [ ] Git commit `phase-11: final verification and audit report`

---

## NEXT STEP
Execute Phase 5: Indexing Control & Thin-Page Guard
1. Create Bangla-aware word counter helper `lib/seo/word-count.ts`
2. Implement thin-page guard on all `[slug]` pages (< 300 words => `robots: { index: false, follow: true }`)
3. Enforce `noindex, nofollow` on private/auth/settings/ai/messages routes
4. Dynamic `app/sitemap.ts` and `app/robots.ts` ensuring clean crawl coverage
