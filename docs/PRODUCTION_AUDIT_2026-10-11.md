# Totthobox Production Readiness Audit

- Audit date: 2026-10-11
- Target branch: `fix/sidebar-seo-mainline-2026`
- Repository: https://github.com/mariamsara77/totthobox-fontend
- Production domain: https://totthobox.com
- Status: source-level initial audit; build, browser automation, real-device accessibility, and Lighthouse tests have not yet been run.
- Important: no Lighthouse scores are claimed in this report. Severity indicates risk/priority, not a verified production incident.

## Scope inspected

Repository tree (recursive GitHub tree, not truncated) and representative files:
- `package.json`
- `next.config.ts`
- `app/layout.tsx`
- `app/globals.css`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/(home)/page.tsx`
- `app/(home)/about-us/page.tsx`
- `app/(home)/contact-us/page.tsx`
- `app/(main)/bangla/calendar/page.tsx`
- `components/seo/SiteStructuredData.tsx`
- `components/partials/TagManager.tsx`
- `components/DeferredAdSense.tsx`
- `components/DeferredVisitorTracker.tsx`
- `public/manifest.json`
- `public/sw.js`
- `.github/workflows/ci.yml`
- `tsconfig.json`
- `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`

The route tree includes home, main content, AI/chat, authentication, converter/tool, country, software, holiday, and other dynamic routes. This is not yet a line-by-line review of every component.

## Findings

### High — canonical hostname needs verification
**Files:** `app/layout.tsx`, route `page.tsx` metadata, `app/sitemap.ts`.

Root metadata uses `metadataBase: https://totthobox.com`; multiple pages hardcode canonical URLs for the bare domain. Public search results also show `www.totthobox.com`. Source alone cannot confirm redirect status or response headers.

**Action:** verify HTTP/HTTPS and www/non-www redirect chains, then align canonical, sitemap, Open Graph and JSON-LD URLs to the one chosen canonical origin. Prefer configuring the canonical domain redirect at Vercel when possible.

### High — sitemap correctness and cost need runtime validation
**File:** `app/sitemap.ts`.

The sitemap combines a manually maintained route list with dynamic data fetched from the admin API. The dynamic slug helper paginates endpoints with up to 1,000 pages per endpoint and a 3,600-second revalidation window. It catches failures and returns partial results, which can silently omit URLs. Twelve data sources are requested concurrently.

**Action:** fetch the deployed sitemap, validate representative dynamic URLs and HTTP statuses, measure generation time and API request count, confirm pagination semantics and exclude non-indexable/private/empty content. Consider bounded pagination or a cached content index if API behavior warrants it.

### High — PWA caching requires route-level privacy and freshness tests
**Files:** `next.config.ts`, generated `public/sw.js`, `public/manifest.json`.

PWA configuration enables aggressive frontend navigation caching, extends default Workbox runtime caching, uses NetworkFirst for a public news API pattern, and adds NetworkOnly for general API GET requests. The generated service worker is committed.

**Action:** inspect generated Workbox routes; test account/auth responses are never cached, API rules do not overlap unexpectedly, offline fallback works, old caches are retired, and service-worker updates recover cleanly. Do not promise that caching alone can guarantee Vercel free-tier limits.

### Medium–High — third-party scripts and analytics need measurement
**Files:** `app/layout.tsx`, `components/DeferredAdSense.tsx`, `components/partials/TagManager.tsx`, `components/DeferredVisitorTracker.tsx`.

AdSense, GA4, visitor tracking, and Google Translate are mounted from the root layout. Some scripts are deferred until interaction or load, but this does not establish total runtime cost, duplicate loading behavior, consent handling, or SPA page-view accuracy.

**Action:** measure mobile impact, verify one-time script loading and route-change events, check privacy disclosures/consent requirements for applicable jurisdictions, and avoid sending personally identifying information to analytics.

### Medium–High — manifest destinations/assets need verification
**File:** `public/manifest.json`.

