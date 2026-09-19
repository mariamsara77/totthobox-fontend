import type { Metadata } from "next";
import SoftwareClient from "../SoftwareClient";

type Props = {
  params: Promise<{
    platform: string;
  }>;
};

function formatPlatformName(value: string) {
  return decodeURIComponent(value).trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const platformName = formatPlatformName(platform);

  const title = `${platformName} Software & Apps | তথ্যবক্স`;

  const description = `${platformName} প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপ সম্পর্কে তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স দেখুন।`;

  const canonical = `https://totthobox.com/software/all/${encodeURIComponent(
    platformName,
  )}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "bn_BD",
      siteName: "তথ্যবক্স",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PlatformSoftwarePage({ params }: Props) {
  const { platform } = await params;
  const platformName = formatPlatformName(platform);

  return <SoftwareClient platform={platformName} />;
}
