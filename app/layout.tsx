import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ROOF — Weather, Honestly",
  description: "What the weather actually means. City by city.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; width: 100%; }
          body { font-family: 'Cabinet Grotesk', Inter, sans-serif; }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, width: "100%" }}>{children}</body>
    </html>
  )
}
