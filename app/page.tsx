'use client'

import { useState, useEffect } from "react"

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

function isNightHour(isoTime, sunsetStr = null, sunriseStr = null) {
    if (!isoTime) return false
    const timePart = isoTime.split("T")[1]
    if (!timePart) return false
    const [hStr, mStr] = timePart.split(":")
    const timeInMins = parseInt(hStr) * 60 + parseInt(mStr || "0")
    if (sunsetStr) {
        const [sh, sm] = sunsetStr.split(":").map(Number)
        const sunsetMins = sh * 60 + (sm || 0)
        let sunriseMins = 6 * 60 // default 6am
        if (sunriseStr) {
            const [rh, rm] = sunriseStr.split(":").map(Number)
            sunriseMins = rh * 60 + (rm || 0)
        }
        return timeInMins >= sunsetMins || timeInMins < sunriseMins
    }
    return parseInt(hStr) >= 20 || parseInt(hStr) < 6
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

// -- HELPERS -------------------------------------------------------

function getWind(mph) {
    if (mph < 5) return "Still air today"
    if (mph < 12) return "Light breeze"
    if (mph < 20) return "Moderate wind"
    if (mph < 30) return "Breezy -- hold your hat"
    return "Strong wind today"
}

function getRain(pct, code = 0) {
    // Weather code is primary truth
    if (code >= 95) return "Stormy"
    if (code >= 80) return "Heavy rain"
    if (code >= 61) return "Rain"
    if (code >= 51) return "Drizzle"
    // Fall back to probability only when code says dry
    if (pct < 15) return "Dry today"
    if (pct < 35) return "Mostly dry"
    if (pct < 55) return "Rain possible"
    if (pct < 75) return "Rain likely"
    return "Rain is coming"
}

function getFeeling(temp, apparent) {
    const t = apparent || temp
    if (t >= 35) return "Extreme heat"
    if (t >= 28) return "Very warm"
    if (t >= 20) return "Comfortable"
    if (t >= 12) return "Cool"
    if (t >= 5) return "Cold"
    return "Very cold"
}

function getHourFromISO(isoTime) {
    return parseInt(isoTime.split("T")[1].split(":")[0])
}

function getHourLabel(isoTime) {
    const h = getHourFromISO(isoTime)
    if (h === 0) return "Midnight"
    if (h === 12) return "Noon"
    return h < 12 ? `${h}am` : `${h - 12}pm`
}

function getCityCurrentHour(utcOffsetSeconds) {
    return new Date(Date.now() + utcOffsetSeconds * 1000).getUTCHours()
}

function getCityDay(utcOffsetSeconds) {
    return new Date(Date.now() + utcOffsetSeconds * 1000).toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" })
}

function getLocalTime(utcOffsetSeconds) {
    const d = new Date(Date.now() + utcOffsetSeconds * 1000)
    const hours = d.getUTCHours()
    const minutes = d.getUTCMinutes().toString().padStart(2, "0")
    const ampm = hours >= 12 ? "pm" : "am"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes}${ampm}`
}

function getDayName(isoDate, index) {
    if (index === 0) return "Today"
    if (index === 1) return "Tomorrow"
    const [year, month, day] = isoDate.split("-").map(Number)
    const d = new Date(year, month - 1, day)
    const weekday = d.toLocaleDateString("en-GB", { weekday: "short" })
    const suffix = [11,12,13].includes(day) ? "th" : day % 10 === 1 ? "st" : day % 10 === 2 ? "nd" : day % 10 === 3 ? "rd" : "th"
    return `${weekday} ${day}${suffix}`
}

function getConditionCategory(code, rain, temp) {
    if (code >= 95) return "storm"
    if (code >= 80) return "rain"
    if (code >= 61) return "rain"
    if (code >= 51) return "rain-possible"
    if (rain > 60) return "rain"
    if (rain > 35) return "rain-possible"
    if (temp >= 28) return "hot"
    if (temp >= 18) return "warm"
    if (temp >= 12) return "mild"
    if (temp >= 5) return "cool"
    return "cold"
}

function getCategoryColor(cat) {
    return ({ storm: "#9B7FA8", rain: "#A8CAEF", "rain-possible": "#5A8FAF", hot: "#F0C97A", warm: "#E8B86D", mild: "#C8F0E0", cool: "#2A2A2A", cold: "#1E2A3A" }[cat] || "#2A2A2A")
}

function getConditionLabel(code) {
    if (code === 0) return "Clear"
    if (code === 1) return "Sunny intervals"
    if (code === 2) return "Sunny intervals"
    if (code === 3) return "Partly cloudy"
    if (code <= 51) return "Drizzle"
    if (code <= 67) return "Rain"
    if (code <= 77) return "Snow"
    if (code <= 82) return "Showers"
    if (code <= 99) return "Storm"
    return "Mixed"
}

function getCondition(code) {
    if (code === 0) return "Clear skies"
    if (code === 1) return "Sunny intervals"
    if (code === 2) return "Sunny intervals"
    if (code === 3) return "Partly cloudy"
    if (code <= 51) return "Light drizzle"
    if (code <= 67) return "Rain"
    if (code <= 77) return "Snow"
    if (code <= 82) return "Rain showers"
    if (code <= 99) return "Thunderstorm"
    return "Mixed conditions"
}

function getDayMessage(city, maxTemp, minTemp, code, maxRain, apparentMax, prevMessages) {
    const c = (city || "").toLowerCase()
    // Weather code is PRIMARY truth. Rain probability is secondary.
    // These must never contradict each other.
    const isStorm = code >= 95
    const isHeavyRain = code >= 80 || (code >= 61 && maxRain > 70)
    const isRain = code >= 61 || (code >= 51 && maxRain > 50)
    const isDrizzle = code >= 51 || (code < 51 && maxRain > 60)
    const isMostlyDry = !isStorm && !isHeavyRain && !isRain && !isDrizzle
    const diff = apparentMax ? maxTemp - apparentMax : 0
    const feelsColder = diff >= 3
    const isHotCity = ["dubai","abu dhabi","lagos","accra","doha","riyadh","muscat","jeddah","nairobi","dakar","mumbai","karachi","bangkok","singapore","jakarta"].some((x) => c.includes(x))

    let pool = []

    if (isStorm) {
        pool = ["Stormy -- stay inside if you can.", "Severe weather. Not a day to be outside.", "Storms expected. Keep indoor plans.", "Rough one. Check local alerts before heading out."]
    } else if (isHeavyRain) {
        pool = ["Heavy rain -- worth planning around.", "Proper rain today. Umbrella and waterproof jacket.", "Wet day. If you can move things inside, do it.", "Heavy rain expected. Not a day for outdoor plans."]
    } else if (isRain) {
        pool = ["Rain today -- take an umbrella.", "Wet conditions. A jacket with a hood is the move.", "Rainy day. Don't leave without something waterproof.", "Showers expected. Cover up before heading out."]
    } else if (isDrizzle) {
        pool = ["Drizzle likely. A light waterproof is worth it.", "Light rain possible. Better to have a jacket and not need it.", "Damp conditions. A layer keeps you comfortable.", "Could get damp. Light jacket is the sensible call."]
    } else if (isHotCity && maxTemp >= 38) {
        pool = [`Extreme heat -- ${maxTemp}. Before 9am or after 7pm outside only.`, "Dangerously hot. Limit outdoor exposure to early morning.", `${maxTemp} today -- midday is for indoors only.`, "Extreme conditions. Hydration is not optional today."]
    } else if (isHotCity && maxTemp >= 32) {
        pool = [`Hot at ${maxTemp}. Best outside before 10am or after 6pm.`, "Hot one. Sunscreen and shade are the strategy.", `${maxTemp} and climbing. Midday is for indoors.`, "Avoid the midday heat -- morning and evening are your windows."]
    } else if (isHotCity && maxTemp >= 26) {
        pool = [`Warm at ${maxTemp}. Manageable with shade and hydration.`, "Good conditions. Warm but not oppressive.", `${maxTemp} -- comfortable if you're not in direct sun all day.`, "Decent day. Stay hydrated and you're fine."]
    } else if (maxTemp >= 24) {
        pool = feelsColder
            ? [`${maxTemp} but feels closer to ${apparentMax} in the wind. A layer helps.`, "Warm on paper but the wind takes the edge off. Don't leave the jacket behind."]
            : [`Warm at ${maxTemp}. Good day to be outside.`, "Nice one. Make the most of it.", `${maxTemp} and pleasant. A genuinely good day.`, "Good conditions. Worth getting out."]
    } else if (maxTemp >= 18) {
        pool = feelsColder
            ? [`${maxTemp} but it'll feel more like ${apparentMax}. Mid-layer territory.`, "Mild enough but the wind brings it down. Pack a layer."]
            : [`Mild at ${maxTemp}. Light jacket and you're sorted.`, "Decent conditions. A light layer covers it.", `${maxTemp} -- comfortable. Nothing to plan around.`, "Not bad at all. A mid-layer and you're fine."]
    } else if (maxTemp >= 12) {
        pool = feelsColder
            ? [`${maxTemp} but feels like ${apparentMax} -- proper coat today.`, `Cooler than it looks. Wind brings it to ${apparentMax}. Dress for that, not the number.`]
            : [`Cool at ${maxTemp}. Layer up before heading out.`, "Cool day. A proper coat is the right call.", `${maxTemp} -- not cold, not warm. A jacket earns its place.`, "Cool conditions. You'll feel it if you're underdressed."]
    } else if (maxTemp >= 4) {
        pool = feelsColder
            ? [`Cold at ${maxTemp} -- feels like ${apparentMax} with wind chill. Full coat and layers.`, `${maxTemp} on paper, ${apparentMax} in practice. Dress for the real feel.`]
            : [`Cold day -- ${maxTemp} at best. Proper coat needed.`, "A cold one. Don't underestimate it.", `${maxTemp} and cold. Layers make the difference today.`, "Cold conditions. Commit to the coat."]
    } else {
        pool = [`Very cold -- ${maxTemp} at best. Dress properly or stay in.`, "Properly cold today. Full winter gear.", `${maxTemp} is harsh. Keep outdoor time short.`]
    }

    const filtered = pool.filter((m) => !(prevMessages || []).slice(-2).includes(m))
    const final = filtered.length > 0 ? filtered : pool
    return final[Math.floor(Math.random() * final.length)]
}

function getDayArcMessage(hourly, city) {
    if (!hourly || hourly.length < 2) return null
    const c = (city || "").toLowerCase()
    const temps = hourly.map((h) => h.temp)
    const rains = hourly.map((h) => h.rain)
    const codes = hourly.map((h) => h.code)
    const firstTemp = temps[0]
    const minTemp = Math.min(...temps)
    const maxTemp = Math.max(...temps)
    const tempDrop = firstTemp - temps[temps.length - 1]
    const currentlyRaining = codes[0] >= 51
    const isHot = ["dubai","abu dhabi","doha","riyadh","kuwait","muscat","jeddah","lagos","accra","nairobi","dakar","abidjan","mumbai","karachi","dhaka","colombo","bangkok","singapore","jakarta","manila"].some((x) => c.includes(x))
    const eveningHours = hourly.filter((h) => getHourFromISO(h.time) >= 18)
    const eveningRainHour = eveningHours.find((h) => h.code >= 51 || h.rain > 55)
    const eveningRainLabel = eveningRainHour ? getHourLabel(eveningRainHour.time) : null
    const avgEveningTemp = eveningHours.length > 0 ? Math.round(eveningHours.reduce((a, b) => a + b.temp, 0) / eveningHours.length) : null
    const rainIdx = codes.findIndex((cd, i) => i > 0 && (cd >= 51 || rains[i] > 55))
    const rainLabel = rainIdx >= 0 ? getHourLabel(hourly[rainIdx].time) : null
    const isEveningRain = rainLabel && eveningRainLabel && rainLabel === eveningRainLabel
    const bestIdx = hourly.reduce((best, h, i) => { const s = h.temp-(h.code>=51||h.rain>50?20:0); const bs = hourly[best].temp-(hourly[best].code>=51||hourly[best].rain>50?20:0); return s>bs?i:best }, 0)
    const bestHour = getHourLabel(hourly[bestIdx].time)
    const bestTemp = hourly[bestIdx].temp
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

    if (isHot && minTemp >= 28) return pick([`Heat holds all day. Before 9am or after 7pm is the only comfortable window outside.`,`Stays hot throughout. Shade, hydration, and short bursts outside are the strategy today.`,`No cool-down coming. Early morning is the only sensible time to be outside.`,`Hot all day. ${minTemp} is as cool as it gets -- plan outdoor time for the very start or end of the day.`])
    if (!currentlyRaining && eveningRainLabel) return pick([`Dry for now. Rain moves in around ${eveningRainLabel} -- take a jacket if you're heading out this evening.`,`Good afternoon but rain arrives around ${eveningRainLabel}. Evening plans need an umbrella.`,`It's fine right now. Rain turns up around ${eveningRainLabel} -- anything outdoor, go earlier.`,`Clear through the afternoon. Rain from around ${eveningRainLabel} -- bring a layer for this evening.`])
    if (!currentlyRaining && rainLabel && !isEveningRain) return pick([`Dry now but rain is due around ${rainLabel} — use the morning while you have it. Gets messier from there.`,`Good conditions right now. Rain moves in around ${rainLabel} — earlier is better for anything outdoor today.`,`Make the most of the morning. Rain arrives around ${rainLabel} and the forecast means it.`,`Clear window now. Rain around ${rainLabel} — outdoor plans should happen before then, not after.`])
    if (!currentlyRaining && tempDrop >= 5 && avgEveningTemp !== null && avgEveningTemp < 12) return pick([`${firstTemp} now, dropping to around ${minTemp} later. Take a jacket -- you'll need it this evening.`,`Decent right now but it falls away sharply. ${minTemp} tonight -- dress for where you're ending up.`,`Good conditions now. Cools to ${minTemp} by tonight -- a jacket in the bag is the right call.`,`Comfortable now, cold later. Drops to ${minTemp} -- anything evening, you'll want an extra layer.`])
    if (!currentlyRaining && tempDrop >= 4 && avgEveningTemp !== null && avgEveningTemp >= 12) return pick([`Cools off a bit through the evening but stays mild -- around ${avgEveningTemp}. A light layer covers it.`,`It eases off later but nothing dramatic. ${avgEveningTemp} this evening -- comfortable with a light jacket.`,`Slight cool-down into the evening. ${avgEveningTemp} -- still fine with a mid-layer.`])
    if (!currentlyRaining && maxTemp - firstTemp >= 4 && maxTemp >= 18) return pick([`Gets better through the day. Best around ${bestHour} at ${bestTemp} -- that's your outdoor window.`,`Warms up nicely. Peak around ${bestHour} at ${bestTemp}. Good afternoon ahead.`,`It improves as the day goes on -- ${bestTemp} around ${bestHour} is the sweet spot.`,`The afternoon is where it's at today. ${bestHour} looks like the best of it at ${bestTemp}.`])
    if (maxTemp < 8) return pick([`Cold throughout -- ${maxTemp} is as good as it gets today. Dress properly.`,`Stays cold all day. Proper coat, proper layers -- commit to it.`,`No warmth coming. If you're outside for any stretch, you'll know about it.`])
    if (maxTemp - minTemp <= 3 && maxTemp >= 13 && maxTemp <= 23) return pick([`Steady through the day -- ${minTemp} to ${maxTemp}. What you put on now works all day.`,`Consistent conditions. Dress for ${Math.round((maxTemp+minTemp)/2)} and you're sorted.`,`No big swings today. A mid-layer and you're covered from now until tonight.`,`No surprises -- ${minTemp}-${maxTemp} all the way through.`])
    if (minTemp >= 20 && !currentlyRaining) return pick([`Stays warm right through -- ${minTemp} to ${maxTemp}. A genuinely good day.`,`Good conditions all the way. No drop-off to worry about. Enjoy it.`,`Warm and consistent. Nothing to plan around -- just make the most of it.`,`${minTemp} to ${maxTemp} all day with no drama. Days like this are worth savouring.`])
    // Honest uncertainty arc — when rain probability is significant but code says clear
    const maxRain = Math.max(...rains)
    if (!currentlyRaining && maxRain >= 45 && maxRain < 70) return pick([
        `The forecast is genuinely uncertain today — rain is possible, dry is possible. Morning looks safer than the afternoon. Keep plans slightly flexible.`,
        `The models aren't fully committing today. Rain probable at some point but the timing and certainty aren't there. A waterproof in the bag and flexible afternoon plans.`,
        `Honestly split forecast. The rain probability is real but so is the chance it stays dry. The morning is your safer window.`,
    ])
    if (!currentlyRaining && maxRain >= 70) return pick([
        `The models are leaning toward rain even if it looks fine right now. ${Math.round(maxRain)}% probability at peak — that's the forecast telling you something. Plan for it.`,
        `Rain likely later despite current conditions. The probability is ${Math.round(maxRain)}% at peak — significant enough to plan around. Morning is your outdoor window.`,
    ])
    return null
}

function getDayContext(day, displayHours) {
    const parts = []

    // --- RAIN TIMING ---
    if (displayHours.length > 0) {
        const rainHrs = displayHours.filter(h => h.code >= 51)
        const total = displayHours.length

        if (day.code >= 95) {
            parts.push("Storm conditions through the day.")
        } else if (rainHrs.length >= Math.ceil(total * 0.75)) {
            if (day.code >= 80) parts.push("Heavily wet all day.")
            else parts.push("Wet through most of the day.")
        } else if (rainHrs.length > 0) {
            const firstRainHr = getHourFromISO(rainHrs[0].time)
            const lastRainHr  = getHourFromISO(rainHrs[rainHrs.length - 1].time)

            if (lastRainHr <= 12) {
                parts.push(`Rain until around ${getHourLabel(rainHrs[rainHrs.length - 1].time)}, then clearer.`)
            } else if (firstRainHr >= 19) {
                parts.push(`Evening showers from around ${getHourLabel(rainHrs[0].time)}.`)
            } else if (firstRainHr >= 15) {
                parts.push(`Rain arrives around ${getHourLabel(rainHrs[0].time)}. Morning is your window.`)
            } else if (firstRainHr >= 12) {
                parts.push(`Rain from around ${getHourLabel(rainHrs[0].time)}. Morning is the dry window.`)
            } else if (firstRainHr <= 9 && lastRainHr <= 16) {
                parts.push(`Rain until around ${getHourLabel(rainHrs[rainHrs.length - 1].time)}, clearer this afternoon.`)
            } else {
                parts.push(`Rain roughly ${getHourLabel(rainHrs[0].time)}–${getHourLabel(rainHrs[rainHrs.length - 1].time)}.`)
            }
        } else if (day.rain >= 40 && day.code < 51) {
            parts.push("Rain possible — check back nearer the time.")
        }
    } else {
        if (day.code >= 95) parts.push("Storm conditions.")
        else if (day.code >= 80) parts.push("Heavy rain through the day.")
        else if (day.code >= 61) parts.push("Rain expected through the day.")
        else if (day.code >= 51) parts.push("Drizzle likely through the day.")
    }

    // --- TEMPERATURE SWING ---
    const swing = day.max - day.min
    if (swing >= 10) {
        parts.push(`${day.min}° to ${day.max}° range — layer up for the morning.`)
    } else if (swing >= 8) {
        parts.push("Cool start, warmer this afternoon.")
    }

    // --- WIND ---
    if (day.wind >= 30) {
        parts.push("Strong winds — umbrellas will struggle.")
    } else if (day.wind >= 20) {
        parts.push("Breezy — you'll notice it.")
    }

    // --- FALLBACK ---
    if (parts.length === 0) {
        parts.push("Settled conditions. Nothing to plan around.")
    }

    return parts.join(" ")
}

