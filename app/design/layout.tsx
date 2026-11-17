import type { Metadata, Viewport } from "next"
import "./base.css"
import "./a/sky.css"
import "./b/poster.css"
import "./c/dial.css"

export const metadata: Metadata = {
  title: { default: "Design directions", template: "%s · ROOF" },
  description: "Prototype design directions for ROOF. These pages are not the live site.",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
}

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return children
}
