"use client";

import { useMemo, useState } from "react";

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

const fieldClass = "w-full p-4 bg-zinc-400/10 border border-zinc-400/25 rounded-xl outline-none";

export default function AreaConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState("square_meter");
  const [outputUnit, setOutputUnit] = useState("square_foot");

  const outputValue = useMemo(() => {
    const numericValue = Number.parseFloat(inputValue);
    if (!Number.isFinite(numericValue)) return "";
    const valueInSqm = numericValue / areaConversionRates[inputUnit];
    const result = valueInSqm * areaConversionRates[outputUnit];
    return Number.parseFloat(result.toFixed(6));
  }, [inputValue, inputUnit, outputUnit]);

  const swapAreaUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  return (
    <section className="w-full space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl tracking-tight">Area Converter</h1>
          <p className="opacity-50">ক্ষেত্রফল রূপান্তরকারী — Square Meter, Square Foot, Acre, Hectare</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="opacity-50">যে ইউনিট থেকে (From)</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)} className={fieldClass}>
                {unitOptions.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
              </select>
              <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="মান লিখুন" className={fieldClass} />
            </div>
          </div>
          <div className="flex justify-center">
            <button type="button" onClick={swapAreaUnits} title="ইউনিট অদলবদল করুন" className="p-4 rounded-xl bg-zinc-400/10 border border-zinc-400/25 hover:bg-zinc-400/25">↑↓</button>
          </div>
          <div className="space-y-2">
            <label className="opacity-50">যে ইউনিটে রূপান্তর (To)</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <select value={outputUnit} onChange={(e) => setOutputUnit(e.target.value)} className={fieldClass}>
                {unitOptions.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
              </select>
              <input type="text" value={outputValue} readOnly placeholder="ফলাফল" className={fieldClass} />
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-zinc-400/25 space-y-4 opacity-50">
          <div className="space-y-2"><h2>কীভাবে ব্যবহার করবেন?</h2><ul className="list-disc list-inside space-y-2"><li>উপরের বক্সে যে ইউনিট থেকে কনভার্ট করতে চান সেটি সিলেক্ট করুন।</li><li>মান লিখুন — ফলাফল স্বয়ংক্রিয়ভাবে দেখাবে।</li><li>মাঝের ↑↓ বাটনে ক্লিক করে ইউনিট অদলবদল করতে পারবেন।</li></ul></div>
          <div className="space-y-2"><h2>গুরুত্বপূর্ণ কনভার্শন</h2><ul className="list-disc list-inside space-y-2"><li>1 Square Meter ≈ 10.7639 Square Foot</li><li>1 Acre = 4046.86 Square Meter ≈ 43560 Square Foot</li><li>1 Hectare = 10000 Square Meter = 2.471 Acre</li><li>1 Square Kilometer = 100 Hectare</li></ul></div>
        </div>
      </div>
    </section>
  );
}