function getMessage(city, temp, apparent, rain, code, cityHour = 12, hourly = null) {
    const isRaining = code >= 61
    const isDrizzle = code >= 51 && code < 61
    const isHeavyRain = code >= 80 || (isRaining && rain > 75)
    const isStorm = code >= 95
    const c = city.toLowerCase()
    const feels = apparent && temp - apparent >= 3
    const feelsNote = feels ? ` Feels like ${apparent}.` : ""
    const isMorning = cityHour >= 5 && cityHour < 11
    const isMidday = cityHour >= 11 && cityHour < 15
    const isAfternoon = cityHour >= 15 && cityHour < 20
    const isEvening = cityHour >= 20 || cityHour < 5
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

    // -- VARIABILITY DETECTION (hourly lookahead) --
    // Scan upcoming hours for coded rain arriving into a currently dry/clear period
    const upcomingHours = hourly ? hourly.slice(1) : []
    const isClearNow = code <= 2
    const isCloudyOnlyNow = code === 3
    const upcomingCodedRain = upcomingHours.find(h => h.code >= 51)
    const upcomingRainLabel = upcomingCodedRain ? getHourLabel(upcomingCodedRain.time) : null
    const hasSunInDay = hourly && hourly.some(h => h.code <= 2 && h.rain < 35)
    const hasCodedRainInDay = hourly && hourly.some(h => h.code >= 51)
    const hasMixedDay = hasSunInDay && hasCodedRainInDay
    // Currently raining but clearing later
    const clearingLater = (isRaining || isDrizzle) && upcomingHours.find(h => h.code < 51 && h.rain < 40)
    const clearingLabel = clearingLater ? getHourLabel(clearingLater.time) : null

    // -- UK CITIES --
    const isUK = c.includes("london") || c.includes("manchester") || c.includes("birmingham") ||
        c.includes("bristol") || c.includes("leeds") || c.includes("edinburgh") ||
        c.includes("glasgow") || c.includes("liverpool") || c.includes("newcastle") ||
        c.includes("sheffield") || c.includes("cardiff") || c.includes("brighton") ||
        c.includes("nottingham") || c.includes("oxford") || c.includes("cambridge") ||
        c.includes("greater london") || c.includes("united kingdom")
    if (isUK) {
        const isLondon = c.includes("london") || c.includes("greater london")
        const isEdinburgh = c.includes("edinburgh")
        const isManchester = c.includes("manchester")
        const isBrighton = c.includes("brighton")
        if (isStorm) return pick(["Properly rough today. Don't be outside if you don't have to be. Check transport before you travel -- delays are already likely.", "Storm conditions. Anything outdoor, cancel it. The kind of day you're glad to be inside.", "Severe storm. Check National Rail and TfL before you travel -- disruption is already happening. Outdoor plans are off.", "The weather is genuinely dangerous today. Stay put if you have any flexibility at all.", "This is a day-off-from-the-outside kind of weather. Stay in, call it self-care, no further justification needed.", "Storm conditions. Delays certain, conditions serious. If it can be done tomorrow, do it tomorrow."])
        if (isHeavyRain) {
            if (isMorning) return pick(["Heavy rain on the morning commute. Give yourself extra time -- roads will be slow and transport will be rammed. A full waterproof, not just an umbrella.", "Properly raining and the morning rush will feel it. Leave earlier than you think.", "Serious rain this morning. Add twenty minutes to any journey and dress like you mean it -- a full waterproof is the only honest answer.", "The commute is going to be grim. Trains delayed, buses slow, roads wet. Leave early and take a proper waterproof.", "Heavy rain makes commutes feel twice as long. Leave now, not when you think you should leave. Full waterproof.", "This morning's weather deserves to be taken seriously. Leave early, wear something waterproof, and don't rely on an umbrella in this wind."])
            if (isEvening) return pick(["Heavy rain for the commute home. If you can wait it out 30 minutes, do -- it will ease. Full waterproof essential.", "Wet evening commute. A waterproof jacket over an umbrella -- the wind will make the umbrella useless.", "Don't try to tough it out with just an umbrella tonight. A full waterproof is the move.", "Evening rush plus heavy rain. Wait it out if you can, or go full waterproof and accept you'll still feel it.", "Seriously wet out there. The journey home will take longer than usual. Dress for it and give yourself the time.", "Heavy rain for the evening. The transport will be busier and slower. Leave now or leave in an hour when it eases."])
            return pick(["Heavy rain today. A proper waterproof jacket is the move -- not just an umbrella.", "Seriously wet today. The kind that makes you reconsider outdoor plans entirely.", "Heavy rain. Accept it, dress for it, move on. A proper waterproof jacket beats an umbrella every time in this.", "Wet one today. If it can be done indoors, do it indoors. If it can't, a full waterproof and get on with it.", "The rain is serious today. Not the kind you ignore -- the kind you dress for properly.", "Properly heavy rain. Waterproof jacket, closed shoes, and reconsider anything that didn't need to happen outside."])
        }
        if (isRaining) {
            if (clearingLabel) return pick([`Rain right now but it should ease around ${clearingLabel}. A waterproof for now, better once it clears.`, `Wet at the moment -- due to clear around ${clearingLabel}. Stick it out.`, `Raining but the forecast says it lifts around ${clearingLabel}. Worth knowing before you plan your day.`, `Wet for now. Should improve around ${clearingLabel} -- if you can shift things to later, do it.`, `The rain is here for a bit but it clears around ${clearingLabel}. A waterproof until then and you're fine.`])
            if (isMorning) {
                if (isLondon) return pick(["Rain on the commute this morning. Umbrella is non-negotiable, jacket over the top if you're walking any distance. The Tube will be sweaty but dry.", "Wet start. It's the kind of rain that makes you glad you checked before leaving. Umbrella and a layer.", "London rain on a Monday morning is basically a tradition. Umbrella, jacket, take the Tube, accept the situation.", "Raining in London. The Tube is the right call if you're walking more than five minutes. Umbrella non-negotiable.", "Wet commute this morning. Jacket over the umbrella -- when the wind picks up in London the umbrella becomes a liability.", "Rain and the morning rush. The Tube wins today. If you're cycling, reconsider."])
                if (isEdinburgh) return pick(["Edinburgh rain this morning -- the wind off the Forth makes it horizontal. A hood is more useful than an umbrella today.", "Wet Edinburgh morning. The castle will be in low cloud. Still beautiful, but dress for it.", "Edinburgh rain is not like other rain. It finds the gaps. A proper waterproof jacket is worth more than any umbrella here.", "Wet start in Edinburgh. The haar and the wind combine today -- a hood is your best option, umbrella is pointless.", "Raining in Edinburgh this morning. The closes and wynds won't protect you from horizontal rain. Full waterproof."])
                if (isManchester) return pick(["Manchester doing what Manchester does. Rain on the commute -- umbrella, jacket, leave a couple of minutes early.", "Wet Manchester morning. Nobody here is surprised. Umbrella and get on with it.", "Manchester rain on the commute. This city has been having this conversation for 200 years -- just dress for it.", "Wet start in Manchester. The city is built for this, frankly. Umbrella and move.", "Raining in Manchester. An umbrella and a jacket and you'll not even think about it by 9am."])
                return pick(["Rain on the commute this morning. Umbrella and a jacket -- you know the drill.", "Wet start. Get sorted before you leave -- it's the kind of rain that makes you wish you'd checked.", "Raining this morning. Waterproof layer, umbrella, leave slightly earlier. That's the whole strategy.", "Wet commute this morning. A jacket that actually keeps you dry and you'll arrive fine.", "Rain on the way in. The umbrella and a waterproof layer is the answer -- one or the other isn't quite enough today."])
            }
            if (isEvening) return pick(["Raining this evening. A jacket is more useful than an umbrella in this wind. Plan accordingly.", "Wet evening. If you're heading out tonight, dress for it properly.", "Evening rain. The wind makes umbrellas pointless -- go with a waterproof jacket.", "It's wet out there. If you're leaving work soon, you'll feel it. Proper jacket.", "Rain for the commute home. Give yourself extra time and dress for it.", "Wet one tonight. A hood beats an umbrella in this weather -- trust that.", "Raining this evening. Not the worst thing in the world, but a waterproof jacket earns its place."])
            return pick(["It's raining. Classic. Umbrella and a jacket.", "Wet one today. The kind of day where checking before you leave actually paid off.", "The rain is doing its thing today. Let it. Take an umbrella, keep moving. Some of the best days happen in conditions like this.", "It's one of those rainy days. Don't let it decide your mood. Find something productive, stay warm, and if you do go out -- take something waterproof and make it count.", "The forecast is wet. The day doesn't have to be. Dress for it and get on with things -- that's the only strategy that works.", "Rain on a day you adapt to is just weather. Adapt. Waterproof layer and keep moving."])
        }
        if (isDrizzle) {
            if (clearingLabel) return pick([`Drizzle right now but it should ease by around ${clearingLabel}. A hood for now, better later.`, `Light rain at the moment -- expect it to clear around ${clearingLabel}. Worth it to just get on with things.`, `Drizzling but it should lift around ${clearingLabel}. A light waterproof for the next couple of hours.`, `The drizzle won't last -- clears around ${clearingLabel}. A light jacket is all you need for now.`, `Wet out there but it clears around ${clearingLabel}. A hood or light waterproof and you're fine.`])
            return pick(["The sneaky drizzle today -- technically not raining but you'll be damp within five minutes. A light waterproof is the smart call.", "Drizzle. Worse than it sounds. A hood or waterproof layer is worth it.", "Your day doesn't need adjusting much. The rain should be light. Take an umbrella and attack the day.", "Nobody's cancelling plans over a bit of drizzle. A good waterproof layer and the day is still completely yours.", "The rain has a rhythm today. Once you stop fighting it and just dress for it, the day actually opens up.", "Rainy days are underrated. The city empties out, the queues disappear, and everywhere indoors feels more earned. Make it work for you.", "The umbrella earns its place today. Take it, keep moving, don't let the sky set the tone.", "Wet outside, warm inside, or a waterproof and you don't care either way. Pick one and commit."])
        }
        // Variability: currently sunny or cloudy but coded rain is arriving later
        if (!isRaining && !isDrizzle && upcomingRainLabel && (isClearNow || isCloudyOnlyNow)) {
            if (isMorning) return pick([
                `Sunny start but rain moves in around ${upcomingRainLabel}. Use the morning while you have it -- it won't last.`,
                `Good conditions right now but rain arrives around ${upcomingRainLabel}. Get anything outdoor done before then.`,
                `Decent start to the day. Enjoy it -- rain is due around ${upcomingRainLabel} and the forecast means it.`,
                `Clear this morning but rain is coming -- around ${upcomingRainLabel}. Morning is your window. Use it.`,
                `Good start but don't be fooled -- rain arrives around ${upcomingRainLabel}. Get the outdoor stuff done now.`,
                `The morning is yours. Rain moves in around ${upcomingRainLabel} so use the clear window while it lasts.`,
            ])
            return pick([
                `Clear for now but rain is on the way -- arriving around ${upcomingRainLabel}. Keep a waterproof close.`,
                `Conditions look fine right now but rain moves in around ${upcomingRainLabel}. Plan around that.`,
                `Nice out right now -- won't stay that way. Rain due around ${upcomingRainLabel}. A jacket in the bag is the right call.`,
                `Fine at the moment but rain arrives around ${upcomingRainLabel}. Not an ideal time to be far from cover.`,
                `Dry right now but the forecast changes around ${upcomingRainLabel}. Worth keeping a waterproof nearby.`,
                `The weather looks decent but rain is scheduled for around ${upcomingRainLabel}. Plan outdoor things accordingly.`,
            ])
        }
        // Variability: mixed sun and coded showers through the day
        if (!isRaining && hasMixedDay) {
            return pick([
                `Sun and showers through the day -- keep a waterproof close. Classic changeable weather.`,
                `Sunny spells between the showers. A jacket in the bag is the only honest advice for a day like this.`,
                `Mixed bag today -- sunshine at times, showers at others. Dress for the showers and you'll enjoy the sunny bits.`,
                `On-and-off showers through the day with some sunshine in between. The hourly will tell you exactly when.`,
                `Classic British changeable weather. One minute sunny, next minute not. A waterproof that folds small is the answer.`,
                `Showers and sunshine fighting it out today. Dress for the showers and treat the sunny bits as a bonus.`,
                `The forecast can't make its mind up today -- and neither can the sky. A light waterproof is the only honest answer.`,
            ])
        }
        if (rain > 30) return pick(["Mostly dry but the forecast isn't fully committing. A compact umbrella in the bag is the only honest response to a day like this.", "Probably stays dry. Probably. A folded umbrella costs nothing to carry and today is the kind of day you'll be glad you did.", "The forecast shows a real chance of rain without being confident about it. That's the honest situation. Take something waterproof.", "Could stay dry, could catch a shower. The forecast won't commit either way. A lightweight waterproof in the bag and you've covered the uncertainty.", "Not confident it stays dry today. A compact umbrella weighs nothing and you'll thank yourself if the sky tips wet.", "Probably fine. But 'probably' is doing real work in that sentence today. Keep something waterproof close."])
        if (temp < 2) {
            if (isMorning) return pick(["Freezing on the commute this morning. Gloves aren't optional -- your hands will know about it within two minutes.", "Properly cold this morning. Coat, scarf, gloves -- all of them.", "Sub-zero feel this morning. Every layer you've been waiting to wear is justified today.", "The temperature this morning bites. Gloves, hat, the full kit -- don't leave without them.", "Bitter this morning. The kind of cold that makes you run from the front door to the bus stop. Dress for the run."])
            return pick(["Genuinely freezing today. The kind of cold that bites through layers if you're not dressed properly.", `${temp} degrees -- that's proper winter. Gloves, hat, the works.`, "Sub-zero. Every layer is justified. The cold isn't bluffing today.", "This is the serious cold. Not the kind you walk through in a light jacket. Coat, scarf, gloves, and possibly a hat.", "Freezing conditions. The kind of day that reminds you why central heating exists. Every layer is earned."])
        }
        if (temp < 8) {
            if (isMorning) {
                if (isLondon) return pick([`Grey and cold on the commute this morning -- ${temp} degrees.${feelsNote} The kind of London morning that makes working from home feel like a reasonable life choice.`, `Cold start. ${temp} degrees and it means it.${feelsNote} A proper coat today.`, `${temp} degrees in London this morning.${feelsNote} The kind of cold that has you genuinely wishing the Tube was above-ground.`, `Cold London morning -- ${temp} degrees.${feelsNote} Leave a bit of extra time and get the layers right before you leave.`, `The commute this morning is ${temp} degrees of reality check.${feelsNote} A proper coat, not just a jacket.`])
                if (isEdinburgh) return pick([`Cold Edinburgh morning at ${temp} degrees.${feelsNote} The wind makes it feel sharper than the number. Full coat and layers.`, "Edinburgh cold is proper cold -- the wind off the Firth makes no compromises. Dress for it.", `${temp} degrees in Edinburgh this morning.${feelsNote} The wind adds to it significantly -- full coat and something over your ears.`, "Cold Edinburgh start. The city looks extraordinary in this light but you have to earn the view. Full layers.", `Cold this morning in Edinburgh at ${temp} degrees.${feelsNote} The castle will be in frost. Dress like you're about to climb it.`])
                return pick([`Grey and cold on the commute -- ${temp} degrees.${feelsNote} Layer up before you leave.`, `Cold start at ${temp} degrees.${feelsNote} A proper coat today, not just a jacket.`, `${temp} degrees this morning.${feelsNote} Dress properly before you leave -- a jacket isn't enough today.`, `Cold commute this morning.${feelsNote} The kind of cold that reminds you winter isn't finished. Proper coat.`, `${temp} degrees -- take it seriously.${feelsNote} Full layers for the morning.`])
            }
            if (isEvening) return pick([`Getting colder as the evening comes in.${feelsNote} Take something warm for the journey home.`, "Cold evening. Layer up before you leave.", `${temp} degrees this evening -- properly cold.${feelsNote} A coat for the journey home, not just a jacket.`, `Cold one tonight.${feelsNote} The temperature means it. Take the warm coat.`, `Wrap up for the journey home tonight -- ${temp} degrees and it feels it.${feelsNote}`])
            return pick([`Grey and cold today -- ${temp} degrees.${feelsNote} A coat that actually does something today.`, `${temp} degrees and properly cold.${feelsNote} Don't underestimate it.`, "Nobody's pretending this is a great day to be outside. But that's what coffee shops were invented for. Pick one, stay a while. The cold makes the warmth feel earned.", "Cold days have a particular quality if you dress for them properly. Commit to the layers, step outside, and the city is still very much yours.", "This is proper winter. Which means hot food, warm rooms, and only going outside when it's worth it. Choose your outdoor moments today.", "The cold makes everything feel more intentional today. Every step outside is a choice. Make the choices count.", "Dress for it properly and cold days have their own energy. The air is clearer, the pace is slower. There's something in that if you let yourself find it.", "Winter days reward preparation. Sort the layers before you leave and the cold stops being something that happens to you.", "The kind of cold that makes a hot drink taste like a completely different thing. Start there. Build from that.", "Cold and grey doesn't mean cancelled. It means adjust. Layer up, find the warmth where it is, and the day still works."])
        }
        if (temp < 14) {
            if (isMorning) {
                if (isLondon) return pick([`The kind of ${temp} degree morning that looks milder from the window than it is. Take the jacket -- you'll want it on the commute even if you don't need it later.`, `Cool London morning at ${temp} degrees.${feelsNote} Standard commute weather. A mid-layer and you're sorted.`, `${temp} degrees in London this morning.${feelsNote} Not cold enough to panic, cool enough to need a proper layer.`, `London morning at ${temp} degrees -- the jacket is the right call even if it looks like it might warm up.${feelsNote}`, `Cool start at ${temp} degrees.${feelsNote} Mid-layer on, and you'll find you don't need to think about the weather again all morning.`])
                if (isBrighton) return pick([`${temp} degrees in Brighton this morning -- the sea breeze will make it feel sharper on the seafront.${feelsNote} A layer is the right call.`, "Brighton morning -- the wind off the Channel adds to it. A jacket is worth it even if it looks mild.", `${temp} degrees but the Channel wind is doing real work in Brighton this morning.${feelsNote} A proper layer, especially near the seafront.`, `Cool Brighton morning at ${temp} degrees.${feelsNote} The sea breeze makes the jacket non-optional even if the number looks manageable.`, `Brighton this morning at ${temp} degrees.${feelsNote} The seafront wind adds a few degrees of feeling to it. Jacket is the right call.`])
                return pick([`The kind of ${temp} degree morning that looks milder from the window than it is. Take the jacket.`, `Cool morning at ${temp} degrees.${feelsNote} A mid-layer and you're sorted.`, `${temp} degrees this morning -- a jacket covers it.${feelsNote} Looks manageable, feels like it too if you're dressed right.`, `Cool start at ${temp} degrees.${feelsNote} A mid-layer and the morning is fine.`, `${temp} degrees on the way out this morning.${feelsNote} A layer is worth it.`])
            }
            if (isAfternoon) return pick([`${temp} degrees this afternoon -- decent enough if you're dressed for it. Good window for a walk if you've been inside all day.`, `Mild afternoon at ${temp} degrees. Worth getting outside if you can.`, `${temp} degrees this afternoon -- comfortable enough for a walk or an errand. A mid-layer and you're set.${feelsNote}`, `Not exactly warm but not cold either. ${temp} degrees this afternoon is perfectly workable with the right layer.${feelsNote}`, `Decent enough afternoon at ${temp} degrees. If you've been inside all day, worth a short walk at least.${feelsNote}`])
            if (isEvening) return pick([`Cooling off this evening.${feelsNote} Take a layer for the journey home.`, "Getting cooler this evening. A jacket is the sensible call.", `${temp} degrees this evening -- a jacket is the right call.${feelsNote} Not cold, but cool enough to feel it.`, `The evening has cooled off.${feelsNote} A mid-layer for the journey home.`, `Cooling down tonight.${feelsNote} A jacket makes the journey home more comfortable.`])
            if (isLondon) return pick([`Grey and ${temp} degrees -- classic London. Overcast but dry, which is honestly London's most underrated weather. Get outside if you can.`, `${temp} degrees -- not cold enough to complain about, not warm enough to celebrate. Classically London.${feelsNote}`, `Classic London overcast at ${temp} degrees.${feelsNote} The city functions perfectly in these conditions. So should you.`, `${temp} degrees and grey -- this is London's natural state and there's nothing wrong with it.${feelsNote} A layer and get on with the day.`, `London at ${temp} degrees.${feelsNote} Mild, manageable, slightly grey. The city at its most honest. A jacket and you're set.`])
            return pick([`${temp} degrees and overcast -- decent enough. A layer and you're set.${feelsNote}`, `Grey and ${temp} degrees. Nothing to complain about, nothing to celebrate.`, `${temp} degrees -- mild enough but a layer is worth it.${feelsNote} The kind of day you can get on with without weather being a factor.`, `Overcast at ${temp} degrees.${feelsNote} A jacket is the call. Conditions are manageable without drama.`, `${temp} degrees and grey -- the sensible call is a mid-layer and ignoring the sky.${feelsNote}`])
        }
        if (temp > 26) {
            if (isLondon) return pick(["A rare warm London day. The whole city will feel different -- pub gardens packed, parks full, everyone slightly surprised it's happening. Make the most of it.", "Actually warm. London does this occasionally and it's worth appreciating. Get outside -- this is the kind of day people move here for and then wait years to see.", "You've been waiting for one of these. Put on that outfit you've tried in the mirror. Head into the city, get lunch, meet a friend. Be present. These conditions call for it.", "One of those days that makes you forget the grey ever existed. Get outside and stay outside. Cancel whatever you were planning to do indoors instead.", "The city looks completely different in conditions like this. Same streets, same buildings -- but the light changes everything. Don't waste it behind a window.", "This is a rare one. The kind of day people talk about on the grey days. Save nothing for later -- use all of it.", "London in good weather is a completely different city. Take full advantage of that fact today.", "Days like this don't come with a warning. They just show up. The only wrong move is spending it inside."])
            if (isBrighton) return pick(["Warm Brighton day -- the beach will be full by noon. Get there early and enjoy it, these days don't come often.", "Proper beach weather in Brighton. The seafront will be packed. Get out and enjoy it.", "Brighton doing summer. The beach, the pier, the Lanes in the sun -- this is what the town was built for.", "Rare warm day in Brighton. The beach earns it on days like this. Sunscreen and get down early before it fills up.", "A proper Brighton beach day. These don't come around often enough. The seafront, a deck chair, a 99 -- say yes."])
            return pick(["A warm one -- genuinely lovely. Make the most of it.", "Good conditions. Warm and worth being outside for.", "Rare gift today. The kind of weather that changes plans for the better. Say yes to whatever gets you outside.", "The light is different on days like this. Everything looks better. Use that -- go somewhere you've been meaning to go.", "The park, the terrace, the walk you've been putting off. Today is the answer to all of them. No excuses needed.", "Conditions like these make everything feel slightly more possible. Step outside and see what happens."])
        }
        if (temp > 18) {
            if (isMorning) return pick(["Decent morning -- mild and dry. Good conditions. The kind of day that makes the walk feel worthwhile.", "Good start. Mild and manageable -- light jacket territory on the commute.", "Decent morning conditions. Not spectacular, but solid -- mild, dry, worth the walk.", "Good morning conditions. A light layer and the commute is fine.", "Mild start. The walk is comfortable today -- worth taking the longer route if you have time."])
            if (isAfternoon) return pick(["Good afternoon conditions -- mild and dry. If you've been inside all day, this is the moment to step out.", "The afternoon is decent today. Worth getting outside for even 20 minutes.", "Mild afternoon. The kind of conditions where a walk between meetings feels like the right call.", "Good afternoon -- decent enough to step outside for a bit. Don't waste it.", "Mild and dry this afternoon. A brief walk now pays off more than most decisions you'll make today."])
            return pick(["Decent day. Light jacket and you're sorted.", "Good conditions. Not warm enough to make headlines but genuinely pleasant.", "Not every good day needs to be dramatic. This one is steady, comfortable, and completely workable. That's enough.", "Good conditions don't always announce themselves. This one is quiet and reliable -- dress appropriately and the whole day opens up.", "The weather today asks nothing of you except to dress appropriately. Everything else is straightforward from there.", "Comfortable conditions have an underrated quality -- they get out of the way and let the day be whatever you make it."])
        }
        if (isMorning) return pick([`Standard morning at ${temp} degrees. A layer and you're sorted.${feelsNote}`, `${temp} degrees on the way out.${feelsNote} A mid-layer covers it.`])
        if (isEvening) return pick([`${temp} degrees this evening.${feelsNote} Layer up for the journey home.`, "Cooling down this evening. A jacket is the sensible call."])
        return pick([`Standard day at ${temp} degrees. A layer and you're sorted.${feelsNote}`, `${temp} degrees -- decent enough. Dress for it and get on with things.`, "Not every good day needs to be dramatic. This one is steady, comfortable, and completely workable. That's enough.", "The forecast is doing you a favour today. Mild, clear, nothing to plan around. That's the gift -- use it.", "No drama in the forecast today. Just a good day quietly showing up. Those are sometimes the best ones.", "The weather today asks nothing of you except to dress appropriately. Everything else is straightforward from there.", "Comfortable conditions have an underrated quality -- they get out of the way and let the day be whatever you make it.", "Not every day needs perfect weather. Today is proof. Decent conditions, nothing to plan around. The day is yours to shape."])
    }

    // -- GULF --
    const isGulf = c.includes("dubai") || c.includes("abu dhabi") || c.includes("riyadh") ||
        c.includes("doha") || c.includes("kuwait") || c.includes("muscat") ||
        c.includes("jeddah") || c.includes("sharjah") || c.includes("united arab emirates")
    if (isGulf) {
        if (isRaining) return pick(["Rain in the Gulf -- always a surprise and always a disruption. The roads aren't built for it. Add extra time to any journey.", "It's raining. In this city that means the roads get interesting -- accidents are common in wet conditions. Drive carefully.", "Rain here is genuinely unusual. The drainage wasn't designed for it and neither were the drivers. Take it slow.", "Wet conditions in the Gulf -- rarer than snow in London and roughly as disruptive. Roads will be affected. Build in extra time.", "The rain here arrives like a visitor who never usually comes -- everything grinds to a halt. Add significant time to any journey.", "Gulf rain means roads become unpredictable fast. Slow down, leave earlier, and don't be surprised if plans take longer than expected."])
        if (temp > 42) return pick(["Dangerous heat today. This is a medical risk, not just discomfort. Indoors from 9am to 8pm.", `${temp} degrees -- dangerous. AC, water, and minimal outdoor time. No exceptions.`, "This heat is not a summer inconvenience -- it's a genuine health risk. Stay inside, drink constantly, and reschedule anything outdoor.", `${temp} degrees. Beyond extreme -- this is a medical situation for anyone outdoors more than a few minutes. No outdoor plans until after sunset.`, "Dangerous conditions. The outdoor temperature today causes heat illness fast. Treat this seriously and stay indoors."])
        if (temp > 38) {
            if (isMorning) return pick(["Get outdoor plans done before 8:30am -- after that the heat becomes serious fast. Water from the moment you wake up.", "Morning window is closing fast. Anything outdoor needs to happen in the next hour.", "The morning is the only safe outdoor window today. After 9am the heat will be relentless. Get everything done now.", "Early start is not optional today -- the heat climbs fast. Anything outdoor before 9am. Everything else waits until evening.", "Water, sunscreen, and get whatever needs doing outside finished before the city heats up properly. That window is closing."])
            if (isEvening) return pick(["The evening is your best window today -- the intensity has dropped. After 8pm is genuinely pleasant compared to the day. This is when the city comes alive.", "Evening conditions are where the city belongs in summer. The heat has dropped enough to be outside properly.", "The city comes back to life after 8pm. The day belongs to the indoors -- but the evening is genuinely lovely. Save your energy for it.", "After sunset the conditions here transform. The evening is worth waiting for -- cool enough to be outside properly, the whole city out.", "Evening is the reward for getting through the day. The heat drops, the rooftops open, the city wakes up. This is the time."])
            return pick([`${temp} degrees today -- extreme. Midday to early evening is strictly indoors. After 7pm the city comes back to life.`, "Extreme heat. Before 9am or after 7pm for anything outdoor. The rest of the day belongs to the indoors.", "This heat means business. Early morning is yours -- use it properly. After that, AC, cold water, shade. The city comes back to life in the evening. Save your energy for that.", "The sun here isn't asking permission. Before 9am or after 7pm, the city belongs to you. The hours in between belong to the shade.", "The heat today is honest -- it doesn't pretend to be anything other than what it is. Respect it. Work around it. The morning and evening are yours.", "In weather like this the city splits in two -- the people who planned their day around the heat, and the people who didn't. Plan."])
        }
        if (temp > 32) {
            if (isMorning) return pick(["Good morning conditions -- this is as good as it gets in summer here. Get outdoor plans done early. By midday the heat will be serious.", "The morning is pleasant by local standards. Use it. After 11am you'll want to be inside.", "Morning is the whole game today. Get anything outdoor done before 10am -- after that the heat takes over.", "This is the comfortable part of the day. The heat builds fast after 10am. Use the morning fully.", "Good window right now. By late morning the temperature will make outdoor plans difficult. Act early."])
            if (isEvening) return pick(["Beautiful evening conditions. Warm, clear, perfect for being outside. The city is at its best right now -- get outside.", "The evening delivers today. Warm, clear, gentle breeze. Everything outdoors works tonight.", "The best hour of the day is now. The heat has dropped and the city comes alive after dark. Get outside.", "Perfect Gulf evening. The temperature is exactly right for outdoor dining, walking, being properly outside.", "After a hot day, the evening is the reward. The whole city is out right now -- and rightly so."])
            return pick(["Hot but manageable with strategy -- morning or evening for outdoor plans.", "Warm conditions. Morning before 10, evening after 6. The middle of the day belongs to indoor spaces.", "Hot days in this city have a rhythm. Morning for everything that matters. Midday for survival. Evening for living. Follow it.", "Hot cities have a different clock in conditions like this. The day belongs to the shade. The night belongs to everything else.", "The morning window is short and the evening window is worth waiting for. Everything in between is about managing the heat, not fighting it.", "Hydration, shade, AC, and timing. That's the whole strategy today. Get the timing right and the rest follows."])
        }
        if (temp < 20) {
            if (c.includes("dubai")) return pick(["Cool Dubai morning -- light jacket territory, which will confuse locals who are in puffer coats. This is the reward for surviving the summer.", "A beautiful day by Gulf standards -- and by any standards honestly. Cool, clear, perfect for being outside. The whole city will be doing the same thing.", "This is winter in Dubai -- pleasant, warm by European standards, perfect for everything outdoor. The whole city is outside today.", "Cool and beautiful. The desert in winter is a completely different experience from summer. Today is the reason people come January to March.", "Perfect Dubai day. The heat is gone, the sky is clear, the city is alive. This is when the outdoor restaurants and beach clubs are genuinely at their best."])
            return pick(["Cool by Gulf standards. Genuinely lovely conditions. Get outside -- days like this are why people love the winter months here.", "Pleasant conditions. The kind of weather that fills every outdoor restaurant and rooftop in the city.", "Winter in the Gulf is a gift. Warm, clear, comfortable. The outdoor options here are extraordinary on days like this.", "Perfect conditions for everything this part of the world has to offer. The beach, the promenades, outdoor dining -- all of it works today.", "This is the Gulf at its most enjoyable. Cool enough to do things properly, warm enough that everything outside is a pleasure."])
        }
        return pick(["Good conditions -- warm and clear. The kind of day this city was designed for.", "Pleasant day. Warm enough to enjoy, cool enough to function. Everything outdoors works today.", "Comfortable Gulf conditions. Not the extreme heat -- the kind of day where outdoor life actually makes sense.", "Good day here. Warm, clear, every outdoor option is available. This is the city at its best.", "The conditions are right today. Everything outdoor is viable. Make the most of it.", "Warm and manageable. The Gulf at a comfortable temperature is genuinely lovely -- the waterfronts, the parks, everything."])
    }

    // -- WEST AFRICA --
    const isWestAfrica = c.includes("lagos") || c.includes("abuja") || c.includes("accra") ||
        c.includes("kumasi") || c.includes("dakar") || c.includes("abidjan") ||
        c.includes("lome") || c.includes("cotonou") || c.includes("nigeria") || c.includes("ghana")
    if (isWestAfrica) {
        if (isStorm) return pick(["Storm conditions. Stay off the roads -- flooding is possible fast.", "Severe weather. The roads will be dangerous. Stay put if you can.", "Serious storm. Flooding is a real risk -- stay indoors, avoid low-lying routes, and give the roads time to clear.", "Storm weather here is not like storm weather elsewhere. Stay put, stay off the roads, and wait it out.", "Don't be on the roads in this. The flooding can be fast and serious. Stay inside until it passes.", "Severe conditions. This is a stay-home situation if you have any flexibility at all."])
        if (isHeavyRain) {
            if (isMorning) return pick(["Heavy rain this morning and the traffic is already building. If you need to cross the city, leave now or wait it out -- this is the kind of rain that turns a 20-minute journey into 90.", "Serious rainfall this morning. Leave significantly earlier than usual or plan to work around it.", "Heavy rain and a bad commute are guaranteed together. Leave now or wait until late morning. There's no comfortable middle.", "The roads are already feeling this rain. Leave now if you have to travel, or delay until it eases.", "Serious morning rainfall. The commute will take twice as long. Leave immediately or make peace with waiting."])
            if (isAfternoon || isEvening) return pick(["Heavy rain coming and the roads are going to seize up. Leave now or wait until evening -- there's no good middle option.", "The downpour is serious today. Get indoor plans sorted before it arrives.", "Heavy afternoon rain and the traffic situation will be bad. Leave now before it peaks or stay put for a couple of hours.", "The roads will seize up fast in this rain. Leave immediately or plan to wait it out -- there's no comfortable middle.", "Serious rain this afternoon. Traffic will be badly affected. Your options are leave now or wait until evening."])
            return pick(["Heavy rain today. Roads will flood, traffic will be bad -- build a lot of extra time into any journey.", "Serious rainfall. Get outdoor plans done early or push them to tomorrow.", "Heavy rain. Budget significantly more time for any journey and expect road flooding on lower routes.", "Seriously wet conditions. The traffic will be bad and outdoor plans need adjusting. An extra hour for any journey is not excessive.", "Heavy rain -- this is the kind that changes the day. Build in serious extra time for travel and adjust outdoor plans."])
        }
        if (isRaining) {
            if (isMorning) return pick(["Rain on the morning commute. Traffic is going to be slow -- leave earlier than you think.", "Wet start. Leave earlier, give yourself more time, and accept today's commute will take longer.", "Rain means the commute takes significantly longer here. Leave now if you need to be somewhere.", "Raining this morning and the traffic is building. Leave earlier, add time, and don't try to rush it.", "Wet commute morning. The extra time you give yourself will not go to waste today."])
            if (isEvening) return pick(["Evening rain means traffic chaos. Leave now or leave in two hours. The window in between is going to be rough.", "Wet evening commute. Give yourself extra time -- the roads will feel this rain hard.", "Evening rain and rush hour together here are not a good combination. Leave now or give it two hours.", "The roads will be slow in this rain. Leave immediately or plan to work through the evening and leave late.", "Wet evening commute. There's no version of this where the journey is fast. Leave early and accept it."])
            return pick(["Rain today. Build extra time into everything and keep outdoor plans flexible.", "Wet conditions. Roads slow down faster than you'd expect here -- plan around it.", "Rain means adjusting plans here. Travel will take longer and outdoor commitments need rethinking.", "Wet conditions. The traffic impact of rain here is significant -- build in extra time for any journey.", "It's raining. Here that means the roads slow down considerably. Plan around it."])
        }
        if (rain > 50) return pick(["More than likely raining at some point today — probably this afternoon. Morning is your clear window. Use it and plan around the afternoon.", "Rain probable later — the afternoon is the higher risk window here. Morning is your time to be outside.", "The forecast leans toward rain, especially afternoon. Not certain, but likely enough to plan around it.", "Morning looks clear but the afternoon could go wet. Get outdoor things done before noon.", "Rain probable this afternoon. The morning is your reliable outdoor window -- use it while it holds.", "The afternoon looks like the wet window today. Morning is clear -- prioritise outdoor plans now."])
        if (temp > 34) {
            if (isMorning) return pick(["Hot already this morning and it's only going to climb. Get outdoor errands done before 9am. Stay hydrated from the start.", "The heat is building early. Morning is your window -- after 10am the sun will be relentless.", "The temperature is already serious this morning. Get anything outdoor done in the next hour. After that the heat takes over.", "Morning is the whole outdoor game today. After 10am the sun will be intense. Get moving now.", "Hot early and getting hotter. The outdoor window is this morning and it's closing. Use it."])
            if (isMidday) return pick(["Peak heat right now. If you don't have to be outside until 4pm, don't be.", "Serious midday heat. Find shade, find AC, stay hydrated.", "The sun is at its most relentless right now. Indoors, cold water, shade. Come back outside after 4pm.", "Midday here is the heat at its worst. This is not the time for outdoor plans. Find AC and wait for the afternoon to cool.", "Peak conditions right now. The heat and UV together are serious -- indoors until 4pm is the honest advice."])
            return pick(["Very hot today. Early morning was the window -- for the rest of the day, shade and water.", `${temp} degrees and humid. Outdoor plans in short bursts only.`, "Seriously hot today. Short bursts outside, water constantly, and find shade between any outdoor moments.", `${temp} degrees and it means it. The morning was the outdoor window -- for the rest of the day, AC and hydration.`, "Hot and humid. The kind of conditions where the strategy is: short outdoor bursts, lots of water, shade whenever possible."])
        }
        if (temp > 28) {
            if (isMorning) return pick(["Warm morning -- manageable if you're moving. Get outdoor plans done early.", "Good conditions this morning. Make the most of it -- it gets heavier into the afternoon.", "Warm but workable this morning. Get outdoor plans done before midday -- the heat builds from there.", "The morning is the comfortable window today. Warm without being extreme -- use it.", "Good morning conditions here. Not the intense heat -- the manageable kind. Get outdoor things done now."])
            return pick(["Warm but workable. The morning is the best of it. Stay hydrated and find shade when you can.", "Good conditions. Not the extreme heat -- make the most of it.", "This heat means business. Early morning is yours -- use it properly. After that, AC, cold water, shade. Save your energy for the evening.", "Hot days here have a rhythm. Morning for everything that matters. Midday for survival. Evening for living. Follow it.", "In weather like this the city splits in two -- the people who planned around the heat, and the people who didn't. Plan."])
        }
        return pick(["Decent conditions. Morning is always the best window here.", "Good day. Not often it's this comfortable. Make the most of it.", "Comfortable conditions today. The morning is the best of it -- get outside and enjoy the cooler part of the day.", "Good conditions. This is the pleasant side of the climate here -- make the most of it while it lasts.", "Decent day. Not the extreme heat -- the manageable kind where outdoor life actually makes sense.", "Good conditions here. Not often it's this pleasant. The morning is the peak of it."])
    }

    // -- TURKEY --
    const isTurkey = c.includes("istanbul") || c.includes("antalya") || c.includes("bodrum") || c.includes("turkey")
    if (isTurkey) {
        if (isRaining) {
            if (c.includes("antalya") || c.includes("bodrum")) return pick(["Rain on the Turkish coast -- rarer than you'd think and the beach day is probably off. Indoor time: the old city, a long lunch, the bazaar.", "Wet day on the coast. The beach can wait. Explore inland -- there's always more to see."])
            return pick(["Rain in Istanbul. The covered bazaars and hans were invented for days like this. The Grand Bazaar, the Egyptian Spice Market, the caravanserais -- all make more sense in the rain.", "Wet Istanbul. The covered passages and bazaars are the right call today."])
        }
        if (c.includes("antalya") || c.includes("bodrum")) {
            if (temp > 35) {
                if (isMorning) return pick(["Beach before 10am -- that's your comfortable window. The heat will be serious by midday. Sunscreen from the start.", "Get to the beach or the ruins early. By 11am the heat will be intense. Morning is the whole game today."])
                if (isEvening) return pick(["The evening is the best of today on the Turkish coast. The heat has dropped, the sea is warm, the atmosphere shifts. Stay outside tonight.", "Perfect Turkish coast evening. The temperature is right, the light is beautiful, the water is warm. Don't stay in."])
                return pick(["Very hot on the Turkish coast today. Morning and evening are your windows. Midday is for shade, AC, and cold drinks.", "Peak summer heat. Siesta hours exist for exactly this reason. Morning beach, midday shade, evening everywhere."])
            }
            if (temp > 25) return pick(["Good Turkish coast conditions. Warm, clear, everything works. Beach, ruins, old city -- all of it.", "Decent day on the coast. The conditions are right for everything -- make the most of it."])
            if (temp > 15) {
                if (isMorning) return pick([`${temp} degrees on the Turkish coast this morning -- shoulder season conditions. The ruins are empty, the sea is warming up, the old towns are completely yours. Bring a light layer for the early morning.`, "Good Turkish coast morning. The kind of conditions that make spring the best time to visit -- the sites are accessible, the heat is manageable, and the crowds haven't arrived yet."])
                if (isEvening) return pick([`${temp} degrees this evening on the coast -- a light jacket for dinner outside. Turkish coastal evenings in the shoulder season have a particular quality the summer crowds never experience.`, "Comfortable Turkish coast evening. Light layer for outdoor dining -- the temperature drops pleasantly after dark. Worth it for the atmosphere."])
                return pick([`${temp} degrees on the Turkish coast -- shoulder season doing what it does best. Comfortable for the ruins, the beaches, the old towns. Everything is accessible without the summer intensity.`, "Good conditions on the coast. Warm enough to enjoy, cool enough to actually appreciate it. The shoulder season version of Turkey is often the best one."])
            }
            return pick(["Pleasant conditions on the Turkish coast. Comfortable for sightseeing and beach time both. A light layer for the evenings.", "Good day. The coast in these conditions is genuinely lovely -- and significantly emptier than in August."])
        }
        if (temp > 30) return pick(["Hot Istanbul day. The Bosphorus provides some relief but the old city streets trap heat. Early morning for sightseeing, afternoons for the water or shade.", "Summer heat in Istanbul. Bosphorus ferry in the morning when it's cooler -- the view earns it even on a hot day."])
        if (temp < 8) return pick(["Cold Istanbul day. The wind off the Bosphorus adds to it significantly. A proper coat, and the covered bazaars become the obvious choice.", "Cold and possibly windy. The Bosphorus wind is the thing to dress for. The bazaars and tea houses are excellent cold-weather alternatives."])
        if (isMorning) return pick(["Good Istanbul morning. The old city is best early -- the Hagia Sophia before the crowds, the Galata Bridge at sunrise. The city earns its reputation at this hour.", "Beautiful Istanbul morning. The light over the Bosphorus at this hour is one of the world's great sights."])
        return pick(["Good Istanbul conditions. The city between its extremes is completely compelling and walkable.", "Decent Istanbul day. Comfortable enough to walk everywhere, clear enough to see the minarets properly."])
    }

    // -- SPANISH HOLIDAY ISLANDS & COAST --
    const isSpanishIslands = c.includes("tenerife") || c.includes("lanzarote") || c.includes("gran canaria") ||
        c.includes("fuerteventura") || c.includes("mallorca") || c.includes("majorca") ||
        c.includes("menorca") || c.includes("ibiza") || c.includes("marbella") ||
        c.includes("costa del sol") || c.includes("benidorm") || c.includes("alicante") || c.includes("canary") ||
        c.includes("las palmas") || c.includes("santa cruz") || c.includes("palma de") || c.includes("eivissa")
    if (isSpanishIslands) {
        const isCanary = c.includes("tenerife") || c.includes("lanzarote") || c.includes("gran canaria") || c.includes("fuerteventura") || c.includes("canary")
        const isBaleares = c.includes("mallorca") || c.includes("majorca") || c.includes("menorca") || c.includes("ibiza")
        if (isRaining) {
            if (isCanary) return pick(["Rain in the Canaries -- rare and usually brief. The beach will come back. A day for exploring the inland towns and local restaurants.", "Wet day in the Canaries. These islands get very little rain so enjoy the novelty -- it usually passes fast."])
            return pick(["Rain on the island today -- rarer than the brochure suggests. A day for the old town, a long lunch, the covered markets.", "Wet conditions. The beach can wait. Explore the island properly -- there's always more than just the coast."])
        }
        if (temp > 32) {
            if (isMorning) return pick(["Get to the beach early -- before 10am the heat is manageable and the UV hasn't peaked. By noon you'll want shade. Sunscreen from the moment you step outside.", "Beach before 10am is the strategy. After that the heat will be serious and the UV extreme. Afternoon is for shade and cold drinks."])
            if (isEvening) return pick(["The evening is the best part of a hot day here. The heat drops, the restaurants fill up, the seafront comes alive. Stay outside tonight.", "Perfect evening conditions. The heat has gone, the atmosphere is right. Dinner outside, late evening walk -- this is what the holiday is for."])
            if (isCanary) return pick(["Hot Canary Islands day. The trade winds usually help but today the heat will be felt. Beach in the morning, shade in the afternoon.", "Very hot today. Morning beach, afternoon shade, evening everything. That's the Canary Islands rhythm."])
            return pick(["Very hot today. Morning and evening are your windows -- midday is for shade, AC, and cold drinks.", "Peak heat. Siesta hours exist for exactly this reason on these islands. Don't fight the rhythm."])
        }
        if (temp > 22) {
            if (isBaleares && isEvening) return pick(["Beautiful Balearic evening. Warm, clear, everything is better outside tonight. Ibiza sunsets are genuinely extraordinary -- if you haven't seen one, tonight is the night.", "Good evening conditions on the island. Warm, clear, the kind of night where dinner outside is the only sensible option."])
            if (isMorning) return pick(["Good morning on the island. Warm enough to head straight to the beach, clear enough to see everything properly. This is the kind of morning the holiday brochures are based on.", "Beautiful morning conditions. The beach before 10am, then wherever the day takes you -- everything works in weather like this."])
            return pick(["Good island conditions. Warm enough to enjoy everything -- beach, sightseeing, eating outside. A genuinely solid day.", "Decent conditions. The island is at its best in weather like this -- not roasting, just right. Make the most of every hour."])
        }
        if (temp > 15) {
            if (isCanary) {
                if (isMorning) return pick(["Good Canary Islands morning. This is winter sun doing exactly what it's supposed to -- warm enough for the beach, comfortable enough to actually enjoy it. Better than wherever you came from.", "The Canaries in the shoulder season at their absolute best. Warm, clear, manageable. The beach before noon, the towns in the afternoon -- today works."])
                if (isEvening) return pick(["Comfortable Canary Islands evening. A light layer for dinner outside -- the temperature drops pleasantly after dark on the islands. Worth it for the atmosphere.", "The Canaries cool slightly in the evening -- a light layer for outdoor dining. This is still significantly better than a UK evening in any month."])
                return pick(["This is exactly why people come to the Canaries. Not roasting, not cold -- just consistently, reliably comfortable. The beach, the towns, eating outside. All of it works.", "Good Canary Islands conditions. Warm enough to enjoy, cool enough to actually do things. The holiday rhythm working exactly as it should."])
            }
            if (isBaleares) {
                if (isMorning) return pick([`${temp} degrees on the island this morning -- shoulder season doing what it does best. The old town, the coves, the inland roads are all yours before the summer crowds arrive.`, "Good Balearic morning. Warm enough to explore properly, cool enough to cover ground. The island in these conditions is better than the August version."])
                if (isEvening) return pick([`${temp} degrees this evening -- take a light layer for dinner outside. The island in the shoulder season has a particular quality that the summer crowd never sees.`, "Comfortable island evening. Light jacket for outdoor dining -- the temperature cools pleasantly after dark."])
                return pick([`${temp} degrees on the island -- the shoulder season at its best. Everything is accessible, nothing is overwhelming. The beach, the markets, the coves -- today works.`, "Good island conditions. Warm enough to enjoy, cool enough to actually appreciate. This is what the shoulder season is for.", "Beach day makes absolute sense today. Swimwear, a colourful drink, good sun protection. The forecast is giving you full permission.", "The weather has made the decision for you. Beach. All day. Everything else can wait until tomorrow.", "Days like this are what the trip was for. Don't overthink it -- get to the water and stay there.", "Holiday weather doing exactly what it's supposed to. The beach, the water, the cold drink. Don't complicate it.", "You came here for days like this. Don't half-commit -- go all in. Sunscreen, water, nowhere to be. That's the brief."])
            }
            return pick([`${temp} degrees -- comfortable, clear, worth being outside for. The island is pleasant in conditions like these.`, "Good conditions. Warm enough for the coast and the old towns both."])
        }
        if (isCanary) return pick(["Comfortable Canary Islands day -- this is winter sun at its best. Warm enough to enjoy, cool enough to actually do things. Significantly better than whatever you left behind.", "This is why people come to the Canaries in winter. Comfortable, sunny, a completely different experience from northern Europe in the same month."])
        return pick(["Pleasant island conditions. A light layer might be needed in the shade and the evening, but otherwise completely comfortable.", "Good conditions. The island works well in weather like this -- and the lack of crowds makes it better than the summer version."])
    }

    // -- GREEK ISLANDS & MEDITERRANEAN --
    const isGreek = c.includes("mykonos") || c.includes("santorini") || c.includes("crete") ||
        c.includes("rhodes") || c.includes("zante") || c.includes("zakynthos") ||
        c.includes("corfu") || c.includes("cyprus") || c.includes("malta") ||
        c.includes("athens") || c.includes("thessaloniki") || c.includes("larnaca") || c.includes("valletta")
    if (isGreek) {
        if (isRaining) return pick(["Rain in the Med -- rarer than you'd think and more disruptive than you'd expect. A day for the local tavernas, the museums, the parts of the island tourists usually skip.", "Wet conditions. The beach can wait. This is your chance to see the island properly -- the old villages, the inland scenery, the food that the beach crowds never find."])
        if (temp > 35) {
            if (isMorning) return pick(["Get the outdoor sightseeing done before 10am -- the heat will be serious by midday. The ruins, the beach, the old town -- all of them are better early.", "Early morning is the only comfortable window for outdoor activities today. After 10am, shade and cold drinks are the strategy."])
            if (isEvening) return pick(["The Greek evening is the best of the day in this heat. The temperature drops, the tavernas fill up, the light on the white walls is extraordinary. Stay outside tonight.", "Perfect Mediterranean evening. The heat has gone, the atmosphere is exactly right. This is what Greece is for."])
            return pick(["Very hot Med day. Morning and evening are your outdoor windows -- midday is genuinely dangerous to be in the direct sun.", "Peak Med heat. The locals disappear between noon and 5pm for good reason. Follow their lead."])
        }
        if (temp > 25) {
            if (isEvening) return pick(["Beautiful Greek evening. Warm, clear, everything is better outside. Sunset from the terrace, dinner under the stars. Don't stay in.", "Good evening on the island. Warm, clear, the kind of night where being inside feels completely wrong."])
            if (isMorning) return pick(["Good morning conditions on the island. The ruins and the old towns are best early -- before the tour groups and before the heat. This is the window.", "Beautiful Med morning. Warm enough to be at the beach by 9am, clear enough to see everything properly. Start early and the island is yours."])
            return pick(["Good Mediterranean conditions. This is what people come for -- warm, clear, the sea looking exactly right. Make the most of every hour.", "Decent Med day. Beach, ruins, eating outside -- all of it works perfectly in conditions like these.", "The forecast is giving you full permission to do absolutely nothing productive today. Accept it. Beach, water, sun. That's the entire agenda.", "Beach day makes absolute sense today. The forecast, the temperature, the conditions -- all of it lines up. Go.", "Days like this are what the trip was for. Don't overthink it -- get to the water and stay there."])
        }
        if (temp > 15) {
            const city_name = c.includes("santorini") ? "Santorini" : c.includes("mykonos") ? "Mykonos" : c.includes("crete") ? "Crete" : c.includes("rhodes") ? "Rhodes" : c.includes("corfu") ? "Corfu" : c.includes("athens") ? "Athens" : "the island"
            if (isMorning) return pick([`${temp} degrees this morning in ${city_name} -- warm enough to start exploring, comfortable enough to walk properly. The old town and the archaeological sites before the midday heat. A light layer might be useful early on.`, `Good ${city_name} morning at ${temp} degrees. The kind of conditions that make the Med in spring genuinely special -- comfortable, clear, the tourist crush not yet arrived.`])
            if (isAfternoon) return pick([`${temp} degrees in ${city_name} this afternoon -- pleasantly warm without being overwhelming. The beach is comfortable, the old town is walkable, the tavernas are open. A genuinely good Med afternoon.`, `${city_name} at ${temp} degrees -- the shoulder season at its best. Warm enough for everything, cool enough to actually enjoy it without a siesta. Make the most of it.`])
            if (isEvening) return pick([`${temp} degrees this evening in ${city_name}. Light jacket for dinner outside -- the Med in spring cools off after dark. Worth it for the atmosphere.`, `${city_name} evening at ${temp} degrees. Dinner outside with a light layer -- this is the shoulder season experience that beats August every time.`])
            return pick([`${temp} degrees in ${city_name} -- the Med at its most comfortable. Not summer-hot, not winter-cold. The ruins, the beaches, the old towns -- all of it accessible and pleasant.`, `Good conditions in ${city_name} at ${temp} degrees. The kind of Mediterranean day that the school holidays crowd never gets to experience.`])
        }
        if (temp > 8) return pick([`${temp} degrees -- cooler than you might expect but the Mediterranean is still entirely worth it. A proper layer for the evenings; the days are pleasant enough for outdoor exploring.`, "Cool Med conditions. Out of season and completely worth it -- the sites are empty, the locals are themselves, the food is better. A jacket for the evenings."])
        return pick(["Cool Mediterranean conditions. A proper layer needed but the islands and cities are at their most authentic right now.", "Cooler than the brochure suggests, but genuinely worth it. Off season Med is a different experience -- and usually a better one."])
    }

    // -- NORTH AFRICA / MOROCCO --
    const isMorocco = c.includes("marrakech") || c.includes("marrakesh") || c.includes("casablanca") || c.includes("morocco") || c.includes("fes") || c.includes("fez")
    if (isMorocco) {
        if (isRaining) return pick(["Rain in Marrakech -- rarer than you'd think and the souks become even more atmospheric. The rain here is brief and dramatic.", "Wet conditions in Morocco. The medina in the rain has its own particular magic. A morning for tea, the covered souks, and watching the city adjust."])
        if (temp > 38) return pick(["Extreme heat in Marrakech today. The medina traps heat between its walls. Before 9am or after 7pm for outdoor exploring -- the rest of the day is for riad courtyards and shade.", "Serious heat. This is Marrakech summer -- early morning at the souks, afternoon in the cool of a riad, evening on the rooftops."])
        if (temp > 30) {
            if (isMorning) return pick(["Get to Jemaa el-Fnaa and the souks early -- before the heat peaks and before the full crowds arrive. Morning Marrakech is the best Marrakech.", "Morning is the outdoor window in Marrakech today. The souks, the palaces, the gardens -- all of them before 11am."])
            if (isEvening) return pick(["Marrakech evening is the whole point of being here. The square fills up, the food stalls light up, the temperature drops to something human. This is the moment.", "The evening in Marrakech is extraordinary. Jemaa el-Fnaa at sunset, dinner on a rooftop, the city at its most alive. Don't miss it."])
            return pick(["Hot Marrakech day. Morning and evening are the outdoor windows -- midday is for the cool shade of a riad or the tiled interior of a museum.", "Warm conditions. Marrakech rhythm: early souks, afternoon shade, evening on the square."])
        }
        return pick(["Good Marrakech conditions. Warm and comfortable for the medina, the souks, the palaces. The city works well at this temperature.", "Decent conditions. Marrakech is best explored on foot -- today's weather makes that genuinely enjoyable."])
    }

    // -- SOUTH AFRICA --
    const isSouthAfrica = c.includes("cape town") || c.includes("johannesburg") || c.includes("jo'burg") || c.includes("joburg") || c.includes("durban") || c.includes("south africa")
    if (isSouthAfrica) {
        const isCapeTown = c.includes("cape town")
        const isJohannesburg = c.includes("johannesburg") || c.includes("joburg") || c.includes("jo'burg")
        if (isHeavyRain) {
            if (isCapeTown) return pick(["Proper Cape Town rain. The south-easter and rain together -- stay inside if you can. Table Mountain will be in cloud all day.", "Heavy rain today. The mountain is invisible and will be all day. Wine country was made for days like this -- Stellenbosch and Franschhoek are the right answer."])
            if (isJohannesburg) return pick(["Joburg afternoon storm. The thunder and lightning here are serious -- get indoors and wait it out. Usually clears within an hour.", "Heavy storm conditions in Joburg. This is the highveld doing what it does in summer -- dramatic, fast, and over quickly."])
            return pick(["Heavy rain today. Take it seriously -- flooding possible in low areas.", "Seriously wet conditions. Adjust plans accordingly."])
        }
        if (isRaining) {
            if (isCapeTown) return pick(["Rain today. Table Mountain will be clouded over -- if that was the plan, reschedule. The city and the winelands are still completely worth your time.", "Wet Cape Town day. The mountain hides itself in cloud -- but the V&A Waterfront, the Bo-Kaap, long lunches in Woodstock all work in the rain."])
            if (isJohannesburg) return pick(["Rain in Joburg -- afternoon storms are the norm in summer. Morning is usually clear. Plan outdoor things for before noon.", "Wet conditions in Joburg. The afternoon thunderstorms are a feature, not a bug -- dramatic and usually brief."])
            return pick(["Rain today. Adjust outdoor plans accordingly.", "Wet conditions. A waterproof is the right call."])
        }
        if (isCapeTown) {
            if (temp > 30) {
                if (isMorning) return pick(["Good morning for the beaches -- get to Clifton or Camps Bay early before the south-easter picks up. Sunscreen is critical here; the UV in the Cape is extreme.", "Cape Town morning at its best. The beaches are perfect early -- Clifton especially, sheltered from the wind. Sunscreen from the moment you step outside."])
                if (isAfternoon) return pick(["Hot Cape afternoon -- the south-easter may be picking up. Check the wind before you drive to a beach. Clifton when it's calmer, Muizenberg when it isn't.", "Warm afternoon. The Cape Doctor wind can make the Atlantic-facing beaches rough even in this heat. Check conditions."])
                return pick(["Hot Cape Town day. Sunscreen is critical here -- the UV at this latitude is higher than people expect. Beaches, the winelands with their shade, or the mountain trails very early.", "Warm and clear. Cape Town in summer is one of the world's great experiences -- sunscreen, water, and the right beach for the wind direction."])
            }
            if (temp < 12) return pick(["Cold Cape winter. A proper coat -- this is real cold. The winelands are the right answer. Fireside at a Stellenbosch restaurant is exactly the right response.", "Cape winter conditions. The mountain will be dramatic, the storms spectacular from the right vantage point. Dress for it properly."])
            if (isAfternoon) return pick(["Beautiful Cape Town afternoon. The light on the mountain at this time of day is extraordinary. Whatever you're doing, try to be outside for some of it.", "The afternoon light in Cape Town is unlike anywhere else. The mountain, the ocean, the clarity of the air -- worth being outside for."])
            return pick(["Good Cape Town day. The light here is extraordinary in conditions like these. Worth doing everything outdoors that you can.", "Decent Cape conditions. The city is at its best when it's like this -- clear enough to see the mountain properly."])
        }
        if (isJohannesburg) {
            if (temp > 28) return pick(["Hot Joburg day. The highveld heat is dry rather than humid -- more bearable than coastal heat but serious in the midday sun. Sunscreen essential.", "Warm and dry on the highveld today. Joburg at altitude means the UV is stronger than you'd expect. Sunscreen and shade in the middle of the day."])
            if (temp < 10) return pick(["Cold Joburg morning -- Highveld winter nights and mornings are proper cold, even though the days warm up. Layer up for the morning commute.", "Cold on the highveld this morning. Joburg winter mornings are genuinely cold at this altitude -- proper layers for the commute."])
            return pick(["Good Joburg conditions. The highveld climate is generally reliable -- warm days, manageable humidity. Enjoy it.", "Decent day in Joburg. The altitude keeps the climate comfortable on days like this."])
        }
        return pick(["Good conditions today. Worth getting outside.", "Decent day -- make the most of it."])
    }

    // -- EAST AFRICA --
    const isEastAfrica = c.includes("nairobi") || c.includes("kampala") || c.includes("dar es salaam") || c.includes("addis") || c.includes("kigali") || c.includes("kenya") || c.includes("tanzania")
    if (isEastAfrica) {
        if (isHeavyRain) return pick(["Heavy rain today. Roads will be badly affected -- build significant extra time into any journey.", "Serious rainfall. In Nairobi, that means traffic chaos. Leave early or wait it out.", "Heavy rain and the roads here will struggle. Leave early, add significant time, and expect delays.", "Seriously wet conditions. Traffic will be badly affected -- leave now or give the roads a couple of hours.", "Heavy rainfall today. The roads will slow to a crawl. Plan around it -- leave early or wait it out."])
        if (isRaining) return pick(["Long rains doing what they do. An umbrella is essential and leave earlier than usual.", "Rain today. Factor this into outdoor plans and give yourself extra travel time.", "Rain on the commute. Leave earlier than you think and take an umbrella -- the roads will be slower.", "Wet conditions today. Build extra travel time in and keep outdoor plans flexible.", "Raining today. An umbrella and extra time for any journey -- the roads here slow down noticeably in the wet."])
        if (temp > 28) return pick(["Warm by altitude standards -- the UV here is significant even when it doesn't feel that hot. Sunscreen matters at this elevation.", "Warmer than usual. The altitude usually keeps things comfortable but today it'll feel it.", "Warm today by Nairobi standards. The UV at altitude is serious even when the temperature feels manageable. Sunscreen.", "Hotter than usual. The altitude UV is significant -- sunscreen matters here more than the temperature suggests.", "Warm conditions. The UV at this elevation is higher than you'd expect from the temperature. Sunscreen from the start."])
        if (temp < 14) return pick(["Cold for here -- the altitude makes it real. A proper layer makes a significant difference.", "It gets cold at altitude. A jacket is not optional today.", "Cold by Nairobi standards. The altitude makes this temperature bite more than it reads. A proper layer.", "Properly cold today. The altitude means it -- a layer is not optional.", "The altitude cold today is real. A jacket and a layer make the difference between comfortable and not."])
        if (isMorning) return pick(["Good morning conditions. The air at this altitude is remarkable -- crisp, clear. Nairobi mornings are some of the finest in Africa.", "Beautiful start. The altitude keeps mornings like this fresh and clear in a way no coastal city can match.", "Morning here is one of the great things about this climate. Crisp, clean, comfortable. Make the most of it.", "The morning air at this altitude is genuinely remarkable. Cool, clear, the kind of start that sets a day up right.", "Nairobi mornings are something else -- the altitude, the light, the clean air. This is a good one."])
        return pick(["Good conditions. Nairobi at this temperature is genuinely one of the most comfortable climates on the continent.", "Decent day. The rest of Africa is slightly jealous of conditions like this.", "Good day. The highland climate at its most comfortable -- the reason Nairobi is one of Africa's most liveable cities.", "Comfortable conditions. The altitude keeps it genuinely pleasant when the rest of the continent is considerably less forgiving.", "Decent conditions today. Nairobi at a good temperature is a genuinely excellent place to be outside."])
    }

    // -- AMERICAS --
    const isCaribbean = c.includes("cancun") || c.includes("caribbean") || c.includes("jamaica") || c.includes("barbados") || c.includes("havana") || c.includes("cuba") || c.includes("punta cana")
    if (isCaribbean) {
        if (isHeavyRain) return pick(["Tropical downpour today. These are intense and usually brief -- find cover, wait 30 minutes, reassess. The beach will come back.", "Heavy tropical rain. The kind that makes streets into temporary rivers. Get inside and wait -- it usually passes within an hour."])
        if (isRaining) return pick(["Tropical rain today. It arrives fast and usually leaves fast -- keep plans flexible and don't cancel everything.", "Wet conditions. Caribbean rain is dramatic but brief. An umbrella and patience is all you need."])
        if (temp > 33) {
            if (isMorning) return pick(["Get to the beach or outdoor sights early -- before 10am the heat is manageable. After that, UV and heat combine to make midday outdoor time inadvisable.", "Morning is the outdoor window. Beach and sightseeing before 10am, shade and cold drinks through the middle of the day."])
            if (isEvening) return pick(["The evening is the best part of a hot Caribbean day. The heat drops, the atmosphere shifts, everything outdoors is worth staying for.", "Caribbean evenings are the reward for getting through the heat of the day. Get outside and enjoy every bit of it."])
            return pick(["Very hot Caribbean day. Morning and evening are your outdoor windows. Midday is for shade, cold drinks, and AC.", "Peak tropical heat. The rhythm here: morning activity, afternoon shade, evening everything."])
        }
        return pick(["Good Caribbean conditions. Warm, clear, the sea looking right. Everything works today.", "Decent conditions. The Caribbean at this temperature is exactly what it should be."])
    }

    const isBrazil = c.includes("rio") || c.includes("sao paulo") || c.includes("salvador") || c.includes("brazil")
    if (isBrazil) {
        if (isHeavyRain) return pick(["Heavy rain in Brazil -- flash flooding possible in low-lying areas. Check local conditions before travelling anywhere.", "Serious rainfall. Roads will be affected and some low areas may flood. Plan around it."])
        if (isRaining) {
            if (c.includes("rio")) {
                if (isMorning) return pick(["Rain this morning in Rio. Christ the Redeemer will be in cloud today -- if that was the plan, reschedule for a clear morning. The city has plenty to offer indoors.", "Wet Rio morning. The beach is off for now -- indoor alternatives today. The rain here usually passes."])
                return pick(["Rain today in Rio. The beach can wait -- this is the city that invented making the most of an afternoon. The rain usually passes by evening.", "Wet conditions in Rio. A museum day, a neighbourhood walk, a long lunch. The city is still beautiful in the rain."])
            }
            return pick(["Rain today. Keep plans flexible -- tropical rain here can clear fast or stay.", "Wet conditions. An umbrella and flexible plans."])
        }
        if (c.includes("rio")) {
            if (temp > 32) {
                if (isMorning) return pick(["Get to Ipanema or Copacabana before 9am -- the beach is best early before the heat peaks. UV is extreme by 10am. Sunscreen is not optional here.", "Early morning is the beach window in Rio. Before 9am the light is extraordinary and the heat is manageable. By 11am you'll want shade."])
                if (isMidday) return pick(["Peak Rio heat right now. The beach crowd has thinned because Cariocas know better -- midday is for shade, cold drinks, and AC. Come back after 4pm.", "Midday Rio heat is serious. This is not the time to be on the sand. Find shade, drink water, save outdoor plans for the afternoon."])
                if (isAfternoon) return pick(["Late afternoon in Rio is the best of the day -- the heat eases, the light turns golden, and Ipanema beach comes back to life. This is the window.", "The afternoon light in Rio is extraordinary. The heat has dropped and the angle of sun on the mountains and sea is one of the world's great sights."])
                if (isEvening) return pick(["Perfect Rio evening. The heat has dropped, the sea breeze is in, the city is waking up. Outdoor dinners, the sea walk, cold drinks at a boteco. Get outside.", "Rio at night after a hot day is everything. The whole city moves outdoors. Don't stay in."])
                return pick([`${temp} degrees in Rio today. Beach window is early morning or late afternoon -- midday is for shade and cold drinks.`, "Hot and beautiful. This is what Rio is. Sunscreen, water, and the knowledge of when to be in the sun."])
            }
            return pick(["Good Rio conditions -- warm, manageable, clear enough to see the mountains. Christ the Redeemer is probably visible and the beach is pleasant.", "Decent day in Rio. The city at a comfortable temperature -- the beach is good, the walking routes are good, everything works."])
        }
        if (temp > 30) return pick(["Very hot and humid. The morning is your outdoor window -- use it.", "Intense heat. Make the most of the morning before the humidity peaks."])
        return pick(["Good conditions. Worth getting outside.", "Decent day -- make the most of it."])
    }

    const isUSA = c.includes("new york") || c.includes("brooklyn") || c.includes("manhattan") ||
        c.includes("miami") || c.includes("los angeles") || c.includes("san francisco") ||
        c.includes("chicago") || c.includes("boston") || c.includes("las vegas") || c.includes("orlando")
    if (isUSA) {
        const isMiami = c.includes("miami")
        const isLasVegas = c.includes("las vegas")
        const isOrlando = c.includes("orlando")
        const isNYC = c.includes("new york") || c.includes("brooklyn") || c.includes("manhattan")
        const isLA = c.includes("los angeles")
        const isSF = c.includes("san francisco")
        if (isStorm) return pick(["Severe weather. Check local alerts before heading out -- delays are almost certain.", "Storm conditions. The city will manage but your plans need adjusting."])
        if (isHeavyRain) {
            if (isNYC) {
                if (isMorning) return pick(["Heavy rain on the morning commute. The subway will be packed and the streets will be rivers at the crossings. Give yourself extra time and a proper waterproof.", "Seriously raining this morning. Every cab will be taken and the subway will be standing room only. A full waterproof jacket beats any umbrella in New York wind."])
                return pick(["Heavy rain. Check transit status, leave early, waterproof jacket over any umbrella.", "Proper rain today -- the kind where umbrellas get destroyed. A waterproof jacket is the move."])
            }
            return pick(["Heavy rain today. Build extra time into journeys and adjust outdoor plans.", "Serious rain. Take it seriously and plan around it."])
        }
        if (isLasVegas) {
            if (temp > 40) return pick(["Extreme Vegas heat today. This is genuinely dangerous outdoors. The Strip is survivable only because everything is connected indoors -- use that. No outdoor pools between 11am and 5pm.", `${temp} degrees in Las Vegas -- dangerous heat. The casinos and indoor spaces are air-conditioned for a reason. Use them.`])
            if (temp > 35) return pick(["Very hot Vegas day. Morning pool time before 10am. Afternoon indoors. Evening outdoors from 7pm when it starts to ease. That's the strategy.", "Peak Vegas heat. Morning before 10, indoors through the middle of the day, evenings are beautiful. The city was designed for this rhythm."])
            return pick(["Good Vegas conditions -- warm and clear. The desert is beautiful in weather like this. Outdoor pools, rooftop bars, the whole thing.", "Decent Vegas day. The desert heat at this level is manageable. Enjoy the outdoor spaces properly."])
        }
        if (isOrlando) {
            if (isRaining) return pick(["Afternoon storm in Orlando -- entirely typical. The theme parks keep running through most weather. A waterproof poncho is the park veteran's move.", "Rain in Orlando. Afternoon storms are the summer norm here -- brief, heavy, and then gone. Keep the day going."])
            if (temp > 35) return pick(["Very hot Orlando day. Theme park strategy: arrive at opening, take a long lunch break in AC around noon, back out from 3pm. Water constantly.", "Serious heat in Orlando. The parks are intense in this weather -- water, shade breaks, and the AC of indoor rides and restaurants."])
            return pick(["Good Orlando conditions. The parks will be busy but the weather is working with you today.", "Decent day in Orlando. Good conditions for the parks -- make the most of it."])
        }
        if (isMiami) {
            if (temp > 32) {
                if (isEvening) return pick(["Miami evening is the whole point. The heat drops, South Beach comes alive, the rooftops fill up. Get outside -- this is what Miami is.", "Perfect Miami evening. After the heat of the day the city transforms. Be outside for it."])
                return pick(["Hot Miami day. Beach in the morning before the UV peaks, shade through the middle of the day, South Beach again in the evening.", "Serious heat in Miami. Morning beach, afternoon AC, evening everywhere. That's the Miami rhythm."])
            }
            return pick(["Good Miami conditions. Warm, clear, the Art Deco buildings looking right. Beach, outdoor dining, all of it works today.", "Decent Miami day. The city at a comfortable temperature is genuinely enjoyable. Make the most of it."])
        }
        if (isNYC) {
            if (temp < -5) return pick(["Dangerous cold in the city today. Exposed skin frostbitten in minutes in this wind. Cover everything.", "Extreme cold. The wind between the buildings makes it worse than the number. Take it seriously."])
            if (temp < 0) return pick([`${temp} degrees and the wind will make it feel worse.${feelsNote} Full winter kit -- the kind of cold where a scarf over your face is reasonable.`, "Sub-zero. New York winter at its most honest. Every extra layer is justified."])
            if (temp < 8) {
                if (isMorning) return pick([`Cold commute this morning -- ${temp} degrees${feelsNote} and the wind between buildings will make it sharper. Coat, hat, gloves.`, "Properly cold start. The morning walk from the subway will remind you what winter means."])
                return pick([`Cold day in the city -- ${temp} degrees.${feelsNote} The wind chill between the buildings is what to dress for.`, "Cold conditions. New York winter is the real thing."])
            }
            if (temp > 35) return pick(["Heat advisory conditions. The city gets dangerous in this heat -- subway platforms are brutal. Stay hydrated and use AC.", "Serious heat. The urban heat island makes the city worse than the forecast. Water constantly, find shade."])
            if (temp > 22) {
                if (isAfternoon) return pick(["Perfect city afternoon. The kind that fills the High Line and empties the offices early. Get outside.", "Good afternoon in the city. This is when New York earns its reputation -- mild, clear, the skyline looking right."])
                return pick(["Good day in the city. New York at this temperature is the city at its best -- energetic, walkable, properly alive.", "Decent conditions. The kind of day that reminds you why people put up with everything else this city asks of you."])
            }
            return pick([`Standard city day at ${temp} degrees.${feelsNote}`, `${temp} degrees in the city. Layer for the commute and you'll be fine.${feelsNote}`])
        }
        if (isLA) {
            if (isRaining) return pick(["Rain in LA -- rarer than you'd think and the city doesn't handle it gracefully. Expect accidents and slow traffic. Add serious extra time to any journey.", "LA in the rain is a different city. The driving gets bad fast. Add time, take it slow."])
            if (temp > 35) return pick(["Very hot LA day. The canyons trap heat. Beach communities will be more bearable -- head towards the coast.", "Serious heat inland. Malibu and the coastal areas will be cooler. The Valley will be intense."])
            if (c.includes("san francisco") || isSF) return pick(["San Francisco weather is always a layer situation -- warm sun, cold fog, often within blocks of each other. Check which part of the city you're in.", "SF fog may be in play today. The microclimate difference between the Sunset and SOMA can be 10 degrees. Layer and adapt."])
            return pick(["Good LA conditions. The city works well in weather like this -- everything outdoor is better today.", "Decent LA day. Not dramatic, just reliably pleasant. That's why people move here."])
        }
        return pick(["Good conditions. Worth being outside.", `Decent day at ${temp} degrees. Layer appropriately and the day is yours.${feelsNote}`])
    }

    // -- PARIS --
    if (c.includes("paris")) {
        if (isRaining) {
            if (isMorning) return pick(["Rain this morning in Paris. The metro is the move -- every taxi will be taken. An umbrella is mandatory but the city still looks beautiful in the rain.", "Wet Paris morning. The cafes fill up, the covered passages become suddenly relevant, and Paris in the rain has its own particular beauty."])
            if (isEvening) return pick(["Raining this evening. Paris at night in the rain is one of the world's genuinely beautiful things -- the reflections on the boulevards. Take an umbrella and enjoy it.", "Rain this evening. The covered terraces will be full and the atmosphere will be entirely fine."])
            return pick(["Rain in Paris. The covered terraces, the arcades, the cafes with windows that steam up just right. An umbrella and you're set.", "Wet conditions in Paris. Tourists cancel things on days like this -- locals don't, and they're right not to."])
        }
        if (temp > 30) {
            if (isAfternoon) return pick(["Hot Paris afternoon. The city doesn't do AC well -- the Jardin du Luxembourg and the Seine banks are the right answers right now.", "Warm afternoon. Paris gets heavy in serious heat -- the stone buildings trap it. The parks and gardens are your best friends."])
            return pick(["Warm day in Paris. Sunscreen, water, and the knowledge that the city's infrastructure doesn't always keep up with the heat.", "Hot by Parisian standards. The museums will be cool. The evenings will be beautiful."])
        }
        if (temp < 5) return pick(["Cold Paris morning. The kind of cold that makes a coffee and a croissant feel like necessity rather than luxury.", "Properly cold today. Paris in winter is beautiful but requires layers."])
        if (temp > 18) {
            if (isAfternoon) return pick(["Beautiful Paris afternoon. The terraces will be full -- and rightly so. Whatever your plans, being outside is the right call.", "The kind of afternoon Paris was designed for. Warm, clear, the terraces and boulevards at their best."])
            return pick(["Good day in Paris. The city looks best in conditions like these -- the stone buildings, the long boulevards, the light.", "Decent Paris day. The terraces will be full and the atmosphere will be good."])
        }
        return pick([`${temp} degrees in Paris -- mild and manageable. A mid-layer and you're set for whatever the day holds.`, "Decent conditions in the city. Paris at this temperature is comfortable and completely itself."])
    }

    // -- BARCELONA & MADRID --
    if (c.includes("barcelona") || c.includes("madrid") || c.includes("seville") || c.includes("valencia") || c.includes("spain")) {
        if (isRaining) return pick(["Rain in Spain -- rarer than you'd think, more disruptive than you'd expect. Indoor time: museums, covered markets, long lunches.", "Wet today. Southern European rain arrives seriously when it arrives."])
        if (temp > 35) {
            if (c.includes("madrid")) return pick(["Madrid heat is the serious dry kind -- intense but without the humidity. Shade and siesta hours are not optional today.", "Very hot in Madrid. The city empties at midday for good reason. Morning and evening are your outdoor windows."])
            if (isMorning) return pick(["Get to the beach or outdoor sights early -- by 11am the heat will be serious. After that, siesta hours exist for excellent reasons.", "Morning is your outdoor window today. Beach, Gaudi, the Gothic Quarter -- all before the heat peaks."])
            if (isEvening) return pick(["The evening is where Barcelona belongs in summer. The heat drops, every terrace fills up, and the city transforms. Stay out late -- everything starts late here anyway.", "Perfect evening. After the heat of the day the city comes alive. Outdoor dinners, rooftop bars, the seafront."])
            return pick(["Very hot today. Siesta hours exist for excellent reasons -- use them. Morning and evening are the outdoor windows.", "Summer heat at its peak. Morning and evening are your time."])
        }
        if (temp > 22) {
            if (isEvening) return pick(["Beautiful evening in Spain. The temperature is perfect, every terrace is full, and the city is doing exactly what it does best. Whatever your plans, being outside tonight is right.", "Good evening conditions. Warm enough, clear enough, the outdoor tables are the only sensible option."])
            if (isMorning) return pick(["Good morning conditions. Mild, clear, the city before the day fully starts -- the Boqueria, the Gothic Quarter, the Retiro -- all of them at their best before the crowds arrive.", "Beautiful morning in the city. Warm enough to walk anywhere, clear enough to see everything. Start early and the day is completely yours."])
            return pick(["Good conditions. The city is completely walkable today -- the streets, the parks, the outdoor terraces all earn their place in weather like this.", "Decent day. The kind of conditions where walking everywhere makes sense and you remember why Spain is worth visiting outside of summer."])
        }
        if (temp > 12) {
            if (c.includes("barcelona")) {
                if (isMorning) return pick([`${temp} degrees in Barcelona this morning -- spring at its most honest. The Sagrada Familia, Park Guell, the Gothic Quarter without the August crush. A light layer for the morning, possibly not needed by afternoon.`, `Barcelona at ${temp} degrees -- shoulder season doing exactly what it should. The city is walkable, the sites are accessible, the food is the same. Significantly better than August.`])
                if (isAfternoon) return pick([`${temp} degrees in Barcelona this afternoon. The Barceloneta seafront, the Born neighbourhood, the Eixample terraces -- all of them pleasant in conditions like this.`, `Good Barcelona afternoon at ${temp} degrees. The kind of conditions that make walking the full length of the Rambla actually enjoyable rather than a survival exercise.`])
                if (isEvening) return pick([`${temp} degrees in Barcelona this evening -- a light jacket for dinner outside. The El Born bars, the Gothic Quarter restaurants, the Barceloneta seafront -- all worth it in conditions like these.`, `Barcelona evening at ${temp} degrees. Light jacket for the terraces -- the city at night in the shoulder season is genuinely excellent.`])
                return pick([`${temp} degrees in Barcelona -- comfortable for everything the city offers. The architecture, the food, the beaches without the madness. This is actually the best version of the city.`, `Good Barcelona conditions at ${temp} degrees. The city between its extremes is completely compelling and significantly less overwhelming than in peak season.`])
            }
            if (c.includes("madrid")) {
                if (isMorning) return pick([`${temp} degrees in Madrid this morning -- spring in the capital. The Prado, the Retiro, the tapas bars of La Latina -- all of them more rewarding in conditions like this than in the summer heat.`, `Madrid at ${temp} degrees -- the kind of morning that makes walking the city feel like the right decision. A light layer and the whole place is yours.`])
                return pick([`${temp} degrees in Madrid -- comfortable for everything. The Prado without a queue, the Retiro without a crowd, the tapas at a decent hour. Conditions like these make Madrid genuinely excellent.`, `Good Madrid conditions. The city at this temperature is at its most walkable and most rewarding.`])
            }
            return pick([`${temp} degrees -- mild and manageable. A mid-layer for the morning and you're set for everything the city or coast has to offer.`, `Decent Spanish conditions at ${temp} degrees. Comfortable for outdoor exploring, pleasant for the terraces in the afternoon.`])
        }
        return pick([`${temp} degrees -- a proper layer needed but the city is still completely worth it. Spain in the cooler months has a quality the summer crowds never discover.`, "Cool conditions. A jacket is needed but the city is less crowded and more itself. Often the best time to visit."])
    }

    // -- PORTUGAL --
    if (c.includes("lisbon") || c.includes("lisboa") || c.includes("porto") || c.includes("portugal")) {
        const isLisbon = c.includes("lisbon") || c.includes("lisboa")
        const isPorto = c.includes("porto")
        if (isRaining) {
            if (isLisbon) return pick(["Rain in Lisbon -- rarer than you'd expect and the city handles it with typical Portuguese calm. The trams still run, the pasteis de nata still taste the same. An umbrella and you're fine.", "Wet Lisbon day. The miradouros are atmospheric in the rain and the Alfama is beautiful when it's quiet. A day for the covered markets and long lunches."])
            if (isPorto) return pick(["Rain in Porto -- not a surprise given the Atlantic position, but the city is still completely itself. The Ribeira in the rain has a particular beauty. The port wine caves are the right call.", "Wet Porto day. The wine cellars on the Vila Nova side, a long lunch in the Ribeira, the Livraria Lello -- all of them work perfectly in this weather."])
            return pick(["Rain in Portugal today. An umbrella and the indoor options -- and Portugal's indoor options are excellent.", "Wet conditions. Portugal in the rain is still Portugal."])
        }
        if (temp > 32) {
            if (isLisbon) return pick(["Hot Lisbon day. The Atlantic breeze helps enormously on the waterfront and in Belem -- the city is more manageable than Madrid in this heat. Mornings at the riverside, afternoons in the shade.", "Warm Lisbon conditions. The city's position on the Tagus gives it a breeze that makes even hot days more bearable than inland Spain. Sunscreen essential -- the Atlantic UV is serious."])
            return pick(["Hot day in Portugal. The coast and the river are your best friends. The heat in the interior is more serious than the coast.", "Very warm conditions. Morning for outdoor sightseeing, afternoon for shade and cold Super Bock."])
        }
        if (temp > 18) {
            if (isLisbon) {
                if (isAfternoon) return pick(["Beautiful Lisbon afternoon. The light on the Tagus at this time of day is extraordinary -- the miradouros are worth the climb. The city at its most photogenic.", "Perfect Lisbon afternoon. Belem, the Praca do Comercio, the Alfama -- all of them earn a visit when the conditions are like this."])
                if (isEvening) return pick(["Lovely Lisbon evening. The city comes alive after dark in a way that feels genuinely Mediterranean. Dinner in the Alfama, fado if you haven't heard it, the Tagus lit at night.", "Perfect evening in Lisbon. The city is at its best now -- the heat has dropped, the light is golden, the outdoor restaurants are filling up."])
                return pick(["Good Lisbon conditions. Europe's sunniest capital showing why people move here. The trams, the miradouros, the riverside -- all of it is better in weather like this.", "Decent Lisbon day. The city is genuinely lovely in conditions like these -- walkable, warm without being oppressive, the Tagus looking exactly right."])
            }
            if (isEvening) return pick(["Beautiful Porto evening. The Douro at dusk, the Ribeira lit up, the port wine flowing -- this is what the city is for.", "Perfect evening in Porto. The Dom Luis bridge at night, dinner in the Ribeira, the sound of the city -- all of it better in conditions like this."])
            return pick(["Good Porto conditions. The city is excellent in weather like this -- the Ribeira walkable, the viewpoints rewarding, the food scene completely itself.", "Decent day in Porto. The bridges, the tiles, the wine -- all of it earns your attention in conditions like these."])
        }
        if (temp < 10) return pick(["Cool Portuguese morning. A layer is needed -- the Atlantic wind adds to it. The coffee culture here was made for days like this.", "Cold by local standards. A jacket today and the indoor options become very appealing -- Portugal has excellent ones."])
        return pick(["Decent conditions in Portugal. Comfortable for everything the country offers.", "Good day. Portugal at this temperature is pleasant and completely worth exploring."])
    }

    // -- ITALY (Rome, Florence, Milan) --
    if (c.includes("rome") || c.includes("roma") || c.includes("florence") || c.includes("firenze") || c.includes("milan") || c.includes("milano") || c.includes("italy") || c.includes("italia") || c.includes("venice") || c.includes("venezia") || c.includes("naples") || c.includes("napoli")) {
        const isRome = c.includes("rome") || c.includes("roma")
        const isFlorence = c.includes("florence") || c.includes("firenze")
        const isMilanCity = c.includes("milan") || c.includes("milano")
        const isVenice = c.includes("venice") || c.includes("venezia")
        if (isRaining) {
            if (isRome) return pick(["Rain in Rome -- the Colosseum in the rain has its own particular drama, and the crowds thin instantly. The Vatican Museums are actually easier on a wet day. An umbrella and the indoor Italy is extraordinary.", "Wet Rome day. The Pantheon in rain -- the oculus with raindrops falling through it -- is one of the world's great experiences. Don't cancel anything, just take an umbrella."])
            if (isFlorence) return pick(["Rain in Florence. The Uffizi, the Accademia, the covered Vasari Corridor -- the city has indoor options that justify a lifetime of visits. An umbrella for the streets between them.", "Wet Florence day. The museums are less crowded in the rain and more rewarding for it. The Duomo interior, the Bargello, Oltrarno in the drizzle -- all worth it."])
            if (isVenice) return pick(["Rain in Venice -- which means acqua alta is possible if conditions are right. Check the tide boards and wear appropriate footwear. The city in the rain is hauntingly beautiful though.", "Wet Venice. The sestieri empty of most tourists in the rain and the city becomes something else entirely -- quieter, more itself, the canals reflecting the grey sky."])
            return pick(["Rain in Italy today. An umbrella and the indoor options -- and Italy's indoor options are among the world's greatest.", "Wet conditions. Italian cities were built partly around this -- the covered arcades, the churches, the museums."])
        }
        if (temp > 35) {
            if (isRome) return pick(["Serious Rome heat today. The Forum and the Colosseum between noon and 4pm are genuinely dangerous without shade or water. Early morning for the ancient sites, afternoon for the museums or a cold Aperol in the shade.", "Very hot in Rome. The Trastevere fountains and the Pincio gardens are the places to be -- shade, water, the city from above. The queue for the Colosseum is brutal in this heat. Book ahead and go early."])
            if (isFlorence) return pick(["Florence valley heat is serious today -- the city traps it between the hills. The Boboli Gardens in the early morning, the museums in the afternoon, aperitivo in the Oltrarno when it cools. Don't attempt the Duomo climb between noon and 4pm.", "Very hot Florence day. The valley position amplifies everything -- dress light, drink constantly, and give yourself permission to sit in the shade and watch the city. Sometimes that's the whole point."])
            return pick(["Serious Italian heat today. Early morning for outdoor sightseeing, museums in the afternoon, evening everything. The Italian rhythm exists for this reason.", "Very hot. Italy in summer knows how to handle this -- follow the locals' lead. Siesta hours are not a suggestion."])
        }
        if (temp > 22) {
            if (isRome) {
                if (isAfternoon) return pick(["Beautiful Rome afternoon. The light on the ochre buildings, the piazzas filling up, the fountains running -- this is the city that people fall in love with. Whatever you planned, be outside for some of it.", "Perfect Rome afternoon. The Pincio above the Piazza del Popolo, the Campo de' Fiori, the Trastevere lanes -- the city at exactly the right temperature."])
                if (isEvening) return pick(["Rome in the evening is its most complete self. The heat has dropped, the piazzas are full, the fountains lit up, the restaurant terraces open. This is what the city was built for -- stay outside.", "Perfect Roman evening. Dinner in Trastevere, a gelato near the Pantheon, a walk through the Campo de' Fiori -- the city at its most alive and most itself."])
                return pick(["Good Rome conditions. The Eternal City in conditions like these is genuinely extraordinary -- the history, the food, the light. Make the most of every hour.", "Decent Rome day. The city earns every superlative when the weather cooperates like this."])
            }
            if (isFlorence) return pick(["Good Florence conditions. The Ponte Vecchio in the morning light, the Piazzale Michelangelo at dusk, the Uffizi without summer crowds -- all of it is better in weather like this.", "Beautiful Florence day. The city that contains more art per square metre than anywhere on earth is also one of the most pleasant to walk in conditions like these."])
            if (isVenice) return pick(["Good Venice conditions. The Grand Canal, the sestieri away from San Marco, the islands of Murano and Burano -- all of them better when the weather cooperates. An early start and the city is yours.", "Decent Venice day. The city rewards early rising at the best of times -- today, with conditions like these, it's extraordinary."])
            return pick(["Good Italian conditions today. Make the most of every outdoor moment -- Italy rewards it.", "Decent day. Italy in weather like this is doing what it does best."])
        }
        if (temp < 8) return pick(["Cold Italian morning. A proper coat -- Italy in winter is less forgiving than the reputation suggests. The cities are less crowded and more beautiful for it.", "Cold conditions. Italian cities in winter have a particular beauty that the summer crowds obscure. Worth it -- just dress for it properly."])
        return pick(["Decent Italian conditions. Comfortable for sightseeing and outdoor dining both.", "Good day. The city is pleasant in conditions like these."])
    }

    // -- CENTRAL EUROPE (Vienna, Prague, Amsterdam) --
    if (c.includes("vienna") || c.includes("wien") || c.includes("prague") || c.includes("praha") || c.includes("amsterdam") || c.includes("netherlands") || c.includes("austria") || c.includes("czech")) {
        const isVienna = c.includes("vienna") || c.includes("wien")
        const isPrague = c.includes("prague") || c.includes("praha")
        const isAmsterdam = c.includes("amsterdam") || c.includes("netherlands")
        if (isRaining) {
            if (isVienna) return pick(["Rain in Vienna -- the Kunsthistorisches Museum, the Belvedere, the covered Naschmarkt arcades. The city was built for culture in all weathers. An umbrella and a Melange in a coffee house first.", "Wet Vienna day. The Wiener Kaffeehauskultur was invented for days exactly like this. Find a Kaffeehaus, order something extravagant, and watch the city through the window."])
            if (isPrague) return pick(["Rain in Prague -- the Old Town in the rain is less crowded and more atmospheric. The Charles Bridge with mist rising from the Vltava is genuinely extraordinary. An umbrella and the city is yours.", "Wet Prague day. The castle district, the Jewish Quarter, the covered passages of the New Town -- all of them have a particular quality in the rain that the summer postcards miss."])
            if (isAmsterdam) return pick(["Rain in Amsterdam -- which is entirely normal and the city handles it with Dutch pragmatism. The Rijksmuseum, the Van Gogh Museum, the Anne Frank House -- all better on a wet day when the queues are shorter.", "Wet Amsterdam. The canal houses look extraordinary reflected in the puddles and the city continues at full speed regardless. An umbrella and a cheese shop and you're completely fine."])
            return pick(["Rain today. A jacket and umbrella -- and these cities have excellent reasons to be indoors.", "Wet conditions. Expected, handled, moved past."])
        }
        if (temp > 28) {
            if (isVienna) return pick(["Warm Vienna day. The Prater is the answer -- the chestnut trees, the Riesenrad, the old-fashioned beer gardens. The Danube Island for swimming if you have time. The city earns its summer reputation.", "Hot Vienna conditions. The Heurigen wine gardens in the hills above the city are the right call today -- shade, wine, the city below. Take the tram to the end of the line."])
            if (isPrague) return pick(["Warm Prague day. The Letna Beer Garden above the city, the Vltava riverbanks, the parks of Vinohrady -- the city knows how to do summer. The Castle in this light is spectacular.", "Hot Prague conditions. The beer gardens fill up and the city moves outdoors. Grab a bench above the river and let the city happen around you."])
            if (isAmsterdam) return pick(["Warm Amsterdam day. The Vondelpark will be full, the canal-side terraces packed, every Amsterdammer outdoors treating the sun with the appreciation it deserves here. Join them.", "Good Amsterdam conditions. The city in the sun is a different animal -- the canals sparkling, the bikes everywhere, the terraces packed. This is what the grey months are for."])
            return pick(["Warm day. These cities in summer sunshine are genuinely lovely -- get outside.", "Good conditions. Make the most of it."])
        }
        if (temp > 12) {
            if (isVienna) return pick(["Good Vienna conditions. The Ringstrasse, the Belvedere gardens, the Prater -- all of them reward a walk in weather like this. The coffee houses for when you need a break.", "Decent Vienna day. The city is one of Europe's most walkable and most beautiful -- conditions like these make both feel effortless."])
            if (isPrague) return pick(["Good Prague conditions. The city is extraordinary to walk in weather like this -- the Old Town, the Mala Strana, the castle district, the bridges. Start early and the crowds are manageable.", "Decent Prague day. The Nusle Valley, the Vyšehrad, the river paths -- the parts of the city that tourists miss. Conditions like these make exploration feel right."])
            if (isAmsterdam) return pick(["Good Amsterdam conditions. The canal ring, the Jordaan, the Plantage -- the city rewards walking in conditions like these. Rent a bike if you haven't already.", "Decent Amsterdam day. The city on a comfortable day is one of Europe's most pleasant -- flat, compact, walkable, full of things to discover."])
            return pick(["Decent conditions. A mid-layer and these cities are completely yours.", "Good day for exploring. These cities reward walking in conditions like these."])
        }
        if (temp < 0) {
            if (isVienna) return pick(["Sub-zero Vienna. The Christmas market season if you're lucky. The coffee houses become necessary rather than optional. Beautiful in the cold if you're dressed for it.", "Freezing in Vienna. Full winter gear -- but the city in snow is one of Europe's genuinely magical sights. Worth it."])
            if (isPrague) return pick(["Sub-zero Prague. The Charles Bridge in frost, the castle in snow, the Old Town Square in winter -- some cities are better cold and Prague is one of them. Full winter gear.", "Freezing Prague. Dress properly and the city rewards you -- there's a reason the Christmas markets here are among Europe's finest."])
            return pick(["Sub-zero today. Full winter gear -- but these cities handle cold beautifully.", "Freezing conditions. Dress for it properly."])
        }
        return pick(["Decent conditions. A mid-layer and these cities are excellent in any weather.", "Good day for the city. Comfortable enough to make the most of everything."])
    }

    // -- MIAMI --
    if (c.includes("miami") || c.includes("south beach") || c.includes("florida")) {
        if (isRaining) return pick(["Afternoon storm in Miami -- entirely typical and usually brief. The art deco buildings, the design district, the Wynwood walls all work in any weather. South Beach comes back fast when it clears.", "Miami rain. The tropical kind -- intense, dramatic, and usually over within an hour. Find a bar, wait it out, come back outside. The city rewards patience."])
        if (temp > 33) {
            if (isEvening) return pick(["Miami evening is the whole point. The heat drops, South Beach comes alive, the rooftop bars fill up, the energy shifts. This is what Miami is -- get outside and be part of it.", "Perfect Miami evening. The city transforms after the heat of the day. Ocean Drive, the Design District, Little Havana in the evening air -- the best version of Miami."])
            if (isMorning) return pick(["Miami morning is the best of the day -- the beach before the heat peaks, the art deco in the low light, a Cuban coffee at a ventanita. Use it before the sun gets serious.", "Early morning Miami is extraordinary -- the beach quiet, the light low on the water, the city not yet at full volume. This is the window. Use it."])
            return pick(["Hot Miami day. Beach in the morning before the UV peaks, shade through the middle of the day, South Beach again in the evening. That's the Miami rhythm -- it works.", "Serious Miami heat. The city was built around this -- the AC everywhere, the pools, the shade of the palm trees. Work with it rather than against it."])
        }
        if (temp > 24) return pick(["Good Miami conditions. Warm, clear, the art deco buildings looking right, the water inviting. Everything outdoor works today.", "Decent Miami day. The city at a comfortable temperature is genuinely enjoyable -- the beach, Wynwood, the Design District, the Everglades day trip. All of it."])
        return pick(["Pleasant Miami conditions. Comfortable for everything the city offers.", "Good day in Miami. Make the most of it."])
    }

    // -- LOS ANGELES --
    if (c.includes("los angeles") || c.includes("la, ca") || c.includes("hollywood") || c.includes("santa monica") || c.includes("malibu") || c.includes("venice beach") || c.includes("california")) {
        if (isRaining) return pick(["Rain in LA -- rarer than you'd think and the city doesn't handle it gracefully. The freeways get dangerous fast. Add serious extra time to any drive, use surface streets where possible.", "LA in the rain is a different city. The driving gets treacherous immediately -- locals lose all muscle memory for wet conditions. Add time, go slow, maybe stay local."])
        if (temp > 35) return pick(["Very hot LA day. The canyons and the Valley are intense -- the coast is significantly cooler. Santa Monica, Malibu, the Pacific Coast Highway. Head towards the water.", "Serious heat today. The inland areas are brutal -- Malibu and the coastal communities have the breeze that makes it manageable. The Griffith Observatory trail is not a midday activity today."])
        if (temp > 26) {
            if (isAfternoon) return pick(["Perfect LA afternoon. This is what the city promises and today it delivers -- warm, clear, the light golden. The Getty, the Griffith, a hike in Runyon, dinner in Silver Lake. All of it.", "Good LA afternoon conditions. The city is at its most effortlessly itself in weather like this. Venice Beach, the Santa Monica pier, the canyon roads -- pick your version of LA and enjoy it."])
            if (isEvening) return pick(["Beautiful LA evening. The hills turn golden at sunset and the city below looks like a movie set -- because it has been. Mulholland Drive for the view, then dinner somewhere that doesn't have a valet.", "Perfect evening in LA. The temperature drops just enough, the light is extraordinary, and the city has approximately 10,000 excellent places to spend the next few hours."])
            return pick(["Good LA conditions. The city is delivering on its reputation today. Beach, hills, food, culture -- take your pick, all of it works.", "Decent LA day. Not dramatic, just reliably excellent. That's why people move here and never leave."])
        }
        if (c.includes("san francisco") || c.includes("sf,") || c.includes("the city")) return pick(["San Francisco fog situation today -- check which neighbourhood you're in. The Sunset and Richmond can be completely fogged while the Mission and SOMA are sunny. The microclimate difference is genuinely extreme.", "SF weather is always a layering exercise. The fog burns off on the bay side but can persist on the ocean side all day. A jacket is never wrong in this city."])
        return pick(["Decent California conditions. The state in non-extreme weather is still California.", "Good day on the West Coast. Makes you understand why people come."])
    }
    const isGermany = c.includes("berlin") || c.includes("munich") || c.includes("hamburg") || c.includes("germany")
    const isScandinavia = c.includes("copenhagen") || c.includes("stockholm") || c.includes("oslo") || c.includes("helsinki") || c.includes("reykjavik")
    if (isGermany || isScandinavia) {
        if (isHeavyRain) return pick(["Heavy rain. A full waterproof, not just an umbrella. The infrastructure handles it but you need to be dressed for it.", "Properly wet today. Adjust outdoor plans and take the weather seriously."])
        if (isRaining) {
            if (isMorning) return pick(["Rain on the morning commute. An umbrella and a jacket -- everything will run on time regardless.", "Wet start. The infrastructure handles it. An umbrella and you're sorted."])
            return pick(["Rain today. A jacket and umbrella -- the northern European standard. Everything continues as planned.", "Wet conditions. Expected, accounted for, dealt with."])
        }
        if (temp < 0) {
            if (isGermany && c.includes("munich")) return pick(["Sub-zero Munich. The Oktoberfest tents would be useful right now. Layer properly -- Bavaria takes winter seriously.", "Freezing in Munich. Proper winter gear. The Christmas markets were made for days like this."])
            if (isScandinavia) return pick(["Proper Scandinavian cold today. The locals are unbothered -- they have the right gear. Make sure you do too.", "Freezing conditions. This is what winter means in the north. Layer properly and it's manageable."])
            return pick(["Freezing today. Proper winter -- every layer is justified.", `${temp} degrees -- the real thing. Dress for it properly.`])
        }
        if (temp < 8) {
            if (c.includes("berlin")) return pick([`Cold Berlin day at ${temp} degrees.${feelsNote} The city is still completely functional and worth being in -- just dress for it.`, "Cold conditions in Berlin. A proper coat today and the city is yours."])
            if (isScandinavia) return pick([`Cold by most standards but entirely normal here.${feelsNote} Layer properly and the city is excellent in this weather.`, "Cold but manageable with the right gear. Scandinavian cities are worth exploring in any weather."])
            return pick([`Cold day at ${temp} degrees.${feelsNote} The kind that reminds you what seasons mean.`, `${temp} degrees -- central European cold. Take it seriously.`])
        }
        if (temp > 28) {
            if (c.includes("berlin")) return pick(["Hot Berlin day -- the city doesn't do AC well but the lakes and parks make up for it. Wannsee, Tempelhof, Tiergarten -- all of them are worth it.", "Warm Berlin day. The city fills up the lakes and outdoor bars. This is summer in Berlin -- make the most of it."])
            return pick(["Hot by local standards. Europe doesn't always handle heat well -- find shade and the parks.", "Proper summer heat. Enjoy it while it lasts."])
        }
        if (temp > 18) {
            if (isAfternoon) return pick(["Beautiful afternoon. This is what summer in northern Europe is supposed to feel like -- the terraces will be full and rightly so.", "Good afternoon. Get outside -- days like this are counted here."])
            return pick(["Beautiful day. This is what summer in this part of Europe is supposed to feel like.", "Good one. Get outside -- days like this are counted and appreciated."])
        }
        if (temp >= 8 && temp <= 18) {
            if (c.includes("munich")) {
                if (isMorning) return pick([`Cold Munich morning at ${temp} degrees.${feelsNote} The Marienplatz and the English Garden are worth it if you're dressed for it. A proper coat today -- Bavaria doesn't do half-measures with spring cold.`, `${temp} degrees in Munich this morning.${feelsNote} The kind of Bavarian spring day that makes a coffee and a pretzel at the Viktualienmarkt feel exactly right.`])
                if (isAfternoon) return pick([`${temp} degrees in Munich this afternoon.${feelsNote} Cool but walkable -- the English Garden, the Isar river paths, the old town. A mid-layer and you're sorted.`, `Munich at ${temp} degrees -- decent enough for the outdoor beer gardens if you pick one with a windbreak. Layer up and it's genuinely pleasant.`])
                return pick([`${temp} degrees in Munich today.${feelsNote} A proper mid-layer and the city is completely yours -- the museums, the markets, the English Garden.`, `Munich spring at ${temp} degrees.${feelsNote} Layer up, get outside. The city is excellent in conditions like these.`])
            }
            if (c.includes("berlin")) {
                if (isMorning) return pick([`${temp} degree Berlin morning.${feelsNote} The kind of temperature that makes the city feel properly alive -- not summer-hot, not winter-brutal. A jacket and you're ready for whatever the day has.`, `Cold Berlin start at ${temp} degrees.${feelsNote} The Prenzlauer Berg cafes are exactly right for this weather. Layer up before you head out.`])
                if (isAfternoon) return pick([`${temp} degrees in Berlin this afternoon.${feelsNote} The Tiergarten, the East Side Gallery, the canal paths -- all of them work in conditions like this. A mid-layer and get outside.`, `Berlin at ${temp} degrees -- the city is completely functional and worth exploring. A jacket earns its place today.${feelsNote}`])
                return pick([`${temp} degrees in Berlin.${feelsNote} The city that invented making the most of imperfect weather. A layer, a coffee, and the streets are yours.`, `Berlin at ${temp} degrees -- decent, workable, worth it.${feelsNote} The kind of day the city does quietly well.`])
            }
            if (c.includes("copenhagen")) return pick([`${temp} degrees in Copenhagen.${feelsNote} The Danes have a word for making the most of exactly this kind of weather -- hygge. A proper layer, a canal-side walk, a warm drink. The city is very good at this.`, `Copenhagen at ${temp} degrees -- the kind of conditions the city was designed for. Layer up, get outside, and trust the Danish instinct for making grey days feel right.`])
            if (c.includes("stockholm")) return pick([`${temp} degrees in Stockholm.${feelsNote} The city between seasons -- not cold enough to stop you, not warm enough to pretend it's summer. A proper layer and Gamla Stan, the waterfront, the archipelago views are all worth it.`, `Stockholm at ${temp} degrees.${feelsNote} The kind of Scandinavian spring that locals have made an art form of enjoying. Dress properly and join them.`])
            if (c.includes("oslo")) return pick([`${temp} degrees in Oslo.${feelsNote} The fjord is extraordinary in conditions like this -- the light on the water, the city reflected. A proper layer and the outdoor Oslo is completely accessible.`, `Oslo at ${temp} degrees.${feelsNote} Norwegians don't cancel plans for this. Neither should you -- the city rewards the effort.`])
            if (isMorning) return pick([`${temp} degrees this morning.${feelsNote} A proper layer for the commute -- central European cold takes itself seriously. The city will be completely fine once you're dressed for it.`, `Cool start at ${temp} degrees.${feelsNote} A mid-layer and the morning is yours.`])
            if (isAfternoon) return pick([`${temp} degrees this afternoon.${feelsNote} Decent enough for outdoor plans with the right layer. The kind of weather these cities handle without complaint.`, `${temp} degrees -- not warm, not brutal. A jacket and the afternoon is workable.${feelsNote}`])
            return pick([`${temp} degrees today.${feelsNote} A mid-layer and these cities are excellent in any weather.`, `Decent conditions at ${temp} degrees.${feelsNote} Layer up and get on with it -- that's how it's done here.`])
        }
        if (isEvening) return pick([`${temp} degrees this evening. A mid-layer for the walk home.${feelsNote}`, "Decent evening. A light layer and you're set."])
        return pick(["Decent conditions. A mid-layer and you're set.", `${temp} degrees -- nothing extraordinary, nothing to complain about.${feelsNote}`])
    }

    // -- SOUTHEAST ASIA --
    const isSEAsia = c.includes("bangkok") || c.includes("phuket") || c.includes("koh samui") ||
        c.includes("bali") || c.includes("singapore") || c.includes("kuala lumpur") ||
        c.includes("jakarta") || c.includes("ho chi minh") || c.includes("hanoi") ||
        c.includes("chiang mai") || c.includes("koh") || c.includes("ubud") ||
        c.includes("saigon") || c.includes("vietnam") || c.includes("malaysia") || c.includes("indonesia") ||
        c.includes("cambodia") || c.includes("phnom penh") || c.includes("myanmar") || c.includes("yangon")
    if (isSEAsia) {
        const isBali = c.includes("bali") || c.includes("ubud")
        const isSingapore = c.includes("singapore")
        if (isHeavyRain) return pick(["Heavy tropical rain. Get to higher ground, find a good cafe or restaurant, and wait it out -- it usually passes within an hour.", "Serious tropical rainfall. Roads may flood briefly. Wait it out somewhere comfortable -- this kind of rain doesn't last."])
        if (isRaining) {
            if (isAfternoon) return pick(["Afternoon rain -- entirely expected this time of year. This is the rhythm: hot morning, rain in the afternoon, often clear evening. Work with it.", "The afternoon downpour has arrived. Find a cafe, order something cold, watch the city deal with it. It'll pass."])
            if (isBali) return pick(["Rain in Bali today. The rice terraces look extraordinary in the rain. A day for the temples with cover, a cooking class, a long lunch in Ubud.", "Wet Bali conditions. The island is still beautiful in the rain -- just differently beautiful."])
            return pick(["Tropical rain today. Intense but usually brief -- keep plans flexible and don't cancel everything.", "Wet conditions. An umbrella, flexible plans, and patience."])
        }
        if (temp > 35) {
            if (isMorning) return pick(["Already hot this morning -- get the outdoor things done now. Temples, markets, the beach -- all better before 10am. Water constantly.", "Get outdoor plans done this morning. The heat will be serious by 10am and the UV extreme."])
            if (isMidday) return pick(["Peak heat and humidity right now. The outdoor sights can wait for late afternoon. This is the time for AC, a long lunch, or an indoor temple.", "Midday heat here is something to respect -- the combination of temperature and humidity is genuinely draining. Find AC and come back outside after 4pm."])
            if (isEvening) return pick(["The evening is where the city comes alive after a hot day. The heat has dropped, everything moves outside. Get out.", "Perfect tropical evening after the heat of the day. The cities and resorts here transform after sunset."])
            return pick([`${temp} degrees and humid. Early morning and after 5pm are your outdoor windows. The middle of the day belongs to the indoors.`, "Intense heat and humidity. Short outdoor bursts, massive amounts of water, shade whenever possible."])
        }
        if (temp > 28) {
            if (isSingapore) return pick(["Good Singapore conditions -- warm and manageable. The city-state is built for weather like this. Gardens by the Bay, the Marina, Chinatown -- all of it works.", "Decent Singapore day. Warm but not oppressive -- the kind of conditions where the outdoor hawker centres make perfect sense."])
            if (isBali) return pick(["Good Bali conditions. This is the island at its most enjoyable -- warm, manageable, the rice terraces looking right. Temple visits, the beach, the morning market.", "Decent Bali day. Not the extreme heat -- this is the island at a comfortable temperature. Make the most of it."])
            return pick(["Good conditions -- warm but manageable. This is the city at a comfortable temperature for exploring.", "Decent conditions. Warm but not oppressive -- get outside and enjoy it."])
        }
        return pick(["Manageable conditions. Good window for outdoor plans.", "Not bad by local standards. Make the most of the cooler part of the day."])
    }

    // -- EAST ASIA --
    const isEastAsia = c.includes("tokyo") || c.includes("osaka") || c.includes("kyoto") ||
        c.includes("seoul") || c.includes("hong kong") || c.includes("taipei") ||
        c.includes("beijing") || c.includes("shanghai") || c.includes("korea") || c.includes("japan")
    if (isEastAsia) {
        const isTokyo = c.includes("tokyo") || c.includes("osaka") || c.includes("kyoto")
        const isHongKong = c.includes("hong kong")
        if (isRaining) {
            if (isTokyo) {
                if (isMorning) return pick(["Rain on the morning commute -- an umbrella is completely expected and everything will run perfectly regardless. Convenience store umbrellas are everywhere if you forgot yours.", "Wet Tokyo morning. The commute will be smooth despite the rain -- this city is engineered for it."])
                return pick(["Rain today. Tokyo is perhaps the world's best city at functioning in rain -- an umbrella and everything continues exactly as planned.", "Wet conditions. The covered shotengai shopping streets, the indoor markets, the shrines with covered approaches -- all become more appealing."])
            }
            if (isHongKong) return pick(["Rainy Hong Kong -- the covered walkways connecting the whole city were built for days like this. The wet market, the malls, the harbour views from inside.", "Wet conditions in Hong Kong. The city has elevated walkways covering most of the centre. You barely need to go outside."])
            return pick(["Rain today. An umbrella is the expected standard here -- carry one.", "Wet conditions. Adjust outdoor plans accordingly."])
        }
        if (temp > 33) {
            if (isTokyo) return pick(["Very hot and humid Tokyo. The combination of heat, humidity and urban density makes it draining -- short outdoor bursts and AC wherever possible.", "Peak summer heat. The city manages it with AC everywhere but the transitions between inside and outside are shocking."])
            if (isHongKong) return pick(["Serious heat in Hong Kong. The city generates its own heat -- the harbour breeze helps on the waterfront but the streets are intense.", "Very hot and humid. Hong Kong in summer is intense. The Peak might have a breeze. The Star Ferry is always worth taking."])
            return pick(["Very hot and humid. Early morning or evening for outdoor plans.", "Peak heat. AC and water are your best friends today."])
        }
        if (temp < 8) {
            if (isTokyo) return pick([`Cold Tokyo day.${feelsNote} Dress properly. The city is still extraordinary in cold weather -- the shrines, the covered markets, the ramen shops all work better.`, "Cold but worth it. Tokyo in winter has its own beauty."])
            return pick([`Cold today.${feelsNote} Dress properly.`, "Properly cold. Layer up and the outdoor moments will be worth it."])
        }
        if (temp > 20) {
            if (isTokyo) {
                if (isMorning) return pick(["Good Tokyo morning. The shrines and parks are best early before they fill up -- Senso-ji before 8am, Yoyogi Park, the river paths.", "Beautiful Tokyo morning. The kind of conditions that make walking between neighbourhoods feel easy and worthwhile."])
                return pick(["Good conditions in Tokyo. The city is completely walkable today -- the neighbourhoods, the parks, the quiet side streets that reveal themselves.", "Comfortable day. The kind of conditions where the city reveals itself properly."])
            }
            return pick(["Good conditions. The city is at its best today -- comfortable, walkable, worth exploring.", "Decent day. Make the most of it."])
        }
        return pick(["Decent conditions. The city functions perfectly regardless.", `${temp} degrees. Layer appropriately and the day is yours.${feelsNote}`])
    }

    // -- AUSTRALIA --
    const isAustralia = c.includes("sydney") || c.includes("melbourne") || c.includes("brisbane") || c.includes("perth") || c.includes("gold coast") || c.includes("cairns") || c.includes("australia")
    if (isAustralia) {
        const isMelbourne = c.includes("melbourne")
        const isSydney = c.includes("sydney")
        if (isHeavyRain) {
            if (isMelbourne) return pick(["Heavy rain in Melbourne -- but you know how this goes. It'll probably be fine by afternoon. That's Melbourne.", "Serious Melbourne rain. Four seasons in one day and all of them wet today."])
            return pick(["Heavy rain today. Flash flooding possible in low-lying areas -- take it seriously.", "Serious rainfall. Adjust plans accordingly."])
        }
        if (isRaining) {
            if (isMelbourne) return pick(["Melbourne rain -- you'll need an umbrella and honestly a light jacket too. But check again in an hour, it might clear.", "Wet Melbourne. You know the saying. Take an umbrella and stay flexible."])
            return pick(["Rain today. Take a waterproof.", "Wet conditions. A jacket is the sensible call."])
        }
        if (temp > 38) {
            if (isSydney) return pick(["Dangerous Sydney heat today. Fire risk conditions across the region. Stay informed, stay inside during peak hours, and check alerts.", "Extreme heat. This is the serious kind -- limit outdoor time strictly."])
            return pick(["Dangerous heat today. Fire risk conditions. Stay informed and inside during peak hours.", "Extreme heat. Limit outdoor exposure strictly."])
        }
        if (temp > 30) {
            if (isSydney) return pick(["Hot Sydney day. The harbour beaches and Manly will be packed -- get there early. Sunscreen is critical; the UV here is extreme.", "Warm Sydney day. Bondi and Manly will be full by 10am. Sunscreen first, then enjoy it -- the UV here is serious."])
            if (isMelbourne) return pick(["Hot Melbourne day. The beach suburbs will be the right call today. St Kilda, Brighton -- or the river gardens if you're staying central.", "Warm one in Melbourne. Beach days in Melbourne are the good ones -- make the most of it."])
            return pick(["Very hot. Sunscreen, hat, water -- all mandatory.", "Hot Australian day. Beach or shade -- those are your options and both are good."])
        }
        if (temp > 22) {
            if (isSydney) return pick(["Beautiful Sydney day. The harbour is extraordinary in conditions like this. Manly Ferry, a coastal walk, the Rocks -- all of it works perfectly.", "Cracking Sydney day. The kind that makes you understand exactly why people live here. Get outside."])
            if (isMelbourne) return pick(["Good Melbourne day. This is the city at its best -- comfortable enough to walk everywhere, light enough for the laneways to look right.", "Decent Melbourne conditions. Coffee, laneways, the river -- all of it better today."])
            return pick(["Beautiful day. This is what it's supposed to feel like.", "Cracking day. Get outside."])
        }
        if (isMelbourne && temp < 12) return pick(["Cold Melbourne day. Locals will be in winter coats -- and rightly so. A proper layer today.", "Melbourne cold is real even if the latitude suggests otherwise. Dress for it."])
        return pick(["Good conditions. Worth being outside.", `Decent day at ${temp} degrees.${feelsNote}`])
    }

    // -- GENERIC FALLBACK (quality, not robotic) --
    if (isStorm) return pick(["Severe weather today. Check local alerts and stay informed before heading out.", "Storm conditions. Anything that can be rescheduled, reschedule. The kind of day you're glad to be inside.", "Seriously rough out there. Check local alerts and travel updates before making any journey.", "Storm weather. If you don't have to go out, don't. If you do, be prepared for disruptions and dress for the conditions.", "Severe conditions today. Stay informed and stay safe -- this is the kind of weather that changes plans."])
    if (isHeavyRain) {
        if (isMorning) return pick([`Heavy rain this morning. Leave earlier than you think -- roads and transport will be slower than usual. A full waterproof is more useful than an umbrella today.`, `Heavy rain on the morning commute. Give yourself extra time and dress for it properly -- a full waterproof, not just an umbrella.`, `Seriously raining this morning. Travel will take longer than usual. Leave early and take a proper waterproof jacket.`, `Heavy rain and the morning rush -- not a good combination. Leave early, take a full waterproof, and give yourself the time.`, `The rain this morning is the serious kind. Build extra time into the commute and dress accordingly.`])
        if (isEvening) return pick([`Heavy rain for the journey home. Build extra time in and dress properly -- this isn't the light stuff.`, `Wet evening commute. A waterproof jacket is the move -- the wind will make an umbrella pointless.`, `Heavy rain this evening. Leave earlier than you think and take a proper waterproof.`, `Seriously wet out there for the journey home. Give yourself extra time and dress for it.`, `The evening rain is heavy. A full waterproof, extra time for the journey, and patience with the traffic.`])
        return pick([`Heavy rain today. Worth planning around where you can. Travel will take longer and outdoor plans need adjusting.`, `Seriously wet today. A proper waterproof is the honest answer -- umbrella alone won't cut it.`, `Heavy rain. The kind that adjusts plans rather than just inconveniencing them. A full waterproof and extra time for any journey.`, `Properly wet out there. If it can be done indoors, do it indoors. If not, a full waterproof and accept it.`, `Heavy rain today -- dress for it properly and build extra time into any journey.`])
    }
    if (isRaining) {
        if (clearingLabel) return pick([`Rain right now, clearing around ${clearingLabel}. A waterproof while it lasts.${feelsNote}`, `Wet at the moment but it should lift around ${clearingLabel}. A waterproof for now.${feelsNote}`, `Raining but the forecast says it clears around ${clearingLabel}. Stick with a waterproof until then.${feelsNote}`, `The rain is here for now. Should ease around ${clearingLabel} -- plan around that if you can.${feelsNote}`, `Wet right now, improving around ${clearingLabel}. A light waterproof covers the gap.${feelsNote}`])
        if (isMorning) return pick([`Rain this morning. Umbrella essential and a waterproof layer helps if you're walking any distance. Give yourself extra time.`, `Wet start. An umbrella and a waterproof layer -- one or the other won't quite cover it this morning.`, `Raining this morning. Dress for it before you leave and the day is fine from there.`, `Rain on the morning commute. Take an umbrella and a waterproof layer. Everything else is straightforward.`, `Wet morning -- a waterproof and an umbrella and you're sorted. Leave slightly earlier.`])
        if (isEvening) return pick([`Rain this evening. Take an umbrella for the journey and a layer -- it will feel cooler once you're out.`, `Wet evening. An umbrella and a jacket -- the wind may make the umbrella less useful, so lean on the jacket.`, `Raining this evening. A waterproof for the journey home and the day ends on your terms.`, `Wet for the evening commute. A layer and an umbrella and you're covered.`, `Rain this evening. The sensible call is a waterproof jacket. Take it.`])
        return pick([`Rain today. Take an umbrella and a waterproof layer. Everything else continues as planned -- just wetter.`, `Wet conditions. An umbrella, a waterproof layer, and the day is entirely workable.`, `It's raining. Dress for it and get on with things -- that's the only strategy that works.`, `Wet one today. A waterproof layer, an umbrella, and the rain stops being something that happens to you.`, `Rain today. Worth dressing properly rather than hoping it eases -- a waterproof layer and you'll not think about it again.`])
    }
    if (isDrizzle) {
        if (clearingLabel) return pick([`Light rain right now but clearing around ${clearingLabel}. A light waterproof for now.${feelsNote}`, `Drizzling but it should lift around ${clearingLabel}. A hood or light jacket covers it.${feelsNote}`, `Light rain at the moment -- clears around ${clearingLabel}. Not a problem with a light layer.${feelsNote}`, `Drizzle for now, improving around ${clearingLabel}. A light waterproof is all you need.${feelsNote}`, `Wet out there but it eases around ${clearingLabel}. A light jacket until then.${feelsNote}`])
        return pick([`Light rain today -- enough to be annoying without a waterproof. A light jacket covers it.${feelsNote}`, `Drizzle today. Worse than it sounds if you're not dressed for it. A hood or light waterproof is the answer.${feelsNote}`, `Light rain. Not the dramatic kind -- the kind that gets you damp without you noticing. A light waterproof is the honest call.${feelsNote}`, `Drizzly out there. A light waterproof and you won't even notice it. Without one, you'll feel it within ten minutes.${feelsNote}`, `Light rain -- the sneaky kind. A hood or light jacket and the day is completely fine.${feelsNote}`])
    }
    // Variability: currently clear/cloudy but coded rain arriving later
    if (!isRaining && !isDrizzle && upcomingRainLabel && (isClearNow || isCloudyOnlyNow)) {
        if (isMorning) return pick([`Good morning right now but rain arrives around ${upcomingRainLabel}. Get outside while you can -- it won't stay dry.${feelsNote}`, `Clear this morning but rain is due around ${upcomingRainLabel}. Use the morning while it lasts.${feelsNote}`, `Decent start but rain is coming -- around ${upcomingRainLabel}. Get any outdoor plans done now.${feelsNote}`, `Good conditions this morning. Rain arrives around ${upcomingRainLabel} so use the clear window properly.${feelsNote}`, `Morning is your outdoor window. Rain moves in around ${upcomingRainLabel} -- plan around it.${feelsNote}`])
        return pick([`Conditions look fine right now but rain is due around ${upcomingRainLabel}. Keep something waterproof to hand.${feelsNote}`, `Fine at the moment but rain arrives around ${upcomingRainLabel}. A waterproof nearby is the right call.${feelsNote}`, `Dry for now. Rain moves in around ${upcomingRainLabel} -- worth knowing before you head out.${feelsNote}`, `The weather looks fine but it changes around ${upcomingRainLabel}. Keep a waterproof close.${feelsNote}`, `Clear right now but don't get comfortable -- rain arrives around ${upcomingRainLabel}. A jacket in the bag covers it.${feelsNote}`])
    }
    if (!isRaining && hasMixedDay) return pick([`Changeable today -- sunny spells with showers. Keep a waterproof close and check the hourly for the best windows.${feelsNote}`, `Mixed conditions today. Sunny at times, showers at others. A lightweight waterproof and you can deal with whatever turns up.${feelsNote}`, `On-and-off today -- sunshine and showers sharing the day. Dress for the showers and you'll enjoy the sunny bits.${feelsNote}`, `Changeable forecast. A waterproof that folds small is the entire strategy today.${feelsNote}`, `Sun and showers through the day. The hourly strip will show you exactly when. A light waterproof in the bag.${feelsNote}`])
    if (temp > 38) return pick([`Extreme heat today at ${temp} degrees. This is a health risk -- limit outdoor exposure, drink more water than you think you need, and keep outdoor time to early morning or after sunset.`, `${temp} degrees -- dangerous heat. Stay inside during the middle of the day. Water constantly, early morning or late evening for outdoor time only.`, `Extreme conditions today. The heat at ${temp} degrees is a genuine health risk for anyone outdoors for extended periods. Stay inside.`, `Very hot today -- ${temp} degrees. This is the kind of heat that requires real caution. Limit outdoor time and hydrate properly.`, `${temp} degrees. Serious heat -- treat it accordingly. AC, water, early morning or post-sunset for anything outdoor.`])
    if (temp > 32) {
        if (isMorning) return pick([`Already hot this morning at ${temp} degrees. Get outdoor plans done before 10am -- the heat will be serious by midday. Today is a light-fabric, sunscreen, water-bottle kind of day.`, `Hot early -- ${temp} degrees already. Use the morning window and get things done outside before 10am. It gets significantly hotter from here.`, `${temp} degrees this morning and climbing. Morning is your outdoor window. Use it before midday makes outdoor plans difficult.`, `Warm morning and it's only going to get hotter. Get any outdoor plans done before 10am -- after that it's serious heat.`, `The morning is the comfortable part today. ${temp} degrees and the heat will build. Get outside now or wait until evening.`])
        if (isEvening) return pick([`The evening is more comfortable than the day was -- ${temp} degrees and dropping. The best outdoor window of the day right now.`, `The heat has dropped enough for the evening to work. The best conditions of the day are right now -- get outside.`, `Evening is the reward for getting through a hot day. ${temp} degrees and cooling. Everything outdoor works now.`, `The outdoor window is here. ${temp} degrees this evening and conditions are genuinely pleasant after the heat of the day.`, `Good evening conditions -- ${temp} degrees, dropping. The city comes back to life after dark. Get outside.`])
        return pick([`Very hot today -- ${temp} degrees. Early morning and evening are the outdoor windows. Midday is for shade, AC, and cold drinks.`, `Hot conditions. ${temp} degrees and the middle of the day is not the time to be outside. Morning or evening for anything outdoor.`, `${temp} degrees -- properly hot. Morning for outdoor plans, shade for midday, evening for everything else.`, `Hot today. The strategy is simple: morning before 10am, shade through the middle of the day, outdoors again after 6pm.`, `Serious heat today at ${temp} degrees. Plan outdoor things for early morning or evening. Everything in between is for staying cool.`])
    }
    if (temp > 24) {
        if (isMorning) return pick([`Good morning at ${temp} degrees -- mild, clear, worth being outside for. The kind of start that makes the commute feel less like a commute.${feelsNote}`, `${temp} degrees this morning -- a genuinely decent start. The kind of morning where the walk or the commute feels like time well spent.${feelsNote}`, `Good conditions this morning. ${temp} degrees, clear, worth being outside for as long as you can.${feelsNote}`, `Warm morning at ${temp} degrees. The kind of start that makes you feel like the day is already ahead.${feelsNote}`, `${temp} degrees and pleasant this morning. A good start -- the kind that makes outdoor commutes feel like a choice rather than a chore.${feelsNote}`])
        if (isAfternoon) return pick([`Good afternoon at ${temp} degrees. If you've been inside all day, this is the moment to step out. Take the longer route. It's worth it.${feelsNote}`, `${temp} degrees this afternoon -- decent conditions. If you can get outside for even 20 minutes, it's worth it.${feelsNote}`, `The afternoon is good today. ${temp} degrees, clear enough. The kind of conditions where getting outside mid-afternoon is actually a good idea.${feelsNote}`, `Good afternoon conditions at ${temp} degrees. Worth stepping outside if you've been in all day.${feelsNote}`, `${temp} degrees this afternoon -- solid conditions. A walk, an errand, any excuse to step outside is worth taking.${feelsNote}`])
        if (isEvening) return pick([`Pleasant evening at ${temp} degrees. Good conditions for being outside -- dinner outside, a walk, whatever the evening calls for.${feelsNote}`, `${temp} degrees this evening -- comfortable and clear. Good conditions for outdoor dining, a walk, or just being outside.${feelsNote}`, `Good evening conditions. ${temp} degrees and pleasant -- the evening is worth being outside for.${feelsNote}`, `Nice evening at ${temp} degrees. Whatever gets you outside tonight is worth doing.${feelsNote}`, `${temp} degrees this evening. Conditions are right for being outdoors -- make use of it.${feelsNote}`])
        return pick([`Good conditions today at ${temp} degrees. Worth getting outside when you can -- days like this are the ones people remember.${feelsNote}`, `${temp} degrees and pleasant. The kind of day where the only regret is not spending enough of it outside.${feelsNote}`, `Good conditions. ${temp} degrees, clear, worth being outside for. No further justification needed.${feelsNote}`, `Decent day at ${temp} degrees. The kind of conditions that make the walk feel like an upgrade.${feelsNote}`, `${temp} degrees -- good. The kind of day that asks nothing of you except to get outside when you can.${feelsNote}`])
    }
    if (temp < 0) return pick([`Freezing today at ${temp} degrees.${feelsNote} Dress properly -- gloves, hat, the full kit. The cold at this temperature means business.`, `${temp} degrees -- properly freezing.${feelsNote} Every layer is justified today. Gloves, hat, the works.`, `Sub-zero today.${feelsNote} Treat it seriously -- exposed skin will feel it fast. Full winter kit.`, `Freezing conditions at ${temp} degrees.${feelsNote} Don't underestimate this cold -- a proper coat, hat, gloves, scarf.`, `${temp} degrees and the cold means it.${feelsNote} Full winter gear today. No cutting corners.`])
    if (temp < 8) {
        if (isMorning) return pick([`Cold morning at ${temp} degrees.${feelsNote} A proper coat for the commute -- not just a jacket. The kind of cold that makes you glad you checked before leaving.`, `${temp} degrees this morning -- properly cold.${feelsNote} A coat and layers before you go out. The cold earns it today.`, `Cold start at ${temp} degrees.${feelsNote} Dress for the commute properly -- a jacket alone won't cut it.`, `${temp} degrees on the way out.${feelsNote} A proper coat, not just a layer. The cold is doing its thing this morning.`, `Cold morning -- ${temp} degrees.${feelsNote} The kind of start that makes the commute feel like it counts. Dress for it properly.`])
        return pick([`Cold conditions today -- ${temp} degrees.${feelsNote} Layer properly and you'll be fine. Don't underestimate it.`, `${temp} degrees -- the real cold.${feelsNote} Proper layers and the day is manageable. Skip them and you'll notice.`, `Cold today at ${temp} degrees.${feelsNote} A coat that does the job. Not a light jacket day.`, `${temp} degrees and properly cold.${feelsNote} Dress for it before you leave and the day is fine.`, `Cold conditions. ${temp} degrees.${feelsNote} Every layer earns its place today.`])
    }
    if (temp >= 14 && temp <= 18) {
        if (isMorning) return pick([`${temp} degrees this morning -- that transitional weather where you're genuinely unsure what to wear. A mid-layer that you can tie around your waist later is the answer.${feelsNote}`, `${temp} degrees -- the awkward middle temperature. A mid-layer is the answer: enough for the commute, not too much for later.${feelsNote}`, `${temp} degrees this morning. The jacket question has an answer today: take it, you'll want it.${feelsNote}`, `Mild morning at ${temp} degrees -- a mid-layer and you're sorted. The kind of weather that asks nothing complicated.${feelsNote}`, `${temp} degrees this morning. A jacket or mid-layer covers it -- not too heavy, just enough.${feelsNote}`])
        if (isAfternoon) return pick([`${temp} degrees this afternoon -- mild and manageable. That jacket you've been waiting to wear? Today works.${feelsNote}`, `${temp} degrees this afternoon. Mild, comfortable, a light layer if you have one.${feelsNote}`, `Mild afternoon at ${temp} degrees. Decent conditions -- a mid-layer and the day is entirely fine.${feelsNote}`, `${temp} degrees this afternoon. Not warm, not cold -- the comfortable in-between. A light jacket is the call.${feelsNote}`, `Decent afternoon at ${temp} degrees. A mid-layer covers it.${feelsNote}`])
        return pick([`Cool conditions today at ${temp} degrees.${feelsNote} A jacket is the right call -- the kind of day where being slightly overdressed is always better than the alternative.`, `${temp} degrees -- mild and manageable. A mid-layer and the day is completely straightforward.${feelsNote}`, `Decent conditions at ${temp} degrees.${feelsNote} Not cold, not warm -- a light jacket is the answer and the day is yours.`, `${temp} degrees today. A jacket covers it and the rest of the day is weather-neutral.${feelsNote}`, `Mild at ${temp} degrees.${feelsNote} The kind of conditions where a mid-layer is the entire decision. Everything else is straightforward.`])
    }
    return pick([`Decent conditions at ${temp} degrees.${feelsNote} A mid-layer and you're set for whatever the day holds.`, `${temp} degrees -- perfectly workable. A layer and the day is yours.${feelsNote}`, `Reasonable conditions today at ${temp} degrees.${feelsNote} Nothing to plan around. Just dress appropriately and get on with it.`, `${temp} degrees and fine.${feelsNote} The weather today is not the story. A layer and move on.`, `Decent day at ${temp} degrees.${feelsNote} Nothing dramatic, nothing to worry about. A mid-layer and everything else is up to you.`])
}

