import type { Metadata } from "next";
import NumberToWordConverter from "./NumberToWordConverter";
import ToolGuide from "@/components/ToolGuide";
import { numberToWordConverterGuide } from "@/lib/content/converters/number-to-word";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/number-to-word" },
  title: "অংক থেকে কথায় বাংলা - সংখ্যা থেকে কথায় রূপান্তর",
  description:
    "অংক থেকে কথায় বাংলা রূপান্তর করুন সহজে। ব্যাংক চেক, দলিল ও ভাউচারের জন্য সংখ্যা থেকে কথায় টাকা লেখার সঠিক ফরম্যাট ও বাস্তব উদাহরণ জানুন তথ্যবক্সে।",
  openGraph: {
    title: "অংক থেকে কথায় বাংলা - সংখ্যা থেকে কথায় রূপান্তর | Totthobox",
    description:
      "অংক থেকে কথায় বাংলা রূপান্তর করুন সহজে। ব্যাংক চেক, দলিল ও ভাউচারের জন্য সংখ্যা থেকে কথায় টাকা লেখার সঠিক ফরম্যাট ও বাস্তব উদাহরণ জানুন তথ্যবক্সে।",
    type: "website",
    url: "https://totthobox.com/converter/number-to-word",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অংক থেকে কথায় বাংলা - সংখ্যা থেকে কথায় রূপান্তর | Totthobox",
    description:
      "অংক থেকে কথায় বাংলা রূপান্তর করুন সহজে। ব্যাংক চেক, দলিল ও ভাউচারের জন্য সংখ্যা থেকে কথায় টাকা লেখার সঠিক ফরম্যাট।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <NumberToWordConverter />

      {/* অংক থেকে কথায় সরাসরি নির্দেশিকা ও ব্যাংক চেক স্টাইল উদাহরণ */}
      <section
        aria-labelledby="number-to-word-guide-heading"
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 space-y-6"
      >
        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2
            id="number-to-word-guide-heading"
            className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            অংক থেকে কথায় বাংলা: লেখার নিয়ম ও চেক স্টাইল উদাহরণ
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            যেকোনো আর্থিক দলিল, ব্যাংক চেক বা ভাউচারে <strong>সংখ্যা থেকে কথায় রূপান্তর</strong> করার সময় ভারতীয়/বাংলাদেশি গণনা পদ্ধতি (শতক, হাজার, লক্ষ, কোটি) অনুসরণ করা হয়। চেক জালিয়াতি রোধে লেখার শেষে &quot;টাকা মাত্র&quot; (Only) যুক্ত করা অপরিহার্য। নিচে বহুল ব্যবহৃত ৩টি যাচাইকৃত চেক-স্টাইল উদাহরণ দেওয়া হলো:
          </p>
        </div>

        <div className="space-y-4">
          {/* উদাহরণ ১ */}
          <article className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                উদাহরণ ১: ২৫,৫০০ (25,500)
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono">
                ব্যাংক চেক ফরম্যাট
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <strong className="text-zinc-900 dark:text-zinc-100">
                অংক থেকে কথায়: পঁচিশ হাজার পাঁচ শত টাকা মাত্র।
              </strong>
            </p>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              English Cheque Style: Twenty-Five Thousand Five Hundred Taka Only.
            </p>
          </article>

          {/* উদাহরণ ২ */}
          <article className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                উদাহরণ ২: ১,৫০,০০০ (1,50,000)
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono">
                ব্যাংক চেক ফরম্যাট
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <strong className="text-zinc-900 dark:text-zinc-100">
                অংক থেকে কথায়: এক লক্ষ পঞ্চাশ হাজার টাকা মাত্র।
              </strong>
            </p>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              English Cheque Style: One Lakh Fifty Thousand Taka Only.
            </p>
          </article>

          {/* উদাহরণ ৩ */}
          <article className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                উদাহরণ ৩: ৫,৭৫,৩৫০ (5,75,350)
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono">
                ব্যাংক চেক ফরম্যাট
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <strong className="text-zinc-900 dark:text-zinc-100">
                অংক থেকে কথায়: পাঁচ লক্ষ পঁচাত্তর হাজার তিন শত পঞ্চাশ টাকা মাত্র।
              </strong>
            </p>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              English Cheque Style: Five Lakh Seventy-Five Thousand Three Hundred Fifty Taka Only.
            </p>
          </article>
        </div>
      </section>

      <ToolGuide guide={numberToWordConverterGuide} />
    </div>
  );
}
