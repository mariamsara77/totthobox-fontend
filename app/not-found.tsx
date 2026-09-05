import ErrorPage from "@/components/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      code="৪০৪"
      title="পেজটি খুঁজে পাওয়া যায়নি"
      description="আপনি যে পেজটি খুঁজছেন তা হয়তো সরানো হয়েছে, মুছে ফেলা হয়েছে অথবা লিংকটি ভুল রয়েছে।"
    />
  );
}
