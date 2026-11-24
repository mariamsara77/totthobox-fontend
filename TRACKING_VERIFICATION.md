# Tracking & Analytics Verification Report

**Date:** 2026-11-15  
**Workspace:** totthobox-fontend (Next.js 16 App Router)  
**Backend:** https://admin.totthobox.com/api  
**Status:** Verification Passed (All Phases Complete)  

---

## 1. Tracking & Analytics Architecture Call Map

| Source Component | Lib / Utility Function | Next.js Proxy Route | Upstream Laravel Backend Endpoint | Request Payload Shape | Upstream Response & Handling |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<DeferredVisitorTracker />` -> `<VisitorTracker />` | `trackVisitorPageView(path)` (`lib/visitor-tracker.ts`) | `POST /api/analytics/pageview` | Tries `POST /api/analytics/pageview`; falls back to `POST /api/tracking/event` | Modern: `{ visitor_id, session_id, is_first_visit, is_pwa, has_installed, referrer, path, url, title, utm_source, utm_medium, utm_campaign, load_time_ms, screen_res, timezone, device_type, language, timestamp }`<br/><br/>Fallback: `{ category: "page", action: "view", js_visitor_id, session_id, payload: { ... } }` | Proxies Laravel response; dev returns real code + `x-tracking-upstream`; prod returns 200 silently |
| `<DeferredVisitorTracker />` -> `<VisitorTracker />` | `sendVisitorHeartbeat(path)` (`lib/visitor-tracker.ts`) | `POST /api/analytics/heartbeat` | Tries `POST /api/analytics/heartbeat`; falls back to `POST /api/tracking/event` (+ `/api/tracking/sync-pwa`) | Modern: `{ visitor_id, session_id, path, url, is_pwa, has_installed, timestamp }`<br/><br/>Fallback: `{ category: "heartbeat", action: "ping", js_visitor_id, session_id, payload: { path, url, is_pwa, has_installed, timestamp } }` | Proxies Laravel response |
| `<UserAnalytics />` | `fetch('/api/analytics/stats')` | `GET /api/analytics/stats` | Tries `GET /api/analytics/stats`; falls back to `GET /api/analytics/user-count` | *(None / GET)* | Returns `{ status: "success", data: { total, today, online, pwa } }` cached for 60s |
| `<RouteTracker />` | Client route listener | Client-side only (`window.dataLayer`) | Google Tag Manager / GA4 Container `GTM-5RFHKJJJ` | `{ event: "page_view", page_path, page_location, page_title }` via `window.dataLayer.push()` | Processed by GTM container `GTM-5RFHKJJJ` |
| Tools/Calculators (`<TrackToolUsage />`) | `trackToolUsed(name)` / `trackConverterUsed(name)` | Client-side only (`window.dataLayer`) | Google Tag Manager / GA4 Container `GTM-5RFHKJJJ` | `{ event: "tool_used", tool_name }` / `{ event: "converter_used", converter_name }` | Processed by GTM |
| Search Modal (`<SearchModal />`) | `trackSearch(query, count)` | Client-side only (`window.dataLayer`) | Google Tag Manager / GA4 | `{ event: "search", search_term, result_count }` | Processed by GTM |
| Downloads (`<DownloadButton />`) | `trackDownload(name, type)` | Client-side only (`window.dataLayer`) | Google Tag Manager / GA4 | `{ event: "download_click", filename, file_type }` | Processed by GTM |
| Outbound Links (`<Footer />`, `<SearchModal />`) | `trackOutboundClick(url, type)` | Client-side only (`window.dataLayer`) | Google Tag Manager / GA4 | `{ event: "outbound_click", destination, target_type }` | Processed by GTM |
| Sharing (`<ToolActions />`) | `trackShare(method, title)` | Client-side only (`window.dataLayer`) | Google Tag Manager / GA4 | `{ event: "share", method, title }` | Processed by GTM |
| 404 Pages (`<Track404 />`) | `track404View(path)` | Client-side only (`window.dataLayer`) | Google Tag Manager / GA4 | `{ event: "404_view", requested_path }` | Processed by GTM |
| Infinite Scroll (`<InfiniteList />`) | `trackInfiniteScrollLoad(type, page)` | Client-side only (`window.dataLayer`) | Google Tag Manager / GA4 | `{ event: "infinite_scroll_load", feed_type, page_number }` | Processed by GTM |

---

## 2. Layout Tracker Mount & Double-Send Audit

### Root Layout Mounts (`app/layout.tsx`):
- Line 187: `<RouteTracker />` — Handles client-side GTM `page_view` events for Google Analytics on client transitions.
- Line 189: `<TagManager />` — Synchronizes cookie consent preferences with Consent Mode v2 on mount and updates. Does not emit pageviews or network requests.
- Line 192: `<DeferredVisitorTracker />` — Defers loading until browser idle (`requestIdleCallback`), then mounts `<VisitorTracker />` for first-party analytics.
- **Double-Sending Status:** **ZERO double-sending**.
  - Legacy `lib/tracker.ts` and `components/VisitorTracker.tsx` are completely purged from the codebase.
  - Exactly ONE first-party tracker is mounted in the root layout (`<DeferredVisitorTracker />`).
  - Exactly ONE GTM router tracker is mounted in the root layout (`<RouteTracker />`).

---

## 3. Live Backend Probe Results

Probed `https://admin.totthobox.com/api` with test visitor ID `test-audit-visitor-cdf124d0`:

