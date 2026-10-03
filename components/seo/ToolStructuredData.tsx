import type { ReactNode } from "react";

type FAQ = { question: string; answer: string };
type Props = { name: string; description: string; path: string; applicationCategory?: string; faqs?: FAQ[]; children: ReactNode };

export default function ToolStructuredData({ name, description, path, applicationCategory = "UtilitiesApplication", faqs = [], children }: Props) {
  const url = "https://totthobox.com" + path;
  const graph: Record<string, unknown>[] = [
    { "@type": "WebApplication", "@id": url + "#webapp", name, url, description, applicationCategory, operatingSystem: "Any", browserRequirements: "Requires JavaScript", offers: { "@type": "Offer", price: 0, priceCurrency: "BDT" } },
    { "@type": "SoftwareApplication", "@id": url + "#software", name, url, description, applicationCategory, operatingSystem: "Any", offers: { "@type": "Offer", price: 0, priceCurrency: "BDT" } },
  ];
  if (faqs.length) graph.push({ "@type": "FAQPage", "@id": url + "#faq", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) });
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />{children}</>;
}
