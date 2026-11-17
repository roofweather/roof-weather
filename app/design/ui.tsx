"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { formatResult, matchSlug } from "@/lib/design/places"
import { rangeBox } from "@/lib/design/theme"

export type Direction = "a" | "b" | "c"

export function useBrand(initial: boolean) {
  const [brand, setBrand] = useState(initial)
  useEffect(() => setBrand(initial), [initial])

  function toggle() {
    setBrand((current) => {
      const next = !current
      const url = new URL(window.location.href)
      if (next) url.searchParams.set("brand", "demo")
      else url.searchParams.delete("brand")
      const query = url.searchParams.toString()
      window.history.replaceState(null, "", url.pathname + (query ? `?${query}` : ""))
      return next
    })
  }

  return { brand, toggle }
}

export function Chrome({
  home,
  brand,
  onToggle,
}: {
  home: string
  brand: boolean
  onToggle: () => void
}) {
  const homeHref = brand ? `${home}?brand=demo` : home
  return (
    <header className="chrome">
      <a className="brand-lock" href={homeHref}>
        <img src="/icon-192.png" width={26} height={26} alt="" />
        ROOF
      </a>
      <div className="chrome-actions">
        <a className="dir-link" href={brand ? "/design?brand=demo" : "/design"}>
          Directions
        </a>
        <button
          type="button"
          className="sponsor-btn"
          aria-pressed={brand}
          onClick={onToggle}
        >
          {brand ? "Clear sponsor" : "Sponsor"}
        </button>
      </div>
      <p className="chrome-tag">Weather, honestly.</p>
      {brand && (
        <p className="sponsor-banner" role="status">
          <span className="sponsor-dot" aria-hidden="true" />
          Presented by Example Festival
        </p>
      )}
    </header>
  )
}

type Hit = {
  id: number
  name: string
  country?: string
  admin1?: string
  latitude: number
  longitude: number
}

export function CitySearch({ direction, brand }: { direction: Direction; brand: boolean }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Hit[]>([])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setBusy(false)
      return
    }
    const timer = window.setTimeout(() => {
      setBusy(true)
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=5&language=en&format=json`
      )
        .then((response) => response.json())
        .then((data) => setResults(data.results || []))
        .catch(() => setResults([]))
        .finally(() => setBusy(false))
    }, 250)
    return () => window.clearTimeout(timer)
  }, [query])

  function choose(hit: Hit) {
    const slug = matchSlug(hit.name, hit.latitude, hit.longitude)
    if (slug) {
      router.push(`/design/${direction}/${slug}${brand ? "?brand=demo" : ""}`)
    } else {
      const params = new URLSearchParams({
        city: formatResult(hit),
        lat: String(hit.latitude),
        lon: String(hit.longitude),
        nogeo: "1",
      })
      if (brand) params.set("brand", "demo")
      router.push(`/design/${direction}?${params.toString()}`)
    }
    setQuery("")
    setResults([])
    setOpen(false)
  }

  return (
    <div className="d-search">
      <label className="sr-only" htmlFor={`city-${direction}`}>
        Search for a city
      </label>
      <input
        id={`city-${direction}`}
        value={query}
        placeholder="Any city, anywhere."
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open && (results.length > 0 || busy)}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 180)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false)
            setQuery("")
          }
          if (event.key === "Enter" && results[0]) {
            event.preventDefault()
            choose(results[0])
          }
        }}
      />
      {open && (busy || results.length > 0) && (
        <div className="d-results" role="listbox">
          {busy && results.length === 0 && <p className="d-empty">Searching...</p>}
          {results.map((hit) => (
            <button
              type="button"
              key={`${hit.id}-${hit.latitude}`}
              role="option"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(hit)}
            >
              <span>{hit.name}</span>
              <span className="d-meta">
                {[hit.admin1, hit.country].filter(Boolean).join(", ")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Glyph({ code, night, size = 26 }: { code: number; night?: boolean; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 32 32", fill: "none", "aria-hidden": true as const }
  if (code >= 95) {
    return (
      <svg {...props}>
        <path d="M7 18h16a5 5 0 0 0 .3-10 7 7 0 0 0-13.4-1.6A4.5 4.5 0 0 0 7 18z" fill="currentColor" />
        <path d="M17 19l-4 6h3l-1.5 5L20 23h-3l1-4z" fill="#F0C97A" />
      </svg>
    )
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return (
      <svg {...props}>
        <path d="M8 16h14a4.5 4.5 0 0 0 .2-9 6.2 6.2 0 0 0-11.8-1.4A4 4 0 0 0 8 16z" fill="currentColor" />
        <path d="M11 20v6M9 23h4M13.2 21.2l-4.4 4.4M8.8 21.2l4.4 4.4M20 21v6M18 24h4M22.2 22.2l-4.4 4.4M17.8 22.2l4.4 4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }
  if (code >= 51) {
    return (
      <svg {...props}>
        <path d="M7 16h16a5 5 0 0 0 .3-10 7 7 0 0 0-13.4-1.6A4.5 4.5 0 0 0 7 16z" fill="currentColor" />
        <path d="M12 19l-2 8M18 19l-2 8M24 19l-2 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (code === 45 || code === 48) {
    return (
      <svg {...props}>
        <path d="M5 12h22M7 17h18M9 22h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }
  if (code >= 2) {
    return (
      <svg {...props}>
        <path d="M8 22h15a5 5 0 0 0 .4-10 7 7 0 0 0-13.6-1.8A4.8 4.8 0 0 0 8 22z" fill="currentColor" />
      </svg>
    )
  }
  if (night) {
    return (
      <svg {...props}>
        <path d="M20 6.2A8.2 8.2 0 1 0 20 25.8 6.4 6.4 0 1 1 20 6.2z" fill="currentColor" />
      </svg>
    )
  }
  if (code === 1) {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M14 24h12a3.6 3.6 0 0 0 .2-7.2 5 5 0 0 0-9.6-1.2A3.4 3.4 0 0 0 14 24z" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <circle cx="16" cy="16" r="5" fill="currentColor" />
      <path d="M16 3.5v3.2M16 25.3v3.2M3.5 16h3.2M25.3 16h3.2M6.8 6.8l2.2 2.2M23 23l2.2 2.2M25.2 6.8 23 9M9 23l-2.2 2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function RangeBar({
  lo,
  hi,
  min,
  max,
  fill,
}: {
  lo: number
  hi: number
  min: number
  max: number
  fill: string
}) {
  const box = rangeBox(lo, hi, min, max)
  return (
    <span className="range" aria-hidden="true">
      <span className="range-fill" style={{ left: box.left, width: box.width, background: fill }} />
    </span>
  )
}

export function Status({
  loading,
  error,
  onRetry,
}: {
  loading: boolean
  error: boolean
  onRetry: () => void
}) {
  if (error) {
    return (
      <div className="status">
        <p>The weather did not load. Try again in a moment.</p>
        <button type="button" className="sponsor-btn" onClick={onRetry}>
          Try again
        </button>
      </div>
    )
  }
  if (loading) return <p className="status">Fetching the weather.</p>
  return null
}

export function useThemeColor(color: string) {
  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "theme-color"
    meta.content = color
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [color])
}

export function Foot() {
  return (
    <footer className="foot">
      <p>Weather, honestly.</p>
      <p>
        <a href="/">Current site</a>
        <span aria-hidden="true"> · </span>
        <a href="/design">All directions</a>
      </p>
      <p>Weather data from Open-Meteo.</p>
    </footer>
  )
}
