# Totthobox Production Readiness Audit — Updated

- Audit date: 2026-10-11
- Target branch: `fix/sidebar-seo-mainline-2026`
- Repository: https://github.com/mariamsara77/totthobox-fontend
- Production domain: https://totthobox.com
- Status: **source-level remediation in progress; not certified production-ready**
- No Lighthouse scores or WCAG conformance claims are made. The latest source changes require a fresh preview build and post-build verification.

## Route inventory and method

The App Router tree was enumerated across `(home)`, `(main)`, `(ai)`, `(auth)`, `(chat)`, `api`, `auth`, and `share`, including static pages, dynamic detail pages, account/settings surfaces, and redirects. Rendered HTML was inspected for a representative route sample; this was not an HTTP crawl of every sitemap URL or every dynamic slug.

Representative rendered routes checked before the latest uncommitted source bundle:
- `/`, `/about-us`, `/contact-us`, `/privacy-policy`, `/terms-of-service`, `/services`
- `/converter/file-data`, `/converter/document`, `/tools/age-calculator`
- `/bangladesh/history`, `/islam/basic`, `/international/all-country`, `/software/all`, `/contact/fire-service`
- `/news/headlines`, `/ai/chat`, `/robots.txt`, `/sitemap.xml`

These sampled routes returned HTTP 200; sampled public content routes generally rendered one H1. The noindex AI chat UI rendered no H1, which is not an indexable landing page. Several page-level Open Graph/Twitter image omissions and repeated brand suffixes were found in the sample and addressed in source.

## Step 1 — SEO, canonical host, sitemap

### Implemented in source
- Added or completed page-level Open Graph/Twitter image metadata across the principal static and dynamic content routes, including converters, tools, Bangladesh content, country pages, Islam content, software, signs, and contact categories.
- Removed redundant brand suffixes from title strings where the route title template appends `| Totthobox`; completed route-specific Open Graph/Twitter metadata on the privacy policy, terms, and services pages.
- Added dynamic profile metadata (title, description, canonical, Open Graph and Twitter image), memoizing profile data per render to avoid a second duplicate fetch.
- Applied `noindex` metadata to the auth layout and offline page; existing AI/chat, messages, and settings areas already use noindex policies.
- Removed `/news` and `/news/headlines` from the sitemap because `/news` redirects and the headlines route is `noindex`.
- Bounded each sitemap API source to at most 20 pages of 50 entries per endpoint to limit worst-case API work.
- Corrected stale shortcuts in `public/manifest.json`; `/share` has a POST handler and redirects safely to the home page.

### Host and sitemap evidence
- Vercel project configuration lists `www.totthobox.com` redirecting to `totthobox.com` with status 308. A live fetch of the www host returned a 308 permanent redirect to the bare domain. Canonical URLs and sitemap entries use `https://totthobox.com`.
- The sitemap observed before removing the two non-indexable news URLs contained 534 unique URLs, all on `https://totthobox.com`, with no duplicate URLs. The updated source should contain 532 entries if API data is unchanged; this count must be rechecked on the new preview.
- `robots.txt` and `sitemap.xml` both returned HTTP 200 in the previous preview.

### Still unverified
- A complete status crawl of every sitemap URL and all dynamic slugs has not been performed.
- Sitemap API calls still fail soft and can return partial results if the admin API is unavailable. The 20-page cap means a source with more than 1,000 entries would need sitemap sharding or a dedicated public index endpoint.
- User profile routes have metadata but are not in the sitemap because no verified public profile-list API was found in this repository. Decide whether these profiles should be indexed and provide a safe public listing source before claiming sitemap completeness.
- HTTPS redirect behavior was not independently checked for every HTTP/HTTPS host combination; HSTS is configured.

## Step 2 — Performance and third-party scripts

### Implemented in source
- GA4 now disables automatic page views and emits a page-view event after the analytics loader becomes ready and when the App Router pathname changes, avoiding the common missing-SPA-page-view issue and reducing duplicate initial events.
- Visitor PWA-status sync no longer performs three forced startup POSTs; route sync handles initial state, unchanged visibility syncs are skipped, and bfcache restoration is handled separately.
- PWA caching was changed to replace generic Workbox defaults with explicit static-asset caches, a short-lived public-news API cache, and NetworkOnly for API GET requests. Generic HTML/RSC page caches and generic API caches are not configured in the new source.
- Legacy cache cleanup removes the old `pages`, `pages-rsc`, `pages-rsc-prefetch`, `apis`, `cross-origin`, `start-url`, `next-data`, and `static-data-assets` caches when the app next runs.
- Existing AdSense, Google Translate, and visitor-tracker loaders are deferred; their total runtime impact has not been measured.

