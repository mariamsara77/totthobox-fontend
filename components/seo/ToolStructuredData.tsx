export interface ToolStructuredDataProps {
  name: string;
  description: string;
  url: string;
  applicationCategory?:
    | "UtilityApplication"
    | "BusinessApplication"
    | "EducationalApplication"
    | "FinanceApplication"
    | "DeveloperApplication"
    | "CalculatorApplication"
    | "DesignApplication"
    | "EntertainmentApplication"
    | "ReferenceApplication"
    | (string & {});
  featureList?: string[];
}

export default function ToolStructuredData({
  name,
  description,
  url,
  applicationCategory = "UtilityApplication",
  featureList = [],
}: ToolStructuredDataProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    inLanguage: "bn-BD",
    publisher: {
      "@type": "Organization",
      name: "Totthobox",
      url: "https://totthobox.com",
      logo: "https://totthobox.com/og-image.png",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
    },
    ...(featureList.length > 0 && { featureList }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
