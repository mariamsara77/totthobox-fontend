# Google Tag Manager (GTM) & GA4 Complete Configuration Guide

**Site:** https://totthobox.com  
**Primary GTM Container ID:** `GTM-5RFHKJJJ` (Configured via `NEXT_PUBLIC_GTM_ID`)  
**GA4 Measurement ID:** `G-HGE2T2J8ZT` (Configured via `NEXT_PUBLIC_GA_ID`)  

---

## 1. Architecture Summary

1. **Single GTM Container:** GTM script (`gtm.js?id=GTM-5RFHKJJJ`) is loaded once in `app/layout.tsx` via `next/script` (`strategy="afterInteractive"`) with a `<noscript>` iframe fallback.
2. **Zero Code Duplication:** GA4 (`gtag.js`) is NOT loaded directly in frontend code. GA4 is managed entirely within GTM to prevent double-counting.
3. **Region-Based Consent Mode v2:** Default consent state is initialized in `<head>` BEFORE GTM loads in the following order:
   - **Step 3a (EEA, UK, Switzerland Regional Default - Denied):** All 4 signals (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) set to `'denied'` for the 32 country codes (`['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH']`).
   - **Step 3b (Global Default - Granted):** All 4 signals set to `'granted'` for all other visitors worldwide (including Bangladesh, US, India, etc.).
   - **Step 3c (Override on Load):** Returning visitors with a saved cookie preference in `localStorage` (`cookie_consent`) get an immediate `gtag('consent', 'update', ...)` before GTM triggers tags.
   - **Step 3d (First-Party Tracker Synchronization):** The custom visitor tracker (`<DeferredVisitorTracker />` / `lib/visitor-tracker.ts`) reads the same consent state: sends by default outside EEA/UK/CH, never sends and does not write `tb_visitor_id` to `localStorage` in denied regions without an explicit user Accept. User Deny choice revokes both GTM analytics and the first-party tracker and deletes local visitor IDs.
   - `ads_data_redaction: true` is enabled.
4. **Single-Page Application (SPA) Route Tracking:** Next.js App Router client-side navigations trigger `<RouteTracker />` which pushes `{ event: "page_view", page_path, page_title, page_location }` to `window.dataLayer`. The initial hard load is skipped by `<RouteTracker />` so GTM's standard initialization handles the first page view without duplication.

---

## 2. Click-by-Click GTM Dashboard Setup

Follow these exact steps in your Google Tag Manager container (`GTM-5RFHKJJJ`):

### Step 2.1: User-Defined Variables

In GTM -> **Variables** -> **User-Defined Variables** -> Click **New**:

1. **`GA4 Measurement ID`**
   - Type: **Constant**
   - Value: `G-HGE2T2J8ZT`

2. **`dlv - page_path`**
   - Type: **Data Layer Variable**
   - Data Layer Variable Name: `page_path`
   - Data Layer Version: Version 2

3. **`dlv - page_title`**
   - Type: **Data Layer Variable**
   - Data Layer Variable Name: `page_title`
   - Data Layer Version: Version 2

4. **`dlv - page_location`**
   - Type: **Data Layer Variable**
   - Data Layer Variable Name: `page_location`
   - Data Layer Version: Version 2

5. **`dlv - tool_name`**
   - Type: **Data Layer Variable**
   - Data Layer Variable Name: `tool_name`

6. **`dlv - converter_name`**
   - Type: **Data Layer Variable**
   - Data Layer Variable Name: `converter_name`

7. **`dlv - search_term`**
   - Type: **Data Layer Variable**
   - Data Layer Variable Name: `search_term`

---

### Step 2.2: Triggers Setup

In GTM -> **Triggers** -> Click **New**:

1. **Trigger: `Initialization - All Pages`**
   - Trigger Type: **Consent Initialization - All Pages** (or **Initialization - All Pages**)
   - Name: `Initialization - All Pages`

2. **Trigger: `Custom Event - page_view`**
   - Trigger Type: **Custom Event**
   - Event name: `page_view`
   - This trigger fires on: **All Custom Events**
   - Name: `Custom Event - page_view`

3. **Trigger: `Custom Event - tool_used`**
   - Trigger Type: **Custom Event**
   - Event name: `tool_used`

4. **Trigger: `Custom Event - converter_used`**
   - Trigger Type: **Custom Event**
   - Event name: `converter_used`

5. **Trigger: `Custom Event - search`**
   - Trigger Type: **Custom Event**
   - Event name: `search`

6. **Trigger: `Custom Event - outbound_click`**
   - Trigger Type: **Custom Event**
   - Event name: `outbound_click`

7. **Trigger: `Custom Event - download_click`**
   - Trigger Type: **Custom Event**
   - Event name: `download_click`

8. **Trigger: `Custom Event - share`**
   - Trigger Type: **Custom Event**
   - Event name: `share`

9. **Trigger: `Custom Event - 404_view`**
   - Trigger Type: **Custom Event**
   - Event name: `404_view`

10. **Trigger: `Custom Event - infinite_scroll_load`**
    - Trigger Type: **Custom Event**
    - Event name: `infinite_scroll_load`

---

### Step 2.3: Tags Setup

In GTM -> **Tags** -> Click **New**:

#### Tag 1: Google Tag (GA4 Base Configuration)
- **Tag Type:** **Google Tag**
- **Tag ID:** `{{GA4 Measurement ID}}`
- **Configuration Settings:**
  - Add parameter: `send_page_view` = `false`
    *(Crucial: Disables the automatic initial pageview in Google Tag so that our custom page_view trigger cleanly and consistently manages all pageviews without duplicates).*
