"use client";

import { useEffect, useRef, useState } from "react";
import { usePdfEditorStore } from "./store";
import clsx from "clsx";

type ThumbnailProps = {
  pdfDoc: any;
  pageNumber: number;
  isActive: boolean;
  rotation: number;
  onSelect: () => void;
};

function PageThumbnail({
  pdfDoc,
  pageNumber,
  isActive,
  rotation,
  onSelect,
}: ThumbnailProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = buttonRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: "140px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isVisible || !pdfDoc) {
      canvas.width = 0;
      canvas.height = 0;
      return;
    }

    let cancelled = false;
    let renderTask: { cancel?: () => void } | null = null;

    const renderThumbnail = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 0.22, rotation });
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        context.clearRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({ canvasContext: context, viewport });
        await (renderTask as any).promise;
      } catch (error) {
        if (!cancelled && (error as { name?: string })?.name !== "RenderingCancelledException") {
          console.error("PDF thumbnail render failed:", error);
        }
      }
    };

    void renderThumbnail();

    return () => {
      cancelled = true;
      try {
        renderTask?.cancel?.();
      } catch {
        // The PDF renderer may already have completed or cancelled the task.
      }
    };
  }, [isVisible, pdfDoc, pageNumber, rotation]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onSelect}
      aria-label={`পৃষ্ঠা ${pageNumber}`}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "w-full rounded-lg overflow-hidden border-2 transition",
        isActive
          ? "border-indigo-500"
          : "border-transparent hover:border-zinc-700 dark:hover:border-zinc-700",
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="mx-auto block max-w-full bg-white"
      />
      <span className="block py-1 text-center text-[10px] text-zinc-400">
        {pageNumber}
        {rotation ? ` • ${rotation}°` : ""}
      </span>
    </button>
  );
}

export function Sidebar() {
  const { pdfDoc, numPages, currentPage, setCurrentPage, pages } =
    usePdfEditorStore();

  return (
    <div className="w-32 shrink-0 space-y-4 overflow-y-auto border-r border-zinc-400/25 bg-zinc-950 p-2 sm:w-40">
      <p className="px-1 text-xs text-zinc-400">Pages ({numPages})</p>
      {Array.from({ length: numPages }, (_, index) => {
        const pageNumber = index + 1;
        const rotation = pages[index]?.rotation || 0;

        return (
          <PageThumbnail
            key={pageNumber}
            pdfDoc={pdfDoc}
            pageNumber={pageNumber}
            rotation={rotation}
            isActive={currentPage === pageNumber}
            onSelect={() => setCurrentPage(pageNumber)}
          />
        );
      })}
    </div>
  );
}
