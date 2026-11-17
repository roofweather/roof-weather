import { CITY_DATA, resolveSlug } from "@/lib/cities"

export type Place = {
  name: string
  country?: string
  lat: number
  lon: number
  slug?: string
  note?: string
}

export const LONDON: Place = {
  name: "London",
  country: "United Kingdom",
  lat: 51.5074,
  lon: -0.1278,
  slug: "london",
  note: CITY_DATA.london.weatherNote,
}

export function placeFromSlug(raw: string): Place | null {
  const slug = resolveSlug(raw)
  if (!slug) return null
  const city = CITY_DATA[slug]
  return {
    name: city.name,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
    slug,
    note: city.weatherNote,
  }
}

export function matchSlug(name: string, lat: number, lon: number): string | null {
  const target = name.trim().toLowerCase()
  let best: { slug: string; distance: number } | null = null
  for (const [slug, city] of Object.entries(CITY_DATA)) {
    if (city.name.toLowerCase() !== target) continue
    const distance = (city.lat - lat) ** 2 + (city.lon - lon) ** 2
    if (!best || distance < best.distance) best = { slug, distance }
  }
  if (best && best.distance < 4) return best.slug
  return null
}

export function formatResult(result: { name: string; country?: string }): string {
  if (result.country && result.country !== result.name) return `${result.name}, ${result.country}`
  return result.name
}

export function countryLine(place: Place): string {
  if (!place.country) return ""
  if (place.name.toLowerCase().includes(place.country.toLowerCase())) return ""
  return place.country
}
