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
}

export function AdaptiveImage({
  src,
  alt = "",
  className,
  maxHeight = 560,
  overlay = false,
  sizes = "(max-width: 640px) 92vw, 640px",
  onMeasure,
}: AdaptiveImageProps) {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const onMeasureRef = useRef(onMeasure)
  useEffect(() => {
    onMeasureRef.current = onMeasure
  }, [onMeasure])

  useEffect(() => {
    let active = true
    setDims(null)
    const img = new GlobalImage()
    img.onload = () => {
      if (!active) return
      const w = img.naturalWidth || 16
      const h = img.naturalHeight || 9
      setDims({ w, h })
      onMeasureRef.current?.(w / h > 1.15 ? "landscape" : w / h < 0.85 ? "portrait" : "square", w / h)
    }
    img.onerror = () => {
      if (active) setDims({ w: 16, h: 9 })
    }
    img.src = src
    return () => {
      active = false
    }
  }, [src])

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-slate-200 dark:bg-slate-800", className)}
      style={{
        aspectRatio: dims ? `${dims.w} / ${dims.h}` : "16 / 9",
        maxHeight,
      }}
    >
      {dims ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={85}
          loading="lazy"
          className="object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 animate-pulse bg-slate-300 dark:bg-slate-700" />
      )}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
