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
  title: "Software & Apps Directory",
  description:
    "Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপের তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স।",
  alternates: {
    canonical: "https://totthobox.com/software/all",
  },
  openGraph: {
    title: "Software & Apps Directory",
    description:
      "Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপের তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স।",
    type: "website",
    locale: "bn_BD",
    siteName: "তথ্যবক্স",
    url: "https://totthobox.com/software/all",
  
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software & Apps Directory",
    description:
      "Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপের তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স।",
  
    images: ["https://totthobox.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function SoftwarePage() {
  const initialData = await getInitialData();
  return <SoftwareClient platform="" initialData={initialData} />;
}
