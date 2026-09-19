"use client";

import { useState } from "react";

const unitOptions = [
  { value: "celsius", label: "Celsius (°C)" },
  { value: "fahrenheit", label: "Fahrenheit (°F)" },
  { value: "kelvin", label: "Kelvin (K)" },
];

export default function TemperatureConverter() {
  const [inputValue, setInputValue] = useState("0");
  const [inputUnit, setInputUnit] = useState("celsius");
  const [outputUnit, setOutputUnit] = useState("fahrenheit");

  const calculateOutput = () => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) return "";

    let celsius;

    // প্রথমে সবকিছু Celsius-এ রূপান্তর
    if (inputUnit === "celsius") {
      celsius = numericValue;
    } else if (inputUnit === "fahrenheit") {
      celsius = (numericValue - 32) * (5 / 9);
    } else if (inputUnit === "kelvin") {
      celsius = numericValue - 273.15;
    } else {
      return 0;
    }

    // Celsius থেকে টার্গেট ইউনিটে রূপান্তর
    let result;
    if (outputUnit === "celsius") {
      result = celsius;
    } else if (outputUnit === "fahrenheit") {
      result = celsius * (9 / 5) + 32;
    } else if (outputUnit === "kelvin") {
      result = celsius + 273.15;
    } else {
      return 0;
    }

    return parseFloat(result.toFixed(6));
  };

  const outputValue = calculateOutput();

  const swapTempUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  return (
    <div className="space-y-8">
      {/* হেডার */}
      <header className="text-center space-y-3">
        <h1 className="text-2xl tracking-tight">
          Temperature Converter
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          তাপমাত্রা রূপান্তরকারী — °C, °F, Kelvin
        </p>
      </header>

      {/* মেইন কনভার্টার কার্ড */}
<div className="space-y-5">
  <div className="space-y-2">
    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">যে ইউনিট থেকে (From)</label>
    <div className="flex">
      <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)} className="w-[42%] appearance-none rounded-l-xl rounded-r-none bg-zinc-400/10 px-3 py-3.5 outline-none border-r border-zinc-400/20 hover:bg-zinc-400/20 transition text-sm">
        {unitOptions.map((unit) => (<option key={unit.value} value={unit.value}>{unit.label}</option>))}
      </select>
      <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="মান লিখুন" className="w-[58%] rounded-r-xl rounded-l-none bg-zinc-400/10 px-3 py-3.5 outline-none hover:bg-zinc-400/20 transition" />
    </div>
  </div>

  <div className="flex justify-center py-1">
    <button onClick={swapTempUnits} title="ইউনিট অদলবদল করুন" className="rounded-full p-3 transition-colors hover:bg-zinc-400/25 active:scale-95">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
    </button>
  </div>

  <div className="space-y-2">
    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">যে ইউনিটে রূপান্তর (To)</label>
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
              <p>উপরের বক্স থেকে যে ইউনিট থেকে রূপান্তর করতে চান সেটি বেছে নিন।</p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 flex size-6 items-center justify-center rounded-full bg-zinc-400/15 text-xs font-medium">২</span>
              <p>মান লিখুন — ফলাফল সাথে সাথে আপডেট হবে।</p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 flex size-6 items-center justify-center rounded-full bg-zinc-400/15 text-xs font-medium">৩</span>
              <p>নিচের বক্স থেকে যে ইউনিটে রূপান্তর করতে চান সেটি বেছে নিন।</p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 flex size-6 items-center justify-center rounded-full bg-zinc-400/15 text-xs font-medium">৪</span>
              <p>মাঝের ↑↓ বাটনে ক্লিক করে দুই ইউনিট সহজে অদলবদল করতে পারবেন।</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-400/20">
          <h3 className="text-lg font-semibold mb-3">গুরুত্বপূর্ণ কনভার্শন</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm opacity-80">
            <li>• °C to °F → (°C × 9/5) + 32</li>
            <li>• °F to °C → (°F − 32) × 5/9</li>
            <li>• °C to Kelvin → °C + 273.15</li>
            <li>• 0°C = 32°F = 273.15 K</li>
            <li>• 100°C = 212°F = 373.15 K</li>
            <li>• Absolute Zero = 0 K = −273.15°C</li>
          </ul>
        </div>
      </section>
    </div>
  );
}