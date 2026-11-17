"use client"

import { useEffect, useState } from "react"
import { countryLine } from "@/lib/design/places"
import { dialTheme, heatColor } from "@/lib/design/theme"
import { useForecast, type DayPoint, type HourPoint } from "@/lib/design/use-forecast"
import type { ViewProps } from "@/lib/design/use-place"
import { usePlace } from "@/lib/design/use-place"
import { useSnap } from "@/lib/design/use-snap"
import { conditionName, firstSentence, voice } from "@/lib/design/voice"
import { Chrome, CitySearch, Foot, Glyph, RangeBar, Status, useBrand, useThemeColor } from "../ui"

export default function DialView({ fixed, locate, query, initialBrand }: ViewProps) {
  const place = usePlace(fixed, locate, query)
  const { data, loading, error, reload } = useForecast(place)
  const { brand, toggle } = useBrand(initialBrand)
  const [mode, setMode] = useState<"hour" | "day">("hour")
  const [hourIndex, setHourIndex] = useState(0)
  const [dayIndex, setDayIndex] = useState(0)

  useEffect(() => {
    setMode("hour")
    setHourIndex(0)
    setDayIndex(0)
  }, [data?.place.lat, data?.place.lon])

  const hours = data?.nextHours ?? []
  const days = data?.days ?? []
  const hour = hours[Math.min(hourIndex, Math.max(0, hours.length - 1))]
  const day = days[Math.min(dayIndex, Math.max(0, days.length - 1))]
  const showingDay = mode === "day" && !!day
  const theme = dialTheme(
    showingDay ? day.code : hour?.code ?? data?.code ?? 1,
    showingDay ? day.max : hour?.temp ?? data?.temp ?? 16,
    showingDay ? false : hour?.night ?? data?.night ?? false,
    brand
  )
  useThemeColor(theme.bg)

  const hourSnap = useSnap(hours.length, hourIndex, (next) => {
    setMode("hour")
    setHourIndex(next)
  })
  const daySnap = useSnap(days.length, dayIndex, (next) => {
    setMode("day")
    setDayIndex(next)
  })

  const hourMin = hours.length ? Math.min(...hours.map((item) => item.temp)) : 0
  const hourMax = hours.length ? Math.max(...hours.map((item) => item.temp)) : 1
  const surface = theme.ink === "light" ? "dark" : "light"
  const country = data ? countryLine(data.place) : ""
  const note = fixed && data?.place.note ? voice(firstSentence(data.place.note)) : ""
  const away = showingDay || hourIndex !== 0

  const temp = showingDay ? day.max : hour?.temp ?? data?.temp
  const message = showingDay ? day.msg : hour?.message ?? data?.message
  const outfit = showingDay ? day.outfit : hour?.outfit ?? data?.outfit
  const windowText = showingDay ? day.context : data?.windowText
  const condition = showingDay
    ? conditionName(day.code)
    : !showingDay && hourIndex === 0
      ? data?.condition
      : hour
        ? conditionName(hour.code)
        : data?.condition
  const feels = showingDay
    ? Math.abs(day.max - day.apparentMax) >= 3
      ? `Feels like ${day.apparentMax}°. `
      : ""
    : hour && Math.abs(hour.temp - hour.apparent) >= 3
      ? `Feels like ${hour.apparent}°. `
      : ""

  return (
    <div
      className="roof-proto dial-root"
      data-brand={brand ? "on" : "off"}
      style={{
        background: theme.bg,
        color: theme.ink,
        ["--soft" as string]: theme.soft,
        ["--panel" as string]: theme.card,
        ["--ink" as string]: theme.ink,
        ["--line" as string]: theme.line,
        ["--accent" as string]: theme.accent,
        ["--accent-ink" as string]: theme.accentInk,
        ["--track" as string]: theme.track,
      }}
    >
      <Chrome home="/design/c" brand={brand} onToggle={toggle} />
      <main className="dial-col">
        <CitySearch direction="c" brand={brand} />
        <Status loading={loading && !data} error={error && !data} onRetry={reload} />
        {data && hour && day && temp != null && (
          <>
            <p className="dial-place">{data.place.name}</p>
            {country && <p className="dial-moment">{country}</p>}
            <p className="dial-moment">{showingDay ? `${day.name} high` : hour.moment}</p>
            <p className="dial-temp num">{temp}°</p>
            {showingDay && <p className="dial-low num">Low {day.min}°</p>}
            <p className="dial-facts">{condition}. {feels}{showingDay ? "" : data.windLabel}</p>
            <p className="dial-message">{message}</p>
            {note && !showingDay && <p className="dial-facts">{note}</p>}
            {away && (
              <button type="button" className="dial-now" onClick={() => { setMode("hour"); setHourIndex(0) }}>
                Back to now
              </button>
            )}
            <div className="dial-pair">
              <article className="dial-card">
                <h2>What to wear</h2>
                <p>{outfit}</p>
              </article>
              <article className="dial-card">
                <h2>Your window</h2>
                <p>{windowText}</p>
              </article>
            </div>

            <section className="dial-block" aria-label="Next 24 hours">
              <div className="dial-kicker">
                <h2>Next 24 hours</h2>
                <span>Swipe</span>
              </div>
              <p className="hint">The page follows the hour in the centre.</p>
              <HourStrip
                hours={hours}
                index={mode === "hour" ? hourIndex : -1}
                hourMin={hourMin}
                hourMax={hourMax}
                surface={surface}
                snap={hourSnap}
                onPick={(index) => { setMode("hour"); setHourIndex(index) }}
              />
            </section>

            <section className="dial-block" aria-label="Next 12 days">
              <div className="dial-kicker">
                <h2>Next 12 days</h2>
                <span>{data.weekMin}° to {data.weekMax}°</span>
              </div>
              <p className="hint">Swipe the days. High, low and the line update together.</p>
              <DayStrip
                days={days}
                index={mode === "day" ? dayIndex : -1}
                weekMin={data.weekMin}
                weekMax={data.weekMax}
                surface={surface}
                snap={daySnap}
                onPick={(index) => { setMode("day"); setDayIndex(index) }}
              />
            </section>
            <p className="sr-only" aria-live="polite">
              {showingDay ? day.name : hour.moment}. {temp} degrees. {message}
            </p>
          </>
        )}
        <Foot />
      </main>
    </div>
  )
}

