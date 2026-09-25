"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, Zap, TrendingUp, Globe, Search, RefreshCw, Activity, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Conversion {
  id: number
  session_id: string
  type: string
  label: string
  details: string
  page: string
  country: string
  city: string
  created_at: string
}

interface Stats {
  todayCount: number
  weekCount: number
  total: number
  byType: { type: string; count: number }[]
  topPages: { page: string; count: number }[]
}

const TYPE_STYLES: Record<string, string> = {
  whatsapp: "bg-burgundy-500/10 text-burgundy-600 dark:text-burgundy-400 border-burgundy-500/30",
  chat: "bg-burgundy-500/10 text-burgundy-600 dark:text-burgundy-400 border-burgundy-500/30",
  contact: "bg-burgundy-500/10 text-burgundy-600 dark:text-burgundy-400 border-burgundy-500/30",
  booking: "bg-burgundy-500/10 text-burgundy-600 dark:text-burgundy-400 border-burgundy-500/30",
  quote: "bg-burgundy-500/10 text-burgundy-600 dark:text-burgundy-400 border-burgundy-500/30",
  lead: "bg-burgundy-500/10 text-burgundy-600 dark:text-burgundy-400 border-burgundy-500/30",
}

const TYPE_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  chat: "Live Chat",
  contact: "Contact Form",
  booking: "Booking",
  quote: "Itinerary Quote",
  lead: "Lead",
}

function timeAgo(date: string) {
  const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (sec < 60) return "just now"
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  return `${days}d ago`
}

export default function AdminConversions() {
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [stats, setStats] = useState<Stats>({ todayCount: 0, weekCount: 0, total: 0, byType: [], topPages: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  async function loadData() {
    try {
      const res = await fetch(`/api/admin/conversions?limit=200`)
      if (!res.ok) return
      const json = await res.json()
      setConversions(json.conversions || [])
      setStats(json.stats || { todayCount: 0, weekCount: 0, total: 0, byType: [], topPages: [] })
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => { await loadData() })()
  }, [])

  const filtered = conversions.filter((c) => {
    if (typeFilter && c.type !== typeFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (c.label || "").toLowerCase().includes(q) ||
      (c.details || "").toLowerCase().includes(q) ||
      (c.page || "").toLowerCase().includes(q) ||
      (c.type || "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] bg-burgundy-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-burgundy-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burgundy-500 to-burgundy-400 flex items-center justify-center shadow-lg shadow-burgundy-500/30">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Conversion Tracking</h1>
              <p className="text-sm text-slate-400">Every conversion also fires your Google Ads tag</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Zap className="w-3.5 h-3.5" />Today
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{stats.todayCount}</p>
          <p className="text-xs text-slate-400">conversions</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />This Week
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{stats.weekCount}</p>
          <p className="text-xs text-slate-400">conversions</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5" />Recorded
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{stats.total}</p>
          <p className="text-xs text-slate-400">total events</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Inbox className="w-3.5 h-3.5" />Top Source
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {stats.byType[0] ? (TYPE_LABELS[stats.byType[0].type] || stats.byType[0].type) : "—"}
          </p>
          <p className="text-xs text-slate-400">{stats.byType[0]?.count || 0} events</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-burgundy-500" />By Source
          </h3>
          <div className="space-y-2">
            {stats.byType.map((t) => (
              <div key={t.type} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 truncate">{TYPE_LABELS[t.type] || t.type}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 ml-2">{t.count}</span>
              </div>
            ))}
            {stats.byType.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No data yet</p>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-6 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-burgundy-500" />Top Pages
          </h3>
          <div className="space-y-2">
            {stats.topPages.map((p) => (
              <div key={p.page} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 truncate">{p.page || "/"}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 ml-2">{p.count}</span>
              </div>
            ))}
            {stats.topPages.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No data yet</p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-burgundy-500" />Recent Conversions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Last 200 events</p>
            </div>
            <div className="flex items-center gap-2">
              {Object.keys(TYPE_LABELS).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(typeFilter === t ? "" : t)}
                  className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                    typeFilter === t
                      ? "bg-burgundy-500/10 text-burgundy-600 dark:text-burgundy-400 border-burgundy-500/40"
                      : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..." className="h-8 pl-8 text-xs w-52" />
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={loadData}>
              <RefreshCw className="w-3 h-3 mr-1" />Refresh
            </Button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Target className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No conversions recorded yet</p>
              <p className="text-xs mt-1">Conversions will appear once visitors act on the site</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left font-medium text-slate-500 pb-2 pr-2">Source</th>
                    <th className="text-left font-medium text-slate-500 pb-2 pr-2 hidden md:table-cell">Details</th>
                    <th className="text-left font-medium text-slate-500 pb-2 pr-2 hidden sm:table-cell">Page</th>
                    <th className="text-right font-medium text-slate-500 pb-2 pr-2">Location</th>
                    <th className="text-right font-medium text-slate-500 pb-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((c, i) => (
                      <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                        className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 pr-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${TYPE_STYLES[c.type] || TYPE_STYLES.lead}`}>
                              {TYPE_LABELS[c.type] || c.type}
                            </span>
                            {c.label && c.label !== (TYPE_LABELS[c.type] || c.type) && (
                              <span className="text-slate-600 dark:text-slate-200 font-medium">{c.label}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 pr-2 hidden md:table-cell">
                          <span className="text-slate-400 truncate block max-w-[200px]">{c.details || "—"}</span>
                        </td>
                        <td className="py-2.5 pr-2 hidden sm:table-cell">
                          <span className="text-slate-400 truncate block max-w-[120px]">{c.page || "/"}</span>
                        </td>
                        <td className="py-2.5 pr-2 text-right">
                          <span className="text-slate-600 dark:text-slate-400">{[c.city, c.country].filter(Boolean).join(", ") || "—"}</span>
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="text-slate-400 tabular-nums">{timeAgo(c.created_at)}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}