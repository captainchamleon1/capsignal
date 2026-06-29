import { siteConfig } from "@/lib/content/site";
import { capsignalPlan } from "@/lib/content/pricing";
import { selfServePricing } from "@/lib/content/guarantee";
import { faqEntries } from "@/lib/content/answers";

export function SiteJsonLd() {
  const url = siteConfig.url.replace(/\/$/, "");

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url,
    email: siteConfig.email,
    description: siteConfig.description,
    logo: `${url}/brand/logo-square.png`,
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url,
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: "99.99",
      priceCurrency: "USD",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      description: `${selfServePricing.trialLabel}, then ${capsignalPlan.price}/mo`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "47",
      bestRating: "5",
    },
    featureList: capsignalPlan.features.join(", "),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.slice(0, 12).map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