function HourStrip({
  hours,
  index,
  hourMin,
  hourMax,
  surface,
  snap,
  onPick,
}: {
  hours: HourPoint[]
  index: number
  hourMin: number
  hourMax: number
  surface: "light" | "dark"
  snap: ReturnType<typeof useSnap>
  onPick: (index: number) => void
}) {
  return (
    <div
      className="scroller"
      ref={snap.ref}
      onScroll={snap.onScroll}
      onPointerUp={snap.onSettle}
      role="listbox"
      aria-label="Next 24 hours"
    >
      <div className="spacer" aria-hidden="true" />
      {hours.map((hour, itemIndex) => {
        const height = 30 + ((hour.temp - hourMin) / Math.max(1, hourMax - hourMin)) * 70
        const on = itemIndex === index
        return (
          <button
            type="button"
            key={hour.time}
            data-snap
            role="option"
            aria-selected={on}
            className={on ? "snap on" : "snap"}
            onClick={() => onPick(itemIndex)}
          >
            <em>{hour.when}</em>
            <strong className="num">{hour.temp}°</strong>
            <span className="mini-track" aria-hidden="true">
              <i style={{ height: `${height}%`, background: on ? "currentColor" : heatColor(hour.temp, surface) }} />
            </span>
            <Glyph code={hour.code} night={hour.night} size={20} />
            {hour.sub && <em>{hour.sub}</em>}
          </button>
        )
      })}
      <div className="spacer" aria-hidden="true" />
    </div>
  )
}

function DayStrip({
  days,
  index,
  weekMin,
  weekMax,
  surface,
  snap,
  onPick,
}: {
  days: DayPoint[]
  index: number
  weekMin: number
  weekMax: number
  surface: "light" | "dark"
  snap: ReturnType<typeof useSnap>
  onPick: (index: number) => void
}) {
  return (
    <div
      className="scroller"
      ref={snap.ref}
      onScroll={snap.onScroll}
      onPointerUp={snap.onSettle}
      role="listbox"
      aria-label="Next 12 days"
      style={{ ["--snap" as string]: "200px" }}
    >
      <div className="spacer" aria-hidden="true" />
      {days.map((day, itemIndex) => {
        const on = itemIndex === index
        return (
          <button
            type="button"
            key={day.date}
            data-snap
            role="option"
            aria-selected={on}
            className={on ? "snap day-snap on" : "snap day-snap"}
            onClick={() => onPick(itemIndex)}
          >
            <em>{day.name}</em>
            <strong className="num">{day.max}°</strong>
            <em>{day.min}° low</em>
            <RangeBar lo={day.min} hi={day.max} min={weekMin} max={weekMax} fill={on ? "currentColor" : heatColor(day.max, surface)} />
            <span className="snap-msg">{day.msg}</span>
          </button>
        )
      })}
      <div className="spacer" aria-hidden="true" />
    </div>
  )
}
