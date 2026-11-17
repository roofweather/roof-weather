'use client'

import { useState, useEffect } from "react"
import { CITY_DATA, type City } from "@/lib/cities"
import {
    getCityCurrentHour,
    getDayArcMessage,
    getDayContext,
    getHourFromISO,
    getHourLabel,
    getMessage,
    getOutfit,
    getWeatherGradient,
    getWindow,
    isNightHour,
} from "@/lib/weather"

// ─── CONTEXTUAL ADS ───────────────────────────────────────────
// To update ads: edit the ADS object below.
// Each city can have its own ad, or use "default" as fallback.
// weatherTrigger: "any" | "rain" | "clear" | "hot" | "cold"
// Set enabled: false to hide an ad without deleting it.

const ADS: Record<string, {
    enabled: boolean
    brand: string
    tagline: string
    message: string
    cta: string
    url: string
    weatherTrigger: "any" | "rain" | "clear" | "hot" | "cold"
}[]> = {
    default: [
        {
            enabled: true,
            brand: "Your brand here",
            tagline: "Supported by",
            message: "Reach travellers and locals checking the weather in this city. ROOF contextual advertising — weather-triggered, beautifully placed.",
            cta: "Advertise on ROOF →",
            url: "mailto:hello@roofweather.app",
            weatherTrigger: "any",
        }
    ],
    london: [
        {
            enabled: true,
            brand: "Your brand here",
            tagline: "Supported by",
            message: "Reach travellers and locals checking London weather. Context-first advertising that fits the forecast.",
            cta: "Advertise on ROOF →",
            url: "mailto:hello@roofweather.app",
            weatherTrigger: "any",
        }
    ],
}

function getAd(slug: string, weatherCode: number) {
    const cityAds = ADS[slug] || ADS["default"]
    const enabled = cityAds.filter(a => a.enabled)
    if (!enabled.length) return null
    // Weather-triggered selection
    const isRain = weatherCode >= 51
    const isClear = weatherCode <= 2
    const isHot = weatherCode <= 3 // will use temp below
    for (const ad of enabled) {
        if (ad.weatherTrigger === "any") return ad
        if (ad.weatherTrigger === "rain" && isRain) return ad
        if (ad.weatherTrigger === "clear" && isClear) return ad
    }
    return enabled[0]
}


// ─── WEATHER ICONS ───────────────────────────────────────────
function CityIconSun({ size = 24 }) {
    const c = size/2, r = size*0.22, ro = size*0.30, ri = size*0.40
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
            <circle cx={c} cy={c} r={r} fill="#F0C97A"/>
            {[0,45,90,135,180,225,270,315].map((deg,i)=>{
                const rad=deg*Math.PI/180
                return <line key={i} x1={c+ro*Math.cos(rad)} y1={c+ro*Math.sin(rad)} x2={c+ri*Math.cos(rad)} y2={c+ri*Math.sin(rad)} stroke="#F0C97A" strokeWidth={size*0.08} strokeLinecap="round"/>
            })}
        </svg>
    )
}
function CityIconCloud({ size = 24, color = "#AAAAAA" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M8 27a8 8 0 010-16 8 8 0 017.4 5A5 5 0 1128 27H8z" fill={color} opacity="0.9"/>
        </svg>
    )
}
function CityIconPartly({ size = 24, color = "#AAAAAA" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <circle cx="14" cy="13" r="6" fill="#F0C97A"/>
            <line x1="14" y1="3" x2="14" y2="6.5" stroke="#F0C97A" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="4" y1="13" x2="7.5" y2="13" stroke="#F0C97A" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="7" y1="6" x2="9.5" y2="8.5" stroke="#F0C97A" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="21" y1="6" x2="18.5" y2="8.5" stroke="#F0C97A" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M14 30a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1128 30H14z" fill={color} opacity="0.95"/>
        </svg>
    )
}
function CityIconRain({ size = 24, color = "#AAAAAA" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M8 21a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1126 21H8z" fill={color} opacity="0.85"/>
            <line x1="11" y1="25" x2="9" y2="32" stroke="#A8CAEF" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="19" y1="25" x2="17" y2="32" stroke="#A8CAEF" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
    )
}
function CityIconSnow({ size = 24, color = "#AAAAAA" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M8 21a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1126 21H8z" fill={color} opacity="0.85"/>
            <circle cx="12" cy="27" r="2" fill="#C8E8FF"/>
            <circle cx="20" cy="30" r="2" fill="#C8E8FF"/>
        </svg>
    )
}
function CityIconStorm({ size = 24, color = "#AAAAAA" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M6 20a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1124 20H6z" fill={color} opacity="0.85"/>
            <polyline points="16,22 13,28 17,28 14,34" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
    )
}
function CityIconFog({ size = 24, color = "#AAAAAA" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <line x1="4" y1="14" x2="32" y2="14" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
            <line x1="7" y1="20" x2="29" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.45"/>
            <line x1="10" y1="26" x2="26" y2="26" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
        </svg>
    )
}

