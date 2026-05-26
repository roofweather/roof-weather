'use client'

import React, { useState, useEffect } from "react"

export default function ROOFAbout() {
    const MAILCHIMP_URL = "https://mailchi.mp/3e2b5f94e259/roof-waitlist-1"
    const [screenWidth, setScreenWidth] = useState(1200)

    useEffect(() => {
        const update = () => setScreenWidth(window.innerWidth)
        update()
        window.addEventListener("resize", update)
        let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
        if (!meta) {
            meta = document.createElement("meta") as HTMLMetaElement
            meta.name = "viewport"
            document.head.appendChild(meta)
        }
        meta.content = "width=device-width, initial-scale=1, maximum-scale=1"
        document.body.style.margin = "0"
        document.body.style.padding = "0"
        document.body.style.width = "100%"
        document.documentElement.style.width = "100%"
        return () => window.removeEventListener("resize", update)
    }, [])

    const isMobile = screenWidth < 768

    // Soft light blue background (matching homepage moderate temperature tier)
    const heroBg = "linear-gradient(to bottom, #4A90A4 0%, #5DADE2 50%, #85C1E2 100%)"
    const pageBg = "linear-gradient(to bottom, #5DADE2 0%, #85C1E2 100%)"

    // Colors - no mint/Clearday, using Overcast blue and Golden Hour only
    const navBorder = "rgba(255,255,255,0.15)"
    const identityColor = "#2C5282" // Dark blue for identity line on light background
    const headlineColor = "#0D0D0D" // Dark text on light background
    const accentColor = "#F0C97A" // Golden Hour (amber)
    const subColor = "#1A365D" // Dark blue for subtext

    // Dark cards (matching homepage)
    const cardBg = "#141414"
    const cardBorder = "#242424"
    const labelColor = "#888" // Lighter labels on dark cards
    const textColor = "#EEEEEE" // White text on dark cards
    const iconColor = "#4A4A4A"

    const sectionHeadColor = "#0D0D0D" // Dark text on light background
    const sectionSubColor = "#2C5282" // Dark blue for section subs

    const premiumBg = "#0D0D0D"
    const premiumBorder = "#1A1A1A"
    const footerBg = "#0D0D0D"
    const footerBorder = "#161616"
    const footerText = "#888"

    return (
        <div style={{
            width: "100%",
            minWidth: 0,
            fontFamily: "Cabinet Grotesk, Inter, sans-serif",
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
            overflowX: "hidden",
            background: pageBg,
        }}>
            {/* Nav + Hero */}
            <div style={{
                width: "100%",
                background: heroBg,
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
            }}>
                {/* Nav */}
                <div style={{
                    width: "100%",
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: isMobile ? "0 20px" : "0 48px",
                    boxSizing: "border-box",
                    borderBottom: `1px solid ${navBorder}`,
                }}>
                    <a href="/" style={{ color: "#0D0D0D", fontSize: 26, fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>
                        ROOF
                    </a>
                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                        <a href="/" style={{ color: "#1A365D", fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", textDecoration: "none" }}>
                            Weather
                        </a>
                        <button onClick={() => window.open(`${MAILCHIMP_URL}?utm_source=site&utm_medium=cta-nav&utm_campaign=launch`, "_blank")} style={{ padding: "9px 18px", borderRadius: 24, border: "none", background: "#0D0D0D", color: "#F5F4F0", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em", whiteSpace: "nowrap" }}>Get early access</button>
                    </div>
                </div>

                {/* Hero */}
                <div style={{ padding: isMobile ? "40px 20px 56px" : "64px 48px 80px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    {/* Identity line */}
                    <p style={{ color: identityColor, fontSize: isMobile ? 11 : 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.8, margin: "0 0 8px", textShadow: "0 2px 4px rgba(0,0,0,0.15)" }}>WEATHER, HONESTLY.</p>
                    <p style={{ color: identityColor, fontSize: isMobile ? 11 : 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.8, margin: "0 0 40px", textShadow: "0 2px 4px rgba(0,0,0,0.15)" }}>WHAT THE WEATHER ACTUALLY MEANS. CITY BY CITY.</p>

                    <h1 style={{
                        fontSize: isMobile ? 40 : 56,
                        fontWeight: 500,
                        lineHeight: 1.1,
                        letterSpacing: "-0.025em",
                        color: headlineColor,
                        margin: "0 0 24px",
                        maxWidth: 680,
                    }}>
                        The first weather <span style={{ color: accentColor }}>brand.</span>
                    </h1>
                    <p style={{ fontSize: isMobile ? 17 : 18, color: subColor, lineHeight: 1.7, maxWidth: 520, margin: 0 }}>
                        The first weather app built to communicate, not just display data.
                    </p>
                </div>
            </div>

            {/* How ROOF works */}
            <div style={{ width: "100%", padding: isMobile ? "64px 20px" : "88px 48px", boxSizing: "border-box", display: "flex", justifyContent: "center" }}>
                <div style={{
                    maxWidth: 680,
                    padding: isMobile ? "28px 24px" : "36px 40px",
                    backgroundColor: cardBg,
                    backgroundImage: "linear-gradient(135deg, rgba(80,110,180,0.08) 0%, transparent 60%)",
                    borderRadius: 16,
                    border: `1px solid ${cardBorder}`,
                }}>
                    <p style={{ color: labelColor, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 20px", fontWeight: 600 }}>How ROOF works</p>
                    <p style={{ fontSize: isMobile ? 17 : 18, color: textColor, lineHeight: 1.75, margin: 0 }}>
                        ROOF translates weather data into the kind of explanation a well-informed local would give you. Not simplified — <em>interpreted</em>. We use AI to generate culturally calibrated forecasts at scale, then refine them city by city to match how people actually talk about weather and how it shapes the day where you are. Dubai humidity isn't London drizzle. Lagos harmattan isn't Tokyo rain. 40% chance of rain means something different in Edinburgh than it does in Accra. ROOF knows the difference.
                    </p>
                </div>
            </div>

            {/* What makes ROOF different */}
            <div style={{ width: "100%", padding: isMobile ? "0 20px 64px" : "0 48px 88px", boxSizing: "border-box" }}>
                <h2 style={{ fontSize: isMobile ? 28 : 32, fontWeight: 600, color: sectionHeadColor, textAlign: "center", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
                    What makes ROOF different
                </h2>
                <p style={{ fontSize: 16, color: sectionSubColor, textAlign: "center", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.6 }}>
                    Four things no other weather platform does.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, maxWidth: 920, margin: "0 auto" }}>
                    {/* Real language */}
                    <div style={{
                        padding: isMobile ? "24px 20px" : "28px 32px",
                        backgroundColor: cardBg,
                        backgroundImage: "linear-gradient(135deg, rgba(80,110,180,0.08) 0%, transparent 60%)",
                        borderRadius: 16,
                        border: `1px solid ${cardBorder}`,
                        display: "flex",
                        gap: 20,
                        alignItems: "flex-start"
                    }}>
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: "#A8CAEF", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>Real language</p>
                            <p style={{ fontSize: isMobile ? 17 : 18, fontWeight: 500, color: textColor, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "0 0 10px" }}>
                                Language is the product.
                            </p>
                            <p style={{ fontSize: 15, color: textColor, lineHeight: 1.7, margin: 0, opacity: 0.85 }}>
                                No symbols. No percentages. No jargon. Just what the sky is doing and what to do about it. Every other weather app was built to display data. ROOF is built to explain it.
                            </p>
                        </div>
                    </div>

                    {/* Cultural intelligence */}
                    <div style={{
                        padding: isMobile ? "24px 20px" : "28px 32px",
                        backgroundColor: cardBg,
                        backgroundImage: "linear-gradient(135deg, rgba(240,201,122,0.09) 0%, transparent 60%)",
                        borderRadius: 16,
                        border: `1px solid ${cardBorder}`,
                        display: "flex",
                        gap: 20,
                        alignItems: "flex-start"
                    }}>
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="2" y1="12" x2="22" y2="12"/>
                                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: "#F0C97A", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>Cultural intelligence</p>
                            <p style={{ fontSize: isMobile ? 17 : 18, fontWeight: 500, color: textColor, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "0 0 10px" }}>
                                Every city speaks differently.
                            </p>
                            <p style={{ fontSize: 15, color: textColor, lineHeight: 1.7, margin: 0, opacity: 0.85 }}>
                                Climate shapes culture. Culture shapes how people talk about weather. 40°C in the Gulf hits different than 40°C in the Mediterranean. Monsoon season isn't the same as rainy season or harmattan season. The same forecast means different things in different places. ROOF speaks the local language.
                            </p>
                        </div>
                    </div>

                    {/* What to wear */}
                    <div style={{
                        padding: isMobile ? "24px 20px" : "28px 32px",
                        backgroundColor: cardBg,
                        backgroundImage: "linear-gradient(135deg, rgba(168,202,239,0.10) 0%, transparent 60%)",
                        borderRadius: 16,
                        border: `1px solid ${cardBorder}`,
                        display: "flex",
                        gap: 20,
                        alignItems: "flex-start"
                    }}>
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: "#A8CAEF", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>What to wear</p>
                            <p style={{ fontSize: isMobile ? 17 : 18, fontWeight: 500, color: textColor, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "0 0 10px" }}>
                                We tell you what to wear.
                            </p>
                            <p style={{ fontSize: 15, color: textColor, lineHeight: 1.7, margin: 0, opacity: 0.85 }}>
                                A dedicated card. Culturally calibrated. European summer means dress for the sun but keep a light jacket for the evening. West African heat means breathable materials and stay close to the AC. Gulf humidity means layers for brutal indoor air conditioning. Each city gets its own answer.
                            </p>
                        </div>
                    </div>

                    {/* Honest uncertainty */}
                    <div style={{
                        padding: isMobile ? "24px 20px" : "28px 32px",
                        backgroundColor: cardBg,
                        backgroundImage: "linear-gradient(135deg, rgba(240,201,122,0.09) 0%, transparent 60%)",
                        borderRadius: 16,
                        border: `1px solid ${cardBorder}`,
                        display: "flex",
                        gap: 20,
                        alignItems: "flex-start"
                    }}>
                        <div style={{ flexShrink: 0, marginTop: 2 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: "#F0C97A", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>Honest uncertainty</p>
                            <p style={{ fontSize: isMobile ? 17 : 18, fontWeight: 500, color: textColor, lineHeight: 1.4, letterSpacing: "-0.01em", margin: "0 0 10px" }}>
                                When it's uncertain, we say so.
                            </p>
                            <p style={{ fontSize: 15, color: textColor, lineHeight: 1.7, margin: 0, opacity: 0.85 }}>
                                When the forecast shows 42% rain chance, every other app rounds that to dry or rain. ROOF says: the forecast is sitting on the fence. More likely dry than not — but not confidently so. Bring the small umbrella just in case.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* See it in action */}
            <div style={{ width: "100%", padding: isMobile ? "64px 20px" : "88px 48px 88px", boxSizing: "border-box", background: "rgba(0,0,0,0.03)" }}>
                <h2 style={{ fontSize: isMobile ? 28 : 32, fontWeight: 600, color: sectionHeadColor, textAlign: "center", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
                    See it in action
                </h2>
                <p style={{ fontSize: 16, color: sectionSubColor, textAlign: "center", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.6 }}>
                    ROOF doesn't just describe features. Here's how it works in real cities.
                </p>

                <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
                    {/* What To Wear comparison */}
                    <div>
                        <p style={{ color: sectionSubColor, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 20px", fontWeight: 600, textAlign: "center" }}>What to wear — culturally calibrated</p>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                            <div style={{
                                padding: "20px 24px",
                                backgroundColor: cardBg,
                                backgroundImage: "linear-gradient(135deg, rgba(240,201,122,0.09) 0%, transparent 60%)",
                                borderRadius: 12,
                                border: `1px solid ${cardBorder}`,
                            }}>
                                <p style={{ color: labelColor, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 600 }}>Dubai · 38°</p>
                                <p style={{ fontSize: 16, color: textColor, lineHeight: 1.7, margin: 0 }}>
                                    Light, breathable layers. The air conditioning indoors is brutal — bring a light cardigan or you'll freeze inside.
                                </p>
                            </div>
                            <div style={{
                                padding: "20px 24px",
                                backgroundColor: cardBg,
                                backgroundImage: "linear-gradient(135deg, rgba(168,202,239,0.10) 0%, transparent 60%)",
                                borderRadius: 12,
                                border: `1px solid ${cardBorder}`,
                            }}>
                                <p style={{ color: labelColor, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 600 }}>London · 12°</p>
                                <p style={{ fontSize: 16, color: textColor, lineHeight: 1.7, margin: 0 }}>
                                    Layered warmth. Jacket, scarf, and an umbrella — the drizzle is light but persistent. You'll need all three.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Your Window */}
                    <div>
                        <p style={{ color: sectionSubColor, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 20px", fontWeight: 600, textAlign: "center" }}>Your window — the best outdoor moment</p>
                        <div style={{
                            padding: isMobile ? "24px 20px" : "28px 32px",
                            backgroundColor: cardBg,
                            backgroundImage: "linear-gradient(135deg, rgba(80,110,180,0.08) 0%, transparent 60%)",
                            borderRadius: 12,
                            border: `1px solid ${cardBorder}`,
                            maxWidth: 640,
                            margin: "0 auto"
                        }}>
                            <p style={{ color: labelColor, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 600 }}>Lagos · Thursday</p>
                            <p style={{ fontSize: isMobile ? 17 : 18, color: textColor, lineHeight: 1.7, margin: 0 }}>
                                Rain arrives around 3pm. Your outdoor window is this morning — 7am to 1pm. Clear and warm. Use it.
                            </p>
                        </div>
                    </div>

                    {/* Honest uncertainty */}
                    <div>
                        <p style={{ color: sectionSubColor, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 20px", fontWeight: 600, textAlign: "center" }}>Honest uncertainty — 40% rain</p>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                            <div style={{
                                padding: "20px 24px",
                                backgroundColor: cardBg,
                                borderRadius: 12,
                                border: `1px solid ${cardBorder}`,
                                opacity: 0.6
                            }}>
                                <p style={{ color: labelColor, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 600 }}>Most weather apps</p>
                                <p style={{ fontSize: 16, color: textColor, lineHeight: 1.7, margin: 0 }}>
                                    "40% chance of rain" or a cloud-with-droplets icon. What does that mean? Should you cancel plans? Take an umbrella? Nobody knows.
                                </p>
                            </div>
                            <div style={{
                                padding: "20px 24px",
                                backgroundColor: cardBg,
                                backgroundImage: "linear-gradient(135deg, rgba(168,202,239,0.10) 0%, transparent 60%)",
                                borderRadius: 12,
                                border: `1px solid ${cardBorder}`,
                            }}>
                                <p style={{ color: "#A8CAEF", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 600 }}>ROOF</p>
                                <p style={{ fontSize: 16, color: textColor, lineHeight: 1.7, margin: 0 }}>
                                    "The forecast is sitting on the fence. More likely dry than not — but not confidently so. Take the umbrella just in case."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* What's coming */}
            <div style={{ width: "100%", padding: isMobile ? "64px 20px" : "88px 48px", boxSizing: "border-box" }}>
                <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ color: sectionSubColor, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 20px", fontWeight: 600 }}>Coming soon</p>
                    <h2 style={{ fontSize: isMobile ? 28 : 32, fontWeight: 600, color: sectionHeadColor, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
                        ROOF Intelligence
                    </h2>
                    <p style={{ fontSize: isMobile ? 17 : 18, color: sectionSubColor, lineHeight: 1.7, margin: "0 0 32px" }}>
                        Save cities. 14-day forecasts. Alerts. Expanded messaging. Travel Mode. Historical context. Extended detail.
                    </p>
                    <p style={{ fontSize: 15, color: sectionSubColor, margin: "0 0 8px" }}>
                        Premium: £3.49/mo
                    </p>
                    <p style={{ fontSize: 14, color: sectionSubColor, opacity: 0.7, margin: 0 }}>
                        Early access launching soon.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div style={{ width: "100%", background: premiumBg, borderTop: `1px solid ${premiumBorder}`, display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
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
                        onClick={() => window.open(`${MAILCHIMP_URL}?utm_source=site&utm_medium=cta-hero&utm_campaign=launch`, "_blank")}
                        style={{ padding: "14px 32px", borderRadius: 24, border: "none", fontSize: 15, fontWeight: 600, background: "#F5F4F0", color: "#0D0D0D", cursor: "pointer", letterSpacing: "0.02em" }}>
                        Get early access
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div style={{ width: "100%", background: footerBg, borderTop: `1px solid ${footerBorder}`, padding: isMobile ? "24px 20px" : "32px 48px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 700, letterSpacing: "0.1em" }}>ROOF</span>
                <span style={{ color: footerText, fontSize: 12 }}>Weather, honestly.</span>
            </div>
        </div>
    )
}
