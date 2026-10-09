import { createStoredZip } from "@/lib/createStoredZip";

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type PositionedText = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function escapeXml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toParagraphs(items: PositionedText[]): string[] {
  const ordered = items
    .filter((item) => item.text.trim() !== "")
    .sort((a, b) => b.y - a.y || a.x - b.x);

  const lines: { y: number; height: number; items: PositionedText[] }[] = [];

  for (const item of ordered) {
    const tolerance = Math.max(2, Math.min(8, (item.height || 10) * 0.45));
    // Items are sorted by descending baseline, so a matching text line can only
    // be the most recently opened line. This avoids quadratic scans on long PDFs.
    const line = lines[lines.length - 1];

    if (line && Math.abs(line.y - item.y) <= tolerance) {
      line.items.push(item);
      line.y = (line.y * (line.items.length - 1) + item.y) / line.items.length;
      line.height = Math.max(line.height, item.height);
    } else {
      lines.push({ y: item.y, height: item.height, items: [item] });
    }
  }

  return lines
    .sort((a, b) => b.y - a.y)
    .map((line) => {
      const sorted = line.items.sort((a, b) => a.x - b.x);
      let text = "";
      let previous: PositionedText | undefined;

      for (const item of sorted) {
        const gap = previous ? item.x - (previous.x + previous.width) : 0;
        const needsSpace =
          text.length > 0 &&
          gap > Math.max(1, (item.height || 10) * 0.12) &&
          !/\s$/.test(text) &&
          !/^[\s.,;:!?%)}\]]/.test(item.text);

        if (needsSpace) text += " ";
        text += item.text;
        previous = item;
      }

      return text.trim();
    })
    .filter(Boolean);
}

function createDocxDocument(pages: string[][]): string {
  const body = pages
    .map((paragraphs, pageIndex) => {
      const content = paragraphs.length
        ? paragraphs
            .map(
              (paragraph) =>
                '<w:p><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Noto Sans Bengali"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">' +
                escapeXml(paragraph) +
                "</w:t></w:r></w:p>",
            )
            .join("")
        : "<w:p/>";

      const pageBreak =
        pageIndex > 0
          ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
          : "";

      return pageBreak + content;
    })
    .join("");

  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    "<w:body>" +
    body +
    '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="900" w:right="900" w:bottom="900" w:left="900" w:header="450" w:footer="450" w:gutter="0"/></w:sectPr>' +
    "</w:body></w:document>"
  );
}

/**
 * Converts selectable PDF text into a basic Word document in the browser.
 * This intentionally does not claim OCR or pixel-perfect layout preservation.
 */
export async function convertPdfToDocx(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  if (!file || file.size === 0) {
    throw new Error("একটি বৈধ PDF ফাইল নির্বাচন করুন।");
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new Error("৫০ MB-এর কম আকারের PDF নির্বাচন করুন।");
  }

  if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
    throw new Error("এই টুলে শুধু PDF ফাইল রূপান্তর করা যাবে।");
  }

  onProgress?.(5);
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const document = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[][] = [];
  let extractedCharacters = 0;

  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const positioned = (textContent.items as unknown as Array<{
        str?: unknown;
        transform?: number[];
        width?: number;
        height?: number;
      }>)
        .filter((item) => typeof item.str === "string" && item.str.trim() !== "")
        .map((item) => ({
          text: item.str as string,
          x: Number(item.transform?.[4] ?? 0),
          y: Number(item.transform?.[5] ?? 0),
          width: Number(item.width ?? 0),
          height: Number(item.height ?? 10),
        }));

      const paragraphs = toParagraphs(positioned);
      extractedCharacters += paragraphs.join("").length;
      pages.push(paragraphs);
      onProgress?.(Math.min(90, Math.round((pageNumber / document.numPages) * 85) + 5));
    }
  } finally {
    await document.destroy();
  }

  if (extractedCharacters === 0) {
    throw new Error(
      "এই PDF-এ নির্বাচনযোগ্য লেখা পাওয়া যায়নি। স্ক্যান করা ছবির PDF-এর জন্য OCR প্রয়োজন, যা এই রূপান্তরে অন্তর্ভুক্ত নয়।",
    );
  }

  const encoder = new TextEncoder();
  const wordDocument = createDocxDocument(pages);
  const zip = createStoredZip([
    {
      name: "[Content_Types].xml",
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        "</Types>",
    },
    {
      name: "_rels/.rels",
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        "</Relationships>",
    },
    { name: "word/document.xml", content: wordDocument },
  ]);

  onProgress?.(97);
  const exactBuffer = zip.buffer.slice(
    zip.byteOffset,
    zip.byteOffset + zip.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([exactBuffer], { type: DOCX_MIME });
  // Fail early if encoding unexpectedly produced no package bytes.
  if (encoder.encode(wordDocument).byteLength === 0 || blob.size === 0) {
    throw new Error("Word ফাইল তৈরি করা যায়নি।");
  }
  onProgress?.(100);
  return blob;
}
