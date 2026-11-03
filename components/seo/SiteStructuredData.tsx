export default function SiteStructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://totthobox.com/#organization",
        name: "Totthobox",
        alternateName: "তথ্যবক্স",
        url: "https://totthobox.com/",
        logo: {
          "@type": "ImageObject",
          url: "https://totthobox.com/og-image.png",
          width: 1200,
          height: 630,
        },
        description:
          "Totthobox হলো একটি আধুনিক ডিজিটাল ইনফরমেশন ও ইউটিলিটি সার্ভিস প্ল্যাটফর্ম। দৈনন্দিন প্রয়োজনীয় তথ্য, বাংলা ক্যালেন্ডার, কনভার্টার ও প্রযুক্তিগত টুলস এক জায়গায়।",
        email: "admin@totthobox.com",
        sameAs: [
          "https://facebook.com/totthobox",
          "https://x.com/totthobox",
          "https://t.me/totthobox",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "admin@totthobox.com",
            availableLanguage: ["Bengali", "English"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://totthobox.com/#website",
        url: "https://totthobox.com/",
        name: "Totthobox",
        alternateName: "তথ্যবক্স",
        inLanguage: "bn-BD",
        publisher: { "@id": "https://totthobox.com/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://totthobox.com/?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      id="totthobox-site-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
