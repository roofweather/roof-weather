export type Ink = "light" | "dark"

export type SkyScene = {
  top: string
  mid: string
  bottom: string
  ink: Ink
  sun: boolean
  sunX: number
  sunY: number
  cloud: number
  rain: number
  snow: number
  stars: number
  fog: number
  warmth: number
  storm: boolean
}

export function sunPosition(
  hour: number,
  minute: number,
  sunrise: string | null,
  sunset: string | null
) {
  const toMinutes = (value: string) => {
    const [h, m] = value.split(":").map(Number)
    return h * 60 + (m || 0)
  }
  const now = hour * 60 + minute
  if (!sunrise || !sunset) {
    const day = hour >= 6 && hour < 20
    return { alt: day ? 0.7 : 0, x: day ? 50 : 78, up: day }
  }
  const start = toMinutes(sunrise)
  const end = toMinutes(sunset)
  if (now <= start || now >= end) return { alt: 0, x: now < start ? 16 : 84, up: false }
  const t = (now - start) / Math.max(1, end - start)
  return { alt: Math.sin(t * Math.PI), x: 14 + t * 72, up: true }
}

export function skyScene(opts: {
  code: number
  temp: number
  night: boolean
  sunX: number
  sunAlt: number
  brand: boolean
}): SkyScene {
  const { code, temp, night, sunX, sunAlt, brand } = opts
  const sunY = 8 + (1 - Math.max(0, Math.min(1, sunAlt))) * 32
  const rain = code >= 80 ? 0.9 : code >= 61 ? 0.7 : code >= 51 ? 0.38 : 0
  const snow = (code >= 71 && code <= 77) || (code >= 85 && code <= 86) ? 0.9 : 0
  if (brand) {
    return {
      top: "#3A1430",
      mid: "#5C1238",
      bottom: "#140910",
      ink: "light",
      sun: !night && code < 80,
      sunX,
      sunY,
      cloud: code >= 2 ? 0.6 : 0.22,
      rain,
      snow,
      stars: night && code <= 2 ? 0.95 : 0,
      fog: code === 45 || code === 48 ? 0.5 : 0,
      warmth: 0.4,
      storm: code >= 95,
    }
  }

  let top = "#9EC0E0"
  let mid = "#C5D8EC"
  let bottom = "#F5F4F0"
  let ink: Ink = "dark"
  if (night) {
    top = code >= 51 ? "#0A1224" : "#121A38"
    mid = "#0D0D0D"
    bottom = "#0D0D0D"
    ink = "light"
  } else if (code >= 95) {
    top = "#2A1848"
    mid = "#160E28"
    bottom = "#0D0D0D"
    ink = "light"
  } else if (code >= 61) {
    top = "#7E9BB8"
    mid = "#A8CAEF"
    bottom = "#D7E6F6"
  } else if (code >= 51 || code === 45 || code === 48 || code >= 3) {
    top = "#B7C5D2"
    mid = "#D5DEE6"
    bottom = "#F5F4F0"
  } else if (temp >= 28) {
    top = "#F6D59A"
    mid = "#F0C97A"
    bottom = "#E7A85C"
  } else if (temp >= 18) {
    top = "#7EB6E6"
    mid = "#A8CAEF"
    bottom = "#C8F0E0"
  } else if (sunAlt > 0 && sunAlt < 0.28) {
    top = "#F0A56A"
    mid = "#F0C97A"
    bottom = "#F6E7C4"
  }

  return {
    top,
    mid,
    bottom,
    ink,
    sun: !night && code < 45,
    sunX,
    sunY,
    cloud: code === 0 ? 0.15 : code === 1 ? 0.45 : night ? 0.25 : 0.78,
    rain,
    snow,
    stars: night && code <= 2 ? 1 : night ? 0.4 : 0,
    fog: code === 45 || code === 48 ? 0.72 : 0,
    warmth: !night && temp >= 26 ? Math.min(0.75, (temp - 24) / 14) : 0,
    storm: code >= 95,
  }
}

export type PosterTheme = {
  block: string
  fg: string
  soft: string
  paper: string
  ink: string
  muted: string
  wear: string
  wearFg: string
  windowBg: string
  windowFg: string
  rule: string
}

export function posterTheme(code: number, temp: number, night: boolean, brand: boolean): PosterTheme {
  const paper = brand ? "#F7F1E8" : "#F5F4F0"
  const base = {
    paper,
    ink: "#0D0D0D",
    muted: "#3F3E3A",
    wear: brand ? "#F0C97A" : "#C8F0E0",
    wearFg: "#0D0D0D",
    windowBg: brand ? "#1A1030" : "#0D0D0D",
    windowFg: "#F5F4F0",
    rule: "#0D0D0D",
  }
  if (brand) {
    return { ...base, block: "#5C1238", fg: "#F5F4F0", soft: "#F6D5E0", rule: "#F0C97A" }
  }
  if (night || code >= 95) {
    return { ...base, block: "#0D0D0D", fg: "#F5F4F0", soft: "#D9D6CE", rule: "#F0C97A" }
  }
  if (code >= 51 || code >= 3 || code === 45 || code === 48 || temp < 8) {
    return { ...base, block: "#A8CAEF", fg: "#0D0D0D", soft: "#14324A" }
  }
  if (temp >= 28) return { ...base, block: "#E07A3A", fg: "#0D0D0D", soft: "#2A1208" }
  if (temp >= 18) return { ...base, block: "#F0C97A", fg: "#0D0D0D", soft: "#3A2E10" }
  return { ...base, block: "#C8F0E0", fg: "#0D0D0D", soft: "#14352C" }
}