function getCityWeatherIcon(code: number, isDark: boolean, size = 28) {
    const cloudColor = isDark ? "#888888" : "#AAAAAA"
    if (code === 0) return <CityIconSun size={size}/>
    if (code <= 2) return <CityIconPartly size={size} color={cloudColor}/>
    if (code === 3) return <CityIconCloud size={size} color={cloudColor}/>
    if (code <= 48) return <CityIconFog size={size} color={cloudColor}/>
    if (code <= 67) return <CityIconRain size={size} color={cloudColor}/>
    if (code <= 77) return <CityIconSnow size={size} color={cloudColor}/>
    if (code <= 82) return <CityIconRain size={size} color={cloudColor}/>
    return <CityIconStorm size={size} color={cloudColor}/>
}

// ─── WEATHER HELPERS ─────────────────────────────────────────
const WC_LABEL: Record<number, string> = {
    0:"Clear skies",1:"Mostly clear",2:"Partly cloudy",3:"Overcast",
    45:"Foggy",48:"Icy fog",51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",
    61:"Light rain",63:"Rain",65:"Heavy rain",71:"Light snow",73:"Snow",75:"Heavy snow",
    80:"Showers",81:"Heavy showers",82:"Violent showers",
    95:"Thunderstorm",96:"Thunderstorm with hail",99:"Severe thunderstorm",
}

function getConditionLabel(code: number): string {
    return WC_LABEL[code] || "Variable"
}

function getTempPill(apparent: number): string {
    if (apparent >= 35) return "Extreme heat"
    if (apparent >= 28) return "Very warm"
    if (apparent >= 22) return "Warm"
    if (apparent >= 16) return "Mild"
    if (apparent >= 10) return "Cool"
    if (apparent >= 4) return "Cold"
    return "Very cold"
}

function getRainPill(prob: number): string {
    if (prob >= 80) return "Rain likely"
    if (prob >= 50) return "Rain possible"
    if (prob >= 25) return "Small chance of rain"
    return "Dry"
}

