"use client";

import { useState } from "react";

// স্কয়ার মিটার ভিত্তিক কনভার্শন রেট
const areaConversionRates = {
  square_meter: 1,
  square_kilometer: 0.000001,
  square_foot: 10.7639,
  square_yard: 1.19599,
  acre: 0.000247105,
  hectare: 0.0001,
  square_inch: 1550.0031,
};

const unitOptions = [
  { value: "square_meter", label: "Square Meter (m²)" },
  { value: "square_kilometer", label: "Square Kilometer (km²)" },
  { value: "square_foot", label: "Square Foot (ft²)" },
  { value: "square_yard", label: "Square Yard (yd²)" },
  { value: "acre", label: "Acre" },
  { value: "hectare", label: "Hectare (ha)" },
  { value: "square_inch", label: "Square Inch (in²)" },
];

export default function AreaConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState("square_meter");
  const [outputUnit, setOutputUnit] = useState("square_foot");

  const calculateOutput = () => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) return "";

    const inputRate = areaConversionRates[inputUnit];
    const outputRate = areaConversionRates[outputUnit];

    if (!inputRate || !outputRate) return 0;

    const valueInSqm = numericValue / inputRate;
    const result = valueInSqm * outputRate;

    return parseFloat(result.toFixed(6));
  };

  const outputValue = calculateOutput();

  const swapAreaUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  return (
    <section className="w-full">
      <div className="space-y-8">
        {/* হেডার */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Area Converter
          </h1>
          <h2 className="text-lg text-zinc-600 dark:text-zinc-400">
            ক্ষেত্রফল রূপান্তরকারী — Square Meter, Square Foot, Acre, Hectare
          </h2>
        </div>

        <div className="space-y-6 w-full">
          {/* Input Section (From) */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              যে ইউনিট থেকে (From)
            </label>
            <div className="flex w-full rounded-lg overflow-hidden">
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="w-full sm:w-1/2 p-3 bg-zinc-100 dark:bg-zinc-700 border-none cursor-pointer outline-none"
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
                className="w-full sm:w-1/2 p-3 bg-zinc-400/10 outline-none"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="w-full flex justify-center py-2">
            <button
              onClick={swapAreaUnits}
              title="ইউনিট অদলবদল করুন"
              className="p-3 rounded-full hover:bg-zinc-400/10"
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
            <div className="flex w-full rounded-lg overflow-hidden">
              <select
                value={outputUnit}
                onChange={(e) => setOutputUnit(e.target.value)}
                className="w-full sm:w-1/2 p-3 bg-zinc-100 dark:bg-zinc-700 border-none cursor-pointer outline-none"
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
                className="w-full sm:w-1/2 p-3 bg-zinc-400/10 outline-none"
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
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-3">গুরুত্বপূর্ণ কনভার্শন</h3>
            <ul className="list-disc list-inside space-y-2 ml-1">
              <li>1 Square Meter ≈ 10.7639 Square Foot</li>
              <li>1 Acre = 4046.86 Square Meter ≈ 43560 Square Foot</li>
              <li>1 Hectare = 10000 Square Meter = 2.471 Acre</li>
              <li>1 Square Kilometer = 100 Hectare</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
