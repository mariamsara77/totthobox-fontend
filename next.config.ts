import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "totthobox.com",
      },
      {
        protocol: "https",
        hostname: "admin.totthobox.com", // Backend / API storage host
      },
      {
        protocol: "https",
        hostname: "*.totthobox.com", // All subdomains
      },
      {
        protocol: "http",
        hostname: "localhost", // For local backend images
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;