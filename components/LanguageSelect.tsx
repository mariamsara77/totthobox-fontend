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
  const [currentLang, setCurrentLang] = useState("bn");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const langCode = match[1].split("/").pop();
      if (langCode && langCode !== "bn") setCurrentLang(langCode);
    }
  }, []);

  const handleLanguageChange = (targetLang: string) => {
    setCurrentLang(targetLang);
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

    if (targetLang !== "bn") {
      document.cookie = `googtrans=/bn/${targetLang}; path=/;`;
    }

    window.location.reload();
  };

  return (
    <div className="space-y-2 w-full">
      <label className="flex items-center gap-2 text-xs opacity-50 uppercase tracking-wider">
        <Languages className="w-4 h-4" />
        <span>ভাষা নির্বাচন</span>
      </label>

      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="w-full p-4 rounded-xl border border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25 outline-none text-sm"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
