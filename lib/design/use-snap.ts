"use client"

import { useEffect, useRef } from "react"

export function useSnap(count: number, index: number, onIndex: (next: number) => void) {
  const ref = useRef<HTMLDivElement>(null)
  const ignore = useRef(false)
  const fromScroll = useRef(false)
  const armed = useRef(false)

  useEffect(() => {
    armed.current = false
    const arm = window.setTimeout(() => {
      armed.current = true
    }, 350)
    return () => window.clearTimeout(arm)
  }, [count])

  useEffect(() => {
    if (fromScroll.current) {
      fromScroll.current = false
      return
    }
    const root = ref.current
    if (!root) return
    const child = root.querySelectorAll<HTMLElement>("[data-snap]")[index]
    if (!child || index < 0) return
    ignore.current = true
    const left = child.offsetLeft - (root.clientWidth - child.clientWidth) / 2
    root.scrollTo({ left: Math.max(0, left), behavior: "auto" })
    const timer = window.setTimeout(() => {
      ignore.current = false
    }, 80)
    return () => window.clearTimeout(timer)
  }, [index, count])

  function pick(commit: boolean) {
    if (!commit && (ignore.current || !armed.current)) return
    const root = ref.current
    if (!root) return
    const rootRect = root.getBoundingClientRect()
    const center = rootRect.left + rootRect.width / 2
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-snap]"))
    let best = 0
    let bestDistance = Infinity
    items.forEach((item, itemIndex) => {
      const rect = item.getBoundingClientRect()
      const middle = rect.left + rect.width / 2
      const distance = Math.abs(middle - center)
      if (distance < bestDistance) {
        bestDistance = distance
        best = itemIndex
      }
    })
    if (best !== index) {
      fromScroll.current = true
      onIndex(best)
    }
  }

  return {
    ref,
    onScroll: () => pick(false),
    onSettle: () => pick(true),
  }
}
