import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-chrome"

export const metadata: Metadata = {
  title: "Page not found | ROOF",
  description: "That address is not a ROOF page.",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="front" style={{ background: "#0D0D0D", color: "#F5F4F0", minHeight: "100svh" }}>
      <section className="front-block" style={{ background: "#0D0D0D", color: "#F5F4F0", ["--fg" as string]: "#F5F4F0", ["--soft" as string]: "#D9D6CE" }}>
        <SiteHeader />
        <div className="front-col" style={{ paddingTop: 36, paddingBottom: 64 }}>
          <h1 className="front-msg">This page is not on ROOF</h1>
          <p className="front-facts">We could not find that address. The weather is still here.</p>
          <p style={{ marginTop: 18 }}>
            <a className="front-btn" href="/">Back to the weather</a>
          </p>
        </div>
      </section>
    </main>
  )
}
