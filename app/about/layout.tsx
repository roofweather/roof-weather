import type { Metadata } from "next"

const title = "About ROOF"
const description = "ROOF tells you what the weather actually means. What to wear, when to go out, city by city."
const url = "https://www.roofweather.app/about"

export const metadata: Metadata = {
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
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
