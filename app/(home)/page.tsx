import Link from "next/link";
import {
  ArrowLeftRight,
  BookOpen,
  Calendar,
  Cpu,
  Globe,
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
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <header className="space-y-4 border-b border-zinc-400/25 pb-4 text-center">
        <span className="inline-flex rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 text-xs">
          ডিজিটাল তথ্য সেবা পোর্টাল
        </span>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">প্রয়োজনীয় সব তথ্য ও সেবা এক জায়গায়</h1>
          <p className="text-sm opacity-50">
            আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা — সম্পূর্ণ বিনামূল্যে ও নির্ভরযোগ্যভাবে।
          </p>
        </div>
        <UserAnalytics />
      </header>

      <main className="space-y-4">
        <section className="space-y-4" aria-labelledby="home-services-heading">
          <div className="space-y-2">
            <h2 id="home-services-heading" className="text-xl font-bold">মূল সেবাসমূহ</h2>
            <p className="text-sm opacity-50">নিচের তালিকা থেকে আপনার কাঙ্ক্ষিত সেবাটি নির্বাচন করুন</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {services.map(({ href, icon: Icon, label, details }) => (
              <Link
                key={href}
                href={href}
                className="flex h-full flex-col items-center gap-2 rounded-2xl bg-zinc-400/10 p-4 text-center hover:bg-zinc-400/25"
              >
                <Icon aria-hidden="true" className="h-8 w-8" />
                <h3 className="text-sm font-medium">{label}</h3>
                <span className="text-xs opacity-50">{details}</span>
              </Link>
            ))}
          </div>
        </section>

        <hr className="border-zinc-400/25" />

        <article className="space-y-4">
          <h2 className="text-xl font-bold">তথ্যবক্স (Totthobox) — আপনার দৈনন্দিন ডিজিটাল সহায়ক</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              বর্তমানে সঠিক তথ্য দ্রুত পাওয়া অত্যন্ত জরুরি। <strong>Totthobox</strong> বাংলাদেশের ব্যবহারকারীদের জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস পোর্টাল। এখানে দৈনন্দিন জীবনের প্রয়োজনীয় তথ্য, টুলস এবং শিক্ষামূলক কনটেন্ট এক প্ল্যাটফর্মে রাখা হয়েছে।
            </p>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">কী কী সেবা পাবেন</h3>
              <ul className="space-y-2">
                <li>বাংলা ক্যালেন্ডার ও ছুটির তালিকা — তারিখ, সরকারি ছুটি ও বিশেষ দিবস।</li>
                <li>জরুরি সেবা ও হেল্পলাইন — পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের নম্বর।</li>
                <li>ইসলামিক শিক্ষা — নামাজের নিয়ম, কালেমা, দোয়া ও সহজ নিয়মাবলী।</li>
                <li>টুলস ও কনভার্টার — কারেন্সি, সংখ্যা থেকে শব্দ ও পিকচার রিসাইজার।</li>
              </ul>
            </div>
            <p className="opacity-50">
              আমরা বিশ্বাস করি প্রযুক্তি সবার জন্য সহজ হওয়া উচিত। পরিষ্কার নেভিগেশন ও দ্রুত স্পিডের উপর ভিত্তি করে সাইটটি তৈরি, যাতে আপনাকে অপ্রয়োজনীয় ঝামেলা ছাড়াই সঠিক সেবা দিতে পারে।
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
