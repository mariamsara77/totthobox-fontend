"use client";

import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  priority: "normal" | "urgent";
  category: string;
};

export default function ContactClient() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    priority: "normal",
    category: "general",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setErrors({});

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Laravel validation errors
        if (res.status === 422 && data.errors) {
          setErrors(data.errors);
          setStatus("error");
          setErrorMessage("দয়া করে ফর্মের ত্রুটিগুলো ঠিক করুন।");
          return;
        }

        throw new Error(data.message || "মেসেজ পাঠাতে সমস্যা হয়েছে");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        priority: "normal",
        category: "general",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(
        err.message || "মেসেজ পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 px-4 py-8">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          যোগাযোগ করুন
        </h1>
        <p className="max-w-xl mx-auto text-zinc-600 dark:text-zinc-400 text-balance">
          আপনার যেকোনো প্রশ্ন, মতামত বা সাহায্যের জন্য আমরা সবসময় প্রস্তুত।
          নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করুন।
        </p>
      </header>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-400/10 border border-zinc-400/25 transition-all hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Phone className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold">ফোন সাপোর্ট</h3>
                <p className="text-sm text-zinc-500">সরাসরি কথা বলুন</p>
              </div>
              <a
                href="tel:+8801340792677"
                className="block w-full text-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-medium text-sm text-white transition"
              >
                +880 1340-792677
              </a>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-400/10 border border-zinc-400/25 transition-all hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <MessageCircle className="w-6 h-6" />
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
                className="block w-full text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition"
              >
                চ্যাট শুরু করুন
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-400/10 border border-zinc-400/25">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">মেসেজ পাঠান</h2>
            <p className="text-sm text-zinc-500">
              ফর্ম পূরণ করে সরাসরি আমাদের ইনবক্সে মেসেজ পাঠান
            </p>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                  মেসেজ সফলভাবে পাঠানো হয়েছে!
                </h3>
                <p className="text-sm text-zinc-500 mt-2">
                  আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
                </p>
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
              >
                আরেকটি মেসেজ পাঠান
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    আপনার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="সম্পূর্ণ নাম লিখুন"
                    className={`w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 ${
                      errors.name
                        ? "border-red-500"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    ইমেইল <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={`w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 ${
                      errors.email
                        ? "border-red-500"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    ফোন নম্বর
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    বিষয়ের ধরন
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
                  >
                    <option value="general">সাধারণ জিজ্ঞাসা</option>
                    <option value="support">সাপোর্ট / সমস্যা</option>
                    <option value="advertisement">বিজ্ঞাপন</option>
                    <option value="feedback">মতামত / সাজেশন</option>
                    <option value="partnership">পার্টনারশিপ</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              {/* Subject + Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    বিষয়
                  </label>
                  <input
                    type="text"
                    name="subject"
                    maxLength={150}
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="মেসেজের বিষয় লিখুন"
                    className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    অগ্রাধিকার
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
                  >
                    <option value="normal">সাধারণ</option>
                    <option value="urgent">জরুরি (Urgent)</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  আপনার মেসেজ <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  minLength={10}
                  maxLength={2000}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="বিস্তারিত লিখুন..."
                  className={`w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 resize-none ${
                    errors.message
                      ? "border-red-500"
                      : "border-zinc-200 dark:border-zinc-700"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.message[0]}
                  </p>
                )}
              </div>

              {/* Global Error */}
              {status === "error" && errorMessage && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium text-sm transition flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      মেসেজ পাঠান
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Social Media */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">আমাদের সাথে যুক্ত থাকুন</h2>
          <p className="text-sm text-zinc-500">সর্বশেষ আপডেট পেতে ফলো করুন</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              name: "Facebook",
              desc: "Totthobox পেজ ফলো করুন",
              href: "https://facebook.com/totthobox",
              icon: FaFacebook,
              color: "text-blue-600",
            },
            {
              name: "X (Twitter)",
              desc: "আপডেট ও খবর পান",
              href: "https://x.com/totthobox",
              icon: FaXTwitter,
              color: "text-zinc-900 dark:text-white",
            },
            {
              name: "Telegram",
              desc: "চ্যানেল জয়েন করুন",
              href: "https://t.me/totthobox",
              icon: FaTelegram,
              color: "text-sky-500",
            },
            {
              name: "Email",
              desc: "admin@totthobox.com",
              href: "mailto:admin@totthobox.com",
              icon: Mail,
              color: "text-rose-500",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="p-5 rounded-2xl bg-zinc-400/10 border border-zinc-400/25 transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3.5 rounded-xl bg-zinc-200/50 dark:bg-zinc-800 ${item.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-zinc-500 truncate">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
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
      <div className="p-5 rounded-2xl bg-zinc-400/10 border border-zinc-400/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600">
              <MapPin className="w-6 h-6" />
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
            className="text-sm font-medium py-2.5 px-4 rounded-xl bg-zinc-200/50 dark:bg-zinc-800 hover:bg-zinc-300/50 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-2 shrink-0"
          >
            ম্যাপে দেখুন ↗
          </a>
        </div>
      </div>

      {/* Bottom Badge */}
      <div className="flex justify-center pt-2">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-400/25">
          <Clock className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            ২৪/৭ সাপোর্ট উপলব্ধ
          </span>
        </div>
      </div>
    </div>
  );
}
