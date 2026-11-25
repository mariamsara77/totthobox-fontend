# Totthobox Frontend Overhaul — PROGRESS.md

**Branch:** `ui-seo-adsense-overhaul`  
**Goal:** Production-grade, ultra-fast, accessible, SEO-perfect, AdSense-ready, modern Bangla PWA (`totthobox.com`).

---

## Phase 0 — Discovery & Baseline

- [x] **0.1 Tech Stack Detection** — Next.js `16.3.3` (App Router, `app/`), React `19.2.8`, TypeScript `^5`, Tailwind CSS `^4` (`@tailwindcss/postcss`, CSS-first `@import "tailwindcss"` in `app/globals.css`), `npm` (`package-lock.json`). UI/Animation: `lucide-react`, `@heroicons/react`, `react-icons`, `framer-motion`, `react-hot-toast`. State/Data: `zustand`, `swr`, `@tanstack/react-query`, `axios`. PWA: `@ducanh2912/next-pwa` (`public/sw.js`). Analytics/Ads: GTM (`GTM-5RFHKJJJ`), GA4 (`G-HGE2T2J8ZT`), `lib/visitor-tracker.ts`, `lib/server/analytics-proxy.ts`, `scripts/generate-ads-txt.mjs`, `ADSENSE_ENABLED` / `ADSENSE_CMP_READY` flags in `app/layout.tsx`.
- [x] **0.2 Route & Data Source Inventory (87 App Router pages)** — Mapped all routes across `app/`:
  - **Static / Trust / Utility:** `/`, `/services`, `/about-us`, `/authors`, `/contact-us` (`POST /api/contact`), `/privacy-policy`, `/terms-of-service`, `/disclaimer`, `/cookie-policy`, `/copyright-policy`, `/corrections-policy`, `/editorial-policy`, `/offline`
  - **Auth & Settings:** `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/callback`, `/auth/github/callback`, `/settings/profile`, `/settings/password`, `/settings/delete-account`, `/users/[slug]` (`/api/users/:slug/profile`)
  - **Chat / AI:** `/ai/chat`, `/ai/chat/[uuid]`, `/messages`, `/messages/[slug]`
  - **Search:** `/search`, `/api/search`, `/api/search/meta` (`admin.totthobox.com/api/search*`)
  - **Tools & Converters (client-interactive + API):** `/tools/*` (10 tools), `/converter/*` (16 converters), `/pdf-editor`, `/live-tv`
  - **Dynamic List & Detail (Laravel API `admin.totthobox.com/api/*`):** `/bangla/calendar`, `/bangla/holiday`, `/bangla/holiday/[slug]`, `/bangladesh/establishment`, `/bangladesh/establishment/[slug]`, `/bangladesh/history`, `/bangladesh/history/[slug]`, `/bangladesh/introduction`, `/bangladesh/introduction/[slug]`, `/bangladesh/public-figure`, `/bangladesh/public-figure/[slug]`, `/bangladesh/tourism`, `/bangladesh/tourism/[slug]`, `/international/all-country`, `/international/country/[slug]`, `/international/calling-codes`, `/international/crypto-forex`, `/international/world-clock`, `/islam/basic`, `/islam/basic/[slug]`, `/islam/dowan`, `/islam/dowan/[slug]`, `/signs/[category]`, `/signs/[category]/[sign]`, `/contact/[slug]`, `/news`, `/news/headlines`, `/news/headlines/[slug]`, `/news/headlines/story/[slug]`
- [x] **0.3 Baseline Checks** — `npx next typegen && npx tsc --noEmit` PASS (0 errors); `npm run test:nav` PASS (9 categories, 40 items); `npm run lint` PASS (0 errors, 517 warnings); offline `npm run build` PASS after self-hosted `next/font/local` migration (593 static pages generated; Next 16 `.next/static/` baseline: 242 JS chunks = `6,754.2 KB`, CSS = `163.3 KB`, Font Media = `423.1 KB`; largest JS chunks `593.3 KB`, `497.6 KB`, `482.6 KB`, `419.3 KB`, `401.8 KB`). Lighthouse CLI `13.6.0` installed — **baseline pending, measure on Vercel preview / PageSpeed Insights**.
- [x] **0.4 Create `PROGRESS.md` Checklist** — Initialized full Phase 0–9 checklist and baseline decisions.

