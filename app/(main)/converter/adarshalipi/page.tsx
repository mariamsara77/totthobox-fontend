import type { Metadata } from "next";
import AdorshoLipiConverter from "./AdorshoLipiConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/adarshalipi" },
  title: "উভয়মুখী আদর্শলিপি কনভার্টার - ইউনিকোড ⇄ ANSI",
  description:
    "ইউনিকোড থেকে আদর্শলিপি এবং আদর্শলিপি থেকে ইউনিকোড—উভয়মুখী রিয়েল-টাইম বাংলা লিপি কনভার্সন টুল। প্রিন্টিং ও ওয়েব স্ট্যান্ডার্ড উভয়ের জন্য।",
  openGraph: { title: "উভয়মুখী আদর্শলিপি কনভার্টার - ইউনিকোড ⇄ ANSI", description: "ইউনিকোড থেকে আদর্শলিপি এবং আদর্শলিপি থেকে ইউনিকোড—উভয়মুখী রিয়েল-টাইম বাংলা লিপি কনভার্সন টুল। প্রিন্টিং ও ওয়েব স্ট্যান্ডার্ড উভয়ের জন্য।", url: "https://totthobox.com/converter/adarshalipi", siteName: "Totthobox", type: "website", locale: "bn_BD", images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }] },
  twitter: { card: "summary_large_image", title: "উভয়মুখী আদর্শলিপি কনভার্টার - ইউনিকোড ⇄ ANSI", description: "ইউনিকোড থেকে আদর্শলিপি এবং আদর্শলিপি থেকে ইউনিকোড—উভয়মুখী রিয়েল-টাইম বাংলা লিপি কনভার্সন টুল। প্রিন্টিং ও ওয়েব স্ট্যান্ডার্ড উভয়ের জন্য।", images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }] },
};

export default function Page() {
  return <AdorshoLipiConverter />;
}