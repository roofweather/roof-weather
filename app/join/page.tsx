import type { Metadata } from "next"
import { RoofIntelligence } from "@/components/roof-intelligence"
import { SiteFooter, SiteHeader } from "@/components/site-chrome"

const title = "Get ROOF Intelligence"
const description = "Free ROOF Intelligence. A morning briefing, a warning when the weather turns, and the forecast for wherever you're heading."
const url = "https://www.roofweather.app/join"

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
    card: "summary",
    title,
    description,
  },
}

export default function JoinPage() {
  return (
    <main className="front">
      <section
        className="front-block"
        style={{ background: "#C8F0E0", color: "#0D0D0D", ["--fg" as string]: "#0D0D0D", ["--soft" as string]: "#14352C" }}
      >
        <SiteHeader />
      </section>
      <section className="front-sheet">
        <div className="front-col">
          <RoofIntelligence heading="h1" suggestCity />
        </div>
        <SiteFooter />
      </section>
    </main>
  )
}
