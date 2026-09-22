import type { Metadata } from "next";
import SoftwareClient from "./SoftwareClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getInitialData() {
  const response = await fetch(`${API_BASE}/api/apps?page=1&per_page=12`, {
    next: { revalidate: 3600, tags: ["software-list"] },
  });
  if (!response.ok) throw new Error("Failed to load initial software data");
  return response.json();
}

export const metadata: Metadata = {
  title: "Software & Apps Directory | তথ্যবক্স",
  description:
    "Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপের তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স।",
  alternates: {
    canonical: "https://totthobox.com/software/all",
  },
  openGraph: {
    title: "Software & Apps Directory | তথ্যবক্স",
    description:
      "Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপের তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স।",
    type: "website",
    locale: "bn_BD",
    siteName: "তথ্যবক্স",
    url: "https://totthobox.com/software/all",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software & Apps Directory | তথ্যবক্স",
    description:
      "Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপের তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স।",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SoftwarePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto p-4 sm:p-6 text-center">
          লোড হচ্ছে...
        </div>
      }
    >
      <SoftwareClient platform="" />
    </Suspense>
  );
}