function getWindPill(speed: number): string {
    if (speed >= 50) return "Very windy"
    if (speed >= 30) return "Windy"
    if (speed >= 15) return "Breezy"
    return "Light wind"
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function ROOFCity({ slug, city }: { slug: string; city: City }) {
    const MAILCHIMP_URL = "https://mailchi.mp/3e2b5f94e259/roof-waitlist-1"

    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    )
    const [weather, setWeather] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isDark, setIsDark] = useState(true)
    const [advice, setAdvice] = useState<null | {
        message: string
        outfit: string
        windowText: string | null
        dayContext: string
        arc: string | null
        hourly: { time: string; temp: number; apparent: number; rain: number; code: number }[]
        gradient: string
        textMode: "light" | "dark"
    }>(null)

    useEffect(() => {
        const check = () => { setIsMobile(window.innerWidth < 768) }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    // Force correct mobile viewport — in a useEffect so it runs after mount, not during render
    useEffect(() => {
        let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
        if (!meta) {
            meta = document.createElement('meta') as HTMLMetaElement
            meta.name = 'viewport'
            document.head.appendChild(meta)
        }
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0'
    }, [])

    useEffect(() => {
        let cancelled = false
        const fetchWeather = async () => {
            setLoading(true)
            setAdvice(null)
            try {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
                    `&current=temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m,weather_code,relative_humidity_2m` +
                    `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code` +
                    `&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,weather_code,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max` +
                    `&wind_speed_unit=mph&temperature_unit=celsius&forecast_days=10&timezone=auto`
                )
                const data = await res.json()
                if (cancelled) return
                setWeather(data)
                const current = data?.current
                const hourly = data?.hourly
                if (!current || !hourly?.time?.length) {
                    setAdvice(null)
                    return
                }
                const offset = data.utc_offset_seconds || 0
                const temp = Math.round(current.temperature_2m)
                const apparent = Math.round(current.apparent_temperature)
                const rain = current.precipitation_probability ?? 0
                const code = current.weather_code
                const humidity = current.relative_humidity_2m ?? 50
                const cityHour = getCityCurrentHour(offset)
                const allHours = hourly.time.map((t: string, i: number) => ({
                    time: t,
                    temp: Math.round(hourly.temperature_2m[i]),
                    apparent: Math.round(hourly.apparent_temperature[i]),
                    rain: hourly.precipitation_probability[i] ?? 0,
                    code: hourly.weather_code[i],
                }))
                const hours = allHours.filter((_: unknown, i: number) => i >= cityHour).slice(0, Math.max(12, 24 - cityHour))
                const sunrise = data.daily?.sunrise?.[0]?.split("T")[1]?.substring(0, 5) || null
                const sunset = data.daily?.sunset?.[0]?.split("T")[1]?.substring(0, 5) || null
                const uvRaw = data.daily?.uv_index_max?.[0]
                const uvIndex = uvRaw == null ? 0 : Math.round(uvRaw)
                const todayKey = data.daily?.time?.[0]
                const todayHours = (todayKey ? allHours.filter((h: { time: string }) => h.time.startsWith(todayKey)) : hours)
                    .filter((h: { time: string }) => getHourFromISO(h.time) >= cityHour)
                const day = {
                    code: data.daily?.weather_code?.[0] ?? code,
                    rain: data.daily?.precipitation_probability_max?.[0] ?? rain,
                    max: Math.round(data.daily?.temperature_2m_max?.[0] ?? temp),
                    min: Math.round(data.daily?.temperature_2m_min?.[0] ?? temp),
                    wind: Math.round(data.daily?.wind_speed_10m_max?.[0] || current.wind_speed_10m || 0),
                }
                const night = isNightHour(new Date(Date.now() + offset * 1000).toISOString(), sunset, sunrise)
                const gradient = getWeatherGradient(code, temp, night)
                setAdvice({
                    message: getMessage(city.name, temp, apparent, rain, code, cityHour, hours),
                    outfit: getOutfit(city.name, temp, apparent, rain, code, humidity, uvIndex, cityHour),
                    windowText: getWindow(hours, offset, code, rain),
                    dayContext: getDayContext(day, todayHours.length ? todayHours : hours),
                    arc: getDayArcMessage(hours, city.name),
                    hourly: hours,
                    gradient: gradient.gradient,
                    textMode: gradient.textMode === "dark" ? "dark" : "light",
                })
            } catch (e) {
                console.error(e)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        fetchWeather()
        return () => { cancelled = true }
    }, [city.lat, city.lon, city.name])

    // ─── THEME ───────────────────────────────────────────────
    const T = isDark ? {
        // Dark theme
        pageBg: "#0D0D0D",
        heroBg: "linear-gradient(180deg, #0D1F2D 0%, #0D0D0D 50%)",
        navLogo: "#FFFFFF",
        navLink: "#555555",
        eyebrow: "#444444",
        heroTitle: "#FFFFFF",
        heroSub: "#666666",
        cardBg: "rgba(255,255,255,0.04)",
        cardBorder: "rgba(255,255,255,0.08)",
        cardTemp: "#FFFFFF",
        cardCond: "#888888",
        pillBorder: "#2A2A2A",
        pillText: "#888888",
        ctaBg: "#C8F0E0",
        ctaText: "#0D0D0D",
        sectionBg: "#0D0D0D",
        sectionBg2: "#080808",
        sectionBorder: "#161616",
        sectionBorder2: "#111111",
        forecastCard: "#161616",
        forecastCardBorder: "#2A2A2A",
        forecastDay: "#666666",
        forecastHi: "#FFFFFF",
        forecastLo: "#888888",
        forecastCond: "#777777",
        adBg: "#080808",
        adCard: "#0D0D0D",
        adCardBorder: "#1A1A1A",
        adLabel: "#555555",
        adBrand: "#AAAAAA",
        adMsg: "#777777",
        adBtn: "#333333",
        adBtnText: "#AAAAAA",
        cultureLabel: "#555555",
        cultureText: "#888888",
        infoCard: "#141414",
        infoCardBorder: "#252525",
        infoLabel: "#555555",
        infoText: "#999999",
        insightTag: "#0D1F1A",
        insightTagBorder: "#1A3A2A",
        insightTagText: "#C8F0E0",
        insightQuote: "#FFFFFF",
        insightBtn: "#2A2A2A",
        insightBtnText: "#FFFFFF",
        cityPillBorder: "#2A2A2A",
        cityPillText: "#777777",
        cityPillBg: "#141414",
        waitlistBg: "#101010",
        waitlistLabel: "#555555",
        waitlistTitle: "#FFFFFF",
        waitlistSub: "#555555",
        waitlistBtn: "#FFFFFF",
        waitlistBtnText: "#0D0D0D",
        footerBg: "#0D0D0D",
        footerBorder: "#161616",
        footerLogo: "#FFFFFF",
        footerTag: "#333333",
        toggleBg: "rgba(255,255,255,0.06)",
        toggleBorder: "rgba(255,255,255,0.1)",
        toggleIcon: "#666666",
    } : {
        // Light theme
        pageBg: "#F5F4F0",
        heroBg: "linear-gradient(180deg, #D6EAF5 0%, #F5F4F0 60%)",
        navLogo: "#0D0D0D",
        navLink: "#999999",
        eyebrow: "#AAAAAA",
        heroTitle: "#0D0D0D",
        heroSub: "#888888",
        cardBg: "rgba(0,0,0,0.04)",
        cardBorder: "rgba(0,0,0,0.08)",
        cardTemp: "#0D0D0D",
        cardCond: "#666666",
        pillBorder: "#DDDDDD",
        pillText: "#777777",
        ctaBg: "#0D0D0D",
        ctaText: "#C8F0E0",
        sectionBg: "#F5F4F0",
        sectionBg2: "#EEEEED",
        sectionBorder: "#E8E7E3",
        sectionBorder2: "#E0DFD9",
        forecastCard: "#EBEBEA",
        forecastCardBorder: "#DEDDDA",
        forecastDay: "#AAAAAA",
        forecastHi: "#0D0D0D",
        forecastLo: "#BBBBBB",
        forecastCond: "#AAAAAA",
        adBg: "#EEEEED",
        adCard: "#F5F4F0",
        adCardBorder: "#DEDDDA",
        adLabel: "#BBBBBB",
        adBrand: "#777777",
        adMsg: "#999999",
        adBtn: "#DEDDDA",
        adBtnText: "#777777",
        cultureLabel: "#BBBBBB",
        cultureText: "#777777",
        infoCard: "#EBEBEA",
        infoCardBorder: "#DEDDDA",
        infoLabel: "#BBBBBB",
        infoText: "#888888",
        insightTag: "#E0F5EC",
        insightTagBorder: "#B8E8D0",
        insightTagText: "#1A7A4A",
        insightQuote: "#0D0D0D",
        insightBtn: "#DEDDDA",
        insightBtnText: "#0D0D0D",
        cityPillBorder: "#DEDDDA",
        cityPillText: "#AAAAAA",
        cityPillBg: "#EBEBEA",
        waitlistBg: "#EEEEED",
        waitlistLabel: "#BBBBBB",
        waitlistTitle: "#0D0D0D",
        waitlistSub: "#999999",
        waitlistBtn: "#0D0D0D",
        waitlistBtnText: "#F5F4F0",
        footerBg: "#F5F4F0",
        footerBorder: "#E8E7E3",
        footerLogo: "#0D0D0D",
        footerTag: "#BBBBBB",
        toggleBg: "rgba(0,0,0,0.04)",
        toggleBorder: "rgba(0,0,0,0.08)",
        toggleIcon: "#AAAAAA",
    }

    const pad = isMobile ? "0 20px" : "0 48px"
    const secPad = isMobile ? "48px 20px" : "64px 48px"
    const adviceTextDark = advice ? advice.textMode === "dark" : !isDark
    const heroBg = advice?.gradient || T.heroBg
    const heroTitle = advice ? (adviceTextDark ? "#0D0D0D" : "#FFFFFF") : T.heroTitle
    const heroSub = advice ? (adviceTextDark ? "#1A365D" : "rgba(255,255,255,0.78)") : T.heroSub
    const heroEyebrow = advice ? (adviceTextDark ? "#2C5282" : "rgba(255,255,255,0.55)") : T.eyebrow
    const navLogo = advice ? heroTitle : T.navLogo
    const navLink = advice ? (adviceTextDark ? "#1A365D" : "rgba(255,255,255,0.75)") : T.navLink

    const cur = weather?.current
    const daily = weather?.daily
    const temp = cur ? Math.round(cur.temperature_2m) : null
    const feels = cur ? Math.round(cur.apparent_temperature) : null
    const showFeels = temp !== null && feels !== null && Math.abs(temp - feels) >= 3
    const condition = cur ? getConditionLabel(cur.weather_code) : null
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

    return (
        <div style={{
            width: "100%",
            minHeight: "100vh",
            fontFamily: "Cabinet Grotesk, Inter, sans-serif",
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
            overflowX: "hidden",
            background: T.pageBg,
            transition: "background 0.25s ease",
        }}>

            {/* Nav + Hero */}
            <div style={{ width: "100%", background: heroBg, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>

                {/* Nav */}
                <div style={{ width: "100%", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: pad, boxSizing: "border-box" }}>
                    <a href="/" style={{ color: navLogo, fontSize: 20, fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>ROOF</a>
                    <div style={{ display: "flex", gap: isMobile ? 16 : 24, alignItems: "center" }}>
                        <a href="/about" style={{ color: navLink, fontSize: 13, textDecoration: "none" }}>About</a>
                        <span onClick={() => window.open(MAILCHIMP_URL, "_blank")} style={{ color: navLink, fontSize: 13, cursor: "pointer" }}>Join waitlist</span>
                        {/* Dark/light toggle */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            style={{
                                width: 36, height: 36, borderRadius: "50%",
                                border: `1px solid ${T.toggleBorder}`,
                                background: T.toggleBg,
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                padding: 0, flexShrink: 0,
                            }}
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="5" fill={T.toggleIcon}/>
                                    {[0,45,90,135,180,225,270,315].map((deg,i)=>{
                                        const rad=deg*Math.PI/180
                                        return <line key={i} x1={12+8.5*Math.cos(rad)} y1={12+8.5*Math.sin(rad)} x2={12+11*Math.cos(rad)} y2={12+11*Math.sin(rad)} stroke={T.toggleIcon} strokeWidth="2" strokeLinecap="round"/>
                                    })}
                                </svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill={T.toggleIcon}/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Hero */}
                <div style={{ padding: isMobile ? "48px 20px 56px" : "72px 48px 80px", boxSizing: "border-box" }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: heroEyebrow, margin: "0 0 20px" }}>
                        {city.name} · {city.country}
                    </p>
                    <h1 style={{ fontSize: isMobile ? 32 : 56, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.025em", color: heroTitle, margin: "0 0 24px", maxWidth: 700 }}>
                        {city.hero}
                    </h1>
                    <p style={{ fontSize: isMobile ? 15 : 19, color: heroSub, lineHeight: 1.7, maxWidth: 520, margin: "0 0 40px" }}>
                        {city.sub}
                    </p>

                    {/* Live weather card */}
                    {loading ? (
                        <div style={{ display: "inline-block", padding: "20px 28px", background: T.cardBg, borderRadius: 12, border: `1px solid ${T.cardBorder}` }}>
                            <p style={{ color: T.cardCond, fontSize: 14, margin: 0 }}>Loading {city.name} weather...</p>
                        </div>
                    ) : weather && cur ? (
                        <div style={{ display: "inline-block", padding: isMobile ? "20px 24px" : "24px 32px", background: T.cardBg, borderRadius: 16, border: `1px solid ${T.cardBorder}`, backdropFilter: "blur(8px)" }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                                <span style={{ fontSize: isMobile ? 56 : 80, fontWeight: 500, color: T.cardTemp, lineHeight: 1, letterSpacing: "-0.03em" }}>{temp}°</span>
                                {showFeels && <span style={{ fontSize: 16, color: T.cardCond }}>feels {feels}°</span>}
                            </div>
                            <p style={{ fontSize: 16, color: T.cardCond, margin: "0 0 16px" }}>{condition}</p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {[getTempPill(feels ?? temp ?? 15), getRainPill(cur.precipitation_probability), getWindPill(cur.wind_speed_10m)].map((pill, i) => (
                                    <span key={i} style={{ padding: "5px 14px", border: `1px solid ${T.pillBorder}`, borderRadius: 20, fontSize: 12, color: T.pillText, background: "transparent" }}>{pill}</span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {advice && (
                        <div style={{ marginTop: 28, maxWidth: 640 }}>
                            <p style={{ fontSize: isMobile ? 17 : 20, lineHeight: 1.65, color: heroTitle, margin: "0 0 10px", fontWeight: 500, letterSpacing: "-0.01em" }}>
                                {advice.message}
                            </p>
                            {advice.dayContext && (
                                <p style={{ fontSize: isMobile ? 14 : 15, lineHeight: 1.6, color: heroSub, margin: "0 0 18px" }}>
                                    {advice.dayContext}
                                </p>
                            )}
                            {advice.arc && (
                                <div style={{ marginBottom: 14, padding: "18px 20px", background: "#141414", borderRadius: 16, border: "1px solid #232323" }}>
                                    <p style={{ color: "#666", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 600 }}>The rest of your day</p>
                                    <p style={{ color: "#EEEEEE", fontSize: isMobile ? 15 : 16, lineHeight: 1.65, margin: 0 }}>{advice.arc}</p>
                                </div>
                            )}
                            {advice.hourly.length > 0 && (
                                <div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: 14 }}>
                                    <div style={{ display: "flex", gap: 8, width: "max-content", paddingBottom: 6 }}>
                                        {advice.hourly.map((h, i) => {
                                            const showFeelsH = Math.abs(h.temp - h.apparent) >= 3
                                            const iconCode = h.rain >= 55 && h.code <= 3 ? 51 : h.code
                                            return (
                                                <div key={i} style={{ flex: "0 0 auto", width: isMobile ? 76 : 88, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0 14px", background: "#111111", borderRadius: 14, border: "1px solid #1E1E1E" }}>
                                                    <span style={{ color: "#888", fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{getHourLabel(h.time)}</span>
                                                    <div style={{ marginBottom: 8 }}>{getCityWeatherIcon(iconCode, true, isMobile ? 26 : 28)}</div>
                                                    <span style={{ color: "#EEEEEE", fontSize: 18, fontWeight: 600 }}>{h.temp}°</span>
                                                    <span style={{ color: "#666", fontSize: 11, height: 14 }}>{showFeelsH ? `feels ${h.apparent}°` : ""}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {advice.outfit && (
                                    <div style={{ padding: isMobile ? "18px 18px" : "20px 22px", background: "#141414", borderRadius: 16, border: "1px solid #242424" }}>
                                        <p style={{ color: "#888", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 600 }}>What to wear</p>
                                        <p style={{ color: "#EEEEEE", fontSize: isMobile ? 15 : 16, lineHeight: 1.65, margin: 0 }}>{advice.outfit}</p>
                                    </div>
                                )}
                                {advice.windowText && (
                                    <div style={{ padding: isMobile ? "18px 18px" : "20px 22px", background: "#141414", borderRadius: 16, border: "1px solid #242424" }}>
                                        <p style={{ color: "#888", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 600 }}>Your window</p>
                                        <p style={{ color: "#EEEEEE", fontSize: isMobile ? 15 : 16, lineHeight: 1.65, margin: 0 }}>{advice.windowText}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div style={{ marginTop: 32 }}>
                        <a href={`/?city=${encodeURIComponent(city.name)}&lat=${city.lat}&lon=${city.lon}&nogeo=1`}
                            style={{ display: "inline-block", padding: isMobile ? "12px 24px" : "13px 28px", background: T.ctaBg, color: T.ctaText, borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", letterSpacing: "0.02em" }}>
                            Get the full {city.name} forecast →
                        </a>
                    </div>
                </div>
            </div>

            {/* 5-day forecast strip */}
            {daily && (
                <div style={{ background: T.sectionBg, padding: isMobile ? "32px 20px" : "40px 48px", borderTop: `1px solid ${T.sectionBorder}`, borderBottom: `1px solid ${T.sectionBorder}`, boxSizing: "border-box" }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.forecastDay, margin: "0 0 20px" }}>10-day forecast</p>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 5 : 5}, 1fr)`, gap: isMobile ? 8 : 12 }}>
                        {daily.time.slice(0, isMobile ? 5 : 10).map((dateStr: string, i: number) => {
                            const d = new Date(dateStr)
                            const dayName = dayNames[d.getDay()]
                            const hi = Math.round(daily.temperature_2m_max[i])
                            const lo = Math.round(daily.temperature_2m_min[i])
                            const cond = getConditionLabel(daily.weather_code[i])
                            return (
                                <div key={i} style={{ padding: isMobile ? "14px 12px" : "18px 16px", background: T.forecastCard, borderRadius: 12, border: `1px solid ${T.forecastCardBorder}` }}>
                                    <p style={{ fontSize: 11, color: T.forecastDay, margin: "0 0 10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{dayName}</p>
                                    <div style={{ marginBottom: 10 }}>{getCityWeatherIcon(daily.weather_code[i], isDark, isMobile ? 24 : 28)}</div>
                                    <p style={{ fontSize: isMobile ? 22 : 26, fontWeight: 500, color: T.forecastHi, margin: "0 0 3px", letterSpacing: "-0.02em" }}>{hi}°</p>
                                    <p style={{ fontSize: 12, color: T.forecastLo, margin: "0 0 8px" }}>{lo}° low</p>
                                    <p style={{ fontSize: 11, color: T.forecastCond, margin: 0, lineHeight: 1.4 }}>{cond}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── CONTEXTUAL AD SLOT ── */}
            {(() => {
                const ad = cur ? getAd(slug, cur.weather_code) : null
                if (!ad) return null
                return (
                    <div style={{ background: T.adBg, padding: isMobile ? "28px 20px" : "36px 48px", borderTop: `1px solid ${T.sectionBorder2}`, borderBottom: `1px solid ${T.sectionBorder2}`, boxSizing: "border-box" }}>
                        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: 20, maxWidth: 860, padding: isMobile ? "20px 20px" : "24px 28px", background: T.adCard, borderRadius: 14, border: `1px solid ${T.adCardBorder}` }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.adLabel, margin: "0 0 10px" }}>{ad.tagline}</p>
                                <p style={{ fontSize: 15, fontWeight: 500, color: T.adBrand, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{ad.brand}</p>
                                <p style={{ fontSize: 13, color: T.adMsg, lineHeight: 1.65, margin: 0, maxWidth: 520 }}>{ad.message}</p>
                            </div>
                            <a href={ad.url} target="_blank" rel="noopener noreferrer"
                                style={{ display: "inline-block", padding: "11px 22px", border: `1px solid ${T.adBtn}`, borderRadius: 8, fontSize: 13, fontWeight: 500, color: T.adBtnText, textDecoration: "none", whiteSpace: "nowrap", background: "transparent", flexShrink: 0 }}>
                                {ad.cta}
                            </a>
                        </div>
                    </div>
                )
            })()}

            {/* Cultural weather section */}
            <div style={{ background: T.sectionBg, padding: secPad, boxSizing: "border-box" }}>
                <div style={{ maxWidth: 640 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.cultureLabel, margin: "0 0 20px" }}>Weather in {city.name}</p>
                    <p style={{ fontSize: isMobile ? 15 : 18, color: T.cultureText, lineHeight: 1.85, margin: "0 0 32px" }}>{city.culture}</p>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                        <div style={{ padding: "20px 24px", background: T.infoCard, borderRadius: 12, border: `1px solid ${T.infoCardBorder}` }}>
                            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: T.infoLabel, margin: "0 0 10px" }}>Best time to visit</p>
                            <p style={{ fontSize: 14, color: T.infoText, lineHeight: 1.7, margin: 0 }}>{city.bestTime}</p>
                        </div>
                        <div style={{ padding: "20px 24px", background: T.infoCard, borderRadius: 12, border: `1px solid ${T.infoCardBorder}` }}>
                            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: T.infoLabel, margin: "0 0 10px" }}>What to know</p>
                            <p style={{ fontSize: 14, color: T.infoText, lineHeight: 1.7, margin: 0 }}>{city.weatherNote}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROOF insight */}
            <div style={{ background: T.sectionBg2, padding: secPad, borderTop: `1px solid ${T.sectionBorder2}`, boxSizing: "border-box" }}>
                <div style={{ maxWidth: 640 }}>
                    <span style={{ display: "inline-block", padding: "3px 12px", background: T.insightTag, border: `1px solid ${T.insightTagBorder}`, borderRadius: 20, fontSize: 11, color: T.insightTagText, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>ROOF insight</span>
                    <p style={{ fontSize: isMobile ? 18 : 26, fontWeight: 500, color: T.insightQuote, lineHeight: 1.5, letterSpacing: "-0.015em", margin: "0 0 32px", maxWidth: 580 }}>
                        "{city.tip}"
                    </p>
                    <a href={`/?city=${encodeURIComponent(city.name)}&lat=${city.lat}&lon=${city.lon}&nogeo=1`}
                        style={{ display: "inline-block", padding: "13px 28px", background: "transparent", color: T.insightBtnText, border: `1px solid ${T.insightBtn}`, borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none", letterSpacing: "0.02em" }}>
                        Check {city.name} weather now →
                    </a>
                </div>
            </div>

            {/* Other cities */}
            <div style={{ background: T.sectionBg, padding: secPad, borderTop: `1px solid ${T.sectionBorder}`, boxSizing: "border-box" }}>
                <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.cultureLabel, margin: "0 0 20px" }}>Other cities on ROOF</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {Object.entries(CITY_DATA).filter(([k]) => k !== slug).slice(0, 8).map(([k, c]) => (
                        <a key={k} href={`/${k}`} style={{ padding: "8px 18px", border: `1px solid ${T.cityPillBorder}`, borderRadius: 20, fontSize: 13, color: T.cityPillText, textDecoration: "none", background: T.cityPillBg }}>
                            {c.name}
                        </a>
                    ))}
                </div>
            </div>

            {/* Waitlist / Premium teaser */}
            <div style={{ background: T.waitlistBg, padding: secPad, borderTop: `1px solid ${T.sectionBorder2}`, textAlign: isMobile ? "left" : "center", boxSizing: "border-box" }}>
                <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: T.waitlistLabel, margin: "0 0 16px" }}>Coming soon</p>
                <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 500, color: T.waitlistTitle, letterSpacing: "-0.02em", margin: "0 0 16px" }}>ROOF Premium</h2>
                <p style={{ fontSize: isMobile ? 15 : 16, color: T.waitlistSub, margin: "0 0 32px", maxWidth: 420, marginLeft: isMobile ? 0 : "auto", marginRight: isMobile ? 0 : "auto", lineHeight: 1.7 }}>
                    Activity-based forecasts for {city.name}. Tell ROOF what you're doing — it plans around the weather for you.
                </p>
                <button onClick={() => window.open(MAILCHIMP_URL, "_blank")}
                    style={{ padding: "14px 32px", background: T.waitlistBtn, color: T.waitlistBtnText, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Cabinet Grotesk, Inter, sans-serif", letterSpacing: "0.02em" }}>
                    Join the waitlist
                </button>
            </div>

            {/* Footer */}
            <div style={{ background: T.footerBg, borderTop: `1px solid ${T.footerBorder}`, padding: isMobile ? "24px 20px" : "28px 48px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <a href="/" style={{ color: T.footerLogo, fontSize: 16, fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>ROOF</a>
                <span style={{ color: T.footerTag, fontSize: 12 }}>Weather, honestly.</span>
            </div>

        </div>
    )
}