| Endpoint Probed | Method | HTTP Status | Response Body Summary | Real Backend Status |
| :--- | :--- | :--- | :--- | :--- |
| `/tracking/event` | POST | **200 OK** | `{"status":"success"}` | **Working** (Accepts `category`, `action`, `js_visitor_id`, `session_id`, `payload`) |
| `/tracking/sync-pwa` | POST | **200 OK** | `{"status":"success","is_pwa":false,"has_installed":false,"visitor_id":21803}` | **Working** (Accepts `is_pwa`, `has_installed`) |
| `/tracking/sync` | POST | **200 OK** | `{"status":"success","message":"Synced successfully","count":1}` | **Working** (Accepts top-level `{ activities: [...] }`) |
| `/analytics/pageview` | POST | **404 Not Found** | `{"message":"The route api/analytics/pageview could not be found."}` | **Does NOT exist yet on backend** |
| `/analytics/heartbeat` | POST | **404 Not Found** | `{"message":"The route api/analytics/heartbeat could not be found."}` | **Does NOT exist yet on backend** |
| `/analytics/stats` | GET | **404 Not Found** | `{"message":"The route api/analytics/stats could not be found."}` | **Does NOT exist yet on backend** |
| `/analytics/user-count` | GET | **200 OK** | `{"status":"success","data":{"total":"117.45k","today":"10k","online":"10k","pwa":"10.11k"}}` | **Working** (Returns user counts; suspicious 10k floor detected in `online` & `today`) |

---

## 4. Playwright DataLayer Captures (`next start` on `localhost:3000`)

Test script: `scripts/verify-gtm-datalayer.mjs` running against production build.

