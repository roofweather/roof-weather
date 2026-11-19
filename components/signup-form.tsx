"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SignupForm({
  city = "",
  suggestCity = false,
}: {
  city?: string
  suggestCity?: boolean
}) {
  const baseId = useId()
  const edited = useRef(false)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [cityValue, setCityValue] = useState(city)
  const [website, setWebsite] = useState("")
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!edited.current && city) setCityValue(city)
  }, [city])

  useEffect(() => {
    if (!suggestCity || typeof navigator === "undefined" || !navigator.geolocation) return
    let cancel = false
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          .then((response) => response.json())
          .then((data) => {
            if (cancel || edited.current) return
            const address = data.address || {}
            const name = address.city || address.town || address.village || ""
            if (name) setCityValue(name)
          })
          .catch(() => {})
      },
      () => {},
      { timeout: 7000, maximumAge: 600000 }
    )
    return () => {
      cancel = true
    }
  }, [suggestCity])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextEmail = email.trim()
    if (!nextEmail) {
      setError("Add your email so we know where to send it.")
      return
    }
    if (!EMAIL.test(nextEmail)) {
      setError("That email does not look right.")
      return
    }
    setError("")
    setSending(true)
    try {
      const params = new URLSearchParams(window.location.search)
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: nextEmail,
          firstName: firstName.trim(),
          city: cityValue.trim(),
          website,
          source: window.location.pathname,
          utm_source: params.get("utm_source") || "",
          utm_medium: params.get("utm_medium") || "",
          utm_campaign: params.get("utm_campaign") || "",
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong. Please try again.")
        return
      }
      setDone(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="join-done" role="status">
        <p className="join-done-title">You&apos;re in</p>
        <p>We&apos;ll send the morning briefing to {email.trim()}.</p>
      </div>
    )
  }

  const errorId = `${baseId}-error`
  return (
    <form className="join-form" onSubmit={onSubmit} noValidate>
      <div className="join-hp" aria-hidden="true">
        <label htmlFor={`${baseId}-website`}>Website</label>
        <input
          id={`${baseId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <label htmlFor={`${baseId}-email`}>
        <span>Email</span>
        <input
          id={`${baseId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          value={email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label htmlFor={`${baseId}-name`}>
        <span>First name <em>(optional)</em></span>
        <input
          id={`${baseId}-name`}
          name="given-name"
          type="text"
          autoComplete="given-name"
          maxLength={60}
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
      </label>
      <label htmlFor={`${baseId}-city`}>
        <span>City <em>(optional)</em></span>
        <input
          id={`${baseId}-city`}
          name="city"
          type="text"
          autoComplete="address-level2"
          maxLength={80}
          value={cityValue}
          onChange={(event) => {
            edited.current = true
            setCityValue(event.target.value)
          }}
        />
      </label>
      {error ? (
        <p className="join-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={sending}>
        {sending ? "Sending…" : "Join free"}
      </button>
    </form>
  )
}
