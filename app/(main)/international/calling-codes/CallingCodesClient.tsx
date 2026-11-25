"use client";

import { useState, useMemo } from "react";
import {
  Phone,
  Search,
  Copy,
  Check,
  Globe,
  ShieldAlert,
  Filter,
  ArrowUpDown,
} from "lucide-react";
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
  region: string;
}

const COUNTRY_DIALING_DATA: CountryCodeItem[] = [
  {
    name: "বাংলাদেশ",
    nameEn: "Bangladesh",
    dialCode: "+880",
    iso2: "BD",
    flag: "🇧🇩",
    capital: "ঢাকা",
    emergency: "999",
    region: "Asia",
  },
  {
    name: "যুক্তরাষ্ট্র / কানাডা",
    nameEn: "United States / Canada",
    dialCode: "+1",
    iso2: "US",
    flag: "🇺🇸",
    capital: "ওয়াশিংটন / অটোয়া",
    emergency: "911",
    region: "Americas",
  },
  {
    name: "যুক্তরাজ্য",
    nameEn: "United Kingdom",
    dialCode: "+44",
    iso2: "GB",
    flag: "🇬🇧",
    capital: "লন্ডন",
    emergency: "999 / 112",
    region: "Europe",
  },
  {
    name: "সৌদি আরব",
    nameEn: "Saudi Arabia",
    dialCode: "+966",
    iso2: "SA",
    flag: "🇸🇦",
    capital: "রিয়াদ",
    emergency: "999 / 911",
    region: "Asia",
  },
  {
    name: "সংযুক্ত আরব আমিরাত",
    nameEn: "United Arab Emirates",
    dialCode: "+971",
    iso2: "AE",
    flag: "🇦🇪",
    capital: "আবুধাবি",
    emergency: "999",
    region: "Asia",
  },
  {
    name: "ভারত",
    nameEn: "India",
    dialCode: "+91",
    iso2: "IN",
    flag: "🇮🇳",
    capital: "নতুন দিল্লি",
    emergency: "112",
    region: "Asia",
  },
  {
    name: "মালয়েশিয়া",
    nameEn: "Malaysia",
    dialCode: "+60",
    iso2: "MY",
    flag: "🇲🇾",
    capital: "কুয়ালালামপুর",
    emergency: "999",
    region: "Asia",
  },
  {
    name: "সিঙ্গাপুর",
    nameEn: "Singapore",
    dialCode: "+65",
    iso2: "SG",
    flag: "🇸🇬",
    capital: "সিঙ্গাপুর",
    emergency: "999",
    region: "Asia",
  },
  {
    name: "কাতার",
    nameEn: "Qatar",
    dialCode: "+974",
    iso2: "QA",
    flag: "🇶🇦",
    capital: "দোহা",
    emergency: "999",
    region: "Asia",
  },
  {
    name: "কুয়েত",
    nameEn: "Kuwait",
    dialCode: "+965",
    iso2: "KW",
    flag: "🇰🇼",
    capital: "কুয়েত সিটি",
    emergency: "112",
    region: "Asia",
  },
  {
    name: "ওমান",
    nameEn: "Oman",
    dialCode: "+968",
    iso2: "OM",
    flag: "🇴🇲",
    capital: "মাস্কাট",
    emergency: "9999",
    region: "Asia",
  },
  {
    name: "বাহরাইন",
    nameEn: "Bahrain",
    dialCode: "+973",
    iso2: "BH",
    flag: "🇧🇭",
    capital: "মানামা",
    emergency: "999",
    region: "Asia",
  },
  {
    name: "অস্ট্রেলিয়া",
    nameEn: "Australia",
    dialCode: "+61",
    iso2: "AU",
    flag: "🇦🇺",
    capital: "ক্যানবেরা",
    emergency: "000",
    region: "Oceania",
  },
  {
    name: "ইতালি",
    nameEn: "Italy",
    dialCode: "+39",
    iso2: "IT",
    flag: "🇮🇹",
    capital: "রোম",
    emergency: "112",
    region: "Europe",
  },
  {
    name: "জার্মানি",
    nameEn: "Germany",
    dialCode: "+49",
    iso2: "DE",
    flag: "🇩🇪",
    capital: "বার্লিন",
    emergency: "112",
    region: "Europe",
  },
  {
    name: "ফ্রান্স",
    nameEn: "France",
    dialCode: "+33",
    iso2: "FR",
    flag: "🇫🇷",
    capital: "প্যারিস",
    emergency: "112",
    region: "Europe",
  },
  {
    name: "জাপান",
    nameEn: "Japan",
    dialCode: "+81",
    iso2: "JP",
    flag: "🇯🇵",
    capital: "টোকিও",
    emergency: "110 / 119",
    region: "Asia",
  },
  {
    name: "দক্ষিণ কোরিয়া",
    nameEn: "South Korea",
    dialCode: "+82",
    iso2: "KR",
    flag: "🇰🇷",
    capital: "সিউল",
    emergency: "112 / 119",
    region: "Asia",
  },
  {
    name: "চীন",
    nameEn: "China",
    dialCode: "+86",
    iso2: "CN",
    flag: "🇨🇳",
    capital: "বেইজিং",
    emergency: "110 / 120",
    region: "Asia",
  },
  {
    name: "তুরস্ক",
    nameEn: "Turkey",
    dialCode: "+90",
    iso2: "TR",
    flag: "🇹🇷",
    capital: "আঙ্কারা",
    emergency: "112",
    region: "Europe",
  },
  {
    name: "পাকিস্তান",
    nameEn: "Pakistan",
    dialCode: "+92",
    iso2: "PK",
    flag: "🇵🇰",
    capital: "ইসলামাবাদ",
    emergency: "15",
    region: "Asia",
  },
  {
    name: "রাশিয়া",
    nameEn: "Russia",
    dialCode: "+7",
    iso2: "RU",
    flag: "🇷🇺",
    capital: "মস্কো",
    emergency: "112",
    region: "Europe",
  },
  {
    name: "ব্রাজিল",
    nameEn: "Brazil",
    dialCode: "+55",
    iso2: "BR",
    flag: "🇧🇷",
    capital: "ব্রাসিলিয়া",
    emergency: "190",
    region: "Americas",
  },
  {
    name: "দক্ষিণ আফ্রিকা",
    nameEn: "South Africa",
    dialCode: "+27",
    iso2: "ZA",
    flag: "🇿🇦",
    capital: "প্রিটোরিয়া",
    emergency: "10111",
    region: "Africa",
  },
  {
    name: "স্পেন",
    nameEn: "Spain",
    dialCode: "+34",
    iso2: "ES",
    flag: "🇪🇸",
    capital: "মাদ্রিদ",
    emergency: "112",
    region: "Europe",
  },
  {
    name: "সুইডেন",
    nameEn: "Sweden",
    dialCode: "+46",
    iso2: "SE",
    flag: "🇸🇪",
    capital: "স্টকহোম",
    emergency: "112",
    region: "Europe",
  },
  {
    name: "সুইজারল্যান্ড",
    nameEn: "Switzerland",
    dialCode: "+41",
    iso2: "CH",
    flag: "🇨🇭",
    capital: "বার্ন",
    emergency: "112 / 117",
    region: "Europe",
  },
  {
    name: "নেদারল্যান্ডস",
    nameEn: "Netherlands",
    dialCode: "+31",
    iso2: "NL",
    flag: "🇳🇱",
    capital: "আমস্টারডাম",
    emergency: "112",
    region: "Europe",
  },
  {
    name: "থাইল্যান্ড",
    nameEn: "Thailand",
    dialCode: "+66",
    iso2: "TH",
    flag: "🇹🇭",
    capital: "ব্যাংকক",
    emergency: "191",
    region: "Asia",
  },
  {
    name: "মিশর",
    nameEn: "Egypt",
    dialCode: "+20",
    iso2: "EG",
    flag: "🇪🇬",
    capital: "কায়রো",
    emergency: "122",
    region: "Africa",
  },
];

