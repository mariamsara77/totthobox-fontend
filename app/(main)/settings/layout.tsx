import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "অ্যাকাউন্ট সেটিংস | Totthobox",
  robots: { index: false, follow: false },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
