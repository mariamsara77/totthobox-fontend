import type { Metadata } from "next";
import DataConverter from "@/components/converter/DataConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/file-data" },
  title: "Free Online Data Format Converter | JSON, XML, YAML, CSV",
  description:
    "Convert your JSON, XML, YAML, and CSV files or raw text data instantly and securely online. Free developer tool for data format transformation.",
  openGraph: {
    title: "Free Online Data Format Converter | JSON, XML, YAML, CSV",
    description: "Convert your JSON, XML, YAML, and CSV files or raw text data instantly and securely online. Free developer tool for data format transformation.",
    url: "https://totthobox.com/converter/file-data",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Data Format Converter | JSON, XML, YAML, CSV",
    description: "Convert your JSON, XML, YAML, and CSV files or raw text data instantly and securely online. Free developer tool for data format transformation.",
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function DataConverterPage() {
  return (
      <div className="mx-auto max-w-2xl p-4">
        <DataConverter />
      </div>
  );
}