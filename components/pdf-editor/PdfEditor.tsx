"use client";

import { useRef } from "react";
import { usePdfEditorStore } from "./store";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { PageCanvas } from "./PageCanvas";
import { Upload, Loader2 } from "lucide-react";

export default function PdfEditor() {
  const {
    file,
    numPages,
    currentPage,
    isLoading,
    error,
    setFile,
    setPdfDoc,
    setNumPages,
    setLoading,
    setError,
    reset,
  } = usePdfEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdf = async (selectedFile: File) => {
    try {
      setLoading(true);
      setError(null);
      setFile(selectedFile);

      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const buffer = await selectedFile.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buffer }).promise;

      setPdfDoc(doc);
      setNumPages(doc.numPages);
    } catch (err) {
      console.error(err);
      setError("PDF লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  if (!file) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-400/25 bg-zinc-400/10 p-6 text-center sm:p-12">
        <Upload className="size-12 text-zinc-400 mb-5" />
        <h1 className="mb-2 text-lg font-semibold tracking-tight sm:text-xl">
          পিডিএফ সম্পাদক
        </h1>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          লেখা, হাইলাইট, আঁকা, স্বাক্ষর, ঘোরানো ও ডাউনলোড করুন
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && loadPdf(e.target.files[0])}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-emerald-500"
        >
          PDF আপলোড করুন
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col overflow-hidden rounded-2xl border border-zinc-400/25 bg-zinc-900">
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-1 items-start justify-center overflow-auto bg-zinc-800/80 p-4">
          {isLoading ? (
            <div className="flex items-center gap-4 text-zinc-400 mt-20">
              <Loader2 className="size-6 animate-spin" />
              লোড হচ্ছে...
            </div>
          ) : (
            <PageCanvas pageNumber={currentPage} />
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/15 px-4 py-2 text-sm text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}
    </div>
  );
}
