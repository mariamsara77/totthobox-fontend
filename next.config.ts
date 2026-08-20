import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'totthobox.com',
      },
      {
        protocol: 'https',
        hostname: '**.totthobox.com',
      },
      // যদি Cloudflare / S3 / অন্য CDN ব্যবহার করেন
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
    ],
  },
};

export default nextConfig;
