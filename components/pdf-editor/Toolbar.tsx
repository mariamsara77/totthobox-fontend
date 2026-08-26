"use client";

import { MousePointer2, Type, Highlighter, Pencil, Eraser, Download, ZoomIn, ZoomOut, RotateCw, Trash2, PenLine, Undo2, Redo2, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { usePdfEditorStore } from "./store";
import { exportEditedPdf } from "./exportPdf";
import { Tool } from "./types";
import clsx from "clsx";

const tools: { id: Tool; icon: typeof MousePointer2; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select / Move" }, { id: "text", icon: Type, label: "Add Text" },
  { id: "highlight", icon: Highlighter, label: "Highlight" }, { id: "draw", icon: Pencil, label: "Draw" },
  { id: "signature", icon: PenLine, label: "Signature" }, { id: "eraser", icon: Eraser, label: "Eraser" },
];

const controlClass = "p-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25 disabled:opacity-40";

interface ToolbarProps { onNewFile?: () => void; }

export function Toolbar({ onNewFile }: ToolbarProps) {
  const { tool, setTool, scale, setScale, currentPage, numPages, setCurrentPage, rotatePage, file, pages, clearPageAnnotations, undo, redo, past, future, selectedId, removeAnnotation, updateAnnotation } = usePdfEditorStore();
  const selectedAnn = selectedId ? pages[currentPage - 1]?.annotations.find((a) => a.id === selectedId) : null;

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
    <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-zinc-400/25 bg-zinc-400/10">
      <div className="flex items-center gap-2">
        {tools.map((t) => (
          <button key={t.id} type="button" onClick={() => setTool(t.id)} title={t.label} className={clsx(controlClass, tool === t.id && "bg-zinc-400/50")}>
            <t.icon className="size-5" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className={controlClass}><ChevronLeft className="size-5" /></button>
        <span className="text-sm min-w-[70px] text-center">{currentPage} / {numPages}</span>
        <button type="button" onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))} disabled={currentPage >= numPages} className={controlClass}><ChevronRight className="size-5" /></button>
        <div className="w-px h-5 bg-zinc-400/25 mx-1" />
        <button type="button" onClick={() => setScale(Math.max(0.5, +(scale - 0.15).toFixed(2)))} className={controlClass}><ZoomOut className="size-5" /></button>
        <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
        <button type="button" onClick={() => setScale(Math.min(2.5, +(scale + 0.15).toFixed(2)))} className={controlClass}><ZoomIn className="size-5" /></button>
      </div>

      <div className="flex items-center gap-2">
        {selectedAnn && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-400/10 border border-zinc-400/25">
            {selectedAnn.type === "text" && <>
              <div className="flex items-center gap-2"><span className="text-xs opacity-50">Size</span><input type="range" min={12} max={72} value={selectedAnn.fontSize || 18} onChange={(e) => updateAnnotation(selectedId!, { fontSize: Number(e.target.value) })} className="w-20 h-1.5" /><span className="text-xs w-6 text-center">{selectedAnn.fontSize || 18}</span></div>
              <div className="w-px h-4 bg-zinc-400/25" />
            </>}
            <div className="flex items-center gap-2"><span className="text-xs opacity-50">Color</span><input type="color" value={selectedAnn.color || (selectedAnn.type === "highlight" ? "#fef08a" : "#111827")} onChange={(e) => updateAnnotation(selectedId!, { color: e.target.value })} className="size-6 rounded-xl border border-zinc-400/25 cursor-pointer" /></div>
            {selectedAnn.type === "highlight" && <><div className="w-px h-4 bg-zinc-400/25" /><div className="flex items-center gap-2"><span className="text-xs opacity-50">Opacity</span><input type="range" min={0.2} max={0.75} step={0.05} value={selectedAnn.opacity || 0.45} onChange={(e) => updateAnnotation(selectedId!, { opacity: Number(e.target.value) })} className="w-16 h-1.5" /></div></>}
          </div>
        )}
        <button type="button" onClick={undo} disabled={past.length === 0} title="Undo" className={controlClass}><Undo2 className="size-5" /></button>
        <button type="button" onClick={redo} disabled={future.length === 0} title="Redo" className={controlClass}><Redo2 className="size-5" /></button>
        <div className="w-px h-5 bg-zinc-400/25 mx-1" />
        <button type="button" onClick={() => rotatePage(currentPage - 1)} title="Rotate Page" className={controlClass}><RotateCw className="size-5" /></button>
        {selectedId && <button type="button" onClick={() => removeAnnotation(selectedId)} title="Delete selected" className={controlClass}><Trash2 className="size-5" /></button>}
        <button type="button" onClick={() => clearPageAnnotations(currentPage - 1)} title="Clear all annotations on this page" className={controlClass}><Trash2 className="size-5" /></button>
        {onNewFile && <button type="button" onClick={onNewFile} title="Open another PDF" className={controlClass}><Upload className="size-5" /></button>}
        <button type="button" onClick={handleDownload} className="ml-1 flex items-center gap-2 rounded-xl border border-zinc-400/25 bg-zinc-400/25 hover:bg-zinc-400/50 p-4 text-sm"><Download className="size-4" />Download</button>
      </div>
    </div>
  );
}