### Scenario 1: Initial Hard Load & Navigations (Consent Denied)
1. **Initial Hard Load (`/`):**
   - DataLayer items on load: 4
   - `page_view` events on initial load: **0** *(RouteTracker skips initial hard load to prevent doubling with GTM's container initialization).*
2. **Client Navigation 1 (`/about-us`):**
   - `page_view` events in dataLayer: **1**
   - Event Payload:
     ```json
     {
       "event": "page_view",
       "page_path": "/about-us",
       "page_title": "",
       "page_location": "http://localhost:3000/about-us",
       "gtm.uniqueEventId": 7
     }
     ```
3. **Client Navigation 2 (`/contact-us`):**
   - `page_view` events in dataLayer: **2** (exactly +1 per navigation)
   - Event Payload:
     ```json
     {
       "event": "page_view",
       "page_path": "/contact-us",
       "page_title": "",
       "page_location": "http://localhost:3000/contact-us",
       "gtm.uniqueEventId": 8
     }
     ```

### Scenario 2: Returning Visitor (Consent Granted)
1. **Consent Mode Arguments on Load:**
   Captured calls in `window.dataLayer`:
   - Call 1: `['consent', 'default', { 'ad_storage': 'denied', 'analytics_storage': 'denied', 'ad_user_data': 'denied', 'ad_personalization': 'denied', 'functionality_storage': 'granted', 'security_storage': 'granted' }]`
   - Call 2: `['set', 'ads_data_redaction', true]`
   - Call 3: `['consent', 'update', { 'analytics_storage': 'granted', 'ad_storage': 'granted', 'ad_user_data': 'granted', 'ad_personalization': 'granted' }]`
2. **Client Navigation 1 (`/privacy-policy`):**
   - `page_view` events: **1**
   - Event Payload:
     ```json
     {
       "event": "page_view",
       "page_path": "/privacy-policy",
       "page_title": "গোপনীয়তা নীতি (Privacy Policy) | তথ্যবক্স | Totthobox",
       "page_location": "http://localhost:3000/privacy-policy",
       "gtm.uniqueEventId": 10
     }
     ```
3. **Client Navigation 2 (`/editorial-policy`):**
   - `page_view` events: **2**
   - Event Payload:
     ```json
     {
       "event": "page_view",
       "page_path": "/editorial-policy",
       "page_title": "কনটেন্ট ও সম্পাদকীয় নীতিমালা (Editorial Policy) | তথ্যবক্স | Totthobox",
       "page_location": "http://localhost:3000/editorial-policy",
       "gtm.uniqueEventId": 11
     }
     ```

---

## 5. Custom Events Coverage Matrix

| Event Name | Source Component | Trigger Condition | Status |
| :--- | :--- | :--- | :--- |
| `page_view` | `<RouteTracker />` | Next.js App Router client-side page transitions | **VERIFIED** (Fires exactly 1 per navigation, skips initial load) |
| `tool_used` | `<TrackToolUsage />` (via `ToolGuide`) | User opens any tool page | **VERIFIED** (Mounted via `components/ToolGuide.tsx`) |
| `converter_used`| `<TrackToolUsage />` (via `ToolGuide`) | User opens any converter page (`/converter/*`) | **VERIFIED** (Mounted via `components/ToolGuide.tsx`) |
| `search` | `<SearchModal />` | User executes a search query with non-empty input | **VERIFIED** (Fires on search submit/selection) |
| `outbound_click`| `<Footer />`, `<SearchModal />`, `<DownloadButton />` | User clicks an external link or official software source | **VERIFIED** (Fires on external link navigation) |
| `download_click`| `<DownloadButton />` | User clicks software download / source button | **VERIFIED** (Wired to `DownloadButton.tsx`) |
| `share` | `<ToolActions />` | User clicks native share or copies link to clipboard | **VERIFIED** (Fires with share method and title) |
| `404_view` | `<Track404 />` (`app/not-found.tsx`) | User lands on an unknown URL | **VERIFIED** (Mounted on root 404 page) |
| `infinite_scroll_load` | `<InfiniteList />` | User scrolls and fetches page >= 2 in feeds | **VERIFIED** (Fires with feed type and page number) |

---

## 6. What Works Today vs What Stays Blocked Until Backend Changes

### What Works Today (Right Now, Zero Backend Changes Needed):
1. **First-Party Visitor Pageviews:** The capability-aware proxy in `lib/server/analytics-proxy.ts` detects that `/api/analytics/pageview` is 404 and automatically forwards all telemetry to `/api/tracking/event` using the exact schema expected by Laravel `TrackingController::trackEvent`.
2. **First-Party Heartbeats:** Proxied to `/api/tracking/event` and `/api/tracking/sync-pwa`.
3. **Platform Statistics (`<UserAnalytics />`):** Fetched from `/api/analytics/stats`, which falls back to `/api/analytics/user-count`. Real numbers are rendered; fabricated fallbacks are removed; implausible values log a dev warning.
4. **Real Visitor IP & UA Forwarding:** Proxies forward `X-Forwarded-For`, `X-Real-IP`, and original `User-Agent` with a 3.5s timeout.
5. **GTM & GA4 Tracking:** Single GTM container loaded once, Consent Mode v2 default denied before GTM loads, dynamic consent updates on accept, returning visitor preference restoration, and SPA client route transitions tracked via `<RouteTracker />`.
6. **PWA & Offline Integrity:** `/api/*` and all non-GET requests are strictly `NetworkOnly` in the Service Worker.

### What Stays Blocked Until Backend Changes Are Applied:
1. **Uninflated Stats:** `/api/analytics/user-count` returns suspicious `10k` values for `online` and `today`. This requires removing hardcoded offsets/floors in Laravel `AnalyticsController` (detailed in `BACKEND_REQUIRED.md`).
2. **Direct REST Analytics:** Direct routes `/api/analytics/pageview`, `/api/analytics/heartbeat`, and `/api/analytics/stats` will return 404 until the migration and controller methods in `BACKEND_REQUIRED.md` are pasted into Laravel. (Frontend handles this transparently via fallback).
3. **Trusted Proxies on Laravel:** Laravel must be configured to trust proxy headers (`$middleware->trustProxies('*')`) so that `$request->ip()` resolves the visitor IP rather than the Next.js server IP for rate limiting and distinct visitor counting.
