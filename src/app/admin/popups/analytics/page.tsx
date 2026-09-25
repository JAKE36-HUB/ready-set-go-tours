"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BarChart3, Eye, MousePointerClick, Trophy, Wallet, TrendingUp, TrendingDown, FlaskConical, RefreshCw, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PopupStat {
  id: number
  name: string
  type: string
  status: string
  variant: string
  priority: number
  variantOf: number | null
  impressions: number
  clicks: number
  whatsappClicks: number
  conversions: number
  dismisses: number
  avgDuration: number
  ctr: number
  dismissRate: number
  revenue: number
}

interface ABGroup {
  id: number
  name: string
  variants: PopupStat[]
}

export default function PopupAnalyticsPage() {
  const router = useRouter()
  const [popups, setPopups] = useState<PopupStat[]>([])
  const [abGroups, setABGroups] = useState<ABGroup[]>([])
  const [best, setBest] = useState<PopupStat | null>(null)
  const [worst, setWorst] = useState<PopupStat | null>(null)
  const [totals, setTotals] = useState({ impressions: 0, clicks: 0, whatsappClicks: 0, conversions: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"table" | "ab">("table")

  async function load() {
    try {
      const res = await fetch("/api/admin/popups/analytics")
      const j = await res.json()
      setPopups(j.popups || [])
      setABGroups(j.abGroups || [])
      setBest(j.best || null)
      setWorst(j.worst || null)
      setTotals(j.totals || { impressions: 0, clicks: 0, whatsappClicks: 0, conversions: 0, revenue: 0 })
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => {
    ;(async () => { await load() })()
  }, [])

  function fmtDuration(ms: number) {
    if (!ms) return "—"
    const s = Math.floor(ms / 1000)
    return `${s}s`
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popup Analytics</h2>
              <p className="text-xs text-slate-500">Campaign performance dashboard</p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-9" onClick={load}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" />Refresh
        </Button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Impressions", value: totals.impressions.toLocaleString(), icon: Eye, color: "text-sky-500" },
          { label: "Clicks", value: totals.clicks.toLocaleString(), icon: MousePointerClick, color: "text-amber-500" },
          { label: "WhatsApp Clicks", value: totals.whatsappClicks.toLocaleString(), icon: TrendingUp, color: "text-emerald-500" },
          { label: "Conversions", value: totals.conversions.toLocaleString(), icon: Trophy, color: "text-violet-500" },
          { label: "Est. Revenue", value: `$${totals.revenue.toLocaleString()}`, icon: Wallet, color: "text-fuchsia-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <s.icon className={cn("w-3.5 h-3.5", s.color)} />{s.label}
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {best && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Best Performing</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{best.name}</p>
              <p className="text-xs text-slate-500">{best.ctr.toFixed(1)}% CTR · {best.impressions} impressions</p>
            </div>
          </div>
        )}
        {worst && (
          <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/30 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">Needs Attention</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{worst.name}</p>
              <p className="text-xs text-slate-500">{worst.ctr.toFixed(1)}% CTR · {worst.dismissRate.toFixed(1)}% dismiss rate</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant={view === "table" ? "default" : "outline"} className={view === "table" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-8" : "h-8"} onClick={() => setView("table")}>
          <BarChart3 className="w-3.5 h-3.5 mr-1" />All Popups
        </Button>
        <Button size="sm" variant={view === "ab" ? "default" : "outline"} className={view === "ab" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-8" : "h-8"} onClick={() => setView("ab")}>
          <FlaskConical className="w-3.5 h-3.5 mr-1" />A/B Tests
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : view === "table" ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left font-medium text-slate-500 px-4 py-3">Popup</th>
                  <th className="text-right font-medium text-slate-500 px-3 py-3">Impr.</th>
                  <th className="text-right font-medium text-slate-500 px-3 py-3">Clicks</th>
                  <th className="text-right font-medium text-slate-500 px-3 py-3">WA</th>
                  <th className="text-right font-medium text-slate-500 px-3 py-3">CTR</th>
                  <th className="text-right font-medium text-slate-500 px-3 py-3">Conv.</th>
                  <th className="text-right font-medium text-slate-500 px-3 py-3">Dismiss%</th>
                  <th className="text-right font-medium text-slate-500 px-3 py-3">Avg Open</th>
                  <th className="text-right font-medium text-slate-500 px-3 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {popups.map((p) => (
                  <tr key={p.id + p.variant} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{p.name}</span>
                      {p.variantOf ? (
                        <span className={cn("ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded", p.variant === "B" ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400" : "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400")}>
                          {p.variant}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-600 dark:text-slate-300 tabular-nums">{p.impressions}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600 dark:text-slate-300 tabular-nums">{p.clicks}</td>
                    <td className="px-3 py-2.5 text-right text-emerald-500 tabular-nums">{p.whatsappClicks}</td>
                    <td className={cn("px-3 py-2.5 text-right font-semibold tabular-nums", p.ctr >= 5 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-300")}>
                      {p.ctr.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2.5 text-right text-violet-600 dark:text-violet-400 tabular-nums">{p.conversions}</td>
                    <td className="px-3 py-2.5 text-right text-slate-500 dark:text-slate-400 tabular-nums">{p.dismissRate.toFixed(1)}%</td>
                    <td className="px-3 py-2.5 text-right text-slate-500 dark:text-slate-400 tabular-nums">
                      <span className="inline-flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{fmtDuration(p.avgDuration)}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-fuchsia-600 dark:text-fuchsia-400 font-semibold tabular-nums">${p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
                {popups.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-400">No data yet — impressions will appear once popups are shown to visitors</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {abGroups.length === 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
              <FlaskConical className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No A/B tests running</p>
              <p className="text-xs text-slate-400 mt-1">Create a popup variant (B) of any popup to split traffic and compare results</p>
            </div>
          )}
          {abGroups.map((g) => {
            const a = g.variants.find((v) => v.variant === "A")
            const b = g.variants.find((v) => v.variant === "B")
            if (!a || !b) return null
            const winner = a.ctr >= b.ctr ? a : b
            const lift = a.ctr > 0 || b.ctr > 0 ? Math.abs(((b.ctr - a.ctr) / Math.max(a.ctr, b.ctr, 0.001)) * 100) : 0
            return (
              <div key={g.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{g.name}</h3>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    {winner.variant} winning by {lift.toFixed(1)}%
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[a, b].map((v) => (
                    <div key={v.variant} className={cn("rounded-lg border p-4", winner.variant === v.variant ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20" : "border-slate-200 dark:border-slate-700")}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded", v.variant === "B" ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400" : "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400")}>
                          Variant {v.variant}
                        </span>
                        {winner.variant === v.variant && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">🏆 WINNER</span>}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{v.impressions}</p>
                          <p className="text-[10px] text-slate-400">Impressions</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{v.ctr.toFixed(1)}%</p>
                          <p className="text-[10px] text-slate-400">CTR</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{v.conversions}</p>
                          <p className="text-[10px] text-slate-400">Conversions</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
