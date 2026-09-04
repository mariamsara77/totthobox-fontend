"use client";

import { useState, useMemo } from "react";

const BANGLA_DAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

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

function formatBanglaDate(date) {
  if (!date || isNaN(date.getTime())) return "";
  return `${date.getDate()} ${BANGLA_MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function getDiff(start, end) {
  if (!start || !end || start > end) return null;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
  const totalMonths = years * 12 + months;

  return { years, months, days, totalDays, totalWeeks, totalHours, totalMonths };
}

function getNextBirthday(dob, fromDate) {
  const next = new Date(fromDate.getFullYear(), dob.getMonth(), dob.getDate());
  if (next < fromDate || (next.getTime() === fromDate.getTime() && fromDate.getHours() > 0)) {
    // if already passed this year
    if (next < fromDate) {
      next.setFullYear(next.getFullYear() + 1);
    }
  }
  // handle if today is birthday
  if (
    next.getFullYear() === fromDate.getFullYear() &&
    next.getMonth() === fromDate.getMonth() &&
    next.getDate() === fromDate.getDate()
  ) {
    return { days: 0, date: next };
  }
  if (next <= fromDate) {
    next.setFullYear(fromDate.getFullYear() + 1);
  }
  const days = Math.ceil((next.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  return { days, date: next };
}

function getPrevBirthday(dob, fromDate) {
  const prev = new Date(fromDate.getFullYear(), dob.getMonth(), dob.getDate());
  if (prev > fromDate || (prev.getTime() === fromDate.getTime())) {
    prev.setFullYear(prev.getFullYear() - 1);
  }
  const days = Math.floor((fromDate.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
  return { days, date: prev };
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function AgeCalculator() {
  const [tab, setTab] = useState("single");

  // Single
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(todayISO());

  // Difference
  const [person1Dob, setPerson1Dob] = useState("");
  const [person2Dob, setPerson2Dob] = useState("");

  const singleAge = useMemo(() => {
    const start = parseDate(dob);
    const end = parseDate(targetDate || todayISO());
    if (!start || !end) return null;

    if (start > end) {
      return { error: "জন্মতারিখ নির্দিষ্ট তারিখের চেয়ে বড় হতে পারবে না।" };
    }

    const diff = getDiff(start, end);
    if (!diff) return null;

    const nextBday = getNextBirthday(start, end);
    const prevBday = getPrevBirthday(start, end);
    const isToday = targetDate === todayISO();

    return {
      ...diff,
      nextBirthdayDays: nextBday.days,
      nextBirthdayDate: formatBanglaDate(nextBday.date),
      prevBirthdayDays: prevBday.days,
      dayOfWeek: BANGLA_DAYS[start.getDay()],
      birthDateFormatted: formatBanglaDate(start),
      targetDateFormatted: formatBanglaDate(end),
      isToday,
    };
  }, [dob, targetDate]);

  const ageDifference = useMemo(() => {
    const p1 = parseDate(person1Dob);
    const p2 = parseDate(person2Dob);
    if (!p1 || !p2) return null;

    if (p1.getTime() === p2.getTime()) {
      return { status: "same", message: "দুইজনের বয়স একদম সমান!" };
    }

    const older = p1 < p2 ? "প্রথম ব্যক্তি" : "দ্বিতীয় ব্যক্তি";
    const younger = p1 < p2 ? "দ্বিতীয় ব্যক্তি" : "প্রথম ব্যক্তি";
    const earlier = p1 < p2 ? p1 : p2;
    const later = p1 < p2 ? p2 : p1;
    const diff = getDiff(earlier, later);

    return {
      status: "different",
      older,
      younger,
      ...diff,
      person1Formatted: formatBanglaDate(p1),
      person2Formatted: formatBanglaDate(p2),
    };
  }, [person1Dob, person2Dob]);

  const resetSingle = () => {
    setDob("");
    setTargetDate(todayISO());
  };

  const resetDifference = () => {
    setPerson1Dob("");
    setPerson2Dob("");
  };

  return (
    <section className="w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl   tracking-tight ">
            স্মার্ট এজ ক্যালকুলেটর
          </h1>
          <h2 className="text-lg ">
            সঠিক বয়স, পরবর্তী জন্মদিন এবং দুইজনের বয়সের পার্থক্য নিখুঁতভাবে হিসেব করুন
          </h2>
        </div>

       {/* Tabs */}
<div className="flex border-b border-zinc-400/25">
  <button
    onClick={() => setTab("single")}
    className={`flex-1 py-2 text-center  font-medium transition-all border-b-2 ${
      tab === "single"
        ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
        : "border-transparent"
    }`}
  >
    একক বয়স হিসেব
  </button>
  <button
    onClick={() => setTab("difference")}
    className={`flex-1 py-2 text-center  font-medium transition-all border-b-2 ${
      tab === "difference"
        ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
        : "border-transparent"
    }`}
  >
    বয়সের পার্থক্য
  </button>
</div>

        {/* ========== SINGLE TAB ========== */}
        {tab === "single" && (
          <div className="space-y-4">
            <div className="space-y-4 rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 sm:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">
                    জন্মতারিখ
                  </label>
                  <input
                    type="date"
                    value={dob}
                    max={todayISO()}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-xl bg-zinc-100 p-2.5 outline-none dark:bg-zinc-800"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="opacity-50">
                    কোন তারিখ পর্যন্ত হিসেব করবেন?
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-400/10 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={resetSingle}
                className="bg-zinc-400/10 hover:bg-zinc-400/25 rounded-lg px-4 py-2"
              >
                রিসেট করুন
              </button>
            </div>

            {singleAge && (
              <>
                {singleAge.error ? (
                  <div className="rounded-xl bg-zinc-400/10 p-4 text-center">
                    {singleAge.error}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl space-y-4 bg-zinc-400/10">
                    {/* Main Age */}
                    <div className="text-center">
                      <p className="uppercase tracking-wider  ">
                        {singleAge.isToday ? "আপনার বর্তমান বয়স" : "নির্দিষ্ট তারিখে আপনার বয়স"}
                      </p>
                      <div className="flex flex-wrap justify-center items-baseline gap-x-2 gap-y-1 mt-3">
                        <span className="text-3xl font-bold">
                          {singleAge.years}
                        </span>
                        <span className="opacity-50">
                          বছর
                        </span>
                        <span className="text-3xl font-bold">
                          {singleAge.months}
                        </span>
                        <span className="opacity-50">
                          মাস
                        </span>
                        <span className="text-3xl font-bold">
                          {singleAge.days}
                        </span>
                        <span className="opacity-50">
                          দিন
                        </span>
                      </div>
                      <p className="mt-2  ">
                        {singleAge.birthDateFormatted} → {singleAge.targetDateFormatted}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-400/25">
                      <div className="p-3 bg-zinc-400/10 rounded-xl text-center ">
                        <div className=" text-zinc-400">মোট দিন</div>
                        <div className="text-base sm:text-lg font-bold mt-1">
                          {singleAge.totalDays.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-400/10 rounded-xl text-center ">
                        <div className=" text-zinc-400">মোট সপ্তাহ</div>
                        <div className="text-base sm:text-lg font-bold mt-1">
                          {singleAge.totalWeeks.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-400/10 rounded-xl text-center ">
                        <div className=" text-zinc-400">মোট মাস</div>
                        <div className="text-base sm:text-lg font-bold mt-1">
                          {singleAge.totalMonths.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-400/10 rounded-xl text-center ">
                        <div className=" text-zinc-400">মোট ঘণ্টা</div>
                        <div className="text-base sm:text-lg font-bold mt-1">
                          {singleAge.totalHours.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-400/10 rounded-xl text-center ">
                        <div className=" text-zinc-400">জন্মদিনের দিন</div>
                        <div className="text-base sm:text-lg font-bold mt-1">{singleAge.dayOfWeek}</div>
                      </div>
                      <div className="p-3 bg-zinc-400/10 rounded-xl text-center ">
                        <div className=" text-zinc-400">পূর্ববর্তী জন্মদিন</div>
                        <div className="text-base sm:text-lg font-bold mt-1 text-amber-600 dark:text-amber-400">
                          {singleAge.prevBirthdayDays} দিন আগে
                        </div>
                      </div>
                    </div>

                    {/* Next Birthday */}
                    <div className="p-4 rounded-xl bg-zinc-400/10/80 border border-emerald-200 dark:border-emerald-800 text-center">
                      <div className="  text-emerald-800 text-zinc-300">
                        পরবর্তী জন্মদিন
                      </div>
                      <div className="mt-1 text-xl font-bold ">
                        {singleAge.nextBirthdayDays === 0
                          ? "আজই আপনার জন্মদিন! 🎉"
                          : `${singleAge.nextBirthdayDays} দিন পর`}
                      </div>
                      {singleAge.nextBirthdayDays > 0 && (
                        <div className="  mt-0.5">
                          {singleAge.nextBirthdayDate}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ========== DIFFERENCE TAB ========== */}
        {tab === "difference" && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-zinc-400/10 p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="opacity-50">
                    প্রথম ব্যক্তির জন্মতারিখ
                  </label>
                  <input
                    type="date"
                    value={person1Dob}
                    max={todayISO()}
                    onChange={(e) => setPerson1Dob(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-400/10 border-none outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="opacity-50">
                    দ্বিতীয় ব্যক্তির জন্মতারিখ
                  </label>
                  <input
                    type="date"
                    value={person2Dob}
                    max={todayISO()}
                    onChange={(e) => setPerson2Dob(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-400/10 border-none outline-none"
                  />
                </div>
              </div>
              <button
                onClick={resetDifference}
                className="bg-zinc-400/10 rounded-lg py-2 px-4 hover:bg-zinc-400/25"
              >
                রিসেট করুন
              </button>
            </div>

            {ageDifference && (
              <div className="p-4  rounded-2xl text-center space-y-5 bg-zinc-400/10">
                {ageDifference.status === "same" ? (
                  <div className="inline-flex px-4 py-2 rounded-full bg-zinc-400/10   ">
                    {ageDifference.message}
                  </div>
                ) : (
                  <>
                    <div className="inline-flex px-4 py-2 rounded-full bg-zinc-400/10 text-xl fotn-bold">
                      {ageDifference.older} বড়
                    </div>

                    <div>
                      <p className="uppercase tracking-wider  ">
                        বয়সের পার্থক্য
                      </p>
                      <div className="flex flex-wrap justify-center items-baseline gap-x-2 gap-y-1 mt-2">
                        <span className="text-2xl   ">
                          {ageDifference.years}
                        </span>
                        <span className="  ">বছর</span>
                        <span className="text-2xl   ">
                          {ageDifference.months}
                        </span>
                        <span className="  ">মাস</span>
                        <span className="text-2xl   ">
                          {ageDifference.days}
                        </span>
                        <span className="  ">দিন</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="p-2.5 bg-zinc-400/10 rounded-xl text-center">
                        <div className=" text-zinc-400">মোট দিন</div>
                        <div className="text-base font-bold mt-1">
                          {ageDifference.totalDays.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="p-2.5 bg-zinc-400/10 rounded-xl text-center">
                        <div className=" text-zinc-400">মোট সপ্তাহ</div>
                        <div className="text-base font-bold mt-1">
                          {ageDifference.totalWeeks.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="p-2.5 bg-zinc-400/10 rounded-xl text-center">
                        <div className=" text-zinc-400">মোট মাস</div>
                        <div className="text-base font-bold mt-1">
                          {ageDifference.totalMonths.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <p className=" ">
                      {ageDifference.person1Formatted} ও {ageDifference.person2Formatted} এর মধ্যে
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* SEO / Instructions */}
        <div className="mt-16 pt-10 border-t border-zinc-400/25 space-y-4  ">
          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              স্মার্ট এজ ক্যালকুলেটর কীভাবে ব্যবহার করবেন?
            </h3>
            <p className="mb-4 leading-relaxed">
              আমাদের স্মার্ট এজ ক্যালকুলেটর দিয়ে আপনি খুব সহজে এবং নিখুঁতভাবে যেকোনো ব্যক্তির বয়স হিসাব করতে পারবেন।
              শুধু জন্মতারিখ দিলেই বছর, মাস ও দিন অনুযায়ী সম্পূর্ণ বয়স দেখাবে। এছাড়া আপনি চাইলে ভবিষ্যতের বা অতীতের কোনো
              নির্দিষ্ট তারিখ পর্যন্ত বয়সও বের করতে পারবেন।
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-50 text-zinc-200 mb-2">
              একক বয়স হিসেবের সুবিধা
            </h3>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>জন্মতারিখ থেকে আজকের বা যেকোনো তারিখ পর্যন্ত সঠিক বয়স (বছর-মাস-দিন)</li>
              <li>মোট কত দিন, সপ্তাহ, মাস ও ঘণ্টা পার হয়েছে তা এক নজরে</li>
              <li>পরবর্তী জন্মদিন কত দিন পরে এবং কোন তারিখে</li>
              <li>পূর্ববর্তী জন্মদিন কত দিন আগে পার হয়েছে</li>
              <li>কোন দিনে জন্ম হয়েছিল (সোমবার, মঙ্গলবার ইত্যাদি)</li>
              <li>রিসেট বাটন দিয়ে সহজে নতুন হিসাব শুরু করা</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-50 text-zinc-200 mb-2">
              বয়সের পার্থক্য হিসেব
            </h3>
            <p className="leading-relaxed">
              দুইজনের জন্মতারিখ দিয়ে কে কত বছর-মাস-দিন বড় বা ছোট তা মুহূর্তেই জানতে পারবেন। এছাড়া মোট দিন, সপ্তাহ ও
              মাসের পার্থক্যও দেখাবে। বন্ধু, ভাইবোন বা পরিবারের সদস্যদের মধ্যে বয়সের তুলনা করতে এটি খুবই উপযোগী।
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-50 text-zinc-200 mb-2">
              কেন এই ক্যালকুলেটর ব্যবহার করবেন?
            </h3>
            <p className="leading-relaxed">
              অনেক সময় সরকারি ফর্ম, চাকরির আবেদন, স্কুল-কলেজের ভর্তি বা ব্যক্তিগত প্রয়োজনে সঠিক বয়স জানার প্রয়োজন হয়।
              এই টুলটি নিখুঁতভাবে তারিখের পার্থক্য গণনা করে, তাই ভুল হওয়ার সম্ভাবনা নেই। সম্পূর্ণ ফ্রি, কোনো
              রেজিস্ট্রেশন লাগে না এবং আপনার ডেটা কোথাও সংরক্ষণ করা হয় না। বাংলা ভাষায় ইন্টারফেস থাকায় যেকোনো বয়সের
              ব্যবহারকারী সহজেই ব্যবহার করতে পারবেন।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
