"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const GlobalImage = globalThis.Image

export type ImageOrientation = "landscape" | "square" | "portrait"

interface AdaptiveImageProps {
  src: string
  alt?: string
  className?: string
  maxHeight?: number
  overlay?: boolean
  sizes?: string
  onMeasure?: (orientation: ImageOrientation, ratio: number) => void
  contain?: boolean
  backdrop?: boolean
  exactHeight?: number
  dims?: { w: number; h: number } | null
  blurUp?: boolean
}

export function AdaptiveImage({
  src,
  alt = "",
  className,
  maxHeight = 560,
  overlay = false,
  sizes = "(max-width: 640px) 92vw, 640px",
  onMeasure,
  contain = false,
  backdrop = false,
  exactHeight,
  dims,
  blurUp = false,
}: AdaptiveImageProps) {
  const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null)
  const [blurUrl, setBlurUrl] = useState<string>("")
  const onMeasureRef = useRef(onMeasure)
  useEffect(() => {
    onMeasureRef.current = onMeasure
  }, [onMeasure])

  useEffect(() => {
    let active = true
    if (!dims) setMeasured(null)
    setBlurUrl("")
    const img = new GlobalImage()
    img.onload = () => {
      if (!active) return
      const w = img.naturalWidth || 16
      const h = img.naturalHeight || 9
      if (!dims) setMeasured({ w, h })
      onMeasureRef.current?.(w / h > 1.15 ? "landscape" : w / h < 0.85 ? "portrait" : "square", w / h)
      if (blurUp) {
        try {
          const c = document.createElement("canvas")
          c.width = 16
          c.height = Math.max(1, Math.round((16 / w) * h))
          const ctx = c.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0, c.width, c.height)
            setBlurUrl(c.toDataURL("image/jpeg", 0.5))
          }
        } catch {
          /* blur placeholder unavailable */
        }
      }
    }
    img.onerror = () => {
      if (active) setMeasured({ w: 16, h: 9 })
    }
    img.src = src
    return () => {
      active = false
    }
  }, [src, dims, blurUp])

  const size = dims || measured || null
  const ratio = size ? size.w / size.h : 16 / 9

  const containerStyle: React.CSSProperties = {
    aspectRatio: exactHeight ? undefined : `${Math.round(ratio * 100)} / 100`,
    maxHeight,
    height: exactHeight ? exactHeight : undefined,
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-slate-200 dark:bg-slate-800", className)}
      style={containerStyle}
    >
      {size ? (
        <>
          {backdrop && (
            <Image
              src={src}
              alt=""
              fill
              sizes={sizes}
              quality={60}
              aria-hidden
              className="object-cover"
              style={{ filter: "blur(32px) saturate(1.2)", transform: "scale(1.15)", zIndex: 0 }}
            />
          )}
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={85}
            loading="lazy"
            placeholder={blurUrl ? "blur" : undefined}
            blurDataURL={blurUrl || undefined}
            className={cn("object-cover object-center", contain && "object-contain")}
            style={{ zIndex: 1 }}
          />
        </>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-slate-300 dark:bg-slate-700" />
      )}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" style={{ zIndex: 2 }} />
      )}
    </div>
  )
}

export interface ImageDims {
  w: number
  h: number
  ratio: number
  orientation: ImageOrientation
}

export function useImageDims(src: string | null | undefined): ImageDims | null {
  const [info, setInfo] = useState<ImageDims | null>(null)

  useEffect(() => {
    if (!src) {
      setInfo(null)
      return
    }
    let active = true
    setInfo(null)
    const img = new GlobalImage()
    img.onload = () => {
      if (!active) return
      const w = img.naturalWidth || 0
      const h = img.naturalHeight || 0
      if (!w || !h) return
      const ratio = Math.round((w / h) * 100) / 100
      setInfo({
        w,
        h,
        ratio,
        orientation: ratio > 1.15 ? "landscape" : ratio < 0.85 ? "portrait" : "square",
      })
    }
    img.onerror = () => {
      if (active) setInfo(null)
    }
    img.src = src
    return () => {
      active = false
    }
  }, [src])

  return info
}

export function SmartImageInfo({ src }: { src: string | null | undefined }) {
  const info = useImageDims(src)

  if (!src || !info) return null

  const badge =
    info.orientation === "portrait"
      ? { label: "Portrait", cls: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400" }
      : info.orientation === "landscape"
        ? { label: "Landscape", cls: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400" }
        : { label: "Square", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" }

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
      <span className="font-mono tabular-nums">
        {info.w} × {info.h}px
      </span>
      <span className="font-mono tabular-nums">· {info.ratio}:1</span>
      <span className={cn("px-1.5 py-0.5 rounded-full font-semibold", badge.cls)}>{badge.label}</span>
      <span className="opacity-70">· popup adapts to this ratio automatically</span>
    </div>
  )
}
