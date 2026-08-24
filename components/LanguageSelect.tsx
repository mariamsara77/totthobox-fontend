"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

const languages = [
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية (Arabic)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
];

export default function LanguageSelect() {
  const [currentLang, setCurrentLang] = useState<string>("bn");

  useEffect(() => {
    // বর্তমান সেভ হওয়া কুকি পড়া
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const langCode = match[1].split("/").pop();
      if (langCode && langCode !== "bn") {
        setCurrentLang(langCode);
      }
    }
  }, []);

  const handleLanguageChange = (targetLang: string) => {
    setCurrentLang(targetLang);

    // ১. আগের সব করাপ্ট হওয়া কুকি পুরোপুরি ডিলিট করা
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

    // ২. নতুন কুকি সেট করা (বাংলা ছাড়া অন্য ভাষার জন্য)
    if (targetLang !== "bn") {
      document.cookie = `googtrans=/bn/${targetLang}; path=/;`;
    }

    // ৩. রিফ্রেশ দিয়ে কুকি অনুযায়ী রেন্ডার নিশ্চিত করা
    window.location.reload();
  };

  return (
    <div className="space-y-2 w-full">
      <label className="flex items-center gap-2 text-xs   uppercase tracking-wider">
        <Languages className="w-4 h-4" />
        <span>ভাষা নির্বাচন</span>
      </label>

      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="w-full p-4 rounded-xl border border-zinc-400/25 text-sm  focus:outline-none transition-all cursor-pointer"
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className="dark:bg-zinc-900 bg-zinc-100 p-2"
          >
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}