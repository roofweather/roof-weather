"use client"

import { useEffect, useState } from "react"
import { LONDON, type Place } from "./places"

export type Query = { city?: string; lat?: string; lon?: string; nogeo?: string }

export type ViewProps = {
  fixed: Place | null
  locate: boolean
  query?: Query
  initialBrand: boolean
}

export function usePlace(fixed: Place | null, locate: boolean, query?: Query) {
  const [place, setPlace] = useState<Place | null>(fixed)
  const fixedLat = fixed?.lat
  const fixedLon = fixed?.lon
  const fixedName = fixed?.name

  useEffect(() => {
    if (fixed) {
      setPlace(fixed)
      return
    }
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
    const lat = parseFloat(query?.lat || params?.get("lat") || "")
    const lon = parseFloat(query?.lon || params?.get("lon") || "")
    const cityName = query?.city || params?.get("city") || ""
    const skipGeo = !locate || query?.nogeo || params?.get("nogeo")
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      setPlace({ name: cityName || "Chosen city", lat, lon })
      return
    }
    if (skipGeo || typeof navigator === "undefined" || !navigator.geolocation) {
      setPlace(LONDON)
      return
    }
    let cancel = false
    const backup = window.setTimeout(() => {
      if (!cancel) setPlace((current) => current || LONDON)
    }, 8000)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          .then((response) => response.json())
          .then((data) => {
            if (cancel) return
            const address = data.address || {}
            const name = address.city || address.town || address.village || address.county || "Your area"
            const country = address.country || ""
            setPlace({
              name: country ? `${name}, ${country}` : name,
              lat: latitude,
              lon: longitude,
            })
          })
          .catch(() => {
            if (!cancel) setPlace({ name: "Your area", lat: latitude, lon: longitude })
          })
      },
      () => {
        if (!cancel) setPlace(LONDON)
      },
      { timeout: 7000, maximumAge: 600000 }
    )
    return () => {
      cancel = true
      window.clearTimeout(backup)
    }
      // fixed is read from the render that changed lat/lon/name.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedLat, fixedLon, fixedName, locate, query?.lat, query?.lon, query?.city, query?.nogeo])

  return place
}
