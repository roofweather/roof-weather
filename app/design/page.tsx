import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Design directions",
  robots: { index: false, follow: false },
}

const directions = [
  {
    id: "a",
    name: "Living sky",
    line: "The whole screen is a sky that follows the real weather, and the day reads as a story.",
  },
  {
    id: "b",
    name: "Front page",
    line: "A poster, not a dashboard. The plain-English line is the headline, set huge.",
  },
  {
    id: "c",
    name: "Time dial",
    line: "Swipe through the next hours and 12 days. Colour, temperature and advice move with you.",
  },
]

export default function DesignIndex({ searchParams }: { searchParams: { brand?: string } }) {
  const brand = searchParams.brand === "demo" ? "?brand=demo" : ""
  return (
    <main className="roof-proto index-page">
      <div className="index-wrap">
        <p className="index-kicker">ROOF · Weather, honestly.</p>
        <h1>Three directions</h1>
        <p className="index-lede">
          The live site is unchanged. These are prototypes. Open them on your phone and compare.
          Each one has the same search, the same big temperature, and a Sponsor button.
        </p>
        {directions.map((direction, index) => (
          <article key={direction.id} className={`direction ${direction.id}`}>
            <h2>
              <a href={`/design/${direction.id}${brand}`}>
                {String.fromCharCode(65 + index)}. {direction.name}
              </a>
            </h2>
            <p>{direction.line}</p>
            <nav aria-label={`${direction.name} links`}>
              <a href={`/design/${direction.id}${brand}`}>Homepage</a>
              <a href={`/design/${direction.id}/paris${brand}`}>Paris</a>
              <a href={`/design/${direction.id}/london${brand}`}>London</a>
            </nav>
          </article>
        ))}
        <p className="index-note">
          Sponsor shows a fictional takeover, Presented by Example Festival, so you can see a brand reskin the page without losing the forecast. The button sits in the header of every prototype.
        </p>
      </div>
    </main>
  )
}
