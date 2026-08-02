"use client"

import { useEffect, useState } from "react"

interface Props {
  endTime: number | null
  compact?: boolean
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function Countdown({ endTime, compact }: Props) {
  const [left, setLeft] = useState(() => (endTime ? Math.max(0, endTime - Date.now()) : 0))

  useEffect(() => {
    if (!endTime) return
    const iv = setInterval(() => {
      setLeft(Math.max(0, endTime - Date.now()))
    }, 1000)
    return () => clearInterval(iv)
  }, [endTime])

  if (!endTime) return null

  const d = Math.floor(left / 86_400_000)
  const h = Math.floor((left % 86_400_000) / 3_600_000)
  const m = Math.floor((left % 3_600_000) / 60_000)
  const s = Math.floor((left % 60_000) / 1000)

  const units = compact
    ? [
        { v: pad(d), l: "d" },
        { v: pad(h), l: "h" },
        { v: pad(m), l: "m" },
        { v: pad(s), l: "s" },
      ]
    : [
        { v: pad(d), l: "Days" },
        { v: pad(h), l: "Hours" },
        { v: pad(m), l: "Mins" },
        { v: pad(s), l: "Secs" },
      ]

  return (
    <div className={`flex items-center justify-center gap-1.5 ${compact ? "" : "gap-2"}`}>
      {units.map((u, i) => (
        <div key={u.l + i} className="flex items-center gap-1.5">
          <div
            className={`flex flex-col items-center justify-center rounded-lg bg-slate-900/70 backdrop-blur-sm
              ${compact ? "px-1.5 py-0.5 min-w-[1.75rem]" : "px-2.5 py-1.5 min-w-[3rem]"}
              border border-white/10`}
          >
            <span className={`font-bold tabular-nums text-white ${compact ? "text-sm" : "text-xl"}`}>{u.v}</span>
            {!compact && <span className="text-[10px] uppercase tracking-wide text-slate-400">{u.l}</span>}
          </div>
          {i < units.length - 1 && <span className="text-slate-500 font-bold">:</span>}
        </div>
      ))}
    </div>
  )
}
