"use client";

import { useEffect, useState } from "react";
import { usePdfEditorStore } from "./store";
import clsx from "clsx";

export function Sidebar() {
  const { pdfDoc, numPages, currentPage, setCurrentPage, scale, pages } =
    usePdfEditorStore();
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  useEffect(() => {
    if (!pdfDoc) return;

    const generateThumbnails = async () => {
      const thumbs: string[] = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.25 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        thumbs.push(canvas.toDataURL());
      }
      setThumbnails(thumbs);
    };

    generateThumbnails();
  }, [pdfDoc, numPages]);

  return (
    <div className="w-44 border-r border-zinc-400/25 overflow-y-auto bg-zinc-400/10 bg-zinc-400/10 p-2 space-y-4">
      <p className="text-xs  text-zinc-400 px-1">
        Pages ({numPages})
      </p>
      {thumbnails.map((src, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentPage(idx + 1)}
          className={clsx(
            "w-full rounded-xl overflow-hidden border-2 transition",
            currentPage === idx + 1
              ? "border-zinc-400/25"
              : "border-transparent hover:border-zinc-400/25 dark:hover:border-zinc-400/25"
          )}
        >
          <img src={src} alt={`Page ${idx + 1}`} className="w-full" />
          <p className="text-[10px] text-center py-1 text-zinc-400">
            {idx + 1}
            {pages[idx]?.rotation ? ` • ${pages[idx].rotation}°` : ""}
          </p>
        </button>
      ))}
    </div>
  );
}