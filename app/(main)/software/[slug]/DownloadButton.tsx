"use client";

import { useState } from "react";
import { Download } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export default function DownloadButton({
  appId,
  name,
  platform,
}: {
  appId: number;
  name: string;
  platform?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/apps/${appId}/download`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Download failed");

      const data = await res.json();
      if (data.download_url) {
        window.open(data.download_url, "_blank");
      }
    } catch (error) {
      console.error(error);
      alert("ডাউনলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-60 text-white  py-3.5 px-4 rounded-xl "
    >
      <Download className="w-5 h-5" />
      {loading
        ? "প্রসেস হচ্ছে..."
        : `Download ${name}${platform ? ` for ${platform}` : ""} (Free)`}
    </button>
  );
}