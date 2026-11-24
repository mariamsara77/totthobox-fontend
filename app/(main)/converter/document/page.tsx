import type { Metadata } from "next";
import AdvancedDocumentConverter from "@/components/tools/AdvancedDocumentConverter";
import ToolGuide from "@/components/ToolGuide";
import { documentConverterGuide } from "@/lib/content/converters/document";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/document" },
  title: "অনলাইন ডকুমেন্ট কনভার্টার ও ফ্রি পিডিএফ টুলস | Totthobox",
  description:
    "ব্রাউজারে নিরাপদে পিডিএফ মার্জ, স্প্লিট, ইমেজ থেকে পিডিএফ ও ডকুমেন্ট রূপান্তর করুন। ১০০% প্রাইভেট, নো আপলোড ও ফ্রি অফিশিয়াল টুল।",
  openGraph: {
    title: "অনলাইন ডকুমেন্ট কনভার্টার ও ফ্রি পিডিএফ টুলস | Totthobox",
    description: "পিডিএফ মার্জ, স্প্লিট ও ডকুমেন্ট রূপান্তরের নিরাপদ ও ফ্রি ব্রাউজার টুল।",
    type: "website",
    url: "https://totthobox.com/converter/document",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন ডকুমেন্ট কনভার্টার ও ফ্রি পিডিএফ টুলস | Totthobox",
    description: "পিডিএফ মার্জ, স্প্লিট ও ডকুমেন্ট রূপান্তরের নিরাপদ ও ফ্রি ব্রাউজার টুল।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function DocumentConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-3xl mx-auto">
        <AdvancedDocumentConverter />
      </div>
      <ToolGuide guide={documentConverterGuide} />
    </div>
  );
}
