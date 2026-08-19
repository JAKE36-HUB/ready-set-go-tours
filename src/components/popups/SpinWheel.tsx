"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

const PRIZES = [
  { label: "10% OFF", color: "#f59e0b" },
  { label: "15% OFF", color: "#10b981" },
  { label: "20% OFF", color: "#8b5cf6" },
  { label: "Free Brochure", color: "#0ea5e9" },
  { label: "25% OFF", color: "#ec4899" },
  { label: "Free Night", color: "#ef4444" },
  { label: "5% OFF", color: "#facc15" },
  { label: "Free Upgrade", color: "#14b8a6" },
]

interface Props {
  promoCode: string
  onWin: (prize: string) => void
}

export function SpinWheel({ promoCode, onWin }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const spinsRef = useRef(0)

  function spin() {
    if (spinning) return
    setResult(null)
    setSpinning(true)
    spinsRef.current += 1
    const target = 360 * (4 + spinsRef.current % 3) + Math.floor(Math.random() * 360)
    const prizeIndex = Math.floor(Math.random() * PRIZES.length)
    setRotation((r) => r + target)
    setTimeout(() => {
      const prize = PRIZES[prizeIndex].label
      setResult(prize)
      setSpinning(false)
      onWin(prize)
    }, 4300)
  }

  const size = 260
  const cx = size / 2
  const segAngle = 360 / PRIZES.length

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: rotation }}
          transition={{ duration: 4.2, ease: [0.17, 0.67, 0.2, 1] }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
            {PRIZES.map((p, i) => {
              const start = i * segAngle
              return (
                <path
                  key={p.label}
                  d={describeArc(cx, cx, cx - 6, start, start + segAngle)}
                  fill={p.color}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
              )
            })}
            {PRIZES.map((p, i) => {
              const mid = ((i + 0.5) * segAngle * Math.PI) / 180
              const r = cx * 0.66
              const x = cx + r * Math.cos(mid)
              const y = cx + r * Math.sin(mid)
              return (
                <text
                  key={p.label + "t"}
                  x={x}
                  y={y}
                  fill="#fff"
                  fontSize="13"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${(i + 0.5) * segAngle}, ${x}, ${y})`}
                >
                  {p.label}
                </text>
              )
            })}
          </svg>
        </motion.div>
        <div
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full w-16 h-16
            bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg border-4 border-white"
        >
          {spinning ? <span className="animate-spin">🎲</span> : "🎁"}
        </div>
        <div
          className="absolute top-[-6px] left-1/2 -translate-x-1/2 z-10 text-2xl"
          style={{ transform: "translateX(-50%) rotate(180deg)" }}
        >
          🔺
        </div>
      </div>

      {result ? (
        <div className="text-center">
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            You won: {result}!
          </p>
          {promoCode && (
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
              Use code <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{promoCode}</span> at booking
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={spin}
          disabled={spinning}
          className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-2.5 text-sm font-bold text-white shadow-lg
            hover:from-amber-400 hover:to-orange-400 active:scale-95 transition disabled:opacity-60"
        >
          {spinning ? "Spinning..." : "Spin the Wheel 🎡"}
        </button>
      )}
    </div>
  )
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, r, endAngle)
  const end = polar(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1"
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
