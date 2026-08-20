import type { Metadata } from "next";
import ImageConverter from "@/components/tools/AdvancedImageConverter";

export const metadata: Metadata = {
  title: "Free Online Image Converter | JPG, PNG, WEBP, SVG, GIF, AVIF, BMP, ICO",
  description:
    "Convert image files online fast, free, and securely. Easily convert JPG, PNG, WebP, GIF, SVG, BMP, AVIF, and ICO to any format. No upload required — everything runs in your browser. 100% private & free.",
  keywords: [
    "image converter",
    "jpg to png",
    "webp converter",
    "png to jpg",
    "convert image online",
    "free image converter",
    "webp to png",
    "avif converter",
    "bmp to png",
    "svg converter",
    "ico converter",
    "online image converter",
    "browser image converter",
  ],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Image Converter",
    description: "Convert JPG, PNG, WebP, AVIF, SVG & more instantly in your browser. Private & free.",
  },
  alternates: {
    canonical: "https://yourdomain.com/image-converter", // ← change to your real domain
  },
};

export default function ImageConverterPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <ImageConverter />
    </main>
  );
}