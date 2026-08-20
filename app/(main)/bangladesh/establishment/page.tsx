import { Metadata } from "next";
import EstablishmentClient from "./EstablishmentClient";

export const metadata: Metadata = {
  title: "বাংলাদেশের সকল গুরুত্বপূর্ণ স্থাপনা ও প্রতিষ্ঠান | তথ্যবক্স",
  description:
    "বাংলাদেশের সকল বিভাগ, জেলা ও থানার গুরুত্বপূর্ণ সরকারি-বেসরকারি প্রতিষ্ঠান, ঐতিহাসিক ভবন এবং প্রয়োজনীয় স্থাপনাসমূহের বিস্তারিত গাইড।",
  keywords: "বাংলাদেশ স্থাপনা, প্রতিষ্ঠান তালিকা, সরকারি দপ্তর, শিক্ষা প্রতিষ্ঠান, তথ্যবক্স",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/establishment",
  },
};

export default function EstablishmentPage() {
  return <EstablishmentClient />;
}