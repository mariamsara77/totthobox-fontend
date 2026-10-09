import { PDFDocument, rgb, degrees } from "pdf-lib";
import type { Annotation, PageState } from "./types";

export async function exportEditedPdf(
  originalFile: File,
  pages: Record<number, PageState>,
): Promise<Blob> {
  const existingPdfBytes = await originalFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pdfPages = pdfDoc.getPages();

  for (let i = 0; i < pdfPages.length; i++) {
    const page = pdfPages[i];
    const pageState = pages[i];
    if (!pageState) continue;

    if (pageState.rotation !== 0) {
      page.setRotation(degrees(pageState.rotation));
    }

    const { height } = page.getSize();

    for (const ann of pageState.annotations) {
      if (ann.type === "text" && ann.text) {
        // Standard PDF fonts do not include Bengali glyphs. Render added text
        // into a transparent PNG so both Bengali and Latin text export.
        const fontSize = Math.max(8, Math.min(120, ann.fontSize || 14));
        const boxWidth = Math.max(40, Math.min(2000, ann.width || 200));
        const boxHeight = Math.max(24, Math.min(1000, ann.height || fontSize * 1.8));
        const pixelRatio = 2;
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(boxWidth * pixelRatio);
        canvas.height = Math.ceil(boxHeight * pixelRatio);
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("লেখা রপ্তানির জন্য canvas তৈরি করা যায়নি");
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = ann.color || "#111827";
        context.font = String(fontSize * pixelRatio) + 'px "Noto Sans Bengali", "Noto Sans", sans-serif';
        context.textBaseline = "top";

        const lines: string[] = [];
        for (const paragraph of ann.text.split(/\r?\n/)) {
          let line = "";
          for (const word of paragraph.split(/\s+/)) {
            if (!word) continue;
            const candidate = line ? line + " " + word : word;
            if (line && context.measureText(candidate).width > canvas.width - 4) {
              lines.push(line);
              line = word;
            } else {
              line = candidate;
            }
          }
          lines.push(line);
        }

        const lineHeight = fontSize * pixelRatio * 1.25;
        lines.forEach((line, index) => {
          const y = index * lineHeight;
          if (y + lineHeight <= canvas.height + 1) {
            context.fillText(line, 2, y, canvas.width - 4);
          }
        });

        const pngData = canvas.toDataURL("image/png");
        const base64 = pngData.split(",")[1];
        const imageBytes = Uint8Array.from(atob(base64), (character) =>
          character.charCodeAt(0),
        );
        const textImage = await pdfDoc.embedPng(imageBytes);

        page.drawImage(textImage, {
          x: ann.x,
          y: height - ann.y - boxHeight,
          width: boxWidth,
          height: boxHeight,
        });
      }

      if (ann.type === "highlight") {
        page.drawRectangle({
          x: ann.x,
          y: height - ann.y - (ann.height || 20),
          width: ann.width || 100,
          height: ann.height || 20,
          color: hexToRgb(ann.color || "#ffff00"),
          opacity: ann.opacity ?? 0.4,
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
            color: hexToRgb(ann.color || "#ff0000"),
          });
        }
      }

      if ((ann.type === "image" || ann.type === "signature") && ann.imageData) {
        try {
          const base64 = ann.imageData.split(",")[1];
          if (!base64) continue;
          const imageBytes = Uint8Array.from(atob(base64), (character) =>
            character.charCodeAt(0),
          );
          const image = ann.imageData.includes("image/png")
            ? await pdfDoc.embedPng(imageBytes)
            : await pdfDoc.embedJpg(imageBytes);

          page.drawImage(image, {
            x: ann.x,
            y: height - ann.y - (ann.height || 100),
            width: ann.width || 150,
            height: ann.height || 100,
          });
        } catch (error) {
          console.error("Image embed failed", error);
        }
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return rgb(0, 0, 0);
  return rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  );
}
