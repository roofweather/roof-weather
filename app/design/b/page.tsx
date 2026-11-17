import type { Metadata } from "next"
import PosterView from "./view"
import type { Query } from "@/lib/design/use-place"

export const metadata: Metadata = {
  title: "Front page",
  robots: { index: false, follow: false },
}

export default function Page({ searchParams }: { searchParams: Query & { brand?: string } }) {
  return <PosterView fixed={null} locate query={searchParams} initialBrand={searchParams.brand === "demo"} />
}
