/*
 * Remove only legacy Workbox runtime caches that could contain dynamic,
 * account-specific, cookie-varying, or otherwise non-public responses.
 *
 * Do not delete the Workbox precache namespace: it contains versioned public
 * static assets and the offline fallback needed to preserve offline support.
 */
const legacyDynamicCacheNames = new Set([
  "pages",
  "pages-rsc",
  "pages-rsc-prefetch",
  "start-url",
  "next-data",
  "static-data-assets",
  "apis",
  "cross-origin",
  "next-image",
  "static-image-assets",
  "static-audio-assets",
  "static-video-assets",
  "public-document-pages-v2",
  "public-image-font-assets-v1",
]);

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => legacyDynamicCacheNames.has(cacheName))
          .map((cacheName) => caches.delete(cacheName)),
      );
    })(),
  );
});
