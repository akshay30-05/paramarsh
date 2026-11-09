import type { MetadataRoute } from "next";
import { COMPANY, PAGES } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: COMPANY.url, changeFrequency: "monthly", priority: 1 },
    ...PAGES.map((p) => ({ url: `${COMPANY.url}${p.href}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${COMPANY.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${COMPANY.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
