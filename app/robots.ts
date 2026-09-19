import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/login", "/register", "/forgot-password", "/reset-password", "/settings/", "/messages/", "/ai/chat/", "/offline"],
    },
    sitemap: "https://totthobox.com/sitemap.xml",
  };
}