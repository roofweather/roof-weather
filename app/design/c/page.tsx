import type { Metadata } from "next"
import DialView from "./view"
import type { Query } from "@/lib/design/use-place"

export const metadata: Metadata = {
  title: "Time dial",
  robots: { index: false, follow: false },
}

export default function Page({ searchParams }: { searchParams: Query & { brand?: string } }) {
  return <DialView fixed={null} locate query={searchParams} initialBrand={searchParams.brand === "demo"} />
}
