"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { formatResult, matchSlug } from "@/lib/design/places"

type Hit = {
  id: number
  name: string
  country?: string
  admin1?: string
  latitude: number
  longitude: number
}

export function CitySearch() {
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
    if (slug) router.push(`/${slug}`)
    else {
      const params = new URLSearchParams({
        city: formatResult(hit),
        lat: String(hit.latitude),
        lon: String(hit.longitude),
        nogeo: "1",
      })
      router.push(`/?${params.toString()}`)
    }
    setQuery("")
    setResults([])
    setOpen(false)
  }

  return (
    <div className="front-search">
      <label className="sr-only" htmlFor="city-search">
        Search for a city
      </label>
      <input
        id="city-search"
        value={query}
        placeholder="Any city, anywhere."
        autoComplete="off"
        enterKeyHint="search"
        aria-autocomplete="list"
        aria-controls="city-results"
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
        <div className="front-results" id="city-results">
          {busy && results.length === 0 && <p>Searching...</p>}
          {results.map((hit) => (
            <button
              type="button"
              key={`${hit.id}-${hit.latitude}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(hit)}
            >
              <span>{hit.name}</span>
              <span>{[hit.admin1, hit.country].filter(Boolean).join(", ")}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
