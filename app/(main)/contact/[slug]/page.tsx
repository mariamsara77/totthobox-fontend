import { Metadata } from "next";
import ContactClient from "./ContactClient";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string }>;
};

async function getCategory(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://totthobox.com";
  const res = await fetch(`${base}/api/contacts/categories/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { search } = await searchParams;
  const category = await getCategory(slug);

  if (!category) {
    return { title: "ক্যাটাগরি পাওয়া যায়নি | তথ্যবক্স" };
  }

  const catName = category.name;
  const searchTerm = (search || "").trim();

  let title: string;
  let description: string;
  let keywords: string;

  if (searchTerm) {
    title = `"${searchTerm}" — ${catName} নম্বর | তথ্যবক্স`;
    description = `"${searchTerm}" সম্পর্কিত ${catName} যোগাযোগ নম্বর ও ঠিকানা।`;
    keywords = `${searchTerm}, ${catName}, জরুরী নম্বর, হেল্পলাইন`;
  } else {
    title = `জরুরী ${catName} ফোন নম্বর সারা বাংলাদেশ | তথ্যবক্স`;
    description = `সারাদেশের গুরুত্বপূর্ণ ${catName} যোগাযোগ নম্বর ও ঠিকানা। বিভাগ, জেলা, থানা দিয়ে খুঁজুন।`;
    keywords = `${catName}, ${catName} নম্বর, জরুরী সেবা, হেল্পলাইন, বাংলাদেশ`;
  }

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "bn_BD",
      siteName: "Totthobox",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: searchTerm
        ? `https://totthobox.com/contact/${slug}?search=${encodeURIComponent(searchTerm)}`
        : `https://totthobox.com/contact/${slug}`,
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-zinc-500">
        ক্যাটাগরি পাওয়া যায়নি
      </div>
    );
  }

  return <ContactClient category={category} />;
}