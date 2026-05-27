'use client'

import { useParams } from "next/navigation"

import { useState, useEffect } from "react"

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

// ─── CITY DATA ────────────────────────────────────────────────
const CITY_DATA: Record<string, {
    name: string
    country: string
    lat: number
    lon: number
    timezone: string
    hero: string
    sub: string
    culture: string
    bestTime: string
    weatherNote: string
    tip: string
}> = {
    london: {
        name: "London", country: "United Kingdom",
        lat: 51.5074, lon: -0.1278, timezone: "Europe/London",
        hero: "London weather, told straight.",
        sub: "No symbols. No percentages. Just what the sky is actually doing — and what to do about it.",
        culture: "London weather is a personality. The grey isn't sad — it's constant. The rare sunny day is an event. Locals dress in layers regardless of the forecast, carry a jacket from June through September, and treat any temperature above 20° as a heatwave. The city has its own relationship with drizzle: not quite rain, not quite dry, entirely London.",
        bestTime: "May to September for warmth. October for crisp, clear days. December for atmosphere.",
        weatherNote: "London rain rarely arrives in heavy downpours — it's persistent, light, and often invisible on a radar. Wind chill makes mild days feel cold. Always check feels-like, not just temperature.",
        tip: "The most useful London weather question isn't 'will it rain?' — it's 'when is my window?' There's almost always one.",
    },
    paris: {
        name: "Paris", country: "France",
        lat: 48.8566, lon: 2.3522, timezone: "Europe/Paris",
        hero: "Paris weather, without the mystery.",
        sub: "The most visited city on earth deserves an honest forecast. Here it is.",
        culture: "Parisians dress for the weather they want, not the weather they have — and somehow it works. The city has four genuine seasons, each with its own character. Spring is unpredictable and beautiful. Summer is warm but storm-prone in the afternoons. Autumn is arguably the best: clear, golden, cool. Winter is mild by northern European standards but the grey can be relentless.",
        bestTime: "April–June for spring colour. September–October for golden light and fewer crowds.",
        weatherNote: "Summer afternoons in Paris can turn stormy fast — particularly July and August. If you're planning outdoor dining or a Seine cruise, morning is safer than evening.",
        tip: "The Eiffel Tower in light rain looks better than in direct sun. Paris has a way of making even the grey feel deliberate.",
    },
    dubai: {
        name: "Dubai", country: "United Arab Emirates",
        lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai",
        hero: "Dubai weather, honestly.",
        sub: "Extreme heat requires honest communication. ROOF gives you that.",
        culture: "Dubai weather is binary: hot, and extremely hot. From May through September, stepping outside between 11am and 5pm is a decision that requires planning. The city is built around this — indoor malls, air-conditioned walkways, rooftop pools that face east for the morning. The remaining months are genuinely spectacular: warm, dry, clear. When Dubai gets rain — which happens rarely — the entire city takes notice.",
        bestTime: "November to March. Cool mornings, warm afternoons, clear skies. The world comes to Dubai in these months.",
        weatherNote: "July and August temperatures regularly exceed 40°. Humidity in coastal areas makes it feel considerably worse. Outdoor activities should be limited to before 9am or after 7pm.",
        tip: "Dubai's rare rainfall — usually November or December — is worth experiencing. The city is genuinely unprepared for it, and the atmosphere is unlike anything else.",
    },
    bangkok: {
        name: "Bangkok", country: "Thailand",
        lat: 13.7563, lon: 100.5018, timezone: "Asia/Bangkok",
        hero: "Bangkok weather, straight up.",
        sub: "The world's most visited city has three seasons. Here's what they actually mean.",
        culture: "Bangkok doesn't do mild. The city operates at a volume — heat, humidity, noise, colour — that has no European equivalent. The three seasons are hot (March–May), wet (June–October), and cool (November–February). 'Cool' means 25°. The wet season isn't grey and drizzly — it's dramatic afternoon downpours that last an hour and then stop. Life continues around them.",
        bestTime: "November to February. Lower humidity, temperatures around 28–32°, clear skies.",
        weatherNote: "The wet season (June–October) brings daily afternoon storms around 3–5pm. Morning activities are unaffected. The heat index — how it feels with humidity — is always higher than the temperature reading.",
        tip: "Bangkok rain is spectacular and brief. Most locals carry a small umbrella not for protection but for the five minutes it takes to find cover.",
    },
    "new-york": {
        name: "New York", country: "United States",
        lat: 40.7128, lon: -74.0060, timezone: "America/New_York",
        hero: "New York weather, no nonsense.",
        sub: "Four seasons, all of them extreme. Here's what you actually need to know.",
        culture: "New York takes its weather seriously because it has to. The city genuinely experiences all four seasons at their most intense: brutal winters with wind tunnels between the skyscrapers, humid summers where the subway becomes a sauna, perfect springs that last about three weeks, and autumns that make the whole city look like a film set. New Yorkers dress practically and move fast — the weather is an obstacle to get through.",
        bestTime: "Late September to early November. The light is extraordinary, the heat has gone, and the city is at its most photogenic.",
        weatherNote: "Wind chill in winter Manhattan is serious — the skyscraper corridors amplify it significantly. A 5° day with wind can feel like -10°. Always check the real feel.",
        tip: "The best New York weather day is a crisp October Tuesday. Blue sky, yellow leaves, empty museums. Avoid July and August unless you're prepared for the humidity.",
    },
    tokyo: {
        name: "Tokyo", country: "Japan",
        lat: 35.6762, lon: 139.6503, timezone: "Asia/Tokyo",
        hero: "Tokyo weather, properly explained.",
        sub: "Typhoon season, cherry blossom windows, humid summers. Here's the honest guide.",
        culture: "Tokyo has one of the world's most dramatic weather calendars. Cherry blossom season (late March to early April) is a weather event the entire city plans around. Rainy season (tsuyu) arrives in June — not dramatic storms, but weeks of persistent grey drizzle. Summer is hot and humid in a way that surprises visitors. Autumn is superb. And Tokyo typhoon season (August–October) produces storms that can disrupt travel seriously.",
        bestTime: "Late March–early April for cherry blossom. October–November for autumn colour and perfect temperatures.",
        weatherNote: "Typhoon season runs August through October. Most pass without major disruption but flight cancellations are common. Check forecasts 48 hours ahead if travelling in this window.",
        tip: "The cherry blossom window is roughly 2 weeks and changes every year. ROOF tracks it in real time — check the 7-day forecast from late March.",
    },
    barcelona: {
        name: "Barcelona", country: "Spain",
        lat: 41.3851, lon: 2.1734, timezone: "Europe/Madrid",
        hero: "Barcelona weather, honestly.",
        sub: "Mediterranean sun with Atlantic surprises. Here's what the forecast actually means.",
        culture: "Barcelona lives outside. The city's architecture, culture and daily rhythm assume good weather because, most of the time, it delivers. Summers are hot and dry with occasional thunderstorms. Spring and autumn are the most comfortable and the most underrated. Winter is mild — 12–15° — and the city is largely tourist-free. The sea breeze keeps coastal areas cooler than the city centre in summer.",
        bestTime: "May–June or September–October. Warm, manageable, without the August crowds and heat.",
        weatherNote: "August in Barcelona is genuinely hot — 30°+ with humidity. The beaches are packed and the city is at its most intense. Spring and autumn offer the same light with a fraction of the crowds.",
        tip: "Barcelona's afternoon storms in summer are brief and clearing — they often produce the best evening light of the day. Don't cancel outdoor plans, just delay by 90 minutes.",
    },
    istanbul: {
        name: "Istanbul", country: "Turkey",
        lat: 41.0082, lon: 28.9784, timezone: "Europe/Istanbul",
        hero: "Istanbul weather, two continents, one forecast.",
        sub: "A city between Europe and Asia deserves weather that understands both.",
        culture: "Istanbul straddles two continents and its weather reflects that duality — Mediterranean warmth on the European side, more continental variation on the Asian side. The Bosphorus creates its own microclimate, with strong winds (the poyraz from the north) that can make even warm days feel sharp. Summers are hot and increasingly dry. Winters are mild but can bring snow, which transforms the minarets and the Bosphorus in a way that stops the city.",
        bestTime: "April–May and September–October. Warm, clear, and manageable crowds.",
        weatherNote: "The poyraz wind from the northeast can drop temperatures dramatically and create rough conditions on the Bosphorus. A 25° day with poyraz can feel significantly colder.",
        tip: "Snow in Istanbul is rare and magical. If the forecast shows it while you're there, rearrange your plans to be outside.",
    },
    lagos: {
        name: "Lagos", country: "Nigeria",
        lat: 6.5244, lon: 3.3792, timezone: "Africa/Lagos",
        hero: "Lagos weather, honestly told.",
        sub: "The city that never stops deserves a forecast that keeps up.",
        culture: "Lagos weather is not a background condition — it shapes how the city moves. The rainy season (April to October) brings flooding that can make the mainland impassable. The harmattan (November to February) blows dry, dusty air from the Sahara, coating everything in a fine haze and making the air visible. Between them, Lagos runs on heat and humidity. The city dresses for this: light fabrics, layers that can be shed, umbrellas carried regardless of the sky.",
        bestTime: "December to February. The harmattan season is dry and cooler — temperatures drop to a manageable 25–28°. The haze can be atmospheric rather than oppressive.",
        weatherNote: "Lagos rainy season flooding is serious — some routes become impassable within 30 minutes of heavy rain. Always check the forecast before travelling across the city in May–September.",
        tip: "Harmattan dust haze creates extraordinary sunsets over the Lagos Lagoon. If you're there in December or January, the evening light is unlike anything else in West Africa.",
    },
    accra: {
        name: "Accra", country: "Ghana",
        lat: 5.6037, lon: -0.1870, timezone: "Africa/Accra",
        hero: "Accra weather, straight.",
        sub: "Hot, honest, no weather symbols required.",
        culture: "Accra sits just north of the equator and the weather makes this known. Two rainy seasons (April–June and September–October) punctuate an otherwise hot, dry calendar. The harmattan blows from December to February, bringing cooler temperatures and a dry haze that softens the light. Accra locals read the sky intuitively — clouds building to the south mean rain is coming fast, and it usually arrives exactly when you didn't bring an umbrella.",
        bestTime: "November to March. Drier, slightly cooler, and the harmattan gives the air a different quality.",
        weatherNote: "Accra's rainy season rain can arrive with very little warning. The afternoon is higher risk than the morning. If clouds are building by noon, plan to be indoors by 2pm.",
        tip: "Accra's harmattan mornings — dry air, reduced humidity, temperatures around 24° — are some of the most comfortable weather in West Africa. Early risers get the best of it.",
    },
    nairobi: {
        name: "Nairobi", country: "Kenya",
        lat: -1.2921, lon: 36.8219, timezone: "Africa/Nairobi",
        hero: "Nairobi weather, properly told.",
        sub: "1,800 metres above sea level. The weather up here is different. Here's how.",
        culture: "Nairobi sits at 1,800 metres above sea level and has one of the most pleasant climates of any major African city because of it. Temperatures rarely exceed 26° or drop below 10°. The city has two rainy seasons — the long rains (March–May) and the short rains (October–December) — and two dry seasons of clear, cool, spectacularly blue-sky days. Altitude means UV is higher than most visitors expect.",
        bestTime: "June–September (long dry season). Clear skies, no rain, temperatures around 18–22°. Also the best time for safari.",
        weatherNote: "Nairobi altitude means UV radiation is significantly higher than at sea level. Sunscreen is essential even when temperatures feel mild.",
        tip: "Nairobi's July is one of the finest weather months of any city on earth — clear, cool, zero humidity, perfect light. It's also peak safari season for the Great Migration.",
    },

    // ── UK CITIES ──────────────────────────────────────────────
    manchester: {
        name: "Manchester", country: "United Kingdom",
        lat: 53.4808, lon: -2.2426, timezone: "Europe/London",
        hero: "Manchester weather, straight up.",
        sub: "No city in Britain has a more honest relationship with rain. Here's what's actually coming.",
        culture: "Manchester and rain have an understanding. The city doesn't stop for it, doesn't apologise for it, and has long since built its identity around it. The truth is Manchester gets about the same rainfall as London — it just falls more frequently in lighter amounts. The grey is a constant companion but the city moves through it with a distinctly Mancunian indifference. When the sun does appear, it's genuinely appreciated.",
        bestTime: "May to September for the best chance of warmth. June and July are the peak months.",
        weatherNote: "The Pennines to the east create their own microclimate — weather can change fast and forecasts can be off by an hour or two. Always carry a layer.",
        tip: "Manchester's best weather days arrive with almost no warning. The city that's learned to live with grey rewards you when the sky finally clears.",
    },
    birmingham: {
        name: "Birmingham", country: "United Kingdom",
        lat: 52.4862, lon: -1.8904, timezone: "Europe/London",
        hero: "Birmingham weather, honestly told.",
        sub: "The UK's second city deserves a straight forecast. Here it is.",
        culture: "Birmingham sits in the heart of England and gets a genuinely midlands climate — not as wet as Manchester, not as cold as Edinburgh, not as mild as London. Four seasons that behave like seasons. The city has a diverse cultural calendar that continues regardless of weather, but the outdoor events at Broad Street and the Bullring are weather-dependent in a way locals plan around carefully.",
        bestTime: "June to August for warmth. October for crisp, clear autumn days.",
        weatherNote: "Birmingham can be several degrees colder than London on clear nights due to its inland position. The feels-like temperature matters more here than in coastal cities.",
        tip: "Birmingham weather is underrated in summer. The canal district and Centenary Square on a warm day are genuinely lovely — and far less crowded than they deserve to be.",
    },
    edinburgh: {
        name: "Edinburgh", country: "United Kingdom",
        lat: 55.9533, lon: -3.1883, timezone: "Europe/London",
        hero: "Edinburgh weather, no illusions.",
        sub: "The most dramatic city in Britain has weather to match. Here's the honest guide.",
        culture: "Edinburgh's weather is inseparable from its character. The city sits on volcanic rock at the edge of the Firth of Forth, exposed to winds from every direction and dramatically affected by its position relative to Arthur's Seat and the Castle Rock. The haar — a cold sea fog that rolls in from the North Sea — can drop visibility and temperature by midday even in summer. Wind is the defining feature; a 10° Edinburgh day can feel like 4°.",
        bestTime: "May to July for the best combination of light and warmth. August is Festival month — busy, often warm, occasionally spectacular.",
        weatherNote: "The Forth haar can arrive without much warning and take hours to clear. Check the forecast twice if you're planning outdoor activities — the city centre and Arthur's Seat can have completely different conditions.",
        tip: "Edinburgh at dusk after a clear day is one of Britain's genuinely extraordinary sights. The Castle lit up, the Old Town below, the Firth in the distance. Worth waiting for the right evening.",
    },
    glasgow: {
        name: "Glasgow", country: "United Kingdom",
        lat: 55.8642, lon: -4.2518, timezone: "Europe/London",
        hero: "Glasgow weather, honest as the city itself.",
        sub: "Scotland's biggest city takes its weather seriously. So do we.",
        culture: "Glasgow has the wettest climate of any major UK city — significantly more rainfall than Edinburgh, which is only 45 miles away but on the other side of the Central Belt. The city's position at the mouth of the Clyde and its exposure to Atlantic fronts means weather can change dramatically within hours. Glaswegians are matter-of-fact about it in a way that is entirely admirable — the rain is treated as a logistical fact, not a catastrophe.",
        bestTime: "June and July offer the best combination of warmth and longer daylight hours. August can surprise with spells of genuine warmth.",
        weatherNote: "Atlantic weather systems hit Glasgow before Edinburgh. If the west is getting rain, assume Glasgow will get it first and harder. Wind off the Clyde adds to any cold.",
        tip: "Glasgow in sunshine is a revelation. The sandstone buildings turn golden, the parks fill up, and the city shows a warmth that its weather rarely earns but always rewards.",
    },
    leeds: {
        name: "Leeds", country: "United Kingdom",
        lat: 53.8008, lon: -1.5491, timezone: "Europe/London",
        hero: "Leeds weather, straight.",
        sub: "West Yorkshire weather is real weather. Here's what's actually happening.",
        culture: "Leeds sits at the eastern edge of the Pennines, which creates a weather divide the city knows well. Westerly fronts dump their rain on the hills and often arrive in Leeds weakened but still persistent. The city has a strong outdoor culture — the parks, the countryside access, the festivals — all of which make the weather a genuine planning factor. Leeds summers can be genuinely warm. Leeds winters take no prisoners.",
        bestTime: "June to August. The Yorkshire countryside around Leeds is at its best in late summer.",
        weatherNote: "Pennine weather can change fast. A clear Leeds morning doesn't guarantee a clear afternoon if fronts are moving from the west.",
        tip: "A clear Leeds day with access to the Dales or Moors to the north is hard to beat. The weather when it cooperates makes the city's countryside position its greatest asset.",
    },
    bristol: {
        name: "Bristol", country: "United Kingdom",
        lat: 51.4545, lon: -2.5879, timezone: "Europe/London",
        hero: "Bristol weather, properly explained.",
        sub: "The South West's biggest city has weather that earns its mild reputation. Mostly.",
        culture: "Bristol is one of the warmest and mildest cities in the UK — its position near the coast and exposure to the Gulf Stream influence gives it a climate closer to southwest France than northern England. Summers are genuinely warm. Winters rarely get truly cold. The city's outdoor culture — the Harbourside, Clifton, the suspension bridge walks — is built around the expectation of relatively benign conditions. But Atlantic fronts still hit, and when they do, they're serious.",
        bestTime: "May to September. Bristol summers are the best in the UK outside the far southwest.",
        weatherNote: "Bristol gets more rain than people expect for a mild city — it comes in wetter but shorter bursts than further north. The Clifton area can be windier than the city centre.",
        tip: "Bristol in early summer — warm evenings, the Harbourside busy, the suspension bridge at sunset — is the city at its absolute best. Check the forecast and time it right.",
    },
    liverpool: {
        name: "Liverpool", country: "United Kingdom",
        lat: 53.4084, lon: -2.9916, timezone: "Europe/London",
        hero: "Liverpool weather, no excuses.",
        sub: "A city that knows its weather and gets on with it. Here's the honest forecast.",
        culture: "Liverpool's weather is shaped by its position on the Irish Sea coast — exposed to Atlantic fronts, frequently windy, and prone to the fast-moving weather systems that come off the water. The city doesn't let weather stop it; the Waterfront is used year-round, the Albert Dock is a sheltered space in most conditions, and the cultural calendar continues regardless. But outdoor events around the Pier Head need careful weather planning.",
        bestTime: "June to August for the best conditions. September often delivers an Indian summer that Liverpudlians make the most of.",
        weatherNote: "Wind off the Mersey is the thing to dress for, not just the temperature. A 12° Liverpool day with a strong westerly is more like 7°.",
        tip: "The Mersey in early morning with clear skies and low light is one of the underrated views in the UK. Worth checking the forecast for those perfect conditions.",
    },
    newcastle: {
        name: "Newcastle", country: "United Kingdom",
        lat: 54.9783, lon: -1.6178, timezone: "Europe/London",
        hero: "Newcastle weather, honest as the Toon.",
        sub: "Northeast England weather is serious weather. Here's what to actually expect.",
        culture: "Newcastle has a climate shaped by its position on the northeast coast — exposed to North Sea cold in winter, prone to the haar sea fog in summer, and sitting in the relatively dry rain shadow of the Pennines. The city has a famously resilient attitude to weather; the legendary sight of locals in T-shirts on a 10° Friday night is not a myth, it's a cultural statement. The Quayside and the bridges demand outdoor appreciation regardless of conditions.",
        bestTime: "July and August for the best warmth. The northeast coast in summer — Holy Island, the Northumberland beaches — is spectacular.",
        weatherNote: "North Sea haar can make summer mornings grey and cold even when the rest of the country is warm. It usually clears by midday but not always.",
        tip: "Newcastle at its best is a warm summer evening on the Quayside, the Tyne Bridge lit up, the city in full flow. Worth waiting for those conditions.",
    },
    sheffield: {
        name: "Sheffield", country: "United Kingdom",
        lat: 53.3811, lon: -1.4701, timezone: "Europe/London",
        hero: "Sheffield weather, steel city straight.",
        sub: "Sitting on the edge of the Peak District, Sheffield's weather is its own thing.",
        culture: "Sheffield has a split weather personality — the city itself is relatively sheltered, but the hills of the Peak District to its west catch cloud and rain that can make conditions very different within 10 miles. The city's outdoor culture is unusually strong for a UK city of its size; the proximity to the Peaks means weather genuinely determines weekend plans for most Sheffielders.",
        bestTime: "May to September. The Peak District trails are extraordinary in good summer weather.",
        weatherNote: "Weather on the moors above Sheffield can be dramatically different from the city below. Check Peak District conditions specifically if you're heading out of town.",
        tip: "Sheffield to the Peak District on a clear day is one of the great accessible outdoor experiences in England. Pick the right day and it's worth every minute.",
    },
    cardiff: {
        name: "Cardiff", country: "United Kingdom",
        lat: 51.4816, lon: -3.1791, timezone: "Europe/London",
        hero: "Cardiff weather, genuinely honest.",
        sub: "Wales's capital has weather the rugby crowd knows well. Here's the real forecast.",
        culture: "Cardiff is one of the rainier UK capitals — exposed to Atlantic fronts that come in off the Bristol Channel and dump on the Welsh valleys. But the city also gets warm, clear spells in summer that the Bute Park, the Bay, and the castle grounds reward with genuine quality. Cardiff weather is variable in the proper sense — four seasons that actually behave seasonally, with transitions that can be dramatic.",
        bestTime: "June to August for the best outdoor conditions. The Bay and the castle in summer are genuinely lovely.",
        weatherNote: "Atlantic fronts can arrive fast and with significant rainfall. Cardiff gets wetter than its southerly position suggests.",
        tip: "Cardiff Bay on a clear evening, the Millennium Centre lit up and the water calm, is one of the nicer urban views in the UK. Worth timing a visit around good forecast.",
    },
    brighton: {
        name: "Brighton", country: "United Kingdom",
        lat: 50.8229, lon: -0.1363, timezone: "Europe/London",
        hero: "Brighton weather, sea breeze included.",
        sub: "England's most weather-dependent city. Here's what the Channel is doing.",
        culture: "Brighton's entire identity is built around the sea and the beach — which makes the weather the most important piece of information anyone can have before visiting or planning their day. The city gets the benefit of the coast: milder winters, warmer summers, and the constant possibility of a sea breeze cooling a hot day or sharpening a cold one. The seafront is one of the UK's great outdoor spaces when conditions cooperate.",
        bestTime: "May to September. Brighton in early summer before the school holidays — warm, not too crowded, the Lanes quiet enough to enjoy.",
        weatherNote: "The Channel wind can make seemingly mild days feel significantly colder on the seafront. Check the wind speed, not just the temperature.",
        tip: "Brighton at sunrise on a clear morning — the pier, the waves, the light on the pebbles — is one of the underrated urban experiences in England. Free, early, and entirely weather-dependent.",
    },

    // ── TURKISH HOLIDAY RESORTS ─────────────────────────────────
    antalya: {
        name: "Antalya", country: "Turkey",
        lat: 36.8969, lon: 30.7133, timezone: "Europe/Istanbul",
        hero: "Antalya weather, Turkish Riviera honest.",
        sub: "The Mediterranean coast of Turkey does summer properly. Here's what to expect.",
        culture: "Antalya is the gateway to the Turkish Riviera and has one of the most reliable summer climates in the Mediterranean. From May through October the sky is almost always blue, the temperatures are hot, and the sea is warm enough to swim comfortably. The old city — Kaleci — is best explored in the early morning before the heat peaks. The waterfalls, the ruins at Perge and Aspendos, the boat trips — all require heat management between June and August.",
        bestTime: "May, June, September and October. The shoulder months offer the same blue sky with less intense heat and fewer crowds.",
        weatherNote: "July and August regularly hit 38-40°. The heat peaks around 2pm and can be genuinely difficult for sightseeing. Early morning and evening are the only comfortable windows.",
        tip: "Antalya in May is the best version of itself — the ruins are quiet, the sea is warm enough, the heat is manageable, and the old city is genuinely beautiful without the August crowds.",
    },
    bodrum: {
        name: "Bodrum", country: "Turkey",
        lat: 37.0344, lon: 27.4305, timezone: "Europe/Istanbul",
        hero: "Bodrum weather, Aegean Coast straight.",
        sub: "Turkey's most glamorous resort has weather to match. Most of the time.",
        culture: "Bodrum sits at the end of a peninsula on the Aegean coast and has a slightly more variable climate than Antalya — the Aegean wind (the meltemi) arrives in summer and can cool things down significantly, which is either a blessing or a nuisance depending on your plans. The castle, the marina, the nightlife, and the boat trips to nearby bays all make weather the central planning factor for any Bodrum day.",
        bestTime: "May, June and September. The meltemi is less fierce in these months and the heat is more manageable.",
        weatherNote: "The meltemi wind arrives from the north in July and August and can reach 40-50mph on exposed coasts. Sailing and beach days can be disrupted. Check wind forecasts specifically.",
        tip: "Bodrum at sunset from the castle — the marina below, the Greek island of Kos visible across the water — is one of the great Mediterranean views. Time it around clear conditions.",
    },

    // ── SPANISH ISLANDS ─────────────────────────────────────────
    tenerife: {
        name: "Tenerife", country: "Spain",
        lat: 28.2916, lon: -16.6291, timezone: "Atlantic/Canary",
        hero: "Tenerife weather, Canary Islands honest.",
        sub: "Europe's most popular winter sun destination. Here's what the forecast actually means.",
        culture: "Tenerife has two weather personalities divided by Mount Teide. The south — where most resorts are — is almost always sunny, dry, and warm year-round. The north is greener, cloudier, and gets far more rain. The cloud that sits around Teide's mid-slopes is a permanent feature that creates this divide. In summer the Calima — hot dusty air blown from the Sahara — can arrive and turn the sky orange and the air hazy for days.",
        bestTime: "Year-round in the south. November to March for the south when the rest of Europe is cold. June–August for the best beach conditions.",
        weatherNote: "The Calima can arrive with little warning and make temperatures spike by 10°+ while reducing visibility. The south stays warm but can feel oppressive in Calima conditions.",
        tip: "Tenerife south in January — 22°, blue sky, the beach largely uncrowded — is genuinely one of Europe's great winter escapes. The forecast makes it possible to time it perfectly.",
    },
    lanzarote: {
        name: "Lanzarote", country: "Spain",
        lat: 28.9635, lon: -13.5477, timezone: "Atlantic/Canary",
        hero: "Lanzarote weather, volcanic island straight.",
        sub: "The most dramatic landscape in Europe's sun belt. Here's what the sky is doing.",
        culture: "Lanzarote is the driest of the Canary Islands — its volcanic landscape gets very little rainfall, and the northeast trade winds keep temperatures consistently warm without becoming oppressive. The island has no high mountains to create weather divisions, so conditions are more uniform than Tenerife. The Timanfaya volcanic park, the white villages, and the César Manrique architecture are best experienced in the morning.",
        bestTime: "Year-round. Winter months offer the best escape from European cold. March–May before the summer heat peaks.",
        weatherNote: "Wind is Lanzarote's defining weather feature — the trade winds are almost constant and can be very strong in the north and east. Beach days can be disrupted by wind even in otherwise fine conditions.",
        tip: "Lanzarote's landscape at golden hour — the volcanic rock, the white villages, the Atlantic — is extraordinary. Plan outdoor photography around the late afternoon light.",
    },
    "gran-canaria": {
        name: "Gran Canaria", country: "Spain",
        lat: 27.9202, lon: -15.5474, timezone: "Atlantic/Canary",
        hero: "Gran Canaria weather, miniature continent honest.",
        sub: "Gran Canaria has thirteen different microclimates. Here's the one that matters for where you are.",
        culture: "Gran Canaria is called 'a miniature continent' for good reason — the north is lush and green with frequent cloud and rain, the south is arid and permanently sunny, and the interior mountains create dramatic weather transitions within miles. Maspalomas in the south is one of the most reliably sunny places in Europe. Las Palmas in the north is considerably cloudier. The dunes at Maspalomas and the old town at Las Palmas are the two poles of any visit.",
        bestTime: "Year-round in the south. November to March for the most reliable sun in the south when the north is greener and cloudier.",
        weatherNote: "The cloud that sits over the central mountains is a permanent feature — it creates the green north and the dry south. If your resort is in the south, northern conditions are irrelevant.",
        tip: "The Maspalomas dunes at sunrise — the light on the sand, the silence, the Atlantic beyond — are one of Europe's genuinely extraordinary natural experiences. Worth an early alarm.",
    },
    fuerteventura: {
        name: "Fuerteventura", country: "Spain",
        lat: 28.3587, lon: -14.0537, timezone: "Atlantic/Canary",
        hero: "Fuerteventura weather, windsurfer's paradise straight.",
        sub: "The second largest Canary Island. The windiest. The most honest forecast.",
        culture: "Fuerteventura is the flattest and windiest of the Canary Islands — a fact that makes it the world capital of windsurfing and kitesurfing, and a potential frustration for anyone expecting a calm beach holiday. The wind is almost constant, particularly in the north, and can be strong enough to close certain beaches. The compensation is that the wind keeps temperatures from becoming oppressive even in summer, and the endless beaches and clear water are genuinely spectacular.",
        bestTime: "November to May for lower wind. March–May for warmth without summer heat.",
        weatherNote: "Wind is the dominant weather variable on Fuerteventura. The north gets the strongest winds; the Jandia peninsula in the south is the most sheltered. Check wind forecasts specifically before planning beach days.",
        tip: "Corralejo dunes in low light — the wind-shaped sand, the blue Atlantic, the silence — is one of the Canary Islands' great landscapes. Pick a calm morning.",
    },
    ibiza: {
        name: "Ibiza", country: "Spain",
        lat: 38.9067, lon: 1.4206, timezone: "Europe/Madrid",
        hero: "Ibiza weather, honest forecast for the island.",
        sub: "Beyond the clubs and the beaches, Ibiza has weather worth understanding.",
        culture: "Ibiza has a classic Mediterranean climate — hot, dry summers and mild winters. The season runs hard from June through September, when the island is at maximum intensity on every level. The weather cooperates completely: reliably hot and sunny, with the sea warm and the evenings soft. Spring and autumn are the island's best-kept secret — warm, clear, uncrowded, with the beach and the countryside genuinely accessible.",
        bestTime: "May–June and September–October. Warm, clear, and a fraction of the August intensity.",
        weatherNote: "Summer storms can arrive fast from the sea in July and August — brief but dramatic. Evening outdoor plans can sometimes need adjusting at short notice.",
        tip: "Ibiza in May — the island before the season, the beaches empty, the interior roads quiet, the Es Vedra rock at sunset — is the island at its most beautiful and least crowded.",
    },
    mallorca: {
        name: "Mallorca", country: "Spain",
        lat: 39.6953, lon: 3.0176, timezone: "Europe/Madrid",
        hero: "Mallorca weather, Balearic Islands honest.",
        sub: "The most popular island in the Mediterranean deserves an honest forecast.",
        culture: "Mallorca's weather varies more than most visitors expect. The Tramuntana mountains in the northwest create a wetter, cooler microclimate very different from the sunny south and east coasts. The island gets four genuine seasons — something often missed by visitors who come only in summer. Palma is warmer and drier than the mountains. The northeast coast gets more wind. The south is the most reliably warm.",
        bestTime: "May–June and September–October. Warm, clear, dramatically fewer crowds than July–August.",
        weatherNote: "The Tramuntana gets significantly more rainfall and is considerably cooler than the coast. If you're visiting the mountains, prepare for different conditions.",
        tip: "Mallorca's Serra de Tramuntana in spring — the almond blossom has gone but the landscape is green and the roads empty — is one of the Mediterranean's great drives.",
    },
    menorca: {
        name: "Menorca", country: "Spain",
        lat: 39.9496, lon: 4.1187, timezone: "Europe/Madrid",
        hero: "Menorca weather, quieter island honest.",
        sub: "The most underrated Balearic Island has weather worth checking carefully.",
        culture: "Menorca is the most exposed of the Balearics to wind — the tramontana wind from the north can be fierce and is the defining weather feature of the island. The island's unspoilt landscape, prehistoric sites, and extraordinary beaches make it worth every visit, but the wind factor means beach days need more planning than on Mallorca or Ibiza.",
        bestTime: "May–June and September. The tramontana is less severe and the crowds minimal.",
        weatherNote: "The tramontana wind arrives from the north with little warning and can be very strong. North-facing beaches are exposed; south-facing beaches are more sheltered.",
        tip: "Menorca's prehistoric taula and talayot sites in the early morning — the island quiet, the light low, the landscape unchanged in three thousand years — are genuinely extraordinary.",
    },
    marbella: {
        name: "Marbella", country: "Spain",
        lat: 36.5101, lon: -4.8824, timezone: "Europe/Madrid",
        hero: "Marbella weather, Costa del Sol straight.",
        sub: "The sunniest stretch of mainland Europe. Here's the honest forecast.",
        culture: "Marbella and the Costa del Sol enjoy one of the best climates in continental Europe — an average of 320 sunny days per year, warm winters, and hot summers that are made bearable by the evening levante or poniente winds off the sea. The Old Town, Puerto Banus, and the beach strip all operate outdoors year-round in a way that no northern European city can match.",
        bestTime: "Year-round. October to May for mild, uncrowded conditions. June and September for the best beach weather without peak July–August heat.",
        weatherNote: "July and August can reach 38–40° inland. The sea breeze on the coast keeps temperatures manageable, but inland areas like Ronda can be significantly hotter.",
        tip: "Marbella old town in winter — 18°, empty streets, the mountain backdrop, lunch outside in December — is one of Europe's most underrated off-season experiences.",
    },

    // ── GREEK ISLANDS & MEDITERRANEAN ──────────────────────────
    mykonos: {
        name: "Mykonos", country: "Greece",
        lat: 37.4467, lon: 25.3289, timezone: "Europe/Athens",
        hero: "Mykonos weather, Cyclades honest.",
        sub: "The most famous Greek island. The meltemi wind changes everything. Here's the truth.",
        culture: "Mykonos is famous for its white buildings, blue domes, and party culture — but the meltemi wind is the weather feature that defines every day from July through August. The meltemi arrives from the north each afternoon and can reach gale force, making certain beaches unusable, certain boat trips impossible, and outdoor dining a challenge. The island is still beautiful — the light, the architecture, the food — but the wind is the variable that turns a good day into a great one or a difficult one.",
        bestTime: "June and September. The meltemi is weaker and the island is less crowded.",
        weatherNote: "The meltemi is at its strongest in July and August — typically arriving by noon and building through the afternoon. South-facing beaches are most sheltered.",
        tip: "Mykonos at dawn, before the meltemi arrives and before the crowds wake up, is a different island entirely. The light on the windmills and the pelicans at the port are worth an early morning.",
    },
    santorini: {
        name: "Santorini", country: "Greece",
        lat: 36.3932, lon: 25.4615, timezone: "Europe/Athens",
        hero: "Santorini weather, caldera view honest.",
        sub: "The most photographed view in the Mediterranean. Here's when the sky is actually clear.",
        culture: "Santorini's cliff-top villages, submerged caldera, and white and blue architecture are at their most extraordinary in clear conditions — which is most of the time from May through October. The island is exposed to the same meltemi winds as Mykonos but is slightly more sheltered by its volcanic geography. The caldera sunsets from Oia are genuinely spectacular but heavily crowded; arriving for sunrise is the more rewarding alternative.",
        bestTime: "May–June and September–October. Warm, clear, and the sunset crowds at Oia are significantly thinner.",
        weatherNote: "The meltemi affects Santorini less severely than more exposed Cyclades islands but can still disrupt boat trips to the volcanic islands and make some cliffside areas uncomfortable.",
        tip: "Santorini at sunrise in September, the caldera turning gold, the cruise ships not yet arrived, the village quiet — this is what the island actually is when you strip away the crowds.",
    },
    crete: {
        name: "Crete", country: "Greece",
        lat: 35.2401, lon: 24.8093, timezone: "Europe/Athens",
        hero: "Crete weather, largest Greek island straight.",
        sub: "Greece's biggest island has weather that varies more than most visitors expect.",
        culture: "Crete is large enough to have genuinely different weather across its length and breadth. The north coast — where most resorts are — is drier and sunnier. The south coast is more rugged and exposed. The Samaria Gorge and the White Mountains in the interior have their own dramatic microclimate. The island's history, food culture, and landscape make it one of the most rewarding destinations in the Mediterranean — and the long season from April through October makes it genuinely accessible.",
        bestTime: "May–June and September–October. The heat of July–August is manageable but intense.",
        weatherNote: "July and August in the interior can be very hot. The north coast has a reliable breeze. The Samaria Gorge is best walked in May–June before the heat peaks.",
        tip: "Crete's south coast in May — the beaches empty, the sea warming, the wildflowers still out — is one of the Greek islands' genuine secrets.",
    },
    rhodes: {
        name: "Rhodes", country: "Greece",
        lat: 36.4341, lon: 28.2176, timezone: "Europe/Athens",
        hero: "Rhodes weather, island of the sun honest.",
        sub: "Greece's most reliably sunny island. Here's what the forecast actually says.",
        culture: "Rhodes holds the record for the most sunshine hours in Europe — the island's southeastern position gives it a longer season and more reliable sun than the northern Cyclades. The medieval Old Town is a UNESCO World Heritage Site best explored in the early morning. Lindos, the ancient acropolis and beach village, needs an early start in summer before the heat makes the climb to the citadel inadvisable.",
        bestTime: "May–June and September–October. June in particular offers the most reliable combination of warmth and manageable crowds.",
        weatherNote: "The meltemi arrives in Rhodes in July and August but is generally less severe than in the Cyclades. The interior can be significantly hotter than the coast.",
        tip: "Lindos beach at 8am in September — the acropolis above, the water extraordinarily clear, the village not yet awake — is one of the great uncrowded Mediterranean mornings.",
    },
    corfu: {
        name: "Corfu", country: "Greece",
        lat: 39.6243, lon: 19.9217, timezone: "Europe/Athens",
        hero: "Corfu weather, Ionian island honest.",
        sub: "The greenest Greek island — and the reason why. Here's the real forecast.",
        culture: "Corfu is the greenest Greek island because it's the wettest — the Ionian islands receive considerably more rainfall than the Aegean. But the season from May through October is reliably warm and mostly dry, and the island's lush landscape is the direct result of that off-season rain. The Old Town, the cricket ground, the olive groves, and the clear bays of the northeast coast are genuinely beautiful in good conditions.",
        bestTime: "June to September. The shoulder months are less reliably dry than the Aegean islands.",
        weatherNote: "Spring can be genuinely wet in Corfu — the greenness has to come from somewhere. The season gets reliably drier from June onwards.",
        tip: "Corfu Old Town in early June — the Venetian architecture, the cricket, the narrow streets, the light — before the summer crowds arrive is genuinely lovely.",
    },
    zante: {
        name: "Zante", country: "Greece",
        lat: 37.7902, lon: 20.8955, timezone: "Europe/Athens",
        hero: "Zante weather, Zakynthos honest.",
        sub: "The Ionian island with the most famous shipwreck. Here's what the sky's doing.",
        culture: "Zante (Zakynthos) is famous for Navagio Beach and the Blue Caves on the north coast — both accessible only by boat and both entirely weather-dependent. The island has a similar climate to Corfu: warm and reliable in summer, greener and wetter than the Aegean. The sea turtle nesting beaches in the south mean some areas are protected at night.",
        bestTime: "June to September. The boat trips to Navagio need calm sea conditions.",
        weatherNote: "Navagio Beach is accessible only by boat — rough sea conditions cancel trips. The north coast is more exposed to wind than the east and south.",
        tip: "Navagio Beach in morning light, the famous shipwreck on white sand, the cliff walls surrounding it — is best seen early before the tourist boats arrive in volume.",
    },
    cyprus: {
        name: "Cyprus", country: "Cyprus",
        lat: 35.1264, lon: 33.4299, timezone: "Asia/Nicosia",
        hero: "Cyprus weather, Mediterranean island straight.",
        sub: "The third largest Mediterranean island has weather that earns its sun reputation.",
        culture: "Cyprus has one of the longest summer seasons in the Mediterranean — the hot, dry weather runs from May through October with barely a cloud in the sky. Winters are genuinely mild in the coastal areas but the Troodos Mountains get significant snowfall. The island's history — Greek, Turkish, British, and Byzantine — is best explored in spring and autumn when the heat is manageable.",
        bestTime: "April–May and October–November. Warm, clear, uncrowded. The mountains are snow-free but still striking.",
        weatherNote: "July and August can exceed 40° inland. The coastal breeze helps on the coast but Nicosia, in the centre, is one of the hottest capitals in Europe in summer.",
        tip: "Cyprus in April — the wildflowers, the Aphrodite Hills, the Akamas peninsula green, the sea warming — before the summer crowd arrives is genuinely excellent.",
    },
    malta: {
        name: "Malta", country: "Malta",
        lat: 35.9375, lon: 14.3754, timezone: "Europe/Malta",
        hero: "Malta weather, limestone island honest.",
        sub: "The smallest EU country has big weather. Here's the honest guide.",
        culture: "Malta sits at the centre of the Mediterranean and has a climate to match — very hot summers, mild winters, and a sea that stays swimmable from May through November. The island is almost treeless, which means there's little shade anywhere and the limestone reflects heat back relentlessly in summer. Valletta, the prehistoric temples, and the Three Cities are best explored in spring and autumn when the heat is manageable.",
        bestTime: "April–May and October. Warm, clear, and the archaeological sites are comfortable to explore.",
        weatherNote: "July and August in Malta are genuinely intense — 35°+ with high humidity and very little natural shade. The sea is warm enough but the midday heat onshore is serious.",
        tip: "Valletta in April — the baroque architecture golden in morning light, the Grand Harbour still and blue below — is one of Europe's most underrated small capital experiences.",
    },

    // ── EUROPEAN CITY BREAKS ────────────────────────────────────
    amsterdam: {
        name: "Amsterdam", country: "Netherlands",
        lat: 52.3676, lon: 4.9041, timezone: "Europe/Amsterdam",
        hero: "Amsterdam weather, Dutch honesty.",
        sub: "A city built on water surrounded by water. The forecast matters more here than most places.",
        culture: "Amsterdam's weather is characterised by changeability — the flat Dutch landscape and proximity to the North Sea means fronts move through fast and forecasts can be wrong within an hour. The famous Dutch love of cycling continues regardless of conditions; locals treat rain as a logistical fact rather than a reason to stay home. The canal houses, the Jordaan, the Rijksmuseum, and the parks are all weather-dependent in different ways.",
        bestTime: "April–May for tulip season and manageable crowds. June–August for the best weather.",
        weatherNote: "Wind off the North Sea makes Amsterdam colder than the temperature suggests. The flat landscape provides no shelter. Cycling in rain is an Amsterdam rite of passage.",
        tip: "Amsterdam on a crisp autumn morning — the canal reflections, the golden light on the gables, the city not yet fully awake — is the city at its most beautiful.",
    },
    berlin: {
        name: "Berlin", country: "Germany",
        lat: 52.5200, lon: 13.4050, timezone: "Europe/Berlin",
        hero: "Berlin weather, capital city honest.",
        sub: "Continental European weather at its most genuine. No coastal softening here.",
        culture: "Berlin has a true continental climate — winters that take themselves seriously, summers that can be genuinely hot and occasionally stormy, and spring and autumn that are the city's best-kept secrets. The flat Berlin landscape and inland position mean cold arrives with conviction in winter and heat builds in summer. The city's outdoor culture — the lake districts, the parks, the outdoor bars — is built around maximising the good weather when it comes.",
        bestTime: "May–June and September–October. Warm, culturally active, and without summer crowds.",
        weatherNote: "Berlin summer afternoons can bring serious thunderstorms. July and August storms can be dramatic — check the afternoon forecast if outdoor plans are important.",
        tip: "Berlin in late May — the Tiergarten green, the lakes open, the outdoor bars beginning, the city before the summer rush — is one of Europe's genuinely excellent city break moments.",
    },
    munich: {
        name: "Munich", country: "Germany",
        lat: 48.1351, lon: 11.5820, timezone: "Europe/Berlin",
        hero: "Munich weather, Bavarian Alps honest.",
        sub: "Alpine proximity means Munich weather is never entirely predictable. Here's what's coming.",
        culture: "Munich's weather is influenced by its position at the foot of the Alps — the föhn wind from the south can bring sudden warmth and extraordinary clarity, making the Alps visible from the city. Summer storms are frequent and dramatic. Winters are cold and snowy but the city's beer gardens remarkably empty only when it's truly freezing. Oktoberfest in late September and early October brings the most weather variability of the year.",
        bestTime: "May–June and September. The föhn-cleared days in autumn are among the most spectacular in Europe.",
        weatherNote: "The föhn wind creates rapid temperature changes and can clear the air to extraordinary Alpine visibility — but it also causes headaches for some people. The rapid pressure changes are noticeable.",
        tip: "Munich on a föhn day — the Alps suddenly visible from the English Garden, the air sharp and clean, the city energised — is a genuinely remarkable experience that locals treasure.",
    },
    vienna: {
        name: "Vienna", country: "Austria",
        lat: 48.2082, lon: 16.3738, timezone: "Europe/Vienna",
        hero: "Vienna weather, imperial city honest.",
        sub: "The most central European of European cities has weather that means it.",
        culture: "Vienna has a continental climate with a slight softening from the Pannonian Plain to the east — cold, clear winters with regular snowfall, warm summers that can be hot, and superb spring and autumn. The city's outdoor culture — the Prater, the Heurigen wine gardens, the Naschmarkt — is calibrated around the good months. The Christmas markets transform the cold into an asset.",
        bestTime: "May and September. Warm, uncrowded, and the city at its most elegant.",
        weatherNote: "Vienna summer afternoons can bring serious storms — July and August have the most thunderstorm risk. The Danube can flood in heavy spring rain.",
        tip: "Vienna in early May — the Prater green, the Heurigen not yet crowded, the city between winter and summer — is one of Europe's genuinely great city break moments.",
    },
    prague: {
        name: "Prague", country: "Czech Republic",
        lat: 50.0755, lon: 14.4378, timezone: "Europe/Prague",
        hero: "Prague weather, city of spires honest.",
        sub: "Central European weather with no oceanic softening. Here's the genuine forecast.",
        culture: "Prague has a textbook central European continental climate — cold winters that make the Christmas markets magical, hot summers that make the crowds on Charles Bridge overwhelming, and spring and autumn that are the city's genuine best seasons. The Old Town, the Castle district, and the river are at their most photogenic in early morning in any season.",
        bestTime: "May and September–October. The city is beautiful, the weather cooperative, and the tourist crush manageable.",
        weatherNote: "July and August bring both the most heat and the most tourists. The Old Town can feel genuinely claustrophobic. Early morning is the only way to see it properly.",
        tip: "Charles Bridge at 6am in October — the mist off the Vltava, the statues emerging from the fog, the city quiet — is one of Europe's great early morning experiences.",
    },
    lisbon: {
        name: "Lisbon", country: "Portugal",
        lat: 38.7223, lon: -9.1393, timezone: "Europe/Lisbon",
        hero: "Lisbon weather, Atlantic city honest.",
        sub: "Europe's sunniest capital has weather that lives up to its reputation. Here's the truth.",
        culture: "Lisbon has one of the best climates of any European capital — warm, sunny summers tempered by Atlantic breezes, mild winters, and spring and autumn that are genuinely lovely. The city's position on the Atlantic coast means there's always a breeze, which keeps summer temperatures comfortable in a way that inland Spanish cities cannot match. The trams, the miradouros, the Alfama and Belém — all reward visits in virtually any conditions.",
        bestTime: "April–June and September–October. Warm, clear, and the city is less crowded than in high summer.",
        weatherNote: "The Atlantic wind can make Lisbon feel cooler than the temperature suggests — the ocean-facing areas like Cascais and Sintra can be significantly windier and cooler than the city centre.",
        tip: "Lisbon at sunset from the Miradouro das Portas do Sol — the terracotta roofs, the Tagus beyond, the light — is one of Europe's great urban views. Worth timing to clear conditions.",
    },
    porto: {
        name: "Porto", country: "Portugal",
        lat: 41.1579, lon: -8.6291, timezone: "Europe/Lisbon",
        hero: "Porto weather, city of wine and rain honest.",
        sub: "Portugal's second city gets more rain than Lisbon. Here's the honest forecast.",
        culture: "Porto has a wetter and cooler climate than Lisbon — its position further north and closer to the Atlantic means more rainfall and less of the Mediterranean softness that Lisbon enjoys. But the city is genuinely beautiful in the rain, and the wine cellars of Vila Nova de Gaia and the riverside Ribeira district have a particular atmosphere in overcast conditions. The Douro Valley to the east has its own climate, drier and hotter in summer.",
        bestTime: "May–June and September. Warm enough for the city, not so hot that the Atlantic beaches are overwhelming.",
        weatherNote: "Porto gets significant autumn and winter rainfall. Spring is the transition — warm days mixed with Atlantic fronts. June onwards is generally reliable.",
        tip: "Porto on a clear evening, the Douro running below the Dom Luis bridge, the port wine caves lit on the opposite bank — is one of the most atmospheric city views in Europe.",
    },
    rome: {
        name: "Rome", country: "Italy",
        lat: 41.9028, lon: 12.4964, timezone: "Europe/Rome",
        hero: "Rome weather, eternal city honest.",
        sub: "Two thousand years of history deserve an honest weather forecast.",
        culture: "Rome has a classic Mediterranean climate — hot, dry summers that bake the stone and fill the piazzas with tourists, mild winters, and spring and autumn that are the city's genuine best seasons. July and August in Rome are genuinely intense — the heat, the crowds, the queues for the Colosseum and the Vatican — make them the hardest months to enjoy the city. April–June and September–October are when Rome shows its best self.",
        bestTime: "April–May and October. The weather is excellent, the crowds manageable, and the light is extraordinary.",
        weatherNote: "July and August regularly exceed 35° and the humidity can be heavy. The city is at its most crowded. Early morning is the only way to see major sites without the queues.",
        tip: "The Pantheon at 8am in April — the oculus lit by the morning sun, the tourists not yet arrived — is one of Europe's genuinely great quiet moments. Worth the early alarm.",
    },
    florence: {
        name: "Florence", country: "Italy",
        lat: 43.7696, lon: 11.2558, timezone: "Europe/Rome",
        hero: "Florence weather, renaissance city honest.",
        sub: "The most beautiful city in Italy sits in a river valley that traps heat. Here's the truth.",
        culture: "Florence is one of the hottest cities in Europe in summer — the Arno valley traps heat and the surrounding hills prevent airflow. July and August temperatures regularly exceed 38° and the combination of heat, humidity, and tourist density makes the city almost unbearable for sightseeing in the middle of the day. Spring and autumn are transformative — the Uffizi, the Duomo, the Oltrarno at manageable temperatures is Florence at its greatest.",
        bestTime: "April–May and September–October. These are the months Florence was designed for.",
        weatherNote: "Florence summer heat is serious and amplified by the valley position. Air conditioning in museums is the only relief. October can bring significant rainfall from Arno valley storms.",
        tip: "The view from Piazzale Michelangelo at dawn in May — the Arno, the Duomo, the terracotta rooftops in morning light — is one of the defining European views.",
    },
    milan: {
        name: "Milan", country: "Italy",
        lat: 45.4642, lon: 9.1900, timezone: "Europe/Rome",
        hero: "Milan weather, fashion capital honest.",
        sub: "Northern Italy has weather that means business. Here's the real forecast.",
        culture: "Milan has a more continental climate than Rome or Florence — cold, foggy winters, hot and often stormy summers, and spring and autumn that are the city's best seasons. The Po Valley fog (nebbia) in November–February is a Milan signature — thick, cold, and disorientating. The city's fashion weeks in February/March and September/October bring the most intense visitor pressure at precisely the seasons when the weather is actually at its best.",
        bestTime: "April–May and September–October. The weather cooperates and the fashion crowd brings energy.",
        weatherNote: "Milan summer storms can be intense — afternoon thunderstorms in July and August are frequent and dramatic. The fog in November and December can be genuinely dense.",
        tip: "Milan in September during Fashion Week — the energy, the Navigli canals at dusk, the weather golden and warm — is the city at its most alive.",
    },
    copenhagen: {
        name: "Copenhagen", country: "Denmark",
        lat: 55.6761, lon: 12.5683, timezone: "Europe/Copenhagen",
        hero: "Copenhagen weather, Danish honesty.",
        sub: "Scandinavia's most liveable city in any weather. Here's what's coming.",
        culture: "Copenhagen has mastered the art of being excellent in all weathers — the cycling infrastructure, the covered food markets, the design of public spaces — all built around the assumption that weather will be variable and that's not a reason to stay home. Summers are genuinely lovely and long-lit. Winters are dark and cold but the city's hygge culture transforms this into warmth.",
        bestTime: "June–August for the long-lit Nordic summer. December for Christmas markets and hygge.",
        weatherNote: "The wind off the Oresund can make Copenhagen feel significantly colder than the temperature. The flat Danish landscape provides little shelter.",
        tip: "Copenhagen at midsummer — 10pm and still light, the canals busy, the Nyhavn waterfront golden — is one of the great Nordic summer experiences.",
    },
    stockholm: {
        name: "Stockholm", country: "Sweden",
        lat: 59.3293, lon: 18.0686, timezone: "Europe/Stockholm",
        hero: "Stockholm weather, Swedish honesty.",
        sub: "Built on 14 islands, Stockholm's weather comes from every direction.",
        culture: "Stockholm has a climate shaped by its archipelago position — the 30,000 islands to the east moderate temperatures but create complex, changeable conditions. Summers are beautiful and long-lit — genuinely warm from June through August. Winters are cold and dark with significant snowfall in good years. The city's design assumes outdoor living in summer; the archipelago kayak routes, the outdoor swimming, the island-hopping are all weather-dependent.",
        bestTime: "June–August. The midnight sun window is genuinely worth experiencing.",
        weatherNote: "Stockholm weather can change fast due to the archipelago position — sea breezes and lake effects create local variations. The summer evenings stay light until 10–11pm.",
        tip: "Stockholm in June, exploring the inner archipelago by ferry, the water still, the light extraordinary — is one of Scandinavia's great summer experiences.",
    },
    oslo: {
        name: "Oslo", country: "Norway",
        lat: 59.9139, lon: 10.7522, timezone: "Europe/Oslo",
        hero: "Oslo weather, fjord city honest.",
        sub: "Norway's capital sits at the end of a fjord. The weather arrives accordingly.",
        culture: "Oslo has a continental climate modified by the Oslofjord — cold winters with reliable snowfall, warm summers, and a spring and autumn that are the most dramatically changeable. The city is the gateway to the Norwegian outdoor experience — skiing in winter, hiking and fjord exploration in summer. Norwegians have an almost philosophical relationship with weather: there is no bad weather, only bad clothing.",
        bestTime: "June–August for warmth and the fjord experience. February for skiing with reliable snow.",
        weatherNote: "Oslo can get cold fast in autumn — temperatures drop significantly in October. The fjord creates its own weather patterns, with morning mist that can linger.",
        tip: "Oslo in June, a ferry out to the islands of the inner Oslofjord, swimming in the cold clear water, the city visible in the distance — is the Norwegian summer experience.",
    },

    // ── AMERICAS ─────────────────────────────────────────────────
    cancun: {
        name: "Cancun", country: "Mexico",
        lat: 21.1619, lon: -86.8515, timezone: "America/Cancun",
        hero: "Cancun weather, Caribbean Mexico honest.",
        sub: "The Caribbean coast of Mexico runs on its own weather logic. Here's the truth.",
        culture: "Cancun has a tropical climate with a dry season (December–April) and a wet season (May–November). The dry season is genuinely excellent — warm, sunny, the Caribbean turquoise and calm. The wet season brings daily afternoon showers that are usually brief but occasionally intense. Hurricane season (June–October) is the real weather variable — Cancun has been hit before and the risk is real.",
        bestTime: "December to April. The best beach conditions and lowest hurricane risk.",
        weatherNote: "Hurricane season runs June through November. Travel insurance and flexible bookings are essential if visiting in this window. September and October are the highest-risk months.",
        tip: "The cenotes near Chichen Itza in December — the light through the water, the warmth without the humidity — are best when the weather is at its most cooperative.",
    },

    // ── SOUTH AFRICA ────────────────────────────────────────────
    johannesburg: {
        name: "Johannesburg", country: "South Africa",
        lat: -26.2041, lon: 28.0473, timezone: "Africa/Johannesburg",
        hero: "Joburg weather, highveld honest.",
        sub: "The city of gold sits at 1,700 metres. The weather behaves accordingly.",
        culture: "Johannesburg has a highveld climate unlike anywhere else in Africa — the altitude means temperatures are more moderate than latitude suggests, the thunderstorms are among the most dramatic on earth, and winter nights can be genuinely cold despite the subtropical position. The afternoon electrical storms from October through March are a Joburg signature: intense, spectacular, and over in 30–60 minutes.",
        bestTime: "May to August — the dry season. Cold at night but beautifully clear and warm during the day.",
        weatherNote: "Summer afternoon thunderstorms can be violent — lightning strikes in Joburg are among the highest in the world. Get off golf courses and open ground immediately when storms build.",
        tip: "Joburg in July — the jacaranda season approaching, the winter clarity making the skyline sharp, the days warm and the nights cold — is the city at its most itself.",
    },

    // ── ASIA ────────────────────────────────────────────────────
    bali: {
        name: "Bali", country: "Indonesia",
        lat: -8.3405, lon: 115.0920, timezone: "Asia/Makassar",
        hero: "Bali weather, island of the gods honest.",
        sub: "Two very different seasons. Here's which one you're in.",
        culture: "Bali has a simple two-season calendar — dry season (May–October) and wet season (November–April). The dry season is the peak tourist season for good reason: the weather is reliably excellent, the rice terraces at their greenest, and outdoor activities from surfing to temple visits are all at their best. The wet season brings daily rain, often heavy, with spectacular tropical downpours that can flood roads but also create lush, dramatic landscapes.",
        bestTime: "May–October. June and July are the most reliable. Shoulder months either side are often good with fewer crowds.",
        weatherNote: "The wet season (November–April) brings daily rainfall that can be significant. Ubud in the interior gets more rain than the coast. Flash flooding on roads is possible.",
        tip: "Bali rice terraces at Tegalalang at 7am in July — the mist just clearing, the light green and gold, the farmers already at work — is the island at its most extraordinary.",
    },
    seoul: {
        name: "Seoul", country: "South Korea",
        lat: 37.5665, lon: 126.9780, timezone: "Asia/Seoul",
        hero: "Seoul weather, four seasons honest.",
        sub: "Korea takes its seasons seriously. Here's what you're actually in for.",
        culture: "Seoul has one of the most dramatic four-season climates in Asia — cold winters with significant snowfall, a hot and humid summer with a monsoon (jangma) in July–August, and the two extraordinary seasons that make the city genuinely worth visiting: spring cherry blossom and autumn foliage. Both last only 2–3 weeks and the whole city organises around them.",
        bestTime: "Late March–early April for cherry blossom. October–November for autumn foliage.",
        weatherNote: "The jangma monsoon in late June–July brings weeks of persistent rain and humidity. August is hot, humid, and storm-prone. Winter cold can be severe with wind chill.",
        tip: "Seoul in late October — the Bukhansan mountain above the city in full autumn colour, the hiking trails busy, the air finally cool — is one of Asia's great seasonal experiences.",
    },
    "ho-chi-minh": {
        name: "Ho Chi Minh City", country: "Vietnam",
        lat: 10.8231, lon: 106.6297, timezone: "Asia/Ho_Chi_Minh",
        hero: "Ho Chi Minh City weather, Saigon straight.",
        sub: "Tropical wet and dry. Here's which you're getting.",
        culture: "Ho Chi Minh City has a classic tropical climate with two distinct seasons: dry (November–April) and wet (May–October). The dry season is when the city is most accessible — warm, sunny, manageable. The wet season brings intense afternoon downpours, flooded streets, and significantly higher humidity. The Cu Chi Tunnels, the Reunification Palace, and the Ben Thanh market all work in any weather — the city never stops.",
        bestTime: "December to March. The dry season at its most comfortable.",
        weatherNote: "Wet season flooding in Ho Chi Minh City can be serious — major streets can become impassable within minutes of heavy rain. The flooding has been getting worse each year.",
        tip: "The Saigon River at dawn in January — the city waking up, the water quiet, the colonial buildings catching first light — is the city before the heat and the traffic.",
    },
    hanoi: {
        name: "Hanoi", country: "Vietnam",
        lat: 21.0285, lon: 105.8542, timezone: "Asia/Bangkok",
        hero: "Hanoi weather, northern Vietnam honest.",
        sub: "Hanoi has four seasons. Most visitors don't know this. Here's the truth.",
        culture: "Hanoi has a more varied climate than Ho Chi Minh City — it actually has four seasons, including a genuine winter that sees temperatures below 15° from December through February. The Old Quarter, Hoan Kiem Lake, and the Temple of Literature all have different characters in different weather. Spring (February–April) brings the nong heat — warm and humid with drizzle. Summer monsoon (May–August) brings heavy rain. Autumn (September–November) is the best season.",
        bestTime: "September–November. Cool enough to walk comfortably, clear enough to appreciate the architecture.",
        weatherNote: "Hanoi winter (December–February) is genuinely cool and occasionally cold — below 10° is possible. Summer flooding can disrupt transport in the old streets.",
        tip: "Hanoi in October — the trees turning, the lake reflections clear, the traffic noise the only constant — is the city at its most complete.",
    },
    "sydney": {
        name: "Sydney", country: "Australia",
        lat: -33.8688, lon: 151.2093, timezone: "Australia/Sydney",
        hero: "Sydney weather, harbour city honest.",
        sub: "The world's most beautiful harbour has weather that lives up to its setting. Here's the truth.",
        culture: "Sydney has a temperate oceanic climate that is genuinely excellent for most of the year — warm, mostly sunny summers tempered by sea breezes, mild winters that rarely get cold enough to genuinely inconvenience, and a spring and autumn that make the outdoor lifestyle possible year-round. The harbour, the coastal walks, the beaches from Bondi to Manly — all calibrated around the expectation of good weather that Sydney usually delivers.",
        bestTime: "October to April for beach conditions. September–October and March–April for the most comfortable temperatures.",
        weatherNote: "Summer heat in inland western suburbs can exceed 40° — the coast is significantly cooler. Bushfire smoke occasionally affects Sydney air quality in summer. Check AQI on extreme heat days.",
        tip: "The Bondi to Coogee coastal walk at 7am in October — the sandstone cliffs, the Pacific surge, the joggers, the city skyline behind — is Sydney as a complete idea.",
    },
    melbourne: {
        name: "Melbourne", country: "Australia",
        lat: -37.8136, lon: 144.9631, timezone: "Australia/Melbourne",
        hero: "Melbourne weather, four seasons in one day honest.",
        sub: "The saying is a cliché because it's accurate. Here's what's actually coming.",
        culture: "Melbourne's weather is genuinely unpredictable in a way that has shaped the city's character — the covered laneways, the indoor cafe culture, the rooftop bars with their flexible setups. The city sits in the path of cold Southern Ocean fronts and hot northerlies, and both can arrive in the same day. The famous cricket ground and outdoor events plan around the possibility of sudden change. Melburnians carry a jacket in February and sometimes need it.",
        bestTime: "November to March for the warmest and most reliably outdoor-friendly conditions. But 'reliable' is relative.",
        weatherNote: "The temperature can change by 15-20° in a day. A hot morning can become a cold afternoon when a cold front pushes through. The southerly buster change is dramatic and fast.",
        tip: "Melbourne on a clear autumn day in April — the Yarra River, the Botanic Gardens, the arts precinct, the city warm without the summer heat — is the city in its most liveable state.",
    },
    marrakech: {
        name: "Marrakech", country: "Morocco",
        lat: 31.6295, lon: -7.9811, timezone: "Africa/Casablanca",
        hero: "Marrakech weather, Red City honest.",
        sub: "The gateway to the Sahara has weather that earns its desert reputation.",
        culture: "Marrakech sits at the foot of the High Atlas and has a semi-arid climate — very hot and dry in summer, surprisingly cold at night in winter, and two brief spring and autumn seasons that are the city's best times to visit. The medina's narrow streets provide shade in summer and shelter in winter, but the Djemaa el-Fna square is entirely exposed. The High Atlas is visible from the city on clear days and snow-capped from October through April.",
        bestTime: "March–May and September–November. Warm days, cool nights, manageable crowds.",
        weatherNote: "July and August temperatures regularly exceed 40° in the medina. The narrow streets trap heat. Saharan dust can reduce visibility and increase temperatures further.",
        tip: "The Djemaa el-Fna at sunset in October — the storytellers, the food stalls lighting up, the Atlas visible beyond the city, the temperature finally dropping — is one of the world's great public squares at its most alive.",
    },

    // ── NEW CITIES: Europe ────────────────────────────────────────
    athens: {
        name: "Athens", country: "Greece",
        lat: 37.9838, lon: 23.7275, timezone: "Europe/Athens",
        hero: "Athens weather, honestly.",
        sub: "Ancient city, honest forecast. Here's what the sky is actually doing.",
        culture: "Athens is one of the sunniest capitals in Europe — over 300 days of sun annually. Summers are searingly hot and dry, with July and August regularly hitting 38°. The city adapts: everything slows from noon to 5pm, rooftop bars fill at dusk, locals eat dinner at 10pm when the heat finally breaks. Winters are mild and green by northern European standards.",
        bestTime: "April–June and September–October. Perfect temperatures, fewer tourists, the light extraordinary.",
        weatherNote: "Summer heatwaves in Athens are serious — the urban heat island effect makes the city significantly hotter than surrounding areas. Stay hydrated and plan midday activities indoors.",
        tip: "The Acropolis before 9am is both cooler and quieter. The combination makes it the best version of the visit.",
    },
    madrid: {
        name: "Madrid", country: "Spain",
        lat: 40.4168, lon: -3.7038, timezone: "Europe/Madrid",
        hero: "Madrid weather, no-nonsense.",
        sub: "Europe's highest capital has weather that means business.",
        culture: "Madrid sits on a high plateau at 667 metres — proper seasons in a way that coastal Spain doesn't. Summers are hot and dry, winters are genuinely cold, and the altitude keeps humidity low year-round. Late dinners mean avoiding the worst heat, thick coats appear in November without apology, and the city's indoor culture is among the best in Europe.",
        bestTime: "May and October. Warm enough for terraces, cool enough to walk anywhere.",
        weatherNote: "Madrid summer heat is dry rather than humid, which makes it more bearable than coastal cities. But 38° is still 38° — afternoon shade is not optional.",
        tip: "Madrid winter is underrated. Clear, cold, no tourists. The Prado on a January Tuesday is a different experience from August.",
    },
    venice: {
        name: "Venice", country: "Italy",
        lat: 45.4408, lon: 12.3155, timezone: "Europe/Rome",
        hero: "Venice weather, honestly.",
        sub: "The most dramatic city in the world deserves an honest forecast.",
        culture: "Venice weather is inseparable from the city's identity. Acqua alta — high water flooding that covers Piazza San Marco — happens when strong southerly winds push water up the Adriatic. Most common in November and December. Summer brings heat trapped in the narrow calli. Winter is cold, foggy, and the Venice that Venetians actually live in — extraordinary and almost empty.",
        bestTime: "October–November for autumn fog and atmosphere. April–May before the summer crowds arrive.",
        weatherNote: "Acqua alta can happen November through January — pack waterproof boots if visiting. Three siren tones give 90 minutes' notice.",
        tip: "Venice in fog is Venice at its most itself. The city was built on mystery. Acqua alta is an inconvenience but the atmosphere it creates is unrepeatable.",
    },
    naples: {
        name: "Naples", country: "Italy",
        lat: 40.8518, lon: 14.2681, timezone: "Europe/Rome",
        hero: "Naples weather, straight.",
        sub: "Volcanic city, honest forecast. Here's what the sky is doing.",
        culture: "Naples has the best weather in mainland Italy — warm, sunny, sheltered by the bay with mild winters. The city lives outside: coffee at the bar, lunch on the terrace, dinner in the street. The proximity to Vesuvius creates its own microclimate — the volcano is often in cloud when the city is clear.",
        bestTime: "May–June and September–October. Perfect temperatures for the city and the Amalfi coast.",
        weatherNote: "Summer heat in Naples is serious — July and August particularly. The city is best explored before noon and after 5pm in peak summer.",
        tip: "Naples in November is one of Italy's best-kept secrets. Mild, golden, quiet, and the pizza is still the best in the world.",
    },
    dubrovnik: {
        name: "Dubrovnik", country: "Croatia",
        lat: 42.6507, lon: 18.0944, timezone: "Europe/Zagreb",
        hero: "Dubrovnik weather, honestly.",
        sub: "The Adriatic's most beautiful city. Here's the honest forecast.",
        culture: "Dubrovnik gets more sun than almost anywhere in Europe — over 2,700 hours annually. Summers are hot, dry and packed with tourists. The shoulder seasons are when the city reveals itself: spring wildflowers on the karst, autumn light on the limestone walls, the Adriatic still warm enough to swim in October. The bura wind in winter is cold and fierce.",
        bestTime: "May–June and September–October. Warm sea, manageable crowds, extraordinary light.",
        weatherNote: "July and August in Dubrovnik are genuinely intense — heat, crowds and cruise ships peak simultaneously. The walls walk is best before 9am.",
        tip: "The Adriatic in late September. The tourists have left, the water is still 24°, and the light turns the limestone walls gold.",
    },
    seville: {
        name: "Seville", country: "Spain",
        lat: 37.3891, lon: -5.9845, timezone: "Europe/Madrid",
        hero: "Seville weather, honestly.",
        sub: "The hottest city in Europe. Here's the honest guide.",
        culture: "Seville holds the European record for highest summer temperatures — 47° has been officially recorded. The city is built around this reality: everything happens in the morning and evening, the siesta is not optional, the streets are shadowed by design. In winter, Seville is mild and beautiful — arguably the best weather in mainland Europe November to March.",
        bestTime: "March–May and October–November. Warm but manageable, the city at its most social.",
        weatherNote: "June through September in Seville is extreme — regularly above 40°. Outdoor activity should be limited to before 10am and after 7pm.",
        tip: "Seville in April during Semana Santa and Feria is extraordinary — and the weather is usually perfect. Book everything months in advance.",
    },
    zurich: {
        name: "Zurich", country: "Switzerland",
        lat: 47.3769, lon: 8.5417, timezone: "Europe/Zurich",
        hero: "Zurich weather, honestly.",
        sub: "Alpine city, plain language. Here's the real forecast.",
        culture: "Zurich sits at the northern edge of the Alps — unpredictable, often grey, capable of delivering snow in April and thunderstorms in July. The Föhn arrives several times a year, turning the city golden with the Alps sharply visible. Summer is short but genuinely warm. Winter is cold but well-managed — the Swiss relationship with winter is one of the most competent in the world.",
        bestTime: "June–August for lake swimming and warmth. December–February for mountain access and Christmas atmosphere.",
        weatherNote: "The Föhn wind brings remarkable clarity — you can see the Alps from the city. It also brings headaches for some people, which Zurichers take entirely seriously.",
        tip: "Zurich lake in August at 6am — before the city wakes up, the Alps in the background — is one of Europe's genuinely great early morning experiences.",
    },
    brussels: {
        name: "Brussels", country: "Belgium",
        lat: 50.8503, lon: 4.3517, timezone: "Europe/Brussels",
        hero: "Brussels weather, honestly.",
        sub: "The EU capital has famously unpredictable weather. Here's the honest guide.",
        culture: "Brussels has one of the most reliably unreliable climates in Europe — grey, damp, and changeable in a way that locals navigate rather than fight. The indoor culture is among the finest in Europe: restaurants, chocolate shops, brasseries with serious beer lists. Summers can be genuinely lovely but brief. Jackets are worn year-round.",
        bestTime: "June–August for warmth and outdoor terraces. December for Christmas markets and atmosphere.",
        weatherNote: "Brussels rain is persistent and light, arriving from any direction. A compact umbrella in the bag is the correct approach year-round.",
        tip: "Brussels Grand Place in rain at night is one of Europe's great squares in one of its best conditions. The golden buildings, wet cobblestones, the light. Don't avoid the rain.",
    },

    // ── NEW CITIES: Middle East & Africa ──────────────────────────
    "abu-dhabi": {
        name: "Abu Dhabi", country: "United Arab Emirates",
        lat: 24.4539, lon: 54.3773, timezone: "Asia/Dubai",
        hero: "Abu Dhabi weather, honestly.",
        sub: "Gulf heat, plain language. Here's what the sky is actually doing.",
        culture: "Abu Dhabi shares Dubai's climate but has a different relationship with it — the capital is planned around the extremes. The Corniche is empty from June through September. The Sheikh Zayed Grand Mosque is best visited at dawn when the marble is cool. From October to April, Abu Dhabi has one of the most genuinely pleasant climates in the world.",
        bestTime: "November to March. Warm days, cool evenings, clear skies.",
        weatherNote: "Humidity in Abu Dhabi can feel worse than Dubai due to shallower coastal waters. Apparent temperature in August can reach 55° with humidity factored in.",
        tip: "The best time to walk the Corniche is 7am in winter — the light is extraordinary and the heat is months away.",
    },
    doha: {
        name: "Doha", country: "Qatar",
        lat: 25.2854, lon: 51.5310, timezone: "Asia/Qatar",
        hero: "Doha weather, honestly.",
        sub: "Gulf heat requires Gulf honesty. Here's the real forecast.",
        culture: "Doha's climate is among the most extreme in the world for a major city. Summers are when only necessary outdoor movement happens. The transformation from October to April is remarkable: the city opens up, the Corniche fills, and outdoor spaces that sat empty through summer become genuinely excellent. The 2022 World Cup deliberately scheduled around this reality.",
        bestTime: "November to March. Pleasant temperatures, low humidity, Doha at its best.",
        weatherNote: "July and August regularly exceed 42° with humidity making the real feel significantly higher. Outdoor activity before 6am or after 9pm only.",
        tip: "The Museum of Islamic Art terrace at dusk in January — the skyline across the water, the temperature in the low 20s — is one of the Gulf's genuinely great views.",
    },
    cairo: {
        name: "Cairo", country: "Egypt",
        lat: 30.0444, lon: 31.2357, timezone: "Africa/Cairo",
        hero: "Cairo weather, honestly.",
        sub: "Desert city, honest forecast. Here's what the sky is doing.",
        culture: "Cairo is one of the driest major cities on earth — less than 25mm of rain annually. The climate is defined by sun and heat, with winters mild by day and genuinely cold at night. The khamsin — a hot, sandy wind from the Sahara — arrives in spring and can turn the sky orange and reduce visibility to near zero. Locals treat weather as background noise; only the khamsin stops the city.",
        bestTime: "October to April. Warm days, cool nights, the pyramids at their most atmospherically lit.",
        weatherNote: "Khamsin sandstorms arrive March–May with little warning and can last 1-3 days. If the sky turns yellow, stay indoors.",
        tip: "The pyramids at dawn in October — when the desert is cool, the tourists haven't arrived, the light comes in at a low angle — are as good as anything you'll see anywhere.",
    },
    "cape-town": {
        name: "Cape Town", country: "South Africa",
        lat: -33.9249, lon: 18.4241, timezone: "Africa/Johannesburg",
        hero: "Cape Town weather, honestly.",
        sub: "Mediterranean climate, honest forecast. Here's what the sky is doing.",
        culture: "Cape Town has a Mediterranean climate — warm dry summers and wet mild winters — considered the best weather in Africa by most who live there. The southeaster (the Cape Doctor) blows hard in summer, keeping temperatures down but making Table Mountain frequently cloud-capped. Winter is when the wine country gets its rain and the city gets atmospheric.",
        bestTime: "March–May and September–November. Warm, clear, the summer crowds gone.",
        weatherNote: "The southeaster wind in summer can be 40-60km/h — Atlantic seaboard beach days are more like windsurf conditions.",
        tip: "Cape Town's winter is wet but mild and the city is empty. The winelands, Table Mountain fynbos, and whale season on the coast make it worth considering.",
    },
    casablanca: {
        name: "Casablanca", country: "Morocco",
        lat: 33.5731, lon: -7.5898, timezone: "Africa/Casablanca",
        hero: "Casablanca weather, honestly.",
        sub: "Atlantic Morocco, honest forecast. Here's the real guide.",
        culture: "Casablanca sits on the Atlantic coast — moderated by the ocean, the Canary Current keeping summers cooler than you'd expect at this latitude. Winters are mild and rainy. Summers are warm but not extreme. It's a working city and the weather is treated as a practical matter.",
        bestTime: "April–June and September–October. Warm, manageable, with Atlantic sea breezes.",
        weatherNote: "Casablanca summer is cooler than Marrakech by 8-12° — the Canary Current moderates temperatures significantly.",
        tip: "Casablanca corniche on a clear January afternoon — the Hassan II Mosque, the Atlantic, the light — is a version of Morocco that most visitors miss.",
    },

    // ── NEW CITIES: Asia ──────────────────────────────────────────
    singapore: {
        name: "Singapore", country: "Singapore",
        lat: 1.3521, lon: 103.8198, timezone: "Asia/Singapore",
        hero: "Singapore weather, honestly.",
        sub: "Year-round heat, year-round honesty. Here's the real forecast.",
        culture: "Singapore sits almost exactly on the equator: warm always, often wet, sometimes both simultaneously. The city is engineered around the heat with covered walkways, air conditioning, and a food culture that embraces outdoor eating at specific hours when it works. The northeast monsoon (December–March) brings heavier rain.",
        bestTime: "February and August tend to be slightly drier. But no month is reliably dry — pack a small umbrella regardless.",
        weatherNote: "Singapore's afternoon thunderstorms are sudden, heavy and short. A 30-minute downpour at 4pm is as common as a clear sky.",
        tip: "The humidity in Singapore is constant — 80-90% year round. Light fabrics and dry-fit clothing are not optional.",
    },
    mumbai: {
        name: "Mumbai", country: "India",
        lat: 19.0760, lon: 72.8777, timezone: "Asia/Kolkata",
        hero: "Mumbai weather, honestly.",
        sub: "Monsoon city, honest forecast. Here's what the sky is doing.",
        culture: "Mumbai has three seasons and only one that matters for planning: the monsoon (June–September). When the monsoon arrives — usually around June 10th — it transforms the city completely. Streets flood, the air changes, four months of heavy life-defining rain. The pre-monsoon period (April–May) is the most oppressive: hot, humid, still.",
        bestTime: "November to February. Cool enough to walk, low humidity, the city at its best.",
        weatherNote: "Monsoon flooding in Mumbai is serious — some areas become impassable. Track the India Meteorological Department closely in June–September.",
        tip: "Mumbai in January is one of India's most underrated weather windows. Perfect temperature, low humidity, the city's energy without the monsoon chaos.",
    },
    delhi: {
        name: "Delhi", country: "India",
        lat: 28.7041, lon: 77.1025, timezone: "Asia/Kolkata",
        hero: "Delhi weather, honestly.",
        sub: "Extreme seasons, honest forecast. Here's what Delhi's sky is actually doing.",
        culture: "Delhi has the most extreme seasonal range of any major city — from near-freezing winter fog to 45° summer heat within months. The fog in December and January can halt flights and trains for days. Summer (April–June) brings dust storms without warning. The monsoon brings relief from heat but adds humidity. A brief perfect autumn before the fog returns.",
        bestTime: "October–November. After the monsoon, before the winter fog. The best of Delhi's weather.",
        weatherNote: "Delhi winter fog (December–January) is serious — visibility can drop to near zero, causing widespread transport disruption.",
        tip: "Delhi after the monsoon — September and October — has a clarity that the rest of the year rarely manages.",
    },
    "hong-kong": {
        name: "Hong Kong", country: "China",
        lat: 22.3193, lon: 114.1694, timezone: "Asia/Hong_Kong",
        hero: "Hong Kong weather, honestly.",
        sub: "Typhoon season, monsoon humidity, honest forecast.",
        culture: "Hong Kong's weather is as dramatic as the city. Typhoon season (May–November) brings the numbered storm warnings that shut the city in stages. The summer monsoon brings humidity so thick surfaces sweat. But from October to March, Hong Kong has some of the finest urban weather in Asia: clear, dry, cool enough for walking.",
        bestTime: "October to March. Clear skies, manageable temperatures, the harbour at its most photogenic.",
        weatherNote: "Typhoon season risks are real — a No. 8 or above means all outdoor activity stops and transport halts. Check the Hong Kong Observatory if visiting May–November.",
        tip: "The Peak in winter morning fog — buildings emerging from cloud, the harbour below — is one of the world's great urban views.",
    },
    taipei: {
        name: "Taipei", country: "Taiwan",
        lat: 25.0330, lon: 121.5654, timezone: "Asia/Taipei",
        hero: "Taipei weather, straight.",
        sub: "Mountain city, typhoon island, honest forecast.",
        culture: "Taipei is surrounded by mountains and sits in a basin — weather rolls in fast and traps humidity. The city is famously grey and rainy, particularly in winter when the northeast monsoon brings persistent drizzle. Summers are hot, humid, and punctuated by typhoons. The shoulder seasons offer a Taipei that's warm, occasionally sunny, and entirely worth the effort.",
        bestTime: "October–November. Clearer than spring, cooler than summer, the mountains at their best.",
        weatherNote: "Typhoon season runs July–October. Taiwan is directly in the Pacific typhoon belt. Monitor forecasts carefully if travelling in this window.",
        tip: "Taipei night markets function regardless of rain. The food is the same, the atmosphere is enhanced.",
    },
    osaka: {
        name: "Osaka", country: "Japan",
        lat: 34.6937, lon: 135.5023, timezone: "Asia/Tokyo",
        hero: "Osaka weather, honestly.",
        sub: "Japan's food capital has weather worth understanding.",
        culture: "Osaka has similar seasons to Tokyo but slightly more humidity and slightly warmer winters. The city has developed an outdoor food culture — Dotonbori, street stalls, covered arcades — that adapts to all weather. Rainy season (June) is the least photogenic time. Cherry blossom (late March–early April) and autumn colour (November) are most visited.",
        bestTime: "Late March–April for cherry blossom. October–November for autumn and comfortable temperatures.",
        weatherNote: "Osaka is slightly more humid than Tokyo in summer. Typhoon season (August–October) also brings risk.",
        tip: "Osaka's covered shopping arcades make the city extremely functional in rain. The food doesn't stop for weather.",
    },
    "kuala-lumpur": {
        name: "Kuala Lumpur", country: "Malaysia",
        lat: 3.1390, lon: 101.6869, timezone: "Asia/Kuala_Lumpur",
        hero: "Kuala Lumpur weather, straight.",
        sub: "Tropical city, honest forecast. Here's what the sky is doing.",
        culture: "Kuala Lumpur is hot, humid and frequently rainy — and the city is entirely built around this. There are no real seasons, just wetter and slightly less wet periods. The city functions brilliantly indoors: world-class malls, covered walkways, air-conditioned transit. Outdoor KL happens in the morning and evening.",
        bestTime: "May–July tends to be slightly drier on the west coast. But KL's weather is famously unpredictable.",
        weatherNote: "KL's afternoon thunderstorms are among the most spectacular in Southeast Asia — sudden, heavy, impressive. They typically clear within an hour.",
        tip: "The Petronas Towers in rain viewed from KLCC Park — the reflection in the pools, storm clouds behind — makes them look like science fiction.",
    },

    // ── NEW CITIES: Americas ──────────────────────────────────────
    "buenos-aires": {
        name: "Buenos Aires", country: "Argentina",
        lat: -34.6037, lon: -58.3816, timezone: "America/Argentina/Buenos_Aires",
        hero: "Buenos Aires weather, honestly.",
        sub: "Southern hemisphere seasons, honest forecast. Here's the real guide.",
        culture: "Buenos Aires has the seasons reversed for northern hemisphere visitors — July is winter, January is summer. The city's relationship with weather is relaxed: outdoor dining continues in temperatures that would clear European terraces, and the summer storms (January–March) are treated as dramatic theatre rather than inconvenience.",
        bestTime: "October–November (southern spring) and March–April (southern autumn). Perfect temperatures, beautiful light.",
        weatherNote: "Buenos Aires summer (December–February) is hot and humid. The city's parks empty between noon and 5pm.",
        tip: "Buenos Aires in autumn (April–May) has a quality of light that makes the Palermo parks and San Telmo cobblestones look like a film set.",
    },
    "mexico-city": {
        name: "Mexico City", country: "Mexico",
        lat: 19.4326, lon: -99.1332, timezone: "America/Mexico_City",
        hero: "Mexico City weather, honestly.",
        sub: "High altitude city, honest forecast. Here's what the sky is doing.",
        culture: "Mexico City sits at 2,240 metres — the altitude keeps temperatures moderate year-round, makes the sun more intense, and creates dramatic afternoon storms during rainy season (May–October). The dry season is clear, sunny and genuinely excellent.",
        bestTime: "November to April. Dry, sunny, moderate temperatures — the city at its most walkable.",
        weatherNote: "UV index in Mexico City is significantly higher than at sea level due to altitude. Sun protection is important year-round.",
        tip: "Mexico City morning at altitude has a clarity — before the afternoon clouds build — that makes the volcanoes visible on the horizon.",
    },
    "sao-paulo": {
        name: "São Paulo", country: "Brazil",
        lat: -23.5505, lon: -46.6333, timezone: "America/Sao_Paulo",
        hero: "São Paulo weather, honestly.",
        sub: "South America's biggest city, straight forecast.",
        culture: "São Paulo's climate is surprisingly pleasant: altitude (760m) keeps temperatures moderate, humidity is manageable compared to coastal cities, and the rainy season (November–March) brings afternoon storms that clear fast. The rest of the year is mild and entirely secondary to what's happening in Brazil's most intense city.",
        bestTime: "April–September. Drier, cooler, clearer. São Paulo's best weather window.",
        weatherNote: "Flooding in São Paulo's lower-lying areas during heavy summer rain can be serious in January and February.",
        tip: "São Paulo's rooftop bars and outdoor cultural events in May and June — dry and mild — are worth planning around.",
    },
    "rio-de-janeiro": {
        name: "Rio de Janeiro", country: "Brazil",
        lat: -22.9068, lon: -43.1729, timezone: "America/Sao_Paulo",
        hero: "Rio weather, honestly.",
        sub: "The world's most dramatic city has weather to match.",
        culture: "Rio is synonymous with sun — and the weather mostly delivers. Summer (December–March) is hot, humid and rainy: the afternoon storms are spectacular, the beaches recover within hours. Winter (June–August) is mild and clear — the best time to visit if you want the city without the weather drama.",
        bestTime: "June–August. Mild, clear, the mountains sharp against blue sky, the beaches uncrowded by Rio standards.",
        weatherNote: "Heavy summer rain in Rio can cause serious flooding and landslides in hillside communities. Check forecasts before heading to high areas in December–March.",
        tip: "Sugarloaf at sunset in July — the city clear below, 26° and a sea breeze — is Rio at its most beautiful.",
    },
    toronto: {
        name: "Toronto", country: "Canada",
        lat: 43.6532, lon: -79.3832, timezone: "America/Toronto",
        hero: "Toronto weather, no pretending.",
        sub: "Four real seasons. Here's the honest guide to all of them.",
        culture: "Toronto earns every weather cliché. January brings -15° with wind chill, lake-effect snow from Lake Ontario, and a cold that Torontonians wear as a badge of resilience. But the city is excellent in summer: warm, green, the waterfront alive. Autumn — when the maples turn — is arguably the most beautiful thing Ontario produces.",
        bestTime: "Late September–October for autumn colour and perfect temperatures. June–August for summer warmth.",
        weatherNote: "Lake-effect snow from Lake Ontario can bring heavy localised snowfall. Wind chill in winter makes temperatures feel significantly colder.",
        tip: "Toronto in November gets unfair press. The maple colours are peaking, the city is full but not packed, and the cold hasn't arrived yet.",
    },
    "los-angeles": {
        name: "Los Angeles", country: "United States",
        lat: 34.0522, lon: -118.2437, timezone: "America/Los_Angeles",
        hero: "Los Angeles weather, honestly.",
        sub: "Sunshine capital of the US. Here's the honest guide.",
        culture: "Los Angeles is built on the promise of weather — and mostly delivers. Over 280 sunny days annually, mild winters, summers warm and dry rather than humid. But LA is a city of microclimates: beach communities stay 5-8° cooler than the Valley, June Gloom keeps the coast grey through mornings, and the Santa Ana winds in autumn push temperatures to 38°.",
        bestTime: "September–November. The Santa Anas clear the sky to extraordinary clarity and the summer crowds are gone.",
        weatherNote: "June Gloom is real — the marine layer keeps the coast grey until noon through May and June. Further inland these months are clear.",
        tip: "LA in late October after a Santa Ana — the sky scrubbed clean, the mountains suddenly visible — is the city at its most cinematic.",
    },
    chicago: {
        name: "Chicago", country: "United States",
        lat: 41.8781, lon: -87.6298, timezone: "America/Chicago",
        hero: "Chicago weather, no exaggeration.",
        sub: "The Windy City's weather is exactly as described. Here's the honest guide.",
        culture: "Chicago earns every weather cliché. The wind off Lake Michigan is the defining meteorological fact — it can make a 0° day feel like -15°. Winters are brutal. Summers are glorious: warm, green, the lake shimmering, rooftop bars full. The city has a two-season psychological reality: survival mode and celebration mode.",
        bestTime: "Late June–August for summer warmth. Late September for warmth without peak humidity.",
        weatherNote: "Wind chill in Chicago winter is the number that matters, not the temperature. Dress for the real feel.",
        tip: "Chicago in August on the lakefront — Navy Pier, the Riverwalk, the beach — is one of the great American urban summer experiences.",
    },
    "san-francisco": {
        name: "San Francisco", country: "United States",
        lat: 37.7749, lon: -122.4194, timezone: "America/Los_Angeles",
        hero: "San Francisco weather, honestly.",
        sub: "The city of microclimates. Here's the real guide.",
        culture: "San Francisco weather is famously misunderstood. Visitors arrive in July expecting California sunshine and find fog and 16°. The fog is the defining feature — the marine layer rolls in from the Pacific through the Golden Gate. The Mission District can be 10° warmer than the Sunset at the same moment. Paradoxically, September and October are the warmest months.",
        bestTime: "September–October. The fog lifts, temperatures rise — the warmest months of the year.",
        weatherNote: "Summer in San Francisco is reliably cool and foggy on the coast. The ocean side stays cold while inland neighbourhoods can be warm. Layer always.",
        tip: "The SF fog at dusk — the Golden Gate half-visible, Alcatraz disappearing — is one of the world's genuinely great atmospheric views. Don't fight it.",
    },
    boston: {
        name: "Boston", country: "United States",
        lat: 42.3601, lon: -71.0589, timezone: "America/New_York",
        hero: "Boston weather, honestly.",
        sub: "New England seasons, no sugarcoating. Here's the real guide.",
        culture: "Boston earns its reputation as a city of serious weather. Nor'easters in winter can dump 60cm of snow in 24 hours. Summers are warm and occasionally oppressively humid. But Boston's great secret is October — crisp, golden, the university city energised and beautiful. New Englanders treat weather stoicism as a point of pride.",
        bestTime: "September–October for autumn colour and perfect temperatures. Late June–August for summer warmth.",
        weatherNote: "Nor'easters can develop rapidly and bring significant snow with little warning. Travel can be seriously disrupted.",
        tip: "Boston in October — Harvard Yard, the Public Garden — in peak colour is one of America's most beautiful autumn experiences.",
    },
    "las-vegas": {
        name: "Las Vegas", country: "United States",
        lat: 36.1699, lon: -115.1398, timezone: "America/Los_Angeles",
        hero: "Las Vegas weather, honestly.",
        sub: "Desert heat, no pretending. Here's what the forecast actually means.",
        culture: "Las Vegas is built on the fiction that the desert doesn't exist — and the weather disagrees. Summers are ferocious: 42° is normal, 45° happens, and the Strip at midday in July is a health risk. Winters are mild and pleasant. Spring and autumn are when Las Vegas makes most sense to be outside.",
        bestTime: "March–May and October–November. Warm, dry, without the summer extremes.",
        weatherNote: "Las Vegas summer heat is serious and fast. Without shade, hydration and planned indoor retreats, heat exhaustion is a real risk in July and August.",
        tip: "Red Rock Canyon at dawn in October — desert light, temperature perfect, the Strip invisible behind you — is the Las Vegas that makes you understand why people actually live here.",
    },
    orlando: {
        name: "Orlando", country: "United States",
        lat: 28.5383, lon: -81.3792, timezone: "America/New_York",
        hero: "Orlando weather, honestly.",
        sub: "Theme park capital, honest forecast. Here's what the sky is doing.",
        culture: "Orlando's weather is the hidden variable in every theme park visit. Summers are hot and humid with afternoon thunderstorms among the most intense in North America — typically arriving 2-4pm and clearing within an hour. Winters are warm and dry — the reason Orlando's busiest season is December through February.",
        bestTime: "January–March and October–November. Warm but manageable, lower humidity, reduced afternoon storm risk.",
        weatherNote: "Summer afternoon thunderstorms in Orlando are intense — parks close rides at the first lightning strike. Plan outdoor activities for morning.",
        tip: "Disney World at 7am in October — cool enough for a light jacket, empty enough to walk straight onto anything — is a different experience from August.",
    },
    miami: {
        name: "Miami", country: "United States",
        lat: 25.7617, lon: -80.1918, timezone: "America/New_York",
        hero: "Miami weather, honestly.",
        sub: "Subtropical humidity, honest forecast. Here's the real guide.",
        culture: "Miami's climate is subtropical and the city is built around this reality. Winters are warm and dry — the reason half of New York and Canada arrives November through April. Summers are hot, humid, punctuated by afternoon thunderstorms that are spectacular. Hurricane season (June–November) is taken seriously.",
        bestTime: "November to April. Dry, warm, the winter escape the entire city is designed for.",
        weatherNote: "Hurricane season (June–November) peaks August–October. Monitor NOAA during this period.",
        tip: "Miami in January — 26°, low humidity, clear skies — while the rest of the US deals with winter is one of America's more satisfying weather arbitrages.",
    },

    // ── FINAL 6: Reaching 100 ────────────────────────────────────
    reykjavik: {
        name: "Reykjavik", country: "Iceland",
        lat: 64.1466, lon: -21.9426, timezone: "Atlantic/Reykjavik",
        hero: "Reykjavik weather, honestly.",
        sub: "The world's most northern capital. Here's the honest guide.",
        culture: "Reykjavik weather is changeable in a way that makes forecasts approximate rather than certain — four seasons in a day is a cliché that is also true. The city is positioned between the warm Gulf Stream and Arctic cold, which creates dramatic skies and weather that locals treat as entirely normal. The Midnight Sun (May–August) and Northern Lights season (September–March) are weather-dependent experiences that can change with an hour's notice.",
        bestTime: "June–August for Midnight Sun and warmest temperatures. September–March for Northern Lights. There is no bad time to visit, just different experiences.",
        weatherNote: "Northern Lights visibility requires clear skies and darkness — September through March. The Aurora Forecast app is more useful than any weather app in Iceland.",
        tip: "In Reykjavik, the weather changes fast enough that if it's raining, wait 20 minutes before cancelling plans. The light after a storm here is unlike anything else.",
    },

    // ── 5 more to reach 100 ──────────────────────────────────────

    budapest: {
        name: "Budapest", country: "Hungary",
        lat: 47.4979, lon: 19.0402, timezone: "Europe/Budapest",
        hero: "Budapest weather, honestly.",
        sub: "Two cities, one river, one honest forecast.",
        culture: "Budapest has proper Central European seasons — cold winters with occasional snow on the castle, warm summers with thermal baths packed, and two shoulder seasons that are the best times to visit. The Danube creates its own microclimate between Buda and Pest, and the city's famous thermal spa culture exists precisely because the weather outside is often reason enough to stay in.",
        bestTime: "April–May and September–October. Warm, clear, the city at its most beautiful.",
        weatherNote: "Budapest summer (July–August) can be hot — 35°+ is possible. Winter (December–February) is cold with occasional snow.",
        tip: "Budapest in December — the Christmas markets, the castle lit up, snow possible, the thermal baths steaming against cold air — is one of Central Europe's finest winter experiences.",
    },
    nice: {
        name: "Nice", country: "France",
        lat: 43.7102, lon: 7.2620, timezone: "Europe/Paris",
        hero: "Nice weather, honestly.",
        sub: "The French Riviera deserves an honest forecast.",
        culture: "Nice has the finest urban climate in France — 300 sunny days, mild winters, summers cooled by sea breezes. The Promenade des Anglais was named by English aristocrats who wintered here precisely because the weather was so much better than home. In summer the beach fills from dawn; in January the locals have the city almost to themselves.",
        bestTime: "May–June and September–October. Warm, clear, before and after the peak season crowds.",
        weatherNote: "July–August in Nice is hot and packed. The beach is beautiful but shared with half of Europe. The old town in summer is genuinely intense.",
        tip: "Nice in January — the market at Cours Saleya, the sea clear and cold, the light extraordinary — is the French Riviera that the Victorians found.",
    },
    muscat: {
        name: "Muscat", country: "Oman",
        lat: 23.5880, lon: 58.3829, timezone: "Asia/Muscat",
        hero: "Muscat weather, honestly.",
        sub: "Gulf heat, mountain backdrop, honest forecast.",
        culture: "Muscat has a Gulf climate with one significant difference: the Hajar mountains create more climatic variety than Dubai or Doha. Winters are genuinely excellent — warm, clear, with the mountains and the sea both at their best. The luxury tourism infrastructure is built entirely around the October–April window when the climate is among the finest in the world.",
        bestTime: "October to April. Warm days, cool evenings, clear skies.",
        weatherNote: "May through September temperatures regularly exceed 40°. The humidity is often lower than coastal Gulf cities, but the heat is still serious.",
        tip: "Muscat at dawn in February — the corniche empty, the mountains lit in morning light — is one of the Gulf's genuinely great early morning views.",
    },
    krakow: {
        name: "Krakow", country: "Poland",
        lat: 50.0647, lon: 19.9450, timezone: "Europe/Warsaw",
        hero: "Krakow weather, honestly.",
        sub: "Poland's most beautiful city. Here's the honest forecast.",
        culture: "Krakow has proper Central European seasons — cold winters that bring snow on the Rynek Główny, warm summers when the outdoor cafe culture comes fully alive. The city is remarkably walkable and the weather shapes everything: the Jewish Quarter in fog, Wawel Castle in winter light, the Main Square on a summer evening.",
        bestTime: "May–June and September–October. Warm, manageable, the city at its most beautiful.",
        weatherNote: "Krakow winter (December–February) is cold — regularly below freezing. The Christmas markets and the city's cellar bar culture make it entirely worthwhile.",
        tip: "Krakow in December — the Christmas market, the medieval square, snow possible — is one of Central Europe's most beautiful winter experiences.",
    },
    "cape-verde": {
        name: "Cape Verde", country: "Cape Verde",
        lat: 15.1111, lon: -23.6167, timezone: "Atlantic/Cape_Verde",
        hero: "Cape Verde weather, honestly.",
        sub: "Atlantic archipelago, honest forecast. Here's what the sky is doing.",
        culture: "Cape Verde sits in the Atlantic, 500km off the coast of West Africa, with a climate that reflects this position — warm year-round, often windy, and with a dry season that feels almost Mediterranean. The islands vary significantly: Sal and Boa Vista are flat and resort-oriented, Santo Antão is dramatically mountainous. The Harmattan wind from the Sahara (December–March) brings haze.",
        bestTime: "November to June. Warm, manageable humidity, lower wind. The brief rainy season (August–October) mainly affects the northern islands.",
        weatherNote: "The trade winds are constant and strong in Cape Verde — great for windsurfing, challenging for beach days on exposed coasts. The sheltered bays are significantly calmer.",
        tip: "Cape Verde in February — warm, dry, uncrowded — is one of the Atlantic's most underrated winter destinations.",
    },
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
export default function ROOFCity() {
    const MAILCHIMP_URL = "https://mailchi.mp/3e2b5f94e259/roof-waitlist-1"

    // Detect city from URL path e.g. /london → "london"
    const _params = useParams()
    const rawSlug = ((_params?.slug as string) || "london").toLowerCase()


    // Normalise known slug variations
    const slugMap: Record<string, string> = {
        "newyork": "new-york",
        "new-york": "new-york",
        "capetown": "cape-town",
        "cape-town": "cape-town",
        "saopaulo": "sao-paulo",
        "sao-paulo": "sao-paulo",
        "losangeles": "los-angeles",
        "los-angeles": "los-angeles",
        "kualalumpur": "kuala-lumpur",
        "kuala-lumpur": "kuala-lumpur",
        "buenosaires": "buenos-aires",
        "buenos-aires": "buenos-aires",
        "ho-chi-minh": "ho-chi-minh",
        "hochiminh": "ho-chi-minh",
        "mexicocity": "mexico-city",
        "mexico-city": "mexico-city",
        "hongkong": "hong-kong",
        "hong-kong": "hong-kong",
        "abudhabi": "abu-dhabi",
        "abu-dhabi": "abu-dhabi",
        "sanfrancisco": "san-francisco",
        "san-francisco": "san-francisco",
        "lasvegas": "las-vegas",
        "las-vegas": "las-vegas",
        "riojaneiro": "rio-de-janeiro",
        "rio": "rio-de-janeiro",
        "rio-de-janeiro": "rio-de-janeiro",
    }
    const slug = slugMap[rawSlug] || rawSlug

    const city = CITY_DATA[slug] || CITY_DATA["london"]

    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    )
    const [weather, setWeather] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isDark, setIsDark] = useState(true)

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

    // Canonical URL — tells Google the clean URL is preferred, suppresses redirect warnings in Search Console
    useEffect(() => {
        const canonical = `https://roofweather.app/${slug}`
        let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
        if (!link) {
            link = document.createElement('link') as HTMLLinkElement
            link.rel = 'canonical'
            document.head.appendChild(link)
        }
        link.href = canonical
        let og = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null
        if (!og) {
            og = document.createElement('meta') as HTMLMetaElement
            og.setAttribute('property', 'og:url')
            document.head.appendChild(og)
        }
        og.setAttribute('content', canonical)
    }, [slug])

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,weather_code,precipitation_probability_max&wind_speed_unit=mph&temperature_unit=celsius&forecast_days=10&timezone=auto`
                )
                const data = await res.json()
                setWeather(data)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchWeather()
    }, [city.lat, city.lon])

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
            fontFamily: "Inter, -apple-system, sans-serif",
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
            overflowX: "hidden",
            background: T.pageBg,
            transition: "background 0.25s ease",
        }}>

            {/* Nav + Hero */}
            <div style={{ width: "100%", background: T.heroBg, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>

                {/* Nav */}
                <div style={{ width: "100%", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: pad, boxSizing: "border-box" }}>
                    <a href="/" style={{ color: T.navLogo, fontSize: 20, fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>ROOF</a>
                    <div style={{ display: "flex", gap: isMobile ? 16 : 24, alignItems: "center" }}>
                        <a href="/about" style={{ color: T.navLink, fontSize: 13, textDecoration: "none" }}>About</a>
                        <span onClick={() => window.open(MAILCHIMP_URL, "_blank")} style={{ color: T.navLink, fontSize: 13, cursor: "pointer" }}>Join waitlist</span>
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
                    <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: T.eyebrow, margin: "0 0 20px" }}>
                        {city.name} · {city.country}
                    </p>
                    <h1 style={{ fontSize: isMobile ? 32 : 56, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.025em", color: T.heroTitle, margin: "0 0 24px", maxWidth: 700 }}>
                        {city.hero}
                    </h1>
                    <p style={{ fontSize: isMobile ? 15 : 19, color: T.heroSub, lineHeight: 1.7, maxWidth: 520, margin: "0 0 40px" }}>
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
                    style={{ padding: "14px 32px", background: T.waitlistBtn, color: T.waitlistBtnText, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", letterSpacing: "0.02em" }}>
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
