"use client"

import { useEffect, useState } from "react"
import { brandTakeover } from "@/lib/brand"
import { countryLine, matchSlug, type Place } from "@/lib/design/places"
import { heatColor, posterTheme } from "@/lib/design/theme"
import { useForecast, type Forecast } from "@/lib/design/use-forecast"
import { usePlace, type Query } from "@/lib/design/use-place"
import { voice } from "@/lib/design/voice"
import { WeatherMark } from "./weather-mark"
import { CitySearch } from "./city-search"
import { SiteFooter, SiteHeader } from "./site-chrome"
import { RoofIntelligence } from "./roof-intelligence"

export default function FrontPage({
  fixed,
  locate,
  query,
}: {
  fixed: Place | null
  locate: boolean
  query?: Query
}) {
  const { place, geo } = usePlace(fixed, locate, query)
  const { data, loading, error, reload } = useForecast(place)
  const [openDay, setOpenDay] = useState<number | null>(null)
  const theme = posterTheme(data?.code ?? 1, data?.temp ?? 16, data?.night ?? false, brandTakeover.enabled)
  const message = data?.message ?? ""
  const msgClass = message.length > 180 ? "front-msg long" : message.length > 110 ? "front-msg mid" : "front-msg"
  const country = data ? countryLine(data.place) : ""
  const liveClass = theme.fg === "#F5F4F0" ? "front-live on-dark" : "front-live"

  return (
    <div
      className="front"
      style={{
        ["--paper" as string]: theme.paper,
        ["--ink" as string]: theme.ink,
        ["--muted" as string]: theme.muted,
      }}
    >
      <section
        className="front-block"
        style={{
          ["--block" as string]: theme.block,
          ["--fg" as string]: theme.fg,
          ["--soft" as string]: theme.soft,
          ["--rule" as string]: theme.rule,
          background: theme.block,
          color: theme.fg,
        }}
      >
        <SiteHeader />
        <div className="front-col">
          {geo === "detecting" && <p className={liveClass} role="status">Finding your city...</p>}
          {geo === "detected" && (
            <p className={liveClass} role="status">
              <span className="front-live-dot" aria-hidden="true" />
              Your city, automatically
            </p>
          )}
          <CitySearch />
          {geo === "detecting" && !data && <p className="front-status">Finding your city...</p>}
          {geo !== "detecting" && loading && !data && <p className="front-status">Fetching the weather.</p>}
          {error && !data && (
            <div className="front-status">
              <p>The weather did not load. Try again in a moment.</p>
              <button type="button" onClick={reload}>Try again</button>
            </div>
          )}
          {data && (
            <>
              <p className="front-brand">ROOF</p>
              <h1 className="front-place">{data.place.name}</h1>
              {country && <p className="front-facts">{country}</p>}
              <p className="front-when">{data.cityDay}, {data.localTime}</p>
              <p className="front-temp">{data.temp}°</p>
              <p className="front-facts">
                {data.condition}
                {data.showFeels ? `. Feels like ${data.apparent}°` : ""}. {data.windLabel}
              </p>
              <h2 className={msgClass}>{message}</h2>
              <hr className="front-rule" />
            </>
          )}
        </div>
      </section>

      {data && (
        <section className="front-sheet" style={{ background: theme.paper, color: theme.ink }}>
          <div className="front-col">
            <div className="front-today">
              <h2 className="front-kicker">Rest of today</h2>
              <p className="front-arc">{data.arc}</p>
              <div className="front-hours" aria-label="Rest of today, hour by hour">
                {data.todayHours.map((hour) => (
                  <div className="hour" key={hour.time}>
                    <span className="when">{hour.when}</span>
                    <WeatherMark code={hour.code} night={hour.night} size={28} />
                    <span className="deg">{hour.temp}°</span>
                    <span className="rain">{hour.rain >= 20 ? `${hour.rain}%` : ""}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="front-pair">
              <article className="front-card" style={{ background: theme.wear, color: theme.wearFg }}>
                <h2>What to wear</h2>
                <p>{data.outfit}</p>
              </article>
              <article className="front-card" style={{ background: theme.windowBg, color: theme.windowFg }}>
                <h2>Your window</h2>
                <p>{data.windowText}</p>
              </article>
            </div>
            <DayList data={data} openDay={openDay} setOpenDay={setOpenDay} />
            <CityNotes place={data.place} />
            <SavedCities place={data.place} />
            <Share city={data.place.name} temp={data.temp} message={data.message} />
            <RoofIntelligence city={cityName(data.place.name)} />
          </div>
          <SiteFooter />
        </section>
      )}
    </div>
  )
}

function DayList({
  data,
  openDay,
  setOpenDay,
}: {
  data: Forecast
  openDay: number | null
  setOpenDay: (index: number | null) => void
}) {
  return (
    <div className="front-days">
      <h2>Next 12 days</h2>
      <p className="front-range-note">From {data.weekMin}° to {data.weekMax}°.</p>
      {data.days.map((day, index) => {
        const open = openDay === index
        const panelId = `day-${day.date}`
        return (
          <div key={day.date}>
            <button
              type="button"
              className="day-row"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenDay(open ? null : index)}
            >
              <span className="day-who">
                <WeatherMark code={day.code} night={false} size={26} />
                {day.name}
              </span>
              <span className="day-msg">{day.msg}</span>
              <span className="range" aria-hidden="true">
                <span
                  className="range-fill"
                  style={{
                    ...rangeStyle(day.min, day.max, data.weekMin, data.weekMax),
                    background: heatColor(day.max, "light"),
                  }}
                />
              </span>
              <span className="day-hi">{day.max}°</span>
              <span className="day-lo">{day.min}°</span>
            </button>
            {open && (
              <div className="day-open" id={panelId} role="region" aria-label={`${day.name} through the day`}>
                {day.slots.map((slot) => (
                  <div className="slot" key={slot.time}>
                    <span>{slot.label}</span>
                    <WeatherMark code={slot.code} night={slot.night} size={26} />
                    <span className="deg">{slot.temp}°</span>
                    <span>{slot.rain >= 20 ? `${slot.rain}%` : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function cityName(name: string) {
  const city = name.split(",")[0].trim()
  if (!city || city === "Your location" || city === "Chosen city") return ""
  return city
}

function rangeStyle(lo: number, hi: number, min: number, max: number) {
  const span = Math.max(0.5, max - min)
  const left = ((lo - min) / span) * 100
  const width = Math.max(8, ((hi - lo) / span) * 100)
  return {
    left: `${Math.max(0, Math.min(92, left))}%`,
    width: `${Math.min(width, 100 - Math.max(0, left))}%`,
  }
}

function CityNotes({ place }: { place: Place }) {
  if (!place.culture && !place.note && !place.tip) return null
  return (
    <section className="front-copy">
      <h2>Weather in {place.name}</h2>
      {place.culture && <p>{voice(place.culture)}</p>}
      <div className="front-pair">
        {place.bestTime && (
          <article className="front-card" style={{ background: "#C8F0E0", color: "#0D0D0D" }}>
            <h2>Best time to visit</h2>
            <p>{voice(place.bestTime)}</p>
          </article>
        )}
        {place.note && (
          <article className="front-card" style={{ background: "#0D0D0D", color: "#F5F4F0" }}>
            <h2>What to know</h2>
            <p>{voice(place.note)}</p>
          </article>
        )}
      </div>
      {place.tip && <p className="front-note">{voice(place.tip)}</p>}
    </section>
  )
}

function SavedCities({ place }: { place: Place }) {
  const [saved, setSaved] = useState<{ name: string; lat: number; lon: number }[]>([])
  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("roof_saved") || "[]"))
    } catch {
      setSaved([])
    }
  }, [])
  const already = saved.some((item) => item.name === place.name)
  function toggle() {
    const next = already
      ? saved.filter((item) => item.name !== place.name)
      : [...saved, { name: place.name, lat: place.lat, lon: place.lon }].slice(0, 5)
    setSaved(next)
    try {
      localStorage.setItem("roof_saved", JSON.stringify(next))
    } catch {
      /* ignore private mode */
    }
  }
  return (
    <div style={{ marginTop: 16 }}>
      <button type="button" onClick={toggle} style={{ fontWeight: 700, fontSize: 15, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 44 }}>
        {already ? "Saved" : "Save this city"}
      </button>
      {saved.length > 0 && (
        <p style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "8px 0 0" }}>
          {saved.map((item) => {
            const slug = matchSlug(item.name.split(",")[0], item.lat, item.lon)
            const href = slug
              ? `/${slug}`
              : `/?city=${encodeURIComponent(item.name)}&lat=${item.lat}&lon=${item.lon}&nogeo=1`
            return (
              <a key={item.name} href={href} style={{ fontWeight: 700, minHeight: 44, display: "inline-flex", alignItems: "center" }}>
                {item.name.split(",")[0]}
              </a>
            )
          })}
        </p>
      )}
    </div>
  )
}

function Share({ city, temp, message }: { city: string; temp: number; message: string }) {
  return (
    <p style={{ margin: "14px 0 0" }}>
      <button
        type="button"
        onClick={() => {
          const text = `${city}: ${temp}°. ${message}`
          const url = window.location.href
          if (navigator.share) navigator.share({ title: `${city} weather`, text, url }).catch(() => {})
          else navigator.clipboard?.writeText(`${text} ${url}`)
        }}
        style={{ fontWeight: 700, fontSize: 15, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 44 }}
      >
        Share this forecast
      </button>
    </p>
  )
}
