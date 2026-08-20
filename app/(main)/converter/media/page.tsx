import type { Metadata } from "next";
import MediaConverter from "@/components/converter/MediaConverter";

export const metadata: Metadata = {
  title: "Free Online Media Converter | MP4, MP3, WAV, MKV, AAC & More",
  description:
    "Convert video and audio files online fast, free and securely. Support for MP4, MKV, AVI, MOV, WEBM, MP3, WAV, AAC, FLAC, OGG and more.",
  keywords: [
    "media converter",
    "video to mp3",
    "mp4 to mp3",
    "audio converter",
    "video converter",
    "mkv to mp4",
    "free media converter",
    "wav to mp3",
  ],
  openGraph: {
    title: "Free Online Media Converter",
    description: "Convert video & audio files instantly. MP4, MP3, MKV, WAV and more.",
    images: ["https://cdn-icons-png.flaticon.com/512/10268/10268964.png"],
  },
};

export default function MediaConverterPage() {
  return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <MediaConverter />
      </div>
  );
}