import { Metadata } from "next";
import ContactClient from "./ContactClient";

type ContactCategory = {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string }>;
};

async function getCategory(slug: string): Promise<ContactCategory | null> {
  const configuredBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://admin.totthobox.com";
  let base =
    configuredBase.startsWith("https://") || configuredBase.startsWith("http://")
      ? configuredBase
      : "https://admin.totthobox.com";
  while (base.endsWith("/")) base = base.slice(0, -1);
  if (base.toLowerCase().endsWith("/api")) base = base.slice(0, -4);

  try {
    const res = await fetch(
      `${base}/api/contacts/categories/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 300, tags: [`contact-category:${slug}`] },
        signal: AbortSignal.timeout(1500),
      },
    );
    if (!res.ok) return null;
    const json: unknown = await res.json();
    if (!json || typeof json !== "object" || !("data" in json)) return null;

    const data = json.data;
    if (!data || typeof data !== "object") return null;

    const record = data as Record<string, unknown>;
    const id = typeof record.id === "number" ? record.id : Number(record.id);
    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      typeof record.name !== "string" ||
      !record.name.trim() ||
      typeof record.slug !== "string" ||
      !record.slug.trim()
    ) {
      return null;
    }

    return {
      id,
      name: record.name.trim(),
      slug: record.slug.trim(),
      ...(typeof record.icon === "string" ? { icon: record.icon } : {}),
      ...(typeof record.description === "string"
        ? { description: record.description }
        : {}),
    };
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
  let keywords: string;

  if (searchTerm) {
    title = `"${searchTerm}" — ${catName} নম্বর | তথ্যবক্স`;
    description = `"${searchTerm}" সম্পর্কিত ${catName} যোগাযোগ নম্বর ও ঠিকানা।`;
    keywords = `${searchTerm}, ${catName}, জরুরী নম্বর, হেল্পলাইন, তথ্যবক্স`;
  } else {
    title = `জরুরী ${catName} ফোন নম্বর সারা বাংলাদেশ | তথ্যবক্স`;
    description = `সারাদেশের গুরুত্বপূর্ণ ${catName} যোগাযোগ নম্বর ও ঠিকানা। বিভাগ, জেলা, থানা দিয়ে খুঁজুন।`;
    keywords = `${catName}, ${catName} নম্বর, জরুরী সেবা, হেল্পলাইন, বাংলাদেশ, তথ্যবক্স`;
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

  return <ContactClient category={category} />;
}