### Still unverified
- Lighthouse has **not** been run for mobile or desktop. No Performance score is claimed, and the requested 95+ target is not verified.
- LCP, CLS, INP, long tasks, transfer sizes, image payloads, and third-party script costs still require a real browser/Lighthouse trace.
- The latest service-worker build must be inspected to ensure it no longer registers generic page/RSC/API caches.

## Step 3 — Accessibility

### Implemented in source
- Removed broad mobile text-selection disabling and mobile scrollbar hiding.
- Added visible keyboard focus indicators for light and dark themes.
- Added a `prefers-reduced-motion: reduce` rule.
- The root loading fallback was added in the prior pass and includes a status announcement and reduced-motion support.

### Still unverified
- WCAG 2.2 AA is **not certified**. No complete axe/Lighthouse accessibility run, keyboard-only walkthrough, screen-reader test, contrast sampling, zoom/reflow test, dialog focus-return test, or real-device touch-target audit has been performed.
- Component-specific focus traps, labels, errors, and contrast may still need route-level fixes.

## Step 4 — PWA, caching, and Vercel Free Tier

### Implemented in source
- Disabled default Workbox runtime caching that included generic `pages`, `pages-rsc`, and API response caches.
- Explicitly cache only same-origin Next static assets and public static files; keep general API GET requests NetworkOnly and public news API cache entries short-lived.
- Added best-effort cleanup for legacy runtime caches.
- Corrected stale public manifest shortcuts and retained the offline fallback route.

### Still unverified
- Install, offline navigation, cache expiry, update activation, and recovery from an old service worker have not been tested in a real browser/device.
- The current preview must be checked after build for generated service-worker cache names and offline fallback behavior.
- Vercel usage/quotas were not available in this audit, so free-tier capacity cannot be guaranteed. The bounded sitemap loop and reduced tracker calls lower avoidable work but are not a usage measurement.

## Step 5 — Analytics and AdSense

### Implemented in source
- GA4 SPA pathname page-view handling was added.
- The privacy policy has route-specific social metadata and already describes cookies, analytics, and Google AdSense.
- AdSense remains deferred until interaction or a delayed fallback.

### Still unverified
- GA4 events must be checked in GA4 DebugView/realtime on client-side navigation; source code alone does not prove event delivery or deduplication.
- AdSense publisher/account status, ads.txt readiness, actual ad rendering, consent requirements for applicable audiences, and privacy-disclosure sufficiency have not been verified against the live account or legal requirements.
- No analytics account access or production privacy/consent configuration was inspected.

## Verification matrix

| Area | Latest evidence | Status |
|---|---|---|
| Route-group inventory | App Router tree enumerated; representative routes sampled | Partial |
| Canonical www host | Vercel 308 configuration and live www response | Verified |
| Route metadata | Source fixes across principal static/dynamic routes; rendered sample checked before latest bundle | Code changes made; fresh preview check pending |
| Sitemap/robots | Previous preview returned 200; non-indexable news entries removed in source | Fresh preview check and full URL crawl pending |
| Production build/lint | Earlier Vercel preview build passed before the latest source bundle | Latest build pending |
| Lighthouse mobile/desktop | Not run | Pending |
| WCAG 2.2 AA | Source-level CSS improvements only | Manual/automated testing pending |
| PWA privacy/offline/install/update | Cache policy changed in source; no device run | Generated SW and browser tests pending |
| GA4 SPA events | Event code changed | DebugView validation pending |
| AdSense/privacy | Policy page exists; account/consent not verified | Pending |
| Vercel Free Tier usage | No usage/quota metrics inspected | Pending |

## Final acceptance status

**Not yet 100% production-ready.** The source-level changes above are intended to close several identified issues, but the latest commit must build successfully and the deployed preview must be retested. The explicit outstanding blockers are real Lighthouse mobile/desktop measurements, full route/sitemap validation, WCAG 2.2 AA testing, PWA lifecycle tests, GA4 DebugView validation, and live AdSense/privacy-account checks.

Do not deploy to production or advertise a 95+ Lighthouse score / WCAG 2.2 AA compliance based only on this source audit.