// -- OUTFIT FUNCTION -----------------------------------------------
// Returns a specific, culturally-calibrated outfit recommendation
// based on city, temperature, feels-like, conditions, humidity, UV, and time of day

function getOutfit(city: string, temp: number, apparent: number, rain: number, code: number, humidity: number, uvIndex: number, cityHour: number): string {
    const c = city.toLowerCase()
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const isMorning = cityHour >= 5 && cityHour < 11
    const isMidday = cityHour >= 11 && cityHour < 15
    const isAfternoon = cityHour >= 15 && cityHour < 20
    const isEvening = cityHour >= 20 || cityHour < 5
    const feelsLike = apparent ?? temp
    const isRaining = code >= 61
    const isHeavyRain = code >= 80 || (isRaining && rain > 75)
    const isStorm = code >= 95
    const isDrizzle = code >= 51 && code < 61
    const rainLikely = rain >= 60
    const rainPossible = rain >= 35 && rain < 60
    const isHumid = humidity >= 75
    const uvHigh = uvIndex >= 6
    const uvExtreme = uvIndex >= 9

    // ── STORM / HEAVY RAIN (universal) ──────────────────────────
    if (isStorm) return pick([
        "Avoid being outside if you can. If you must go out: full waterproof, not an umbrella. Umbrellas lose in storms.",
        "Storm conditions. A proper waterproof jacket — top and ideally bottom. Bag in a dry liner. Avoid tall trees and open spaces.",
        "Full waterproof, closed-toe shoes, nothing loose. If this isn't essential, rearrange it."
    ])

    // ── GULF CITIES ─────────────────────────────────────────────
    const isGulf = c.includes("dubai") || c.includes("abu dhabi") || c.includes("riyadh") ||
        c.includes("doha") || c.includes("kuwait") || c.includes("muscat") ||
        c.includes("jeddah") || c.includes("sharjah") || c.includes("united arab emirates")
    if (isGulf) {
        if (isRaining) return pick([
            "Light waterproof layer — Gulf roads aren't built for rain and neither are most shoes here. More useful than an umbrella in wind.",
            "Rain jacket. Sounds odd in this city but the roads will be chaos and you'll want to stay dry. Closed shoes are essential — puddles will find you.",
            "Loose linen trousers and a long-sleeved linen shirt. Full coverage protects better than exposed skin in this UV.",
            "Light coloured everything — dark colours absorb heat. This is not the day for black.",
            "Nothing tight, nothing dark, nothing synthetic. Loose, light, natural fabrics only."
        ])
        if (feelsLike >= 42) return pick([
            "Loose, long-sleeved light fabrics — counterintuitively, covering up protects from the sun better than bare skin here. SPF on any exposed areas. Sunglasses. Hat non-negotiable. Carry water from the moment you leave.",
            "Light, full-coverage clothing. The sun will burn you faster than you expect. SPF everywhere, proper sunglasses, a hat with a brim. Nothing tight, nothing dark.",
            "Light linen or cotton, full coverage, hat, SPF, sunglasses. This isn't about fashion today — it's about not overheating within ten minutes of stepping outside."
        ])
        if (feelsLike >= 36) {
            if (isMorning) return pick([
                "Light fabrics, breathable layers. The morning is manageable but UV is already climbing — SPF and sunglasses from the start.",
                "Loose, light clothing. Get outdoor plans done before 9am — after that the heat becomes serious fast. SPF and a hat if you're in the sun."
            ])
            if (isEvening) return pick([
                "The evening is genuinely pleasant by local standards. A light summer dress or shirt, open shoes, no jacket needed. The city is yours right now.",
                "Light summer clothes — the evening after this heat is the reward. Open shoes, airy fabrics, enjoy being outside."
            ])
            return pick([
                "Light, breathable fabrics only. Nothing fitted, nothing synthetic. SPF on exposed skin and proper sunglasses — UV is high.",
                "Loose cotton or linen. The heat is serious midday — if you're outside for more than 10 minutes, a hat and SPF are not optional."
            ])
        }
        if (temp < 18) return pick([
            "A light jacket — locals will be in puffer coats but 18 degrees is genuinely cool by Gulf standards. A mid-layer is the right call.",
            "Light jacket territory. The wind can make it feel sharper than the number. This is winter here and it's actually lovely — dress comfortably and enjoy it."
        ])
        if (uvHigh && !isEvening) return pick([
            "Light summer clothes but don't skip the SPF — UV is high even when it doesn't feel hot. Sunglasses are important too.",
            "Airy summer clothes. SPF is non-negotiable today — UV will burn you faster than the temperature suggests."
        ])
        return pick([
            "Light, comfortable summer clothes. This is the weather the Gulf is famous for — enjoy being outside in it.",
            "Summer clothes, open shoes, sunglasses. Genuinely good conditions — make the most of it."
        ])
    }

    // ── WEST AFRICA ─────────────────────────────────────────────
    const isWestAfrica = c.includes("lagos") || c.includes("abuja") || c.includes("accra") ||
        c.includes("kumasi") || c.includes("dakar") || c.includes("abidjan") ||
        c.includes("lome") || c.includes("cotonou") || c.includes("nigeria") || c.includes("ghana")
    if (isWestAfrica) {
        const isLagos = c.includes("lagos")
        const isHarmattan = temp < 28 && humidity < 40
        if (isHeavyRain) return pick([
            "Full waterproof is the only option in this kind of rain — an umbrella will be useless in the wind and the volume. Waterproof shoes or be prepared to get wet.",
            "Serious rain means serious preparation. A waterproof jacket that actually keeps water out, closed shoes you don't mind getting wet, and a bag with a dry liner for anything important."
        ])
        if (isRaining) return pick([
            "Umbrella plus a light waterproof layer. The rain here isn't UK drizzle — when it comes, it comes hard. Cover up properly.",
            "A good umbrella and a waterproof top. If you're walking any distance, waterproof shoes will thank you later.",
            "Breathable cotton or linen — synthetics will be uncomfortable within minutes in this humidity.",
            "Nothing tight, nothing dark, nothing synthetic. Loose, light, natural fabrics only."
        ])
        if (isHarmattan) {
            if (isLagos) return pick([
                "The harmattan is doing its thing today. Light layers — it's cooler than usual but the dust is the bigger issue. A scarf or light covering for your nose and mouth if you're outside for any length of time. Eyes will feel it too — stay hydrated.",
                "Light jacket and something to cover your face if you're outside long — the harmattan dust is the real weather story today. Throat, eyes, and skin will all feel drier than usual. Lip balm and eye drops are not overcautious."
            ])
            return pick([
                "Harmattan weather — cooler and dusty. Light layers, a cover for your face if the dust is heavy, and moisturiser. The dry air will find your skin.",
                "Light jacket for the cool, something for the dust if it's heavy. Harmattan is its own weather — prepare for dry air on your skin, throat, and eyes."
            ])
        }
        if (feelsLike >= 34) {
            if (isMorning) return pick([
                "Light, breathable fabrics — cotton if you have it. The heat will build quickly, so start light and stay light all day.",
                "Loose, airy clothes. Get outdoor plans done in the next hour — after that the heat will be serious."
            ])
            if (isMidday) return pick([
                "Light, loose clothing and get into shade wherever you can. If you're outside for any stretch at this heat and humidity, hydrate constantly.",
                "As light as possible. The combination of heat and humidity is intense right now — loose fabrics, shade, water."
            ])
            return pick([
                "Light fabrics throughout — cotton, linen, anything breathable. The humidity makes the heat heavier than the number says.",
                "Loose, light clothes. Humidity is making this feel hotter than it reads — dress accordingly."
            ])
        }
        return pick([
            "Light summer clothes. Good conditions for being outside — comfortable and manageable.",
            "Airy clothes and comfortable shoes. One of those good days here — make the most of it."
        ])
    }

    // ── EAST AFRICA ─────────────────────────────────────────────
    const isEastAfrica = c.includes("nairobi") || c.includes("kampala") || c.includes("dar es salaam") ||
        c.includes("addis") || c.includes("mombasa") || c.includes("kenya") || c.includes("tanzania")
    if (isEastAfrica) {
        const isNairobi = c.includes("nairobi")
        if (isHeavyRain) return pick([
            "Full waterproof — Nairobi rain means it. A proper jacket and waterproof shoes if you're walking.",
            "Waterproof jacket and closed shoes. East African rain doesn't ease in — when it arrives, it's serious."
        ])
        if (isRaining) return pick([
            "A good umbrella plus a light waterproof layer. The rain can be heavy and fast here.",
            "Umbrella and a waterproof layer. Cover up properly — the rain here means it."
        ])
        if (isNairobi && temp < 16) return pick([
            "A proper layer — Nairobi altitude means cold bites differently here. A jacket that actually insulates, not just a light layer.",
            "Real jacket weather at this altitude. The sun may be out but the wind is cool — dress warmer than it looks from the window."
        ])
        if (isNairobi && uvExtreme && !isEvening) return pick([
            "UV is extreme at this altitude — SPF is not optional today, even in mild temperatures. Sunglasses and a hat if you're outside long.",
            "The altitude makes UV much stronger than you'd expect. SPF on all exposed skin, proper sunglasses. Don't get caught out by how mild the temperature feels."
        ])
        return pick([
            "Light layers with something to add if the evening cools off — altitude mornings and evenings can catch you out.",
            "Light, comfortable clothes. A layer in the bag for later — the temperature swings here more than you'd expect."
        ])
    }

    // ── UK CITIES ────────────────────────────────────────────────
    const isUK = c.includes("london") || c.includes("manchester") || c.includes("birmingham") ||
        c.includes("bristol") || c.includes("leeds") || c.includes("edinburgh") ||
        c.includes("glasgow") || c.includes("liverpool") || c.includes("newcastle") ||
        c.includes("sheffield") || c.includes("cardiff") || c.includes("brighton") ||
        c.includes("nottingham") || c.includes("oxford") || c.includes("cambridge") ||
        c.includes("greater london") || c.includes("united kingdom")
    if (isUK) {
        const isEdinburgh = c.includes("edinburgh") || c.includes("glasgow")
        const isBrighton = c.includes("brighton")
        const isLondon = c.includes("london") || c.includes("greater london")
        if (isHeavyRain) return pick([
            "A proper waterproof jacket — not just an umbrella. UK wind will destroy an umbrella and leave you soaked. Waterproof shoes if you're walking any distance.",
            "Full waterproof top. Umbrella is secondary — a hood is more reliable in this wind. If you're on foot for more than five minutes, waterproof shoes are the smart call.",
            "A proper mac or waxed jacket today — not a fashion waterproof. Something that actually keeps water out for more than ten minutes.",
            "Waterproof boots if you have them. Today is the day you'll wish you wore them.",
            "A full waterproof system: jacket with a hood, waterproof trousers if you're outside for any stretch. This isn't drizzle."
        ])
        if (isRaining) {
            if (isEdinburgh) return pick([
                "Edinburgh wind makes umbrellas essentially decorative. A waterproof jacket with a hood is the only real option — functional and actually keeps you dry.",
                "Waterproof jacket, hood up. The wind off the Forth will turn any umbrella inside out. Closed, water-resistant shoes too."
            ])
            return pick([
                "Umbrella plus a waterproof layer. UK rain is manageable if you're dressed for it — the trick is the combination. One without the other usually means you're still getting damp somewhere.",
                "Light waterproof jacket and umbrella. The rain is the priority today — dress around it and the rest of the day is fine.",
                "A trench coat works if it's treated. Otherwise a proper waterproof layer over whatever you're wearing.",
                "Ankle boots with a waterproof upper today. Your trainers will regret it.",
                "A packable waterproof in the bag — the kind that stuffs into its own pocket. Takes up nothing, saves your day."
            ])
        }
        if (isDrizzle) return pick([
            "A light waterproof layer — drizzle is deceptive. It's technically not raining but you'll be damp within ten minutes without something on top.",
            "Pack a compact waterproof. UK drizzle is the sneaky version — doesn't look like much, adds up quickly. A hood or waterproof layer covers it."
        ])
        if (rainPossible) return pick([
            "A folded compact umbrella in the bag is the right call today. Probably won't need it — but you'll know it's there.",
            "Might stay dry, might not. A packable waterproof in the bag gives you the option either way — takes no space, saves your day if it turns."
        ])
        if (feelsLike < 2) return pick([
            "Proper winter kit — the full combination. Insulated coat, hat that covers ears, gloves, scarf. The wind chill is the thing to dress for, not just the temperature.",
            "Everything you own, basically. Insulated coat, hat, gloves, scarf — all of them. This cold isn't about being stylish, it's about being warm.",
            isEdinburgh ? "Edinburgh cold at this level is proper. A coat that actually insulates, gloves, a hat that covers your ears. The wind off the Firth is relentless today." : "Genuinely freezing. Dress like you mean it — proper insulated coat, gloves, hat, scarf. Every layer is justified.",
            "A proper puffer or down jacket today. The kind with actual insulation, not a fashion layer.",
            "Thermal base layer under everything — it makes a significant difference at this temperature.",
            "A gilet under a jacket doubles the warmth without the bulk. Worth it today.",
            "Boots over trainers today. Your feet will feel the difference within ten minutes."
        ])
        if (feelsLike < 8) {
            if (isEdinburgh) return pick([
                "A proper coat — Edinburgh cold at this temperature is amplified by wind. Hat, gloves, and something for your neck. Don't underestimate it.",
                "Full coat, hat, gloves. The Edinburgh wind makes the number on the thermometer misleading — dress for how it feels, not what it says."
            ])
            if (isBrighton) return pick([
                "A proper coat and a layer underneath — the sea breeze on the Brighton seafront makes it feel sharper than the temperature. Hat if you're going anywhere exposed.",
                "Warm coat and layers. The Channel wind catches you on the seafront. Dress warmer than it looks from inside."
            ])
            return pick([
                "A proper insulated coat today — not a fashion jacket, something that actually keeps heat in. A mid-layer underneath. Gloves if you're outside for any stretch.",
                "Cold enough to need a coat that means it. Mid-layer underneath, gloves in the pocket. Don't get caught out by thinking it's milder than it is.",
                "A mid-weight jacket — a Harrington, a chore coat, a denim jacket with a layer underneath.",
                "A light knitwear layer under a jacket. The combination covers the temperature range.",
                "Chinos and a layer rather than shorts. The temperature catches you out if you underdress."
            ])
        }
        if (feelsLike < 14) {
            if (isLondon && isMorning) return pick([
                "Mid-layer and a jacket for the commute — it looks milder from the window than it is once you're outside. The jacket is the right call.",
                "A jacket for the morning commute — that transitional temperature where inside feels fine but outside has a bite to it. Take the extra layer."
            ])
            return pick([
                "A jacket is the right call — it's the kind of temperature where being slightly overdressed is always better than the alternative.",
                "Mid-weight jacket. Not heavy coat weather, but definitely not t-shirt weather either. The sweet spot where a good jacket does the job perfectly."
            ])
        }
        if (feelsLike > 24) {
            if (isLondon) return pick([
                "Summer clothes — genuinely. London warm days are to be dressed for properly. Light layers, open shoes, enjoy it.",
                "It's actually warm. Light summer clothes, forget the jacket. These days happen and they're worth dressing for."
            ])
            return pick([
                "Summer clothes. Properly warm today — dress for it. Light fabrics, open shoes.",
                "Light summer layers. Good weather deserves the right outfit — leave the jacket at home."
            ])
        }
        if (feelsLike >= 18) return pick([
            "Light layers — it's pleasant but the UK evening always has a cool edge. A light jacket in the bag for later is the smart move.",
            "T-shirt plus a light layer for later. Good conditions — enjoy them. Something to put on if the evening cools off."
        ])
        return pick([
            "A mid-layer and you're set. That reliable jacket-but-not-quite-a-coat weather.",
            "Mid-layer — not heavy coat, not t-shirt. The practical UK middle ground that works most of the year."
        ])
    }

    // ── SOUTH / SOUTHEAST ASIA ──────────────────────────────────
    const isSEAsia = c.includes("bangkok") || c.includes("singapore") || c.includes("kuala lumpur") ||
        c.includes("jakarta") || c.includes("ho chi minh") || c.includes("hanoi") ||
        c.includes("manila") || c.includes("bali") || c.includes("phuket") ||
        c.includes("chiang mai") || c.includes("myanmar") || c.includes("yangon") ||
        c.includes("vietnam") || c.includes("thailand") || c.includes("cambodia") || c.includes("phnom penh")
    if (isSEAsia) {
        if (isHeavyRain || isStorm) return pick([
            "A proper waterproof — SE Asian heavy rain is a different category from European rain. An umbrella won't cover it. Waterproof shoes if you have them, or accept that your feet will be wet.",
            "Full waterproof jacket. The rain here doesn't mess around — when it comes it's serious, fast, and heavy. Waterproof shoes or sandals that can handle getting wet."
        ])
        if (isRaining) return pick([
            "A good compact umbrella is enough for lighter rain here — keep it on you. A light waterproof layer if you're moving around a lot.",
            "Umbrella essential. SE Asian rain can intensify fast — something to cover up with is the base requirement today.",
            "A lightweight linen shirt — open collar, loose fit. The heat index today means anything else will be uncomfortable.",
            "Sandals over closed shoes unless you need them. Your feet need to breathe.",
            "Light cotton everything. Pack a thin layer for the AC — the temperature difference between outside and inside is extreme."
        ])
        if (isHumid && feelsLike >= 30) return pick([
            "The lightest fabrics you own. Cotton or linen — nothing synthetic. The humidity makes the heat significantly heavier than the temperature reads, so dress even lighter than you think.",
            "Ultra-light, breathable fabrics. Loose-fitting. The heat index today is well above the temperature number — don't fight it with anything fitted or synthetic.",
            "Loose cotton or linen, the lightest you have. This combination of heat and humidity is why light, breathable fabric exists. Anything else will feel wrong within five minutes."
        ])
        if (feelsLike >= 32) return pick([
            "Light fabrics, light colours. SPF if you're in the sun — UV at this latitude is strong even on cloudy days.",
            "As light as possible. The heat here is real — natural fibres, loose fit, sunscreen for any time in direct sun."
        ])
        return pick([
            "Light summer clothes throughout — it's warm but manageable. A compact umbrella in the bag is always sensible here.",
            "Light, comfortable summer clothes. Good conditions — enjoyable if you're dressed right for the climate."
        ])
    }

    // ── JAPAN / KOREA ────────────────────────────────────────────
    const isJapanKorea = c.includes("tokyo") || c.includes("osaka") || c.includes("kyoto") ||
        c.includes("seoul") || c.includes("busan") || c.includes("sapporo") || c.includes("japan") || c.includes("korea")
    if (isJapanKorea) {
        const isSeoul = c.includes("seoul") || c.includes("busan")
        const isTokyo = c.includes("tokyo") || c.includes("japan")
        if (isHeavyRain) return pick([
            "A proper waterproof jacket — Japanese rain can be serious and sustained. Waterproof shoes strongly recommended. A foldable umbrella as backup.",
            "Full waterproof gear. Typhoon-adjacent weather means the umbrella won't be enough — a jacket with a hood, waterproof shoes or boots."
        ])
        if (isRaining) return pick([
            "Umbrella is essential — Japan and Korea take their rain gear seriously and you should too. A compact one lives in every bag here for good reason.",
            "A good compact umbrella — mandatory today. Keep it in the bag always in this season."
        ])
        if (feelsLike < 0) {
            if (isSeoul) return pick([
                "Korean winter at sub-zero is no joke. A proper insulated coat — puffer or wool-lined. Thermal underlayer, gloves, hat, scarf. Seoul wind makes the number feel much worse.",
                "Full winter kit for Seoul sub-zero. Thermal base layer, insulated coat, hat, gloves, face covering if you're outside for any stretch. The wind here amplifies everything."
            ])
            return pick([
                "Full winter layers — thermal base, insulated coat, hat, gloves, scarf. Don't underestimate Japanese sub-zero with wind.",
                "Proper insulated coat and thermals underneath. Hat, gloves, scarf. The cold here is dry which means it cuts through light layers fast."
            ])
        }
        if (feelsLike < 8) return pick([
            "A warm coat and proper layers underneath — the cold here is drier than European cold, which means it feels sharper. Gloves are worth it.",
            "Insulated coat, a mid-layer underneath, gloves. Dry cold bites differently — dress warmer than a UK equivalent temperature would need."
        ])
        if (feelsLike > 28 && isHumid) return pick([
            "Japanese/Korean summer humidity is a different beast — loose, breathable fabrics are essential. Cotton or linen, nothing fitted or synthetic. A small towel isn't excessive here.",
            "The humidity is the thing to dress for, not just the temperature. Loose, light, breathable fabrics. Carry a compact fan if you have one — not ironic, genuinely useful."
        ])
        return pick([
            "Layers that you can adjust — spring and autumn here are genuinely variable. Mid-layer that can go over a shoulder bag if it warms up.",
            "Comfortable layers. The temperature here can shift noticeably through the day — a layer you can add or remove is always the right approach."
        ])
    }

    // ── SOUTHERN EUROPE / MEDITERRANEAN ─────────────────────────
    const isMed = c.includes("barcelona") || c.includes("madrid") || c.includes("seville") ||
        c.includes("rome") || c.includes("milan") || c.includes("naples") || c.includes("florence") ||
        c.includes("athens") || c.includes("santorini") || c.includes("mykonos") ||
        c.includes("lisbon") || c.includes("porto") || c.includes("valencia") ||
        c.includes("palma") || c.includes("ibiza") || c.includes("mallorca") ||
        c.includes("marrakech") || c.includes("casablanca") || c.includes("tunis") ||
        c.includes("istanbul") || c.includes("turkey") || c.includes("croatia") || c.includes("dubrovnik")
    if (isMed) {
        if (isHeavyRain) return pick([
            "A proper waterproof — Mediterranean heavy rain can be intense and unexpected. Umbrella plus waterproof layer. Closed shoes are worth it.",
            "Waterproof jacket and shoes if you have them — Mediterranean storms are short but heavy. Don't be caught without something proper."
        ])
        if (isRaining) return pick([
            "A good umbrella and a light waterproof layer. Mediterranean rain doesn't last but it can arrive fast — have something on you.",
            "Umbrella essential today. A light waterproof on top covers the rest — Mediterranean rain is usually brief but worth being prepared for."
        ])
        if (feelsLike >= 36) {
            if (uvExtreme) return pick([
                "Light, full-coverage clothing and SPF everywhere. Mediterranean UV at peak summer is extreme — cover up rather than expose. Hat, proper sunglasses, SPF 50 on any bare skin.",
                "Cover up for sun protection rather than baring skin — the UV today is stronger than it feels. Loose light fabrics that cover shoulders, SPF, hat with a brim, good sunglasses."
            ])
            return pick([
                "Light, breathable fabrics only. Linen or cotton — nothing dark, nothing fitted. Best outdoor time is early morning or evening.",
                "As light as you can dress. The heat is serious — light natural fabrics, avoid dark colours, SPF if you're in direct sun."
            ])
        }
        if (feelsLike < 12) return pick([
            "A proper jacket — Mediterranean winters surprise people who come expecting warmth. It's genuinely cold, especially with coastal wind. A mid-layer underneath.",
            "Warm jacket and layers. This isn't warm Mediterranean weather — it's proper cool season. Dress for it rather than hoping it's warmer than it looks."
        ])
        if (feelsLike >= 22 && uvHigh && !isEvening) return pick([
            "Summer clothes but don't skip the SPF — Mediterranean UV is consistently high and will burn you faster than Northern European sun. Sunglasses too.",
            "Light summer layers. SPF is important today — UV is high even if it doesn't feel unbearably hot. Sunglasses, and cover shoulders if you're in direct sun for any stretch."
        ])
        return pick([
            "Light layers — Mediterranean shoulder season is often the best weather of the year. A light jacket for evening, but enjoy the day without one.",
            "Comfortable clothes and maybe a light layer for later. Good Mediterranean conditions — dress appropriately and enjoy being outside."
        ])
    }

    // ── USA ──────────────────────────────────────────────────────
    const isUSA = c.includes("new york") || c.includes("brooklyn") || c.includes("manhattan") ||
        c.includes("miami") || c.includes("los angeles") || c.includes("san francisco") ||
        c.includes("chicago") || c.includes("boston") || c.includes("las vegas") || c.includes("orlando") ||
        c.includes("united states") || c.includes("washington")
    if (isUSA) {
        const isNYC = c.includes("new york") || c.includes("brooklyn") || c.includes("manhattan")
        const isChicago = c.includes("chicago")
        const isSF = c.includes("san francisco")
        const isMiami = c.includes("miami")
        const isLV = c.includes("las vegas")
        if (isHeavyRain) {
            if (isNYC) return pick([
                "A proper waterproof jacket — NYC wind will destroy any umbrella. If you're walking more than a block, a full waterproof is the only answer. Waterproof shoes strongly recommended.",
                "Forget the umbrella — a waterproof jacket with a hood is what actually works in New York rain. The cross-street wind makes umbrellas useless."
            ])
            return pick([
                "Full waterproof jacket and if possible, waterproof shoes. Serious rain needs proper gear.",
                "Waterproof jacket over anything else. An umbrella alone won't cover heavy rain with wind."
            ])
        }
        if (isRaining) return pick([
            "Umbrella and a light waterproof layer. The combination is what actually keeps you dry — one without the other usually leaves you damp somewhere.",
            "A good compact umbrella plus a light waterproof. Cover both bases today."
        ])
        if (feelsLike < -5) {
            if (isNYC) return pick([
                "Full winter kit and then some. The wind between the skyscrapers makes sub-zero feel significantly worse — thermal underlayers, insulated coat, hat that covers ears, gloves, face covering. This is serious cold.",
                "Every layer you own. NYC wind tunnels in this cold are brutal — thermal base, insulated puffer or wool coat, scarf, hat, gloves. Exposed skin frostbitten within minutes at this temperature with wind."
            ])
            if (isChicago) return pick([
                "Chicago wind makes this temperature dangerous. Serious insulation — thermal underlayer, insulated coat, face covering, everything. The 'Windy City' reputation is not exaggerated.",
                "Full cold-weather protection. Chicago in sub-zero is one of the coldest urban experiences in the world — dress like it means it. Everything covered."
            ])
            return pick([
                "Serious cold. Full winter gear — thermals, insulated coat, everything covered. This is the real thing.",
                "Everything you have. Sub-zero with wind is dangerous — insulate properly and minimise time outside."
            ])
        }
        if (feelsLike < 5) {
            if (isNYC) return pick([
                "A real winter coat — not a fashion layer. Thermals underneath, gloves, hat. The walk from the subway will remind you what New York winter means.",
                "Full winter mode. Insulated coat, mid-layer, hat, gloves. NYC winter at this temperature means it."
            ])
            return pick([
                "Proper winter layers. An insulated coat, mid-layer, hat and gloves. Don't underestimate it.",
                "Full winter kit. This cold is the real thing — dress for where you're going, not just the trip outside."
            ])
        }
        if (isLV && feelsLike >= 38) return pick([
            "Loose, light fabrics for outdoors. But honestly — the Vegas strategy is to stay in AC spaces connected by walkways. If you're doing outdoor pools, mornings only. The Strip is survivable because it's all connected indoors.",
            "The lightest you have — but Vegas heat at this level is best handled from inside. Air conditioning exists for this exact reason. Outdoor time: early morning or after 7pm."
        ])
        if (isSF && feelsLike < 14) return pick([
            "San Francisco cold is the sneaky kind — it's rarely freezing but the fog and wind make it feel much colder than the number. A proper jacket, a warm mid-layer. People underestimate it constantly.",
            "A real jacket for San Francisco — not a light layer. The fog and bay wind are the issue, not just the temperature. Layer up properly."
        ])
        if (isMiami && feelsLike >= 30 && isHumid) return pick([
            "Light, breathable fabrics — cotton or linen. Miami humidity makes everything feel heavier than it is. Nothing fitted, nothing synthetic. Open shoes.",
            "Light summer clothes, nothing fitted. Miami heat is as much about humidity as temperature — the lighter and looser, the better."
        ])
        return pick([
            "Layer appropriately for the conditions — a mid-layer that you can adjust through the day is usually the smart call.",
            "Comfortable layers. Dress for the temperature you're feeling, not just the number."
        ])
    }

    // ── AUSTRALIA / NZ ───────────────────────────────────────────
    const isOceania = c.includes("sydney") || c.includes("melbourne") || c.includes("brisbane") ||
        c.includes("perth") || c.includes("adelaide") || c.includes("auckland") || c.includes("australia")
    if (isOceania) {
        const isMelb = c.includes("melbourne")
        if (isRaining || isHeavyRain) return pick([
            "A waterproof jacket — Australian rain can intensify quickly. Umbrella as backup. Closed shoes if you're walking.",
            "Waterproof layer essential. The weather here can change faster than the forecast suggests — having something on you is always the right call."
        ])
        if (isMelb) return pick([
            "Layers you can add and remove — Melbourne four-seasons-in-one-day is real. Whatever you put on this morning might be wrong by this afternoon. A jacket you can tie around your waist is the Melbourne standard.",
            "Adaptable layers. Melbourne weather changes its mind without notice — you need clothing that lets you change yours too. Mid-layer, top, something for the cold snap that may or may not arrive."
        ])
        if (feelsLike >= 32 && uvExtreme) return pick([
            "Light, full-coverage clothing and SPF50+. Australian UV is genuinely dangerous — Slip, Slop, Slap isn't a joke. Hat with a brim, sunglasses, covered shoulders if you're outside for any stretch.",
            "Protect your skin seriously today. Australian UV is among the strongest in the world — cover up, use proper SPF, wear a hat. The sun will burn you faster than almost anywhere else."
        ])
        if (feelsLike >= 28 && uvHigh) return pick([
            "Light summer clothes but take sun protection seriously — SPF, sunglasses, hat. Australian UV is no joke even on pleasant days.",
            "Summer clothes plus SPF. UV is high enough that sun protection matters even when the temperature feels manageable."
        ])
        return pick([
            "Comfortable clothes for the conditions. A light layer in the bag is never wrong in Australia — the weather has opinions.",
            "Dress for what it is, keep an adaptable layer handy. Australian weather is worth being prepared for."
        ])
    }

    // ── GENERIC FALLBACK (with intelligence) ────────────────────
    if (isHeavyRain) return pick([
        "Full waterproof jacket and if possible waterproof shoes. Serious rain needs proper preparation.",
        "A proper waterproof — not just an umbrella. Cover up properly for this kind of rain."
    ])
    if (isRaining) return pick([
        "Umbrella plus a light waterproof layer. The combination is what actually keeps you dry.",
        "Waterproof layer and umbrella. Rain is the priority — dress around it and the day is manageable."
    ])
    if (isDrizzle || rainPossible) return pick([
        "A compact umbrella or packable waterproof in the bag. Might not need it — but the option is worth having.",
        "Something waterproof accessible — drizzle or possible rain means being prepared costs nothing."
    ])
    if (feelsLike >= 35) return pick([
        "The lightest fabrics you own. Cover up from the sun rather than exposing skin — loose, light layers protect better than bare skin in extreme heat. SPF, hat, water.",
        "Loose, light, breathable clothing. Heat at this level is a planning problem as much as a wardrobe problem — cover up, hydrate, choose shade."
    ])
    if (feelsLike >= 28) return pick([
        "Light summer clothes — natural fabrics if you have them. The heat is real today.",
        "Light layers, breathable fabrics. Good conditions if you're dressed for the temperature."
    ])
    if (feelsLike >= 20) return pick([
        "T-shirt weather or close to it. A light layer for later if the evening cools.",
        "Light layers — comfortable conditions. Something to add in the evening."
    ])
    if (feelsLike >= 13) return pick([
        "A jacket is the right call — that transitional temperature where a mid-layer covers everything.",
        "Mid-weight jacket. Not heavy coat weather, not t-shirt weather. Good jacket weather."
    ])
    if (feelsLike >= 5) return pick([
        "A proper coat and layers underneath. Cold enough to take seriously.",
        "Insulated layers — a coat that actually insulates, mid-layer, and something for your neck."
    ])
    return pick([
        "Full winter kit — insulated coat, hat, gloves, scarf. This cold means it.",
        "Every proper layer you have. This is the kind of cold that makes you glad you dressed properly."
    ])
}

