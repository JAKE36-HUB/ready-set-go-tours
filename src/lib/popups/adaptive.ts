"use client"

import { useEffect, useState } from "react"

export type Breakpoint = "mobile" | "tablet" | "desktop"

export function breakpointOf(vw: number): Breakpoint {
  if (vw < 640) return "mobile"
  if (vw < 1024) return "tablet"
  return "desktop"
}

export interface SmartLayout {
  popupW: number
  popupH: number
  imageH: number
  imageW: number
  showBackdrop: boolean
}

export interface LayoutOpts {
  imgW: number
  imgH: number
  vw: number
  vh: number
  chromeH: number
}

/**
 * Smart adaptive layout engine.
 * Fits the image with object-contain (never cropped, never distorted),
 * sizes the popup AROUND the image, never lets the image shrink below
 * a usable minimum, and stays inside the viewport with no desktop scroll.
 */
export function computeSmartLayout(opts: LayoutOpts): SmartLayout {
  const { imgW, imgH, vw, vh, chromeH } = opts
  const bp = breakpointOf(vw)

  if (!imgW || !imgH) {
    return { popupW: 0, popupH: 0, imageH: 0, imageW: 0, showBackdrop: false }
  }

  // Viewport caps per breakpoint
  const maxPopupW =
    bp === "mobile" ? Math.min(vw * 0.94, 400) : bp === "tablet" ? Math.min(vw * 0.85, 560) : Math.min(vw * 0.8, 660)
  const maxPopupH = bp === "mobile" ? vh * 0.9 : vh * 0.88

  const padX = 48 // card horizontal padding around the image
  const availW = Math.max(200, maxPopupW - padX)
  const availH = Math.max(220, maxPopupH - chromeH)

  // Minimum image width so it never looks like a thumbnail
  const minImgW = bp === "mobile" ? Math.min(250, vw * 0.78) : bp === "tablet" ? 300 : 340

  // Contain fit: largest possible display preserving the aspect ratio
  const scale = Math.min(availW / imgW, availH / imgH)
  let fitW = imgW * scale
  let fitH = imgH * scale

  // Never-tiny bump: grow the image if there is vertical room
  if (fitW < minImgW && fitH < availH - 1) {
    const s2 = Math.min(minImgW / imgW, availH / imgH)
    fitW = imgW * s2
    fitH = imgH * s2
  }

  const popupW = Math.round(
    Math.min(Math.max(fitW + padX, bp === "mobile" ? Math.min(300, vw * 0.92) : 340), maxPopupW)
  )
  const imageH = Math.round(Math.min(fitH, maxPopupH - chromeH))
  const imageW = Math.round((imageH / imgH) * imgW)
  const popupH = Math.round(Math.min(imageH + chromeH, maxPopupH))

  // Blurred cinematic backdrop fills any letterboxing left by contain
  const showBackdrop = imageW < popupW - 4 || fitW < availW - 4

  return { popupW, popupH, imageH, imageW, showBackdrop }
}

export function useViewport() {
  const [vp, setVp] = useState(() => ({
    vw: typeof window !== "undefined" ? window.innerWidth : 1280,
    vh: typeof window !== "undefined" ? window.innerHeight : 800,
  }))

  useEffect(() => {
    const onResize = () => setVp({ vw: window.innerWidth, vh: window.innerHeight })
    window.addEventListener("resize", onResize)
    window.addEventListener("orientationchange", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("orientationchange", onResize)
    }
  }, [])

  return vp
}
