"use client";

import { useState } from "react";

// Byte ভিত্তিক কনভার্শন রেট (Decimal system: 1000)
const dataStorageConversionRates = {
  bit: 8,
  byte: 1,
  kilobyte: 0.001,
  megabyte: 0.000001,
  gigabyte: 1e-9,
  terabyte: 1e-12,
  petabyte: 1e-15,
};

const unitOptions = [
  { value: "bit", label: "Bit (b)" },
  { value: "byte", label: "Byte (B)" },
  { value: "kilobyte", label: "Kilobyte (KB)" },
  { value: "megabyte", label: "Megabyte (MB)" },
  { value: "gigabyte", label: "Gigabyte (GB)" },
  { value: "terabyte", label: "Terabyte (TB)" },
  { value: "petabyte", label: "Petabyte (PB)" },
];

export default function DataStorageConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState("megabyte");
  const [outputUnit, setOutputUnit] = useState("gigabyte");

  const calculateOutput = () => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) return "";

    const inputRate = dataStorageConversionRates[inputUnit];
    const outputRate = dataStorageConversionRates[outputUnit];

    if (!inputRate || !outputRate) return 0;

    const valueInBytes = numericValue / inputRate;
    const result = valueInBytes * outputRate;

    return parseFloat(result.toFixed(6));
  };

  const outputValue = calculateOutput();

  const swapDataUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  return (
    <section className="w-full">
      <div className="space-y-8">
        {/* হেডার */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl   tracking-tight text-zinc-50 dark:text-white">
            Data Storage Converter
          </h1>
          <h2 className="text-lg ">
            ডাটা স্টোরেজ রূপান্তরকারী — MB, GB, TB, PB
          </h2>
        </div>

        <div className="space-y-4 w-full">
          {/* Input Section (From) */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm  ">
              যে ইউনিট থেকে (From)
            </label>
            <div className="flex w-full rounded-lg overflow-hidden">
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="w-full sm:w-1/2 p-2 bg-zinc-800 border-none cursor-pointer outline-none"
              >
                {unitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <div className="hidden sm:block w-px bg-zinc-800"></div>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="মান লিখুন"
                className="w-full sm:w-1/2 p-2 bg-zinc-800/80 outline-none"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="w-full flex justify-center py-2">
            <button
              onClick={swapDataUnits}
              title="ইউনিট অদলবদল করুন"
              className="p-3 rounded-full hover:bg-zinc-800/80"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </button>
          </div>

          {/* Output Section (To) */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm  ">
              যে ইউনিটে রূপান্তর (To)
            </label>
            <div className="flex w-full rounded-lg overflow-hidden">
              <select
                value={outputUnit}
                onChange={(e) => setOutputUnit(e.target.value)}
                className="w-full sm:w-1/2 p-2 bg-zinc-800 border-none cursor-pointer outline-none"
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
                className="w-full sm:w-1/2 p-2 bg-zinc-800/80 outline-none"
              />
            </div>
          </div>
        </div>

        {/* নির্দেশিকা এবং কনভার্শন */}
        <div className="mt-16 pt-10 border-t border-zinc-400/25 space-y-4 text-sm ">
          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4 flex items-center gap-2">
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
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4">গুরুত্বপূর্ণ কনভার্শন (Decimal System)</h3>
            <ul className="list-disc list-inside space-y-2 ml-1">
              <li>1 Byte = 8 Bit</li>
              <li>1 KB = 1000 Byte</li>
              <li>1 MB = 1000 KB = 1,000,000 Byte</li>
              <li>1 GB = 1000 MB | 1 TB = 1000 GB | 1 PB = 1000 TB</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
