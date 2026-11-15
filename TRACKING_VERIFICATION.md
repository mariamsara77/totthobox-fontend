# Tracking & Analytics Verification Report

**Date:** 2026-11-15  
**Workspace:** totthobox-fontend (Next.js 16 App Router)  
**Backend:** https://admin.totthobox.com/api  

---

## 1. Tracking & Analytics Architecture Call Map

| Source Component | Lib / Utility Function | Next.js Proxy Route | Upstream Laravel Backend Endpoint | Request Payload Shape | Response Handling |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<DeferredVisitorTracker />` -> `<VisitorTracker />` | `trackVisitorPageView(path)` (`lib/visitor-tracker.ts`) | `POST /api/analytics/pageview` | `POST https://admin.totthobox.com/api/tracking/event` | `{ category: "page", action: "view", js_visitor_id, session_id, payload: { path, url, title, referrer, is_pwa, has_installed, is_first_visit, utm_source, utm_medium, utm_campaign, load_time_ms, screen_res, timezone, device_type, language } }` | Proxies Laravel response; dev mode reflects status & errors; prod returns 200/status |
| `<DeferredVisitorTracker />` -> `<VisitorTracker />` | `sendVisitorHeartbeat(path)` (`lib/visitor-tracker.ts`) | `POST /api/analytics/heartbeat` | `POST https://admin.totthobox.com/api/tracking/event` & (if PWA) `POST https://admin.totthobox.com/api/tracking/sync-pwa` | Primary: `{ category: "heartbeat", action: "ping", js_visitor_id, session_id, payload: { path, url, is_pwa, has_installed, timestamp } }`<br/>PWA sync: `{ is_pwa, has_installed }` | Proxies Laravel response |
| `<UserAnalytics />` | `fetch('/api/analytics/stats')` | `GET /api/analytics/stats` | `GET https://admin.totthobox.com/api/analytics/user-count` | *(None / GET)* | Returns `{ status: "success", data: { total, today, online, pwa } }` cached for 60s |
| `<RouteTracker />` | `trackGTMPageView(url, title)` (`lib/analytics.ts`) | Client-side only (GTM DataLayer) | Google Tag Manager / GA4 | `{ event: "page_view", page_path, page_location, page_title }` via `window.dataLayer.push()` | Processed by GTM container `GTM-5RFHKJJJ` |
| Tools/Calculators/Search/Shares | `trackEvent(event, params)` (`lib/analytics.ts`) | Client-side only (GTM DataLayer) | Google Tag Manager / GA4 | Custom events: `tool_used`, `converter_used`, `search`, `outbound_click`, `share`, `404_view`, `infinite_scroll_load` | Processed by GTM container `GTM-5RFHKJJJ` |
| *(Legacy / Unused)* | Previously `lib/tracker.ts` | `POST /api/tracking/event` | `POST https://admin.totthobox.com/api/tracking/event` | Raw tracking event | Unused by frontend components |
| *(Legacy / Unused)* | Previously `lib/tracker.ts` | `POST /api/tracking/sync` | `POST https://admin.totthobox.com/api/tracking/sync` | `{ activities: [...] }` | Unused by frontend components |
| *(Legacy / Unused)* | Previously `lib/tracker.ts` | `POST /api/tracking/sync-pwa` | `POST https://admin.totthobox.com/api/tracking/sync-pwa` | `{ is_pwa, has_installed }` | Unused by frontend components |

---

## 2. Layout Tracker Mount & Double-Send Audit

### Layout Mount Audit (`app/layout.tsx`):
- Line 187: `<RouteTracker />` — Handles client-side GTM `page_view` events for Google Analytics.
- Line 189: `<TagManager />` — Synchronizes cookie consent preferences with Consent Mode v2 on mount and updates. Does not emit pageviews or network requests.
- Line 192: `<DeferredVisitorTracker />` — Defers loading until browser idle (`requestIdleCallback`), then mounts `<VisitorTracker />` for first-party analytics.
- **Double-Sending Status:** **NO double-sending components**.
  - The legacy tracker (`lib/tracker.ts` and `components/VisitorTracker.tsx`) was removed in previous refactors.
  - Exactly ONE first-party tracker (`<DeferredVisitorTracker />` -> `<VisitorTracker />`) is mounted in `app/layout.tsx`.
  - Exactly ONE GTM router tracker (`<RouteTracker />`) is mounted in `app/layout.tsx`.

---

## 3. Live Backend Probe Results

Probed `https://admin.totthobox.com/api` using Node `fetch` on 2026-11-15 with test visitor ID `test-audit-visitor-cdf124d0`:

| Endpoint Probed | Method | HTTP Status | Response Body Summary | Real Backend Status |
| :--- | :--- | :--- | :--- | :--- |
| `/tracking/event` | POST | **200 OK** | `{"status":"success"}` | **Working** (Accepts `category`, `action`, `js_visitor_id`, `session_id`, `payload`) |
| `/tracking/sync-pwa` | POST | **200 OK** | `{"status":"success","is_pwa":false,"has_installed":false,"visitor_id":21803}` | **Working** (Accepts `is_pwa`, `has_installed`) |
| `/tracking/sync` | POST | **422 Unprocessable** / **200 OK** | `{ "status": "success", "message": "Synced successfully", "count": 1 }` (when root `activities` array provided) | **Working** (Requires top-level `activities: [...]`) |
| `/analytics/pageview` | POST | **404 Not Found** | `{"message":"The route api/analytics/pageview could not be found."}` | **Does NOT exist yet on backend** |
| `/analytics/heartbeat` | POST | **404 Not Found** | `{"message":"The route api/analytics/heartbeat could not be found."}` | **Does NOT exist yet on backend** |
| `/analytics/stats` | GET | **404 Not Found** | `{"message":"The route api/analytics/stats could not be found."}` | **Does NOT exist yet on backend** |
| `/analytics/user-count` | GET | **200 OK** | `{"status":"success","data":{"total":"117.45k","today":"10k","online":"10k","pwa":"10.11k"}}` | **Working** (Returns user counts; suspicious round numbers detected: online 10k, today 10k) |

---

## 4. Key Findings from Audit

1. **Proxy Endpoint Mismatch Resolved via Fallbacks:**
   - The ideal REST endpoints `/api/analytics/pageview`, `/api/analytics/heartbeat`, and `/api/analytics/stats` are NOT present on Laravel.
   - The proxies in `app/api/analytics/*` currently translate incoming requests to `/tracking/event` and `/analytics/user-count`.
   - Phase 2 will implement an intelligent capability-aware proxy with an in-memory cache (~10 min) that tries the new endpoint first, detects 404/405, and gracefully uses the working `/tracking/*` and `/analytics/user-count` endpoints without losing any client telemetry.

2. **Suspicious Backend Counts in `/analytics/user-count`:**
   - Response contains: `total: "117.45k"`, `today: "10k"`, `online: "10k"`, `pwa: "10.11k"`.
   - `online: "10k"` and `today: "10k"` indicate a hardcoded floor or offset (e.g. `max(10000, ...)` or a placeholder seed). This will be flagged and documented in `BACKEND_REQUIRED.md`.
