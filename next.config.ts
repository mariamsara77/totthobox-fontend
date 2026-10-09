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
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  extendDefaultRuntimeCaching: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    runtimeCaching: [publicNewsApiCaching, apiNetworkOnlyCaching],
  },
});

export default isDev ? nextConfig : withPWA(nextConfig);
