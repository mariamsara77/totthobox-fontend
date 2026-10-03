import type { ReactNode } from "react";

type FAQ = { question: string; answer: string };
type Props = { name: string; description: string; path: string; applicationCategory?: string; faqs?: FAQ[]; children: ReactNode };

export default function ToolStructuredData({ name, description, path, applicationCategory = "UtilitiesApplication", faqs = [], children }: Props) {
  const url = "https://totthobox.com" + path;
  const visibleFaqs = faqs.length ? faqs : [
    { question: name + " কী?", answer: description },
    { question: "এই টুলে কি আমার ডেটা সার্ভারে পাঠানো হয়?", answer: "এই utility tools-এর processing browser/client-side-এ করা হয়; প্রয়োজনীয় কাজের জন্য ফাইল বা লেখা আলাদা করে Totthobox server-এ upload করা হয় না।" },
  ];
  const graph: Record<string, unknown>[] = [
    { "@type": "WebApplication", "@id": url + "#webapp", name, url, description, applicationCategory, operatingSystem: "Any", browserRequirements: "Requires JavaScript", offers: { "@type": "Offer", price: 0, priceCurrency: "BDT" } },
    { "@type": "SoftwareApplication", "@id": url + "#software", name, url, description, applicationCategory, operatingSystem: "Any", offers: { "@type": "Offer", price: 0, priceCurrency: "BDT" } },
    { "@type": "FAQPage", "@id": url + "#faq", mainEntity: visibleFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
    {children}
    <section className="mx-auto mt-8 w-full max-w-3xl space-y-3 px-4 pb-8" aria-labelledby="tool-faq-title"><h2 id="tool-faq-title" className="text-lg font-semibold">সাধারণ প্রশ্ন</h2>{visibleFaqs.map((faq)=><details key={faq.question} className="rounded-xl bg-zinc-400/10 p-4"><summary className="cursor-pointer text-sm font-medium">{faq.question}</summary><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{faq.answer}</p></details>)}</section>
  </>;
}
