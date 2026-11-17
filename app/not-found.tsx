import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page not found | ROOF",
  description: "That address is not a ROOF page.",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0D0D0D",
        color: "#F5F4F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <a
        href="/"
        aria-label="ROOF home"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#C8F0E0",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "0.14em",
        }}
      >
        <span>R</span>
        <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
          <path d="M8 0 L16 14 H0 Z" fill="#F0C97A" />
        </svg>
        <span>OF</span>
      </a>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: "-0.03em",
          margin: "28px 0 12px",
          lineHeight: 1.15,
        }}
      >
        This page is not on ROOF
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.6,
          color: "#A8A8A8",
          maxWidth: 420,
          margin: "0 0 28px",
        }}
      >
        We could not find that address. The weather is still here.
      </p>
      <a
        href="/"
        style={{
          display: "inline-block",
          background: "#C8F0E0",
          color: "#0D0D0D",
          padding: "12px 22px",
          borderRadius: 24,
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        Back to the weather
      </a>
    </main>
  )
}
