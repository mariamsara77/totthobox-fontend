import type { Metadata } from "next";
import ImageConverter from "@/components/tools/AdvancedImageConverter";

export const metadata: Metadata = {
  title: "Free Online Image Converter | JPG, PNG, WEBP, SVG, GIF, AVIF, BMP, ICO",
  description:
    "Convert image files online fast, free, and securely. Easily convert JPG, PNG, WebP, GIF, SVG, BMP, AVIF, and ICO to any format. No upload required — everything runs in your browser. 100% private & free.",
  openGraph: {
    title: "Free Online Image Converter | JPG, PNG, WEBP, SVG, AVIF & More",
    description:
      "Convert images instantly in your browser. No uploads, no limits, completely free and private.",
    type: "website",
    images: [
      {
        url: "https://play-lh.googleusercontent.com/_tyzzuKkf5yTkzyFzsBXMaPShBNgJFSueaCX9U6lS-pvAcAbIHVX5ZKUmQ5lN5SZCfIOVRPQRjgwd2rN1qhndLI=w240-h480-rw",
        width: 240,
        height: 480,
        alt: "Image Converter Tool",
      },
    ],
  
    siteName: "Totthobox",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Image Converter",
    description: "Convert JPG, PNG, WebP, AVIF, SVG & more instantly in your browser. Private & free.",
  
    images: ["https://totthobox.com/og-image.png"],
  },
  alternates: {
    canonical: "https://totthobox.com/image-converter", // ← change to your real domain
  },
};

export default function ImageConverterPage() {
  return (
    <main className="tb-page-container tb-section mx-auto max-w-2xl">
      <ImageConverter />
    </main>
  );
}