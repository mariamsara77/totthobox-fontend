import type { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Let crawlers read route-level noindex directives. Robots.txt is not
        // an access-control mechanism; private routes must remain protected by auth.
        disallow: ["/api/"],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
    ],
    sitemap: "https://totthobox.com/sitemap.xml",
  };
}
