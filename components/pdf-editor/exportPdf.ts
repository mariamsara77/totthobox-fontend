import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
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
        page.drawText(ann.text, {
          x: ann.x,
          y: height - ann.y - (ann.fontSize || 14),
          size: ann.fontSize || 14,
          font,
          color: hexToRgb(ann.color || "#000000"),
        });
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

      if (ann.type === "draw" && ann.path && ann.path.length > 1) {
        for (let j = 1; j < ann.path.length; j++) {
          const p1 = ann.path[j - 1];
          const p2 = ann.path[j];
          page.drawLine({
            start: { x: p1.x, y: height - p1.y },
            end: { x: p2.x, y: height - p2.y },
            thickness: 2,
            color: hexToRgb(ann.color || "#ff0000"),
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
  return new Blob([pdfBytes], { type: "application/pdf" });
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