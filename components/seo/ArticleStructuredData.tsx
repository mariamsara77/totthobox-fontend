import React from "react";

export interface ArticleStructuredDataProps {
  title: string;
  description: string;
  url: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  authorUrl?: string;
  imageUrl?: string;
  section?: string;
}

export default function ArticleStructuredData({
  title,
  description,
  url,
  publishedTime,
  modifiedTime,
  authorName = "Totthobox Editorial Team",
  authorUrl = "https://totthobox.com/about-us",
  imageUrl = "https://totthobox.com/og-image.png",
  section = "Digital Services & Information",
}: ArticleStructuredDataProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    description: description,
    image: imageUrl ? [imageUrl] : ["https://totthobox.com/og-image.png"],
    datePublished: publishedTime || "2026-01-01T00:00:00+06:00",
    dateModified: modifiedTime || new Date().toISOString(),
    articleSection: section,
    inLanguage: "bn-BD",
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Totthobox",
      url: "https://totthobox.com",
      logo: {
        "@type": "ImageObject",
        url: "https://totthobox.com/og-image.png",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
