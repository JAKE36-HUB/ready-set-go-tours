"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

interface Props {
  prize: string
  promoCode: string
  onRevealed: () => void
}

const GRAY = "#cbd5e1"

export function ScratchCard({ prize, promoCode, onRevealed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const draggingRef = useRef(false)
  const revealedRef = useRef(false)
  const [revealed, setRevealed] = useState(false)

  const W = 280
  const H = 110
  const dpr = Math.min(2, window.devicePixelRatio || 1)

  function init() {
    const canvas = canvasRef.current
    if (!canvas || ctxRef.current) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctxRef.current = ctx
    ctx.scale(dpr, dpr)
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, "#94a3b8")
    grad.addColorStop(1, "#64748b")
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(0, 0, W, H, 14)
    ctx.fill()
    ctx.fillStyle = "#334155"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("SCRATCH HERE 🎟️", W / 2, H / 2)
  }

  function scratch(x: number, y: number) {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, 16, 0, Math.PI * 2)
    ctx.fill()

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const px = img.data
    let cleared = 0
    const total = px.length / 4
    for (let i = 3; i < px.length; i += 4) {
      if (px[i] === 0) cleared++
    }
    if (!revealedRef.current && cleared / total > 0.55) {
      revealedRef.current = true
      setRevealed(true)
      onRevealed()
    }
  }

  function pos(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative overflow-hidden rounded-xl" style={{ width: W, height: H }}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
          <div className="text-center px-4">
            <p className="text-lg font-extrabold text-slate-900">{revealed ? `🎉 ${prize}` : "???"}</p>
            {promoCode && (
              <p className="text-xs mt-0.5 font-mono font-bold text-amber-700">CODE: {promoCode}</p>
            )}
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={W * dpr}
          height={H * dpr}
          style={{ width: W, height: H }}
          className="absolute inset-0 touch-none cursor-pointer"
          onPointerDown={(e) => {
            draggingRef.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            scratch(pos(e).x, pos(e).y)
          }}
          onPointerMove={(e) => {
            if (draggingRef.current) {
              const p = pos(e)
              scratch(p.x, p.y)
            }
          }}
          onPointerUp={() => (draggingRef.current = false)}
          onPointerLeave={() => (draggingRef.current = false)}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        className="text-xs text-slate-500 dark:text-slate-400 text-center"
      >
        Scratch to reveal your reward!
      </motion.p>
    </div>
  )
}
