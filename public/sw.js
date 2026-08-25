const VERSION = "totthobox-v4";
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const DATA_CACHE = `${VERSION}-data`;
const OFFLINE_URL = "/offline";
const MAX_RUNTIME_ENTRIES = 100;
const MAX_DATA_ENTRIES = 50;

const APP_SHELL = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512x512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("totthobox-") && ![STATIC_CACHE, RUNTIME_CACHE, DATA_CACHE].includes(key))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    data = { body: event.data?.text() ?? "" };
  }

  const title = typeof data.title === "string" ? data.title : "Totthobox";
  const body = typeof data.body === "string" ? data.body : "নতুন আপডেট এসেছে।";
  const targetUrl = typeof data.url === "string" && data.url.startsWith("/") ? data.url : "/";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: typeof data.tag === "string" ? data.tag : "totthobox-notification",
      renotify: true,
      data: { url: targetUrl },
      vibrate: [100, 50, 100],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((client) => new URL(client.url).origin === self.location.origin);
      if (existing) {
        return existing.navigate(target).then(() => existing.focus());
      }
      return clients.openWindow(target);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (url.pathname === "/manifest.webmanifest") {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (url.pathname.startsWith("/_next/image")) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, MAX_RUNTIME_ENTRIES));
    return;
  }

  if (request.destination === "image" || request.destination === "font") {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, MAX_RUNTIME_ENTRIES));
    return;
  }

  if (request.headers.get("accept")?.includes("application/json")) {
    event.respondWith(networkFirstData(request));
  }
});

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      await putLimited(RUNTIME_CACHE, request, response.clone(), MAX_RUNTIME_ENTRIES);
    }
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match(OFFLINE_URL));
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok) await putLimited(cacheName, request, response.clone(), MAX_RUNTIME_ENTRIES);
    return response;
  } catch {
    return caches.match(request).then((cached) => cached || new Response("Offline", { status: 503 }));
  }
}

async function networkFirstData(request) {
  try {
    const response = await fetch(request);
    if (response.ok) await putLimited(DATA_CACHE, request, response.clone(), MAX_DATA_ENTRIES);
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(
      JSON.stringify({ offline: true, data: null }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) await putLimited(cacheName, request, response.clone(), MAX_RUNTIME_ENTRIES);
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then(async (response) => {
      if (response.ok) await putLimited(cacheName, request, response.clone(), limit);
      return response;
    })
    .catch(() => cached);

  return cached || network;
}

async function putLimited(cacheName, request, response, limit) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  const keys = await cache.keys();
  if (keys.length <= limit) return;

  await Promise.all(
    keys.slice(0, keys.length - limit).map((key) => cache.delete(key))
  );
}
