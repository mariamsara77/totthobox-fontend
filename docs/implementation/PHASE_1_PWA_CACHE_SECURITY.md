# Phase 1 — PWA Private / RSC Cache Security

**Working branch:** fix/totthobox-adsense-seo-performance  
**Base production commit:** 6eb69f852ae99de980aa6329ab4b92a3cebac532  
**Scope:** Next.js service-worker / Workbox cache policy only.

## Findings addressed

The previous @ducanh2912/next-pwa configuration extended the plugin's default runtime rules. Those defaults included 24-hour NetworkFirst caches for generic same-origin documents, RSC payloads, and RSC prefetches. The plugin's optional front-end navigation helper also wrote successful navigations directly into its pages cache without running the Workbox cacheability checks. The dynamic start-URL cache had a similar direct write path.

That meant an API-only exclusion did not protect personalized HTML or RSC responses.

## Changes

1. Replaced Workbox defaults with a controlled runtime route list (extendDefaultRuntimeCaching: false).
2. Kept runtime HTML caching only for explicit, query-free public routes. A response is accepted only when it is same-origin HTML, status 200, not redirected, and explicitly contains Cache-Control: public. private, no-store, no-cache, Vary: *, Vary: Cookie, Vary: Authorization, and Authorization-bearing requests are rejected.
3. The public HTML route uses NetworkFirst with a four-second network timeout and a 30-minute / 80-entry cap. This keeps pages fresh while allowing a previously approved public document to be used when offline.
4. RSC payloads, RSC prefetches, API requests, and non-allowlisted or query-bearing document navigations use NetworkOnly.
5. Disabled the plugin's separate front-end-navigation and dynamic start-URL cache writers, because they bypassed Workbox cacheability plugins.
6. Added public/sw-cache-cleanup.js, imported by the generated worker. On activation it deletes only known legacy dynamic cache namespaces that could contain private documents, RSC, API data, or user media. It deliberately preserves Workbox precache namespaces, the new public-document cache, and unrelated application-owned caches.
7. Kept the /offline document fallback and Workbox precaching of public static files. No PWA feature was globally disabled and no dependency was added.

## Cookie boundary

Browser service workers cannot inspect the Cookie request header or Set-Cookie response header. The implementation therefore does not claim to identify a signed-in user from a cookie inside Workbox. Instead, only routes guaranteed to return the same public HTML for anonymous and signed-in visitors are allowlisted, and the server must explicitly return Cache-Control: public. Account-specific pages, every RSC response, API routes, and unknown navigations are not cached. Never add a user-specific route to the inlined public-document path matchers in next.config.ts.

## Verification performed

- npm ci --no-audit --no-fund — passed.
- npx tsc --noEmit — passed.
- npx eslint next.config.ts — passed.
- npm run build — passed on Next.js 16.3.3; PWA worker compiled and the app generated 83 static pages.
- Generated worker inspection — confirmed the custom public-document-pages-v3 rule, RSC/API/non-public NetworkOnly rules, imported cleanup script, and /offline fallback. Confirmed the generated runtime rules no longer contain the plugin's generic pages, pages-rsc, pages-rsc-prefetch, apis, cross-origin, or static-data-assets caches.
- scripts/test-pwa-cache-security.mjs — verifies the generated worker policy and simulates activation cleanup, checking that legacy dynamic caches are deleted while Workbox precache and unrelated app caches survive.
- node --check public/sw.js and node --check public/sw-cache-cleanup.js — passed.
- git diff --check — passed.
- Targeted ESLint for next.config.ts and scripts/test-pwa-cache-security.mjs — passed.
- Full npm run lint — currently fails on existing issues in unrelated application files (auth, contact, language selector, converter, and other components); these areas were not modified in Phase 1.

## Not yet verified in a real browser

The sandbox has no authenticated Totthobox test accounts or browser session for two distinct users. Therefore, real end-to-end login as User A, logout, login as User B, and same-browser account-switch testing has not been claimed as complete. The build and cache-policy/activation tests verify the worker rules, but final Preview testing must still run the anonymous / User A / User B / logout / offline matrix before Production approval.

## Files changed

- next.config.ts
- public/sw-cache-cleanup.js
- Generated Workbox assets: public/sw.js, the updated public/workbox-*.js and fallback worker asset; obsolete generated worker runtime assets are removed by the build.
- scripts/test-pwa-cache-security.mjs
- docs/implementation/PHASE_1_PWA_CACHE_SECURITY.md

No Laravel/backend routes, database, user data, authentication implementation, UI, or Vercel project settings were changed. No Preview or Production deployment was created in this phase.
