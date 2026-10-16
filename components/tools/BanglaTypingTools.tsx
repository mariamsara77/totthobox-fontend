"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Panel } from "./ToolPage";

const rows = [["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["Z","X","C","V","B","N","M"]];
const avroMap: Record<string,string> = {a:"অ",aa:"আ",i:"ই",ii:"ঈ",u:"উ",uu:"ঊ",e:"এ",oi:"ঐ",o:"ও",ou:"ঔ",k:"ক",kh:"খ",g:"গ",gh:"ঘ",ng:"ঙ",c:"চ",ch:"ছ",j:"জ",jh:"ঝ",t:"ত",th:"থ",d:"দ",dh:"ধ",n:"ন",p:"প",ph:"ফ",b:"ব",bh:"ভ",m:"ম",z:"য",r:"র",l:"ল",sh:"শ",ss:"ষ",s:"স",h:"হ",y:"য়",rr:"ড়",rh:"ঢ়"};
function avroApprox(input:string){return input.split(/(\s+)/).map(word=>{if(/^\s+$/.test(word))return word;let rest=word.toLowerCase(),out="";const keys=Object.keys(avroMap).sort((a,b)=>b.length-a.length);while(rest){const key=keys.find(k=>rest.startsWith(k));if(!key){out+=rest[0];rest=rest.slice(1)}else{out+=avroMap[key];rest=rest.slice(key.length)}}return out}).join("")}
export default function BanglaTypingTools(){
 const [roman,setRoman]=useState(""); const converted=useMemo(()=>avroApprox(roman),[roman]);
 return <div className="space-y-5">
  <Panel><h2 className="text-lg font-semibold">Avro phonetic helper</h2><p className="mt-1 text-xs text-zinc-500">এটি phonetic approximation; Avro-এর সম্পূর্ণ contextual engine নয়।</p><textarea value={roman} onChange={e=>setRoman(e.target.value)} placeholder="ami banglay likhi" className="mt-4 min-h-28 w-full rounded-xl bg-white p-3 dark:bg-zinc-900"/><div className="mt-3 rounded-xl bg-white p-3 leading-8 dark:bg-zinc-900">{converted || "বাংলা ফলাফল এখানে দেখা যাবে"}</div></Panel>
  <Panel><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Bijoy / ANSI converter</h2><Link href="/converter/adarshalipi" className="rounded-full bg-zinc-400/10 px-3 py-1.5 text-xs hover:bg-zinc-400/25">পূর্ণ Unicode ⇄ ANSI converter</Link></div><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Totthobox-এর বিদ্যমান ANSI/আদর্শলিপি engine ব্যবহার করে Unicode ⇄ legacy Bangla conversion করা যাবে।</p></Panel>
  <Panel><h2 className="mb-3 text-lg font-semibold">Keyboard layout viewer</h2><div className="space-y-2">{rows.map(row=><div key={row.join("")} className="flex flex-wrap gap-2">{row.map(key=><kbd key={key} className="min-w-10 rounded-lg bg-white px-3 py-2 text-center text-sm dark:bg-zinc-900">{key}</kbd>)}</div>)}</div></Panel>
 </div>
}
