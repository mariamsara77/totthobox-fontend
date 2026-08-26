import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  ArrowRightLeft,
  Wrench,
  MonitorPlay,
  PhoneCall,
  Map,
  Globe,
  BookOpen,
  GraduationCap,
  TriangleAlert,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "মূল সেবা | Totthobox",
  description:
    "Totthobox-এ পাবেন বাংলাদেশ, ইসলামিক শিক্ষা, জরুরি নম্বর, ক্যালেন্ডার, কনভার্টার এবং প্রয়োজনীয় ডিজিটাল সেবা।",
};

const services = [
  ["/bangla/calendar", CalendarDays, "বাংলা ক্যালেন্ডার", "ছুটি ও বিশেষ দিবসের তালিকা।"],
  ["/converter/number-to-word", ArrowRightLeft, "কনভার্টার", "মুদ্রা ও একক রূপান্তর টুলস।"],
  ["/tools/image-resizer", Wrench, "বিভিন্ন টুলস", "ছবি রিসাইজ ও দৈনন্দিন ক্যালকুলেটর।"],
  ["/software/all", MonitorPlay, "সফটওয়্যার", "সফটওয়্যার পরিচিতি ও তথ্য।"],
  ["/contact/police", PhoneCall, "জরুরি সেবা", "হেল্পলাইন ও জরুরি নম্বর।"],
  ["/bangladesh/introduction", Map, "বাংলাদেশ", "বাংলাদেশের প্রয়োজনীয় তথ্য।"],
  ["/international/all-country", Globe, "বিশ্বকোষ", "পতাকা, রাজধানী ও মুদ্রার তথ্য।"],
  ["/islam/basic", BookOpen, "ইসলামিক", "নামাজ, কালেমা ও দোয়া।"],
  ["/signs/all", TriangleAlert, "সংকেত", "স্বাস্থ্য ও ট্রাফিক সংকেত।"],
  ["/ai/chat", Sparkles, "Totthobox AI", "চ্যাটবট সহায়তা ও তথ্য সেবা।"],
] as const;

export default function ServicesPage() {
  return (
    <div className="app-shell app-stack">
      <header className="app-section text-center">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2">
          <span className="app-badge">ডিজিটাল তথ্য সেবা</span>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">মূল সেবা</h1>
          <p className="app-muted max-w-2xl text-base sm:text-lg">
            আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা এক জায়গায় — নির্ভরযোগ্য ও সহজভাবে।
          </p>
        </div>
      </header>

      <section className="app-section">
        <div className="app-grid">
          {services.map(([href, Icon, label, details]) => (
            <Link key={href} href={href} className="app-card group">
              <Icon className="app-icon stroke-[1.5]" aria-hidden="true" />
              <h2 className="text-lg font-medium group-hover:font-bold">{label}</h2>
              <span className="app-muted mt-2 text-xs leading-relaxed">{details}</span>
            </Link>
          ))}
        </div>
      </section>

      <hr className="app-divider" />

      <article className="app-content">
        <h2 className="text-xl sm:text-2xl">তথ্যবক্স (Totthobox) — আপনার দৈনন্দিন ডিজিটাল সহায়ক</h2>

        <p className="text-sm sm:text-base">
          বর্তমানে সঠিক তথ্য দ্রুত পাওয়া অত্যন্ত জরুরি। <strong>Totthobox</strong> বাংলাদেশের ব্যবহারকারীদের জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস পোর্টাল। এখানে দৈনন্দিন জীবনের প্রয়োজনীয় তথ্য, টুলস এবং শিক্ষামূলক কনটেন্ট এক প্ল্যাটফর্মে রাখা হয়েছে।
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section>
            <h3 className="text-lg">কী কী সেবা পাবেন</h3>
            <ul className="list-disc text-sm">
              <li><strong>বাংলা ক্যালেন্ডার ও ছুটির তালিকা:</strong> বাংলা ও ইংরেজি তারিখ, সরকারি ছুটি এবং বিশেষ দিবস।</li>
              <li><strong>জরুরি সেবা ও হেল্পলাইন:</strong> প্রয়োজনীয় জরুরি নম্বরগুলো সহজে খুঁজে পাওয়ার ব্যবস্থা।</li>
              <li><strong>ইসলামিক শিক্ষা:</strong> নামাজের নিয়ম, কালেমা, দোয়া এবং মৌলিক ইসলামিক জ্ঞান।</li>
              <li><strong>শিশুশিক্ষা:</strong> বর্ণমালা, সংখ্যা এবং মৌলিক ডিজিটাল শিক্ষার অনুশীলন।</li>
              <li><strong>কনভার্টার ও টুলস:</strong> মুদ্রা রূপান্তর, সংখ্যা থেকে শব্দ, ছবি রিসাইজ এবং অন্যান্য দৈনন্দিন টুলস।</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg">কেন Totthobox ব্যবহার করবেন</h3>
            <p className="text-sm">
              পরিষ্কার নেভিগেশন, কমপ্যাক্ট লেআউট এবং দ্রুত ব্যবহারের কথা মাথায় রেখে সাইটটি তৈরি। একই ডিজাইন সিস্টেম ব্যবহার করায় বিভিন্ন সেবার মধ্যে অভিজ্ঞতাও সামঞ্জস্যপূর্ণ থাকে।
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
