"use client"

import { useEffect, useState } from "react"
import {
  getCityCurrentHour,
  getCityDay,
  getDayArcMessage,
  getDayContext,
  getDayMessage,
  getDayName,
  getHourFromISO,
  getHourLabel,
  getLocalTime,
  getMessage,
  getOutfit,
  getWind,
  getWindow,
  isNightHour,
} from "@/lib/weather"
import type { Place } from "./places"
import { conditionName, voice } from "./voice"

export type HourPoint = {
  time: string
  hour: number
  temp: number
  apparent: number
  rain: number
  code: number
  label: string
  when: string
  moment: string
  message: string
  outfit: string
  night: boolean
  tomorrow: boolean
  sub: string
}

export type Slot = {
  time: string
  label: string
  temp: number
  rain: number
  code: number
  night: boolean
}

export type DayPoint = {
  date: string
  name: string
  max: number
  min: number
  apparentMax: number
  code: number
  rain: number
  wind: number
  uv: number
  msg: string
  context: string
  outfit: string
  sunrise: string
  sunset: string
  slots: Slot[]
}

export type Forecast = {
  place: Place
  temp: number
  apparent: number
  rain: number
  wind: number
  code: number
  humidity: number
  condition: string
  message: string
  outfit: string
  windowText: string
  arc: string
  windLabel: string
  showFeels: boolean
  sunrise: string | null
  sunset: string | null
  uv: number
  localTime: string
  cityDay: string
  cityHour: number
  minute: number
  night: boolean
  todayHours: HourPoint[]
  nextHours: HourPoint[]
  days: DayPoint[]
  weekMin: number
  weekMax: number
}

