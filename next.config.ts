import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ১. ইমেজের কনফিগারেশন
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "totthobox.com",
      },
      {
        protocol: "https",
        hostname: "admin.totthobox.com",
      },
      {
        protocol: "https",
        hostname: "*.totthobox.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },

  // ২. প্রোডাকশনে কন্সোল লগ রিমুভ করা
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
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
        ],
      },
    ];
  },

  // ৩. প্যাকেজ অপ্টিমাইজেশন
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
};

export default nextConfig;