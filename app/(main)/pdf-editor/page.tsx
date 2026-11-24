import type { Metadata } from "next";
import PdfEditor from "@/components/pdf-editor/PdfEditor";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/pdf-editor" },
  openGraph: {
    title: "অনলাইন PDF এডিটর ও PDF টুলস | Totthobox",
    description: "ব্রাউজারেই PDF সম্পাদনা ও প্রয়োজনীয় PDF টুল ব্যবহার করুন।",
    url: "https://totthobox.com/pdf-editor",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন PDF এডিটর ও PDF টুলস | Totthobox",
    description: "ব্রাউজারেই PDF সম্পাদনা ও প্রয়োজনীয় PDF টুল ব্যবহার করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
  title: "ফ্রি অনলাইন PDF এডিটর | Edit PDF Online Free | Totthobox",
  description:
    "ব্রাউজারে সরাসরি PDF এডিট করুন বিনামূল্যে। টেক্সট যোগ, সিগনেচার, পেজ রোটেট ও কনভার্ট করুন সম্পূর্ণ নিরাপদে।",
};

export default function PdfEditorPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <header className="mx-auto mb-5 w-full max-w-4xl">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          ফ্রি অনলাইন PDF এডিটর
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          ব্রাউজারে PDF খুলুন, পৃষ্ঠা দেখুন এবং উপলভ্য সম্পাদনা সরঞ্জাম ব্যবহার করুন।
        </p>
      </header>
      <PdfEditor />
    </main>
  );
}
