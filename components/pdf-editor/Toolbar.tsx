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
  Camera,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePdfEditorStore } from "./store";
import { exportEditedPdf } from "./exportPdf";
import { Tool } from "./types";
import { useState } from "react";
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
  onScan?: () => void;
}

export function Toolbar({ onNewFile, onScan }: ToolbarProps) {
  const {
    pdfDoc,
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

  const [isConvertingWord, setIsConvertingWord] = useState(false);

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
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  const handleExportWord = async () => {
    if (!pdfDoc || !numPages || !file) return;

    setIsConvertingWord(true);
    try {
      const pageParagraphs: string[] = [];
      let extractedCharacters = 0;

      for (let pageNumber = 1; pageNumber <= numPages; pageNumber += 1) {
        const page = await pdfDoc.getPage(pageNumber);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => {
            if (!("str" in item)) return "";
            return item.str + ("hasEOL" in item && item.hasEOL ? "\n" : " ");
          })
          .join("")
          .trim();

        extractedCharacters += text.length;

        if (pageNumber > 1) {
          pageParagraphs.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
        }

        if (text) {
          for (const line of text.split(/\r?\n/)) {
            pageParagraphs.push(
              '<w:p><w:r><w:t xml:space="preserve">' +
                escapeXml(line) +
                "</w:t></w:r></w:p>",
            );
          }
        } else {
          pageParagraphs.push("<w:p/>");
        }
      }

      if (extractedCharacters === 0) {
        throw new Error("এই PDF-এ নির্বাচনযোগ্য লেখা পাওয়া যায়নি। স্ক্যান করা PDF থেকে Word করতে OCR প্রয়োজন।");
      }

      const documentXml =
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
        "<w:body>" +
        pageParagraphs.join("") +
        '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
        '<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>' +
        "</w:sectPr></w:body></w:document>";

      const contentTypes =
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        "</Types>";

      const packageRelationships =
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        "</Relationships>";

      const archive = createStoredZip([
        { name: "[Content_Types].xml", content: contentTypes },
        { name: "_rels/.rels", content: packageRelationships },
        { name: "word/document.xml", content: documentXml },
      ]);
      const blob = new Blob([archive as unknown as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = (file.name.replace(/\.pdf$/i, "") || "document") + ".docx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Word ফাইলে রূপান্তর করা যায়নি।";
      alert(message);
    } finally {
      setIsConvertingWord(false);
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

        {onScan && (
          <button
            onClick={onScan}
            title="ক্যামেরা দিয়ে স্ক্যান"
            aria-label="ক্যামেরা দিয়ে স্ক্যান"
            className="p-2 rounded-lg hover:bg-zinc-800"
          >
            <Camera className="size-5" />
          </button>
        )}

        {onNewFile && (
          <button
            onClick={onNewFile}
            title="অন্য PDF বা ছবি খুলুন"
            aria-label="অন্য PDF বা ছবি খুলুন"
            className="p-2 rounded-lg hover:bg-zinc-800"
          >
            <Upload className="size-5" />
          </button>
        )}

        <button
          onClick={handleExportWord}
          disabled={isConvertingWord || !pdfDoc}
          title="সম্পাদনাযোগ্য Word (.docx) হিসেবে লেখা রপ্তানি করুন"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3 py-2 text-sm text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileText className="size-4" />
          {isConvertingWord ? "রূপান্তর…" : "Word (.docx)"}
        </button>

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


function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function concatenateBytes(parts: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let offset = 0;

  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }

  return result;
}

/** Create an uncompressed ZIP, sufficient for the small Open XML document parts. */
function createStoredZip(files: Array<{ name: string; content: string }>): Uint8Array {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let localOffset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.content);
    const checksum = crc32(data);

    const localHeader = new Uint8Array(30);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, 0, true);
    localView.setUint16(12, 0x21, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, data.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, name.length, true);
    localView.setUint16(28, 0, true);

    localParts.push(localHeader, name, data);

    const centralHeader = new Uint8Array(46);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, 0, true);
    centralView.setUint16(14, 0x21, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, localOffset, true);

    centralParts.push(centralHeader, name);
    localOffset += localHeader.length + name.length + data.length;
  }

  const centralDirectory = concatenateBytes(centralParts);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralDirectory.length, true);
  endView.setUint32(16, localOffset, true);
  endView.setUint16(20, 0, true);

  return concatenateBytes([...localParts, centralDirectory, endRecord]);
}
