"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { KeyRound, Shield, RefreshCw, Copy, Check, Lock, Hash, Sliders, CheckCircle2 } from "lucide-react";
import { FavoriteButton } from "@/components/tools/QuickFavorites";
import { ShareToolButton, CopyResultButton } from "@/components/tools/ToolActions";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "0O1lI";

const MEMORABLE_WORDS = [
  "river", "sky", "forest", "mountain", "ocean", "breeze", "stone", "cloud",
  "sun", "tiger", "falcon", "orbit", "planet", "valley", "beacon", "harbor",
  "crystal", "delta", "echo", "frost", "glow", "horizon", "island", "jungle",
  "lotus", "matrix", "nexus", "oasis", "pulse", "quantum", "radiant", "zenith"
];

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [mode, setMode] = useState<"random" | "passphrase">("random");
  const [wordCount, setWordCount] = useState(4);

  // Hash state
  const [sha256Hash, setSha256Hash] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);

  // Generate cryptographically secure password
  const generatePassword = useCallback(() => {
    if (mode === "passphrase") {
      const array = new Uint32Array(wordCount);
      window.crypto.getRandomValues(array);
      const words = Array.from(array).map((val) => MEMORABLE_WORDS[val % MEMORABLE_WORDS.length]);
      // capitalize first letter of each word and add a number
      const numArr = new Uint8Array(1);
      window.crypto.getRandomValues(numArr);
      const generated = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("-") + (numArr[0] % 100);
      setPassword(generated);
      return;
    }

    let charset = "";
    if (includeUpper) charset += UPPERCASE;
    if (includeLower) charset += LOWERCASE;
    if (includeNumbers) charset += NUMBERS;
    if (includeSymbols) charset += SYMBOLS;

    if (excludeAmbiguous) {
      charset = charset.split("").filter((char) => !AMBIGUOUS.includes(char)).join("");
    }

    if (!charset) {
      setPassword("");
      return;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }

    setPassword(result);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, mode, wordCount]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Generate SHA-256 hash
  useEffect(() => {
    if (!password) {
      setSha256Hash("");
      return;
    }

    const computeHash = async () => {
      try {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        setSha256Hash(hashHex);
      } catch {
        setSha256Hash("");
      }
    };

    computeHash();
  }, [password]);

  // Calculate Entropy & Strength
  const strengthInfo = useMemo(() => {
    if (!password) {
      return { score: 0, label: "খালি", color: "bg-zinc-200", textColor: "text-zinc-500", crackTime: "০ সেকেন্ড" };
    }

    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 32;

    const entropy = Math.round(password.length * Math.log2(pool || 1));

    if (entropy < 35) {
      return { score: 25, label: "দুর্বল (Weak)", color: "bg-rose-500", textColor: "text-rose-600", crackTime: "কয়েক সেকেন্ড" };
    } else if (entropy < 55) {
      return { score: 50, label: "মাঝারি (Moderate)", color: "bg-amber-500", textColor: "text-amber-600", crackTime: "কয়েক দিন" };
    } else if (entropy < 80) {
      return { score: 75, label: "শক্তিশালী (Strong)", color: "bg-emerald-500", textColor: "text-emerald-600", crackTime: "কয়েক শত বছর" };
    } else {
      return { score: 100, label: "বুলেটপ্রুফ (Military Grade)", color: "bg-emerald-600", textColor: "text-emerald-600", crackTime: "বিলিয়ন বছর" };
    }
  }, [password]);

  const copyHash = async () => {
    if (!sha256Hash) return;
    try {
      await navigator.clipboard.writeText(sha256Hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <KeyRound className="w-3.5 h-3.5" />
            ক্রিপ্টোগ্রাফিক সিকিউরিটি টুল
          </span>
          <FavoriteButton
            tool={{
              id: "password-generator",
              title: "পাসওয়ার্ড জেনারেটর",
              path: "/tools/password-generator",
              category: "টুলস",
            }}
          />
          <ShareToolButton title="নিরাপদ পাসওয়ার্ড ও হ্যাশ জেনারেটর - Totthobox" />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          নিরাপদ পাসওয়ার্ড ও হ্যাশ জেনারেটর
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          ওয়েব ক্রিপ্টো এপিআই দিয়ে তৈরি করুন হ্যাক-প্রুফ শক্তিশালী পাসওয়ার্ড, মেমোর্যাবল পাসফ্রেজ ও তাৎক্ষণিক SHA-256 হ্যাশ।
        </p>
      </header>

      {/* Main Password Display Box */}
      <section className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/60 p-4 sm:p-6 shadow-xs space-y-5">
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              readOnly
              value={password}
              aria-label="জেনারেট করা পাসওয়ার্ড"
              className="w-full min-h-[56px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/90 px-4 py-3 text-lg sm:text-xl font-mono font-bold outline-none text-zinc-900 dark:text-zinc-100 pr-12 shadow-inner"
            />
            <button
              type="button"
              onClick={generatePassword}
              aria-label="নতুন পাসওয়ার্ড জেনারেট করুন"
              title="নতুন পাসওয়ার্ড জেনারেট করুন"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <CopyResultButton
            textToCopy={password}
            label="পাসওয়ার্ড কপি করুন"
            successMessage="পাসওয়ার্ড কপি হয়েছে!"
            className="sm:w-auto"
          />
        </div>

        {/* Strength Meter Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              পাসওয়ার্ড শক্তি: <strong className={strengthInfo.textColor}>{strengthInfo.label}</strong>
            </span>
            <span className="text-zinc-500">
              ক্র্যাক হতে সময়: <strong>{strengthInfo.crackTime}</strong>
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strengthInfo.color}`}
              style={{ width: `${strengthInfo.score}%` }}
            />
          </div>
        </div>

        {/* Customization Options */}
        <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                কাস্টমাইজেশন অপশন
              </h2>
            </div>

            {/* Mode switch */}
            <div className="flex rounded-lg bg-zinc-200/70 dark:bg-zinc-800 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode("random")}
                className={`px-3 py-1 rounded-md transition ${mode === "random" ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs" : "text-zinc-600 dark:text-zinc-400"}`}
              >
                র‍্যান্ডম ক্যারেক্টার
              </button>
              <button
                type="button"
                onClick={() => setMode("passphrase")}
                className={`px-3 py-1 rounded-md transition ${mode === "passphrase" ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs" : "text-zinc-600 dark:text-zinc-400"}`}
              >
                পাসফ্রেজ (শব্দগুচ্ছ)
              </button>
            </div>
          </div>

          {mode === "random" ? (
            <div className="space-y-4">
              {/* Length slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-zinc-600 dark:text-zinc-400">পাসওয়ার্ডের দৈর্ঘ্য:</span>
                  <span className="font-mono font-bold text-base px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    {length} অক্ষর
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="48"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>বড় হাতের অক্ষর (A-Z)</span>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>ছোট হাতের অক্ষর (a-z)</span>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>সংখ্যা (0-9)</span>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>বিশেষ চিহ্ন (!@#$%^&*)</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center font-medium">
                <span className="text-zinc-600 dark:text-zinc-400">শব্দ সংখ্যা:</span>
                <span className="font-mono font-bold text-base px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                  {wordCount} টি শব্দ
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="6"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
              />
              <p className="text-zinc-500">
                পাসফ্রেজ মনে রাখা সহজ কিন্তু সাধারণ পাসওয়ার্ডের চেয়েও শতগুণ বেশি শক্তিশালী।
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SHA-256 Hash Output Card */}
      {sha256Hash && (
        <section aria-label="SHA-256 হ্যাশ আউটপুট" className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 sm:p-5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              পাসওয়ার্ডের SHA-256 ক্রিপ্টোগ্রাফিক হ্যাশ
            </span>
            <button
              type="button"
              onClick={copyHash}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedHash ? "হ্যাশ কপি হয়েছে!" : "হ্যাশ কপি"}
            </button>
          </div>

          <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 break-all p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/70 select-all border border-zinc-200/60 dark:border-zinc-700/60">
            {sha256Hash}
          </p>
        </section>
      )}
    </div>
  );
}
