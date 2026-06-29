import type { MetadataRoute } from "next";
import { productModules } from "@/lib/content/product";
import { guides } from "@/lib/content/resources";
import { faqEntries } from "@/lib/content/answers";
import { caseStudies } from "@/lib/content/customers";
import { sectors } from "@/lib/content/sectors";
import { docs } from "@/lib/content/docs";
import { siteConfig } from "@/lib/content/site";

const staticRoutes = [
  "",
  "/start",
  "/product",
  "/platform",
  "/founders",
  "/partners",
  "/pricing",
  "/customers",
  "/compare",
  "/resources",
  "/docs",
  "/glossary",
  "/changelog",
  "/contact",
  "/about",
  "/security",
  "/request-access",
  "/for-ai-founders",
  "/best-investor-outreach-tool",
  "/capsignal-vs-openvc",
  "/answers",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "/start" ? 0.95 : 0.8,
    })),
    ...faqEntries.map((e) => ({
      url: `${base}/answers/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...productModules.map((m) => ({
      url: `${base}/product/${m.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...guides.map((g) => ({
      url: `${base}/resources/${g.slug}`,
      lastModified: new Date(g.published),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...docs.map((d) => ({
      url: `${base}/docs/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...caseStudies.map((c) => ({
      url: `${base}/customers/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...sectors.map((s) => ({
      url: `${base}/solutions/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