function fallbackArc(hours: { temp: number; label: string; code: number }[]): string {
  if (hours.length < 2) return "The rest of the day stays close to this."
  const temps = hours.map((hour) => hour.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const last = hours[hours.length - 1]
  const rain = hours.find((hour, index) => index > 0 && hour.code >= 51)
  if (rain) return `Rain shows up around ${rain.label}. The day runs from ${min}° to ${max}°.`
  if (max - min <= 2) return `Steady from here, about ${min}° to ${max}°.`
  return `From ${hours[0].temp}° now, toward ${last.temp}° by ${last.label}. The day runs ${min}° to ${max}°.`
}

function sampleSlots(
  hours: { time: string; hour: number; temp: number; rain: number; code: number; night: boolean; label: string }[],
  isToday: boolean,
  cityHour: number
): Slot[] {
  const pool = isToday ? hours.filter((hour) => hour.hour >= cityHour) : hours
  const picked = pool.filter((hour, index) => (isToday && index === 0) || hour.hour % 3 === 0)
  const chosen = picked.length ? picked : pool.filter((_, index) => index % 3 === 0)
  return chosen.map((hour, index) => ({
    time: hour.time,
    label: isToday && index === 0 && hour.hour === cityHour ? "Now" : hour.label,
    temp: hour.temp,
    rain: hour.rain,
    code: hour.code,
    night: hour.night,
  }))
}

function buildForecast(place: Place, raw: any): Forecast | null {
  const current = raw?.current
  const hourly = raw?.hourly
  const daily = raw?.daily
  if (!current || !hourly?.time?.length || !daily?.time?.length) return null

  const offset = raw.utc_offset_seconds || 0
  const clock = new Date(Date.now() + offset * 1000)
  const cityHour = getCityCurrentHour(offset)
  const minute = clock.getUTCMinutes()
  const today = daily.time[0]
  const sunrise = daily.sunrise?.[0]?.split("T")[1]?.slice(0, 5) || null
  const sunset = daily.sunset?.[0]?.split("T")[1]?.slice(0, 5) || null
  const humidity = current.relative_humidity_2m ?? 50
  const shifted = new Date(Date.now() + offset * 1000).toISOString()

  const sunByDate: Record<string, { sunrise: string; sunset: string; uv: number }> = {}
  daily.time.forEach((date: string, index: number) => {
    sunByDate[date] = {
      sunrise: daily.sunrise?.[index]?.split("T")[1]?.slice(0, 5) || "06:00",
      sunset: daily.sunset?.[index]?.split("T")[1]?.slice(0, 5) || "18:00",
      uv: Math.round(daily.uv_index_max?.[index] ?? 0),
    }
  })

  const all = hourly.time.map((time: string, index: number) => {
    const date = time.slice(0, 10)
    const sun = sunByDate[date]
    return {
      time,
      date,
      hour: getHourFromISO(time),
      temp: Math.round(hourly.temperature_2m[index]),
      apparent: Math.round(hourly.apparent_temperature[index]),
      rain: hourly.precipitation_probability?.[index] ?? 0,
      code: hourly.weather_code[index],
      label: getHourLabel(time),
      night: isNightHour(time, sun?.sunset, sun?.sunrise),
      uv: sun?.uv ?? 0,
    }
  })

  let nowIndex = all.findIndex((hour) => hour.date === today && hour.hour === cityHour)
  if (nowIndex < 0) nowIndex = all.findIndex((hour) => hour.date === today && hour.hour >= cityHour)
  if (nowIndex < 0) nowIndex = 0

  const cityDay = getCityDay(offset)
  const nextRaw = all.slice(nowIndex, nowIndex + 24)
  const nextHours: HourPoint[] = nextRaw.map((hour, index) => {
    const globalIndex = nowIndex + index
    const tomorrow = hour.date !== today
    const weekday = new Date(`${hour.date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short" })
    const message = voice(
      getMessage(place.name, hour.temp, hour.apparent, hour.rain, hour.code, hour.hour, all.slice(globalIndex))
    )
    const outfit = voice(
      getOutfit(place.name, hour.temp, hour.apparent, hour.rain, hour.code, humidity, hour.uv, hour.hour)
    )
    return {
      time: hour.time,
      hour: hour.hour,
      temp: hour.temp,
      apparent: hour.apparent,
      rain: hour.rain,
      code: hour.code,
      label: hour.label,
      when: index === 0 ? "Now" : hour.label,
      moment: index === 0 ? `${cityDay}, now` : tomorrow ? `Tomorrow, ${hour.label}` : `${cityDay}, ${hour.label}`,
      message,
      outfit,
      night: hour.night,
      tomorrow,
      sub: tomorrow ? weekday : "",
    }
  })

  const todayOnly = nextHours.filter((hour) => !hour.tomorrow)
  const todayHours = todayOnly.length >= 3 ? todayOnly : nextHours.slice(0, Math.max(6, todayOnly.length))

  const prev: string[] = []
  const days: DayPoint[] = daily.time.slice(0, 12).map((date: string, index: number) => {
    const max = Math.round(daily.temperature_2m_max[index])
    const min = Math.round(daily.temperature_2m_min[index])
    const apparentMax = Math.round(daily.apparent_temperature_max?.[index] ?? max)
    const code = daily.weather_code[index]
    const rain = daily.precipitation_probability_max?.[index] ?? 0
    const wind = Math.round(daily.wind_speed_10m_max?.[index] ?? 0)
    const raw = getDayMessage(place.name, max, min, code, rain, apparentMax, prev)
    prev.push(raw)
    const dayHours = all.filter((hour) => hour.date === date && (index > 0 || hour.hour >= cityHour))
    const context = voice(getDayContext({ code, rain, max, min, wind }, dayHours))
    const outfit = voice(getOutfit(place.name, max, apparentMax, rain, code, humidity, sunByDate[date]?.uv ?? 0, 13))
    const dayAll = all.filter((hour) => hour.date === date)
    const slots = sampleSlots(dayAll, index === 0, cityHour)
    return {
      date,
      name: getDayName(date, index),
      max,
      min,
      apparentMax,
      code,
      rain,
      wind,
      uv: sunByDate[date]?.uv ?? 0,
      msg: voice(raw),
      context,
      outfit,
      sunrise: sunByDate[date]?.sunrise || "",
      sunset: sunByDate[date]?.sunset || "",
      slots,
    }
  })

  const temp = Math.round(current.temperature_2m)
  const apparent = Math.round(current.apparent_temperature)
  const rainNow = current.precipitation_probability ?? 0
  const codeNow = current.weather_code
  const arcSource = todayOnly.length ? all.slice(nowIndex, nowIndex + todayOnly.length) : nextRaw
  const arc = voice(getDayArcMessage(arcSource, place.name)) || fallbackArc(todayHours)
  const windowText =
    voice(getWindow(all, offset, codeNow, rainNow)) ||
    "The rest of the day is straightforward. No special timing to work around."

  const weekMin = Math.min(...days.map((day) => day.min))
  const weekMax = Math.max(...days.map((day) => day.max))

  return {
    place,
    temp,
    apparent,
    rain: rainNow,
    wind: Math.round(current.wind_speed_10m || 0),
    code: codeNow,
    humidity,
    condition: conditionName(codeNow),
    message: nextHours[0]?.message || voice(getMessage(place.name, temp, apparent, rainNow, codeNow, cityHour, nextRaw)),
    outfit: nextHours[0]?.outfit || "",
    windowText,
    arc,
    windLabel: voice(getWind(current.wind_speed_10m || 0)),
    showFeels: Math.abs(temp - apparent) >= 3,
    sunrise,
    sunset,
    uv: Math.round(daily.uv_index_max?.[0] ?? 0),
    localTime: getLocalTime(offset),
    cityDay,
    cityHour,
    minute,
    night: isNightHour(shifted, sunset, sunrise),
    todayHours,
    nextHours,
    days,
    weekMin,
    weekMax,
  }
}

export function useForecast(place: Place | null) {
  const [data, setData] = useState<Forecast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const lat = place?.lat
  const lon = place?.lon
  const name = place?.name

  useEffect(() => {
    if (!place || lat == null || lon == null || !name) return
    let cancel = false
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 14000)
    setLoading(true)
    setError(false)
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}` +
      `&current=temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m,weather_code,relative_humidity_2m` +
      `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,weather_code,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max` +
      `&wind_speed_unit=mph&temperature_unit=celsius&forecast_days=16&timezone=auto`

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("forecast")
        return response.json()
      })
      .then((raw) => {
        if (cancel) return
        const model = buildForecast(place, raw)
        if (!model) {
          setData(null)
          setError(true)
          return
        }
        setData(model)
      })
      .catch(() => {
        if (!cancel) {
          setData(null)
          setError(true)
        }
      })
      .finally(() => {
        clearTimeout(timer)
        if (!cancel) setLoading(false)
      })

    return () => {
      cancel = true
      controller.abort()
      clearTimeout(timer)
    }
      // Refetch only when the chosen city changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, name, attempt])

  return {
    data,
    loading: !place || loading,
    error,
    reload: () => setAttempt((value) => value + 1),
  }
}
