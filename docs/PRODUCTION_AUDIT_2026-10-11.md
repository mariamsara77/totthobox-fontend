# Totthobox Production Readiness Audit

- Audit date: 2026-10-11
- Branch: `fix/sidebar-seo-mainline-2026`
- Repository: https://github.com/mariamsara77/totthobox-fontend
- Production domain: https://totthobox.com
- Latest source/build commit checked: `87144ac7948af5861427189b0786d4f1e8989c91`
- Latest Vercel preview checked: https://totthobox-fontend-pszsow8o9-totthobox.vercel.app/
- Status: **improved and preview-buildable; not certified 100% production-ready**
- Production has not been promoted by this audit.

## Executive summary

SEO metadata, canonical host configuration, service-worker cache safety, consent gating, reduced-motion/focus styles, and the cookie-preferences dialog have received source-level fixes. The latest Vercel preview build reached READY; Vercel logs report successful compilation and TypeScript, followed by static page generation. The branch preview is not the production deployment.

The sitemap structure and a representative public-route sample were verified directly. A full URL-by-URL route crawl and four real Lighthouse runs are configured in `.github/workflows/lighthouse-audit.yml`; the generated result file was not yet available when this report was updated. Do not infer Lighthouse scores from a successful Next.js build.

## 1. SEO, metadata, canonical host, and sitemap

### Verified

- The preview sitemap returned HTTP 200 and contained **532 URLs, 532 unique URLs, and zero duplicate entries**.
- Every sitemap URL used the `https://totthobox.com/` origin. No sitemap entry matched the excluded private/non-indexable path checks, and no `/news` URLs were present.
- The sampled public routes below returned HTTP 200 and had a title, meta description, canonical URL, Open Graph title/image, Twitter card/image, and exactly one H1:
  - `/`, `/about-us`, `/contact-us`, `/services`, `/privacy-policy`, `/terms-of-service`
  - `/converter/document`, `/converter/file-data`, `/tools/age-calculator`
  - `/bangladesh/history`, `/islam/basic`, `/international/all-country`
  - `/software/all`, `/signs/all`, `/contact/police`, `/bangla/calendar`
- `/offline` and `/ai/chat` are intentionally excluded from the sitemap and carry noindex behavior. They are not indexable content landing pages; the AI chat route has no H1 by design.
- Vercel domain configuration lists `www.totthobox.com` redirecting to `totthobox.com` with status 308. Direct checks showed HTTPS www redirects to the bare HTTPS host and HTTP apex redirects to HTTPS. HTTP www can require two redirects (HTTP-to-HTTPS, then www-to-apex), but resolves to the intended canonical host.
- The preview `robots.txt` returned HTTP 200 and references `https://totthobox.com/sitemap.xml`.
- The duplicate brand-suffix issue in titles was fixed in source.
- The current route-audit workflow crawls each published sitemap URL for HTTP status, title, description, canonical host, OG/Twitter image metadata, robots noindex, and H1 count. Its generated results file is expected at `docs/PRODUCTION_AUDIT_RESULTS_2026-10-11.md` after the workflow completes.

### Still not proven

- A successful sitemap response and a structural check do **not** prove that every listed URL returns 2xx or that every possible public route is listed. The full crawl result has not been read yet.
- The sitemap gathers dynamic slugs from the admin API and fails soft when an endpoint is unavailable. Each endpoint is capped at 20 pages of 50 items. If an endpoint exceeds 1,000 entries, sitemap sharding or a dedicated public index endpoint will be required.
- No verified public profile-list source was found, so user profiles are not currently included in the sitemap. Decide whether these should be indexable and provide a safe public list before claiming complete profile coverage.
- HTTP www currently takes a two-hop path; final canonicalization is correct, but a single-hop redirect would be preferable if it can be configured without disrupting Vercel's automatic HTTPS behavior.

## 2. Performance and third-party scripts

### Implemented / inspected

- A real Lighthouse workflow is configured for **mobile and desktop** on the homepage and document converter. It also performs a sitemap URL crawl and stores JSON artifacts.
- GA4 disables automatic page views and emits pathname page views for App Router navigation after analytics consent. This is designed to avoid the common initial-page-view duplication/missing-SPA-page-view problem.
- AdSense and the visitor tracker are gated on explicit marketing/analytics consent. Google Translate is only loaded when a visitor has an explicit non-Bengali translation preference.
- Bengali font loading uses `display: swap`; Geist font preloads are disabled. Package import optimization and inline CSS are configured in Next.js.

### Not yet measured

- **No numeric Lighthouse Performance score is claimed.** The latest Lighthouse result file was not available when this report was updated. The requested mobile and desktop Performance target of 95+ remains unverified.
- LCP, CLS, INP/interaction responsiveness, FCP, TBT, long tasks, transfer sizes, image payloads, and third-party script cost still need the actual Lighthouse report and browser trace.
- Lighthouse on two representative routes is not proof that every route scores 95+; scores vary by route, device, network, and run.

## 3. Accessibility

### Implemented in source

