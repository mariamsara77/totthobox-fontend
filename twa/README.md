# Totthobox Android TWA

This directory contains the production configuration and release checklist for packaging the Totthobox PWA as a Trusted Web Activity (TWA).

## Architecture

- **PWA:** `https://totthobox.com`
- **Web manifest:** `/manifest.webmanifest`
- **Service worker:** `/sw.js`
- **Digital Asset Links:** `/.well-known/assetlinks.json`
- **Android package:** `com.totthobox.app`
- **Fallback:** Custom Tabs when verified TWA conditions are unavailable

The web app remains the source of truth. The Android application is a thin, verified wrapper around the production PWA, so feature updates can ship through the website without duplicating the application UI.

## Prerequisites

- Production HTTPS site: `https://totthobox.com`
- Valid installable PWA manifest and service worker
- Android Studio and Java 17+
- Bubblewrap CLI
- A release keystore owned and controlled by the publisher

## Generate the Android project

```bash
npx @bubblewrap/cli init --manifest https://totthobox.com/manifest.webmanifest
npx @bubblewrap/cli build
```

Use package id `com.totthobox.app` and keep the branding values aligned with `twa-manifest.json`.

## Digital Asset Links

The website exposes `/.well-known/assetlinks.json` from a server route. Configure the production environment variable below with the **real SHA-256 certificate fingerprint of the release signing certificate**:

```text
TWA_SHA256_CERT_FINGERPRINT=AA:BB:CC:...
```

Never commit a fake fingerprint or a private keystore.

After deployment, this URL must return HTTP 200 and valid JSON:

```text
https://totthobox.com/.well-known/assetlinks.json
```

The returned target must contain:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.totthobox.app",
      "sha256_cert_fingerprints": ["RELEASE_CERT_SHA256"]
    }
  }
]
```

## Release validation

1. `https://totthobox.com/manifest.webmanifest` returns 200.
2. `https://totthobox.com/sw.js` returns 200.
3. `https://totthobox.com/offline` renders successfully.
4. `https://totthobox.com/.well-known/assetlinks.json` returns valid JSON with the release fingerprint.
5. Chrome DevTools → Application shows the manifest, service worker and installability without blocking errors.
6. Install the PWA on Android and verify standalone launch and offline fallback.
7. Build the signed AAB and verify the app opens in verified TWA mode without the browser address bar.
8. Test notification permission and push delivery on a real Android device after the project's subscription persistence/delivery backend is connected.

## Important

A TWA cannot bypass Digital Asset Links. Until the release certificate fingerprint is configured, the Android app should intentionally fall back to Custom Tabs rather than pretending that the domain is verified.
