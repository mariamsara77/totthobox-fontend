import { Metadata } from "next";
import EstablishmentClient from "./EstablishmentClient";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getInitialData() {
  const response = await fetch(
    `${API_BASE}/api/establishment-bd?page=1&per_page=10`,
    { next: { revalidate: 3600, tags: ["establishment-bd-list"] } },
  );
  if (!response.ok) throw new Error("Failed to load initial establishment-bd data");
  return response.json();
}

export const metadata: Metadata = {
  title: "বাংলাদেশের সকল গুরুত্বপূর্ণ স্থাপনা ও প্রতিষ্ঠান | তথ্যবক্স",
  description:
    "বাংলাদেশের ৬৪ জেলার সরকারি-বেসরকারি প্রতিষ্ঠান, ঐতিহাসিক ভবন, শিক্ষা প্রতিষ্ঠান, হাসপাতাল, অফিস ও প্রয়োজনীয় স্থাপনাসমূহের সম্পূর্ণ তালিকা ও বিস্তারিত গাইড।",
  keywords: [
    "বাংলাদেশ স্থাপনা",
    "প্রতিষ্ঠান তালিকা",
    "সরকারি দপ্তর",
    "শিক্ষা প্রতিষ্ঠান",
    "ঐতিহাসিক ভবন",
    "বাংলাদেশ অফিস",
    "তথ্যবক্স",
  ],
  alternates: {
    canonical: "https://totthobox.com/bangladesh/establishment",
  },
  openGraph: {
    title: "বাংলাদেশের সকল গুরুত্বপূর্ণ স্থাপনা ও প্রতিষ্ঠান | তথ্যবক্স",
    description:
      "বাংলাদেশের ৬৪ জেলার সরকারি-বেসরকারি প্রতিষ্ঠান, ঐতিহাসিক ভবন ও প্রয়োজনীয় স্থাপনাসমূহের সম্পূর্ণ তালিকা।",
    url: "https://totthobox.com/bangladesh/establishment",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশের সকল গুরুত্বপূর্ণ স্থাপনা ও প্রতিষ্ঠান | তথ্যবক্স",
    description:
      "বাংলাদেশের ৬৪ জেলার সরকারি-বেসরকারি প্রতিষ্ঠান, ঐতিহাসিক ভবন ও প্রয়োজনীয় স্থাপনাসমূহের সম্পূর্ণ তালিকা।",
  },
};

export default function EstablishmentPage() {
  const initialData = await getInitialData();
  return <EstablishmentClient initialData={initialData} />;
}
