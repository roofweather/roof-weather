import { CitySearch } from "@/components/city-search"
import { RoofIntelligence } from "@/components/roof-intelligence"
import { SiteFooter, SiteHeader } from "@/components/site-chrome"

const points = [
  {
    title: "Real language",
    lead: "Language is the product.",
    body: "No jargon for the sake of it. Just what the sky is doing and what to do about it. Other weather apps were built to display data. ROOF is built to explain it.",
    bg: "#0D0D0D",
    fg: "#F5F4F0",
  },
  {
    title: "Cultural intelligence",
    lead: "Every city speaks differently.",
    body: "40° in the Gulf is not 40° on the Mediterranean. The same forecast means different things in different places. ROOF speaks the local language.",
    bg: "#F0C97A",
    fg: "#0D0D0D",
  },
  {
    title: "What to wear",
    lead: "We tell you what to wear.",
    body: "A dedicated card, written for the city you are in. European summer, West African heat, and Gulf air conditioning each get their own answer.",
    bg: "#C8F0E0",
    fg: "#0D0D0D",
  },
  {
    title: "Honest uncertainty",
    lead: "When it is uncertain, we say so.",
    body: "A forecast sitting near the middle is not a yes or a no. ROOF says the morning looks safer, and tells you to keep a light layer close.",
    bg: "#A8CAEF",
    fg: "#0D0D0D",
  },
]

export default function AboutPage() {
  return (
    <main className="front">
      <section className="front-block" style={{ background: "#C8F0E0", color: "#0D0D0D", ["--fg" as string]: "#0D0D0D", ["--soft" as string]: "#14352C" }}>
        <SiteHeader />
        <div className="front-col" style={{ paddingBottom: 28 }}>
          <CitySearch />
          <p className="front-when">Weather, honestly.</p>
          <h1 className="front-msg">The first weather brand.</h1>
          <p className="front-facts">The first weather app built to communicate, not just display data.</p>
        </div>
      </section>
      <section className="front-sheet">
        <div className="front-col">
          <article className="front-card" style={{ background: "#0D0D0D", color: "#F5F4F0", marginTop: 16 }}>
            <h2>How ROOF works</h2>
            <p>
              ROOF translates weather data into the kind of explanation a well-informed local would give you. Not simplified. Interpreted. The same chance of rain means something different in Edinburgh than it does in Accra. Dubai humidity is not London drizzle. ROOF knows the difference.
            </p>
          </article>
          <h2 className="front-kicker" style={{ marginTop: 22 }}>What makes ROOF different</h2>
          <div className="front-pair">
            {points.map((point) => (
              <article key={point.title} className="front-card" style={{ background: point.bg, color: point.fg }}>
                <h2>{point.title}</h2>
                <p style={{ fontWeight: 650, marginBottom: 8 }}>{point.lead}</p>
                <p>{point.body}</p>
              </article>
            ))}
          </div>
          <RoofIntelligence suggestCity />
        </div>
        <SiteFooter />
      </section>
    </main>
  )
}