---

## Phase 1 — Tailwind v4 + Design System Foundation

- [x] **1.1** Audited Tailwind v4 config in `app/globals.css`, restored missing `@font-face` for `Adorsholipi Exp` (`/fonts/adorsholipi-exp.woff2`), and removed legacy `.sepia` rules. (`app/globals.css`, `npx tsc --noEmit` + `npm run lint` PASS)
- [x] **1.2** Enforced Color Rule: removed `sepia` mode and `amber`/`crimson` accents (`indigo`, `blue`, `emerald`, `violet`, `teal`, `rose` cool/neutral accents only); added safe migration (`sepia`/`amber`/`crimson` -> `system` + default accent) in both `lib/appearance.ts` (`APPEARANCE_INIT_SCRIPT` + `resolveStored*`) and `context/AppearanceContext.tsx`; replaced non-warning amber/orange surfaces in `ToolGuide.tsx`, `SearchResultItem.tsx`, `ContactClient.tsx`, trust pages, `HistoryClient.tsx`, `HistoryShowClient.tsx`, `country/[slug]/page.tsx`, and `services-catalog.ts`.
- [x] **1.3** Standardized design tokens in `@theme inline` and `:root`/`.dark` CSS variables (surfaces, text, muted, accent, status, radii, shadows, motion durations). (`app/globals.css`)
- [x] **1.4** Migrated `Hind Siliguri` (bengali 400–700; skipped unused 300 & redundant `Noto Sans Bengali`), `Geist` variable, and `Geist Mono` variable to `next/font/local` using 6 self-hosted `.woff2` files in `app/fonts/` (`433 KB` source); `npm run build` passes 100% offline. (`app/layout.tsx`, `app/globals.css`, `app/fonts/`)
- [x] **1.5** Standardized UI primitives (`Button`, `Card`, `Chip`, `Badge`, `Input`, `Modal`, `Tooltip`, `Skeleton`) and `Toaster` in `app/providers.tsx` with focus rings, 44px targets, and `motion-reduce` support.
- [x] **1.6** Phase 1 verification — `npx tsc --noEmit` PASS (0 errors), `npm run test:nav` PASS (9 categories, 40 items), `npm run lint` PASS (0 errors, 517 warnings), offline `npm run build` PASS (593/593 static pages).

---

## Phase 2 — Sidebar / Topbar Redesign + Theme Settings

- [ ] **2.1** Borders → tonal depth on sidebar and topbar; sticky translucent topbar with `backdrop-blur`; collapsible desktop icon-rail + mobile drawer.
- [ ] **2.2** Move theme-change control to the **bottom** sticky footer area of the sidebar (accessible in expanded, collapsed rail, and mobile drawer).
- [ ] **2.3** Upgrade Theme Settings panel: Mode (`Light` / `Dark` / `System`), Accent color (cool palette, no warm tints), Radius (`sharp`/`medium`/`round`), Density (`comfortable`/`compact`), Font size (`S`/`M`/`L`), Reduce motion toggle, Sidebar style (`expanded`/`rail`/`auto`), Reset to default, keyboard accessible with ARIA + FOUC-free init script.
- [ ] **2.4** UI/UX improvement pass across all page types (spacing rhythm, skeletons, tap targets ≥ 44px, breadcrumbs, Bangla line-length, micro-interactions).
- [ ] **2.5** Phase 2 verification (`npm run lint`, `npx tsc --noEmit`, `npm run build`).

---

## Phase 3 — Performance

- [ ] **3.1** Audit rendering strategy per route (ISR `revalidate`, `Suspense` + `loading.tsx`, server-side fetching, `generateStaticParams`).
- [ ] **3.2** Add secured `/api/revalidate` route (`REVALIDATE_SECRET`) and document webhook usage.
- [ ] **3.3** Audit `next/image` usage, `sizes`, `priority` (LCP only), AVIF/WebP, explicit dimensions, `remotePatterns`.
- [ ] **3.4** JS budget & bundle audit (`@next/bundle-analyzer`, dynamic imports, unused deps, tree-shaking).
- [ ] **3.5** Caching, compression, and security headers in `next.config.ts` / middleware (CSP allowing AdSense + GA domains).
- [ ] **3.6** Phase 3 verification (`npm run lint`, `npx tsc --noEmit`, `npm run build`).

