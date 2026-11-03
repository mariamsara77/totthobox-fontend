"use client";

import { useState, useMemo } from "react";
import { Phone, Search, Copy, Check, Globe, ShieldAlert, ExternalLink, Bookmark } from "lucide-react";
import { FavoriteButton } from "@/components/tools/QuickFavorites";
import { ShareToolButton } from "@/components/tools/ToolActions";

interface CountryCodeItem {
  name: string;
  nameEn: string;
  dialCode: string;
  iso2: string;
  flag: string;
  capital: string;
  emergency: string;
}

const COUNTRY_DIALING_DATA: CountryCodeItem[] = [
  { name: "বাংলাদেশ", nameEn: "Bangladesh", dialCode: "+880", iso2: "BD", flag: "🇧🇩", capital: "ঢাকা", emergency: "999" },
  { name: "যুক্তরাষ্ট্র / কানাডা", nameEn: "United States / Canada", dialCode: "+1", iso2: "US", flag: "🇺🇸", capital: "ওয়াশিংটন / অটোয়া", emergency: "911" },
  { name: "যুক্তরাজ্য", nameEn: "United Kingdom", dialCode: "+44", iso2: "GB", flag: "🇬🇧", capital: "লন্ডন", emergency: "999 / 112" },
  { name: "সৌদি আরব", nameEn: "Saudi Arabia", dialCode: "+966", iso2: "SA", flag: "🇸🇦", capital: "রিয়াদ", emergency: "999 / 911" },
  { name: "সংযুক্ত আরব আমিরাত", nameEn: "United Arab Emirates", dialCode: "+971", iso2: "AE", flag: "🇦🇪", capital: "আবুধাবি", emergency: "999" },
  { name: "ভারত", nameEn: "India", dialCode: "+91", iso2: "IN", flag: "🇮🇳", capital: "নতুন দিল্লি", emergency: "112" },
  { name: "মালয়েশিয়া", nameEn: "Malaysia", dialCode: "+60", iso2: "MY", flag: "🇲🇾", capital: "কুয়ালালামপুর", emergency: "999" },
  { name: "সিঙ্গাপুর", nameEn: "Singapore", dialCode: "+65", iso2: "SG", flag: "🇸🇬", capital: "সিঙ্গাপুর", emergency: "999" },
  { name: "কাতার", nameEn: "Qatar", dialCode: "+974", iso2: "QA", flag: "🇶🇦", capital: "দোহা", emergency: "999" },
  { name: "কুয়েত", nameEn: "Kuwait", dialCode: "+965", iso2: "KW", flag: "🇰🇼", capital: "কুয়েত সিটি", emergency: "112" },
  { name: "ওমান", nameEn: "Oman", dialCode: "+968", iso2: "OM", flag: "🇴🇲", capital: "মাস্কাট", emergency: "9999" },
  { name: "বাহরাইন", nameEn: "Bahrain", dialCode: "+973", iso2: "BH", flag: "🇧🇭", capital: "মানামা", emergency: "999" },
  { name: "অস্ট্রেলিয়া", nameEn: "Australia", dialCode: "+61", iso2: "AU", flag: "🇦🇺", capital: "ক্যানবেরা", emergency: "000" },
  { name: "ইতালি", nameEn: "Italy", dialCode: "+39", iso2: "IT", flag: "🇮🇹", capital: "রোম", emergency: "112" },
  { name: "জার্মানি", nameEn: "Germany", dialCode: "+49", iso2: "DE", flag: "🇩🇪", capital: "বার্লিন", emergency: "112" },
  { name: "ফ্রান্স", nameEn: "France", dialCode: "+33", iso2: "FR", flag: "🇫🇷", capital: "প্যারিস", emergency: "112" },
  { name: "জাপান", nameEn: "Japan", dialCode: "+81", iso2: "JP", flag: "🇯🇵", capital: "টোকিও", emergency: "110 / 119" },
  { name: "দক্ষিণ কোরিয়া", nameEn: "South Korea", dialCode: "+82", iso2: "KR", flag: "🇰🇷", capital: "সিউল", emergency: "112 / 119" },
  { name: "চীন", nameEn: "China", dialCode: "+86", iso2: "CN", flag: "🇨🇳", capital: "বেইজিং", emergency: "110 / 120" },
  { name: "তুরস্ক", nameEn: "Turkey", dialCode: "+90", iso2: "TR", flag: "🇹🇷", capital: "আঙ্কারা", emergency: "112" },
  { name: "পাকিস্তান", nameEn: "Pakistan", dialCode: "+92", iso2: "PK", flag: "🇵🇰", capital: "ইসলামাবাদ", emergency: "15" },
  { name: "রাশিয়া", nameEn: "Russia", dialCode: "+7", iso2: "RU", flag: "🇷🇺", capital: "মস্কো", emergency: "112" },
  { name: "ব্রাজিল", nameEn: "Brazil", dialCode: "+55", iso2: "BR", flag: "🇧🇷", capital: "ব্রাসিলিয়া", emergency: "190" },
  { name: "দক্ষিণ আফ্রিকা", nameEn: "South Africa", dialCode: "+27", iso2: "ZA", flag: "🇿🇦", capital: "প্রিটোরিয়া", emergency: "10111" },
  { name: "স্পেন", nameEn: "Spain", dialCode: "+34", iso2: "ES", flag: "🇪🇸", capital: "মাদ্রিদ", emergency: "112" },
  { name: "সুইডেন", nameEn: "Sweden", dialCode: "+46", iso2: "SE", flag: "🇸🇪", capital: "স্টকহোম", emergency: "112" },
  { name: "সুইজারল্যান্ড", nameEn: "Switzerland", dialCode: "+41", iso2: "CH", flag: "🇨🇭", capital: "বার্ন", emergency: "112 / 117" },
  { name: "নেদারল্যান্ডস", nameEn: "Netherlands", dialCode: "+31", iso2: "NL", flag: "🇳🇱", capital: "আমস্টারডাম", emergency: "112" },
  { name: "থাইল্যান্ড", nameEn: "Thailand", dialCode: "+66", iso2: "TH", flag: "🇹🇭", capital: "ব্যাংকক", emergency: "191" },
  { name: "মিশর", nameEn: "Egypt", dialCode: "+20", iso2: "EG", flag: "🇪🇬", capital: "কায়রো", emergency: "122" },
];

