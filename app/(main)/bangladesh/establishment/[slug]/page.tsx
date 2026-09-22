import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import EstablishmentShowClient from "./EstablishmentShowClient";
import type { Establishment } from "@/types/establishment";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/*
|--------------------------------------------------------------------------
| Site configuration
|--------------------------------------------------------------------------
*/

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://totthobox.com";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const SITE_NAME = "Totthobox";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

/**
 * Remove HTML and decode common HTML entities
 * before using content inside SEO metadata.
 */
function stripHtml(value: string = ""): string {
  return value
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Create a clean SEO description.
 */
function createDescription(
  description: string | null | undefined,
  title: string,
): string {
  const cleanDescription = stripHtml(description || "");

  const fallback = `${title} সম্পর্কে বিস্তারিত তথ্য, ইতিহাস, অবস্থান ও গুরুত্বপূর্ণ তথ্য জানুন।`;

  const result = cleanDescription || fallback;

  if (result.length <= 160) {
    return result;
  }

  return `${result.slice(0, 157).trim()}...`;
}

/**
 * Always return an absolute image URL.
 */
function getAbsoluteImageUrl(
  imageUrl: string | null | undefined,
): string | undefined {
  if (!imageUrl) {
    return undefined;
  }

  try {
    return new URL(imageUrl, SITE_URL).toString();
  } catch {
    return undefined;
  }
}

/*
|--------------------------------------------------------------------------
| Establishment API
|--------------------------------------------------------------------------
|
| React cache() prevents generateMetadata() and the page from
| unnecessarily requesting the same resource twice during
| the same server render.
|
*/

const getEstablishment = cache(
  async (slug: string): Promise<Establishment | null> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/establishment-bd/${encodeURIComponent(slug)}`,
        {
          next: {
            revalidate: 300,
            tags: [`establishment:${slug}`],
          },
        },
      );

      if (!response.ok) {
        return null;
      }

      const json = await response.json();

      return json?.data ?? null;
    } catch (error) {
      console.error(`Failed to fetch establishment: ${slug}`, error);

      return null;
    }
  },
);

/*
|--------------------------------------------------------------------------
| SEO Metadata
|--------------------------------------------------------------------------
*/

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const item = await getEstablishment(slug);

  /*
  |--------------------------------------------------------------------------
  | 404 metadata
  |--------------------------------------------------------------------------
  */

  if (!item) {
    return {
      title: "স্থাপনা পাওয়া যায়নি | Totthobox",

      description: "অনুরোধ করা স্থাপনা বা প্রতিষ্ঠানটির তথ্য পাওয়া যায়নি।",

      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Page SEO
  |--------------------------------------------------------------------------
  */

  const title = `${item.title} | বাংলাদেশের স্থাপনা ও প্রতিষ্ঠান | Totthobox`;

  const description = createDescription(item.description, item.title);

  const canonicalUrl = `${SITE_URL}/bangladesh/establishment/${encodeURIComponent(
    item.slug,
  )}`;

  const imageUrl = getAbsoluteImageUrl(item.image_url);

  return {
    /*
    |--------------------------------------------------------------------------
    | Title & description
    |--------------------------------------------------------------------------
    */

    title,

    description,

    /*
    |--------------------------------------------------------------------------
    | Canonical
    |--------------------------------------------------------------------------
    */

    alternates: {
      canonical: canonicalUrl,
    },

    /*
    |--------------------------------------------------------------------------
    | Robots
    |--------------------------------------------------------------------------
    */

    robots: {
      index: stripHtml(item.description || "").length > 0,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Open Graph
    |--------------------------------------------------------------------------
    */

    openGraph: {
      type: "article",

      locale: "bn_BD",

      siteName: SITE_NAME,

      url: canonicalUrl,

      title,

      description,

      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: item.title,
              },
            ],
          }
        : {}),
    },

    /*
    |--------------------------------------------------------------------------
    | Twitter / X
    |--------------------------------------------------------------------------
    */

    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",

      title,

      description,

      ...(imageUrl
        ? {
            images: [imageUrl],
          }
        : {}),
    },

    /*
    |--------------------------------------------------------------------------
    | Article metadata
    |--------------------------------------------------------------------------
    */

    ...(item.created_at || item.updated_at
      ? {
          other: {
            ...(item.created_at
              ? {
                  "article:published_time": item.created_at,
                }
              : {}),

            ...(item.updated_at
              ? {
                  "article:modified_time": item.updated_at,
                }
              : {}),
          },
        }
      : {}),
  };
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default async function EstablishmentShowPage({ params }: Props) {
  const { slug } = await params;

  const item = await getEstablishment(slug);

  /*
  |--------------------------------------------------------------------------
  | 404
  |--------------------------------------------------------------------------
  */

  if (!item) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/bangladesh/establishment/${encodeURIComponent(
    item.slug,
  )}`;

  const imageUrl = getAbsoluteImageUrl(item.image_url);

  const description = createDescription(item.description, item.title);

  /*
  |--------------------------------------------------------------------------
  | Article Schema
  |--------------------------------------------------------------------------
  */

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",

    "@id": `${canonicalUrl}#article`,

    headline: item.title,

    description,

    url: canonicalUrl,

    inLanguage: "bn-BD",

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },

    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },

    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },

    ...(imageUrl
      ? {
          image: {
            "@type": "ImageObject",
            url: imageUrl,
            width: 1200,
            height: 630,
          },
        }
      : {}),

    ...(item.created_at
      ? {
          datePublished: item.created_at,
        }
      : {}),

    ...(item.updated_at
      ? {
          dateModified: item.updated_at,
        }
      : {}),
  };

  /*
  |--------------------------------------------------------------------------
  | Breadcrumb Schema
  |--------------------------------------------------------------------------
  */

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "হোম",
        item: SITE_URL,
      },

      {
        "@type": "ListItem",
        position: 2,
        name: "বাংলাদেশ",
        item: `${SITE_URL}/bangladesh`,
      },

      {
        "@type": "ListItem",
        position: 3,
        name: "স্থাপনা ও প্রতিষ্ঠান",
        item: `${SITE_URL}/bangladesh/establishment`,
      },

      {
        "@type": "ListItem",
        position: 4,
        name: item.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      {/* Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <EstablishmentShowClient establishment={item} />
    </>
  );
}
