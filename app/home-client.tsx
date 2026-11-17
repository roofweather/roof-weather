'use client'

import { useState, useEffect } from "react"
import {
    getCityCurrentHour,
    getCityDay,
    getCondition,
    getConditionCategory,
    getDayArcMessage,
    getDayContext,
    getDayMessage,
    getDayName,
    getFeeling,
    getHourFromISO,
    getHourLabel,
    getLocalTime,
    getMessage,
    getOutfit,
    getRain,
    getWeatherGradient,
    getWind,
    getWindow,
    isNightHour,
} from "@/lib/weather"

// Parsed once when the browser evaluates this module — before any React
// rendering or effects fire. window is unavailable during SSR so the catch
// returns safe defaults; the browser re-evaluates the module with the real URL.
const _urlParams = (() => {
    try {
        const p = new URLSearchParams(window.location.search)
        return {
            nogeo: !!p.get("nogeo"),
            lat: p.get("lat") ? parseFloat(p.get("lat")) : null,
            lon: p.get("lon") ? parseFloat(p.get("lon")) : null,
            city: p.get("city") || null,
        }
    } catch {
        return { nogeo: false, lat: null, lon: null, city: null }
    }
})()

const DEFAULT_CITY = { name: "London", lat: 51.5074, lon: -0.1278 }
const MAILCHIMP_URL = "https://mailchi.mp/3e2b5f94e259/roof-waitlist-1"

// -- ICONS ---------------------------------------------------------

function IconSun({ size = 28 }) {
    const c = size / 2, r = size * 0.22, ro = size * 0.30, ri = size * 0.40
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
            <circle cx={c} cy={c} r={r} fill="#F0C97A"/>
            {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const rad = deg * Math.PI / 180
                return <line key={i} x1={c+ro*Math.cos(rad)} y1={c+ro*Math.sin(rad)} x2={c+ri*Math.cos(rad)} y2={c+ri*Math.sin(rad)} stroke="#F0C97A" strokeWidth={size*0.075} strokeLinecap="round"/>
            })}
        </svg>
    )
}

function IconHot({ size = 28 }) {
    const c = size / 2, r = size * 0.26, ro = size * 0.33, ri = size * 0.43
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
            <circle cx={c} cy={c} r={r} fill="#E8593C"/>
            {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const rad = deg * Math.PI / 180
                return <line key={i} x1={c+ro*Math.cos(rad)} y1={c+ro*Math.sin(rad)} x2={c+ri*Math.cos(rad)} y2={c+ri*Math.sin(rad)} stroke="#E8593C" strokeWidth={size*0.075} strokeLinecap="round"/>
            })}
        </svg>
    )
}

function IconMoon({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M27 23a12 12 0 01-15-15A12 12 0 1027 23z" fill="#8899BB"/>
        </svg>
    )
}

function IconSunnyIntervals({ size = 28, isNight = false, cloudColor = "#FFFFFF" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            {isNight ? (
                <path d="M18 12A6 6 0 0112 6a5 5 0 105.5 5.5A6 6 0 0118 12z" fill="#8899BB"/>
            ) : (
                <>
                    <circle cx="14" cy="13" r="6" fill="#F0C97A"/>
                    <line x1="14" y1="3" x2="14" y2="6.5" stroke="#F0C97A" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="4" y1="13" x2="7.5" y2="13" stroke="#F0C97A" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="7" y1="6" x2="9.5" y2="8.5" stroke="#F0C97A" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="21" y1="6" x2="18.5" y2="8.5" stroke="#F0C97A" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="24" y1="13" x2="20.5" y2="13" stroke="#F0C97A" strokeWidth="2.5" strokeLinecap="round"/>
                </>
            )}
            <path d="M14 30a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1128 30H14z" fill={cloudColor} opacity="0.95"/>
        </svg>
    )
}

function IconPartlyCloud({ size = 28, cloudColor = "#FFFFFF" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <circle cx="11" cy="13" r="5" fill="#F0C97A" opacity="0.6"/>
            <line x1="11" y1="4" x2="11" y2="6.5" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            <line x1="2" y1="13" x2="4.5" y2="13" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            <line x1="4.8" y1="6.8" x2="6.8" y2="8.8" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            <path d="M11 27a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1122 27H11z" fill={cloudColor}/>
        </svg>
    )
}

function IconCloud({ size = 28, cloudColor = "#FFFFFF" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M8 27a8 8 0 010-16 8 8 0 017.4 5A5 5 0 1128 27H8z" fill={cloudColor} opacity="0.9"/>
        </svg>
    )
}

function IconOvercast({ size = 28, cloudColor = "#FFFFFF" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M5 20a6 6 0 010-12 6 6 0 015.5 3.8A4 4 0 0118 16a4 4 0 013.6 5.7A3.5 3.5 0 0121.5 22H5z" fill={cloudColor} opacity="0.45"/>
            <path d="M10 28a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1127 28H10z" fill={cloudColor} opacity="0.75"/>
        </svg>
    )
}

function IconDrizzle({ size = 28, cloudColor = "#FFFFFF" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M8 21a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1126 21H8z" fill={cloudColor} opacity="0.85"/>
            <line x1="12" y1="26" x2="10.5" y2="32" stroke="#A8CAEF" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="20" y1="26" x2="18.5" y2="32" stroke="#A8CAEF" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
    )
}

function IconRain({ size = 28, cloudColor = "#FFFFFF" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M7 19a7.5 7.5 0 010-15 7.5 7.5 0 017 4.8A5 5 0 1127 19H7z" fill={cloudColor} opacity="0.8"/>
            <line x1="9" y1="24" x2="7" y2="32" stroke="#78AADB" strokeWidth="2.8" strokeLinecap="round"/>
            <line x1="17" y1="24" x2="15" y2="32" stroke="#78AADB" strokeWidth="2.8" strokeLinecap="round"/>
            <line x1="25" y1="24" x2="23" y2="32" stroke="#78AADB" strokeWidth="2.8" strokeLinecap="round"/>
        </svg>
    )
}

function IconHeavyRain({ size = 28, cloudColor = "#CCDDEE" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M6 17a8 8 0 010-16 8 8 0 017.4 5A5 5 0 1126 17H6z" fill={cloudColor} opacity="0.8"/>
            <line x1="7" y1="22" x2="4.5" y2="32" stroke="#4A88CC" strokeWidth="3.2" strokeLinecap="round"/>
            <line x1="14" y1="22" x2="11.5" y2="32" stroke="#4A88CC" strokeWidth="3.2" strokeLinecap="round"/>
            <line x1="21" y1="22" x2="18.5" y2="32" stroke="#4A88CC" strokeWidth="3.2" strokeLinecap="round"/>
            <line x1="28" y1="22" x2="25.5" y2="32" stroke="#4A88CC" strokeWidth="3.2" strokeLinecap="round"/>
        </svg>
    )
}

function IconWarmShower({ size = 28, cloudColor = "#FFFFFF" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <circle cx="10" cy="11" r="5.5" fill="#F0C97A"/>
            <line x1="10" y1="1.5" x2="10" y2="4.5" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="1.5" y1="11" x2="4.5" y2="11" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4" y1="4" x2="6.2" y2="6.2" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="4" x2="13.8" y2="6.2" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="10" y1="20" x2="10" y2="17.5" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 26a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1127 26H12z" fill={cloudColor}/>
            <line x1="15" y1="29" x2="13.5" y2="35" stroke="#78AADB" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="22" y1="29" x2="20.5" y2="35" stroke="#78AADB" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
    )
}

