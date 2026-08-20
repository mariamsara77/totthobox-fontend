"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileJson,
  Download,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { load as yamlLoad, dump as yamlDump } from "js-yaml";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

// ─── Simple cn helper ─────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type Format = "json" | "xml" | "yaml" | "csv";

const FORMATS: Format[] = ["json", "xml", "yaml", "csv"];

const TARGET_MAP: Record<Format, Format[]> = {
  json: ["xml", "yaml", "csv"],
  xml: ["json", "yaml", "csv"],
  yaml: ["json", "xml", "csv"],
  csv: ["json", "xml", "yaml"],
};

export default function DataConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [rawInput, setRawInput] = useState("");
  const [sourceFormat, setSourceFormat] = useState<Format | "">("");
  const [targetFormat, setTargetFormat] = useState<Format | "">("");
  const [targetOptions, setTargetOptions] = useState<Format[]>([]);
  const [resultContent, setResultContent] = useState<string | null>(null);
  const [resultFilename, setResultFilename] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── File handling ──────────────────────────────────────
  const handleFile = useCallback(async (selected: File) => {
    if (selected.size > 5 * 1024 * 1024) {
      alert("Maximum file size is 5 MB");
      return;
    }

    const ext = selected.name.split(".").pop()?.toLowerCase() || "";
    let format: Format | "" = "";

    if (ext === "json") format = "json";
    else if (ext === "xml") format = "xml";
    else if (ext === "yaml" || ext === "yml") format = "yaml";
    else if (ext === "csv" || ext === "txt") format = "csv";

    const text = await selected.text();
    setFile(selected);
    setRawInput(text);
    setResultContent(null);
    setErrorMessage(null);

    if (format) {
      setSourceFormat(format);
      const options = TARGET_MAP[format];
      setTargetOptions(options);
      setTargetFormat(options[0]);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const setSourceManually = (fmt: Format) => {
    setSourceFormat(fmt);
    const options = TARGET_MAP[fmt];
    setTargetOptions(options);
    setTargetFormat(options[0]);
    setResultContent(null);
    setErrorMessage(null);
  };

  const clearAll = () => {
    setFile(null);
    setRawInput("");
    setSourceFormat("");
    setTargetOptions([]);
    setTargetFormat("");
    setResultContent(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Conversion Logic (Pure Client-side) ────────────────
  const convert = async () => {
    if (!rawInput.trim() || !sourceFormat || !targetFormat) return;

    setIsConverting(true);
    setErrorMessage(null);
    setResultContent(null);

    try {
      // 1. Parse source → JS object / array
      let data: any;

      if (sourceFormat === "json") {
        data = JSON.parse(rawInput);
      } else if (sourceFormat === "yaml") {
  data = yamlLoad(rawInput);
} else if (sourceFormat === "xml") {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
        });
        data = parser.parse(rawInput);
      } else if (sourceFormat === "csv") {
        data = csvToJson(rawInput);
      }

      // 2. Convert to target
      let output = "";

      if (targetFormat === "json") {
        output = JSON.stringify(data, null, 2);
      } else if (targetFormat === "yaml") {
  output = yamlDump(data, { indent: 2, lineWidth: -1 });
} else if (targetFormat === "xml") {
        const builder = new XMLBuilder({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
          format: true,
          indentBy: "  ",
        });
        // If data is array, wrap it
        const toBuild = Array.isArray(data) ? { root: { item: data } } : data;
        output = builder.build(toBuild);
      } else if (targetFormat === "csv") {
        output = jsonToCsv(data);
      }

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      setResultContent(output);
      setResultFilename(`totthobox_data_converter_${timestamp}.${targetFormat}`);
    } catch (err: any) {
      setErrorMessage(err?.message || "Conversion failed. Please check your data.");
    } finally {
      setIsConverting(false);
    }
  };

  // ─── Copy & Download ────────────────────────────────────
  const copyResult = async () => {
    if (!resultContent) return;
    await navigator.clipboard.writeText(resultContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    if (!resultContent || !resultFilename) return;
    const blob = new Blob([resultContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = resultFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <Sparkles className="h-3.5 w-3.5" />
          Instant Transformer
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Data Format Converter
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          JSON ⇄ XML ⇄ YAML ⇄ CSV — Upload a file or paste raw data
        </p>
      </header>

      {/* Converter Card */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-sm space-y-6">
        {/* 1. File Upload */}
        <div>
          <label className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2 block">
            1. File Upload (Optional)
          </label>

          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all",
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              )}
            >
              <Upload className="h-7 w-7 text-zinc-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  JSON, XML, YAML, CSV · Max 5 MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.xml,.yaml,.yml,.csv,.txt"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="rounded-lg bg-white dark:bg-zinc-900 p-2 shadow-sm">
                  <FileJson className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={clearAll}
                className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                <X className="h-4 w-4 text-zinc-500" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Source Format */}
        <div>
          <label className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2 block">
            2. Source Format
          </label>
          <div className="grid grid-cols-4 gap-2">
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSourceManually(fmt)}
                className={cn(
                  "rounded-lg py-2 text-xs font-mono font-semibold uppercase transition-all",
                  sourceFormat === fmt
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                )}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Source Data */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
              3. Source Data
            </label>
            {sourceFormat && (
              <span className="inline-flex items-center rounded-md bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 text-xs font-mono font-semibold uppercase text-indigo-700 dark:text-indigo-300">
                {sourceFormat}
              </span>
            )}
          </div>
          <textarea
            value={rawInput}
            onChange={(e) => {
              setRawInput(e.target.value);
              setResultContent(null);
              setErrorMessage(null);
            }}
            rows={9}
            placeholder={`{"example": "paste your raw data here..."}`}
            className="w-full font-mono text-xs sm:text-sm leading-relaxed rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 resize-y"
          />
        </div>

        {/* Target Format */}
        <AnimatePresence>
          {sourceFormat && targetOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 dark:border-zinc-800/60 dark:bg-zinc-800/40 p-4 space-y-2">
                <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Convert to (Target Format):
                </div>
                <div className="flex flex-wrap gap-2">
                  {targetOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setTargetFormat(opt)}
                      className={cn(
                        "rounded-lg px-3.5 py-1.5 text-xs font-mono font-semibold uppercase transition-all",
                        targetFormat === opt
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                          : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Convert Button */}
        <button
          onClick={convert}
          disabled={!rawInput.trim() || !sourceFormat || !targetFormat || isConverting}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition-all",
            !rawInput.trim() || !sourceFormat || !targetFormat || isConverting
              ? "bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed"
              : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-lg shadow-zinc-900/20"
          )}
        >
          {isConverting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Converting Data...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Convert to {targetFormat ? targetFormat.toUpperCase() : "Target"}
            </>
          )}
        </button>

        {/* Error */}
        {errorMessage && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3.5 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {resultContent && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Result ({targetFormat?.toUpperCase()})
                </h3>

                <button
                  onClick={copyResult}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                value={resultContent}
                rows={9}
                className="w-full font-mono text-xs sm:text-sm leading-relaxed rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/60 px-4 py-3 resize-y"
              />

              <button
                onClick={downloadResult}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-sm font-medium transition"
              >
                <Download className="h-4 w-4" />
                Download {targetFormat?.toUpperCase()} File
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    <section className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 p-5 space-y-3" aria-labelledby="about-converter">
        <h2 id="about-converter" className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            ফ্রি অনলাইন ডাটা ফরম্যাট কনভার্টার
        </h2>
        <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 space-y-3">
            <p>
                <strong>JSON, XML, YAML এবং CSV</strong> ফরম্যাটগুলোর মধ্যে সহজেই ডাটা রূপান্তর করুন।
                ফাইল আপলোড করতে পারেন অথবা সরাসরি রো টেক্সট পেস্ট করে কনভার্ট করতে পারেন।
            </p>
            <p>
                ডেভেলপারদের জন্য দ্রুত ও সহজ টুল। সর্বোচ্চ ৫ MB ফাইল বা ২ লাখ ক্যারেক্টার পর্যন্ত টেক্সট সাপোর্ট করে।
            </p>
        </div>
    </section>

    <section className="space-y-3" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            প্রায়শই জিজ্ঞাসিত প্রশ্ন
        </h2>

        <div className="space-y-2">
            <details className="group rounded-xl border border-zinc-400/25 bg-white dark:bg-zinc-900 overflow-hidden">
                <summary
                    className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                    <span>এই ডাটা কনভার্টার কি ফ্রি?</span>
                   
                </summary>
                <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    হ্যাঁ। টুলটি সম্পূর্ণ ফ্রি। কোনো রেজিস্ট্রেশন বা পেমেন্ট লাগে না।
                </div>
            </details>

            <details className="group rounded-xl border border-zinc-400/25 bg-white dark:bg-zinc-900 overflow-hidden">
                <summary
                    className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                    <span>কোন কোন ফরম্যাট সাপোর্টেড?</span>
                    
                </summary>
                <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    JSON, XML, YAML এবং CSV — এই চারটি ফরম্যাটের মধ্যে যেকোনো দিকে কনভার্ট করা যায়।
                </div>
            </details>

            <details className="group rounded-xl border border-zinc-400/25 bg-white dark:bg-zinc-900 overflow-hidden">
                <summary
                    className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                    <span>ফাইল না দিয়ে শুধু টেক্সট পেস্ট করে কি কনভার্ট করা যায়?</span>
                    
                </summary>
                <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    হ্যাঁ। ফাইল আপলোড ঐচ্ছিক। সোর্স ফরম্যাট সিলেক্ট করে টেক্সটএরিয়াতে ডাটা পেস্ট করেই কনভার্ট করতে
                    পারবেন।
                </div>
            </details>

            <details className="group rounded-xl border border-zinc-400/25 bg-white dark:bg-zinc-900 overflow-hidden">
                <summary
                    className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                    <span>সর্বোচ্চ কত বড় ডাটা সাপোর্ট করে?</span>
                   
                </summary>
                <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    ফাইল আপলোডে সর্বোচ্চ ৫ MB এবং টেক্সট পেস্টে সর্বোচ্চ প্রায় ২ লাখ ক্যারেক্টার পর্যন্ত সাপোর্ট করে।
                </div>
            </details>
        </div>
    </section>
    </div>
  );
}

// ─── CSV Helpers ──────────────────────────────────────────
function csvToJson(csv: string): any[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]);
  const result: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCsvLine(lines[i]);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] ?? "";
    });
    result.push(obj);
  }
  return result;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function jsonToCsv(data: any): string {
  if (!Array.isArray(data)) {
    // If it's an object, wrap it
    if (typeof data === "object" && data !== null) {
      data = [data];
    } else {
      throw new Error("CSV conversion requires an array of objects");
    }
  }

  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const lines = [headers.join(",")];

  for (const row of data) {
    const values = headers.map((h) => {
      let val = row[h] ?? "";
      val = String(val);
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    lines.push(values.join(","));
  }

  return lines.join("\n");
}

// ─── FAQ Item ─────────────────────────────────────────────
function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-zinc-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}