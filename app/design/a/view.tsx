"use client"

import { useEffect, useState } from "react"
import { countryLine } from "@/lib/design/places"
import { heatColor, skyScene, sunPosition } from "@/lib/design/theme"
import type { ViewProps } from "@/lib/design/use-place"
import { usePlace } from "@/lib/design/use-place"
import { useForecast } from "@/lib/design/use-forecast"
import { firstSentence, voice } from "@/lib/design/voice"
import { Chrome, CitySearch, Foot, Glyph, Status, useBrand, useThemeColor } from "../ui"

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(media.matches)
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [])
  return reduced
}

export default function SkyView({ fixed, locate, query, initialBrand }: ViewProps) {
  const place = usePlace(fixed, locate, query)
  const { data, loading, error, reload } = useForecast(place)
  const { brand, toggle } = useBrand(initialBrand)
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<"now" | "turn" | "night">("now")
  const [dayIndex, setDayIndex] = useState(0)

  useEffect(() => setDayIndex(0), [data?.place.lat, data?.place.lon])

  useEffect(() => {
    if (reduced) {
      setPhase("now")
      return
    }
    const nodes = document.querySelectorAll("[data-sky]")
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const value = hit?.target.getAttribute("data-sky")
        if (value === "now" || value === "turn" || value === "night") setPhase(value)
      },
      { threshold: [0.35, 0.6] }
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [reduced, data])

  const sun = data ? sunPosition(data.cityHour, data.minute, data.sunrise, data.sunset) : { alt: 0.6, x: 50, up: true }
  const nowScene = skyScene({
    code: data?.code ?? 1,
    temp: data?.temp ?? 16,
    night: data?.night ?? false,
    sunX: sun.x,
    sunAlt: sun.alt,
    brand,
  })
  const later = data?.todayHours[Math.max(0, data.todayHours.length - 1)]
  const turnScene = skyScene({
    code: later?.code ?? data?.code ?? 2,
    temp: later?.temp ?? data?.temp ?? 14,
    night: later?.night ?? false,
    sunX: later?.night ? 82 : 76,
    sunAlt: later?.night ? 0 : 0.2,
    brand,
  })
  const nightScene = skyScene({
    code: data?.code ?? 1,
    temp: data?.days[0]?.min ?? 8,
    night: true,
    sunX: 82,
    sunAlt: 0,
    brand,
  })
  const turnOk = turnScene.ink === nowScene.ink
  const nightOk = nightScene.ink === nowScene.ink
  const scene = reduced || phase === "now"
    ? nowScene
    : phase === "turn"
      ? turnOk
        ? turnScene
        : { ...nowScene, sunX: Math.min(88, nowScene.sunX + 16), sunY: Math.min(42, nowScene.sunY + 10), rain: Math.max(nowScene.rain, turnScene.rain), cloud: Math.max(nowScene.cloud, turnScene.cloud) }
      : nightOk
        ? nightScene
        : { ...nowScene, sun: false, stars: Math.max(nowScene.stars, 0.45), rain: Math.max(nowScene.rain, nightScene.rain) }
  useThemeColor(scene.bottom)

  const hours = data?.todayHours ?? []
  const hourMin = hours.length ? Math.min(...hours.map((hour) => hour.temp)) : 0
  const hourMax = hours.length ? Math.max(...hours.map((hour) => hour.temp)) : 1
  const country = data ? countryLine(data.place) : ""
  const note = fixed && data?.place.note ? voice(firstSentence(data.place.note)) : ""

  return (
    <div className="roof-proto sky-root" data-ink={scene.ink} data-brand={brand ? "on" : "off"}>
      <div className="sky-stage" aria-hidden="true">
        <div className={reduced || phase === "now" || (phase === "turn" && !turnOk) || (phase === "night" && !nightOk) ? "sky-layer on" : "sky-layer"} style={{ background: `linear-gradient(180deg, ${nowScene.top}, ${nowScene.mid} 48%, ${nowScene.bottom})` }} />
        <div className={!reduced && phase === "turn" && turnOk ? "sky-layer on" : "sky-layer"} style={{ background: `linear-gradient(180deg, ${turnScene.top}, ${turnScene.mid} 48%, ${turnScene.bottom})` }} />
        <div className={!reduced && phase === "night" && nightOk ? "sky-layer on" : "sky-layer"} style={{ background: `linear-gradient(180deg, ${nightScene.top}, ${nightScene.mid} 48%, ${nightScene.bottom})` }} />
        <div className="sky-warmth" style={{ opacity: scene.warmth, ["--sun-x" as string]: `${scene.sunX}%`, ["--sun-y" as string]: `${scene.sunY}%` }} />
        <div className={scene.sun ? "sky-sun" : "sky-moon"} style={{ left: `${scene.sunX}%`, top: `${scene.sunY}%`, opacity: scene.sun || scene.stars > 0.4 ? 1 : 0 }} />
        <div className="cloud c1" style={{ opacity: scene.cloud }} />
        <div className="cloud c2" style={{ opacity: scene.cloud * 0.9 }} />
        <div className="cloud c3" style={{ opacity: scene.cloud * 0.75 }} />
        <div className="cloud c4" style={{ opacity: Math.max(0, scene.cloud - 0.2) }} />
        <div className="sky-rain" style={{ opacity: scene.rain }} />
        <div className="sky-snow" style={{ opacity: scene.snow }} />
        <div className="sky-fog" style={{ opacity: scene.fog }} />
      </div>

      <div className="sky-content">
        <Chrome home="/design/a" brand={brand} onToggle={toggle} />
        <main className="sky-col">
          <section className="sky-hero" data-sky="now">
            <CitySearch direction="a" brand={brand} />
            <Status loading={loading && !data} error={error && !data} onRetry={reload} />
            {data && (
              <>
                <h1 className="place-name">{data.place.name}</h1>
                {country && <p className="place-sub">{country}</p>}
                <p className="clock">{data.cityDay}, {data.localTime}</p>
                <p className="temp num">{data.temp}°</p>
                <p className="facts">
                  {data.condition}
                  {data.showFeels ? `. Feels like ${data.apparent}°` : ""}. {data.windLabel}
                </p>
                <article className="glass hero-message">
                  <h2>ROOF</h2>
                  <p>{data.message}</p>
                  {note && <p className="soft sky-note">{note}</p>}
                </article>
                <div className="pair">
                  <article className="glass">
                    <h2>What to wear</h2>
                    <p>{data.outfit}</p>
                  </article>
                  <article className="glass">
                    <h2>Your window</h2>
                    <p>{data.windowText}</p>
                  </article>
                </div>
              </>
            )}
          </section>

          {data && (
            <section className="section" data-sky="turn">
              <div className="glass">
                <h2>The rest of today</h2>
                <p>{data.arc}</p>
                <div className="hour-row">
                  {hours.map((hour) => {
                    const height = 28 + ((hour.temp - hourMin) / Math.max(1, hourMax - hourMin)) * 72
                    return (
                      <div className="hcol" key={hour.time}>
                        <span className="hwhen">{hour.when}</span>
                        <span className="htrack" aria-hidden="true">
                          <span className="hfill" style={{ height: `${height}%`, background: heatColor(hour.temp, "dark") }} />
                        </span>
                        <Glyph code={hour.code} night={hour.night} size={26} />
                        <span className="htemp num">{hour.temp}°</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {data && (
            <section className="section" data-sky="night">
              <div className="glass">
                <h2>Next 12 days</h2>
                <p className="soft">From {data.weekMin}° to {data.weekMax}°. Tap a day to read it.</p>
                <div className="skyline">
                  {data.days.map((day, index) => {
                    const span = Math.max(0.5, data.weekMax - data.weekMin)
                    const bottom = ((day.min - data.weekMin) / span) * 100
                    const height = Math.max(12, ((day.max - day.min) / span) * 100)
                    return (
                      <button
                        type="button"
                        key={day.date}
                        className={index === dayIndex ? "thermo on" : "thermo"}
                        aria-pressed={index === dayIndex}
                        onClick={() => setDayIndex(index)}
                      >
                        <span className="thermo-hi num">{day.max}°</span>
                        <span className="thermo-col" aria-hidden="true">
                          <span
                            className="thermo-fill"
                            style={{
                              bottom: `${bottom}%`,
                              height: `${Math.min(height, 100 - bottom)}%`,
                              background: heatColor(day.max, "dark"),
                            }}
                          />
                        </span>
                        <span className="thermo-lo num">{day.min}°</span>
                        <span className="thermo-name">{day.name}</span>
                      </button>
                    )
                  })}
                </div>
                <div>
                  {data.days.map((day, index) => (
                    <button
                      type="button"
                      key={day.date}
                      className={index === dayIndex ? "dayline on" : "dayline"}
                      aria-pressed={index === dayIndex}
                      onClick={() => setDayIndex(index)}
                    >
                      <span className="who">{day.name}</span>
                      <span className="hi num">{day.max}°</span>
                      <span className="lo num">{day.min}°</span>
                      <span className="msg">{day.msg}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
          <Foot />
        </main>
      </div>
    </div>
  )
}
