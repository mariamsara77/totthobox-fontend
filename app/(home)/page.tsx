import Link from "next/link";
import {
  ArrowLeftRight,
  BookOpen,
  Calendar,
  Cpu,
  Globe,
  GraduationCap,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  Wrench,
} from "lucide-react";
import UserAnalytics from "@/components/UserAnalytics";

const services = [
  { href: "/bangla/calendar", icon: Calendar, label: "বাংলা ক্যালেন্ডার", details: "ছুটি ও বিশেষ দিবসের তালিকা।" },
  { href: "/converter/number-to-word", icon: ArrowLeftRight, label: "কনভার্টার", details: "মুদ্রা ও একক রূপান্তর টুলস।" },
  { href: "/tools/image-resizer", icon: Wrench, label: "বিভিন্ন টুলস", details: "ছবি রিসাইজ, বয়স ক্যালকুলেটর।" },
  { href: "/software/all", icon: Cpu, label: "সফটওয়্যার", details: "সফটওয়্যার পরিচিতি ও তথ্য।" },
  { href: "/contact/police", icon: PhoneCall, label: "জরুরি সেবা", details: "হেল্পলাইন ও জরুরি নম্বর।" },
  { href: "/bangladesh/introduction", icon: MapPin, label: "বাংলাদেশ", details: "দর্শনীয় স্থান, গুণীজন ও তথ্য।" },
  { href: "/international/all-country", icon: Globe, label: "বিশ্বকোষ", details: "পতাকা, রাজধানী ও মুদ্রার তথ্য।" },
  { href: "/islam/basic", icon: BookOpen, label: "ইসলামিক", details: "নামাজ, কালেমা ও দোয়া।" },
  { href: "/signs/all", icon: ShieldAlert, label: "সংকেত", details: "স্বাস্থ্য ও ট্রাফিক সংকেত।" },
  { href: "/ai/chat", icon: Sparkles, label: "Totthobox AI", details: "চ্যাটবট সহায়তা ও তথ্য সেবা।" },
];

export default function HomePage() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-4 p-4">
      <section className="relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl space-y-2 text-center">
          <span className="inline-flex rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-3 py-1 text-xs tracking-wide">
            ডিজিটাল তথ্য সেবা পোর্টাল
          </span>
          <h1 className="text-xl font-black leading-tight tracking-tight">
            প্রয়োজনীয় সব তথ্য ও সেবা এক জায়গায়
          </h1>
          <p className="mx-auto max-w-2xl text-base opacity-50">
            আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা — সম্পূর্ণ বিনামূল্যে ও নির্ভরযোগ্যভাবে।
          </p>
          <UserAnalytics />
        </div>
      </section>

      <main className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-400/25 pb-3">
          <div>
            <h2 className="text-2xl font-bold">মূল সেবাসমূহ</h2>
            <p className="mt-1 text-xs opacity-50">
              নিচের তালিকা থেকে আপনার কাঙ্ক্ষিত সেবাটি নির্বাচন করুন
            </p>
          </div>
        </div>

        <section aria-label="সকল সেবা">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {services.map(({ href, icon: Icon, label, details }) => (
              <Link
                key={href}
                href={href}
                className="group flex h-full flex-col items-center rounded-2xl bg-zinc-400/10 p-4 text-center transition-colors hover:bg-zinc-400/25"
              >
                <div className="mb-4 transition-transform duration-200 group-hover:scale-105">
                  <Icon aria-hidden="true" className="h-10 w-10 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-medium">{label}</h3>
                <span className="mt-2 text-xs leading-relaxed opacity-50">{details}</span>
              </Link>
            ))}
          </div>
        </section>

        <hr className="border-zinc-400/25" />

        <article className="space-y-4">
          <h2 className="text-xl font-bold sm:text-2xl">
            তথ্যবক্স (Totthobox) — আপনার দৈনন্দিন ডিজিটাল সহায়ক
          </h2>
          <div className="space-y-4 text-sm leading-relaxed sm:text-base">
            <p>
              বর্তমানে সঠিক তথ্য দ্রুত পাওয়া অত্যন্ত জরুরি। <strong>Totthobox</strong> বাংলাদেশের ব্যবহারকারীদের জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস পোর্টাল। এখানে দৈনন্দিন জীবনের প্রয়োজনীয় তথ্য, টুলস এবং শিক্ষামূলক কনটেন্ট এক প্ল্যাটফর্মে রাখা হয়েছে।
            </p>
            <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">কী কী সেবা পাবেন</h3>
                <ul className="list-inside list-disc space-y-2 text-xs sm:text-sm">
                  <li><strong>বাংলা ক্যালেন্ডার ও ছুটির তালিকা:</strong> তারিখ, সরকারি ছুটি ও বিশেষ দিবস।</li>
                  <li><strong>জরুরি সেবা ও হেল্পলাইন:</strong> পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের নম্বর।</li>
                  <li><strong>ইসলামিক শিক্ষা:</strong> নামাজের নিয়ম, কালেমা, দোয়া ও সহজ নিয়মাবলী।</li>
                  <li><strong>শিশুশিক্ষা:</strong> বর্ণমালা ও মৌলিক শিক্ষার সহজ ডিজিটাল মাধ্যম।</li>
                  <li><strong>টুলস ও কনভার্টার:</strong> কারেন্সি, সংখ্যা থেকে শব্দ ও পিকচার রিসাইজার।</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold">কেন Totthobox ব্যবহার করবেন</h3>
                <p className="text-xs leading-relaxed opacity-50 sm:text-sm">
                  আমরা বিশ্বাস করি প্রযুক্তি সবার জন্য সহজ হওয়া উচিত। পরিষ্কার নেভিগেশন ও দ্রুত স্পিডের উপর ভিত্তি করে সাইটটি তৈরি, যা আপনাকে অপ্রয়োজনীয় ঝামেলা থেকে মুক্ত রেখে সঠিক সেবা দেবে।
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
