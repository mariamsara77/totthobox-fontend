"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Film,
  Music,
  Download,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// ─── Simple cn helper (no external file needed) ───────────
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Types ────────────────────────────────────────────────
type ConversionStatus =
  | "idle"
  | "loading"
  | "ready"
  | "converting"
  | "completed"
  | "failed";

// ─── Supported formats ────────────────────────────────────
const VIDEO_FORMATS = ["mp4", "mkv", "avi", "mov", "webm", "flv", "wmv"];
const AUDIO_FORMATS = ["mp3", "wav", "aac", "flac", "ogg", "m4a", "opus"];
const ALL_ACCEPT = [...VIDEO_FORMATS, ...AUDIO_FORMATS]
  .map((f) => `.${f}`)
  .join(",");

const TARGET_MAP: Record<string, string[]> = {
  mp4: ["mp3", "wav", "aac", "webm", "mkv"],
  mkv: ["mp4", "mp3", "wav", "webm"],
  avi: ["mp4", "mkv", "mp3", "wav"],
  mov: ["mp4", "mkv", "mp3", "wav"],
  webm: ["mp4", "mkv", "mp3", "wav"],
  flv: ["mp4", "mkv", "mp3"],
  wmv: ["mp4", "mkv", "mp3"],
  mp3: ["wav", "aac", "flac", "ogg", "m4a"],
  wav: ["mp3", "aac", "flac", "ogg", "m4a"],
  aac: ["mp3", "wav", "flac", "ogg", "m4a"],
  flac: ["mp3", "wav", "aac", "ogg", "m4a"],
  ogg: ["mp3", "wav", "aac", "flac", "m4a"],
  m4a: ["mp3", "wav", "aac", "flac", "ogg"],
  opus: ["mp3", "wav", "aac", "flac", "ogg"],
};

