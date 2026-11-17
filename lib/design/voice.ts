// Prototype copy cleanup only. Production advice stays in lib/weather.ts.

export function voice(text: string | null | undefined): string {
  if (!text) return ""
  return text
    .replace(/\u2014/g, ",")
    .replace(/\u2013/g, " to ")
    .replace(/\s+--\s+/g, ", ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\./g, ".")
    .trim()
}

export function conditionName(code: number): string {
  if (code === 0) return "Clear skies"
  if (code === 1) return "Mostly clear"
  if (code === 2) return "Partly cloudy"
  if (code === 3) return "Overcast"
  if (code === 45 || code === 48) return "Fog"
  if (code >= 51 && code <= 55) return "Drizzle"
  if (code >= 56 && code <= 57) return "Freezing drizzle"
  if (code >= 61 && code <= 65) return "Rain"
  if (code >= 66 && code <= 67) return "Freezing rain"
  if (code >= 71 && code <= 77) return "Snow"
  if (code >= 80 && code <= 82) return "Showers"
  if (code >= 85 && code <= 86) return "Snow showers"
  if (code >= 95) return "Thunderstorm"
  return "Mixed skies"
}

export function firstSentence(text?: string | null): string {
  if (!text) return ""
  const cut = text.split(/(?<=\.)\s/)[0] || text
  if (cut.length <= 180) return cut
  return cut.slice(0, 177).trimEnd() + "..."
}
