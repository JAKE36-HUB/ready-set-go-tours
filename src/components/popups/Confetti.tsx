"use client"

import { useEffect, useRef } from "react"

const COLORS = ["#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#0ea5e9", "#ec4899", "#facc15"]

export function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.scale(dpr, dpr)

    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.4,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vy: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      vr: -0.15 + Math.random() * 0.3,
      sway: Math.random() * Math.PI * 2,
    }))

    let raf = 0
    const start = performance.now()
    const duration = 2600

    const tick = (t: number) => {
      const elapsed = t - start
      if (elapsed > duration) return
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const p of pieces) {
        p.sway += 0.05
        p.x += p.vx + Math.sin(p.sway) * 0.8
        p.y += p.vy
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.max(0, 1 - elapsed / duration)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [active])

  if (!active) return null
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[300] h-full w-full"
      aria-hidden
    />
  )
}
