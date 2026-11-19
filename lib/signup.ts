const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SignupPayload = {
  timestamp: string
  email: string
  firstName: string
  city: string
  country: string
  source: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
}

export type SignupResult =
  | { kind: "drop" }
  | { kind: "ok"; payload: SignupPayload }
  | { kind: "error"; error: string }

function text(value: unknown, max: number) {
  if (typeof value !== "string") return ""
  const clean = value.replace(/[\u0000-\u001F\u007F]/g, "").trim().replace(/\s+/g, " ")
  return clean.slice(0, max)
}

function sheetSafe(value: string) {
  if (/^[=+\-@]/.test(value)) return `'${value}`
  return value
}

function path(value: unknown) {
  const raw = text(value, 200).split("?")[0].split("#")[0]
  if (!/^\/[A-Za-z0-9._~/-]*$/.test(raw)) return ""
  return raw
}

export function readSignup(body: unknown, countryHeader: string | null): SignupResult {
  if (!body || typeof body !== "object") {
    return { kind: "error", error: "That did not look right. Please try again." }
  }
  const input = body as Record<string, unknown>
  const honeypot = text(input.website, 200)
  if (honeypot) return { kind: "drop" }

  if (typeof input.email !== "string" || !input.email.trim()) {
    return { kind: "error", error: "Add your email so we know where to send it." }
  }
  const email = input.email.trim().toLowerCase()
  if (email.length > 254 || !EMAIL.test(email)) {
    return { kind: "error", error: "That email does not look right." }
  }

  const firstName = text(input.firstName, 80)
  if (typeof input.firstName === "string" && input.firstName.trim().length > 60) {
    return { kind: "error", error: "That name is a bit long. Use a shorter one." }
  }
  const city = text(input.city, 100)
  if (typeof input.city === "string" && input.city.trim().length > 80) {
    return { kind: "error", error: "That city name is a bit long." }
  }

  const country = countryHeader && /^[A-Za-z]{2}$/.test(countryHeader) ? countryHeader.toUpperCase() : ""

  return {
    kind: "ok",
    payload: {
      timestamp: new Date().toISOString(),
      email: sheetSafe(email),
      firstName: sheetSafe(firstName),
      city: sheetSafe(city),
      country,
      source: path(input.source),
      utm_source: sheetSafe(text(input.utm_source, 80)),
      utm_medium: sheetSafe(text(input.utm_medium, 80)),
      utm_campaign: sheetSafe(text(input.utm_campaign, 80)),
    },
  }
}
