"use client";

import { useState } from "react";

// Joule ভিত্তিক কনভার্শন রেট
const energyConversionRates = {
  joule: 1,
  kilojoule: 0.001,
  calorie: 0.239006, // small calorie
  kilocalorie: 0.000239006,
  watt_hour: 0.000277778,
  kilowatt_hour: 2.77778e-7,
  electronvolt: 6.241509e18,
  btu: 0.000947817,
};

const unitOptions = [
  { value: "joule", label: "Joule (J)" },
  { value: "kilojoule", label: "Kilojoule (kJ)" },
  { value: "calorie", label: "Calorie (cal)" },
  { value: "kilocalorie", label: "Kilocalorie (kcal)" },
  { value: "watt_hour", label: "Watt-hour (Wh)" },
  { value: "kilowatt_hour", label: "Kilowatt-hour (kWh)" },
  { value: "btu", label: "BTU" },
];

export default function EnergyConverter() {
  const [inputValue, setInputValue] = useState("1");
  const [inputUnit, setInputUnit] = useState("joule");
  const [outputUnit, setOutputUnit] = useState("calorie");

  const calculateOutput = () => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) return "";

    const inputRate = energyConversionRates[inputUnit];
    const outputRate = energyConversionRates[outputUnit];

    if (!inputRate || !outputRate) return 0;

    const valueInJoule = numericValue / inputRate;
    const result = valueInJoule * outputRate;

    return parseFloat(result.toFixed(6));
  };

  const outputValue = calculateOutput();

  const swapEnergyUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  return (
    <div className="space-y-8">
      {/* হেডার */}
      <header className="text-center space-y-3">
        <h1 className="text-2xl tracking-tight">
          শক্তি রূপান্তরকারী
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          জুল, ক্যালরি, কিলোওয়াট-ঘণ্টা ও BTU
        </p>
      </header>

{/* মেইন কনভার্টার কার্ড */}
<div className="space-y-5">
  <div className="space-y-2">
    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">যে একক থেকে</label>
    <div className="flex">
      <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)} className="w-[42%] appearance-none rounded-l-xl rounded-r-none bg-zinc-400/10 px-3 py-3.5 outline-none border-r border-zinc-400/20 hover:bg-zinc-400/20 transition text-sm">
        {unitOptions.map((unit) => (<option key={unit.value} value={unit.value}>{unit.label}</option>))}
      </select>
      <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="মান লিখুন" className="w-[58%] rounded-r-xl rounded-l-none bg-zinc-400/10 px-3 py-3.5 outline-none hover:bg-zinc-400/20 transition" />
    </div>
  </div>

  <div className="flex justify-center py-1">
    <button onClick={swapEnergyUnits} title="ইউনিট অদলবদল করুন" className="rounded-full p-3 transition-colors hover:bg-zinc-400/25 active:scale-95">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
    </button>
  </div>

  <div className="space-y-2">
    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">যে এককে রূপান্তর</label>
    <div className="flex">
      <select value={outputUnit} onChange={(e) => setOutputUnit(e.target.value)} className="w-[42%] appearance-none rounded-l-xl rounded-r-none bg-zinc-400/10 px-3 py-3.5 outline-none border-r border-zinc-400/20 hover:bg-zinc-400/20 transition text-sm">
        {unitOptions.map((unit) => (<option key={unit.value} value={unit.value}>{unit.label}</option>))}
      </select>
      <input type="text" value={outputValue} readOnly placeholder="ফলাফল" className="w-[58%] rounded-r-xl rounded-l-none bg-zinc-400/10 px-3 py-3.5 outline-none cursor-default" />
    </div>
  </div>
</div>

      {/* Result Display Card */}
      <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-6 text-center">
        <p className="text-sm uppercase tracking-wider opacity-50 mb-2">
          রূপান্তরিত মান
        </p>
        <div className="flex justify-center items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-semibold tracking-tight">
            {outputValue !== "" ? outputValue.toLocaleString() : "—"}
          </span>
          <span className="text-base opacity-60">
            {unitOptions.find(u => u.value === outputUnit)?.label}
          </span>
        </div>
        {inputValue && !isNaN(parseFloat(inputValue)) && (
          <p className="mt-4 text-sm opacity-50">
            {inputValue} {unitOptions.find(u => u.value === inputUnit)?.label} = {outputValue} {unitOptions.find(u => u.value === outputUnit)?.label}
          </p>
        )}
      </div>

      {/* নির্দেশিকা */}
      <section className="rounded-2xl border border-zinc-400/25 bg-zinc-400/5 p-5 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            কীভাবে ব্যবহার করবেন?
          </h3>
          <div className="space-y-3 text-sm leading-relaxed">
            <div className="flex gap-3">
              <span className="shrink-0 flex size-6 items-center justify-center rounded-full bg-zinc-400/15 text-xs font-medium">১</span>
              <p>উপরের বক্স থেকে যে একক থেকে রূপান্তর করতে চান সেটি বেছে নিন।</p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 flex size-6 items-center justify-center rounded-full bg-zinc-400/15 text-xs font-medium">২</span>
              <p>মান লিখুন — ফলাফল সাথে সাথে আপডেট হবে।</p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 flex size-6 items-center justify-center rounded-full bg-zinc-400/15 text-xs font-medium">৩</span>
              <p>নিচের বক্স থেকে যে এককে রূপান্তর করতে চান সেটি বেছে নিন।</p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 flex size-6 items-center justify-center rounded-full bg-zinc-400/15 text-xs font-medium">৪</span>
              <p>মাঝের ↑↓ বাটনে ক্লিক করে দুই একক সহজে অদলবদল করতে পারবেন।</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-400/20">
          <h3 className="text-lg font-semibold mb-3">গুরুত্বপূর্ণ কনভার্শন</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm opacity-80">
            <li>• 1 Calorie ≈ 4.184 Joule</li>
            <li>• 1 Kilocalorie = 1000 Calorie ≈ 4184 Joule</li>
            <li>• 1 kWh = 3,600,000 Joule ≈ 860.421 Kilocalorie</li>
            <li>• 1 BTU ≈ 1055.06 Joule</li>
            <li>• 1 Kilojoule = 1000 Joule</li>
            <li>• 1 Watt-hour = 3600 Joule</li>
          </ul>
        </div>
      </section>
    </div>
  );
}