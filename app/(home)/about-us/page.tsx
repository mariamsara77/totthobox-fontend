import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে",
  description: "Totthobox সম্পর্কে বিস্তারিত জানুন।",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800">আমাদের সম্পর্কে</h1>
      <p className="mt-4 text-slate-600">
        Totthobox-এ আপনাকে স্বাগতম। এটি আমাদের ডিজিটাল সেবার প্ল্যাটফর্ম।
      </p>
    </main>
  );
}