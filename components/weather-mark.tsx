const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

export function weatherWord(code: number, night: boolean): string {
  if (code === 0) return night ? "Clear night" : "Clear"
  if (code === 1) return night ? "Mostly clear" : "Mostly clear"
  if (code === 2) return "Partly cloudy"
  if (code === 3) return "Overcast"
  if (code === 45 || code === 48) return "Fog"
  if (code >= 56 && code <= 57) return "Sleet"
  if (code >= 51 && code <= 55) return "Drizzle"
  if (code >= 66 && code <= 67) return "Sleet"
  if (code === 65 || code === 82) return "Heavy rain"
  if (code >= 61 && code <= 63) return "Rain"
  if (code >= 80 && code <= 81) return "Showers"
  if (code >= 71 && code <= 77) return "Snow"
  if (code >= 85 && code <= 86) return "Snow"
  if (code >= 95) return "Thunder"
  return "Mixed"
}

function rays() {
  return [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
    const rad = (deg * Math.PI) / 180
    return (
      <line
        key={deg}
        x1={16 + Math.cos(rad) * 8.2}
        y1={16 + Math.sin(rad) * 8.2}
        x2={16 + Math.cos(rad) * 12.2}
        y2={16 + Math.sin(rad) * 12.2}
        {...line}
      />
    )
  })
}

function Cloud() {
  return <path d="M9 22.5h12.5a4.2 4.2 0 0 0 .3-8.4 6.2 6.2 0 0 0-11.8-1.5A3.8 3.8 0 0 0 9 22.5z" {...line} />
}

export function WeatherMark({
  code,
  night = false,
  size = 28,
}: {
  code: number
  night?: boolean
  size?: number
}) {
  const word = weatherWord(code, night)
  let body = <Cloud />
  if (code >= 95) {
    body = (
      <>
        <Cloud />
        <path d="M17 18.5 14 24h2.4L15 29.5 21 22.5h-2.6l1.4-4z" {...line} />
      </>
    )
  } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    body = (
      <>
        <Cloud />
        <path d="M12 26v4M10.2 28h3.6M21 26v4M19.2 28h3.6" {...line} />
      </>
    )
  } else if ((code >= 56 && code <= 57) || (code >= 66 && code <= 67)) {
    body = (
      <>
        <Cloud />
        <path d="M13 26.5 11.5 31M19 26.5h3.2" {...line} />
      </>
    )
  } else if (code === 65 || code === 82 || code >= 80) {
    body = (
      <>
        <Cloud />
        <path d="M11 25.5 8.8 32M16.5 25.5 14.3 32M22 25.5 19.8 32" {...line} strokeWidth={2.6} />
      </>
    )
  } else if (code >= 61) {
    body = (
      <>
        <Cloud />
        <path d="M12 25.5 10 31.5M18 25.5 16 31.5M24 25.5 22 31.5" {...line} />
      </>
    )
  } else if (code >= 51) {
    body = (
      <>
        <Cloud />
        <path d="M13 26.5 12 30M19 26.5 18 30" {...line} />
      </>
    )
  } else if (code === 45 || code === 48) {
    body = <path d="M6 12h20M8 17h16M10 22h12" {...line} />
  } else if (code === 3) {
    body = (
      <>
        <path d="M6 16.5h11a3.4 3.4 0 0 0 .2-6.8 5 5 0 0 0-9.4-1.2A3 3 0 0 0 6 16.5z" {...line} />
        <path d="M12 23.5h13a3.6 3.6 0 0 0 .2-7.2 5.4 5.4 0 0 0-10.2-1.3A3.2 3.2 0 0 0 12 23.5z" {...line} />
      </>
    )
  } else if (code === 2 || (code === 1 && !night)) {
    body = (
      <>
        <circle cx="12" cy="11" r="3.4" {...line} />
        <path d="M12 4.8v2.2M6.2 11H8.4M8 7l1.4 1.4M16 7l-1.4 1.4" {...line} />
        <path d="M13 24h12a3.6 3.6 0 0 0 .2-7.1 5.2 5.2 0 0 0-9.8-1.2A3.2 3.2 0 0 0 13 24z" {...line} />
      </>
    )
  } else if (night && code <= 1) {
    body = <path d="M21 6.2a8.2 8.2 0 1 0 3.6 15.6A6.3 6.3 0 0 1 21 6.2z" fill="currentColor" stroke="none" />
  } else if (code === 0) {
    body = (
      <>
        <circle cx="16" cy="16" r="4.6" {...line} />
        {rays()}
      </>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label={word}>
      <title>{word}</title>
      {body}
    </svg>
  )
}
