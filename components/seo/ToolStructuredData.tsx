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
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
    {children}
    {faqs.length > 0 && <section className="mx-auto mt-8 w-full max-w-3xl space-y-3 px-4 pb-8" aria-labelledby="tool-faq-title"><h2 id="tool-faq-title" className="text-lg font-semibold">সাধারণ প্রশ্ন</h2>{faqs.map((faq)=><details key={faq.question} className="rounded-xl bg-zinc-400/10 p-4"><summary className="cursor-pointer text-sm font-medium">{faq.question}</summary><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{faq.answer}</p></details>)}</section>}
  </>;
}