- Added visible `:focus-visible` outlines for light and dark themes.
- Added a `prefers-reduced-motion: reduce` rule.
- Removed broad mobile text-selection disabling and mobile scrollbar hiding.
- Improved the cookie settings dialog with an accessible dialog label/description, initial focus, keyboard Tab trapping, Escape close, focus return to its trigger, and a larger touch target for the trigger and footer actions.

### Not yet verified

- **WCAG 2.2 AA is not certified.** A Lighthouse accessibility score is only an automated subset, not a full WCAG conformance assessment.
- Full keyboard-only and screen-reader walkthroughs, focus-return testing across all dialogs, color contrast sampling in light/dark themes, 200–400% zoom/reflow, and real-device touch-target checks remain pending.
- The cookie dialog changes have passed a Vercel production build, but their behavior has not been exercised in an interactive browser session in this audit.

## 4. PWA, caching, and Vercel usage safety

### Verified / inspected

- The generated preview `sw.js` returned HTTP 200. Its runtime cache names were:
  - `start-url`
  - `public-news-api-v1`
  - `api-network-only`
  - `totthobox-next-static-v1`
  - `totthobox-public-assets-v1`
- No generic `pages`, `pages-rsc`, `pages-rsc-prefetch`, `apis`, or `cross-origin` runtime cache names were found in the generated worker. General API GET requests use NetworkOnly; public news responses use a short-lived cache; Next static assets and public assets have bounded caches.
- A special `start-url` cache remains for the public root route; it is not a generic private-page cache.
- Manifest, offline route, app icons, and listed screenshots returned HTTP 200 in the preview.
- Legacy generic cache cleanup is implemented in the client PWA component.

### Not yet verified

- Offline navigation, install prompt behavior, update activation, cache expiry, old-service-worker recovery, and authenticated/private response behavior still require a real browser/device lifecycle test.
- Vercel usage/quota metrics were not available. No claim is made that usage is guaranteed to remain within a Free Tier allowance; current code reduces avoidable work but usage must be monitored.

## 5. Analytics, AdSense, and privacy

### Verified / inspected

- GA4 page-view code uses `send_page_view: false` and a pathname effect for SPA navigation.
- GA4 and visitor tracking are consent-gated; AdSense loads only after marketing consent; translation loads only after explicit preference.
- The privacy policy route returned HTTP 200 and includes cookie/analytics/AdSense-related disclosure text.
- `/ads.txt` returned HTTP 200 and lists `google.com, pub-9522604367420521, DIRECT, f08c47fec0942fa0`, matching the publisher ID in site metadata.

### Not yet verified

- GA4 DebugView/realtime has not been checked, so actual event delivery, deduplication, and consent-revocation behavior are not proven.
- AdSense account approval, ad rendering, account policy status, and any applicable Google-certified CMP/EEA/UK/Swiss consent requirements were not verified. A custom preference panel alone is not proof that a certified CMP is present where required.
- Privacy/legal compliance depends on the site's actual audience, data flows, and account configuration; this audit is not legal advice.

## Build and CI status

- Latest Vercel preview deployment for commit `87144ac7948af5861427189b0786d4f1e8989c91` reached **READY**. Vercel logs show successful compilation and TypeScript.
- The GitHub CI run was still installing dependencies at the time of this report. An earlier attempt failed during `npm ci` with an `EINTEGRITY` error caused by a corrupted `find-up` / `escape-string-regexp` tarball response; the retry was interrupted by a newer branch push. The current CI run must finish green before treating CI as passed.
- Preview responses have Vercel preview noindex headers, which is expected and should not be copied to production configuration.
- No production deployment was initiated.

## Acceptance checklist

- [x] Canonical `www` → apex redirect configured and redirect behavior checked.
- [x] Sitemap structure checked: 532 unique URLs, canonical origin only, no obvious private/news entries.
- [x] Representative public-route metadata and H1 checks passed.
- [x] Latest Vercel preview build reached READY with successful compile and TypeScript.
- [x] Generated service worker inspected for generic private HTML/RSC/API cache rules.
- [x] Manifest, icons, screenshots, `robots.txt`, `ads.txt`, and privacy-policy route checked.
- [x] Source-level consent gating, reduced-motion/focus styles, and cookie-dialog keyboard behavior improvements added.
- [ ] Full HTTP/metadata/H1 crawl of every sitemap URL reviewed and all findings fixed.
- [ ] Lighthouse Mobile + Desktop results obtained and performance opportunities remediated; Performance ≥95 demonstrated.
- [ ] Full WCAG 2.2 AA manual/automated testing completed.
- [ ] PWA offline/install/update/cache-expiry lifecycle tested in a real browser/device.
- [ ] GA4 DebugView/realtime events and consent revocation verified.
- [ ] AdSense account/CMP requirements verified for applicable audiences.
- [ ] GitHub CI finishes green.
- [ ] Vercel usage checked against actual plan limits.

## Final status

**Not 100% production-ready yet.** The source fixes and structural checks materially improve readiness, but the full sitemap crawl, measured Lighthouse results, WCAG 2.2 AA testing, PWA lifecycle tests, GA4 DebugView, AdSense/CMP account checks, CI green status, and actual Vercel usage remain outstanding. Do not mark those items complete without the corresponding evidence, and do not promote this branch to production solely on the basis of a successful preview build.
