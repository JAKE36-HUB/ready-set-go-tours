"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { X, Download, ZoomIn, ZoomOut } from "lucide-react"

interface Props {
  src: string
  alt: string
  onClose: () => void
}

export default function ImageLightbox({ src, alt, onClose }: Props) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastPinchDist = useRef(0)

  const resetZoom = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const zoomAtPoint = useCallback((newScale: number, clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const clamped = Math.max(0.5, Math.min(6, newScale))
    const ratio = clamped / scale
    setScale(clamped)
    setPosition((prev) => ({
      x: (x - centerX) - ratio * ((x - centerX) - prev.x),
      y: (y - centerY) - ratio * ((y - centerY) - prev.y),
    }))
  }, [scale])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.15 : 0.15
    zoomAtPoint(scale + delta, e.clientX, e.clientY)
  }, [scale, zoomAtPoint])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (scale > 1.5) { resetZoom(); return }
    zoomAtPoint(2.5, e.clientX, e.clientY)
  }, [scale, zoomAtPoint, resetZoom])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }, [scale, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  // Pinch
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastPinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const delta = (dist - lastPinchDist.current) * 0.01
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      zoomAtPoint(scale + delta, midX, midY)
      lastPinchDist.current = dist
    }
  }, [scale, zoomAtPoint])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <button onClick={() => zoomAtPoint(scale + 0.5, window.innerWidth / 2, window.innerHeight / 2)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/60 tabular-nums w-10 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => zoomAtPoint(scale - 0.5, window.innerWidth / 2, window.innerHeight / 2)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <a href={src} download target="_blank" rel="noreferrer"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <Download className="w-4 h-4" />
          </a>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          className="max-w-[95%] max-h-[90vh] object-contain transition-transform duration-75"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            imageRendering: "auto",
          }}
        />
      </div>

      {/* Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/30">
        Scroll to zoom &middot; Drag to pan &middot; Double-click to reset
      </div>
    </motion.div>
  )
}
