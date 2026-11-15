# Social Auth Diagnostics & Setup Guide (AUTH_DEBUG.md)

## Date: 2026-11-15
## Scope: Google & GitHub OAuth Integration on Totthobox (Next.js 16 App Router)

---

### 1. Executive Summary & Root Causes

#### Symptom 1: Google login works, but UI shows "config not set / not configured"
- **Root Cause:**
  In Next.js, `NEXT_PUBLIC_*` environment variables are statically evaluated and inlined into client JavaScript bundles **at build time** (`next build`).
  When `next build` ran in environments where `NEXT_PUBLIC_GOOGLE_CLIENT_ID` was unset or empty, the client bundle compiled `process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `undefined`.
  In `components/auth/GoogleLoginButton.tsx`, the component checked `if (!clientId)` and rendered:
  `"Google লগইন বর্তমানে কনফিগার করা নেই।"`
  Setting the environment variable on the server at runtime did not update the already-compiled client JavaScript bundle.
- **Resolution:**
  Centralized OAuth configuration in `lib/auth-config.ts` with hydration/SSR safety, client ID detection, dev-time warnings with exact variable names, and updated `.env.example` so that hosting dashboards (Vercel, VPS, Docker) include the variable during build.

#### Symptom 2: On localhost the problem comes back / live build env missing
- **Root Cause:**
  `.env.example` lacked the social login variable names, so production deployment pipelines omitted `NEXT_PUBLIC_GOOGLE_CLIENT_ID` during build. On localhost, missing or unquoted entries or running `next start` without rebuilding triggered the unconfigured UI fallback.
- **Resolution:**
  Declared all client and server OAuth variable placeholders in `.env.example`. Standardized `lib/auth-config.ts` to derive dynamic redirect URIs from `window.location.origin` at runtime so both `http://localhost:3000` and `https://totthobox.com` work seamlessly without hardcoded origins.

#### Symptom 3: GitHub popup redirects and closes, but main window is not logged in
- **Root Cause:**
  1. **Cross-Origin-Opener-Policy (COOP) severed `window.opener`:**
     In `next.config.ts`, `Cross-Origin-Opener-Policy: same-origin-allow-popups` was applied across `/(.*)`. When the popup navigated cross-origin from `github.com` to `/auth/github/callback`, the browser triggered a browsing context group switch, setting `window.opener = null`.
  2. **No Fallback Communication Channel:**
     `app/auth/github/callback/page.tsx` solely relied on `window.opener.postMessage(...)`. When `window.opener` was null, it executed `window.location.href = "/"` without ever exchanging the authorization code or notifying the opener.
  3. **Premature `window.close()` Race:**
     Calling `window.close()` synchronously right after `postMessage` killed the browser's IPC task queue before the message was delivered.
  4. **State / CSRF & Redirect URI Mismatch:**
     Missing CSRF `state` parameter and missing `redirect_uri` in the token exchange call to `https://github.com/login/oauth/access_token`.
  5. **ProfileMenu Null Safety:**
     GitHub users frequently have `name: null` and missing avatars. `components/ProfileMenu.tsx` assumed `user.name` is always a valid string, causing hydration or rendering anomalies.
- **Resolution:**
  - Added COOP relaxation (`unsafe-none`) specifically for `/auth/:path*` in `next.config.ts`.
  - Implemented multi-channel communication: `window.opener.postMessage` + `BroadcastChannel("totthobox-auth")` + `localStorage` storage event.
  - Delayed `window.close()` by 200ms to guarantee event flush.
  - Added `state` generation in `sessionStorage` and validation in `GithubLoginButton.tsx`.
  - Passed matching `redirect_uri` to `/api/auth/github`.
  - Added cross-tab/cross-window reactive synchronization in `AuthContext.tsx`.
  - Added null-safe fallbacks (`displayName = user.name || user.slug || user.email.split("@")[0] || "User"`) in `components/ProfileMenu.tsx`.

---

### 2. Files Changed

