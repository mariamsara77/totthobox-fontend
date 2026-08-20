"use client";

import { useState } from "react";
import { trackDownload } from "@/lib/app-resource";

interface Props {
  slug: string;
  name: string;
  platform: string | null;
}

export default function DownloadButton({ slug, name, platform }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      const data = await trackDownload(slug);
      window.location.href = data.download_url;
    } catch {
      alert("ডাউনলোড শুরু করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 px-4 rounded-xl transition"
    >
      {loading
        ? "প্রসেসিং..."
        : `Download ${name} for ${platform || ""} (Free)`}
    </button>
  );
}