---

## Phase 4 — SEO

- [ ] **4.1** Audit Metadata API (`title`, `description`, `canonical`, `openGraph`, `twitter`, `robots`, `alternates`, `metadataBase`, `lang="bn"`) across all 87 routes.
- [ ] **4.2** Add/verify dynamic `opengraph-image` support.
- [ ] **4.3** Verify `app/sitemap.ts` and `app/robots.ts` (disallow `/api`, auth, chat, private, search params).
- [ ] **4.4** Audit & complete JSON-LD structured data per page type (`Organization`, `WebSite`, `BreadcrumbList`, `Article`/`NewsArticle`, `FAQPage`, `TouristAttraction`, `Event`, etc.).
- [ ] **4.5** Semantic HTML, single `<h1>`, heading order, `noindex` on utility/thin pages, real `notFound()` 404s, `not-found.tsx` + `error.tsx`.
- [ ] **4.6** Phase 4 verification (`npm run lint`, `npx tsc --noEmit`, `npm run build`).

---

## Phase 5 — Accessibility (WCAG 2.2 AA)

- [ ] **5.1** Contrast AA audit across all theme modes and accent colors.
- [ ] **5.2** Skip-to-content link, focus rings, full keyboard navigation, ARIA roles/labels, `aria-live` regions, `prefers-reduced-motion`.
- [ ] **5.3** Run axe-core audit across representative page types and fix findings.
- [ ] **5.4** Phase 5 verification (`npm run lint`, `npx tsc --noEmit`, `npm run build`).

---

## Phase 6 — PWA

- [ ] **6.1** Audit `app/manifest.ts` / `public/manifest.json` (icons, maskable, shortcuts, light/dark theme_color).
- [ ] **6.2** Audit service worker caching rules (never cache auth/messages/profile/POST; never interfere with AdSense/GA), `/offline`, update toast, install prompt.
- [ ] **6.3** Phase 6 verification (`npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run test:pwa-cache`).

---

## Phase 7 — Analytics & Visit Tracking

- [ ] **7.1** Audit GA4/GTM loading (`afterInteractive`, production-only guard if needed), SPA `page_view` tracking (`usePathname` + `useSearchParams` in `Suspense`).
- [ ] **7.2** Audit `lib/analytics.ts` typed events, Consent Mode v2 banner + footer "Cookie settings", Web Vitals reporting (`useReportWebVitals`), GSC verification env.
- [ ] **7.3** Audit first-party visitor tracking (`/api/analytics/pageview`, `/heartbeat`, `/stats`).
- [ ] **7.4** Phase 7 verification (`npm run lint`, `npx tsc --noEmit`, `npm run build`, `scripts/verify-gtm-datalayer.mjs`).

---

## Phase 8 — Google AdSense Readiness

- [ ] **8.1** Produce `ADSENSE_AUDIT.md` covering content quality (<300-word pages), trust pages, navigation, policy compliance, technical, and E-E-A-T signals.
- [ ] **8.2** Fix all code-fixable AdSense issues (trust pages, explanatory content + FAQ blocks, `ads.txt`, E-E-A-T metadata).
- [ ] **8.3** Implement `<AdSlot>` component + `NEXT_PUBLIC_ADS_ENABLED` gating + placement rules + CSP/SW allowlists.
- [ ] **8.4** Phase 8 verification (`npm run lint`, `npx tsc --noEmit`, `npm run build`).

---

## Phase 9 — Final QA & Deployment

- [ ] **9.1** Full lint, typecheck, build, and Lighthouse (mobile + desktop) Before vs. After comparison.
- [ ] **9.2** Cross-mode testing (dark/light, mobile/desktop, slow-3G, offline, reduced-motion, keyboard-only, ad-blocked, sitemap link crawl).
- [ ] **9.3** Produce `DEPLOYMENT.md` (Vercel + self-hosted Node/PM2/nginx + env vars) and final handoff summary.
