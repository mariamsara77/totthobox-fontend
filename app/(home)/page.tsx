import Link from "next/link";
import {
  Calendar,
  ArrowLeftRight,
  Wrench,
  Cpu,
  PhoneCall,
  MapPin,
  Globe,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import UserAnalytics from "@/components/UserAnalytics";

// সার্ভিস লিস্টের ড্যাটা
const services = [
  {
    href: "/bangla/calendar",
    icon: Calendar,
    label: "বাংলা ক্যালেন্ডার",
    details: "ছুটি ও বিশেষ দিবসের তালিকা।",
  },
  {
    href: "/converter/number-to-word",
    icon: ArrowLeftRight,
    label: "কনভার্টার",
    details: "মুদ্রা ও একক রূপান্তর টুলস।",
  },
  {
    href: "/tools/image-resizer",
    icon: Wrench,
    label: "বিভিন্ন টুলস",
    details: "ছবি রিসাইজ, বয়স ক্যালকুলেটর।",
  },
  {
    href: "/software/all",
    icon: Cpu,
    label: "সফটওয়্যার",
    details: "সফটওয়্যার পরিচিতি ও তথ্য।",
  },
  {
    href: "/contact/police",
    icon: PhoneCall,
    label: "জরুরি সেবা",
    details: "হেল্পলাইন ও জরুরি নম্বর।",
  },
  {
    href: "/bangladesh/introduction",
    icon: MapPin,
    label: "বাংলাদেশ",
    details: "দর্শনীয় স্থান, গুণীজন ও তথ্য।",
  },
  {
    href: "/international/all-country",
    icon: Globe,
    label: "বিশ্বকোষ",
    details: "পতাকা, রাজধানী ও মুদ্রার তথ্য।",
  },
  {
    href: "/islam/basic",
    icon: BookOpen,
    label: "ইসলামিক",
    details: "নামাজ, কালেমা ও দোয়া।",
  },
  {
    href: "/signs/all",
    icon: ShieldAlert,
    label: "সংকেত",
    details: "স্বাস্থ্য ও ট্রাফিক সংকেত।",
  },
  {
    href: "/ai/chat",
    icon: Sparkles,
    label: "Totthobox AI",
    details: "চ্যাটবট সহায়তা ও তথ্য সেবা।",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 p-4 min-h-screen text-gray-800 dark:text-gray-100 font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-2 relative z-10">
          <span className="inline-block px-3.5 py-1 bg-emerald-500/30 border border-emerald-400/30 rounded-full text-xs font-semibold tracking-wide text-emerald-600 dark:text-emerald-100 uppercase">
            ডিজিটাল তথ্য সেবা পোর্টাল
          </span>

          <h1 className="text-xl font-black tracking-tight leading-tight">
            প্রয়োজনীয় সব তথ্য ও সেবা এক জায়গায়
          </h1>

          <p className="text-emerald-600 dark:text-emerald-100 text-base max-w-2xl mx-auto">
            আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা — সম্পূর্ণ বিনামূল্যে ও নির্ভরযোগ্যভাবে।
          </p>

          {/* Analytics Badge */}
              <UserAnalytics />
        </div>
      </section>

      {/* Main Services Grid */}
      <main className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              মূল সেবাসমূহ
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              নিচের তালিকা থেকে আপনার কাঙ্ক্ষিত সেবাটি নির্বাচন করুন
            </p>
          </div>
        </div>

        {/* Dynamic Services Cards */}
        <section aria-label="সকল সেবা">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                className="relative flex flex-col items-center h-full p-4 text-center transition-all duration-200 border border-transparent group rounded-3xl bg-zinc-50 dark:bg-white/5 hover:border-zinc-300 dark:hover:border-zinc-600/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              >
                <div className="mb-3 transition-transform duration-200 transform group-hover:scale-110 text-zinc-900 dark:text-white">
                  <Icon className="w-12 h-12 stroke-[1.5]" />
                </div>

                <h3 className="text-lg font-medium text-zinc-900 dark:text-white transition-colors group-hover:font-bold">
                  {service.label}
                </h3>

                <span className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {service.details}
                </span>
              </Link>
            );
          })}
        </div>
        </section>

        <hr className="border-zinc-200 dark:border-zinc-700 my-12" />

        {/* Content Section (SEO & AdSense Optimized) */}
        <article className="space-y-6">
          <h2 className="text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400 font-bold">
            তথ্যবক্স (Totthobox) — আপনার দৈনন্দিন ডিজিটাল সহায়ক
          </h2>

          <div className="space-y-6 text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
           <p>
  বর্তমানে সঠিক তথ্য দ্রুত পাওয়া অত্যন্ত জরুরি।{" "}
  <strong className="text-zinc-900 dark:text-white">Totthobox</strong>{" "}
  বাংলাদেশের ব্যবহারকারীদের জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস
  পোর্টাল। এখানে দৈনন্দিন জীবনের প্রয়োজনীয় তথ্য, টুলস এবং
  শিক্ষামূলক কনটেন্ট এক প্ল্যাটফর্মে রাখা হয়েছে।
</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  কী কী সেবা পাবেন
                </h3>
                <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm">
                  <li>
                    <strong>বাংলা ক্যালেন্ডার & ছুটির তালিকা:</strong> তারিখ,
                    সরকারি ছুটি ও বিশেষ দিবস।
                  </li>
                  <li>
                    <strong>জরুরি সেবা ও হেল্পলাইন:</strong> পুলিশ, ফায়ার
                    সার্ভিস ও অ্যাম্বুলেন্সের নম্বর।
                  </li>
                  <li>
                    <strong>ইসলামিক শিক্ষা:</strong> নামাজের নিয়ম, কালেমা,
                    দোয়া ও সহজ নিয়মাবলী।
                  </li>
                  <li>
                    <strong>শিশুশিক্ষা:</strong> বর্ণমালা ও মৌলিক শিক্ষার সহজ
                    ডিজিটাল মাধ্যম।
                  </li>
                  <li>
                    <strong>টুলস & কনভার্টার:</strong> কারেন্সি, সংখ্যা থেকে শব্দ
                    ও পিকচার রিসাইজার।
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  কেন Totthobox ব্যবহার করবেন
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed">
                  আমরা বিশ্বাস করি প্রযুক্তি সবার জন্য সহজ হওয়া উচিত। পরিষ্কার
                  নেভিগেশন ও দ্রুত স্পিডের উপর ভিত্তি করে সাইটটি তৈরি, যা আপনাকে
                  অপ্রয়োজনীয় ঝামেলা থেকে মুক্ত রেখে সঠিক সেবা দেবে।
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}