The manifest declares screenshots, icons, shortcuts (including `/mcq` and `/islam/basicislam`), and a POST share target at `/share`. Manifest declarations do not guarantee the routes or assets exist or that the share target accepts the declared method.

**Action:** request every declared asset and route; validate icon dimensions and maskable safe areas; test install and share flows on supported browsers; remove or correct unsupported entries.

### Medium — accessibility requires automated and manual checks
**File:** `app/globals.css`, plus shared navigation, forms, dialogs, and client components.

Global CSS disables selection for several elements on coarse-pointer devices and hides mobile scrollbars. These choices can affect text selection and scroll-position awareness. Source inspection alone cannot establish WCAG 2.2 AA conformance.

**Action:** test keyboard-only navigation, visible focus, contrast in light/dark modes, 24px minimum target requirements where applicable, form labels/errors, dialog focus return, reduced motion, zoom/reflow, screen-reader names and status announcements.

### Medium — metadata coverage needs a route inventory
**Files:** `app/layout.tsx`, all route `page.tsx` files, `app/robots.ts`, `app/sitemap.ts`.

Root defaults and representative home/calendar/about/contact metadata exist. This does not prove every public dynamic route has a unique title, description, canonical URL, correct robots policy, social image, semantic heading structure, or correct 404 behavior.

**Action:** inventory every route group and dynamic detail page; compare page metadata with rendered H1, indexability, sitemap inclusion and canonical behavior. Keep login, private chat, and account routes out of search results where appropriate.

### Medium — production verification not yet performed
**Files:** `package.json`, `.github/workflows/ci.yml`, `tsconfig.json`, `next.config.ts`.

The repository defines lint and production-build scripts and strict TypeScript. No successful run for this audit has been observed.

**Action:** run `npm ci`, `npm run lint`, and `npm run build`; check route generation and warnings; run Lighthouse mobile/desktop and accessibility tests against a deployed preview. Verify environment variables and production runtime logs.

### Low–Medium — error/loading boundary coverage
**Files:** `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`.

Not-found and error boundaries exist. A root `app/loading.tsx` was not found at the inspected path; nested loading boundaries may exist. The error boundary currently logs errors client-side, while production console removal is configured.

**Action:** inspect route-group loading states, ensure loading boundaries exist where navigation can stall, and connect privacy-safe error reporting if required.

## Existing strengths

- Next.js App Router, React 19, and strict TypeScript configuration.
- Bengali font support using `Noto_Sans_Bengali`.
- Global Organization and WebSite JSON-LD.
- Robots and sitemap route handlers.
- Security headers including nosniff, referrer policy, and production HSTS.
- PWA offline fallback, manifest, and install-related components.
- Privacy policy and terms pages are present.
- CI workflow includes lint and production build steps.

## Verification matrix

| Area | Current evidence | Status |
|---|---|---|
| Repository inventory | Recursive Git tree and selected source files | Partial audit |
| Live HTML and route behavior | Public search-index snapshots only | Not fully verified |
| SEO metadata and schema | Source inspection of representative pages | Partial audit |
| Sitemap/robots HTTP responses | Not fetched/tested end-to-end | Pending |
| Lighthouse mobile/desktop | Not run | Pending |
| WCAG 2.2 AA | Not tested with automated/manual tools | Pending |
| Production build/lint | Not run in this environment | Pending |
| PWA/offline/install | Configuration inspected, no device test | Pending |
| Analytics accuracy/consent | Source inspection only | Pending |
| Vercel usage/cost limits | No usage metrics or quotas verified | Pending |

## Acceptance criteria

Do not mark the project fully production-ready until the build and lint pass, key routes and critical user flows are tested, canonical/sitemap/robots behavior is verified on the deployed preview, PWA privacy/freshness behavior is checked, accessibility issues are addressed, and Lighthouse results are captured for both mobile and desktop. Lighthouse scores are measurement outcomes, not something source review can guarantee.
