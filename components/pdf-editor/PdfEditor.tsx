"use client";

import { useRef } from "react";
import { usePdfEditorStore } from "./store";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { PageCanvas } from "./PageCanvas";
import { Upload, Loader2, FileText } from "lucide-react";

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
  } = usePdfEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdf = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !/\.pdf$/i.test(selectedFile.name)) {
      setError("শুধু PDF ফাইল নির্বাচন করুন।");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const buffer = new Uint8Array(await selectedFile.arrayBuffer());
      const doc = await pdfjs.getDocument({ data: buffer }).promise;

      if (doc.numPages < 1) {
        throw new Error("এই PDF-এ কোনো পৃষ্ঠা পাওয়া যায়নি।");
      }

      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setFile(selectedFile);
    } catch (err) {
      console.error("PDF load failed", err);
      setError(
        err instanceof Error && err.message.includes("password")
          ? "এই PDF-টি পাসওয়ার্ড-সুরক্ষিত। আনলক করা PDF নির্বাচন করুন।"
          : "PDF লোড করা যায়নি। ফাইলটি সঠিক ও ক্ষতিগ্রস্ত নয় কি না পরীক্ষা করুন।",
      );
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filePicker = (
    <input
      ref={fileInputRef}
      type="file"
      accept="application/pdf,.pdf"
      className="sr-only"
      aria-label="PDF ফাইল নির্বাচন করুন"
      onChange={(event) => {
        const selectedFile = event.currentTarget.files?.[0];
        if (selectedFile) void loadPdf(selectedFile);
      }}
    />
  );

  if (!file) {
    return (
      <div className="relative flex min-h-[75vh] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-400/25 bg-zinc-400/10 p-6 text-center sm:p-12">
        {filePicker}
        <FileText className="mb-5 size-12 text-zinc-400" aria-hidden="true" />
        <h1 className="mb-2 text-lg font-semibold tracking-tight sm:text-xl">
          PDF সম্পাদক
        </h1>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          PDF পৃষ্ঠা ঘোরান, লেখা যোগ করুন, হাইলাইট, আঁকা ও স্বাক্ষর বসিয়ে সম্পাদিত ফাইল ডাউনলোড করুন।
          ফাইল আপনার ব্রাউজারেই প্রক্রিয়া করা হয়।
        </p>
        {error && (
          <p role="alert" className="mb-4 max-w-lg rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {isLoading ? "PDF খোলা হচ্ছে..." : "PDF আপলোড করুন"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100dvh-80px)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-zinc-400/25 bg-zinc-900">
      {filePicker}
      <Toolbar onNewFile={() => fileInputRef.current?.click()} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />

        <div className="relative flex min-w-0 flex-1 items-start justify-center overflow-auto bg-zinc-800/80 p-3 sm:p-4">
          {isLoading ? (
            <div className="mt-20 flex items-center gap-3 text-zinc-300" role="status">
              <Loader2 className="size-6 animate-spin" />
              নতুন PDF খোলা হচ্ছে...
            </div>
          ) : (
            <PageCanvas pageNumber={currentPage} />
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="bg-rose-500/15 px-4 py-2 text-sm text-rose-600 dark:text-rose-300">
          {error}
        </div>
      )}
      <div className="sr-only" aria-live="polite">
        মোট {numPages} পৃষ্ঠা, বর্তমান পৃষ্ঠা {currentPage}
      </div>
    </div>
  );
}
