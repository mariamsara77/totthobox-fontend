import { Metadata } from "next";
import { Suspense } from "react";
import ContactClient from "./ContactClient";
import Disclaimer from "@/components/Disclaimer";
import { fetchApi } from "@/lib/api/fetcher";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const cats = await fetchApi<any[]>("/api/sidebar/contact-categories", {
      revalidate: CACHE_TTL.STATIC_CONTENT,
      tags: [CACHE_TAGS.CONTACTS],
    });
    return Array.isArray(cats)
      ? cats.filter((c) => c.slug).map((c) => ({ slug: c.slug }))
      : [{ slug: "police" }];
  } catch {
    return [{ slug: "police" }];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string }>;
};

async function getCategory(slug: string) {
  const json = await fetchApi<any>(`/api/contacts/categories/${slug}`, {
    revalidate: CACHE_TTL.STATIC_CONTENT,
    tags: [CACHE_TAGS.CONTACTS, `contacts:${slug}`],
  });
  return json?.data ?? null;
}

async function getInitialContacts(categoryId: number) {
  return await fetchApi<any>(
    `/api/contacts?category_id=${categoryId}&page=1&per_page=15`,
    {
      revalidate: CACHE_TTL.STATIC_CONTENT,
      tags: [CACHE_TAGS.CONTACTS],
    },
  );
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
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto p-4 text-center py-20 animate-pulse text-zinc-500">
          যোগাযোগ তথ্য প্রস্তুত হচ্ছে...
        </div>
      }
    >
      <div className="space-y-6">
        <ContactClient
          category={category}
          initialContactsData={initialContactsData}
        />
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <Disclaimer type={slug === "emergency" ? "emergency" : "general"} />
        </div>
      </div>
    </Suspense>
  );
}
