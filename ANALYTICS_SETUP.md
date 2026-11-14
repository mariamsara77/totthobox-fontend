# Google Tag Manager (GTM) & GA4 Configuration Guide for Totthobox

This document outlines the exact Google Tag Manager (GTM) container configuration required for https://totthobox.com.

> **GTM Container ID:** `GTM-5RFHKJJJ` (or via `NEXT_PUBLIC_GTM_ID`)  
> **GA4 Measurement ID:** `G-HGE2T2J8ZT` (or via `NEXT_PUBLIC_GA_ID`)

---

## 1. Architecture Overview

1. **Single Container:** Only the GTM snippet (`gtm.js?id=GTM-5RFHKJJJ`) is loaded on the site via `next/script` (`strategy="afterInteractive"`).
2. **Consent Mode v2:** Default consent (`ad_storage: 'denied'`, `analytics_storage: 'denied'`, `ad_user_data: 'denied'`, `ad_personalization: 'denied'`) is set in the `<head>` *before* GTM loads. When a user consents via the on-site Cookie Settings banner, an update is sent to `gtag('consent', 'update', {...})`.
3. **No Code GA4 Duplication:** GA4 is **not** loaded directly via `gtag.js` in frontend code. It is configured exclusively inside GTM.
4. **SPA Route Tracking:** Next.js App Router client route transitions push `{ event: 'page_view', page_path, page_title, page_location }` to `window.dataLayer`.

---

## 2. GTM Variables Setup

Create the following User-Defined Variables in GTM:

| Variable Name | Variable Type | Configuration / Value |
| :--- | :--- | :--- |
| `GA4 Measurement ID` | Constant | `G-HGE2T2J8ZT` (or your active GA4 ID) |
| `dlv - page_path` | Data Layer Variable | Data Layer Variable Name: `page_path` |
| `dlv - page_title` | Data Layer Variable | Data Layer Variable Name: `page_title` |
| `dlv - page_location` | Data Layer Variable | Data Layer Variable Name: `page_location` |
| `dlv - tool_name` | Data Layer Variable | Data Layer Variable Name: `tool_name` |
| `dlv - converter_name` | Data Layer Variable | Data Layer Variable Name: `converter_name` |
| `dlv - search_term` | Data Layer Variable | Data Layer Variable Name: `search_term` |

---

## 3. GTM Triggers Setup

Create the following Triggers:

### 1. GA4 Initialization Trigger
- **Trigger Type:** Consent Initialization - All Pages (or Initialization - All Pages)
- **Name:** `Initialization - All Pages`

### 2. SPA Route Change Trigger
- **Trigger Type:** Custom Event
- **Event name:** `page_view`
- **Name:** `Custom Event - page_view`

### 3. Custom Event Triggers
- **Tool Used:** Custom Event, Event name: `tool_used`
- **Converter Used:** Custom Event, Event name: `converter_used`
- **Search:** Custom Event, Event name: `search`
- **Share:** Custom Event, Event name: `share`
- **Infinite Scroll:** Custom Event, Event name: `infinite_scroll_load`

---

## 4. GTM Tags Setup

### Tag 1: Google Tag (GA4 Configuration)
- **Tag Type:** Google Tag
- **Tag ID:** `{{GA4 Measurement ID}}`
- **Configuration Settings:**
  - `send_page_view`: `false` (IMPORTANT: set to false so the initial automatic pageview does not clash with SPA route changes, or use default if you only trigger custom page_view on subsequent SPA routes).
- **Triggering:** `Initialization - All Pages`
- **Consent Settings:** Built-in consent checks (`analytics_storage`).

### Tag 2: GA4 Event - Virtual Page View
- **Tag Type:** Google Analytics: GA4 Event
- **Measurement ID:** `{{GA4 Measurement ID}}`
- **Event Name:** `page_view`
- **Event Parameters:**
  - `page_location`: `{{dlv - page_location}}`
  - `page_path`: `{{dlv - page_path}}`
  - `page_title`: `{{dlv - page_title}}`
- **Triggering:** `Custom Event - page_view`
- **Consent Settings:** Requires `analytics_storage`.

### Tag 3: GA4 Custom Events (Tool, Search, etc.)
- **Tag Type:** Google Analytics: GA4 Event
- **Event Name:** `{{_event}}` (or individual tags for `tool_used`, `converter_used`, etc.)
- **Triggering:** Matching custom event triggers.

---

## 5. Verification Checklist

1. Enable **GTM Preview / Tag Assistant** (`https://tagassistant.google.com/`).
2. Navigate to `https://totthobox.com`.
3. Confirm `Consent` tab shows `ad_storage: denied` and `analytics_storage: denied` on initial load.
4. Accept cookies: verify `Consent` tab updates to `granted` and GA4 Configuration tag fires.
5. Click between links (e.g., `/bangla/calendar` -> `/converter/land`): verify `Custom Event - page_view` fires with updated `page_path` and `page_title`.
6. Inspect Network tab: verify **only one** request to `google-analytics.com/g/collect` per page transition.
