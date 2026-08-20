"use client";

import { useState } from "react";

// বাংলাদেশের আদর্শ স্ট্যান্ডার্ড অনুযায়ী বেস ইউনিট (Square Feet / বর্গফুট) ভিত্তিক সঠিক কনভার্শন রেট
const landAreaConversionRates = {
  square_feet: 1,
  shotangsho: 435.6,       // ১ শতাংশ = ৪৩৫.৬০ বর্গফুট
  katha: 720,              // ১ কাঠা = ৭২০ বর্গফুট
  bigha: 14400,            // ১ বিঘা = ২০ কাঠা = ১৪,৪০০ বর্গফুট (৩৩ শতাংশ)
  acre: 43560,             // ১ একর = ১০০ শতাংশ = ৪৩,৫৬০ বর্গফুট
  square_meter: 10.7639,   // ১ বর্গমিটার = ১০.৭৬৩৯ বর্গফুট
};

const unitOptions = [
  { value: "shotangsho", label: "শতাংশ (Shotangsho)" },
  { value: "katha", label: "কাঠা (Katha)" },
  { value: "bigha", label: "বিঘা (Bigha)" },
  { value: "square_feet", label: "Square Feet (sq ft)" },
  { value: "square_meter", label: "Square Meter (m²)" },
  { value: "acre", label: "Acre" },
];

export default function LandAreaConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState("katha");
  const [outputUnit, setOutputUnit] = useState("shotangsho");

  const calculateOutput = () => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue) || numericValue < 0) return "";

    const inputRate = landAreaConversionRates[inputUnit];
    const outputRate = landAreaConversionRates[outputUnit];

    if (!inputRate || !outputRate) return "";

    // সঠিক নিয়মে বেস (বর্গফুট) হয়ে কনভার্শন করা
    const valueInBase = numericValue * inputRate;
    const result = valueInBase / outputRate;

    return parseFloat(result.toFixed(6));
  };

  const outputValue = calculateOutput();

  const swapLandUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  return (
    <section className="w-full">
      <div className="space-y-8">
        {/* হেডার */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Land Area Converter
          </h1>
          <h2 className="text-lg text-zinc-600 dark:text-zinc-400">
            জমি পরিমাপের ক্যালকুলেটর — শতাংশ, কাঠা, বিঘা
          </h2>
        </div>

        <div className="space-y-6 w-full">
          {/* Input Section (From) */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              যে ইউনিট থেকে (From)
            </label>
            <div className="flex w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="w-full sm:w-1/2 p-3 bg-zinc-100 dark:bg-zinc-700 border-none cursor-pointer outline-none text-zinc-900 dark:text-zinc-100"
              >
                {unitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <div className="hidden sm:block w-px bg-zinc-300 dark:bg-zinc-700"></div>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="মান লিখুন"
                className="w-full sm:w-1/2 p-3 bg-zinc-400/10 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="w-full flex justify-center py-2">
            <button
              onClick={swapLandUnits}
              title="ইউনিট অদলবদল করুন"
              className="p-3 rounded-full hover:bg-zinc-400/10 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </button>
          </div>

          {/* Output Section (To) */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              যে ইউনিটে রূপান্তর (To)
            </label>
            <div className="flex w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <select
                value={outputUnit}
                onChange={(e) => setOutputUnit(e.target.value)}
                className="w-full sm:w-1/2 p-3 bg-zinc-100 dark:bg-zinc-700 border-none cursor-pointer outline-none text-zinc-900 dark:text-zinc-100"
              >
                {unitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <div className="hidden sm:block w-px bg-zinc-300 dark:bg-zinc-700"></div>
              <input
                type="text"
                value={outputValue}
                readOnly
                placeholder="ফলাফল"
                className="w-full sm:w-1/2 p-3 bg-zinc-400/10 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* নির্দেশিকা এবং কনভার্শন */}
        <div className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-6 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              কীভাবে ব্যবহার করবেন?
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-1">
              <li>উপরের বক্সে যে ইউনিট থেকে কনভার্ট করতে চান সেটি সিলেক্ট করুন।</li>
              <li>মান লিখুন — ফলাফল স্বয়ংক্রিয়ভাবে দেখাবে।</li>
              <li>মাঝের <strong>↑↓</strong> বাটনে ক্লিক করে ইউনিট অদলবদল করতে পারবেন।</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-3">গুরুত্বপূর্ণ কনভার্শন (বাংলাদেশ স্ট্যান্ডার্ড)</h3>
            <ul className="list-disc list-inside space-y-2 ml-1">
              <li>1 কাঠা = 720 Square Feet ≈ 1.65 শতাংশ</li>
              <li>1 বিঘা = 20 কাঠা = 14,400 Square Feet (33 শতাংশ)</li>
              <li>1 শতাংশ (Decimal) = 435.6 Square Feet</li>
              <li>1 Acre ≈ 3.025 বিঘা = 100 শতাংশ</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}