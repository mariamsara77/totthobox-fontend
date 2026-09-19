"use client";

import {
  MousePointer2,
  Type,
  Highlighter,
  Pencil,
  Eraser,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Trash2,
  PenLine,
  Undo2,
  Redo2,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePdfEditorStore } from "./store";
import { exportEditedPdf } from "./exportPdf";
import { Tool } from "./types";
import clsx from "clsx";

const tools: { id: Tool; icon: any; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select / Move" },
  { id: "text", icon: Type, label: "Add Text" },
  { id: "highlight", icon: Highlighter, label: "Highlight" },
  { id: "draw", icon: Pencil, label: "Draw" },
  { id: "signature", icon: PenLine, label: "Signature" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
];

interface ToolbarProps {
  onNewFile?: () => void;
}

export function Toolbar({ onNewFile }: ToolbarProps) {
  const {
    tool,
    setTool,
    scale,
    setScale,
    currentPage,
    numPages,
    setCurrentPage,
    rotatePage,
    file,
    pages,
    clearPageAnnotations,
    undo,
    redo,
    past,
    future,
    selectedId,
    removeAnnotation,
    updateAnnotation,
  } = usePdfEditorStore();

  const selectedAnn = selectedId
    ? pages[currentPage - 1]?.annotations.find((a) => a.id === selectedId)
    : null;

  const handleDownload = async () => {
    if (!file) return;
    try {
      const blob = await exportEditedPdf(file, pages);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-b border-zinc-400/25 bg-zinc-950 dark:bg-zinc-950">
      {/* Left: Tools */}
      <div className="flex items-center gap-1">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            title={t.label}
            className={clsx(
              "p-2 rounded-lg transition",
              tool === t.id
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "hover:bg-zinc-900 hover:bg-zinc-800 ",
            )}
          >
            <t.icon className="size-5" />
          </button>
        ))}
      </div>

      {/* Center: Page + Zoom */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg hover:bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="text-sm min-w-[70px] text-center">
          {currentPage} / {numPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
          disabled={currentPage >= numPages}
          className="p-1.5 rounded-lg hover:bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40"
        >
          <ChevronRight className="size-5" />
        </button>

        <div className="w-px h-5 bg-zinc-400/10 mx-1" />

        <button
          onClick={() => setScale(Math.max(0.5, +(scale - 0.15).toFixed(2)))}
          className="p-1.5 rounded-lg hover:bg-zinc-900 hover:bg-zinc-800"
        >
          <ZoomOut className="size-5" />
        </button>
        <span className="text-sm w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale(Math.min(2.5, +(scale + 0.15).toFixed(2)))}
          className="p-1.5 rounded-lg hover:bg-zinc-900 hover:bg-zinc-800"
        >
          <ZoomIn className="size-5" />
        </button>
      </div>

      {/* Right: Properties + Actions */}
      <div className="flex items-center gap-2">
        {/* ===== Property Panel ===== */}
        {selectedAnn && (
          <div className="flex items-center gap-4 px-3 py-1.5 rounded-lg bg-zinc-400/10 border border-zinc-400/25 dark:border-zinc-700">
            {/* Font Size */}
            {selectedAnn.type === "text" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 whitespace-nowrap">
                    Size
                  </span>
                  <input
                    type="range"
                    min={12}
                    max={72}
                    value={selectedAnn.fontSize || 18}
                    onChange={(e) =>
                      updateAnnotation(selectedId!, {
                        fontSize: Number(e.target.value),
                      })
                    }
                    className="w-20 h-1.5 accent-indigo-600"
                  />
                  <span className="text-xs  w-6 text-center">
                    {selectedAnn.fontSize || 18}
                  </span>
                </div>
                <div className="w-px h-4 bg-zinc-700 dark:bg-zinc-600" />
              </>
            )}

            {/* Color */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Color</span>
              <input
                type="color"
                value={
                  selectedAnn.color ||
                  (selectedAnn.type === "highlight" ? "#fef08a" : "#111827")
                }
                onChange={(e) =>
                  updateAnnotation(selectedId!, { color: e.target.value })
                }
                className="size-6 rounded cursor-pointer border border-zinc-700 dark:border-zinc-600"
              />
            </div>

            {/* Opacity for highlight */}
            {selectedAnn.type === "highlight" && (
              <>
                <div className="w-px h-4 bg-zinc-700 dark:bg-zinc-600" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Opacity</span>
                  <input
                    type="range"
                    min={0.2}
                    max={0.75}
                    step={0.05}
                    value={selectedAnn.opacity || 0.45}
                    onChange={(e) =>
                      updateAnnotation(selectedId!, {
                        opacity: Number(e.target.value),
                      })
                    }
                    className="w-16 h-1.5 accent-indigo-600"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Undo / Redo */}
        <button
          onClick={undo}
          disabled={past.length === 0}
          title="Undo"
          className="p-2 rounded-lg hover:bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40"
        >
          <Undo2 className="size-5" />
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          title="Redo"
          className="p-2 rounded-lg hover:bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40"
        >
          <Redo2 className="size-5" />
        </button>

        <div className="w-px h-5 bg-zinc-400/10 mx-1" />

        <button
          onClick={() => rotatePage(currentPage - 1)}
          title="Rotate Page"
          className="p-2 rounded-lg hover:bg-zinc-900 hover:bg-zinc-800"
        >
          <RotateCw className="size-5" />
        </button>

        {selectedId && (
          <button
            onClick={() => removeAnnotation(selectedId)}
            title="Delete selected"
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 dark:hover:bg-red-950/50"
          >
            <Trash2 className="size-5" />
          </button>
        )}

        <button
          onClick={() => clearPageAnnotations(currentPage - 1)}
          title="Clear all annotations on this page"
          className="p-2 rounded-lg hover:bg-zinc-900 hover:bg-zinc-800"
        >
          <Trash2 className="size-5 text-zinc-400" />
        </button>

        {onNewFile && (
          <button
            onClick={onNewFile}
            title="Open another PDF"
            className="p-2 rounded-lg hover:bg-zinc-900 hover:bg-zinc-800"
          >
            <Upload className="size-5" />
          </button>
        )}

        <button
          onClick={handleDownload}
          className="ml-1 flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 text-sm  transition"
        >
          <Download className="size-4" />
          Download
        </button>
      </div>
    </div>
  );
}
