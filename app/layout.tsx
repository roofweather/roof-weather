import type { Metadata, Viewport } from "next"
import "./base.css"
import "./front.css"

const site = "https://www.roofweather.app"

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "ROOF. Weather, honestly.",
    template: "%s",
  },
  description: "What the weather actually means. City by city.",
  appleWebApp: { capable: true, title: "ROOF", statusBarStyle: "default" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" href="/fonts/cabinet-grotesk-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/cabinet-grotesk-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/cabinet-grotesk-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0, width: "100%" }}>{children}</body>
    </html>
  )
}
