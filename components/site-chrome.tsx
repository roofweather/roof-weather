import Image from "next/image"
import { brandTakeover } from "@/lib/brand"

const WAITLIST = "https://mailchi.mp/3e2b5f94e259/roof-waitlist-1"

export function SiteHeader() {
  return (
    <header className="front-bar">
      <a className="front-logo" href="/">
        <Image src="/icon-192.png" width={26} height={26} alt="" />
        ROOF
      </a>
      <p className="front-tag">Weather, honestly.</p>
      <nav className="front-nav" aria-label="Site">
        <a href="/about">About</a>
        <a href={WAITLIST}>Early access</a>
      </nav>
      {brandTakeover.enabled && brandTakeover.line ? (
        <p className="front-sponsor" role="status">
          <span className="front-dot" aria-hidden="true" />
          {brandTakeover.line}
        </p>
      ) : null}
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="front-foot">
      <p>Weather, honestly.</p>
      <p>
        <a href="/about">About</a>
        <span aria-hidden="true"> · </span>
        <a href={WAITLIST}>Early access</a>
      </p>
      <p>Weather data from Open-Meteo.</p>
    </footer>
  )
}