// -- WINDOW FUNCTION -----------------------------------------------
// Scans hourly data to find the best outdoor window remaining in the day

function getWindow(hourly, utcOffset, currentCode, currentRain) {
    if (!hourly || hourly.length === 0) return null
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
    const currentHour = getCityCurrentHour(utcOffset)
    const remainingHours = hourly.filter(h => getHourFromISO(h.time) >= currentHour)
    if (remainingHours.length === 0) return null
    const isDryHour = (h) => h.code < 51 && h.rain < 35
    const dryHours = remainingHours.filter(isDryHour)
    const totalRemaining = remainingHours.length
    if (dryHours.length === totalRemaining && totalRemaining >= 3) {
        return pick([
            "Clear conditions all the way through. No window to find — today is the window. Use all of it.",
            "Stays dry from now until tonight. No planning required — just get outside when it suits you.",
            "No rain coming. The whole rest of the day is yours — no timing to work around.",
            "Dry all the way through. Today is one of those days where the forecast does you a favour."
        ])
    }
    const currentlyRaining = currentCode >= 51 || currentRain >= 55
    if (currentlyRaining) {
        const clearIndex = remainingHours.findIndex(isDryHour)
        if (clearIndex === -1) {
            const bestHour = remainingHours.reduce((best, h) => h.rain < best.rain ? h : best, remainingHours[0])
            const bestLabel = getHourLabel(bestHour.time)
            return pick([
                `Rain through most of the day. The lightest period is around ${bestLabel} if you need to be outside.`,
                `No clean dry window today. Best gap is around ${bestLabel} — not ideal but it's the least wet period.`,
                `It stays wet. If you have to be outside, ${bestLabel} is the least bad option.`
            ])
        }
        const clearHour = remainingHours[clearIndex]
        const clearLabel = getHourLabel(clearHour.time)
        let clearCount = 0
        for (let i = clearIndex; i < remainingHours.length; i++) {
            if (isDryHour(remainingHours[i])) clearCount++
            else break
        }
        if (clearCount <= 1) return pick([
            `Brief gap around ${clearLabel} — not much of a window but it's there if you need it.`,
            `Clears briefly around ${clearLabel}. A narrow window — use it fast if you need to be outside.`,
            `One hour of dry around ${clearLabel}. That's your window — plan accordingly.`
        ])
        if (clearCount <= 3) return pick([
            `Clears around ${clearLabel} for a couple of hours. That's your window — use it while it lasts.`,
            `Rain eases around ${clearLabel} and you get a couple of hours. Worth planning outdoor things for then.`,
            `The gap opens around ${clearLabel}. Two hours of dry — enough to make it count.`
        ])
        return pick([
            `Rain clears around ${clearLabel} and stays dry from there. Plan outdoor things from then.`,
            `It improves significantly around ${clearLabel} and doesn't look back. That's your window.`,
            `Clears around ${clearLabel} and the rest of the day is yours. Use the morning for indoor things.`,
            `The forecast turns around ${clearLabel}. Everything outdoor should happen from then.`
        ])
    }
    const rainIndex = remainingHours.findIndex(h => !isDryHour(h))
    if (rainIndex === -1) {
        return pick([
            "Stays dry through the rest of the day. No timing to plan around — you're good.",
            "No rain coming today. The forecast is clear and so is your schedule.",
            "Dry all the way through. Nothing to plan around — just get outside.",
            "Clear window to the end of the day. Make the most of it."
        ])
    }
    const rainHour = remainingHours[rainIndex]
    const rainLabel = getHourLabel(rainHour.time)
    const dryWindowHours = rainIndex
    if (dryWindowHours <= 1) return pick([
        `Rain arriving soon — around ${rainLabel}. Get outdoor plans done now if you can.`,
        `You have maybe an hour before rain moves in around ${rainLabel}. Act now if you need to be outside.`,
        `Window is closing — rain around ${rainLabel}. Whatever needs doing outside, do it now.`
    ])
    if (dryWindowHours <= 3) return pick([
        `Good window until around ${rainLabel} when rain moves in. Use the time you have.`,
        `Dry until ${rainLabel} — a couple of hours to work with. Good window for outdoor plans.`,
        `You have until around ${rainLabel} before things change. Worth making the most of it.`,
        `Clear until ${rainLabel}. That's your outdoor window — use it before the rain arrives.`
    ])
    const isEveningRain = getHourFromISO(rainHour.time) >= 19
    if (isEveningRain) return pick([
        `Rain not until around ${rainLabel} — you have the day. Evening plans need something waterproof.`,
        `Good conditions all day with rain arriving around ${rainLabel}. Morning and afternoon are completely yours.`,
        `The day is yours — rain doesn't arrive until ${rainLabel}. Evening plans need a jacket.`,
        `Clear until ${rainLabel} this evening. Make the most of the day — the evening will be wet.`
    ])
    return pick([
        `Dry until around ${rainLabel} when things change. Outdoor plans before then, indoor from there.`,
        `Good window until ${rainLabel} — use the morning while conditions hold.`,
        `Clear until around ${rainLabel}. That's when the forecast changes — plan around it.`,
        `You have until ${rainLabel} before the rain arrives. Use the dry window well.`
    ])
}

