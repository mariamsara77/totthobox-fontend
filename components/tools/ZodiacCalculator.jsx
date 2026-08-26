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
    if ((month === z.startM && day >= z.startD) || (month === z.endM && day <= z.endD)) {
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
  return elementStr.split(" ")[0]; // অগ্নি, জল, পৃথিবী, বায়ু
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
      message = "চমৎকার মিল! আপনাদের স্বভাব ও চিন্তাধারায় দারুণ সামঞ্জস্য রয়েছে।";
      status = "excellent";
    } else if (
      (el1 === "অগ্নি" && el2 === "বায়ু") ||
      (el2 === "অগ্নি" && el1 === "বায়ু") ||
      (el1 === "পৃথিবী" && el2 === "জল") ||
      (el2 === "পৃথিবী" && el1 === "জল")
    ) {
      score = 85;
      message = "খুব ভালো মিল! আপনারা একে অপরকে দারুণভাবে পরিপূরক করেন।";
      status = "good";
    } else if (
      (el1 === "অগ্নি" && el2 === "জল") ||
      (el2 === "অগ্নি" && el1 === "জল") ||
      (el1 === "পৃথিবী" && el2 === "বায়ু") ||
      (el2 === "পৃথিবী" && el1 === "বায়ু")
    ) {
      score = 45;
      message = "পার্থক্য রয়েছে! আপনাদের সম্পর্ক টিকিয়ে রাখতে ভালো বোঝাপড়া জরুরি।";
      status = "poor";
    } else {
      score = 65;
      message = "মোটামুটি মিল। আপনাদের সম্পর্কে নতুনত্ব ও বৈচিত্র্য থাকতে পারে।";
      status = "average";
    }

    return { p1: z1, p2: z2, score, message, status };
  }, [person1Dob, person2Dob]);

  const statusColor = {
    excellent: " bg-zinc-400/10 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    good: "opacity-50 dark:opacity-50 bg-zinc-400/25 dark:bg-zinc-400/25 border-zinc-400/25 dark:border-zinc-400/25",
    average: "opacity-50 dark:opacity-50 bg-zinc-400/25 dark:bg-zinc-400/25 border-zinc-400/25 dark:border-zinc-400/25",
    medium: "opacity-50 dark:opacity-50 bg-zinc-400/25 dark:bg-zinc-400/25 border-zinc-400/25 dark:border-zinc-400/25",
    poor: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
  };

  return (
    <section className="w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl   tracking-tight text-zinc-50 dark:text-white">
            স্মার্ট রাশিফল ক্যালকুলেটর
          </h1>
          <h2 className="text-lg ">
            জন্মতারিখ দিয়ে আপনার সঠিক রাশি এবং দুইজনের রাশির মিল নিখুঁতভাবে হিসেব করুন
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-zinc-400/25 dark:border-zinc-400/25">
          <button
            onClick={() => setTab("single")}
            className={`flex-1 py-2 text-sm   ${
              tab === "single"
                ? "bg-zinc-400/25 text-white"
                : "bg-zinc-400/10  hover:bg-zinc-400/10 hover:bg-zinc-400/25"
            }`}
          >
            একক রাশি
          </button>
          <button
            onClick={() => setTab("compatibility")}
            className={`flex-1 py-2 text-sm   ${
              tab === "compatibility"
                ? "bg-zinc-400/25 text-white"
                : "bg-zinc-400/10  hover:bg-zinc-400/10 hover:bg-zinc-400/25"
            }`}
          >
            রাশির মিল
          </button>
        </div>

        {/* ========== SINGLE ========== */}
        {tab === "single" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 bg-zinc-400/10 p-4 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm  ">
                  আপনার জন্মতারিখ দিন
                </label>
                <input
                  type="date"
                  value={dob}
                  max={todayISO()}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2 rounded-xl bg-zinc-400/10 border-none outline-none"
                />
              </div>
              <button
                onClick={() => setDob("")}
                className="text-sm text-zinc-400 hover:text-zinc-200 dark:hover:text-zinc-300"
              >
                রিসেট করুন
              </button>
            </div>

            {singleZodiac && (
              <>
                {singleZodiac.error ? (
                  <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 px-4 py-2 text-center text-rose-600 dark:text-rose-400 ">
                    {singleZodiac.error}
                  </div>
                ) : (
                  <div className="p-4 sm:p-6  rounded-2xl space-y-4 border border-zinc-400/25">
                    {/* Main Display */}
                    <div className="text-center">
                      <p className="uppercase tracking-wider text-xs ">
                        আপনার রাশিফল
                      </p>
                      <div className="mt-4 mb-2 text-7xl">{singleZodiac.emoji}</div>
                      <h3 className="text-3xl   opacity-50 dark:opacity-50">
                        {singleZodiac.name}
                      </h3>
                      <p className="text-lg   mt-1">
                        {singleZodiac.en}
                      </p>
                      <p className="mt-3 text-sm ">
                        জন্মতারিখ: {singleZodiac.formattedDate}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-400/25">
                      <div className="p-3 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                        <div className="text-xs text-zinc-400">উপাদান (Element)</div>
                        <div className="text-base sm:text-lg font-bold mt-1 ">
                          {singleZodiac.element}
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                        <div className="text-xs text-zinc-400">অধিপতি গ্রহ</div>
                        <div className="text-base sm:text-lg font-bold mt-1 opacity-50 dark:opacity-50">
                          {singleZodiac.planet}
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                        <div className="text-xs text-zinc-400">শুভ রং</div>
                        <div className="text-sm font-bold mt-1 opacity-50 dark:opacity-50">
                          {singleZodiac.color}
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                        <div className="text-xs text-zinc-400">শুভ সংখ্যা</div>
                        <div className="text-base sm:text-lg font-bold mt-1 opacity-50 dark:opacity-50">
                          {singleZodiac.number}
                        </div>
                      </div>
                    </div>

                    {/* Trait */}
                    <div className="p-4 rounded-xl bg-zinc-400/25 dark:bg-zinc-400/25 border border-zinc-400/25 dark:border-zinc-400/25 text-center">
                      <div className="text-sm  opacity-50 dark:opacity-50 mb-2">
                        ব্যক্তিত্ব ও বৈশিষ্ট্য
                      </div>
                      <div className="text-base  opacity-50 dark:opacity-50 leading-relaxed">
                        &ldquo;{singleZodiac.trait}&rdquo;
                      </div>
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
            <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 bg-zinc-400/10 p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm  ">
                    প্রথম ব্যক্তির জন্মতারিখ
                  </label>
                  <input
                    type="date"
                    value={person1Dob}
                    max={todayISO()}
                    onChange={(e) => setPerson1Dob(e.target.value)}
                    className="w-full p-2 rounded-xl bg-zinc-400/10 border-none outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm  ">
                    দ্বিতীয় ব্যক্তির জন্মতারিখ
                  </label>
                  <input
                    type="date"
                    value={person2Dob}
                    max={todayISO()}
                    onChange={(e) => setPerson2Dob(e.target.value)}
                    className="w-full p-2 rounded-xl bg-zinc-400/10 border-none outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setPerson1Dob("");
                  setPerson2Dob("");
                }}
                className="text-sm text-zinc-400 hover:text-zinc-200 dark:hover:text-zinc-300"
              >
                রিসেট করুন
              </button>
            </div>

            {compatibility && (
              <div className="p-4 sm:p-6  rounded-2xl space-y-4 border border-zinc-400/25">
                {/* Two signs */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-zinc-400/10 bg-zinc-400/10 rounded-xl">
                    <div className="text-4xl mb-2">{compatibility.p1.emoji}</div>
                    <div className="font-bold opacity-50 dark:opacity-50">
                      {compatibility.p1.name}
                    </div>
                    <div className="text-xs text-zinc-400">{compatibility.p1.en}</div>
                    <div className="text-xs text-zinc-400 mt-1">{compatibility.p1.element}</div>
                  </div>
                  <div className="p-4 bg-zinc-400/10 bg-zinc-400/10 rounded-xl">
                    <div className="text-4xl mb-2">{compatibility.p2.emoji}</div>
                    <div className="font-bold opacity-50 dark:opacity-50">
                      {compatibility.p2.name}
                    </div>
                    <div className="text-xs text-zinc-400">{compatibility.p2.en}</div>
                    <div className="text-xs text-zinc-400 mt-1">{compatibility.p2.element}</div>
                  </div>
                </div>

                {/* Score */}
                <div
                  className={`p-4 rounded-xl border text-center ${statusColor[compatibility.status]}`}
                >
                  <div className="text-sm  mb-1">মিল স্কোর</div>
                  <div className="text-4xl ">{compatibility.score}%</div>
                  <p className="mt-3 text-sm leading-relaxed">{compatibility.message}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEO / Instructions */}
        <div className="mt-16 pt-10 border-t border-zinc-400/25 space-y-4 text-sm ">
          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              স্মার্ট রাশিফল ক্যালকুলেটর কীভাবে ব্যবহার করবেন?
            </h3>
            <p className="leading-relaxed">
              আমাদের স্মার্ট রাশিফল ক্যালকুলেটর দিয়ে আপনি খুব সহজে এবং নিখুঁতভাবে আপনার বা আপনার প্রিয়জনের রাশি
              (Zodiac Sign) জানতে পারবেন। পাশ্চাত্য জ্যোতিষশাস্ত্র (Western Astrology) অনুযায়ী আপনার জন্মতারিখ
              দিলেই আপনার রাশি, বৈশিষ্ট্য, শুভ রং ও শুভ সংখ্যা স্বয়ংক্রিয়ভাবে চলে আসবে।
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-50 text-zinc-200 mb-2">
              একক রাশি হিসেবের সুবিধা
            </h3>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>জন্মতারিখ থেকে ১০০% সঠিক রাশি নির্ণয় (মেষ থেকে মীন)।</li>
              <li>আপনার রাশির উপাদান (Fire, Water, Earth, Air) এবং অধিপতি গ্রহ সম্পর্কে ধারণা।</li>
              <li>আপনার ব্যক্তিত্বের মূল বৈশিষ্ট্য ও স্বভাব।</li>
              <li>আপনার জন্য ভাগ্যবান রং এবং শুভ সংখ্যা এক নজরে।</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-50 text-zinc-200 mb-2">
              রাশির মিল বা জোটক বিচার (Zodiac Compatibility)
            </h3>
            <p className="leading-relaxed">
              &ldquo;রাশির মিল&rdquo; ট্যাবে গিয়ে আপনি আপনার এবং আপনার পার্টনারের জন্মতারিখ দিলে, আমাদের অ্যালগরিদম
              আপনাদের রাশির উপাদানের (Elements) উপর ভিত্তি করে একটি নিখুঁত স্কোর প্রদান করবে। এর মাধ্যমে বুঝতে পারবেন
              আপনাদের চিন্তাধারা এবং স্বভাবের মধ্যে কতটা মিল বা অমিল রয়েছে। বন্ধুত্ব, প্রেম বা বৈবাহিক সম্পর্কের
              ক্ষেত্রে এটি একটি দারুণ গাইডলাইন হতে পারে।
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-50 text-zinc-200 mb-2">
              কেন এই টুলটি ব্যবহার করবেন?
            </h3>
            <p className="leading-relaxed">
              অনেকেই নিজের সঠিক রাশি নিয়ে বিভ্রান্তিতে থাকেন। এই টুলটি স্ট্রিক্ট ডেট রেঞ্জিং লজিক ব্যবহার করে তৈরি,
              তাই এখানে ভুল হওয়ার কোনো সুযোগ নেই। সম্পূর্ণ ফ্রি এবং আপনার কোনো ব্যক্তিগত ডেটা সংরক্ষণ করে না।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
