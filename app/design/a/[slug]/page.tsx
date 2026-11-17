import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { resolveSlug } from "@/lib/cities"
import { placeFromSlug } from "@/lib/design/places"
import SkyView from "../view"

type Props = { params: { slug: string }; searchParams: { brand?: string } }

export function generateMetadata({ params }: Props): Metadata {
  const place = placeFromSlug(params.slug)
  return {
    title: `${place?.name || "City"}, Living sky`,
    robots: { index: false, follow: false },
  }
}

export default function Page({ params, searchParams }: Props) {
  const slug = resolveSlug(params.slug)
  if (!slug) notFound()
  if (params.slug !== slug) permanentRedirect(`/design/a/${slug}`)
  const place = placeFromSlug(slug)
  if (!place) notFound()
  return <SkyView fixed={place} locate={false} initialBrand={searchParams.brand === "demo"} />
}