function getWeatherGradient(code, temp, isNight) {
    // Night — condition-aware dark gradients
    if (isNight) {
        if (code >= 95) return { gradient: "linear-gradient(180deg, #1A0525 0%, #0D0F1A 70%)", textMode: "light" }
        if (code >= 61) return { gradient: "linear-gradient(180deg, #030A18 0%, #0D0F1A 70%)", textMode: "light" }
        if (code >= 51) return { gradient: "linear-gradient(180deg, #050F1E 0%, #0D0F1A 70%)", textMode: "light" }
        return { gradient: "linear-gradient(180deg, #0A1428 0%, #0D0F1A 70%)", textMode: "light" }
    }
    // Daytime — severe weather always dark
    if (code >= 95) return { gradient: "linear-gradient(180deg, #3A0A55 0%, #0D1020 75%)", textMode: "light" }
    if (code >= 61) return { gradient: "linear-gradient(180deg, #0A2840 0%, #0D1525 75%)", textMode: "light" }
    if (code >= 51) return { gradient: "linear-gradient(180deg, #0D2535 0%, #0D1520 75%)", textMode: "light" }
    // Overcast AND cold — dark blue (clear cold days fall through to soft blue)
    if (code === 3 && temp < 10) return { gradient: "linear-gradient(to bottom, #0A192F 0%, #1E3A5F 50%, #2C5282 100%)", textMode: "light" }
    // Clear/mainly clear + hot (≥20°C) daytime — bright sky blue, dark text
    if ((code === 0 || code === 1) && temp >= 20) {
        return { gradient: "linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)", textMode: "dark" }
    }
    // Clear/partly cloudy + moderate (10–19°C) daytime — soft blue, light text
    if ((code === 0 || code === 1 || code === 2) && temp >= 10) {
        return { gradient: "linear-gradient(to bottom, #4A90A4 0%, #5DADE2 50%, #85C1E2 100%)", textMode: "light" }
    }
    // Edge case fallback
    return { gradient: "linear-gradient(to bottom, #0A192F 0%, #1E3A5F 50%, #2C5282 100%)", textMode: "light" }
}

