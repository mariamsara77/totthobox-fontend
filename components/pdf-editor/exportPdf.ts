import { PDFDocument, PDFPage, rgb, StandardFonts, degrees } from "pdf-lib";
import { Annotation, PageState } from "./types";

export async function exportEditedPdf(
  originalFile: File,
  pages: Record<number, PageState>
): Promise<Blob> {
  const existingPdfBytes = await originalFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pdfPages = pdfDoc.getPages();

  for (let i = 0; i < pdfPages.length; i++) {
    const page = pdfPages[i];
    const pageState = pages[i];
    if (!pageState) continue;

    // Apply rotation
    if (pageState.rotation !== 0) {
      page.setRotation(degrees(pageState.rotation));
    }

    const { width, height } = page.getSize();

    for (const ann of pageState.annotations) {
      if (ann.type === "text" && ann.text) {
        try {
          page.drawText(ann.text, {
            x: ann.x,
            y: height - ann.y - (ann.fontSize || 14),
            size: ann.fontSize || 14,
            font,
            color: hexToRgb(ann.color || "#000000"),
          });
        } catch (error) {
          // Standard PDF fonts are WinAnsi-only. Keep Bengali/Unicode annotations
          // visible by rasterizing only the text that the embedded standard font rejects.
          const message = error instanceof Error ? error.message : String(error);
          if (!/WinAnsi|encode|glyph/i.test(message)) throw error;
          await drawUnicodeTextAsImage(pdfDoc, page, ann, height);
        }
      }

      if (ann.type === "highlight") {
        page.drawRectangle({
          x: ann.x,
          y: height - ann.y - (ann.height || 20),
          width: ann.width || 100,
          height: ann.height || 20,
          color: hexToRgb(ann.color || "#ffff00"),
          opacity: ann.opacity || 0.4,
        });
      }

      if ((ann.type === "draw" || ann.type === "signature") && ann.path && ann.path.length > 1) {
        for (let j = 1; j < ann.path.length; j++) {
          const p1 = ann.path[j - 1];
          const p2 = ann.path[j];
          page.drawLine({
            start: { x: p1.x, y: height - p1.y },
            end: { x: p2.x, y: height - p2.y },
            thickness: ann.strokeWidth || (ann.type === "signature" ? 3 : 2),
            color: hexToRgb(ann.color || (ann.type === "signature" ? "#1e40af" : "#ff0000")),
          });
        }
      }

      // Image / Signature
      if ((ann.type === "image" || ann.type === "signature") && ann.imageData) {
        try {
          const base64 = ann.imageData.split(",")[1];
          const imageBytes = Uint8Array.from(atob(base64), (c) =>
            c.charCodeAt(0)
          );
          let image;
          if (ann.imageData.includes("image/png")) {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            image = await pdfDoc.embedJpg(imageBytes);
          }
          page.drawImage(image, {
            x: ann.x,
            y: height - ann.y - (ann.height || 100),
            width: ann.width || 150,
            height: ann.height || 100,
          });
        } catch (e) {
          console.error("Image embed failed", e);
        }
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
}


async function drawUnicodeTextAsImage(
  pdfDoc: PDFDocument,
  page: PDFPage,
  ann: Annotation,
  pageHeight: number,
): Promise<void> {
  if (!ann.text) return;

  const boxWidth = Math.max(40, ann.width || 200);
  const boxHeight = Math.max(24, ann.height || 40);
  const rasterScale = 3;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(boxWidth * rasterScale);
  canvas.height = Math.ceil(boxHeight * rasterScale);

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unicode text could not be rendered for PDF export.");
  }

  const computedFont = window.getComputedStyle(document.body).fontFamily || "sans-serif";
  const fontSize = Math.max(8, ann.fontSize || 14);
  context.scale(rasterScale, rasterScale);
  context.clearRect(0, 0, boxWidth, boxHeight);
  context.fillStyle = ann.color || "#111827";
  context.textBaseline = "top";
  context.font = fontSize + "px " + computedFont;

  const padding = 3;
  const maxWidth = boxWidth - padding * 2;
  const lineHeight = Math.max(fontSize * 1.35, 12);
  const lines: string[] = [];

  for (const paragraph of ann.text.split(/\r?\n/)) {
    if (paragraph === "") {
      lines.push("");
      continue;
    }

    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? line + " " + word : word;

      if (context.measureText(candidate).width <= maxWidth || line === "") {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }

  const maxLines = Math.max(1, Math.floor((boxHeight - padding * 2) / lineHeight));
  lines.slice(0, maxLines).forEach((line, index) => {
    context.fillText(line, padding, padding + index * lineHeight, maxWidth);
  });

  const encoded = canvas.toDataURL("image/png").split(",")[1];
  if (!encoded) {
    throw new Error("Unicode text image could not be created.");
  }

  const pngBytes = Uint8Array.from(atob(encoded), (character) =>
    character.charCodeAt(0),
  );
  const image = await pdfDoc.embedPng(pngBytes);
  page.drawImage(image, {
    x: ann.x,
    y: pageHeight - ann.y - boxHeight,
    width: boxWidth,
    height: boxHeight,
    rotate: degrees(ann.rotation || 0),
  });
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return rgb(0, 0, 0);
  return rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  );
}