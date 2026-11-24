import type { Metadata } from "next";
import { Tv, Radio, Volume2, ShieldCheck, ExternalLink, AlertCircle } from "lucide-react";
import { PageContainer } from "@/components/layout";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "লাইভ টিভি ও রাষ্ট্রীয় সম্প্রচার হাব | তথ্যবক্স",
  description:
    "বাংলাদেশ টেলিভিশন (BTV), সংসদ বাংলাদেশ টেলিভিশন ও বাংলাদেশ বেতারের অফিশিয়াল তথ্য ও সম্প্রচার ডিরেক্টরি।",
  alternates: { canonical: "https://totthobox.com/live-tv" },
  robots: {
    index: false,
    follow: true,
  },
};

const CHANNELS = [
  {
    name: "বাংলাদেশ টেলিভিশন (বিটিভি)",
    englishName: "Bangladesh Television (BTV National)",
    description: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের জাতীয় টেলিভিশন সম্প্রচার সংস্থা। সংবাদ, শিক্ষা ও সংস্কৃতিমূলক অনুষ্ঠান।",
    category: "জাতীয়",
    officialUrl: "https://btv.gov.bd",
    streamEmbed: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCv_bV43k6pB2V5V_69iXF3g",
    icon: Tv,
    badge: "রাষ্ট্রীয়",
    status: "সক্রিয়",
  },
  {
    name: "সংসদ বাংলাদেশ টেলিভিশন",
    englishName: "Sangsad Bangladesh Television",
    description: "জাতীয় সংসদের অধিবেশন, সংসদীয় আলোচনা ও গণশিক্ষা কার্যক্রমের সরাসরি সম্প্রচার।",
    category: "সংসদীয়",
    officialUrl: "https://parliament.gov.bd",
    icon: Radio,
    badge: "সংসদ",
    status: "অফিশিয়াল",
  },
  {
    name: "বাংলাদেশ বেতার",
    englishName: "Bangladesh Betar",
    description: "বাংলাদেশের জাতীয় বেতার সম্প্রচার মাধ্যম। খবর, আবহাওয়া বার্তা, কৃষি ও স্বাস্থ্য বিষয়ক অনুষ্ঠান।",
    category: "বেতার",
    officialUrl: "https://betar.gov.bd",
    icon: Volume2,
    badge: "রেডিও",
    status: "সক্রিয়",
  },
];

export default function LiveTvPage() {
  return (
    <PageContainer className="py-6 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          <Tv className="w-3.5 h-3.5" />
          রাষ্ট্রীয় ও তথ্য সম্প্রচার ডিরেক্টরি
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-50">
          লাইভ টিভি ও রাষ্ট্রীয় তথ্য সম্প্রচার
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          বাংলাদেশ টেলিভিশন, সংসদ টিভি ও বাংলাদেশ বেতারের সরকারি সম্প্রচার সংক্রান্ত তথ্যাদি ও অফিশিয়াল লিংক।
        </p>
      </div>

      {/* Notice & Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p className="leading-relaxed">
          <strong>কপিরাইট ও সম্প্রচার নীতিমালা:</strong> তথ্যবক্স কোনো অননুমোদিত স্ট্রিমিং বা পাইরেটেড কনটেন্ট হোস্ট করে না। এখানে শুধুমাত্র রাষ্ট্রীয় টেলিভিশন ও বেতারের উন্মুক্ত পাবলিক ডোমেন তথ্য ও অফিশিয়াল ওয়েব পোর্টালের রেফারেন্স লিংক দেওয়া হয়েছে।
        </p>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {CHANNELS.map((ch, idx) => {
          const Icon = ch.icon;
          return (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                    <Icon className="size-6" />
                  </div>
                  <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {ch.badge}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {ch.name}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                    {ch.englishName}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {ch.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <a
                  href={ch.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  <span>অফিশিয়াল ওয়েবসাইট</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Compliance Assurance */}
      <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span>ডিজিটাল সেবা সুরক্ষা</span>
        </div>
        <p>
          তথ্যবক্স ডিজিটাল সিকিউরিটি আইন ও আন্তর্জাতিক মেধা-সম্পদ অধিকার (IPR) কঠোরভাবে মেনে চলে। কোনো কনটেন্ট নিয়ে আপত্তি থাকলে আমাদের{" "}
          <a href="/contact-us" className="text-indigo-600 dark:text-indigo-400 underline">
            যোগাযোগ পাতায়
          </a>{" "}
          তাৎক্ষণিক অবহিত করার অনুরোধ রইল।
        </p>
      </div>
    </PageContainer>
  );
}
