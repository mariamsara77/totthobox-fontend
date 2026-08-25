import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পাসওয়ার্ড পুনরুদ্ধার",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}