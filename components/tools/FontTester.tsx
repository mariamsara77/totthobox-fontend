"use client";
import { useState } from "react";
import { Panel } from "./ToolPage";

const fonts = ["var(--font-noto-bengali)", "var(--font-geist-sans)", "Arial", "Georgia", "Times New Roman", "monospace"];

export default function FontTester() {
  const [text, setText] = useState("বাংলা ও English ফন্ট প্রিভিউ");
  const [size, setSize] = useState(32);
  const [font, setFont] = useState(fonts[0]);
  const [weight, setWeight] = useState(400);
  return <Panel>
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="text-sm">ফন্ট<select value={font} onChange={e=>setFont(e.target.value)} className="mt-1 w-full rounded-xl bg-white p-2.5 dark:bg-zinc-900">{fonts.map(item=><option key={item} value={item}>{item.replace("var(--font-","").replace(")","")}</option>)}</select></label>
      <label className="text-sm">সাইজ: {size}px<input type="range" min="14" max="96" value={size} onChange={e=>setSize(Number(e.target.value))} className="mt-3 w-full"/></label>
      <label className="text-sm">Weight<select value={weight} onChange={e=>setWeight(Number(e.target.value))} className="mt-1 w-full rounded-xl bg-white p-2.5 dark:bg-zinc-900">{[400,500,600,700].map(item=><option key={item} value={item}>{item}</option>)}</select></label>
    </div>
    <textarea value={text} onChange={e=>setText(e.target.value)} aria-label="ফন্ট টেস্ট লেখা" className="mt-4 min-h-32 w-full resize-y rounded-xl bg-white p-3 dark:bg-zinc-900"/>
    <div className="mt-4 min-h-48 overflow-auto rounded-xl bg-white p-5 dark:bg-zinc-900" style={{fontFamily:font,fontSize:size,fontWeight:weight}}>{text || "আপনার লেখা এখানে দেখা যাবে"}</div>
    <p className="mt-3 text-xs text-zinc-500">প্রিভিউটি সম্পূর্ণ client-side; কোনো লেখা সার্ভারে পাঠানো হয় না।</p>
  </Panel>;
}
