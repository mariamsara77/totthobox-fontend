"use client";

import { useState } from "react";
import { usePdfEditorStore } from "../store";
import { exportEditedPdf } from "../exportPdf";

export function useExporter() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { file, pages } = usePdfEditorStore();

  const downloadPdf = async (customFileName?: string) => {
    if (!file) {
      setError("No PDF file available to export.");
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const blob = await exportEditedPdf(file, pages);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = customFileName || `edited_${file.name}`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("PDF Export Error:", err);
      setError(err?.message || "Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    downloadPdf,
    isExporting,
    error,
  };
}