import type { Metadata } from "next";
import DataConverter from "@/components/converter/DataConverter";

export const metadata: Metadata = {
  title: "Free Online Data Format Converter | JSON, XML, YAML, CSV",
  description:
    "Convert your JSON, XML, YAML, and CSV files or raw text data instantly and securely online. Free developer tool for data format transformation.",
  keywords: [
    "data converter",
    "json to xml",
    "xml to json",
    "yaml to json",
    "csv converter",
    "json to csv",
    "yaml to xml",
  ],
};

export default function DataConverterPage() {
  return (
      <div className="mx-auto max-w-2xl p-4">
        <DataConverter />
      </div>
  );
}