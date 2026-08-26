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
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import UserAnalytics from "@/components/UserAnalytics";

const services = [
  ["/bangla/calendar", Calendar, "বাংলা ক্যালেন্ডার", "ছুটি ও বিশেষ দিবসের তালিকা।"],
  ["/converter/number-to-word", ArrowLeftRight, "কনভার্টার", "মুদ্রা ও একক রূপান্তর টুলস।"],
  ["/tools/image-resizer", Wrench, "বিভিন্ন টুলস", "ছবি রিসাইজ, বয়স ক্যালকুলেটর।"],
  ["/software/all", Cpu, "সফটওয়্যার", "সফটওয়্যার পরিচিতি ও তথ্য।"],
  ["/contact/police", PhoneCall, "জরুরি সেবা", "হেল্পলাইন ও জরুরি নম্বর।"],
  ["/bangladesh/introduction", MapPin, "বাংলাদেশ", "দর্শনীয় স্থান, গুণীজন ও তথ্য।"],
  ["/international/all-country", Globe, "বিশ্বকোষ", "পতাকা, রাজধানী ও মুদ্রার তথ্য।"],
  ["/islam/basic", BookOpen, "ইসলামিক", "নামাজ, কালেমা ও দোয়া।"],
  ["/signs/all", ShieldAlert, "সংকেত", "স্বাস্থ্য ও ট্রাফিক সংকেত।"],
  ["/ai/chat", Sparkles, "Totthobox AI", "চ্যাটবট সহায়তা ও তথ্য সেবা।"],
] as const;

export default function HomePage() {
  return (
    <div className="app-shell app-stack min-h-screen">
      <section className="app-section text-center">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2">
          <span className="app-badge">ডিজিটাল তথ্য সেবা পোর্টাল</span>
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">
            প্রয়োজনীয় সব তথ্য ও সেবা এক জায়গায়
          </h1>
          <p className="max-w-2xl text-base">
            আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা — সম্পূর্ণ বিনামূল্যে ও নির্ভরযোগ্যভাবে।
          </p>
          <UserAnalytics />
        </div>
      </section>

      <main className="app-stack">
        <section className="app-section">
          <header className="app-header">
            <div>
              <h2 className="app-title">মূল সেবাসমূহ</h2>
              <p className="app-subtitle">নিচের তালিকা থেকে আপনার কাঙ্ক্ষিত সেবাটি নির্বাচন করুন</p>
            </div>
          </header>

          <div className="app-grid mt-4" aria-label="সকল সেবা">
            {services.map(([href, Icon, label, details]) => (
              <Link key={href} href={href} className="app-card group">
                <Icon className="app-icon stroke-[1.5]" aria-hidden="true" />
                <h3 className="text-lg font-medium group-hover:font-bold">{label}</h3>
                <span className="app-muted mt-2 text-xs leading-relaxed">{details}</span>
              </Link>
            ))}
          </div>
        </section>

        <hr className="app-divider" />

        <article className="app-content">
          <h2 className="text-xl sm:text-2xl">তথ্যবক্স (Totthobox) — আপনার দৈনন্দিন ডিজিটাল সহায়ক</h2>

          <div className="text-sm sm:text-base">
            <p>
              বর্তমানে সঠিক তথ্য দ্রুত পাওয়া অত্যন্ত জরুরি। <strong>Totthobox</strong> বাংলাদেশের ব্যবহারকারীদের জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস পোর্টাল। এখানে দৈনন্দিন জীবনের প্রয়োজনীয় তথ্য, টুলস এবং শিক্ষামূলক কনটেন্ট এক প্ল্যাটফর্মে রাখা হয়েছে।
            </p>

            <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
              <section>
                <h3 className="text-lg">কী কী সেবা পাবেন</h3>
                <ul className="list-disc text-xs sm:text-sm">
                  <li><strong>বাংলা ক্যালেন্ডার ও ছুটির তালিকা:</strong> তারিখ, সরকারি ছুটি ও বিশেষ দিবস।</li>
                  <li><strong>জরুরি সেবা ও হেল্পলাইন:</strong> পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের নম্বর।</li>
                  <li><strong>ইসলামিক শিক্ষা:</strong> নামাজের নিয়ম, কালেমা, দোয়া ও সহজ নিয়মাবলী।</li>
                  <li><strong>শিশুশিক্ষা:</strong> বর্ণমালা ও মৌলিক শিক্ষার সহজ ডিজিটাল মাধ্যম।</li>
                  <li><strong>টুলস ও কনভার্টার:</strong> কারেন্সি, সংখ্যা থেকে শব্দ ও পিকচার রিসাইজার।</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg">কেন Totthobox ব্যবহার করবেন</h3>
                <p className="text-xs sm:text-sm">
                  আমরা বিশ্বাস করি প্রযুক্তি সবার জন্য সহজ হওয়া উচিত। পরিষ্কার নেভিগেশন ও দ্রুত স্পিডের উপর ভিত্তি করে সাইটটি তৈরি, যা আপনাকে অপ্রয়োজনীয় ঝামেলা থেকে মুক্ত রেখে সঠিক সেবা দেবে।
                </p>
              </section>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
