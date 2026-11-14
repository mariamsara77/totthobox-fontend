/*
 * Expose regex for public documents in SW scope as defense-in-depth fallback.
 */
self.publicDocumentPath =
  /^\/(?:$|about-us(?:\/|$)|contact-us(?:\/|$)|services(?:\/|$)|privacy-policy(?:\/|$)|cookie-policy(?:\/|$)|copyright-policy(?:\/|$)|editorial-policy(?:\/|$)|terms-of-service(?:\/|$)|disclaimer(?:\/|$)|bangla(?:\/|$)|bangladesh(?:\/|$)|international(?:\/|$)|islam(?:\/|$)|converter(?:\/|$)|pdf-editor(?:\/|$)|tools(?:\/|$)|software(?:\/|$)|signs(?:\/|$)|contact\/police(?:\/|$)|news\/headlines(?:\/|$)|users(?:\/|$))/i;

/*
 * Delete only legacy runtime caches that may contain dynamic, personalized,
 * RSC, API, or otherwise non-public responses. Keep Workbox precache caches
 * so the offline fallback and versioned public static assets remain available.
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