const REGIONS = [
  "All",
  "Asia",
  "Europe",
  "Americas",
  "Africa",
  "Oceania",
] as const;

export default function CallingCodesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"name" | "code">("name");

  // Phone formatter
  const [testNumber, setTestNumber] = useState("");
  const [selectedDialCode, setSelectedDialCode] = useState("+880");

  const filteredData = useMemo(() => {
    let data = [...COUNTRY_DIALING_DATA];

    // Region filter
    if (selectedRegion !== "All") {
      data = data.filter((c) => c.region === selectedRegion);
    }

    // Search
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          c.dialCode.toLowerCase().includes(q) ||
          c.iso2.toLowerCase().includes(q) ||
          c.capital.toLowerCase().includes(q),
      );
    }

    // Sort
    data.sort((a, b) => {
      if (sortBy === "code") {
        return a.dialCode.localeCompare(b.dialCode);
      }
      return a.nameEn.localeCompare(b.nameEn);
    });

    return data;
  }, [searchTerm, selectedRegion, sortBy]);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(key);
      setTimeout(() => setCopiedCode(null), 1800);
    } catch {}
  };

  const formattedPreview = useMemo(() => {
    if (!testNumber) return "";
    const cleanNumber = testNumber.replace(/[^\d]/g, "");
    return `${selectedDialCode} ${cleanNumber}`;
  }, [selectedDialCode, testNumber]);

  const telLink = formattedPreview
    ? `tel:${formattedPreview.replace(/\s+/g, "")}`
    : undefined;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="space-y-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Globe className="w-3.5 h-3.5" />
            আন্তর্জাতিক ডায়ালিং কোড ডিরেক্টরি
          </span>
          <FavoriteButton
            tool={{
              id: "calling-codes",
              title: "আন্তর্জাতিক ডায়ালিং কোড",
              path: "/international/calling-codes",
              category: "গ্লোবাল তথ্য",
            }}
          />
          <ShareToolButton title="আন্তর্জাতিক ডায়ালিং ও কান্ট্রি কোড - Totthobox" />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          আন্তর্জাতিক ডায়ালিং কোড ও কান্ট্রি ডিরেক্টরি
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          বিশ্বের সকল দেশের ফোন কলিং কোড (Country Code), রাজধানী, জরুরি
          হেল্পলাইন ও আন্তর্জাতিক নম্বর ফরম্যাট এক নজরে খুঁজুন।
        </p>
      </header>

      {/* Interactive Phone Number Formatter */}
      <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to- from-zinc-50/80 to-white dark:from-zinc-900/80 dark:to-zinc-950/80 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Phone className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            আন্তর্জাতিক নম্বর ফরমেট টেস্টার
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedDialCode}
            onChange={(e) => setSelectedDialCode(e.target.value)}
            className="w-full sm:w-64 min-h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-medium outline-none transition focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 text-zinc-900 dark:text-zinc-100"
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
            className="flex-1 min-h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 text-zinc-900 dark:text-zinc-100"
          />
        </div>

        {formattedPreview && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700/80">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 min-w-0">
              <span className="text-xs text-zinc-500 font-medium shrink-0">
                E.164 ফরম্যাট:
              </span>
              <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate">
                {formattedPreview}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  copyText(formattedPreview.replace(/\s+/g, ""), "preview")
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
              >
                {copiedCode === "preview" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    কপি হয়েছে
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    কপি
                  </>
                )}
              </button>

              {telLink && (
                <a
                  href={telLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  কল করুন
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Sticky Search + Filters */}
      <div className="sticky top-0 z-20 -mx-1 px-1 py-2 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="দেশের নাম, ইংরেজি নাম, কোড বা রাজধানী দিয়ে সার্চ করুন..."
              className="w-full min-h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-11 pr-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 text-zinc-900 dark:text-zinc-100 shadow-sm"
            />
          </div>

          {/* Region + Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
              {REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedRegion === region
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {region === "All" ? "সব" : region}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "code")}
                className="text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/30 text-zinc-700 dark:text-zinc-300"
              >
                <option value="name">নাম অনুসারে</option>
                <option value="code">কোড অনুসারে</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          {filteredData.length} টি দেশ পাওয়া গেছে
          {selectedRegion !== "All" && ` · ${selectedRegion}`}
        </span>
      </div>

      {/* Country Grid */}
      <section aria-label="সকল দেশের ডায়ালিং কোড">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredData.map((item) => (
              <article
                key={item.iso2}
                className="group relative rounded-[var(--radius-xl)] border border-zinc-200/80 dark:border-zinc-800/80 bg-[var(--surface-card)] p-4 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] hover:border-[var(--accent-soft-border)] transition-[box-shadow,border-color] duration-200 flex flex-col justify-between min-h-36"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="text-3xl shrink-0"
                      role="img"
                      aria-label={item.name}
                    >
                      {item.flag}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </h2>
                      <p className="text-xs text-zinc-500 truncate">
                        {item.nameEn} · {item.iso2}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyText(item.dialCode, item.iso2)}
                    aria-label={`${item.name} এর ডায়ালিং কোড কপি করুন`}
                    className="flex min-h-10 items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition shrink-0"
                  >
                    {copiedCode === item.iso2 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">
                          কপি!
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{item.dialCode}</span>
                        <Copy className="w-3 h-3 opacity-50" />
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs">
                  <span className="text-zinc-500 truncate">
                    রাজধানী:{" "}
                    <strong className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {item.capital}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        item.emergency.split(" / ")[0],
                        `em-${item.iso2}`,
                      )
                    }
                    className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium hover:underline shrink-0"
                    title="জরুরি নম্বর কপি করুন"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {item.emergency}
                    {copiedCode === `em-${item.iso2}` && (
                      <Check className="w-3 h-3 ml-0.5" />
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
              <Search className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">
              কোনো দেশ পাওয়া যায়নি
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              বানান বা ডায়ালিং কোড পুনরায় যাচাই করুন
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
