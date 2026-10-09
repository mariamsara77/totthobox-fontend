import { createZipBlob, type ZipEntry } from "@/lib/zip";

const encoder = new TextEncoder();

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Creates an editable DOCX document. Text extraction happens before this
 * step; the output prioritizes readable text over exact original PDF layout,
 * images, and complex tables.
 */
export function createDocxFromPdfPages(pages: string[][]): Blob {
  const body = pages
    .map((lines, pageIndex) => {
      const paragraphs = lines
        .map((line) => {
          const text = escapeXml(line || " ");
          return '<w:p><w:r><w:t xml:space="preserve">' + text + '</w:t></w:r></w:p>';
        })
        .join("");

      const pageBreak =
        pageIndex < pages.length - 1
          ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
          : "";

      return paragraphs + pageBreak;
    })
    .join("");

  const documentXml = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">',
    '<w:body>' + body,
    '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="900" w:right="900" w:bottom="900" w:left="900" w:header="450" w:footer="450" w:gutter="0"/></w:sectPr>',
    '</w:body></w:document>',
  ].join("");

  const contentTypes = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>',
    '</Types>',
  ].join("");

  const relationships = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>',
    '</Relationships>',
  ].join("");

  const entries: ZipEntry[] = [
    { name: "[Content_Types].xml", data: encoder.encode(contentTypes) },
    { name: "_rels/.rels", data: encoder.encode(relationships) },
    { name: "word/document.xml", data: encoder.encode(documentXml) },
  ];

  return createZipBlob(
    entries,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
}
