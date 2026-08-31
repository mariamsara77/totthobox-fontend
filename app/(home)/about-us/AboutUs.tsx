"use client";

import Link from "next/link";

export default function AboutUs() {
  // Static placeholder stats (later replace with real API data)
  const analytics = {
    total: "110k+",
    today: "12.5k+",
    online: "11.2k+",
    pwa: "15k+",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 p-4">
      {/* Hero */}
      <header className="text-center space-y-4 pt-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Totthobox-এ আপনাকে স্বাগতম
        </h1>
        <p className="max-w-2xl mx-auto text-balance">
          আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা এক জায়গায় —
          নির্ভরযোগ্য ও সহজভাবে। ইতোমধ্যে{" "}
          <span className="font-semibold">{analytics.total}</span> জন ব্যবহার
          করেছেন।
        </p>
        <div className="pt-2">
          <div className="h-px border-b" />
        </div>
      </header>

      {/* Stats Dashboard */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">প্ল্যাটফর্ম স্ট্যাটিস্টিক্স</h2>
          <p className="text-sm">লাইভ ইউজার ড্যাশবোর্ড</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl border transition-all">
            <div className="mx-auto mb-2 text-xl">👥</div>
            <p className="text-sm">মোট ব্যবহারকারী</p>
            <p className="text-lg font-bold mt-1">{analytics.total}</p>
          </div>

          <div className="text-center p-4 rounded-xl border transition-all">
            <div className="mx-auto mb-2 text-xl">📅</div>
            <p className="text-sm">আজকের ভিজিটর</p>
            <p className="text-lg font-bold mt-1">{analytics.today}</p>
          </div>

          <div className="text-center p-4 rounded-xl border transition-all relative">
            <div className="absolute top-3 right-3 flex">
              <span className="size-2 rounded-full animate-ping absolute" />
              <span className="size-2 rounded-full relative" />
            </div>
            <div className="mx-auto mb-2 text-xl">📶</div>
            <p className="text-sm">এই মুহূর্তে লাইভ</p>
            <p className="text-lg font-bold mt-1">{analytics.online}</p>
          </div>

          <div className="text-center p-4 rounded-xl border transition-all">
            <div className="mx-auto mb-2 text-xl">📱</div>
            <p className="text-sm">অ্যাপ ইউজার (PWA)</p>
            <p className="text-lg font-bold mt-1">{analytics.pwa}</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl border text-xl">🚀</div>
            <h2 className="text-lg font-bold">আমাদের লক্ষ্য</h2>
          </div>
          <p className="leading-relaxed text-sm">
            দৈনন্দিন জীবনের প্রয়োজনীয় সব ডিজিটাল টুলস, নির্ভরযোগ্য তথ্য এবং
            শিক্ষামূলক কনটেন্ট সহজে ও বিনামূল্যে সবার হাতের মুঠোয় পৌঁছে দেওয়া।
            আমরা চাই প্রযুক্তি ব্যবহার করে প্রতিটি মানুষের জীবনকে আরও সহজ করতে।
          </p>
        </div>

        <div className="p-6 rounded-xl border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl border text-xl">👁️</div>
            <h2 className="text-lg font-bold">আমাদের ভিশন</h2>
          </div>
          <p className="leading-relaxed text-sm">
            বাংলাদেশের সবচেয়ে নির্ভরযোগ্য এবং স্বয়ংসম্পূর্ণ ডিজিটাল
            প্ল্যাটফর্ম হিসেবে নিজেদের প্রতিষ্ঠিত করা — যেখানে শিশু থেকে বৃদ্ধ,
            সবার দৈনন্দিন জিজ্ঞাসার সমাধান এবং প্রয়োজনীয় ডিজিটাল টুলস থাকবে।
          </p>
        </div>
      </section>

      {/* Why Totthobox */}
      <section className="space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">কেন Totthobox?</h2>
          <p className="text-sm">আমরা যা অফার করি</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "⚡",
              title: "দ্রুত ও সহজ",
              desc: "জটিল কিছু নেই। প্রয়োজনীয় তথ্য ও টুলস কয়েক সেকেন্ডেই পাবেন।",
            },
            {
              icon: "🛡️",
              title: "নির্ভরযোগ্য তথ্য",
              desc: "যাচাইকৃত উৎস থেকে তথ্য সংগ্রহ করে উপস্থাপন করা হয়।",
            },
            {
              icon: "📱",
              title: "মোবাইল ফ্রেন্ডলি + PWA",
              desc: "যেকোনো ডিভাইসে চমৎকার অভিজ্ঞতা। হোম স্ক্রিনে অ্যাপ হিসেবেও ব্যবহার করা যায়।",
            },
            {
              icon: "❤️",
              title: "সম্পূর্ণ বিনামূল্যে",
              desc: "আমাদের মূল সেবাগুলো সবার জন্য উন্মুক্ত এবং বিনামূল্যে ব্যবহারযোগ্য।",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-xl border transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg text-lg border">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services placeholder */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">আমাদের সেবাসমূহ</h2>
          <p className="text-sm">এক নজরে Totthobox-এর মূল ফিচারগুলো</p>
        </div>
        <div className="p-8 text-center border border-dashed rounded-xl">
          Services Grid will be here
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="p-8 text-center space-y-4 rounded-xl border">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">আমাদের সাথে যুক্ত হোন</h3>
          <p className="text-sm max-w-md mx-auto">
            যেকোনো মতামত, জিজ্ঞাসা বা সহযোগিতার জন্য আমাদের সাপোর্ট টিমের সাথে
            যোগাযোগ করুন।
          </p>
        </div>
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition-colors"
        >
          যোগাযোগ করুন
        </Link>
      </div>
    </div>
  );
}
