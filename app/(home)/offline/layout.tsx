import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "অফলাইন | Totthobox",
  description: "ইন্টারনেট সংযোগ ফিরে এলে আবার চেষ্টা করুন।",
  robots: { index: false, follow: false },
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
