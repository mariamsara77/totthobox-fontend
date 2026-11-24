import type { Metadata } from "next";
import AdorshoLipiConverter from "./AdorshoLipiConverter";
import ToolGuide from "@/components/ToolGuide";
import { adarshalipiConverterGuide } from "@/lib/content/converters/adarshalipi";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/adarshalipi" },
  title: "উভয়মুখী আদর্শলিপি কনভার্টার - ইউনিকোড ⇄ ANSI | Totthobox",
  description:
    "ইউনিকোড থেকে আদর্শলিপি এবং আদর্শলিপি থেকে ইউনিকোড—উভয়মুখী রিয়েল-টাইম বাংলা লিপি কনভার্সন টুল ও প্রকাশনা নির্দেশিকা।",
  openGraph: {
    title: "উভয়মুখী আদর্শলিপি কনভার্টার - ইউনিকোড ⇄ ANSI | Totthobox",
    description:
      "ইউনিকোড থেকে আদর্শলিপি এবং আদর্শলিপি থেকে ইউনিকোড—উভয়মুখী রিয়েল-টাইম বাংলা লিপি কনভার্সন টুল ও প্রকাশনা নির্দেশিকা।",
    url: "https://totthobox.com/converter/adarshalipi",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "উভয়মুখী আদর্শলিপি কনভার্টার - ইউনিকোড ⇄ ANSI | Totthobox",
    description: "ইউনিকোড থেকে আদর্শলিপি এবং আদর্শলিপি থেকে ইউনিকোড—উভয়মুখী রিয়েল-টাইম বাংলা লিপি কনভার্সন টুল।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <AdorshoLipiConverter />
      <ToolGuide guide={adarshalipiConverterGuide} />
    </div>
  );
}
