"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

type Props = {
  appId: string | number;
  name?: string;
  platform?: string;
  downloadType?: "external" | "local";
};

export default function DownloadButton({
  appId,
  name = "সফটওয়্যার",
  platform,
  downloadType = "external",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;

    setLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}/api/apps/${appId}/download`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data?.download_url) {
        throw new Error(data?.message || "অফিসিয়াল সোর্স পাওয়া যায়নি।");
      }

      // নতুন ট্যাবে অফিসিয়াল সাইট ওপেন
      window.open(data.download_url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Software source error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "অফিসিয়াল সোর্স পাওয়া যায়নি। পরে আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-3 text-sm font-medium transition hover:bg-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ExternalLink className="w-4 h-4" />
        {loading
          ? "অফিসিয়াল সোর্স খোঁজা হচ্ছে..."
          : downloadType === "external"
            ? `${name}${platform ? ` (${platform})` : ""} — অফিসিয়াল ওয়েবসাইট`
            : `${name}${platform ? ` (${platform})` : ""} — ডাউনলোড`}
      </button>

      <p className="text-xs text-center opacity-50 leading-relaxed">
        {downloadType === "external"
          ? "তথ্যবক্স সফটওয়্যার ফাইল হোস্ট করে না। ডেভেলপার বা প্রকাশকের অফিসিয়াল ওয়েবসাইটে নিয়ে যাওয়া হয়।"
          : "এই রিসোর্সের ফাইল তথ্যবক্সের নিজস্ব সংরক্ষণ থেকে প্রদান করা হচ্ছে। ব্যবহারের আগে সফটওয়্যারের উৎস ও লাইসেন্স যাচাই করুন।"}
      </p>
    </div>
  );
}
