import { Metadata } from "next";
import { Suspense } from "react";
import SoftwareClient from "./SoftwareClient";

export const metadata: Metadata = {
  title: "Latest Free Software & Apps Download | Verified Safe Resources | তথ্যবক্স",
  description:
    "Download 100% free and verified Windows, Android and Mac software, apps, and digital resources on Totthobox. Safe, fast and malware-free.",
  keywords:
    "free software download, safe apk, windows software, free digital resources, Totthobox, free apps download",
  alternates: {
    canonical: "https://totthobox.com/software/all",
  },
};

export default function SoftwarePage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <SoftwareClient platform="" />
    </Suspense>
  );
}