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
      <div className="flex flex-col items-center justify-center min-h-[75vh] rounded-2xl border-2 border-dashed border-zinc-700 dark:border-zinc-700 p-12">
        <Upload className="size-12 text-zinc-400 mb-5" />
        <h1 className="text-2xl font-bold mb-2">Advanced PDF Editor</h1>
        <p className="text-zinc-400 mb-8 text-center max-w-md">
          Text • Highlight • Draw • Signature • Rotate • Download — সব ফ্রি
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
          className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 "
        >
          PDF আপলোড করুন
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] rounded-2xl border border-zinc-400/25 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-zinc-900/70 bg-zinc-900/40">
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
        <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-4 py-2 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}