export type DialTheme = {
  bg: string
  ink: string
  soft: string
  card: string
  line: string
  accent: string
  accentInk: string
  track: string
}

export function dialTheme(code: number, temp: number, night: boolean, brand: boolean): DialTheme {
  if (brand) {
    if (night || code >= 51 || code >= 95) {
      return {
        bg: "#1A1030",
        ink: "#F5F4F0",
        soft: "#F0DCC4",
        card: "#271848",
        line: "#F0C97A",
        accent: "#F0C97A",
        accentInk: "#0D0D0D",
        track: "rgba(245,244,240,0.18)",
      }
    }
    if (temp >= 22) {
      return {
        bg: "#F0C97A",
        ink: "#0D0D0D",
        soft: "#3A2E10",
        card: "#FFF6DE",
        line: "#5C1238",
        accent: "#5C1238",
        accentInk: "#F5F4F0",
        track: "rgba(13,13,13,0.14)",
      }
    }
    return {
      bg: "#F7F1E8",
      ink: "#0D0D0D",
      soft: "#4A3A32",
      card: "#FFFFFF",
      line: "#5C1238",
      accent: "#5C1238",
      accentInk: "#F5F4F0",
      track: "rgba(13,13,13,0.12)",
    }
  }
  if (night) {
    return {
      bg: "#0D0D0D",
      ink: "#F5F4F0",
      soft: "#D9D6CE",
      card: "#1A1A1A",
      line: "#C8F0E0",
      accent: "#C8F0E0",
      accentInk: "#0D0D0D",
      track: "rgba(245,244,240,0.16)",
    }
  }
  if (code >= 95) {
    return {
      bg: "#1A1030",
      ink: "#F5F4F0",
      soft: "#E7D9F4",
      card: "#271848",
      line: "#F0C97A",
      accent: "#F0C97A",
      accentInk: "#0D0D0D",
      track: "rgba(245,244,240,0.16)",
    }
  }
  if (code >= 51) {
    return {
      bg: "#A8CAEF",
      ink: "#0D0D0D",
      soft: "#14324A",
      card: "#F5F4F0",
      line: "#14324A",
      accent: "#0D0D0D",
      accentInk: "#F5F4F0",
      track: "rgba(13,13,13,0.14)",
    }
  }
  if (code >= 3 || code === 45 || code === 48) {
    return {
      bg: "#E4E2DC",
      ink: "#0D0D0D",
      soft: "#3F3E3A",
      card: "#F5F4F0",
      line: "#14324A",
      accent: "#14324A",
      accentInk: "#F5F4F0",
      track: "rgba(13,13,13,0.12)",
    }
  }
  if (temp >= 28) {
    return {
      bg: "#E07A3A",
      ink: "#0D0D0D",
      soft: "#2A1208",
      card: "#FFF1E4",
      line: "#2A1208",
      accent: "#0D0D0D",
      accentInk: "#F5F4F0",
      track: "rgba(13,13,13,0.16)",
    }
  }
  if (temp >= 18) {
    return {
      bg: "#F0C97A",
      ink: "#0D0D0D",
      soft: "#3A2E10",
      card: "#FFF8E8",
      line: "#3A2E10",
      accent: "#0D0D0D",
      accentInk: "#F5F4F0",
      track: "rgba(13,13,13,0.14)",
    }
  }
  return {
    bg: "#C8F0E0",
    ink: "#0D0D0D",
    soft: "#14352C",
    card: "#F5F4F0",
    line: "#14352C",
    accent: "#0D0D0D",
    accentInk: "#F5F4F0",
    track: "rgba(13,13,13,0.12)",
  }
}

export function heatColor(temp: number, surface: "light" | "dark" = "light"): string {
  if (surface === "dark") {
    if (temp >= 28) return "#E07A3A"
    if (temp >= 20) return "#F0C97A"
    if (temp >= 12) return "#C8F0E0"
    return "#A8CAEF"
  }
  if (temp >= 28) return "#C2410C"
  if (temp >= 20) return "#8A5A10"
  if (temp >= 12) return "#1F6B4A"
  return "#1A4F86"
}

export function rangeBox(lo: number, hi: number, min: number, max: number) {
  const span = Math.max(0.5, max - min)
  const left = ((lo - min) / span) * 100
  const width = Math.max(8, ((hi - lo) / span) * 100)
  return {
    left: `${Math.max(0, Math.min(92, left))}%`,
    width: `${Math.min(width, 100 - Math.max(0, left))}%`,
  }
}
