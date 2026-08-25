"use client";

import { AlarmCheck, LocateIcon, Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 p-4">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">যোগাযোগ করুন</h1>
        <p className="max-w-xl mx-auto text-balance">
          আপনার যেকোনো প্রশ্ন, মতামত বা সাহায্যের জন্য আমরা সবসময় প্রস্তুত।
          নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করুন।
        </p>
      </header>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-400/10 transition-all">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl text-xl bg-zinc-400/10">
              <Phone />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold">ফোন সাপোর্ট</h3>
                <p className="text-sm">সরাসরি কথা বলুন</p>
              </div>
              <a
                href="tel:+8801340792677"
                className="block w-full text-center py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-medium text-sm transition text-white"
              >
                +880 1340-792677
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-400/10 transition-all">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-zinc-400/10 text-xl">
              <MessageCircle />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold">WhatsApp চ্যাট</h3>
                <p className="text-sm">দ্রুত উত্তর পান</p>
              </div>
              <a
                href="https://wa.me/8801340792677"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition"
              >
                চ্যাট শুরু করুন
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="p-6 sm:p-8 rounded-xl bg-zinc-400/10">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">মেসেজ পাঠান</h2>
            <p className="text-sm">
              ফর্ম পূরণ করে সরাসরি আমাদের ইনবক্সে মেসেজ পাঠান
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="সম্পূর্ণ নাম লিখুন"
                  className="w-full px-4 py-2 rounded-lg outline-none bg-zinc-400/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  ইমেইল
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@email.com"
                  className="w-full px-4 py-2 rounded-lg outline-none bg-zinc-400/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">বিষয়</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="মেসেজের বিষয় লিখুন"
                className="w-full px-4 py-2 rounded-lg outline-none bg-zinc-400/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                আপনার মেসেজ
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="বিস্তারিত লিখুন..."
                className="w-full px-4 py-2 rounded-lg outline-none bg-zinc-400/10"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition flex items-center justify-center gap-2"
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
          <h2 className="text-xl font-bold">আমাদের সাথে যুক্ত থাকুন</h2>
          <p className="text-sm">সর্বশেষ আপডেট পেতে ফলো করুন</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              name: "Facebook",
              desc: "Totthobox পেজ ফলো করুন",
              href: "https://facebook.com/totthobox",
              icon: FaFacebook,
            },
            {
              name: "X (Twitter)",
              desc: "আপডেট ও খবর পান",
              href: "https://x.com/totthobox",
              icon: FaX,
            },
            {
              name: "Telegram",
              desc: "চ্যানেল জয়েন করুন",
              href: "https://t.me/totthobox",
              icon: FaTelegram,
            },
            {
              name: "Email",
              desc: "admin@totthobox.com",
              href: "mailto:admin@totthobox.com",
              icon: Mail,
            },
          ].map((item) => {
            const IconComponent = item.icon;

            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="p-4 rounded-xl bg-zinc-400/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-xl font-bold text-lg group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm truncate">{item.desc}</p>
                    </div>
                    <span className="bg-zinc-400/10 hover:bg-zinc-400/25 py-0 px-2 rounded">
                      ↗
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Office Address */}
      <div className="p-4 rounded-xl bg-zinc-400/10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-zinc-400/10">
              <LocateIcon />
            </div>
            <div>
              <h3 className="font-semibold">আমাদের ঠিকানা</h3>
              <p className="text-sm">মিরপুর ডিওএইচএস, এভিনিউ-৩, ঢাকা ১২১৬</p>
            </div>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium py-2 px-4 rounded-xl hover:bg-zinc-400/25 flex items-center gap-2 shrink-0"
          >
            ম্যাপে দেখুন ↗
          </a>
        </div>
      </div>

      <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

      {/* Bottom Badge */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 p-4 rounded-full bg-zinc-400/10">
          <span><AlarmCheck/></span>
          <span className="text-sm font-medium">২৪/৭ সাপোর্ট উপলব্ধ</span>
        </div>
      </div>
    </div>
  );
}