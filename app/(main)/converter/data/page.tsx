import { Metadata } from "next";
import DataStorageConverter from "@/components/converter/DataStorageConverter";

export const metadata: Metadata = {
  title: "অনলাইন ডাটা স্টোরেজ রূপান্তরকারী - MB, GB, TB, PB | Totthobox",
  description:
    "সহজেই MB, GB, TB, PB কনভার্ট করুন। Totthobox-এর নিখুঁত Data Storage Converter।",
  keywords: [
    "ডাটা স্টোরেজ রূপান্তরকারী",
    "mb to gb",
    "data storage converter",
    "gb to tb",
    "Totthobox",
  ],
  openGraph: {
    title: "অনলাইন ডাটা স্টোরেজ রূপান্তরকারী - MB, GB, TB, PB | Totthobox",
    description:
      "সহজেই MB, GB, TB, PB কনভার্ট করুন। Totthobox-এর নিখুঁত Data Storage Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function DataStorageConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <DataStorageConverter />
    </div>
  );
}