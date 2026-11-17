import type { Metadata } from "next"
import SkyView from "./view"
import type { Query } from "@/lib/design/use-place"

export const metadata: Metadata = {
  title: "Living sky",
  robots: { index: false, follow: false },
}

export default function Page({ searchParams }: { searchParams: Query & { brand?: string } }) {
  return <SkyView fixed={null} locate query={searchParams} initialBrand={searchParams.brand === "demo"} />
}
