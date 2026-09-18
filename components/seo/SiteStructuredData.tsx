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
        logo: "https://totthobox.com/og-image.png",
      },
      {
        "@type": "WebSite",
        "@id": "https://totthobox.com/#website",
        url: "https://totthobox.com/",
        name: "Totthobox",
        alternateName: "তথ্যবক্স",
        inLanguage: "bn-BD",
        publisher: { "@id": "https://totthobox.com/#organization" },
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
