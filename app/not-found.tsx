import type { Metadata } from "next";
import ErrorPage from "@/components/ErrorPage";

export const metadata: Metadata = {
  title: "পৃষ্ঠা পাওয়া যায়নি | Totthobox",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <ErrorPage
      code="৪০৪"
      title="পেজটি খুঁজে পাওয়া যায়নি"
      description="আপনি যে পেজটি খুঁজছেন তা হয়তো সরানো হয়েছে, মুছে ফেলা হয়েছে অথবা লিংকটি ভুল রয়েছে।"
    />
  );
}
