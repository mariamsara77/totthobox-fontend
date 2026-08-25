import { Metadata } from "next";
import { notFound } from "next/navigation";
import PersonShowClient from "./PersonShowClient";

type Props = { params: Promise<{ slug: string }> };

async function getPerson(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  const res = await fetch(`${base}/api/people/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPerson(slug);
  if (!person) {
    return {
      title: "প্রোফাইল পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const title = `${person.name} | প্রোফাইল আর্কাইভ | তথ্যবক্স`;
  const description = (person.bio || `${person.name} এর জীবনবৃত্তান্ত।`)
    .replace(/<[^>]+>/g, "")
    .slice(0, 155);

  return {
    title,
    description,
    keywords: `${person.name}, প্রোফাইল, জীবনী, কর্মজীবন, তথ্যবক্স`,
    openGraph: {
      title,
      description,
      images: person.image_url ? [{ url: person.image_url }] : [],
    },
    alternates: {
      canonical: `https://totthobox.com/bangladesh/public-figure/${person.slug}`,
    },
  };
}

export default async function PersonShowPage({ params }: Props) {
  const { slug } = await params;
  const person = await getPerson(slug);
  if (!person) {
    notFound();
  }
  return <PersonShowClient person={person} />;
}