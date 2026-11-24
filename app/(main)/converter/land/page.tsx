import type { Metadata } from "next";
import LandAreaConverter from "@/components/converter/LandAreaConverter";
import ToolGuide from "@/components/ToolGuide";
import { landConverterGuide } from "@/lib/content/converters/land";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/land" },
  title: "শতাংশ থেকে কাঠা ও বিঘা হিসাব ক্যালকুলেটর",
  description:
    "৪ শতাংশ কত কাঠা বা ২০ শতাংশ কত কাঠা? ১ শতাংশ = ০.৬০৫ কাঠা ও ১ বিঘা = ২০ কাঠা হিসেবে শতাংশ থেকে কাঠা ও কাঠা থেকে শতাংশ রূপান্তরের পূর্ণাঙ্গ চার্ট ও হিসাব দেখুন।",
  openGraph: {
    title: "শতাংশ থেকে কাঠা ও বিঘা হিসাব ক্যালকুলেটর | Totthobox",
    description:
      "৪ শতাংশ কত কাঠা বা ২০ শতাংশ কত কাঠা? ১ শতাংশ = ০.৬০৫ কাঠা ও ১ বিঘা = ২০ কাঠা হিসেবে শতাংশ থেকে কাঠা ও কাঠা থেকে শতাংশ রূপান্তরের পূর্ণাঙ্গ চার্ট ও হিসাব দেখুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/land",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "শতাংশ থেকে কাঠা ও বিঘা হিসাব ক্যালকুলেটর | Totthobox",
    description:
      "৪ শতাংশ কত কাঠা বা ২০ শতাংশ কত কাঠা? ১ শতাংশ = ০.৬০৫ কাঠা ও ১ বিঘা = ২০ কাঠা হিসেবে শতাংশ থেকে কাঠা ও কাঠা থেকে শতাংশ রূপান্তরের পূর্ণাঙ্গ চার্ট ও হিসাব দেখুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

const toBn = (n: number | string): string =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d, 10)]);

// Repo defined constants
const SHOTANGSHO_SQFT = 435.6;
const KATHA_SQFT = 720;
const BIGHA_SQFT = 14400;

const commonShotangshoList = [1, 2, 3, 4, 5, 10, 15, 20, 33, 50, 100];
const kathaCommonList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50];
const bighaCommonList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 50, 100];

