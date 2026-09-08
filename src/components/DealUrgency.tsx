"use client"

import { Flame, Users } from "lucide-react"
import { cn } from "@/lib/utils"

function daysUntil(dateStr: string): number | null {
  const target = new Date(dateStr)
  if (Number.isNaN(target.getTime())) return null
  const diff = target.getTime() - Date.now()
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0)
}

function spotsLeft(id: number): number {
  return 4 + ((id * 7) % 6)
}

function seasonNote() {
  const m = new Date().getMonth() + 1
  if (m >= 6 && m <= 10) return { label: "Peak migration season", cls: "bg-rose-500/15 text-rose-500", dot: "bg-rose-500" }
  if (m === 12 || m <= 3) return { label: "Calving season", cls: "bg-emerald-500/15 text-emerald-600", dot: "bg-emerald-500" }
  return { label: "Green season savings", cls: "bg-sky-500/15 text-sky-600", dot: "bg-sky-500" }
}

export function DealUrgency({
  dealId,
  validUntil,
  compact = false,
}: {
  dealId: number
  validUntil: string
  compact?: boolean
}) {
  const days = daysUntil(validUntil)
  const spots = spotsLeft(dealId)
  const season = seasonNote()

  const urgency =
    days === null
      ? null
      : days <= 0
        ? { label: "Ends today!", cls: "bg-rose-500/15 text-rose-500", pulse: true }
        : days <= 7
          ? { label: "Ends this week", cls: "bg-rose-500/15 text-rose-500", pulse: false }
          : { label: `Ends in ${days} days`, cls: "bg-amber-500/15 text-amber-600", pulse: false }

  const size = compact ? "text-[10px] px-2 py-1" : "text-xs px-2.5 py-1"

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {urgency && (
        <span className={cn("inline-flex items-center gap-1 font-semibold rounded-full ring-1 ring-current/10", size, urgency.cls)}>
          <Flame className={cn("w-3 h-3", urgency.pulse && "animate-pulse")} />
          {urgency.label}
        </span>
      )}
      <span className={cn("inline-flex items-center gap-1 font-semibold rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-300 ring-1 ring-current/10", size)}>
        <Users className="w-3 h-3" />
        Only {spots} spots left
      </span>
      <span className={cn("inline-flex items-center gap-1 font-semibold rounded-full ring-1 ring-current/10", size, season.cls)}>
        <span className={cn("w-1.5 h-1.5 rounded-full", season.dot)} />
        {season.label}
      </span>
    </div>
  )
}