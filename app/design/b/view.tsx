"use client"

import { countryLine } from "@/lib/design/places"
import { heatColor, posterTheme } from "@/lib/design/theme"
import { useForecast } from "@/lib/design/use-forecast"
import type { ViewProps } from "@/lib/design/use-place"
import { usePlace } from "@/lib/design/use-place"
import { firstSentence, voice } from "@/lib/design/voice"
import { Chrome, CitySearch, Foot, RangeBar, Status, useBrand, useThemeColor } from "../ui"

export default function PosterView({ fixed, locate, query, initialBrand }: ViewProps) {
  const place = usePlace(fixed, locate, query)
  const { data, loading, error, reload } = useForecast(place)
  const { brand, toggle } = useBrand(initialBrand)
  const theme = posterTheme(data?.code ?? 1, data?.temp ?? 16, data?.night ?? false, brand)
  useThemeColor(theme.block)

  const hours = data?.todayHours ?? []
  const hourMin = hours.length ? Math.min(...hours.map((hour) => hour.temp)) : 0
  const hourMax = hours.length ? Math.max(...hours.map((hour) => hour.temp)) : 1
  const message = data?.message ?? ""
  const msgClass = message.length > 180 ? "poster-msg long" : message.length > 110 ? "poster-msg mid" : "poster-msg"
  const country = data ? countryLine(data.place) : ""
  const note = fixed && data?.place.note ? voice(firstSentence(data.place.note)) : ""

  return (
    <div
      className="roof-proto poster-root"
      data-brand={brand ? "on" : "off"}
      style={{
        ["--paper" as string]: theme.paper,
        ["--ink" as string]: theme.ink,
        ["--muted" as string]: theme.muted,
      }}
    >
      <section
        className="poster-block"
        style={{
          ["--block" as string]: theme.block,
          ["--fg" as string]: theme.fg,
          ["--soft" as string]: theme.soft,
          ["--rule" as string]: theme.rule,
          background: theme.block,
          color: theme.fg,
        }}
      >
        <Chrome home="/design/b" brand={brand} onToggle={toggle} />
        <div className="poster-col">
          <CitySearch direction="b" brand={brand} />
          <Status loading={loading && !data} error={error && !data} onRetry={reload} />
          {data && (
            <>
              <p className="poster-place">ROOF</p>
              <h1 className="poster-city">{data.place.name}</h1>
              {country && <p className="poster-facts">{country}</p>}
              <p className="poster-facts">{data.cityDay}, {data.localTime}</p>
              <p className="poster-temp num">{data.temp}°</p>
              <p className="poster-facts">
                {data.condition}
                {data.showFeels ? `. Feels like ${data.apparent}°` : ""}. {data.windLabel}
              </p>
              <h2 className={msgClass}>{data.message}</h2>
              {note && <p className="poster-facts">{note}</p>}
              <hr className="poster-rule" />
            </>
          )}
        </div>
      </section>

      {data && (
        <section className="poster-sheet" style={{ background: theme.paper, color: theme.ink }}>
          <div className="poster-col">
            <div className="poster-pair">
              <article className="poster-card" style={{ background: theme.wear, color: theme.wearFg }}>
                <h2>What to wear</h2>
                <p>{data.outfit}</p>
              </article>
              <article className="poster-card" style={{ background: theme.windowBg, color: theme.windowFg }}>
                <h2>Your window</h2>
                <p>{data.windowText}</p>
              </article>
            </div>

            <h2 className="poster-kicker">Rest of today</h2>
            <p className="poster-lead">{data.arc}</p>
            <div className="poster-hours">
              {hours.map((hour) => {
                const height = 22 + ((hour.temp - hourMin) / Math.max(1, hourMax - hourMin)) * 78
                return (
                  <div className="phour" key={hour.time}>
                    <span>{hour.when}</span>
                    <strong className="num">{hour.temp}°</strong>
                    <span className="pbar" aria-hidden="true"><i style={{ height: `${height}%` }} /></span>
                  </div>
                )
              })}
            </div>

            <h2 className="poster-kicker">Next 12 days</h2>
            <p className="poster-lead">From {data.weekMin}° to {data.weekMax}°.</p>
            <div>
              {data.days.map((day) => (
                <div className="poster-day" key={day.date}>
                  <span className="who">{day.name}</span>
                  <p className="msg">{day.msg}</p>
                  <RangeBar lo={day.min} hi={day.max} min={data.weekMin} max={data.weekMax} fill={heatColor(day.max, "light")} />
                  <span className="hi num">{day.max}°</span>
                  <span className="lo num">{day.min}°</span>
                </div>
              ))}
            </div>
          </div>
          <Foot />
        </section>
      )}
    </div>
  )
}