// -- MAIN COMPONENT ------------------------------------------------
export default function ROOFHeroLive() {
    const [weather, setWeather] = useState(null)
    const [hourly, setHourly] = useState([])
    const [forecast, setForecast] = useState([])
    const [arcMessage, setArcMessage] = useState(null)
    const [city, setCity] = useState(() => {
        try {
            const params = new URLSearchParams(window.location.search)
            return params.get("city") || DEFAULT_CITY.name
        } catch { return DEFAULT_CITY.name }
    })
    const [cityCoords, setCityCoords] = useState(() => {
        try {
            const params = new URLSearchParams(window.location.search)
            const lat = params.get("lat")
            const lon = params.get("lon")
            if (lat && lon) return { lat: parseFloat(lat), lon: parseFloat(lon) }
        } catch {}
        return { lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon }
    })
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
        footerText: "#333",
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

    useEffect(() => {
        document.title = "ROOF -- Weather, honestly."
        // Ensure proper mobile viewport
        let vp = document.querySelector('meta[name="viewport"]')
        if (!vp) { vp = document.createElement("meta"); vp.setAttribute("name", "viewport"); document.head.appendChild(vp) }
        vp.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1")
        const setMeta = (name, content, prop = false) => {
            const attr = prop ? "property" : "name"
            let el = document.querySelector(`meta[${attr}="${name}"]`)
            if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el) }
            el.setAttribute("content", content)
        }
        setMeta("description", "Live weather for any city on earth. Plain language forecasts, no symbols, no percentages. Just the weather, told right.")
        setMeta("og:title", "ROOF -- Weather, honestly.", true)
        setMeta("og:description", "Live weather for any city on earth. Plain language forecasts, no symbols, no percentages. Just the weather, told right.", true)
        setMeta("og:url", "https://roofweather.app", true)
        setMeta("og:type", "website", true)
        setMeta("twitter:card", "summary_large_image")
        setMeta("twitter:title", "ROOF -- Weather, honestly.")
        setMeta("twitter:description", "Live weather for any city on earth. Plain language forecasts, no symbols, no percentages. Just the weather, told right.")
    }, [])

    useEffect(() => {
        if (!navigator.geolocation) return
        // Skip geolocation if URL already has city params or nogeo flag
        try {
            const params = new URLSearchParams(window.location.search)
            if (params.get("lat") || params.get("city") || params.get("nogeo")) return
        } catch {}
        setGeoStatus("detecting")
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then((r) => r.json())
                    .then((data) => {
                        const address = data.address || {}
                        const name = address.city || address.town || address.village || address.county || "Your location"
                        const country = address.country || ""
                        const fullName = country ? `${name}, ${country}` : name
                        setCity(fullName)
                        setCityCoords({ lat: latitude, lon: longitude })
                        setGeoStatus("detected")
                    })
                    .catch(() => { setCity("Your location"); setCityCoords({ lat: latitude, lon: longitude }); setGeoStatus("detected") })
            },
            () => setGeoStatus("denied"),
            { timeout: 8000 }
        )
    }, [])

    useEffect(() => {
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