function IconHeavyWarmShower({ size = 28, cloudColor = "#CCDDEE" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <circle cx="9" cy="10" r="5" fill="#F0C97A"/>
            <line x1="9" y1="1" x2="9" y2="4" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="1" y1="10" x2="4" y2="10" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3.5" y1="3.5" x2="5.6" y2="5.6" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14.5" y1="3.5" x2="12.4" y2="5.6" stroke="#F0C97A" strokeWidth="2" strokeLinecap="round"/>
            <path d="M11 24a7.5 7.5 0 010-15 7.5 7.5 0 017 4.8A5 5 0 1130 24H11z" fill={cloudColor}/>
            <line x1="13" y1="27" x2="11" y2="35" stroke="#4A88CC" strokeWidth="2.8" strokeLinecap="round"/>
            <line x1="20" y1="27" x2="18" y2="35" stroke="#4A88CC" strokeWidth="2.8" strokeLinecap="round"/>
            <line x1="27" y1="27" x2="25" y2="35" stroke="#4A88CC" strokeWidth="2.8" strokeLinecap="round"/>
        </svg>
    )
}

function IconStorm({ size = 28, cloudColor = "#AABBCC" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M6 17a8 8 0 010-16 8 8 0 017.4 5A5 5 0 1126 17H6z" fill={cloudColor} opacity="0.7"/>
            <polyline points="21,21 16,29 21,29 15,37" stroke="#F0C97A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
    )
}

function IconSnow({ size = 28, cloudColor = "#FFFFFF" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <path d="M8 19a7 7 0 010-14 7 7 0 016.5 4.5A4.5 4.5 0 1126 19H8z" fill={cloudColor} opacity="0.85"/>
            <line x1="12" y1="24" x2="12" y2="35" stroke="#C8F0E0" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="7" y1="29.5" x2="17" y2="29.5" stroke="#C8F0E0" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="8.5" y1="25.5" x2="15.5" y2="33.5" stroke="#C8F0E0" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="15.5" y1="25.5" x2="8.5" y2="33.5" stroke="#C8F0E0" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="23" y1="24" x2="23" y2="35" stroke="#C8F0E0" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="18" y1="29.5" x2="28" y2="29.5" stroke="#C8F0E0" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="19.5" y1="25.5" x2="26.5" y2="33.5" stroke="#C8F0E0" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="26.5" y1="25.5" x2="19.5" y2="33.5" stroke="#C8F0E0" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
    )
}


function getWeatherIcon(code, rain, temp, size = 28, isoTime = null, sunsetStr = null, cloudColor = "#FFFFFF", sunriseStr = null) {
    const night = isNightHour(isoTime, sunsetStr, sunriseStr)
    const isWarm = temp >= 26 && !night
    if (code >= 95) return <IconStorm size={size} cloudColor={cloudColor} />
    if (code >= 80) return isWarm ? <IconHeavyWarmShower size={size} cloudColor={cloudColor} /> : <IconHeavyRain size={size} cloudColor={cloudColor} />
    if (code >= 61 && code <= 67) return isWarm ? <IconWarmShower size={size} cloudColor={cloudColor} /> : <IconRain size={size} cloudColor={cloudColor} />
    if (code >= 51 && code <= 57) return isWarm ? <IconWarmShower size={size} cloudColor={cloudColor} /> : <IconDrizzle size={size} cloudColor={cloudColor} />
    if (code >= 71 && code <= 77) return <IconSnow size={size} cloudColor={cloudColor} />
    if (code === 45 || code === 48) return <IconOvercast size={size} cloudColor={cloudColor} />
    if (rain > 65) return isWarm ? <IconWarmShower size={size} cloudColor={cloudColor} /> : <IconRain size={size} cloudColor={cloudColor} />
    if (rain > 40) return isWarm ? <IconWarmShower size={size} cloudColor={cloudColor} /> : <IconDrizzle size={size} cloudColor={cloudColor} />
    // Clear/partly cloudy: temp-aware icon selection
    if (code === 3) return <IconCloud size={size} cloudColor={cloudColor} />
    if (code === 2) return <IconSunnyIntervals size={size} isNight={night} cloudColor={cloudColor} />
    if (code === 1) return night ? <IconCloud size={size} cloudColor={cloudColor} /> : <IconSunnyIntervals size={size} isNight={false} cloudColor={cloudColor} />
    if (code === 0) {
        if (night) return <IconMoon size={size} />
        if (temp >= 32) return <IconHot size={size} />
        if (temp >= 18) return <IconSun size={size} />
        return <IconSunnyIntervals size={size} isNight={false} cloudColor={cloudColor} />
    }
    // Any other code at night = cloud
    if (night) return <IconCloud size={size} cloudColor={cloudColor} />
    return <IconCloud size={size} cloudColor={cloudColor} />
}

function RainBar({ pct, width = 44, isDark = true }) {
    const segments = 5
    const filled = pct < 10 ? 0 : pct < 25 ? 1 : pct < 45 ? 2 : pct < 65 ? 3 : pct < 80 ? 4 : 5
    return (
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {Array.from({ length: segments }).map((_, i) => (
                <div key={i} style={{ width: (width - (segments-1)*2)/segments, height: 3, borderRadius: 2, background: i < filled ? "#A8CAEF" : isDark ? "#222" : "#DDD", opacity: i < filled ? (0.4 + (i/segments)*0.6) : 1 }} />
            ))}
        </div>
    )
}


