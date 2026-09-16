"use client";

import { useState, useMemo } from "react";

const BANGLA_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const ZODIACS = [
  {
    name: "মকর",
    en: "Capricorn",
    emoji: "♑",
    element: "পৃথিবী (Earth)",
    planet: "শনি (Saturn)",
    color: "কালো, বাদামী",
    number: "4, 8",
    startM: 12,
    startD: 22,
    endM: 1,
    endD: 19,
    trait: "উচ্চাকাঙ্ক্ষী, শৃঙ্খলাপরায়ণ এবং বাস্তববাদী।",
  },
  {
    name: "কুম্ভ",
    en: "Aquarius",
    emoji: "♒",
    element: "বায়ু (Air)",
    planet: "শনি ও ইউরেনাস",
    color: "হালকা নীল, সিলভার",
    number: "4, 7, 11",
    startM: 1,
    startD: 20,
    endM: 2,
    endD: 18,
    trait: "স্বাধীনচেতা, সৃজনশীল এবং মানবতাবাদী।",
  },
  {
    name: "মীন",
    en: "Pisces",
    emoji: "♓",
    element: "জল (Water)",
    planet: "বৃহস্পতি ও নেপচুন",
    color: "সমুদ্র নীল, সবুজ",
    number: "3, 9, 12",
    startM: 2,
    startD: 19,
    endM: 3,
    endD: 20,
    trait: "সহানুভূতিশীল, কল্পনাপ্রবণ এবং সংবেদনশীল।",
  },
  {
    name: "মেষ",
    en: "Aries",
    emoji: "♈",
    element: "অগ্নি (Fire)",
    planet: "মঙ্গল (Mars)",
    color: "লাল, গাঢ় কমলা",
    number: "1, 8, 17",
    startM: 3,
    startD: 21,
    endM: 4,
    endD: 19,
    trait: "সাহসী, উদ্যমী এবং আত্মবিশ্বাসী।",
  },
  {
    name: "বৃষ",
    en: "Taurus",
    emoji: "♉",
    element: "পৃথিবী (Earth)",
    planet: "শুক্র (Venus)",
    color: "সবুজ, গোলাপি",
    number: "2, 6, 9",
    startM: 4,
    startD: 20,
    endM: 5,
    endD: 20,
    trait: "ধৈর্যশীল, বিশ্বস্ত এবং সৌন্দর্যপ্রেমী।",
  },
  {
    name: "মিথুন",
    en: "Gemini",
    emoji: "♊",
    element: "বায়ু (Air)",
    planet: "বুধ (Mercury)",
    color: "হলুদ, হালকা সবুজ",
    number: "5, 7, 14",
    startM: 5,
    startD: 21,
    endM: 6,
    endD: 20,
    trait: "বুদ্ধিমান, কৌতূহলী এবং মিশুক।",
  },
  {
    name: "কর্কট",
    en: "Cancer",
    emoji: "♋",
    element: "জল (Water)",
    planet: "চন্দ্র (Moon)",
    color: "সাদা, রূপালী",
    number: "2, 3, 15",
    startM: 6,
    startD: 21,
    endM: 7,
    endD: 22,
    trait: "আবেগপ্রবণ, যত্নশীল এবং প্রতিরক্ষামূলক।",
  },
  {
    name: "সিংহ",
    en: "Leo",
    emoji: "♌",
    element: "অগ্নি (Fire)",
    planet: "সূর্য (Sun)",
    color: "সোনালী, হলুদ",
    number: "1, 3, 10",
    startM: 7,
    startD: 23,
    endM: 8,
    endD: 22,
    trait: "উদার, প্রফুল্ল এবং জন্মগত নেতা।",
  },
  {
    name: "কন্যা",
    en: "Virgo",
    emoji: "♍",
    element: "পৃথিবী (Earth)",
    planet: "বুধ (Mercury)",
    color: "ধূসর, হালকা হলুদ",
    number: "5, 14, 15",
    startM: 8,
    startD: 23,
    endM: 9,
    endD: 22,
    trait: "বিশ্লেষণী, দয়ালু এবং পরিশ্রমী।",
  },
  {
    name: "তুলা",
    en: "Libra",
    emoji: "♎",
    element: "বায়ু (Air)",
    planet: "শুক্র (Venus)",
    color: "গোলাপি, হালকা নীল",
    number: "4, 6, 13",
    startM: 9,
    startD: 23,
    endM: 10,
    endD: 22,
    trait: "ন্যায়পরায়ণ, শান্তিকামী এবং সামাজিক।",
  },
  {
    name: "বৃশ্চিক",
    en: "Scorpio",
    emoji: "♏",
    element: "জল (Water)",
    planet: "মঙ্গল ও প্লুটো",
    color: "গাঢ় লাল, কালো",
    number: "8, 11, 18",
    startM: 10,
    startD: 23,
    endM: 11,
    endD: 21,
    trait: "আবেগপূর্ণ, সাহসী এবং দৃঢ়প্রতিজ্ঞ।",
  },
  {
    name: "ধনু",
    en: "Sagittarius",
    emoji: "♐",
    element: "অগ্নি (Fire)",
    planet: "বৃহস্পতি (Jupiter)",
    color: "বেগুনী, গাঢ় নীল",
    number: "3, 7, 9",
    startM: 11,
    startD: 22,
    endM: 12,
    endD: 21,
    trait: "আশাবাদী, স্বাধীনতা-প্রেমী এবং দার্শনিক।",
  },
];

