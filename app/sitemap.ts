import type { MetadataRoute } from "next"
import { CITY_DATA } from "@/lib/cities"

const SITE = "https://www.roofweather.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: SITE, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/join`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...Object.keys(CITY_DATA).map((slug) => ({
      url: `${SITE}/${slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ]
}
