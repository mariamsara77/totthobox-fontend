import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import type { RuntimeCaching } from "workbox-build";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "totthobox.com" },
      { protocol: "https", hostname: "admin.totthobox.com" },
      { protocol: "https", hostname: "**.totthobox.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },

  compiler: {
    removeConsole: !isDev,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(!isDev
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },
              ]
            : []),
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },

  experimental: {
    // Inline the small route CSS manifests into HTML so the first render does
    // not wait on separate render-blocking stylesheet requests.
    inlineCss: true,
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
};

const publicNewsApiCaching: RuntimeCaching = {
  urlPattern: /^https:\/\/admin\.totthobox\.com\/api\/news(?:\/(?:sources|[A-Za-z0-9][A-Za-z0-9-]*))?(?:\?.*)?$/i,
  handler: "NetworkFirst",
  method: "GET",
  options: {
    cacheName: "public-news-api-v1",
    networkTimeoutSeconds: 3,
    cacheableResponse: { statuses: [0, 200] },
    expiration: { maxEntries: 40, maxAgeSeconds: 300 },
  },
};

const safeNextStaticCaching: RuntimeCaching = {
  urlPattern: ({ sameOrigin, url }) =>
    sameOrigin && url.pathname.startsWith("/_next/static/"),
  handler: "CacheFirst",
  method: "GET",
  options: {
    cacheName: "totthobox-next-static-v1",
    cacheableResponse: { statuses: [0, 200] },
    expiration: { maxEntries: 250, maxAgeSeconds: 31536000 },
  },
};

const safePublicAssetCaching: RuntimeCaching = {
  urlPattern: ({ sameOrigin, url }) =>
    sameOrigin && /\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?)$/i.test(url.pathname),
  handler: "StaleWhileRevalidate",
  method: "GET",
  options: {
    cacheName: "totthobox-public-assets-v1",
    cacheableResponse: { statuses: [0, 200] },
    expiration: { maxEntries: 100, maxAgeSeconds: 604800 },
  },
};

const apiNetworkOnlyCaching: RuntimeCaching = {
  handler: "NetworkOnly",
  method: "GET",
  options: {
    cacheName: "api-network-only",
  },
  urlPattern: /^https?:\/\/[^/]+\/api(?:\/|$)/i,
};

const withPWA = withPWAInit({
  dest: "public",
  disable: isDev,
  // Do not cache HTML/RSC navigation responses: pages include account, message,
  // and settings surfaces that must never be replayed from a shared SW cache.
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  // Replace Workbox defaults: generic pages/pages-rsc/API rules can cache private data.
  extendDefaultRuntimeCaching: false,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    runtimeCaching: [publicNewsApiCaching, apiNetworkOnlyCaching, safeNextStaticCaching, safePublicAssetCaching],
  },
});

export default isDev ? nextConfig : withPWA(nextConfig);
