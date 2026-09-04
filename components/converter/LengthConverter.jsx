"use client";

import { useState } from "react";

// মিটার ভিত্তিক কনভার্শন রেট
const lengthConversionRates = {
  meter: 1,
  centimeter: 100,
  millimeter: 1000,
  kilometer: 0.001,
  mile: 0.000621371,
  yard: 1.09361,
  foot: 3.28084,
  inch: 39.3701,
};

const unitOptions = [
  { value: "meter", label: "Meter (m)" },
  { value: "centimeter", label: "Centimeter (cm)" },
  { value: "millimeter", label: "Millimeter (mm)" },
  { value: "kilometer", label: "Kilometer (km)" },
  { value: "mile", label: "Mile (mi)" },
  { value: "yard", label: "Yard (yd)" },
  { value: "foot", label: "Foot (ft)" },
  { value: "inch", label: "Inch (in)" },
];

export default function LengthConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState("meter");
  const [outputUnit, setOutputUnit] = useState("centimeter");

  // ইনপুট ভ্যালু এবং ইউনিটের উপর ভিত্তি করে অটোমেটিক ফলাফল হিসাব করা
  const calculateOutput = () => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) return "";

    const inputRate = lengthConversionRates[inputUnit];
    const outputRate = lengthConversionRates[outputUnit];

    if (!inputRate || !outputRate) return 0;

    const valueInMeters = numericValue / inputRate;
    const result = valueInMeters * outputRate;
    
    // ৬ দশমিক স্থান পর্যন্ত রাউন্ড করা
    return parseFloat(result.toFixed(6));
  };

  const outputValue = calculateOutput();

  // ইউনিট অদলবদল (Swap) করার ফাংশন
  const swapLengthUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  return (
    <section className="w-full">
      <div className="space-y-4">
        {/* হেডার */}
        <div className="space-y-2 text-center">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            দৈর্ঘ্য রূপান্তরকারী
          </h1>
          <h2 className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            মিটার, কিলোমিটার, মাইল, ফুট ও ইঞ্চি
          </h2>
        </div>

        <div className="space-y-4 rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 sm:p-5">
          
          {/* Input Section (From) */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">
              যে একক থেকে
            </label>
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="w-full appearance-none rounded-xl bg-zinc-100 p-2.5 outline-none dark:bg-zinc-800 sm:w-1/2"
              >
                {unitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              {/* <div className="hidden sm:block w-px bg-zinc-800"></div> */}
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="মান লিখুন"
                className="w-full rounded-xl bg-zinc-100 p-2.5 outline-none dark:bg-zinc-800 sm:w-1/2"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="w-full flex justify-center py-2">
            <button
              onClick={swapLengthUnits}
              title="ইউনিট অদলবদল করুন"
              className="rounded-xl p-3 transition-colors hover:bg-zinc-400/25"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </button>
          </div>

          {/* Output Section (To) */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">
              যে এককে রূপান্তর
            </label>
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <select
                value={outputUnit}
                onChange={(e) => setOutputUnit(e.target.value)}
                className="w-full appearance-none rounded-xl bg-zinc-100 p-2.5 outline-none dark:bg-zinc-800 sm:w-1/2"
              >
                {unitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <div className="hidden sm:block w-px bg-zinc-800"></div>
              <input
                type="text"
                value={outputValue}
                readOnly
                placeholder="ফলাফল"
                className="w-full rounded-xl bg-zinc-100 p-2.5 outline-none dark:bg-zinc-800 sm:w-1/2"
              />
            </div>
          </div>
        </div>

        {/* নির্দেশিকা এবং কনভার্শন */}
        <div className="mt-16 pt-10 border-t border-zinc-400/25 space-y-4 text-sm ">
          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
              কীভাবে ব্যবহার করবেন?
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-1">
              <li>প্রথমে <strong>"From"</strong> ইউনিট সিলেক্ট করুন।</li>
              <li>মান লিখুন — ফলাফল সাথে সাথে দেখাবে।</li>
              <li>মাঝের <strong>↑↓</strong> বাটনে ক্লিক করে ইউনিট অদলবদল করতে পারবেন।</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4">গুরুত্বপূর্ণ কনভার্শন</h3>
            <ul className="list-disc list-inside space-y-2 ml-1">
              <li>1 Meter = 100 Centimeter</li>
              <li>1 Meter = 3.28084 Foot</li>
              <li>1 Kilometer = 0.621371 Mile</li>
              <li>1 Inch = 2.54 Centimeter</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}