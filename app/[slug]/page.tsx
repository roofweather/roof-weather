import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { CITY_DATA, resolveSlug } from "@/lib/cities"
import CityView from "./city-view"

const SITE = "https://www.roofweather.app"

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return Object.keys(CITY_DATA).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = resolveSlug(params.slug)
  const city = slug ? CITY_DATA[slug] : undefined
  if (!city || !slug) {
    return {
      title: "Page not found | ROOF",
      robots: { index: false, follow: false },
    }
  }
  const title = `${city.name} weather | ROOF`
  const description = `${city.name} weather in plain English. What to wear, when to go out, and what the sky is actually doing.`
  const url = `${SITE}/${slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "ROOF",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default function CityPage({ params }: Props) {
  const slug = resolveSlug(params.slug)
  if (!slug || !CITY_DATA[slug]) notFound()
  if (params.slug !== slug) permanentRedirect(`/${slug}`)
  return <CityView slug={slug} city={CITY_DATA[slug]} />
}
