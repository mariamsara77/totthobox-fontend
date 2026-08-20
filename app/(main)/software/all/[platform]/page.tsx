import { Metadata } from "next";
import SoftwareClient from "../SoftwareClient";

type Props = {
  params: Promise<{ platform: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const platformName = decodeURIComponent(platform);

  const title = `Free ${platformName} Software Download | Safe & Verified Apps | তথ্যবক্স`;
  const description = `Download 100% free and verified ${platformName} software and apps on Totthobox. Safe, malware-free and regularly updated digital resources.`;
  const keywords = `free ${platformName.toLowerCase()} software, ${platformName.toLowerCase()} apps download, safe ${platformName.toLowerCase()} software, Totthobox`;

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
      canonical: `https://totthobox.com/software/all/${encodeURIComponent(platformName)}`,
    },
  };
}

export default async function PlatformSoftwarePage({ params }: Props) {
  const { platform } = await params;
  const platformName = decodeURIComponent(platform);

  return <SoftwareClient platform={platformName} />;
}