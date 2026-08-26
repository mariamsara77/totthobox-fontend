"use client";

import { useMemo, useState } from "react";

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
] as const;

type Unit = keyof typeof lengthConversionRates;

const fieldClass =
  "w-full p-4 bg-zinc-400/10 border border-zinc-400/25 rounded-xl outline-none";

export default function LengthConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState<Unit>("meter");
  const [outputUnit, setOutputUnit] = useState<Unit>("centimeter");

  const outputValue = useMemo(() => {
    const numericValue = Number.parseFloat(inputValue);
    if (!Number.isFinite(numericValue)) return "";

    const valueInMeters = numericValue / lengthConversionRates[inputUnit];
    const result = valueInMeters * lengthConversionRates[outputUnit];
    return Number.parseFloat(result.toFixed(6));
  }, [inputValue, inputUnit, outputUnit]);

  const swapLengthUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  return (
    <section className="w-full space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl tracking-tight">Length Converter</h1>
          <p className="opacity-50">
            দৈর্ঘ্য রূপান্তরকারী — Meter, Kilometer, Mile, Foot, Inch
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="opacity-50">যে ইউনিট থেকে (From)</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value as Unit)}
                className={fieldClass}
              >
                {unitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="মান লিখুন"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={swapLengthUnits}
              title="ইউনিট অদলবদল করুন"
              className="p-4 rounded-xl bg-zinc-400/10 border border-zinc-400/25 hover:bg-zinc-400/25"
            >
              ↑↓
            </button>
          </div>

          <div className="space-y-2">
            <label className="opacity-50">যে ইউনিটে রূপান্তর (To)</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                value={outputUnit}
                onChange={(e) => setOutputUnit(e.target.value as Unit)}
                className={fieldClass}
              >
                {unitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={outputValue}
                readOnly
                placeholder="ফলাফল"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-400/25 space-y-4 opacity-50">
          <div className="space-y-2">
            <h2>কীভাবে ব্যবহার করবেন?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>প্রথমে "From" ইউনিট সিলেক্ট করুন।</li>
              <li>মান লিখুন — ফলাফল সাথে সাথে দেখাবে।</li>
              <li>মাঝের ↑↓ বাটনে ক্লিক করে ইউনিট অদলবদল করতে পারবেন।</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2>গুরুত্বপূর্ণ কনভার্শন</h2>
            <ul className="list-disc list-inside space-y-2">
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
