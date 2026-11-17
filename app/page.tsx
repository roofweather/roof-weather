import type { Metadata } from "next"
import Home from "./home-client"

const title = "ROOF -- Weather, honestly."
const description = "Live weather for any city on earth. Plain language forecasts, no symbols, no percentages. Just the weather, told right."
const url = "https://www.roofweather.app"

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
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

export default function Page() {
  return <Home />
}
