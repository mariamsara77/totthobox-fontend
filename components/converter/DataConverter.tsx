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
    [handleFile],
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
      setResultFilename(
        `totthobox_data_converter_${timestamp}.${targetFormat}`,
      );
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Conversion failed. Please check your data.",
      );
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
    const blob = new Blob([resultContent], {
      type: "text/plain;charset=utf-8",
    });
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
  <header className="text-center space-y-4">
    <span className="inline-flex items-center gap-2 rounded-full bg-zinc-400/10 p-2 text-sm">
      <Sparkles className="size-4" />
      Instant Transformer
    </span>
    <h1 className="text-2xl font-bold tracking-tight">
      Data Format Converter
    </h1>
    <p>
      JSON ⇄ XML ⇄ YAML ⇄ CSV — Upload a file or paste raw data
    </p>
  </header>

  {/* Converter Card */}
  <section className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 space-y-4">
    {/* 1. File Upload */}
    <div>
      <label className="text-sm uppercase tracking-wider mb-2 block">
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
            "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25 p-4 text-center cursor-pointer",
            isDragging && "bg-zinc-400/25",
          )}
        >
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-zinc-400/10">
            <Upload className="size-6" />
          </div>
          <div className="opacity-50">
            <p>Drag & drop or click to upload</p>
            <p>JSON, XML, YAML, CSV · Max 5 MB</p>
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
        <div className="flex items-center justify-between rounded-xl bg-zinc-400/10 p-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="rounded-xl bg-zinc-400/10 p-2">
              <FileJson className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm truncate">{file.name}</p>
              <p className="text-sm opacity-50">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={clearAll}
            className="p-1.5 hover:bg-zinc-400/25 rounded-xl"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>

    {/* 2. Source Format */}
    <div>
      <label className="text-sm uppercase tracking-wider mb-2 block">
        2. Source Format
      </label>
      <div className="grid grid-cols-4 gap-2">
        {FORMATS.map((fmt) => (
          <button
            key={fmt}
            onClick={() => setSourceManually(fmt)}
            className={cn(
              "py-1.5 rounded-xl text-sm uppercase transition",
              sourceFormat === fmt
                ? "bg-zinc-400/25 text-white"
                : "bg-zinc-400/10 hover:bg-zinc-400/25",
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
        <label className="text-sm uppercase tracking-wider">
          3. Source Data
        </label>
        {sourceFormat && (
          <span className="inline-flex items-center rounded-xl bg-zinc-400/10 px-2.5 py-1 text-sm uppercase">
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
        className="w-full rounded-xl bg-zinc-400/10 p-2 outline-none"
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
          <div className="rounded-xl border border-zinc-400/25 p-4 space-y-2">
            <div className="text-sm uppercase tracking-wider">
              Convert to (Target Format):
            </div>
            <div className="flex flex-wrap gap-2">
              {targetOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setTargetFormat(opt)}
                  className={cn(
                    "px-2.5 py-1 rounded-xl text-sm uppercase transition",
                    targetFormat === opt
                      ? "bg-zinc-400/25 text-white"
                      : "bg-zinc-400/10 hover:bg-zinc-400/25",
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
      disabled={
        !rawInput.trim() || !sourceFormat || !targetFormat || isConverting
      }
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25 py-2 transition"
    >
      {isConverting ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          Converting Data...
        </>
      ) : (
        <>
          <Sparkles className="size-4" />
          Convert to {targetFormat ? targetFormat.toUpperCase() : "Target"}
        </>
      )}
    </button>

    {/* Error */}
    {errorMessage && (
      <div className="rounded-xl bg-zinc-400/10 p-4 flex items-start gap-4">
        <AlertCircle className="size-5 shrink-0" />
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
          className="pt-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Result ({targetFormat?.toUpperCase()})
            </h3>

            <button
              onClick={copyResult}
              className="inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm hover:bg-zinc-400/25 transition"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          <textarea
            readOnly
            value={resultContent}
            rows={9}
            className="w-full rounded-xl bg-zinc-400/10 p-2 outline-none"
          />

          <button
            onClick={downloadResult}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-400/25 hover:bg-zinc-400/50 p-2 transition"
          >
            <Download className="size-4" />
            Download {targetFormat?.toUpperCase()} File
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </section>

  <section className="rounded-2xl /40 p-4 space-y-4">
    <h2 className="text-xl">
      ফ্রি অনলাইন ডাটা ফরম্যাট কনভার্টার
    </h2>
    <div className="leading-relaxed">
      <p>
        <strong>JSON, XML, YAML এবং CSV</strong> ফরম্যাটগুলোর মধ্যে সহজেই
        ডাটা রূপান্তর করুন। ফাইল আপলোড করতে পারেন অথবা সরাসরি রো টেক্সট
        পেস্ট করে কনভার্ট করতে পারেন।
      </p>
      <p>
        ডেভেলপারদের জন্য দ্রুত ও সহজ টুল। সর্বোচ্চ ৫ MB ফাইল বা ২ লাখ
        ক্যারেক্টার পর্যন্ত টেক্সট সাপোর্ট করে।
      </p>
    </div>
  </section>

  <section className="space-y-4">
    <h2 className="text-xl">
      প্রায়শই জিজ্ঞাসিত প্রশ্ন
    </h2>

    <div className="space-y-2">
      <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-zinc-400/10 transition">
          <span>এই ডাটা কনভার্টার কি ফ্রি?</span>
        </summary>
        <div className="px-4 pb-4 text-sm leading-relaxed">
          হ্যাঁ। টুলটি সম্পূর্ণ ফ্রি। কোনো রেজিস্ট্রেশন বা পেমেন্ট লাগে না।
        </div>
      </details>

      <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-zinc-400/10 transition">
          <span>কোন কোন ফরম্যাট সাপোর্টেড?</span>
        </summary>
        <div className="px-4 pb-4 text-sm leading-relaxed">
          JSON, XML, YAML এবং CSV — এই চারটি ফরম্যাটের মধ্যে যেকোনো দিকে
          কনভার্ট করা যায়।
        </div>
      </details>

      <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-zinc-400/10 transition">
          <span>
            ফাইল না দিয়ে শুধু টেক্সট পেস্ট করে কি কনভার্ট করা যায়?
          </span>
        </summary>
        <div className="px-4 pb-4 text-sm leading-relaxed">
          হ্যাঁ। ফাইল আপলোড ঐচ্ছিক। সোর্স ফরম্যাট সিলেক্ট করে টেক্সটএরিয়াতে
          ডাটা পেস্ট করেই কনভার্ট করতে পারবেন।
        </div>
      </details>

      <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-zinc-400/10 transition">
          <span>সর্বোচ্চ কত বড় ডাটা সাপোর্ট করে?</span>
        </summary>
        <div className="px-4 pb-4 text-sm leading-relaxed">
          ফাইল আপলোডে সর্বোচ্চ ৫ MB এবং টেক্সট পেস্টে সর্বোচ্চ প্রায় ২ লাখ
          ক্যারেক্টার পর্যন্ত সাপোর্ট করে।
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
    <div className="rounded-xl border border-zinc-400/25 dark:border-zinc-400/25 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left  text-zinc-50 text-zinc-200 hover:bg-zinc-400/10 hover:bg-zinc-400/10 transition"
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-zinc-400 transition-transform",
            open && "rotate-180",
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
            <div className="px-4 pb-4 text-sm  leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