export default function LandAreaConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <LandAreaConverter />
      </div>

      {/* সরাসরি সমাধান ও সাধারণ মানসমূহের বিশ্লেষণ (Quick Answers & Worked Solutions) */}
      <section
        aria-labelledby="quick-answers-heading"
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 space-y-6"
      >
        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2
            id="quick-answers-heading"
            className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            শতাংশ থেকে কাঠা: সাধারণ প্রশ্নের সরাসরি সমাধান
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            সরকারি প্রমিত মানদণ্ড অনুযায়ী ১ শতাংশ সমান ৪৩৫.৬০ বর্গফুট এবং ১ কাঠা সমান ৭২০ বর্গফুট। সে হিসেবে ১ শতাংশ = ০.৬০৫ কাঠা (৪৩৫.৬ ÷ ৭২০)। সর্বাধিক অনুসন্ধানকৃত পরিমাণগুলোর নির্ভুল হিসাব নিচে দেওয়া হলো:
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {commonShotangshoList.map((val) => {
            const sqft = parseFloat((val * SHOTANGSHO_SQFT).toFixed(2));
            const katha = parseFloat(((val * SHOTANGSHO_SQFT) / KATHA_SQFT).toFixed(3));
            return (
              <article
                key={val}
                id={`shotangsho-${val}`}
                className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 space-y-2 scroll-mt-20"
              >
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {toBn(val)} শতাংশ কত কাঠা?
                </h2>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {toBn(val)} শতাংশ সমান {toBn(katha)} কাঠা
                  </strong>{" "}
                  (বা {toBn(sqft)} বর্গফুট)।
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  হিসাব সূত্র: {toBn(val)} × ৪৩৫.৬০ বর্গফুট = {toBn(sqft)} বর্গফুট ÷ ৭২০ = {toBn(katha)} কাঠা।
                </p>
              </article>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>আঞ্চলিক সতর্কবার্তা:</strong> বাংলাদেশের কিছু অঞ্চলে (যেমন রাজশাহী বা বৃহত্তর কুমিল্লায়) স্থানীয় প্রথায় কাঠার মাপে ভিন্নতা পরিলক্ষিত হতে পারে। তবে সরকারি রেকর্ড, আরএস ও বিএস খতিয়ান এবং ভূমি রেজিস্ট্রি দলিলে প্রমিত হিসেবে ১ কাঠা = ৭২০ বর্গফুট এবং ১ শতাংশ = ৪৩৫.৬০ বর্গফুট (০.৬০৫ কাঠা) প্রযোজ্য।
        </div>
      </section>

      {/* শতাংশ থেকে কাঠা রূপান্তর চার্ট (১-১০০ শতাংশ) */}
      <section
        aria-labelledby="shotangsho-table-heading"
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h2
              id="shotangsho-table-heading"
              className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100"
            >
              শতাংশ থেকে কাঠা দ্রুত হিসাব তালিকা (১ থেকে ১০০ শতাংশ)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              অনুপাত: ১ শতাংশ = ৪৩৫.৬০ বর্গফুট = ০.৬০৫ কাঠা
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-zinc-600 dark:text-zinc-400 self-start sm:self-auto">
            1 shotangsho = 0.605 katha
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 sticky top-0 z-10 text-xs font-semibold">
              <tr>
                <th className="p-3">শতাংশ (Shotangsho)</th>
                <th className="p-3">বর্গফুট (Sq Ft)</th>
                <th className="p-3">কাঠা (Katha)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {Array.from({ length: 100 }, (_, i) => i + 1).map((val) => {
                const sqft = parseFloat((val * SHOTANGSHO_SQFT).toFixed(2));
                const katha = parseFloat(((val * SHOTANGSHO_SQFT) / KATHA_SQFT).toFixed(3));
                return (
                  <tr
                    key={val}
                    id={`shotangsho-${val}`}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {toBn(val)} শতাংশ
                    </td>
                    <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">
                      {toBn(sqft)}
                    </td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {toBn(katha)} কাঠা
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* কাঠা থেকে শতাংশ এবং বিঘা থেকে কাঠা মিনি টেবিল */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* কাঠা থেকে শতাংশ */}
        <section
          aria-labelledby="katha-table-heading"
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4"
        >
          <div>
            <h2
              id="katha-table-heading"
              className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100"
            >
              কাঠা থেকে শতাংশ মিনি চার্ট
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              ১ কাঠা = ৭২০ বর্গফুট ≈ ১.৬৫৩ শতাংশ
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 sticky top-0 z-10">
                <tr>
                  <th className="p-2.5">কাঠা (Katha)</th>
                  <th className="p-2.5">বর্গফুট</th>
                  <th className="p-2.5">শতাংশ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {kathaCommonList.map((k) => {
                  const sqft = k * KATHA_SQFT;
                  const shotangsho = parseFloat((sqft / SHOTANGSHO_SQFT).toFixed(3));
                  return (
                    <tr
                      key={k}
                      id={`katha-${k}`}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="p-2.5 font-medium">{toBn(k)} কাঠা</td>
                      <td className="p-2.5 font-mono text-zinc-500">{toBn(sqft)}</td>
                      <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {toBn(shotangsho)} শতাংশ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* বিঘা থেকে কাঠা */}
        <section
          aria-labelledby="bigha-table-heading"
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4"
        >
          <div>
            <h2
              id="bigha-table-heading"
              className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100"
            >
              বিঘা থেকে কাঠা ও শতাংশ মিনি চার্ট
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              ১ বিঘা = ২০ কাঠা = ১৪,৪০০ বর্গফুট ≈ ৩৩.০৫৮ শতাংশ
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 sticky top-0 z-10">
                <tr>
                  <th className="p-2.5">বিঘা (Bigha)</th>
                  <th className="p-2.5">কাঠা (Katha)</th>
                  <th className="p-2.5">শতাংশ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {bighaCommonList.map((b) => {
                  const katha = b * 20;
                  const shotangsho = parseFloat(((b * BIGHA_SQFT) / SHOTANGSHO_SQFT).toFixed(3));
                  return (
                    <tr
                      key={b}
                      id={`bigha-${b}`}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="p-2.5 font-medium">{toBn(b)} বিঘা</td>
                      <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {toBn(katha)} কাঠা
                      </td>
                      <td className="p-2.5 font-mono text-zinc-500">
                        {toBn(shotangsho)} শতাংশ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ToolGuide guide={landConverterGuide} />
    </div>
  );
}
