import type { Metadata } from "next";
import DataConverter from "@/components/converter/DataConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/file-data" },
  title: "Free Online Data Format Converter | JSON, XML, YAML, CSV",
  description:
    "Convert your JSON, XML, YAML, and CSV files or raw text data instantly and securely online. Free developer tool for data format transformation.",

};

export default function DataConverterPage() {
  return (
      <div className="mx-auto max-w-2xl p-4">
        <DataConverter />
      </div>
  );
}