1. `lib/auth-config.ts` (New):
   Centralized configuration reader for `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and runtime redirect URIs. Exposes `isGoogleConfigured` and `isGithubConfigured`.
2. `.env.example`:
   Added placeholders for `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`, `NEXT_PUBLIC_GITHUB_CLIENT_ID`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `NEXT_PUBLIC_FACEBOOK_APP_ID`.
3. `components/auth/GoogleLoginButton.tsx`:
   Uses `getGoogleClientId()`, SSR/hydration mount safety, and user-friendly Bangla error messages for popup blockers or aborted logins.
4. `components/auth/GithubLoginButton.tsx`:
   CSRF `state` generation, multi-channel listener (`postMessage`, `BroadcastChannel`, `storage`), graceful popup watcher, and instant session mutation.
5. `app/auth/github/callback/page.tsx`:
   URL history cleanup (removes `?code=` and `?state=`), triple broadcast dispatch, safe delayed window close with automatic redirect fallback.
6. `app/api/auth/github/route.ts`:
   Accepts and validates `redirect_uri` for token exchange with GitHub OAuth per RFC standards, sets session cookies via `setAuthCookies`.
7. `context/AuthContext.tsx`:
   Added `BroadcastChannel("totthobox-auth")` and `storage` event listeners for cross-tab login/logout/sync events.
8. `components/ProfileMenu.tsx`:
   Reactivity to `AuthContext` updates; null-safe display name and avatar generator for users with null `name` or `email`.
9. `proxy.ts`:
   Excludes `api/`, `auth/`, and `sw.js` from middleware geo-cookie processing to prevent interference with OAuth and auth cookies.
10. `next.config.ts`:
    Added route header rule for `/auth/:path*` setting `Cross-Origin-Opener-Policy: unsafe-none` to retain popup opener references across external OAuth redirects.
11. `scripts/verify-auth.mjs` (New):
    Automated Playwright test suite verifying OAuth button rendering, callback simulation, ProfileMenu updates, null-user handling, and logout.

---

### 3. Owner Action Checklist: Hosting & Provider Setup

Follow this click-by-click checklist in the third-party consoles (Google Cloud, GitHub, Hosting Dashboard, Laravel Backend).

#### A. Hosting Dashboard (Vercel / VPS / Cloudflare / Docker)
> [!IMPORTANT]
> Because Next.js bakes `NEXT_PUBLIC_*` variables into client JavaScript bundles **at build time**, you MUST trigger a fresh **REDEPLOY / BUILD** after adding or updating these variables.

Set the following environment variable NAMES in your hosting dashboard:
```env
NEXT_PUBLIC_SITE_URL=https://totthobox.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>.apps.googleusercontent.com
NEXT_PUBLIC_GITHUB_CLIENT_ID=<your-github-oauth-client-id>
GITHUB_CLIENT_ID=<your-github-oauth-client-id>
GITHUB_CLIENT_SECRET=<your-github-oauth-client-secret>
```

---

#### B. Google Cloud Console Settings
1. Go to **Google Cloud Console** > **APIs & Services** > **Credentials**.
2. Click your OAuth 2.0 Client ID (Web application).
3. Under **Authorized JavaScript origins**, add:
   - `https://totthobox.com`
   - `https://www.totthobox.com`
   - `http://localhost:3000`
4. Under **Authorized redirect URIs**, add:
   - `https://totthobox.com/auth/callback`
   - `https://www.totthobox.com/auth/callback`
   - `http://localhost:3000/auth/callback`
5. Click **Save**.

---

#### C. GitHub Developer Settings
1. Go to **GitHub** > **Settings** > **Developer settings** > **OAuth Apps**.
2. Select your Totthobox OAuth App.
3. Set the following fields:
   - **Homepage URL**: `https://totthobox.com`
   - **Authorization callback URL**: `https://totthobox.com/auth/github/callback`
4. *(Optional for local testing)*: If developing extensively on localhost, create a secondary GitHub OAuth App named `Totthobox Local` with:
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
   And paste its client credentials into `.env.local`.

---

#### D. Laravel Backend Settings (`admin.totthobox.com`)
Do not edit frontend files for these; apply them to your Laravel backend:

1. **`config/services.php`**:
   Verify or add Socialite configurations:
   ```php
   'google' => [
       'client_id' => env('GOOGLE_CLIENT_ID'),
       'client_secret' => env('GOOGLE_CLIENT_SECRET'),
       'redirect' => env('GOOGLE_REDIRECT_URI', 'https://totthobox.com/auth/callback'),
   ],

   'github' => [
       'client_id' => env('GITHUB_CLIENT_ID'),
       'client_secret' => env('GITHUB_CLIENT_SECRET'),
       'redirect' => env('GITHUB_REDIRECT_URI', 'https://totthobox.com/auth/github/callback'),
   ],
   ```

2. **Laravel `.env`**:
   Ensure client credentials match the frontend:
   ```env
   GOOGLE_CLIENT_ID=<matching-google-client-id>
   GOOGLE_CLIENT_SECRET=<matching-google-client-secret>
   GITHUB_CLIENT_ID=<matching-github-client-id>
   GITHUB_CLIENT_SECRET=<matching-github-client-secret>
   ```

3. **CORS Configuration (`config/cors.php`)**:
   Ensure `allowed_origins` includes:
   ```php
   'allowed_origins' => [
       'https://totthobox.com',
       'https://www.totthobox.com',
       'http://localhost:3000',
   ],
   'supports_credentials' => true,
   ```

4. **Sanctum / Session Domains (`config/sanctum.php` & `config/session.php`)**:
   ```php
   // config/sanctum.php
   'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'totthobox.com,www.totthobox.com,localhost,localhost:3000')),
   ```