- **Triggering:** `Initialization - All Pages`
- **Consent Settings (Advanced Settings -> Consent Settings):**
  - Check "Require additional consent for tag to fire": select `analytics_storage`.

#### Tag 2: GA4 Event - Virtual Page View
- **Tag Type:** **Google Analytics: GA4 Event**
- **Measurement ID:** `{{GA4 Measurement ID}}`
- **Event Name:** `page_view`
- **Event Parameters:**
  - `page_location` : `{{dlv - page_location}}`
  - `page_path` : `{{dlv - page_path}}`
  - `page_title` : `{{dlv - page_title}}`
- **Triggering:**
  - Add Trigger: `Initialization - All Pages` (captures initial pageview)
  - Add Trigger: `Custom Event - page_view` (captures subsequent SPA navigations)
- **Consent Settings:**
  - Requires `analytics_storage`.

#### Tag 3: GA4 Custom Event - Tool & Converter Usage
- **Tag Type:** **Google Analytics: GA4 Event**
- **Measurement ID:** `{{GA4 Measurement ID}}`
- **Event Name:** `{{_event}}`
- **Event Parameters:**
  - `tool_name` : `{{dlv - tool_name}}`
  - `converter_name` : `{{dlv - converter_name}}`
- **Triggering:** `Custom Event - tool_used`, `Custom Event - converter_used`
- **Consent Settings:** Requires `analytics_storage`.

#### Tag 4: GA4 Custom Event - User Interactions (Search, Download, Share, 404)
- **Tag Type:** **Google Analytics: GA4 Event**
- **Measurement ID:** `{{GA4 Measurement ID}}`
- **Event Name:** `{{_event}}`
- **Triggering:** `Custom Event - search`, `Custom Event - download_click`, `Custom Event - outbound_click`, `Custom Event - share`, `Custom Event - 404_view`, `Custom Event - infinite_scroll_load`
- **Consent Settings:** Requires `analytics_storage`.

---

## 3. Testing & Validation Workflow

### Step 3.1: GTM Preview / Tag Assistant
1. In GTM, click the **Preview** button in the top right.
2. Enter your site URL: `https://totthobox.com` (or `http://localhost:3000` for local testing).
3. In the Tag Assistant debug window:
   - On initial load: Check the **Consent** tab -> Verify `analytics_storage` and `ad_storage` are **Denied**.
   - Accept the Cookie Banner on site: Verify a `consent` update event appears, and `analytics_storage` changes to **Granted**.
   - In the **Tags** tab, verify **Google Tag** and **GA4 Event - Virtual Page View** fire.
   - Click a link to another page (e.g. `/converter/land`): Verify `Custom Event - page_view` fires with the new path in Data Layer.

### Step 3.2: GA4 Realtime and DebugView
1. Open Google Analytics (GA4) -> **Admin** -> **DebugView** (under Data display).
2. Browse pages on Totthobox with Tag Assistant active.
3. Verify `page_view` events appear in the DebugView timeline in real time.
4. Verify custom events like `tool_used`, `search`, and `download_click` appear with parameters.
5. Check GA4 -> **Reports** -> **Realtime**: confirm active users and page views are tracked.

### Step 3.3: Publish the Container
1. Once testing in Tag Assistant passes, click **Submit** in GTM.
2. Enter Version Name: `v1.0 - Consent Mode v2 & SPA RouteTracker`.
3. Click **Publish**.

---

## 4. Excluding Internal Traffic

To prevent your own visits, editorial team edits, and testing from skewing analytics data:

1. In GA4 -> **Admin** -> **Data Streams** -> Click your web data stream (`https://totthobox.com`).
2. Click **Configure tag settings** (at the bottom).
3. Click **Show more** -> **Define internal traffic**.
4. Click **Create**:
   - Rule Name: `Internal Office / Developer Traffic`
   - `traffic_type`: `internal`
   - IP address: Select **IP address equals** and enter your public IPv4/IPv6 address.
5. In GA4 -> **Admin** -> **Data Filters**:
   - Locate the default filter named **Internal Traffic**.
   - Change Filter state from `Testing` to `Active` (after verifying in DebugView with `traffic_type = internal`).
   - Click **Save**.

---

## 5. Common Reasons for Zero Data (Troubleshooting Checklist)

If no data appears in GA4 Realtime or Reports, verify these points:

1. **Missing Build-Time Environment Variable:**
   - In Next.js, `NEXT_PUBLIC_` variables are baked in at **build time**.
   - If `NEXT_PUBLIC_GTM_ID` was not set in your Vercel or hosting build environment, the build fell back to the fallback or was blank.
   - Fix: Ensure `NEXT_PUBLIC_GTM_ID=GTM-5RFHKJJJ` is set in your hosting platform dashboard under Production Environment Variables and rebuild.

2. **Unpublished GTM Container:**
   - GTM tags and triggers only run in production after clicking **Submit** -> **Publish**. Changes saved in GTM are not live until published.

3. **Wrong Measurement ID:**
   - Verify the `GA4 Measurement ID` in GTM exactly matches your GA4 Data Stream Measurement ID (e.g., `G-HGE2T2J8ZT`).

4. **Ad Blocker / Brave Shields Active:**
   - Ad blockers (uBlock Origin, AdGuard) and Brave Shields block `googletagmanager.com` and `google-analytics.com` by default.
   - Disable ad blockers during testing.

5. **User Consent Denied:**
   - With Consent Mode v2, GA4 tags will NOT fire or collect identifiers until the user clicks "Accept" on the cookie banner.
   - In Tag Assistant, check if `analytics_storage` is `granted`.

6. **Filter State in GA4:**
   - If an internal traffic filter is active and your IP is listed, your visits will be excluded from standard reports (though visible in DebugView).
