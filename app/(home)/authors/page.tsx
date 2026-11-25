import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  Mail,
  UserCheck,
  Scale,
  Cpu,
  FileCheck2,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { EDITORIAL_PROFILES } from "@/config/editorial";
import BreadcrumbStructuredData from "@/components/seo/BreadcrumbStructuredData";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "সম্পাদকীয় দল ও লেখক পরিচিতি (Editorial Board & Authors) | তথ্যবক্স",
  description:
    "তথ্যবক্সের (Totthobox) বিশেষজ্ঞ সম্পাদকীয় দল, গবেষক, কর উপদেষ্টা ও ধর্মীয় পর্যালোচকদের পরিচিতি। জানুন আমাদের তথ্য যাচাই ও নির্ভুলতা রক্ষার টিম সম্পর্কে।",
  alternates: { canonical: "https://totthobox.com/authors" },
  openGraph: {
    title: "সম্পাদকীয় দল ও লেখক পরিচিতি | তথ্যবক্স",
    description:
      "তথ্যবক্সের বিশেষজ্ঞ সম্পাদকীয় দল, গবেষক ও পর্যালোচকদের পরিচিতি। প্রামাণ্য তথ্যের জন্য আমাদের টিম।",
    url: "https://totthobox.com/authors",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox Editorial Team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "সম্পাদকীয় দল ও লেখক পরিচিতি | তথ্যবক্স",
    description: "তথ্যবক্সের বিশেষজ্ঞ সম্পাদকীয় দল, গবেষক ও পর্যালোচকদের পরিচিতি।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

const teamList = [
  {
    key: "general",
    ...EDITORIAL_PROFILES.general,
    icon: UserCheck,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    key: "tax",
    ...EDITORIAL_PROFILES.tax,
    icon: Scale,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "islamic",
    ...EDITORIAL_PROFILES.islamic,
    icon: BookOpen,
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    key: "history",
    ...EDITORIAL_PROFILES.history,
    icon: Award,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    key: "engineering",
    ...EDITORIAL_PROFILES.engineering,
    icon: Cpu,
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
];

export default function AuthorsPage() {
  return (
    <PageContainer className="py-6 sm:py-10 space-y-10">
      <BreadcrumbStructuredData
        items={[
          { name: "হোম", item: "https://totthobox.com" },
          { name: "সম্পাদকীয় দল", item: "https://totthobox.com/authors" },
        ]}
      />

      {/* Header */}
      <header className="space-y-3 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <p className="text-xs font-medium text-[var(--accent-ink)]">
          সম্পাদকীয় স্বচ্ছতা ও মানদণ্ড
        </p>
        <h1 className="text-2xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          আমাদের সম্পাদকীয় দল ও গবেষকবৃন্দ
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          তথ্যবক্সের প্রতিটি গাইড, ক্যালকুলেটর অ্যালগরিদম ও তথ্যভিত্তিক নিবন্ধ সংশ্লিষ্ট বিষয়ের অভিজ্ঞ গবেষক ও বিশেষজ্ঞদের দ্বারা রচিত, পর্যালোচিত এবং যাচাইকৃত।
        </p>
      </header>

      {/* Team Profiles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" aria-label="টিম প্রোফাইল তালিকা">
        {teamList.map((member) => {
          const Icon = member.icon;
          return (
            <article
              key={member.key}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3.5">
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${member.color}`}>
                    <Icon className="size-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {member.name}
                    </h2>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {member.role}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {member.title}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {member.bio}
                </p>

                {/* Expertise Badges */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    দক্ষতার ক্ষেত্র
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.expertise.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  যাচাইকৃত লেখক প্রোফাইল
                </span>
                <Link
                  href="/contact-us"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  যোগাযোগ করুন →
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {/* Editorial Standards & Fact Checking Flow */}
      <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>আমাদের ফ্যাক্ট-চেকিং ও কন্টেন্ট স্ট্যান্ডার্ড</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            কীভাবে তথ্যবক্স তথ্যের শতভাগ সঠিকতা নিশ্চিত করে?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-indigo-600 text-white text-2xs">১</span>
              প্রাথমিক উৎস যাচাই
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              কোনো তথ্য গ্রহণ করার আগে বাংলাদেশ গেজেট, এনবিআর সার্কুলার, ইসলামিক ফাউন্ডেশন বা প্রাতিষ্ঠানিক রেফারেন্স বই থেকে উৎস যাচাই করা হয়।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-indigo-600 text-white text-2xs">২</span>
              দ্বৈত সম্পাদকীয় স্ক্রিনিং
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              বিশেষত আয়কর ও ধর্মীয় বিষয়ে কোনো কনটেন্ট এককভাবে প্রকাশিত হয় না; সংশ্লিষ্ট বিষয়ের গবেষক ও টেকনিক্যাল টিম উভয়ই ক্রস-চেক করেন।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-indigo-600 text-white text-2xs">৩</span>
              নিয়মিত সংশোধন ও হালনাগাদ
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              সরকারি নীতি বা ক্যালেন্ডার বদলের সাথে সাথে পেজের &quot;শেষ হালনাগাদ&quot; তারিখসহ কন্টেন্ট রিয়েল-টাইম রিভ্যালিডেট করা হয়।
            </p>
          </div>
        </div>
      </section>

      {/* Contact Editorial Board */}
      <div className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            সম্পাদকীয় দলের সাথে যোগাযোগ করতে চান?
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            তথ্যের ভুল সংশোধন, মতামত বা কনটেন্ট অবজেকশন সরাসরি জানান আমাদের সম্পাদকীয় ডেস্কে।
          </p>
        </div>
        <Link
          href="/contact-us"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shrink-0"
        >
          <Mail className="size-4" />
          <span>মেসেজ পাঠান</span>
        </Link>
      </div>
    </PageContainer>
  );
}