function getZodiacData(month, day) {
  for (const z of ZODIACS) {
    if (
      (month === z.startM && day >= z.startD) ||
      (month === z.endM && day <= z.endD)
    ) {
      return z;
    }
  }
  return null;
}

function formatBanglaDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()} ${BANGLA_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getElementKey(elementStr) {
  return elementStr.split(" ")[0];
}

export default function ZodiacCalculator() {
  const [tab, setTab] = useState("single");
  const [dob, setDob] = useState("");
  const [person1Dob, setPerson1Dob] = useState("");
  const [person2Dob, setPerson2Dob] = useState("");

  const singleZodiac = useMemo(() => {
    if (!dob) return null;
    const d = new Date(dob + "T00:00:00");
    if (isNaN(d.getTime())) return { error: "সঠিক তারিখ দিন।" };

    const zodiac = getZodiacData(d.getMonth() + 1, d.getDate());
    if (!zodiac) return { error: "সঠিক রাশি খুঁজে পাওয়া যায়নি।" };

    return {
      ...zodiac,
      formattedDate: formatBanglaDate(dob),
    };
  }, [dob]);

  const compatibility = useMemo(() => {
    if (!person1Dob || !person2Dob) return null;

    const d1 = new Date(person1Dob + "T00:00:00");
    const d2 = new Date(person2Dob + "T00:00:00");
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const z1 = getZodiacData(d1.getMonth() + 1, d1.getDate());
    const z2 = getZodiacData(d2.getMonth() + 1, d2.getDate());
    if (!z1 || !z2) return null;

    const el1 = getElementKey(z1.element);
    const el2 = getElementKey(z2.element);

    let score = 50;
    let message = "মাঝারি মিল";
    let status = "medium";

    if (el1 === el2) {
      score = 95;
      message =
        "চমৎকার মিল! আপনাদের স্বভাব ও চিন্তাধারায় দারুণ সামঞ্জস্য রয়েছে।";
      status = "excellent";
    } else if (
      (el1 === "অগ্নি" && el2 === "বায়ু") ||
      (el2 === "অগ্নি" && el1 === "বায়ু") ||
      (el1 === "পৃথিবী" && el2 === "জল") ||
      (el2 === "পৃথিবী" && el1 === "জল")
    ) {
      score = 85;
      message =
        "খুব ভালো মিল! আপনারা একে অপরকে দারুণভাবে পরিপূরক করেন।";
      status = "good";
    } else if (
      (el1 === "অগ্নি" && el2 === "জল") ||
      (el2 === "অগ্নি" && el1 === "জল") ||
      (el1 === "পৃথিবী" && el2 === "বায়ু") ||
      (el2 === "পৃথিবী" && el1 === "বায়ু")
    ) {
      score = 45;
      message =
        "পার্থক্য রয়েছে! আপনাদের সম্পর্ক টিকিয়ে রাখতে ভালো বোঝাপড়া জরুরি।";
      status = "poor";
    } else {
      score = 65;
      message =
        "মোটামুটি মিল। আপনাদের সম্পর্কে নতুনত্ব ও বৈচিত্র্য থাকতে পারে।";
      status = "average";
    }

    return { p1: z1, p2: z2, score, message, status };
  }, [person1Dob, person2Dob]);

  const statusStyles = {
    excellent: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    good: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
    average: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
    medium: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
    poor: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400",
  };

  return (
    <section className="w-full space-y-8">
      {/* Header */}
      <header className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          স্মার্ট রাশিফল ক্যালকুলেটর
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          জন্মতারিখ দিয়ে আপনার সঠিক রাশি এবং দুইজনের রাশির মিল নিখুঁতভাবে হিসেব
          করুন
        </p>
      </header>

      {/* Tabs */}
      <div className="flex rounded-xl bg-zinc-400/10 p-1">
        <button
          onClick={() => setTab("single")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
            tab === "single"
              ? "bg-znic-400/25"
              : "hover:bg-zinc-400/15"
          }`}
        >
          একক রাশি
        </button>
        <button
          onClick={() => setTab("compatibility")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
            tab === "compatibility"
              ? "bg-znic-400/25"
              : "hover:bg-zinc-400/15"
          }`}
        >
          রাশির মিল
        </button>
      </div>

      {/* ========== SINGLE ========== */}
      {tab === "single" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-zinc-400/10 p-4 sm:p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">
                আপনার জন্মতারিখ দিন
              </label>
              <input
                type="date"
                value={dob}
                max={todayISO()}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl bg-zinc-400/10 px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <button
              onClick={() => setDob("")}
              className="px-4 py-2 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/20 text-sm transition"
            >
              রিসেট করুন
            </button>
          </div>

          {singleZodiac && (
            <>
              {singleZodiac.error ? (
                <div className="rounded-2xl bg-rose-500/10 p-4 text-center text-rose-600 dark:text-rose-400">
                  {singleZodiac.error}
                </div>
              ) : (
                <div className="rounded-2xl bg-zinc-400/10 p-5 space-y-5">
                  {/* Main Display */}
                  <div className="text-center space-y-2">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      আপনার রাশিফল
                    </p>
                    <div className="text-6xl">{singleZodiac.emoji}</div>
                    <h3 className="text-2xl font-bold">{singleZodiac.name}</h3>
                    <p className="text-sm opacity-70">{singleZodiac.en}</p>
                    <p className="text-xs text-zinc-500">
                      জন্মতারিখ: {singleZodiac.formattedDate}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-400/20">
                    <div className="p-3 rounded-xl bg-zinc-400/10 text-center">
                      <div className="text-xs text-zinc-500">উপাদান</div>
                      <div className="text-sm font-bold mt-1">
                        {singleZodiac.element}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-400/10 text-center">
                      <div className="text-xs text-zinc-500">অধিপতি গ্রহ</div>
                      <div className="text-sm font-bold mt-1">
                        {singleZodiac.planet}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-400/10 text-center">
                      <div className="text-xs text-zinc-500">শুভ রং</div>
                      <div className="text-sm font-bold mt-1">
                        {singleZodiac.color}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-400/10 text-center">
                      <div className="text-xs text-zinc-500">শুভ সংখ্যা</div>
                      <div className="text-sm font-bold mt-1">
                        {singleZodiac.number}
                      </div>
                    </div>
                  </div>

                  {/* Trait */}
                  <div className="p-4 rounded-xl bg-zinc-400/10 text-center">
                    <div className="text-xs text-zinc-500 mb-2">
                      ব্যক্তিত্ব ও বৈশিষ্ট্য
                    </div>
                    <p className="text-sm leading-relaxed">
                      “{singleZodiac.trait}”
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ========== COMPATIBILITY ========== */}
      {tab === "compatibility" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-zinc-400/10 p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  প্রথম ব্যক্তির জন্মতারিখ
                </label>
                <input
                  type="date"
                  value={person1Dob}
                  max={todayISO()}
                  onChange={(e) => setPerson1Dob(e.target.value)}
                  className="w-full rounded-xl bg-zinc-400/10 px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  দ্বিতীয় ব্যক্তির জন্মতারিখ
                </label>
                <input
                  type="date"
                  value={person2Dob}
                  max={todayISO()}
                  onChange={(e) => setPerson2Dob(e.target.value)}
                  className="w-full rounded-xl bg-zinc-400/10 px-3 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setPerson1Dob("");
                setPerson2Dob("");
              }}
              className="px-4 py-2 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/20 text-sm transition"
            >
              রিসেট করুন
            </button>
          </div>

          {compatibility && (
            <div className="rounded-2xl bg-zinc-400/10 p-5 space-y-5">
              {/* Two signs */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-xl bg-zinc-400/10">
                  <div className="text-4xl mb-2">{compatibility.p1.emoji}</div>
                  <div className="font-bold">{compatibility.p1.name}</div>
                  <div className="text-xs opacity-60">{compatibility.p1.en}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {compatibility.p1.element}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-400/10">
                  <div className="text-4xl mb-2">{compatibility.p2.emoji}</div>
                  <div className="font-bold">{compatibility.p2.name}</div>
                  <div className="text-xs opacity-60">{compatibility.p2.en}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {compatibility.p2.element}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div
                className={`p-4 rounded-xl border text-center ${statusStyles[compatibility.status]}`}
              >
                <div className="text-xs mb-1">মিল স্কোর</div>
                <div className="text-3xl font-bold">{compatibility.score}%</div>
                <p className="mt-3 text-sm leading-relaxed">
                  {compatibility.message}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEO Content */}
      <section className="space-y-6 pt-8 border-t border-zinc-400/20">
        <div className="space-y-3">
          <h2 className="text-xl font-bold">
            স্মার্ট রাশিফল ক্যালকুলেটর কীভাবে ব্যবহার করবেন?
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            আমাদের স্মার্ট রাশিফল ক্যালকুলেটর দিয়ে আপনি খুব সহজে এবং নিখুঁতভাবে
            আপনার বা আপনার প্রিয়জনের রাশি (Zodiac Sign) জানতে পারবেন। পাশ্চাত্য
            জ্যোতিষশাস্ত্র অনুযায়ী আপনার জন্মতারিখ দিলেই আপনার রাশি, বৈশিষ্ট্য,
            শুভ রং ও শুভ সংখ্যা স্বয়ংক্রিয়ভাবে চলে আসবে।
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">একক রাশি হিসেবের সুবিধা</h3>
          <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
            <li>জন্মতারিখ থেকে ১০০% সঠিক রাশি নির্ণয় (মেষ থেকে মীন)</li>
            <li>
              আপনার রাশির উপাদান (Fire, Water, Earth, Air) এবং অধিপতি গ্রহ
              সম্পর্কে ধারণা
            </li>
            <li>আপনার ব্যক্তিত্বের মূল বৈশিষ্ট্য ও স্বভাব</li>
            <li>আপনার জন্য ভাগ্যবান রং এবং শুভ সংখ্যা এক নজরে</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            রাশির মিল বা জোটক বিচার
          </h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            “রাশির মিল” ট্যাবে গিয়ে আপনি আপনার এবং আপনার পার্টনারের জন্মতারিখ
            দিলে, আমাদের অ্যালগরিদম আপনাদের রাশির উপাদানের উপর ভিত্তি করে একটি
            নিখুঁত স্কোর প্রদান করবে। এর মাধ্যমে বুঝতে পারবেন আপনাদের চিন্তাধারা
            এবং স্বভাবের মধ্যে কতটা মিল বা অমিল রয়েছে।
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">কেন এই টুলটি ব্যবহার করবেন?</h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            অনেকেই নিজের সঠিক রাশি নিয়ে বিভ্রান্তিতে থাকেন। এই টুলটি স্ট্রিক্ট
            ডেট রেঞ্জিং লজিক ব্যবহার করে তৈরি, তাই এখানে ভুল হওয়ার কোনো সুযোগ
            নেই। সম্পূর্ণ ফ্রি এবং আপনার কোনো ব্যক্তিগত ডেটা সংরক্ষণ করে না।
          </p>
        </div>
      </section>
    </section>
  );
}