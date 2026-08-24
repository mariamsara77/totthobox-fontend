import { Metadata } from "next";
import EstablishmentShowClient from "./EstablishmentShowClient";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getEstablishment(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  const res = await fetch(`${base}/api/establishment-bd/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getEstablishment(slug);

  if (!item) {
    return { title: "স্থাপনা পাওয়া যায়নি | তথ্যবক্স" };
  }

  const title = `${item.title} | বাংলাদেশের স্থাপনা ও প্রতিষ্ঠান | তথ্যবক্স`;
  const description = (
    item.description || `${item.title} সম্পর্কে বিস্তারিত তথ্য।`
  )
    .replace(/<[^>]+>/g, "")
    .slice(0, 155);

  return {
    title,
    description,
    keywords: `${item.title}, বাংলাদেশ স্থাপনা, ${item.type_label || ""}, প্রতিষ্ঠান, তথ্যবক্স`,
    openGraph: {
      title,
      description,
      images: item.image_url ? [{ url: item.image_url }] : [],
      type: "article",
      locale: "bn_BD",
      siteName: "Totthobox",
    },
    alternates: {
      canonical: `https://totthobox.com/bangladesh/establishment/${item.slug}`,
    },
  };
}

export default async function EstablishmentShowPage({ params }: Props) {
  const { slug } = await params;
  const item = await getEstablishment(slug);

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center text-zinc-400">
        স্থাপনা পাওয়া যায়নি
      </div>
    );
  }

  return <EstablishmentShowClient establishment={item} />;
}