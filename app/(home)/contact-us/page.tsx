import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "যোগাযোগ করুন (Contact Us) | Totthobox",
  description:
    "Totthobox-এর সাথে যোগাযোগ করুন। আপনার যেকোনো জিজ্ঞাসা, মতামত, বিজ্ঞাপন বা সাপোর্টের জন্য আমাদের মেসেজ দিন।",
  keywords: [
    "যোগাযোগ",
    "কন্টাক্ট পেজ",
    "Totthobox contact",
    "সাপোর্ট সেন্টার",
    "মেসেজ দিন",
  ],
  openGraph: {
    title: "যোগাযোগ করুন | Totthobox",
    description: "Totthobox-এর সাথে যোগাযোগ করুন।",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">যোগাযোগ করুন</h1>
        <p className="max-w-xl mx-auto text-balance text-zinc-600 dark:text-zinc-400">
          আপনার যেকোনো প্রশ্ন, মতামত বা সাহায্যের জন্য আমরা সবসময় প্রস্তুত। নিচের যেকোনো
          মাধ্যমে আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border bg-white dark:bg-zinc-900 hover:shadow-lg transition-all">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              📞
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold">ফোন সাপোর্ট</h3>
                <p className="text-sm text-zinc-500">সরাসরি কথা বলুন</p>
              </div>
              <a
                href="tel:+8801340792677"
                className="block w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                +880 1340-792677
              </a>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border bg-white dark:bg-zinc-900 hover:shadow-lg transition-all">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              💬
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold">WhatsApp চ্যাট</h3>
                <p className="text-sm text-zinc-500">দ্রুত উত্তর পান</p>
              </div>
              <a
                href="https://wa.me/8801340792677"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                চ্যাট শুরু করুন
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form (static – add your own submit logic later) */}
      <div className="p-6 sm:p-8 rounded-xl border bg-white dark:bg-zinc-900">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">মেসেজ পাঠান</h2>
            <p className="text-zinc-500">
              ফর্ম পূরণ করে সরাসরি আমাদের ইনবক্সে মেসেজ পাঠান
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">আপনার নাম</label>
                <input
                  type="text"
                  placeholder="সম্পূর্ণ নাম লিখুন"
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ইমেইল</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">বিষয়</label>
              <input
                type="text"
                placeholder="মেসেজের বিষয় লিখুন"
                className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">আপনার মেসেজ</label>
              <textarea
                rows={5}
                placeholder="বিস্তারিত লিখুন..."
                className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                ✈ মেসেজ পাঠান
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Social Media */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">আমাদের সাথে যুক্ত থাকুন</h2>
          <p className="text-zinc-500">সর্বশেষ আপডেট পেতে ফলো করুন</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              name: "Facebook",
              desc: "Totthobox পেজ ফলো করুন",
              href: "https://facebook.com/totthobox",
              color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
            },
            {
              name: "X (Twitter)",
              desc: "আপডেট ও খবর পান",
              href: "https://x.com/totthobox",
              color: "bg-zinc-100 dark:bg-zinc-800",
            },
            {
              name: "Telegram",
              desc: "চ্যানেল জয়েন করুন",
              href: "https://t.me/totthobox",
              color: "text-sky-600 bg-sky-50 dark:bg-sky-950/40",
            },
            {
              name: "Email",
              desc: "admin@totthobox.com",
              href: "mailto:admin@totthobox.com",
              color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
            },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="p-5 rounded-xl border bg-white dark:bg-zinc-900 transition-all hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${item.color} group-hover:scale-105 transition-transform`}>
                    {item.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-zinc-500 truncate">{item.desc}</p>
                  </div>
                  <span className="text-zinc-400 group-hover:text-indigo-500">↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Office Address */}
      <div className="p-5 rounded-xl border bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-orange-600">
              📍
            </div>
            <div>
              <h3 className="font-semibold">আমাদের ঠিকানা</h3>
              <p className="text-sm text-zinc-500">
                মিরপুর ডিওএইচএস, এভিনিউ-৩, ঢাকা ১২১৬
              </p>
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=মিরপুর+ডিওএইচএস+এভিনিউ-৩+ঢাকা"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
          >
            ম্যাপে দেখুন ↗
          </a>
        </div>
      </div>

      <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

      {/* Bottom Badge */}
      <div className="flex justify-center pt-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
          <span className="text-zinc-500">⏰</span>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            ২৪/৭ সাপোর্ট উপলব্ধ
          </span>
        </div>
      </div>
    </div>
  );
}