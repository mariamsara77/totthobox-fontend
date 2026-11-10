import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const revalidate = 1800;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string }>;
};

async function getCategory(slug: string) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  try {
    const res = await fetch(`${base}/api/contacts/categories/${slug}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

async function getInitialContacts(categoryId: number) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  try {
    const res = await fetch(
      `${base}/api/contacts?category_id=${categoryId}&page=1&per_page=15`,
      {
        next: { revalidate: 1800 },
      },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { search } = await searchParams;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "ক্যাটাগরি পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const catName = category.name;
  const searchTerm = (search || "").trim();

  let title: string;
  let description: string;

  if (searchTerm) {
    title = `"${searchTerm}" — ${catName} নম্বর | তথ্যবক্স`;
    description = `"${searchTerm}" সম্পর্কিত ${catName} যোগাযোগ নম্বর ও ঠিকানা।`;
  } else {
    title = `জরুরী ${catName} ফোন নম্বর সারা বাংলাদেশ | তথ্যবক্স`;
    description = `সারাদেশের গুরুত্বপূর্ণ ${catName} যোগাযোগ নম্বর ও ঠিকানা। বিভাগ, জেলা, থানা দিয়ে খুঁজুন।`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "bn_BD",
      siteName: "Totthobox",
      url: `https://totthobox.com/contact/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://totthobox.com/contact/${slug}`,
    },
    ...(searchTerm ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ContactPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center py-20">
        <p className="text-base font-medium">ক্যাটাগরি পাওয়া যায়নি</p>
        <p className="text-sm text-zinc-500 mt-1">অন্য ক্যাটাগরি চেষ্টা করুন</p>
      </div>
    );
  }

  const initialContactsData = await getInitialContacts(category.id);

  return (
    <ContactClient
      category={category}
      initialContactsData={initialContactsData}
    />
  );
}