// -- MAIN COMPONENT ------------------------------------------------
export default function ROOFHeroLive() {
    const [weather, setWeather] = useState(null)
    const [hourly, setHourly] = useState([])
    const [forecast, setForecast] = useState([])
    const [arcMessage, setArcMessage] = useState(null)
    const [city, setCity] = useState(DEFAULT_CITY.name)
    const [cityCoords, setCityCoords] = useState(null)
    const [utcOffset, setUtcOffset] = useState(0)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [geoStatus, setGeoStatus] = useState("idle")
    const [isMobile, setIsMobile] = useState(() => { try { return window.innerWidth < 768 } catch { return false } })
    const [sunrise, setSunrise] = useState(null)
    const [sunset, setSunset] = useState(null)
    const [uvIndex, setUvIndex] = useState(null)
    const [humidity, setHumidity] = useState(null)
    const [expandedDay, setExpandedDay] = useState(null)
    const [weeklyHourly, setWeeklyHourly] = useState({})
    const [dailySunsets, setDailySunsets] = useState([])
    const [dailySunrises, setDailySunrises] = useState([])
    const [recentCities, setRecentCities] = useState(() => {
        try { return JSON.parse(localStorage.getItem("roof_recent") || "[]") } catch { return [] }
    })
    const [savedCities, setSavedCities] = useState(() => {
        try { return JSON.parse(localStorage.getItem("roof_saved") || "[]") } catch { return [] }
    })
    // Dark mode only
    const T = {
        bg: "linear-gradient(180deg, #0D1F2D 0%, #0D0D0D 35%)",
        pageBg: "#0D0D0D",
        nav: "transparent",
        navText: "#555",
        navLogo: "#fff",
        input: "#0A0A0A",
        inputFocus: "#111",
        inputBorder: "#1A1A1A",
        inputBorderFocus: "#333",
        inputText: "#fff",
        inputPlaceholder: "#444",
        dropdown: "#111",
        dropdownBorder: "#222",
        dropdownText: "#AAA",
        dropdownHover: "#161616",
        dropdownSub: "#555",
        cityLabel: "#AAA",
        tempColor: "#fff",
        conditionColor: "#777",
        feelsColor: "#777",
        messageColor: "#BBB",
        pillBg: "rgba(255,255,255,0.06)",
        pillBorder: "rgba(255,255,255,0.1)",
        pillText: "#AAA",
        card: "#0F0F0F",
        cardBorder: "#1A1A1A",
        cardTitle: "#444",
        cardText: "#FFFFFF",
        cardTextBright: "#fff",
        hourText: "#FFFFFF",
        hourTempBright: "#fff",
        hourTempDim: "#555",
        expandBg: "#141414",
        expandBorder: "#1A1A1A",
        expandLabel: "#FFFFFF",
        expandValue: "#fff",
        expandMsg: "#FFFFFF",
        savedPillBg: "#1A1A1A",
        savedPillBgActive: "#1A1A1A",
        savedPillText: "#444",
        savedPillTextActive: "#fff",
        savedPillBorder: "#1A1A1A",
        savedPillBorderActive: "#333",
        premiumBg: "#0A0A0A",
        premiumBorder: "#1A1A1A",
        premiumTitle: "#fff",
        premiumSub: "#555",
        footerBg: "#0D0D0D",
        footerText: "#F5F4F0",
        shareText: "#555",
        recentText: "#333",
        recentBorder: "#1A1A1A",
        sunIcon: "#F0C97A",
        geoText: "#1A6644",
        arcCard: "#0F0F0F",
        arcBorder: "#1A1A1A",
        arcLabel: "#555",
        arcText: "#888",
        toggleBg: "#1A1A1A",
        toggleIcon: "#777",
    }

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener("resize", check)
        document.body.style.margin = "0"
        document.body.style.padding = "0"
        document.body.style.width = "100%"
        document.documentElement.style.width = "100%"
        // Clean URL params after reading them
        if (window.location.search) {
            window.history.replaceState({}, "", "/")
        }
        return () => window.removeEventListener("resize", check)
    }, [])

    const pad = isMobile ? "0 20px" : "0 48px"
    const tempSize = isMobile ? 100 : 140
    const sectionPad = isMobile ? "60px 20px" : "80px 48px"

    // Apply URL params after mount. _urlParams is parsed at module load (before React
    // renders) so it is always correct regardless of effect ordering.
    useEffect(() => {
        if (_urlParams.lat !== null && _urlParams.lon !== null) {
            if (_urlParams.city) setCity(_urlParams.city)
            setCityCoords({ lat: _urlParams.lat, lon: _urlParams.lon })
        } else if (!navigator.geolocation) {
            setCityCoords({ lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon })
        }
    }, [])

    useEffect(() => {
        // Completely disabled when nogeo=1 or URL city/coords are present.
        // Uses module-level _urlParams (parsed before React renders) so there is
        // no timing gap between this check and the URL params effect above.
        if (!navigator.geolocation) return
        if (_urlParams.nogeo || _urlParams.lat !== null || _urlParams.city) return
        setGeoStatus("detecting")
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                // Defensive: bail out if URL params arrived after position resolved
                if (_urlParams.nogeo || _urlParams.lat !== null || _urlParams.city) return
                const { latitude, longitude } = pos.coords
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then((r) => r.json())
                    .then((data) => {
                        if (_urlParams.nogeo || _urlParams.lat !== null || _urlParams.city) return
                        const address = data.address || {}
                        const name = address.city || address.town || address.village || address.county || "Your location"
                        const country = address.country || ""
                        const fullName = country ? `${name}, ${country}` : name
                        setCity(fullName)
                        setCityCoords({ lat: latitude, lon: longitude })
                        setGeoStatus("detected")
                    })
                    .catch(() => {
                        if (_urlParams.nogeo || _urlParams.lat !== null || _urlParams.city) return
                        setCity("Your location")
                        setCityCoords({ lat: latitude, lon: longitude })
                        setGeoStatus("detected")
                    })
            },
            () => { setGeoStatus("denied"); setCityCoords({ lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon }) },
            { timeout: 8000 }
        )
    }, [])

    useEffect(() => {
        if (!cityCoords) return
        setLoading(true)
        setWeeklyHourly({})
        setDailySunsets([])
        setDailySunrises([])
        fetch(
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${cityCoords.lat}&longitude=${cityCoords.lon}` +
            `&current=temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m,weather_code,relative_humidity_2m` +
            `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code` +
            `&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,weather_code,precipitation_probability_max,sunrise,sunset,uv_index_max,wind_speed_10m_max` +
            `&wind_speed_unit=mph&temperature_unit=celsius&forecast_days=7&timezone=auto`
        )
            .then((r) => r.json())
            .then((data) => {
                const offset = data.utc_offset_seconds || 0
                setUtcOffset(offset)
                const c = data.current
                const apparent = Math.round(c.apparent_temperature)
                const temp = Math.round(c.temperature_2m)
                if (c.relative_humidity_2m !== undefined) setHumidity(c.relative_humidity_2m)
                const cityHour = getCityCurrentHour(offset)
                const allHours = data.hourly.time.map((t, i) => ({
                    time: t,
                    temp: Math.round(data.hourly.temperature_2m[i]),
                    apparent: Math.round(data.hourly.apparent_temperature[i]),
                    rain: data.hourly.precipitation_probability[i],
                    code: data.hourly.weather_code[i],
                }))
                const hours = allHours.filter((_, i) => i >= cityHour).slice(0, Math.max(12, 24 - cityHour))
                setWeather({
                    temp, apparent,
                    rain: c.precipitation_probability,
                    wind: Math.round(c.wind_speed_10m),
                    code: c.weather_code,
                    condition: getCondition(c.weather_code),
                    message: getMessage(city, temp, apparent, c.precipitation_probability, c.weather_code, getCityCurrentHour(offset), hours),
                    windLabel: getWind(c.wind_speed_10m),
                    rainLabel: getRain(c.precipitation_probability, c.weather_code),
                    feelLabel: getFeeling(temp, apparent),
                    showFeels: Math.abs(temp - apparent) >= 3,
                })
                setHourly(hours)
                setArcMessage(getDayArcMessage(hours, city))
                // Store all hourly data by date for expanded day panels
                const byDay = {}
                allHours.forEach(h => {
                    const date = h.time.split("T")[0]
                    if (!byDay[date]) byDay[date] = []
                    byDay[date].push(h)
                })
                setWeeklyHourly(byDay)
                const prevMsgs = []
                const days = data.daily.time.map((date, i) => {
                    const max = Math.round(data.daily.temperature_2m_max[i])
                    const min = Math.round(data.daily.temperature_2m_min[i])
                    const apparentMax = Math.round(data.daily.apparent_temperature_max[i])
                    const code = data.daily.weather_code[i]
                    const rain = data.daily.precipitation_probability_max[i]
                    const wind = Math.round(data.daily.wind_speed_10m_max?.[i] || 0)
                    const msg = getDayMessage(city, max, min, code, rain, apparentMax, prevMsgs)
                    prevMsgs.push(msg)
                    return { date, max, min, apparentMax, code, rain, wind, msg }
                })
                setForecast(days)
                // Store per-day sunsets and sunrises for hourly icon accuracy
                if (data.daily.sunset) {
                    setDailySunsets(data.daily.sunset.map(s => s.split("T")[1]?.substring(0, 5) || "19:00"))
                }
                if (data.daily.sunrise) {
                    setDailySunrises(data.daily.sunrise.map(s => s.split("T")[1]?.substring(0, 5) || "06:00"))
                }
                // Sunrise / sunset / UV for today
                if (data.daily.sunrise?.[0]) {
                    const sr = data.daily.sunrise[0].split("T")[1].substring(0, 5)
                    const ss = data.daily.sunset[0].split("T")[1].substring(0, 5)
                    const uv = Math.round(data.daily.uv_index_max[0])
                    setSunrise(sr)
                    setSunset(ss)
                    setUvIndex(uv)
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [city, cityCoords])
    useEffect(() => {
        if (searchQuery.length < 2) { setSearchResults([]); return }
        const timer = setTimeout(() => {
            setSearching(true)
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=6&language=en&format=json`)
                .then((r) => r.json())
                .then((data) => { setSearchResults(data.results || []); setSearching(false) })
                .catch(() => setSearching(false))
        }, 350)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const selectCity = (result) => {
        const country = result.country || ""
        const name = result.name
        const displayName = name === country ? name : country ? `${name}, ${country}` : name
        setCity(displayName)
        setCityCoords({ lat: result.latitude, lon: result.longitude })
        setSearchQuery("")
        setSearchResults([])
        setSearchFocused(false)
        setExpandedDay(null)
        const entry = { name: displayName, lat: result.latitude, lon: result.longitude }
        const updated = [entry, ...recentCities.filter(c => c.name !== displayName)].slice(0, 3)
        setRecentCities(updated)
        try { localStorage.setItem("roof_recent", JSON.stringify(updated)) } catch {}
    }

    const switchToCity = (rc) => {
        setCity(rc.name)
        setCityCoords({ lat: rc.lat, lon: rc.lon })
        setExpandedDay(null)
    }

    const saveCurrentCity = () => {
        const entry = { name: city, lat: cityCoords.lat, lon: cityCoords.lon }
        if (savedCities.find(c => c.name === city)) return
        const updated = [...savedCities, entry].slice(0, 5)
        setSavedCities(updated)
        try { localStorage.setItem("roof_saved", JSON.stringify(updated)) } catch {}
    }

    const removeSavedCity = (name) => {
        const updated = savedCities.filter(c => c.name !== name)
        setSavedCities(updated)
        try { localStorage.setItem("roof_saved", JSON.stringify(updated)) } catch {}
    }

    const conditionsVary = new Set(hourly.map(h => getConditionCategory(h.code, h.rain, h.temp))).size > 1
    const cityDay = getCityDay(utcOffset)
    const bgInfo = getWeatherGradient(
        weather?.code ?? 0,
        weather?.temp ?? 15,
        isNightHour(new Date(Date.now() + utcOffset * 1000).toISOString(), sunset, sunrise)
    )

    return (
        <div style={{ width: "100vw", maxWidth: "100vw", fontFamily: "Cabinet Grotesk, Inter, sans-serif", margin: 0, padding: 0, boxSizing: "border-box", overflowX: "hidden", background: T.pageBg, transition: "background 0.3s" }}>

            <div style={{ width: "100%", background: bgInfo.gradient, display: "flex", flexDirection: "column", boxSizing: "border-box", transition: "background 0.3s" }}>

                {/* Nav */}
                <div style={{ width: "100%", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: pad, boxSizing: "border-box" }}>
                    <a href="/" style={{ color: T.navLogo, fontSize: 26, fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>ROOF</a>
                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                        <a href="/about" style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 500, letterSpacing: "0.02em", textDecoration: "none", cursor: "pointer" }}>About</a>
                        <button onClick={() => window.open("https://mailchi.mp/3e2b5f94e259/roof-waitlist-1?utm_source=site&utm_medium=cta-nav&utm_campaign=launch", "_blank")} style={{ padding: "9px 18px", borderRadius: 24, border: "none", background: "#F5F4F0", color: "#0D0D0D", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em", whiteSpace: "nowrap" }}>Get early access</button>
                    </div>
                </div>

                {/* Identity line — above the fold */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 560, alignSelf: "center", paddingTop: isMobile ? 20 : 28, paddingBottom: isMobile ? 48 : 56, paddingLeft: 24, paddingRight: 24 }}>
                    <p style={{ color: bgInfo.textMode === "dark" ? "#2C5282" : "#AAAAAA", fontSize: isMobile ? 11 : 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.8, margin: "0 0 8px", textShadow: bgInfo.textMode === "dark" ? "0 2px 4px rgba(0,0,0,0.25)" : "0 2px 8px rgba(0,0,0,0.4)" }}>WEATHER, HONESTLY.</p>
                    <p style={{ color: bgInfo.textMode === "dark" ? "#2C5282" : "#AAAAAA", fontSize: isMobile ? 11 : 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.8, margin: 0, textShadow: bgInfo.textMode === "dark" ? "0 2px 4px rgba(0,0,0,0.25)" : "0 2px 8px rgba(0,0,0,0.4)" }}>WHAT THE WEATHER ACTUALLY MEANS. CITY BY CITY.</p>
                </div>

                {/* Saved cities strip */}
                {savedCities.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 16, padding: isMobile ? "0 20px" : "0 24px", boxSizing: "border-box", maxWidth: 440, width: "100%" }}>
                        {savedCities.map((sc) => (
                            <button key={sc.name} onClick={() => switchToCity(sc)}
                                style={{ fontSize: 12, padding: "5px 14px", borderRadius: 20, background: sc.name === city ? T.savedPillBgActive : T.savedPillBg, color: sc.name === city ? T.savedPillTextActive : T.savedPillText, border: `1px solid ${sc.name === city ? T.savedPillBorderActive : T.savedPillBorder}`, cursor: "pointer", fontFamily: "Cabinet Grotesk, Inter, sans-serif" }}>
                                {sc.name.split(",")[0]}
                            </button>
                        ))}
                    </div>
                )}
                {/* Search */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 32 }}>
                    <div style={{ position: "relative", width: "100%", maxWidth: 440, padding: isMobile ? "0 20px" : "0 24px", boxSizing: "border-box" }}>
                        {geoStatus === "detecting" && <p style={{ color: T.navText, fontSize: 12, textAlign: "center", margin: "0 0 8px", letterSpacing: "0.06em" }}>Finding your city...</p>}
                        {geoStatus === "detected" && <p style={{ color: T.geoText, fontSize: 14, fontWeight: 600, textAlign: "center", margin: "0 0 8px", letterSpacing: "0.06em" }}> Your city, automatically</p>}
                        <input type="text" placeholder="Any city, anywhere." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                            style={{ width: "100%", padding: "14px 20px", background: searchFocused ? T.inputFocus : T.input, border: `1px solid ${searchFocused ? T.inputBorderFocus : T.inputBorder}`, borderRadius: 24, color: T.inputText, fontSize: 16, fontFamily: "Cabinet Grotesk, Inter, sans-serif", outline: "none", boxSizing: "border-box", letterSpacing: "0.01em", transition: "all 0.2s" }}
                        />
                        {searchResults.length > 0 && (
                            <div style={{ position: "absolute", top: "100%", left: isMobile ? 20 : 24, right: isMobile ? 20 : 24, background: T.dropdown, border: `1px solid ${T.dropdownBorder}`, borderRadius: 12, marginTop: 6, zIndex: 100, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
                                {searchResults.map((r, i) => (
                                    <div key={i} onMouseDown={() => selectCity(r)}
                                        style={{ padding: "14px 18px", cursor: "pointer", color: T.dropdownText, fontSize: 15, lineHeight: 1.4, borderBottom: i < searchResults.length-1 ? `1px solid ${T.dropdownBorder}` : "none" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = T.dropdownHover)}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                        <span style={{ color: T.dropdownText }}>{r.name}</span>
                                        <span style={{ color: T.dropdownSub, fontSize: 13 }}>{r.admin1 ? `, ${r.admin1}` : ""}{r.country ? `, ${r.country}` : ""}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {searching && <div style={{ position: "absolute", top: "100%", left: isMobile ? 20 : 24, right: isMobile ? 20 : 24, background: T.dropdown, border: `1px solid ${T.dropdownBorder}`, borderRadius: 12, marginTop: 6, padding: "12px 18px", color: T.dropdownSub, fontSize: 13 }}>Searching...</div>}
                    </div>
                </div>

                {/* Weather */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: isMobile ? "20px 20px 32px" : "32px 48px 60px" }}>
                    {loading ? (
                        <p style={{ color: T.navText, fontSize: 15 }}>{geoStatus === "detecting" ? "Finding your city..." : "Loading..."}</p>
                    ) : weather ? (
                        <>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                                    <p style={{ color: bgInfo.textMode === "dark" ? "#1A365D" : T.cityLabel, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center", margin: 0, fontWeight: 500, textShadow: bgInfo.textMode === "dark" ? "0 2px 6px rgba(0,0,0,0.3)" : "none" }}>{city}</p>
                                    <button onClick={saveCurrentCity}
                                        title={savedCities.find(c => c.name === city) ? "Saved" : "Save this city"}
                                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: savedCities.find(c => c.name === city) ? "#C8F0E0" : T.toggleIcon, fontSize: 14, lineHeight: 1 }}>
                                        {savedCities.find(c => c.name === city) ? "" : ""}
                                    </button>
                                </div>
                                <p style={{ fontSize: 13, color: bgInfo.textMode === "dark" ? "#2C5282" : "#888", marginTop: 4, marginBottom: 0, fontWeight: 400, letterSpacing: "0.03em" }}>{getLocalTime(utcOffset)}</p>
                            </div>
                            <div style={{ margin: "0 0 4px", display: "flex", justifyContent: "center" }}>
                                {getWeatherIcon(weather.code, weather.rain, weather.temp, 80, new Date(Date.now() + utcOffset * 1000).toISOString(), sunset, "#FFFFFF", sunrise)}
                            </div>
                            <h1 style={{ color: T.tempColor, fontSize: tempSize, fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 8px", lineHeight: 1 }}>{weather.temp}°</h1>
                            {weather.showFeels && <p style={{ color: "#777", fontSize: isMobile ? 15 : 16, margin: "0 0 6px", fontWeight: 400 }}>Feels like {weather.apparent}°</p>}
                            <p style={{ color: "#FFFFFF", fontSize: isMobile ? 16 : 18, margin: "0 0 24px", letterSpacing: "0.02em", textAlign: "center", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{weather.condition} &nbsp;·&nbsp; {cityDay}</p>

                            {/* Sunrise / Sunset / UV / Humidity — labelled and readable */}
                            {sunrise && (
                                isMobile ? (
                                    <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", marginBottom: 24, flexWrap: "nowrap" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                            <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>Wind</span>
                                            <span style={{ fontSize: 13, color: "#FFFFFF", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{weather.windLabel}</span>
                                        </div>
                                        <span style={{ color: "#252525", fontSize: 16 }}>|</span>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                            <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>Sunrise</span>
                                            <span style={{ fontSize: 13, color: "#FFFFFF", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{sunrise}</span>
                                        </div>
                                        <span style={{ color: "#252525", fontSize: 16 }}>|</span>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                            <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>Sunset</span>
                                            <span style={{ fontSize: 13, color: "#FFFFFF", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{sunset}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", gap: 28, justifyContent: "center", marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                            <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>Wind</span>
                                            <span style={{ fontSize: 15, color: "#FFFFFF", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{weather.windLabel}</span>
                                        </div>
                                        <span style={{ color: "#252525", fontSize: 20 }}>|</span>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                            <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>Sunrise</span>
                                            <span style={{ fontSize: 15, color: "#FFFFFF", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{sunrise}</span>
                                        </div>
                                        <span style={{ color: "#252525", fontSize: 20 }}>|</span>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                            <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>Sunset</span>
                                            <span style={{ fontSize: 15, color: "#FFFFFF", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{sunset}</span>
                                        </div>
                                        {uvIndex !== null && uvIndex > 2 && <>
                                            <span style={{ color: "#252525", fontSize: 20 }}>|</span>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                                <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>UV</span>
                                                <span style={{ fontSize: 15, color: uvIndex >= 8 ? "#F0C97A" : "#FFFFFF", fontWeight: uvIndex >= 8 ? 500 : 400, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>
                                                    {uvIndex >= 8 ? "Very high" : uvIndex >= 6 ? "High" : "Moderate"}
                                                </span>
                                            </div>
                                        </>}
                                        {humidity !== null && humidity >= 70 && <>
                                            <span style={{ color: "#252525", fontSize: 20 }}>|</span>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                                                <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>Humidity</span>
                                                <span style={{ fontSize: 15, color: "#FFFFFF", fontWeight: 400, textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{humidity >= 85 ? "Very humid" : "Humid"}</span>
                                            </div>
                                        </>}
                                    </div>
                                )
                            )}

                            <p style={{ color: "#FFFFFF", fontSize: isMobile ? 16 : 22, lineHeight: 1.8, textAlign: "center", maxWidth: 560, margin: "0 0 28px", padding: isMobile ? "0 8px" : 0, fontWeight: 500, letterSpacing: "-0.01em" }}>{weather.message}</p>
                            {/* Hourly */}
                            {hourly.length > 0 && (
                                <div style={{ width: "100%", maxWidth: 760, marginBottom: 32 }}>
                                    {arcMessage && (
                                        <div style={{ marginBottom: 12, padding: "20px 24px", background: "#141414", borderRadius: 16, border: `1px solid ${"#232323"}` }}>
                                            <p style={{ color: "#555", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>The rest of your day</p>
                                            <p style={{ color: "#EEEEEE", fontSize: isMobile ? 16 : 17, lineHeight: 1.7, margin: 0, fontWeight: 400 }}>{arcMessage}</p>
                                        </div>
                                    )}
                                    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                                        <div style={{ display: "flex", gap: 8, minWidth: "max-content", padding: "4px 2px 8px" }}>
                                            {hourly.map((h, i) => {
                                                const showFeelsH = Math.abs(h.temp - h.apparent) >= 3
                                                return (
                                                    <div key={i} style={{ flex: "0 0 auto", width: isMobile ? 82 : 94, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, paddingBottom: 16, background: "#111111", borderRadius: 14, border: "1px solid #1E1E1E" }}>
                                                        <span style={{ color: "#666", fontSize: 13, letterSpacing: "0.03em", margin: "0 0 10px", fontWeight: 500 }}>{getHourLabel(h.time)}</span>
                                                        <div style={{ marginBottom: 8 }}>{getWeatherIcon((h.rain >= 55 && h.code <= 3 ? 51 : h.code), h.rain, h.temp, 44, h.time, sunset, "#FFFFFF", sunrise)}</div>
                                                        <span style={{ color: "#EEEEEE", fontSize: 22, fontWeight: 600, marginBottom: 2, letterSpacing: "-0.02em" }}>{h.temp}°</span>
                                                        <span style={{ color: T.hourTempDim, fontSize: 11, height: 15 }}>{showFeelsH ? `feels ${h.apparent}°` : ""}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* ── WHAT TO WEAR + YOUR WINDOW ── */}
                            {(() => {
                                const outfit = getOutfit(city, weather.temp, weather.apparent, weather.rain, weather.code, humidity ?? 50, uvIndex ?? 0, getCityCurrentHour(utcOffset))
                                const win = getWindow(hourly, utcOffset, weather.code, weather.rain)
                                if (!outfit && !win) return null
                                // Subtle atmospheric tint based on weather — barely visible, just enough to feel intentional
                                const getTint = () => {
                                    const c = weather.code, r = weather.rain, t = weather.temp
                                    if (c >= 95) return "rgba(100,80,160,0.10)"
                                    if (c >= 61 || r > 65) return "rgba(80,110,180,0.10)"
                                    if (c >= 51 || r > 40) return "rgba(100,120,160,0.08)"
                                    if (t > 30) return "rgba(210,160,70,0.09)"
                                    if (t > 22) return "rgba(170,200,130,0.07)"
                                    return "rgba(110,140,180,0.07)"
                                }
                                const cardBg = "#141414"
                                const cardBorder = "#242424"
                                const labelColor = "#666"
                                const textColor = "#EEEEEE"
                                const iconColor = "#4A4A4A"
                                const tint = getTint()
                                const cardStyle = {
                                    padding: isMobile ? "20px 20px" : "24px 28px",
                                    backgroundColor: cardBg,
                                    backgroundImage: `linear-gradient(135deg, ${tint} 0%, transparent 60%)`,
                                    borderRadius: 16,
                                    border: `1px solid ${cardBorder}`,
                                    display: "flex", gap: 18, alignItems: "flex-start"
                                }
                                return (
                                    <div style={{ width: "100%", maxWidth: 560, marginBottom: 36, display: "flex", flexDirection: "column", gap: 10 }}>
                                        {outfit && (
                                            <div style={cardStyle}>
                                                <div style={{ flexShrink: 0, marginTop: 3 }}>
                                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
                                                    </svg>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ color: labelColor, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 600 }}>What to wear</p>
                                                    <p style={{ color: textColor, fontSize: isMobile ? 16 : 17, lineHeight: 1.7, margin: 0, fontWeight: 400 }}>{outfit}</p>
                                                </div>
                                            </div>
                                        )}
                                        {win && (
                                            <div style={cardStyle}>
                                                <div style={{ flexShrink: 0, marginTop: 3 }}>
                                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <polyline points="12 6 12 12 16 14"/>
                                                    </svg>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ color: labelColor, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 600 }}>Your window</p>
                                                    <p style={{ color: textColor, fontSize: isMobile ? 16 : 17, lineHeight: 1.7, margin: 0, fontWeight: 400 }}>{win}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })()}

                            {/* Share + Recent cities */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 40 }}>
                                <button onClick={() => {
                                    const text = `${city}: ${weather.temp}°, ${weather.condition}. ${weather.message} — roofweather.app`
                                    if (navigator.share) {
                                        navigator.share({ title: `${city} weather — ROOF`, text, url: "https://roofweather.app" })
                                    } else {
                                        navigator.clipboard?.writeText(text)
                                    }
                                }} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: "#FFFFFF", background: "transparent", border: "none", cursor: "pointer", fontFamily: "Cabinet Grotesk, Inter, sans-serif", padding: "4px 0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                                    Share this forecast
                                </button>
                                {recentCities.length > 0 && (
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                                        {recentCities.map((rc) => (
                                            <button key={rc.name} onClick={() => { setCity(rc.name); setCityCoords({ lat: rc.lat, lon: rc.lon }) }}
                                                style={{ fontSize: 11, padding: "5px 14px", borderRadius: 20, background: "transparent", color: "#FFFFFF", border: "1px solid #2A2A2A", cursor: "pointer", fontFamily: "Cabinet Grotesk, Inter, sans-serif" }}>
                                                {rc.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>


                            {/* 7-day */}
                            {forecast.length > 0 && (
                                <div style={{ width: "100%", maxWidth: 760 }}>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                                        <p style={{ color: "#FFFFFF", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "left", margin: 0, fontWeight: 600 }}>7-day forecast</p>
                                        <p style={{ color: "#FFFFFF", fontSize: 12, margin: 0 }}>Tap any day to expand</p>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {forecast.map((day, i) => {
                                            const showApp = day.apparentMax && day.max - day.apparentMax >= 3
                                            const isExpanded = expandedDay === i
                                            const dayHours = weeklyHourly[day.date] || []
                                            // Today: remaining hours from now. Future days: 6am to midnight (BBC style)
                                            const displayHours = i === 0
                                                ? dayHours.filter(h => getHourFromISO(h.time) >= getCityCurrentHour(utcOffset))
                                                : dayHours.filter(h => {
                                                    const hr = getHourFromISO(h.time)
                                                    return hr >= 6 // 6am to midnight
                                                })
                                            const dayConditionsVary = displayHours.length > 1 && displayHours.some(h => {
                                                const cat = getConditionCategory(h.code, h.rain, h.temp)
                                                return cat !== getConditionCategory(displayHours[0].code, displayHours[0].rain, displayHours[0].temp)
                                            })
                                            return (
                                                <div key={i} style={{ borderRadius: 14, background: "#141414", border: "1px solid #232323", overflow: "hidden" }}>
                                                    <div
                                                        onClick={() => setExpandedDay(isExpanded ? null : i)}
                                                        style={{ display: "flex", alignItems: "center", padding: isMobile ? "14px 16px" : "16px 22px", gap: isMobile ? 10 : 14, cursor: "pointer", transition: "background 0.15s", background: isExpanded ? T.expandBg : "transparent" }}>
                                                        <span style={{ color: "#FFFFFF", fontSize: isMobile ? 14 : 15, fontWeight: i===0 ? 600 : 400, minWidth: isMobile ? 60 : 76, letterSpacing: "0.01em" }}>{getDayName(day.date, i)}</span>
                                                        <div style={{ minWidth: isMobile ? 44 : 48 }}>{getWeatherIcon(day.code, day.rain, day.max, isMobile ? 40 : 44, `${day.date}T12:00`, null, "#FFFFFF")}</div>
                                                        <span style={{ color: "#FFFFFF", fontSize: isMobile ? 13 : 14, flex: 1, lineHeight: 1.4 }}>{day.msg}</span>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: isMobile ? 36 : 52, gap: 2 }}>
                                                            <span style={{ color: "#FFFFFF", fontSize: isMobile ? 17 : 18, fontWeight: 600 }}>{day.max}°</span>
                                                            {showApp && <span style={{ color: T.hourTempDim, fontSize: 10 }}>feels {day.apparentMax}°</span>}
                                                        </div>
                                                        <span style={{ color: "#FFFFFF", fontSize: isMobile ? 13 : 14, minWidth: 24, textAlign: "right" }}>{day.min}°</span>
                                                        <span style={{ color: "#FFFFFF", fontSize: 10, marginLeft: 4 }}>{isExpanded ? "▲" : "▼"}</span>
                                                    </div>
                                                    {isExpanded && (
                                                        <div style={{ background: T.expandBg, borderTop: `1px solid ${T.expandBorder}` }}>
                                                            {/* Summary row */}
                                                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, padding: "16px 20px 0" }}>
                                                                <div>
                                                                    <p style={{ color: T.expandLabel, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>High</p>
                                                                    <p style={{ color: T.expandValue, fontSize: 15, fontWeight: 500, margin: 0 }}>{day.max}°{showApp ? ` / feels ${day.apparentMax}°` : ""}</p>
                                                                </div>
                                                                <div>
                                                                    <p style={{ color: T.expandLabel, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Low</p>
                                                                    <p style={{ color: T.expandValue, fontSize: 15, fontWeight: 500, margin: 0 }}>{day.min}°</p>
                                                                </div>
                                                                <div>
                                                                    <p style={{ color: T.expandLabel, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Rain</p>
                                                                    <p style={{ color: T.expandValue, fontSize: 15, fontWeight: 500, margin: 0 }}>{getRain(day.rain, day.code)}</p>
                                                                </div>
                                                                <div>
                                                                    <p style={{ color: T.expandLabel, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Wind</p>
                                                                    <p style={{ color: T.expandValue, fontSize: 15, fontWeight: 500, margin: 0 }}>{getWind(day.wind)}</p>
                                                                </div>
                                                            </div>
                                                            {/* ROOF message */}
                                                            <p style={{ color: T.expandMsg, fontSize: 13, lineHeight: 1.6, margin: 0, padding: "12px 20px 0" }}>{getDayContext(day, displayHours)}</p>
                                                            {/* Full hourly strip */}
                                                            {displayHours.length > 0 && (
                                                                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", padding: "16px 0 4px", borderTop: `1px solid ${T.expandBorder}`, marginTop: 14 }}>
                                                                    <div style={{ display: "flex", gap: 6, minWidth: "max-content", padding: "0 16px" }}>
                                                                        {displayHours.map((h, hi) => {
                                                                            const showFeelsH = Math.abs(h.temp - h.apparent) >= 3
                                                                            const sunsetForDay = dailySunsets[i] || sunset
                                                                            const sunriseForDay = dailySunrises[i] || sunrise
                                                                            return (
                                                                                <div key={hi} style={{ flex: "0 0 auto", width: isMobile ? 62 : 70, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, paddingBottom: 10, background: "#111111", borderRadius: 10, border: "1px solid #1E1E1E" }}>
                                                                                    <span style={{ color: T.hourText, fontSize: 10, letterSpacing: "0.04em", marginBottom: 6 }}>{getHourLabel(h.time)}</span>
                                                                                    <div style={{ marginBottom: 6 }}>{getWeatherIcon(h.code, h.rain, h.temp, isMobile ? 28 : 32, h.time, sunsetForDay, "#FFFFFF", sunriseForDay)}</div>
                                                                                    <span style={{ color: T.hourTempBright, fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{h.temp}°</span>
                                                                                    <span style={{ color: T.hourTempDim, fontSize: 10, height: 13 }}>{showFeelsH ? `feels ${h.apparent}°` : ""}</span>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p style={{ color: "#333", fontSize: 15 }}>Unable to load weather.</p>
                    )}
                </div>
            </div>

            {/* Environmental Details — Sunrise / UV / Moon Phase */}
            {weather && (() => {
                // Coord formatting for observation station footer
                const lat = cityCoords.lat
                const lon = cityCoords.lon
                const latStr = `${Math.abs(lat).toFixed(3)}° ${lat >= 0 ? "N" : "S"}`
                const lonStr = `${Math.abs(lon).toFixed(3)}° ${lon >= 0 ? "E" : "W"}`
                const observationStations = {
                    "london": "London Heathrow Airport",
                    "los angeles": "Los Angeles International Airport",
                    "dubai": "Dubai International Airport",
                    "paris": "Paris-Orly Airport",
                    "tokyo": "Tokyo International Airport",
                    "new york": "John F. Kennedy International Airport",
                    "rio de janeiro": "Rio de Janeiro-Galeão International Airport",
                    "amsterdam": "Amsterdam Schiphol Airport",
                    "singapore": "Singapore Changi Airport",
                    "sydney": "Sydney Kingsford Smith Airport",
                    "hong kong": "Hong Kong International Airport",
                    "bangkok": "Bangkok Suvarnabhumi Airport",
                    "istanbul": "Istanbul Airport",
                    "madrid": "Madrid-Barajas Airport",
                    "rome": "Rome Fiumicino Airport",
                    "berlin": "Berlin Brandenburg Airport",
                    "cairo": "Cairo International Airport",
                    "lagos": "Murtala Muhammed International Airport",
                    "nairobi": "Jomo Kenyatta International Airport",
                    "johannesburg": "OR Tambo International Airport",
                    "cape town": "Cape Town International Airport",
                    "accra": "Kotoka International Airport",
                    "mumbai": "Chhatrapati Shivaji Maharaj International Airport",
                    "delhi": "Indira Gandhi International Airport",
                    "toronto": "Toronto Pearson International Airport",
                    "miami": "Miami International Airport",
                    "chicago": "Chicago O'Hare International Airport",
                    "mexico city": "Benito Juárez International Airport",
                    "buenos aires": "Ministro Pistarini International Airport",
                    "barcelona": "Barcelona-El Prat Airport",
                    "athens": "Athens International Airport",
                    "lisbon": "Humberto Delgado Airport",
                    "abu dhabi": "Abu Dhabi International Airport",
                    "doha": "Hamad International Airport",
                    "riyadh": "King Khalid International Airport",
                    "kuala lumpur": "Kuala Lumpur International Airport",
                    "jakarta": "Soekarno-Hatta International Airport",
                    "seoul": "Incheon International Airport",
                    "beijing": "Beijing Capital International Airport",
                    "shanghai": "Shanghai Pudong International Airport",
                    "auckland": "Auckland Airport",
                    "edinburgh": "Edinburgh Airport",
                    "manchester": "Manchester Airport",
                    "birmingham": "Birmingham Airport",
                }
                const stationName = observationStations[city.toLowerCase()] ?? `${city} Weather Station`

                const envCardStyle = {
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                }

                return (
                <div style={{ width: "100%", background: "linear-gradient(180deg, rgba(245,244,240,0.12) 0%, rgba(245,244,240,0.18) 50%, rgba(245,244,240,0.12) 100%)", padding: isMobile ? "48px 24px" : "64px 48px", marginTop: 40, marginBottom: 40, boxSizing: "border-box" }}>

                    {/* 3-column borderless grid — Sunrise / UV / Moon */}
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 24 : 40, maxWidth: 900, margin: "0 auto" }}>

                        {/* 1 — Sunrise & Sunset */}
                        {(() => {
                            const fmt = (hhmm) => {
                                if (!hhmm) return null
                                const [h, m] = hhmm.split(":").map(Number)
                                const p = h < 12 ? "am" : "pm"
                                const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
                                return m === 0 ? `${h12}${p}` : `${h12}:${String(m).padStart(2, "0")}${p}`
                            }
                            const addMins = (hhmm, mins) => {
                                const [h, m] = hhmm.split(":").map(Number)
                                const total = h * 60 + m + mins
                                const nh = Math.floor(total / 60) % 24
                                const nm = total % 60
                                return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`
                            }
                            const lineStyle = { color: "#DDDDDD", fontSize: 15, lineHeight: 1.8, margin: "0 0 2px" }
                            if (!sunrise || !sunset) return (
                                <div style={envCardStyle}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M17 18a5 5 0 00-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 1 8 5"/></svg>
                                    <div>
                                        <p style={{ color: "#888", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 600 }}>Sunrise & Sunset</p>
                                        <p style={{ color: "#555", fontSize: 15, lineHeight: 1.7, margin: 0 }}>Loading…</p>
                                    </div>
                                </div>
                            )
                            const goldenStart = fmt(addMins(sunset, -50))
                            const [rh, rm] = sunrise.split(":").map(Number)
                            const [sh, sm] = sunset.split(":").map(Number)
                            const totalMins = (sh * 60 + sm) - (rh * 60 + rm)
                            const dlHrs = Math.floor(totalMins / 60)
                            const dlMins = totalMins % 60
                            const daylightStr = dlMins === 0 ? `${dlHrs}hrs` : `${dlHrs}hrs ${dlMins}mins`
                            return (
                                <div style={envCardStyle}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M17 18a5 5 0 00-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 1 8 5"/></svg>
                                    <div>
                                        <p style={{ color: "#888", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>Sunrise & Sunset</p>
                                        <p style={lineStyle}>Sunrise: {fmt(sunrise)}</p>
                                        <p style={lineStyle}>Sunset: {fmt(sunset)}</p>
                                        <p style={lineStyle}>Golden hour: {goldenStart}–{fmt(sunset)}</p>
                                        <p style={{ ...lineStyle, margin: 0 }}>Daylight: {daylightStr}</p>
                                    </div>
                                </div>
                            )
                        })()}

                        {/* 2 — UV Index */}
                        {(() => {
                            let uvLabel = ""
                            let uvText = "Data unavailable."
                            if (uvIndex !== null && uvIndex !== undefined) {
                                uvLabel = ` ${uvIndex}`
                                if (uvIndex >= 8)      uvText = "Very high. About 15 minutes to burn without protection. SPF 50."
                                else if (uvIndex >= 6) uvText = "High. About 25 minutes to burn without protection. SPF 30."
                                else if (uvIndex >= 3) uvText = "Moderate. About 45 minutes to burn without protection. SPF 15."
                                else                   uvText = "Low. Minimal risk today. No sunscreen required."
                            }
                            return (
                                <div style={envCardStyle}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                                    <div>
                                        <p style={{ color: "#888", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>UV Index{uvLabel}</p>
                                        <p style={{ color: "#DDDDDD", fontSize: 15, lineHeight: 1.8, margin: 0 }}>{uvText}</p>
                                    </div>
                                </div>
                            )
                        })()}

                        {/* 3 — Moon Phase */}
                        {(() => {
                            const ref = Date.UTC(2000, 0, 6, 18, 14)
                            const phase = ((((Date.now() - ref) / 86400000) % 29.53) + 29.53) % 29.53
                            let moonName, moonContext
                            if      (phase < 1.85)  { moonName = "New moon";        moonContext = "Very dark tonight — no moon to speak of." }
                            else if (phase < 7.38)  { moonName = "Waxing crescent"; moonContext = "Thin crescent after dark. Some light but not much." }
                            else if (phase < 11.07) { moonName = "First quarter";   moonContext = "Half moon. Decent light for an evening walk." }
                            else if (phase < 14.77) { moonName = "Waxing gibbous";  moonContext = "Bright moon tonight. Good visibility after dark." }
                            else if (phase < 18.45) { moonName = "Full moon";       moonContext = "Bright enough to walk without a torch." }
                            else if (phase < 22.15) { moonName = "Waning gibbous";  moonContext = "Bright moon still. Clear visibility after dark." }
                            else if (phase < 25.84) { moonName = "Last quarter";    moonContext = "Half moon. Some light for the evening." }
                            else                    { moonName = "Waning crescent"; moonContext = "Thin crescent. Getting darker toward the new moon." }
                            return (
                                <div style={envCardStyle}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                                    <div>
                                        <p style={{ color: "#888", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>Moon Phase</p>
                                        <p style={{ color: "#DDDDDD", fontSize: 15, lineHeight: 1.8, margin: 0 }}>{moonName}. {moonContext}</p>
                                    </div>
                                </div>
                            )
                        })()}

                    </div>

                    {/* Observation station footer */}
                    <p style={{ fontSize: 12, color: "#DDDDDD", textAlign: "center", marginTop: 32, marginBottom: 0, letterSpacing: "0.02em" }}>
                        Observation station: {stationName} ({latStr}, {lonStr})
                    </p>
                </div>
                )
            })()}

            {/* Premium */}
            <div style={{ width: "100%", background: T.premiumBg, borderTop: `1px solid ${T.premiumBorder}`, display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
                <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto", padding: isMobile ? "64px 24px" : "80px 48px" }}>
                    <h3 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 600, marginBottom: 20, marginTop: 0, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                        Want ROOF Intelligence everywhere?
                    </h3>
                    <p style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 1.7, margin: "0 auto 16px", maxWidth: 540 }}>
                        Save cities. 14-day forecasts. Alerts. Expanded messaging. Travel Mode. Historical context. Extended detail.
                    </p>
                    <p style={{ fontSize: 14, color: "#888", marginBottom: 28, marginTop: 0 }}>
                        Premium: £3.49/mo. Early access soon.
                    </p>
                    <button
                        onClick={() => window.open("https://mailchi.mp/3e2b5f94e259/roof-waitlist-1?utm_source=site&utm_medium=cta-hero&utm_campaign=launch", "_blank")}
                        style={{ padding: "14px 32px", borderRadius: 24, border: "none", fontSize: 15, fontWeight: 600, background: "#F5F4F0", color: "#0D0D0D", cursor: "pointer", letterSpacing: "0.02em" }}>
                        Get early access
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div style={{ width: "100%", background: T.footerBg, padding: isMobile ? "24px 20px" : "32px 48px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: T.navLogo, fontSize: 16, fontWeight: 700, letterSpacing: "0.1em" }}>ROOF</span>
                <span style={{ color: T.footerText, fontSize: 12 }}>Weather, honestly.</span>
            </div>

        </div>
    )
}
