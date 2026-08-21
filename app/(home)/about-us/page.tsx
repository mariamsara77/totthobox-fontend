import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে (About Us) | Totthobox",
  description:
    "Totthobox (তথ্যবক্স) - আপনার প্রয়োজনীয় সকল তথ্য ও ডিজিটাল সেবা এক জায়গায়। আমাদের লক্ষ্য, ভিশন এবং সেবাসমূহ সম্পর্কে বিস্তারিত জানুন।",
  keywords: [
    "about us",
    "আমাদের সম্পর্কে",
    "Totthobox about",
    "তথ্যবক্স",
    "ডিজিটাল সেবা",
    "বিশ্বকোষ",
  ],
  openGraph: {
    title: "আমাদের সম্পর্কে | Totthobox",
    description:
      "Totthobox (তথ্যবক্স) - আপনার প্রয়োজনীয় সকল তথ্য ও ডিজিটাল সেবা এক জায়গায়।",
    type: "website",
  },
};

export default function AboutPage() {
  // Static placeholder stats (later replace with real API data)
  const analytics = {
    total: "110k+",
    today: "12.5k+",
    online: "11.2k+",
    pwa: "15k+",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-6">
      {/* Hero */}
      <header className="text-center space-y-4 pt-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Totthobox-এ আপনাকে স্বাগতম
        </h1>
        <p className="max-w-2xl mx-auto text-balance text-zinc-600 dark:text-zinc-400">
          আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা এক জায়গায় — নির্ভরযোগ্য ও
          সহজভাবে। ইতোমধ্যে{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {analytics.total}
          </span>{" "}
          জন ব্যবহার করেছেন।
        </p>
        <div className="pt-2">
          <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </header>

      {/* Stats Dashboard */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">প্ল্যাটফর্ম স্ট্যাটিস্টিক্স</h2>
          <p className="text-sm text-zinc-500">লাইভ ইউজার ড্যাশবোর্ড</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl border bg-white dark:bg-zinc-900 hover:shadow-md transition-all">
            <div className="mx-auto mb-2 size-6 text-indigo-500">👥</div>
            <p className="text-sm text-zinc-500">মোট ব্যবহারকারী</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {analytics.total}
            </p>
          </div>

          <div className="text-center p-4 rounded-xl border bg-white dark:bg-zinc-900 hover:shadow-md transition-all">
            <div className="mx-auto mb-2 size-6 text-emerald-500">📅</div>
            <p className="text-sm text-zinc-500">আজকের ভিজিটর</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {analytics.today}
            </p>
          </div>

          <div className="text-center p-4 rounded-xl border bg-white dark:bg-zinc-900 hover:shadow-md transition-all relative">
            <div className="absolute top-3 right-3 flex">
              <span className="size-2 bg-rose-500 rounded-full animate-ping absolute" />
              <span className="size-2 bg-rose-500 rounded-full relative" />
            </div>
            <div className="mx-auto mb-2 size-6 text-rose-500">📶</div>
            <p className="text-sm text-zinc-500">এই মুহূর্তে লাইভ</p>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
              {analytics.online}
            </p>
          </div>

          <div className="text-center p-4 rounded-xl border bg-white dark:bg-zinc-900 hover:shadow-md transition-all">
            <div className="mx-auto mb-2 size-6 text-blue-500">📱</div>
            <p className="text-sm text-zinc-500">অ্যাপ ইউজার (PWA)</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
              {analytics.pwa}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
              🚀
            </div>
            <h2 className="text-lg font-semibold">আমাদের লক্ষ্য</h2>
          </div>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            দৈনন্দিন জীবনের প্রয়োজনীয় সব ডিজিটাল টুলস, নির্ভরযোগ্য তথ্য এবং শিক্ষামূলক
            কনটেন্ট সহজে ও বিনামূল্যে সবার হাতের মুঠোয় পৌঁছে দেওয়া। আমরা চাই প্রযুক্তি
            ব্যবহার করে প্রতিটি মানুষের জীবনকে আরও সহজ করতে।
          </p>
        </div>

        <div className="p-6 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
              👁️
            </div>
            <h2 className="text-lg font-semibold">আমাদের ভিশন</h2>
          </div>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            বাংলাদেশের সবচেয়ে নির্ভরযোগ্য এবং স্বয়ংসম্পূর্ণ ডিজিটাল প্ল্যাটফর্ম হিসেবে
            নিজেদের প্রতিষ্ঠিত করা — যেখানে শিশু থেকে বৃদ্ধ, সবার দৈনন্দিন জিজ্ঞাসার
            সমাধান এবং প্রয়োজনীয় ডিজিটাল টুলস থাকবে।
          </p>
        </div>
      </section>

      {/* Why Totthobox */}
      <section className="space-y-5">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">কেন Totthobox?</h2>
          <p className="text-zinc-500">আমরা যা অফার করি</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "⚡",
              title: "দ্রুত ও সহজ",
              desc: "জটিল কিছু নেই। প্রয়োজনীয় তথ্য ও টুলস কয়েক সেকেন্ডেই পাবেন।",
              color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600",
            },
            {
              icon: "🛡️",
              title: "নির্ভরযোগ্য তথ্য",
              desc: "যাচাইকৃত উৎস থেকে তথ্য সংগ্রহ করে উপস্থাপন করা হয়।",
              color: "bg-zinc-100 dark:bg-zinc-800 text-emerald-600",
            },
            {
              icon: "📱",
              title: "মোবাইল ফ্রেন্ডলি + PWA",
              desc: "যেকোনো ডিভাইসে চমৎকার অভিজ্ঞতা। হোম স্ক্রিনে অ্যাপ হিসেবেও ব্যবহার করা যায়।",
              color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600",
            },
            {
              icon: "❤️",
              title: "সম্পূর্ণ বিনামূল্যে",
              desc: "আমাদের মূল সেবাগুলো সবার জন্য উন্মুক্ত এবং বিনামূল্যে ব্যবহারযোগ্য।",
              color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600",
            },
          ].map((item) => (
            <div key={item.title} className="p-5 rounded-xl border bg-white dark:bg-zinc-900">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${item.color}`}>{item.icon}</div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services placeholder */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">আমাদের সেবাসমূহ</h2>
          <p className="text-zinc-500">এক নজরে Totthobox-এর মূল ফিচারগুলো</p>
        </div>
        {/* You can later put your <ServicesGrid /> component here */}
        <div className="p-8 text-center text-zinc-400 border rounded-xl">
          Services Grid will be here
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="p-8 text-center space-y-6 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">আমাদের সাথে যুক্ত হোন</h3>
          <p className="text-zinc-500 max-w-md mx-auto">
            যেকোনো মতামত, জিজ্ঞাসা বা সহযোগিতার জন্য আমাদের সাপোর্ট টিমের সাথে যোগাযোগ
            করুন।
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          যোগাযোগ করুন
        </Link>
      </div>
    </div>
  );
}