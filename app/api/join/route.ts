import { NextResponse } from "next/server"
import { readSignup } from "@/lib/signup"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "That did not look right. Please try again." }, { status: 400 })
  }

  const result = readSignup(body, request.headers.get("x-vercel-ip-country"))
  if (result.kind === "error") {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  if (result.kind === "drop") {
    return NextResponse.json({ ok: true })
  }

  const webhook = process.env.SIGNUP_WEBHOOK_URL?.trim()
  if (!webhook) {
    console.error("SIGNUP_WEBHOOK_URL is not set. The signup was not saved.")
    return NextResponse.json({ error: "Sign-up is not set up yet. Please try again later." }, { status: 503 })
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.payload),
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) {
      console.error("Signup webhook failed", response.status)
      return NextResponse.json({ error: "We could not save that. Please try again." }, { status: 502 })
    }
  } catch (error) {
    console.error("Signup webhook error", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "We could not save that. Please try again." }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
