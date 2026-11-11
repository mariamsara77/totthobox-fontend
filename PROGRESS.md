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
- [ ] Audit `next/image` width/height and priority on LCP
- [ ] Audit `next/font` with `display: swap`
- [ ] Dynamic import heavy libraries (pdf, mammoth, ffmpeg)
- [ ] Git commit `phase-9: performance and Core Web Vitals optimizations`

### Phase 10: Structured Data & Linking
- [x] Organization & WebSite JSON-LD already present in the root layout
- [x] Existing detail-page BreadcrumbList and Tool WebApplication schema retained
- [x] Existing news detail NewsArticle schema retained
- [ ] Visual breadcrumbs and schema coverage still need a route-by-route validation
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