export default function MediaConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState("");
  const [targetFormat, setTargetFormat] = useState("");
  const [targetOptions, setTargetOptions] = useState<string[]>([]);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  // ─── Load FFmpeg (once) ─────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100));
      });

      try {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript",
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm",
          ),
        });
        setLoaded(true);
        setStatus("ready");
      } catch (err) {
        console.error("FFmpeg load failed", err);
        setErrorMessage("Failed to load converter engine. Please refresh.");
        setStatus("failed");
      }
    };

    load();
  }, []);

  // ─── Detect format when file changes ────────────────────
  useEffect(() => {
    if (!file) {
      setSourceFormat("");
      setTargetOptions([]);
      setTargetFormat("");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    setSourceFormat(ext);
    const options = TARGET_MAP[ext] || [];
    setTargetOptions(options);
    setTargetFormat(options[0] || "");
  }, [file]);

  // ─── Drag & Drop ────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const handleFile = (selected: File) => {
    if (selected.size > 300 * 1024 * 1024) {
      alert("Maximum file size is 300 MB");
      return;
    }
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setProgress(0);
    setErrorMessage("");
    setStatus(loaded ? "ready" : "loading");
    setFile(selected);
  };

  // ─── Convert (100% browser) ─────────────────────────────
  const convert = async () => {
    if (!file || !targetFormat || !ffmpegRef.current || !loaded) return;

    setStatus("converting");
    setProgress(0);
    setErrorMessage("");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    const ffmpeg = ffmpegRef.current;
    const inputName = `input.${sourceFormat}`;
    const outputName = `output.${targetFormat}`;

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      let command: string[] = ["-i", inputName];

      if (AUDIO_FORMATS.includes(targetFormat)) {
        command.push("-vn");
        if (targetFormat === "mp3")
          command.push("-c:a", "libmp3lame", "-q:a", "2");
        else if (targetFormat === "aac")
          command.push("-c:a", "aac", "-b:a", "192k");
        else if (targetFormat === "wav") command.push("-c:a", "pcm_s16le");
        else if (targetFormat === "flac") command.push("-c:a", "flac");
        else if (targetFormat === "ogg")
          command.push("-c:a", "libvorbis", "-q:a", "5");
        else if (targetFormat === "m4a")
          command.push("-c:a", "aac", "-b:a", "192k");
        else if (targetFormat === "opus")
          command.push("-c:a", "libopus", "-b:a", "128k");
      } else {
        if (targetFormat === "mp4") {
          command.push(
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            "-crf",
            "23",
            "-c:a",
            "aac",
          );
        } else if (targetFormat === "webm") {
          command.push("-c:v", "libvpx-vp9", "-b:v", "1M", "-c:a", "libopus");
        } else if (targetFormat === "mkv") {
          command.push("-c:v", "libx264", "-c:a", "aac");
        } else {
          command.push("-c", "copy");
        }
      }

      command.push(outputName);
      await ffmpeg.exec(command);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], {
        type: getMimeType(targetFormat),
      });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setStatus("completed");
      setProgress(100);

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err?.message || "Conversion failed. Try a different format.",
      );
      setStatus("failed");
    }
  };

  const removeFile = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setDownloadUrl(null);
    setProgress(0);
    setErrorMessage("");
    setStatus(loaded ? "ready" : "loading");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const download = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `totthobox_converted_${Date.now()}.${targetFormat}`;
    a.click();
  };

  return (
    <div className="space-y-8">
  {/* Header */}
  <header className="text-center space-y-4">
    <span className="inline-flex items-center gap-2 rounded-full bg-zinc-400/10 p-2 text-sm">
      <Film className="size-4" />
      Universal Media Converter
    </span>
    <h1 className="text-2xl font-bold tracking-tight">
      Video & Audio Converter
    </h1>
    <p>
      MP4, MKV, AVI, MOV, WEBM, FLV, WMV, MP3, WAV, AAC, FLAC, OGG, M4A,
      OPUS — 100% browser-based, no upload to server.
    </p>
  </header>

  {/* Converter Card */}
  <section className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 space-y-4">
    {/* Loading engine */}
    {!loaded && status !== "failed" && (
      <div className="flex items-center justify-center gap-4 py-8">
        <Loader2 className="size-5 animate-spin" />
        <span>Loading converter engine...</span>
      </div>
    )}

    {/* Dropzone */}
    {loaded && !file && (
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
          <p>Max 300 MB · Everything stays in your browser</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALL_ACCEPT}
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && handleFile(e.target.files[0])
          }
        />
      </div>
    )}

    {/* Selected file */}
    {file && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-xl bg-zinc-400/10 p-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="rounded-xl bg-zinc-400/10 p-2">
            {VIDEO_FORMATS.includes(sourceFormat) ? (
              <Film className="size-5" />
            ) : (
              <Music className="size-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm truncate">{file.name}</p>
            <p className="text-sm opacity-50">
              {(file.size / (1024 * 1024)).toFixed(1)} MB ·{" "}
              {sourceFormat.toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={removeFile}
          className="p-1.5 hover:bg-zinc-400/25 rounded-xl"
        >
          <X className="size-4" />
        </button>
      </motion.div>
    )}

    {/* Target format */}
    <AnimatePresence>
      {sourceFormat && targetOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 overflow-hidden"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center rounded-xl bg-zinc-400/10 px-2.5 py-1 text-sm">
              {sourceFormat.toUpperCase()}
            </span>
            <span>→ Convert to</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {targetOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setTargetFormat(opt)}
                disabled={status === "converting"}
                className={cn(
                  "px-2.5 py-1 rounded-xl text-sm uppercase transition",
                  targetFormat === opt
                    ? "bg-zinc-400/25 text-white"
                    : "bg-zinc-400/10 hover:bg-zinc-400/25",
                )}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Convert button */}
    {file && (
      <button
        onClick={convert}
        disabled={
          !targetFormat ||
          status === "converting" ||
          status === "loading" ||
          !loaded
        }
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25 py-2 transition"
      >
        {status === "converting" ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Converting {progress}%
          </>
        ) : (
          "Convert Now"
        )}
      </button>
    )}

    {/* Progress bar */}
    {status === "converting" && (
      <div className="w-full bg-zinc-400/10 rounded-full h-2 overflow-hidden">
        <div
          className="bg-zinc-400/25 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}

    {/* Result */}
    <AnimatePresence>
      {(status === "completed" || status === "failed") && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="rounded-xl border border-zinc-400/25 p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm">
              {sourceFormat.toUpperCase()} → {targetFormat.toUpperCase()}
            </h3>
            <StatusBadge status={status} />
          </div>

          {status === "completed" && downloadUrl && (
            <button
              onClick={download}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-400/25 hover:bg-zinc-400/50 p-2 transition"
            >
              <Download className="size-4" />
              Download {targetFormat.toUpperCase()}
            </button>
          )}

          {status === "failed" && (
            <div className="rounded-xl bg-zinc-400/10 p-4 flex items-start gap-4">
              <AlertCircle className="size-5 shrink-0" />
              {errorMessage || "Something went wrong. Please try again."}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </section>

  <section className="rounded-2xl /40 p-4 space-y-4">
    <h2 className="text-xl">
      ফ্রি অনলাইন ভিডিও ও অডিও কনভার্টার
    </h2>
    <div className="leading-relaxed">
      <p>
        <strong>MP4, MKV, AVI, MOV, WEBM, FLV, WMV</strong> সহ জনপ্রিয় ভিডিও
        ফরম্যাট এবং
        <strong>MP3, WAV, AAC, FLAC, OGG, M4A, OPUS</strong> অডিও
        ফরম্যাটগুলোর মধ্যে সহজেই কনভার্ট করুন। ফাইল আপলোড করলেই সোর্স
        ফরম্যাট অটো-ডিটেক্ট হবে।
      </p>
      <p>
        কনভার্সন শেষ হলে ডাউনলোড বাটনে ক্লিক করে ফাইল নিন। সর্বোচ্চ ৩০০ MB
        পর্যন্ত ফাইল সাপোর্ট করে। বড় ফাইল হলে প্রসেসিংয়ে একটু সময় লাগতে
        পারে।
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
          <span>এই মিডিয়া কনভার্টার কি ফ্রি?</span>
        </summary>
        <div className="px-4 pb-4 text-sm leading-relaxed">
          হ্যাঁ। টুলটি সম্পূর্ণ ফ্রি ব্যবহার করা যায়। কোনো রেজিস্ট্রেশন বা
          পেমেন্ট লাগে না।
        </div>
      </details>

      <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-zinc-400/10 transition">
          <span>কোন কোন ফরম্যাট সাপোর্টেড?</span>
        </summary>
        <div className="px-4 pb-4 text-sm leading-relaxed">
          ভিডিও: MP4, MKV, AVI, MOV, WEBM, FLV, WMV। অডিও: MP3, WAV, AAC,
          FLAC, OGG, M4A, OPUS। সোর্স ফাইল অনুযায়ী সম্ভাব্য টার্গেট ফরম্যাট
          অটো দেখানো হয়।
        </div>
      </details>

      <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-zinc-400/10 transition">
          <span>সর্বোচ্চ ফাইল সাইজ কত?</span>
        </summary>
        <div className="px-4 pb-4 text-sm leading-relaxed">
          সর্বোচ্চ ৩০০ MB (৩০৭২০০ KB) পর্যন্ত ফাইল আপলোড করা যায়। বড় ফাইল
          হলে কনভার্সনে বেশি সময় লাগতে পারে।
        </div>
      </details>

      <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-zinc-400/10 transition">
          <span>কনভার্সন কতক্ষণ লাগে?</span>
        </summary>
        <div className="px-4 pb-4 text-sm leading-relaxed">
          ছোট ফাইলে কয়েক সেকেন্ড থেকে এক মিনিট। বড় ভিডিও/অডিওতে কয়েক মিনিট
          লাগতে পারে। স্ট্যাটাস অটো আপডেট হয় — পেজ ছেড়ে যাবেন না।
        </div>
      </details>
    </div>
  </section>
</div>
  );
}

// ─── Helpers ──────────────────────────────────────────────
function getMimeType(ext: string) {
  const map: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mkv: "video/x-matroska",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    flac: "audio/flac",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
    opus: "audio/opus",
  };
  return map[ext] || "application/octet-stream";
}

function StatusBadge({ status }: { status: ConversionStatus }) {
  const map: Record<string, { label: string; color: string }> = {
    converting: {
      label: "Converting",
      color:
        "bg-zinc-400/25 opacity-50 bg-zinc-400/10 dark:opacity-50",
    },
    completed: {
      label: "Completed",
      color: "bg-zinc-400/10 text-zinc-200 dark:bg-emerald-900/40 text-zinc-300",
    },
    failed: {
      label: "Failed",
      color: "bg-zinc-400/25 opacity-50 bg-zinc-400/10 dark:opacity-50",
    },
  };
  const item = map[status] || {
    label: status,
    color: "bg-zinc-400/10 text-zinc-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ",
        item.color,
      )}
    >
      {status === "completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
      {item.label}
    </span>
  );
}

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
        className="flex w-full items-center justify-between px-4 py-3.5 text-left  hover:bg-zinc-400/10 hover:bg-zinc-400/10 transition"
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
