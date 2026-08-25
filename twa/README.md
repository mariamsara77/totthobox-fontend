# Totthobox Android TWA

This directory contains the source configuration for generating a Trusted Web Activity (TWA) from the production PWA.

## Prerequisites

- Production HTTPS site: `https://totthobox.com`
- Valid PWA manifest and service worker
- Android Studio / Java 17+ for local APK/AAB signing
- A release keystore owned by the app publisher

## Generate the Android project

Use Bubblewrap against the production manifest:

```bash
npx @bubblewrap/cli init --manifest https://totthobox.com/manifest.webmanifest
npx @bubblewrap/cli build
```

Use package id `com.totthobox.app` and the branding values in `twa-manifest.json`.

## Digital Asset Links

After the first signed Android build, publish `/.well-known/assetlinks.json` containing the **real SHA-256 certificate fingerprint** of the release signing certificate. Never commit a fake fingerprint.

Expected structure:

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

The fingerprint is intentionally not hard-coded here because it depends on the publisher's release keystore.

## Validation checklist

1. `https://totthobox.com/manifest.webmanifest` returns 200.
2. `https://totthobox.com/sw.js` returns 200.
3. `https://totthobox.com/.well-known/assetlinks.json` returns valid JSON and the release fingerprint.
4. Chrome DevTools Application > Manifest has no installability errors.
5. The signed APK/AAB opens the PWA in verified TWA mode without the Custom Tab fallback.
6. Push notification permission and service-worker delivery are tested on a real Android device.
