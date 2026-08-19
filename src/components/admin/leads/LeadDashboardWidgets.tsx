"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Timer, TrendingUp, Users, MailOpen, Plane, Wallet, MessageCircle, BellRing, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { LeadStats } from "@/lib/leads/types"
import { formatMoney, formatDateTime } from "@/lib/leads/types"
import { cn } from "@/lib/utils"

export function LeadStatsWidgets() {
  const router = useRouter()
  const { data, isLoading } = useQuery({
    queryKey: ["lead-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/leads/stats", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load stats")
      return (await res.json()) as LeadStats
    },
    refetchInterval: 60000,
  })

  const cards = [
    { label: "New Leads Today", value: data?.new_today ?? "—", icon: Users, cls: "from-sky-500 to-blue-600", key: "new" },
    { label: "Unread Leads", value: data?.unread ?? "—", icon: MailOpen, cls: "from-amber-500 to-orange-600", key: "unread" },
    { label: "Bookings Today", value: data?.bookings_today ?? "—", icon: Plane, cls: "from-emerald-500 to-green-600", key: "booked" },
    { label: "Revenue (month)", value: data ? formatMoney(data.revenue) : "—", icon: Wallet, cls: "from-violet-500 to-purple-600", key: "revenue" },
    { label: "WhatsApp Clicks", value: data?.whatsapp_clicks ?? "—", icon: MessageCircle, cls: "from-green-500 to-teal-600", key: "wa" },
    { label: "Conversion Rate", value: data ? `${data.conversion_rate}%` : "—", icon: TrendingUp, cls: "from-fuchsia-500 to-pink-600", key: "conv" },
    { label: "Avg Response Time", value: data && data.avg_response_time > 0 ? `${data.avg_response_time}h` : "—", icon: Timer, cls: "from-indigo-500 to-blue-600", key: "resp" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => c.key !== "revenue" && c.key !== "resp" && router.push("/admin/leads")}
          className={cn(
            "rounded-2xl p-4 text-white shadow-lg cursor-pointer bg-gradient-to-br",
            c.cls,
            !["revenue", "resp"].includes(c.key) && "hover:scale-[1.02] transition-transform"
          )}
        >
          <div className="flex items-center justify-between">
            <c.icon className="w-5 h-5 text-white/80" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/60">live</span>
          </div>
          <p className="text-2xl font-bold mt-3 tabular-nums">{isLoading ? "…" : c.value}</p>
          <p className="text-[11px] text-white/80 mt-0.5">{c.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

interface ReminderRow {
  id: number
  title: string
  due_at: string
  done: boolean
  lead_id: number | null
  lead_name?: string
}

export function LeadRemindersPanel() {
  const router = useRouter()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/reminders?scope=upcoming", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load reminders")
      return (await res.json()) as { reminders: ReminderRow[] }
    },
    refetchInterval: 60000,
  })
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(iv)
  }, [])

  const reminders = (data?.reminders || []).filter((r) => !r.done).slice(0, 8)
  const overdue = reminders.filter((r) => new Date(r.due_at).getTime() < now)

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 font-bold text-sm">
          <BellRing className="w-4 h-4 text-amber-500" />
          Follow-up Reminders
          {overdue.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              {overdue.length} overdue
            </span>
          )}
        </h3>
        <button onClick={() => refetch()} className="text-[10px] text-slate-400 hover:text-slate-600">Refresh</button>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : reminders.length === 0 ? (
        <p className="text-sm text-slate-400">No upcoming follow-ups. Set reminders from a lead&apos;s detail panel.</p>
      ) : (
        <div className="space-y-2">
          {reminders.map((r) => {
            const isOverdue = new Date(r.due_at).getTime() < now
            return (
              <div
                key={r.id}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 border cursor-pointer transition-colors",
                  isOverdue ? "border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/20 hover:bg-rose-50" : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
                onClick={() => r.lead_id && router.push(`/admin/leads?lead=${r.lead_id}`)}
              >
                <CheckCircle2 className={cn("w-4 h-4 shrink-0", isOverdue ? "text-rose-500" : "text-slate-300")} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{r.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {r.lead_name ? `${r.lead_name} · ` : ""}{formatDateTime(r.due_at)}
                  </p>
                </div>
                {isOverdue && <span className="text-[9px] font-bold text-rose-500 uppercase shrink-0">Overdue</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
