"use client";

import { useState, useRef } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import {
  Upload,
  FileText,
  Merge,
  Scissors,
  RotateCw,
  Download,
  Trash2,
  Image as ImageIcon,
  Table,
  FileType,
  Layers,
  CheckCircle2,
  X,
  Loader2,
  Eye,
} from "lucide-react";

type Tool =
  | "pdf-merge"
  | "pdf-split"
  | "pdf-to-images"
  | "images-to-pdf"
  | "pdf-rotate"
  | "docx-to-html"
  | "excel-tools"
  | "text-to-pdf";

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
}

export default function AdvancedDocumentConverter() {
  const [activeTool, setActiveTool] = useState<Tool>("pdf-merge");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);

  const [splitPages, setSplitPages] = useState("1-3,5");
  const [rotateAngle, setRotateAngle] = useState(90);
  const [excelOutput, setExcelOutput] = useState<"csv" | "json" | "html">("csv");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (b: number) => {
    if (b < 1024) return `${b} B`;
    if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1048576).toFixed(2)} MB`;
  };

  const addFiles = (selected: FileList | null) => {
    if (!selected) return;
    const newItems: FileItem[] = Array.from(selected).map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      name: f.name,
      size: formatBytes(f.size),
      type: f.type || f.name.split(".").pop() || "",
    }));
    setFiles((prev) => [...prev, ...newItems]);
    setResultUrl(null);
    setHtmlPreview(null);
    setError(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setResultUrl(null);
    setHtmlPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ==================== TOOLS ====================

  const mergePDFs = async () => {
    const pdfFiles = files.filter((f) => f.name.toLowerCase().endsWith(".pdf"));
    if (pdfFiles.length < 2) throw new Error("কমপক্ষে ২টি PDF লাগবে");

    const merged = await PDFDocument.create();
    for (let i = 0; i < pdfFiles.length; i++) {
      setProgress(Math.round(((i + 1) / pdfFiles.length) * 90));
      const bytes = await pdfFiles[i].file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }
    const pdfBytes = await merged.save();
   return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  };

  const splitPDF = async () => {
    if (files.length !== 1 || !files[0].name.toLowerCase().endsWith(".pdf")) {
      throw new Error("শুধু একটি PDF সিলেক্ট করুন");
    }

    const bytes = await files[0].file.arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const total = src.getPageCount();

    const ranges: number[] = [];
    splitPages.split(",").forEach((part) => {
      const p = part.trim();
      if (p.includes("-")) {
        const [a, b] = p.split("-").map(Number);
        for (let i = a; i <= b; i++) ranges.push(i - 1);
      } else {
        ranges.push(Number(p) - 1);
      }
    });

    const newDoc = await PDFDocument.create();
    for (const idx of ranges) {
      if (idx >= 0 && idx < total) {
        const [page] = await newDoc.copyPages(src, [idx]);
        newDoc.addPage(page);
      }
    }
    const pdfBytes = await newDoc.save();
    return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  };

  // ===== PDF → Images (Dynamic import - এরর ফিক্স) =====
  const pdfToImages = async () => {
    if (files.length !== 1) throw new Error("একটি PDF সিলেক্ট করুন");

    // Dynamic import (এটাই মূল ফিক্স)
    const pdfjs = await import("pdfjs-dist");

    // Worker সেটআপ
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

   pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const bytes = await files[0].file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: bytes }).promise;
    const images: Blob[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      setProgress(Math.round((i / pdf.numPages) * 90));
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      
      await page.render({ canvasContext: ctx, viewport } as any).promise;
      
      const blob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b!), "image/png")
      );
      images.push(blob);
    }

    // আপাতত প্রথম পেজ রিটার্ন করছি (পরে ZIP করা যাবে)
    return images[0];
  };

  const imagesToPDF = async () => {
    const imgs = files.filter(
      (f) => f.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(f.name)
    );
    if (imgs.length === 0) throw new Error("অন্তত একটি ইমেজ লাগবে");

    const pdf = await PDFDocument.create();
    for (let i = 0; i < imgs.length; i++) {
      setProgress(Math.round(((i + 1) / imgs.length) * 90));
      const bytes = await imgs[i].file.arrayBuffer();
      let image;
      if (imgs[i].name.toLowerCase().endsWith(".png")) {
        image = await pdf.embedPng(bytes);
      } else {
        image = await pdf.embedJpg(bytes);
      }
      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }
    const pdfBytes = await pdf.save();
   return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  };

  const rotatePDF = async () => {
    if (files.length !== 1) throw new Error("একটি PDF সিলেক্ট করুন");
    const bytes = await files[0].file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = pdf.getPages();
    pages.forEach((p) => p.setRotation(degrees(rotateAngle)));
    const pdfBytes = await pdf.save();
   return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  };

  const docxToHtml = async () => {
    if (files.length !== 1 || !/\.(docx)$/i.test(files[0].name)) {
      throw new Error("একটি DOCX ফাইল সিলেক্ট করুন");
    }
    const arrayBuffer = await files[0].file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    setHtmlPreview(result.value);
    return new Blob([result.value], { type: "text/html" });
  };

  const excelTools = async () => {
    if (files.length !== 1) throw new Error("একটি Excel/CSV ফাইল সিলেক্ট করুন");
    const data = await files[0].file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    if (excelOutput === "csv") {
      const csv = XLSX.utils.sheet_to_csv(firstSheet);
      return new Blob([csv], { type: "text/csv" });
    }
    if (excelOutput === "json") {
      const json = XLSX.utils.sheet_to_json(firstSheet);
      return new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
    }
    const html = XLSX.utils.sheet_to_html(firstSheet);
    setHtmlPreview(html);
    return new Blob([html], { type: "text/html" });
  };

  const textToPDF = async () => {
    if (files.length !== 1) throw new Error("একটি টেক্সট ফাইল সিলেক্ট করুন");
    const text = await files[0].file.text();
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 15, 20);
    return doc.output("blob");
  };

  // ==================== MAIN PROCESS ====================

  const process = async () => {
    if (files.length === 0) {
      setError("আগে ফাইল যোগ করুন");
      return;
    }
    setProcessing(true);
    setProgress(10);
    setError(null);
    setResultUrl(null);
    setHtmlPreview(null);

    try {
      let blob: Blob;
      let name = "";

      switch (activeTool) {
        case "pdf-merge":
          blob = await mergePDFs();
          name = "merged.pdf";
          break;
        case "pdf-split":
          blob = await splitPDF();
          name = "split.pdf";
          break;
        case "pdf-to-images":
          blob = await pdfToImages();
          name = "page-1.png";
          break;
        case "images-to-pdf":
          blob = await imagesToPDF();
          name = "images.pdf";
          break;
        case "pdf-rotate":
          blob = await rotatePDF();
          name = "rotated.pdf";
          break;
        case "docx-to-html":
          blob = await docxToHtml();
          name = "converted.html";
          break;
        case "excel-tools":
          blob = await excelTools();
          name = `converted.${excelOutput}`;
          break;
        case "text-to-pdf":
          blob = await textToPDF();
          name = "document.pdf";
          break;
        default:
          throw new Error("Unknown tool");
      }

      setProgress(100);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultName(`Totthobox_${name}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "কনভার্সন ব্যর্থ হয়েছে");
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = resultName;
    a.click();
  };

  // ==================== UI ====================

  const tools = [
    { id: "pdf-merge" as const, label: "PDF Merge", icon: Merge, accept: ".pdf" },
    { id: "pdf-split" as const, label: "PDF Split", icon: Scissors, accept: ".pdf" },
    { id: "pdf-rotate" as const, label: "PDF Rotate", icon: RotateCw, accept: ".pdf" },
    { id: "pdf-to-images" as const, label: "PDF → Images", icon: ImageIcon, accept: ".pdf" },
    { id: "images-to-pdf" as const, label: "Images → PDF", icon: Layers, accept: "image/*" },
    { id: "docx-to-html" as const, label: "DOCX → HTML", icon: FileType, accept: ".docx" },
    { id: "excel-tools" as const, label: "Excel Tools", icon: Table, accept: ".xlsx,.xls,.csv" },
    { id: "text-to-pdf" as const, label: "Text → PDF", icon: FileText, accept: ".txt,.md" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
          <FileText className="size-3.5" />
          Advanced Document Toolkit
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Document Converter & PDF Tools
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Merge, Split, Rotate, Convert — সব কিছু সম্পূর্ণ ব্রাউজারে। কোনো আপলোড নেই, ১০০% প্রাইভেট।
        </p>
      </header>

      {/* Tool Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTool(t.id);
              clearAll();
            }}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition ${
              activeTool === t.id
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            <t.icon className="size-5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
        className="rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center hover:border-indigo-400 transition"
      >
        <Upload className="mx-auto size-10 text-zinc-400 mb-3" />
        <p className="font-medium text-zinc-700 dark:text-zinc-300">
          ফাইল এখানে ড্র্যাগ করুন
        </p>
        <p className="text-sm text-zinc-500 mt-1">অথবা ক্লিক করে বেছে নিন</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={tools.find((t) => t.id === activeTool)?.accept}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          ফাইল বেছে নাও
        </button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="size-5 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-zinc-500">{f.size}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(f.id)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                <Trash2 className="size-4 text-zinc-500" />
              </button>
            </div>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-zinc-500 hover:text-zinc-800"
          >
            সব মুছে ফেলুন
          </button>
        </div>
      )}

      {/* Tool specific options */}
      {activeTool === "pdf-split" && (
        <div>
          <label className="text-sm font-medium">
            পেজ রেঞ্জ (যেমন: 1-3,5,7-9)
          </label>
          <input
            value={splitPages}
            onChange={(e) => setSplitPages(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
            placeholder="1-3,5"
          />
        </div>
      )}

      {activeTool === "pdf-rotate" && (
        <div className="flex gap-3">
          {[90, 180, 270].map((a) => (
            <button
              key={a}
              onClick={() => setRotateAngle(a)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                rotateAngle === a
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              {a}°
            </button>
          ))}
        </div>
      )}

      {activeTool === "excel-tools" && (
        <div className="flex gap-2">
          {(["csv", "json", "html"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setExcelOutput(o)}
              className={`px-4 py-2 rounded-lg text-sm font-medium uppercase ${
                excelOutput === o
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}

      {/* Process Button */}
      <button
        onClick={process}
        disabled={processing || files.length === 0}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3.5 transition"
      >
        {processing ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Processing... {progress}%
          </>
        ) : (
          <>
            <CheckCircle2 className="size-5" />
            Convert / Process Now
          </>
        )}
      </button>

      {/* Result */}
      {resultUrl && (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
            <span className="font-medium">Ready!</span>
          </div>
          <button
            onClick={download}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3"
          >
            <Download className="size-4" />
            Download {resultName}
          </button>
        </div>
      )}

      {/* HTML Preview */}
      {htmlPreview && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-sm font-medium flex items-center gap-2">
            <Eye className="size-4" /> Preview
          </div>
          <div
            className="p-6 max-h-96 overflow-auto prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlPreview }}
          />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-4 flex gap-3 text-sm text-red-700 dark:text-red-300">
          <X className="size-5 shrink-0" />
          {error}
        </div>
      )}

      {/* SEO Content */}
      <section className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 p-6 space-y-3">
        <h2 className="text-xl font-bold">
          ফ্রি অ্যাডভান্সড ডকুমেন্ট কনভার্টার ও PDF টুলস
        </h2>
        <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-2 leading-relaxed">
          <p>
            <strong>
              PDF Merge, Split, Rotate, Images ↔ PDF, DOCX → HTML, Excel →
              CSV/JSON
            </strong>{" "}
            সহ সব টুল এক জায়গায়। সম্পূর্ণ ব্রাউজারে কাজ করে — কোনো ফাইল সার্ভারে
            যায় না।
          </p>
          <p>
            প্রাইভেসি ফার্স্ট। মোবাইল ও ডেস্কটপ দুটোতেই সাপোর্টেড। কোনো
            রেজিস্ট্রেশন বা লিমিট নেই।
          </p>
        </div>
      </section>
    </div>
  );
}