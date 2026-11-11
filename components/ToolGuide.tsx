import React from "react";
import Link from "next/link";
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Calculator,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  BookOpen,
} from "lucide-react";

export interface WorkedExample {
  title: string;
  input: string;
  output: string;
  explanation: string;
}

export interface HowToStep {
  step: number;
  title: string;
  description: string;
}

export interface RuleOrFormula {
  title: string;
  explanation: string;
  formula?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  title: string;
  href: string;
  description: string;
}

export interface ToolGuideData {
  title: string;
  subtitle?: string;
  introduction: string[];
  howToUse?: HowToStep[];
  formulasOrRules?: RuleOrFormula[];
  workedExamples?: WorkedExample[];
  tipsOrMistakes?: string[];
  commonMistakesAndTips?: string[];
  faqs: FAQItem[];
  relatedTools?: RelatedLink[];
  relatedLinks?: RelatedLink[];
  sources?: {
    name: string;
    url: string;
    note?: string;
  }[];
  disclaimer?: string;
}

interface ToolGuideProps {
  content?: ToolGuideData;
  guide?: ToolGuideData;
  className?: string;
}

export default function ToolGuide({ content, guide, className = "" }: ToolGuideProps) {
  const guideData = content || guide;
  if (!guideData) return null;

  const {
    title,
    subtitle,
    introduction,
    howToUse,
    formulasOrRules,
    workedExamples,
    tipsOrMistakes,
    commonMistakesAndTips,
    faqs,
    relatedTools,
    relatedLinks,
    sources,
    disclaimer,
  } = guideData;

  const activeTips = tipsOrMistakes || commonMistakesAndTips;
  const activeLinks = relatedTools || relatedLinks;

  // Generate FAQPage JSON-LD
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  } : null;

  return (
    <article
      className={`mt-12 space-y-10 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-10 text-zinc-800 dark:text-zinc-200 ${className}`}
    >
      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Guide Header & Introduction */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ব্যবহার নির্দেশিকা ও বিস্তারিত গাইড</span>
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

        <div className="space-y-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          {introduction.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* How to Use Steps */}
      {howToUse && howToUse.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>কীভাবে ব্যবহার করবেন (ধাপে ধাপে)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {howToUse.map((step) => (
              <div
                key={step.step}
                className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/70 space-y-1.5"
              >
                <div className="flex items-center gap-2 font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-[11px]">
                    {step.step}
                  </span>
                  <span>{step.title}</span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 pl-7">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Formulas & Calculation Rules */}
      {formulasOrRules && formulasOrRules.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Calculator className="w-5 h-5 text-blue-500 shrink-0" />
            <span>হিসাব ও রূপান্তরের নিয়মাবলী</span>
          </h3>

          <div className="space-y-3">
            {formulasOrRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2"
              >
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {rule.title}
                </h4>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {rule.explanation}
                </p>
                {rule.formula && (
                  <div className="p-2.5 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto">
                    <code>{rule.formula}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Worked Examples */}
      {workedExamples && workedExamples.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
            <span>বাস্তব উদাহরণ ও সমাধান</span>
          </h3>

          <div className="space-y-3">
            {workedExamples.map((ex, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-2"
              >
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {ex.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="font-medium text-zinc-500">ইনপুট: </span>
                    <span className="font-semibold">{ex.input}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="font-medium text-zinc-500">ফলাফল: </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {ex.output}
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {ex.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tips and Common Mistakes */}
      {activeTips && activeTips.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>সতর্কতা ও সাধারণ ভুলসমূহ</span>
          </h3>

          <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
            {activeTips.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

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
            এখানে সাধারণ রেফারেন্স দেওয়া হয়েছে; নির্দিষ্ট কর-হার বা বিধানের ক্ষেত্রে সংশ্লিষ্ট অর্থ আইন ও সর্বশেষ সরকারি নির্দেশনা আলাদাভাবে যাচাই করুন।
          </p>
        </section>
      )}

      {/* Disclaimer if provided */}
      {disclaimer && (
        <div className="p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{disclaimer}</p>
        </div>
      )}

      {/* Related Tools */}
      {activeLinks && activeLinks.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            সম্পর্কিত অন্যান্য টুলস ও কনভার্টার
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeLinks.map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="p-3.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 transition group block"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  <span>{tool.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
