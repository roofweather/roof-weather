import { SignupForm } from "./signup-form"

const promises = [
  {
    title: "Morning briefing",
    body: "What to wear and your best window for your city, every morning.",
  },
  {
    title: "Weather turns",
    body: "A heads-up before plans get rained on.",
  },
  {
    title: "Travel Mode",
    body: "The forecast and plain-English advice for wherever you're heading.",
  },
]

export function RoofIntelligence({
  city,
  suggestCity = false,
  heading = "h2",
}: {
  city?: string
  suggestCity?: boolean
  heading?: "h1" | "h2"
}) {
  const Title = heading
  return (
    <section className="intel" aria-labelledby="roof-intelligence-title">
      <p className="intel-kicker">Free membership</p>
      <Title id="roof-intelligence-title">Get ROOF Intelligence</Title>
      <p className="intel-lead">Your city, in plain English. Free.</p>
      <ul className="intel-promises">
        {promises.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.body}</span>
          </li>
        ))}
      </ul>
      <SignupForm city={city} suggestCity={suggestCity} />
    </section>
  )
}
