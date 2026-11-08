import type { MetadataRoute } from "next";
import { COMPANY } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: COMPANY.url, changeFrequency: "monthly", priority: 1 },
    { url: `${COMPANY.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${COMPANY.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
