import React from "react";
import Link from "next/link";
import { BookOpen, HelpCircle, AlertCircle, ArrowRight, ChevronDown } from "lucide-react";

export interface EditorialArticle {
  title: string;
  badge?: string;
  subtitle?: string;
  introduction: string[];
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  disclaimer?: string;
  sources?: {
    name: string;
    url: string;
    note?: string;
  }[];
  relatedLinks?: {
    title: string;
    href: string;
    description?: string;
  }[];
}

interface EditorialSectionProps {
  article: EditorialArticle;
  className?: string;
}

export default function EditorialSection({ article, className = "" }: EditorialSectionProps) {
  const { title, badge, subtitle, introduction, sections, faqs, disclaimer, sources, relatedLinks } = article;

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <article
      className={`mt-12 space-y-10 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-10 text-zinc-800 dark:text-zinc-200 ${className}`}
    >
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header & Intro */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{badge || "তথ্যকোষ ও বিস্তারিত পর্যালোচনা"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {introduction.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      {sections.map((sec, idx) => (
        <section key={idx} className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {sec.heading}
          </h3>
          <div className="space-y-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx}>{p}</p>
            ))}
          </div>
          {sec.bullets && sec.bullets.length > 0 && (
            <ul className="space-y-1.5 pt-1 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              {sec.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0" />
            <span>সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</span>
          </h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30 transition">
                  <span>{faq.question}</span>
                  <ChevronDown className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition shrink-0 ml-2" />
                </summary>
                <div className="px-4 pb-4 pt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/50 dark:border-zinc-800/50">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Sources */}
      {sources && sources.length > 0 && (
        <section className="space-y-3 border-t border-zinc-200/60 pt-4 dark:border-zinc-800/60">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            তথ্যসূত্র ও আরও পড়ুন
          </h3>
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-600 dark:text-indigo-400"
                >
                  {source.name}
                </a>
                {source.note && (
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {source.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            সূত্রের সাধারণ তালিকা দেওয়া হয়েছে; প্রতিটি তথ্য বা দাবির পাশে নির্দিষ্ট নথি-রেফারেন্স যোগ করার কাজ সম্পাদকীয়ভাবে যাচাই করা প্রয়োজন।
          </p>
        </section>
      )}

      {/* Disclaimer */}
      {disclaimer && (
        <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{disclaimer}</p>
        </div>
      )}

      {/* Related Links */}
      {relatedLinks && relatedLinks.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            সম্পর্কিত অন্যান্য তথ্য ও সেবা
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="p-3.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 transition group block"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  <span>{link.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
                {link.description && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                    {link.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
