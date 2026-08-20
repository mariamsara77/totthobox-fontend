import type { Metadata } from "next";
import AdorshoLipiConverter from "./AdorshoLipiConverter";

export const metadata: Metadata = {
  title: "উভয়মুখী আদর্শলিপি কনভার্টার - ইউনিকোড ⇄ ANSI",
  description:
    "ইউনিকোড থেকে আদর্শলিপি এবং আদর্শলিপি থেকে ইউনিকোড—উভয়মুখী রিয়েল-টাইম বাংলা লিপি কনভার্সন টুল। প্রিন্টিং ও ওয়েব স্ট্যান্ডার্ড উভয়ের জন্য।",
  keywords: [
    "unicode to adorsholipi",
    "adorsholipi to unicode",
    "আদর্শলিপি টু ইউনিকোড",
    "bangla font converter",
    " আদর্শলিপি কনভার্টার",
    "ইউনিকোড কনভার্টার",
  ],
  openGraph: {
    title: "উভয়মুখী আদর্শলিপি কনভার্টার - ইউনিকোড ⇄ ANSI",
    description: "ইউনিকোড থেকে আদর্শলিপি এবং আদর্শলিপি থেকে ইউনিকোড—উভয়মুখী রিয়েল-টাইম বাংলা লিপি কনভার্সন টুল।",
    type: "website",
  },
};

export default function Page() {
  return <AdorshoLipiConverter />;
}