export default function CallingCodesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Phone validator simulation
  const [testNumber, setTestNumber] = useState("");
  const [selectedDialCode, setSelectedDialCode] = useState("+880");

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return COUNTRY_DIALING_DATA;

    return COUNTRY_DIALING_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const copyDialCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1800);
    } catch {}
  };

  const formattedPreview = useMemo(() => {
    if (!testNumber) return "";
    const cleanNumber = testNumber.replace(/[^\d]/g, "");
    return `${selectedDialCode} ${cleanNumber}`;
  }, [selectedDialCode, testNumber]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Globe className="w-3.5 h-3.5" />
            আন্তর্জাতিক ডায়ালিং কোড ডিরেক্টরি
          </span>
          <FavoriteButton
            tool={{
              id: "calling-codes",
              title: "আন্তর্জাতিক ডায়ালিং কোড",
              path: "/international/calling-codes",
              category: "গ্লোবাল তথ্য",
            }}
          />
          <ShareToolButton title="আন্তর্জাতিক ডায়ালিং ও কান্ট্রি কোড - Totthobox" />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          আন্তর্জাতিক ডায়ালিং কোড ও কান্ট্রি ডিরেক্টরি
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          বিশ্বের সকল দেশের ফোন কলিং কোড (Country Code), রাজধানী, জরুরি হেল্পলাইন ও আন্তর্জাতিক নম্বর ফরম্যাট এক নজরে খুঁজুন।
        </p>
      </header>

      {/* Interactive Phone Number Formatter */}
      <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/60 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            আন্তর্জাতিক নম্বর ফরমেট টেস্টার
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <select
            value={selectedDialCode}
            onChange={(e) => setSelectedDialCode(e.target.value)}
            className="w-full sm:w-60 min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm font-medium outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
          >
            {COUNTRY_DIALING_DATA.map((c) => (
              <option key={c.iso2} value={c.dialCode}>
                {c.flag} {c.name} ({c.dialCode})
              </option>
            ))}
          </select>

          <input
            type="tel"
            value={testNumber}
            onChange={(e) => setTestNumber(e.target.value)}
            placeholder="স্থানীয় নম্বর লিখুন (যেমন: 1712345678)"
            className="flex-1 min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
          />
        </div>

        {formattedPreview && (
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <span className="text-xs text-zinc-500 font-medium">আন্তর্জাতিক স্ট্যান্ডার্ড (E.164):</span>
              <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate">
                {formattedPreview}
              </span>
            </div>
            <a
              href={`tel:${formattedPreview.replace(/\s+/g, "")}`}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              কল করুন
            </a>
          </div>
        )}
      </section>

      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="দেশের নাম, ইংরেজি নাম বা ডায়ালিং কোড (+880, +1, +44...) দিয়ে সার্চ করুন..."
          className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-11 pr-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100 shadow-xs"
        />
      </div>

      {/* Country List Grid */}
      <section aria-label="সকল দেশের ডায়ালিং কোড">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredData.map((item) => (
            <article
              key={item.iso2}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl" role="img" aria-label={item.name}>
                    {item.flag}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </h2>
                    <p className="text-xs text-zinc-500">{item.nameEn} · {item.iso2}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyDialCode(item.dialCode)}
                  aria-label={`${item.name} এর ডায়ালিং কোড কপি করুন`}
                  title="কোড কপি করুন"
                  className="flex min-h-[38px] items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                >
                  {copiedCode === item.dialCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">কপি!</span>
                    </>
                  ) : (
                    <>
                      <span>{item.dialCode}</span>
                      <Copy className="w-3 h-3 opacity-60" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span>রাজধানী: <strong className="text-zinc-700 dark:text-zinc-300">{item.capital}</strong></span>
                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  জরুরি: {item.emergency}
                </span>
              </div>
            </article>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
            <p className="text-zinc-500">
              কোনো দেশ পাওয়া যায়নি। বানান বা ডায়ালিং কোড পুনরায় যাচাই করুন।
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
