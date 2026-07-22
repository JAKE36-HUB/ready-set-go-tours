"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Eye, Clock, Globe, ArrowUpDown, Search, RefreshCw, Activity } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Visitor {
  id: number
  session_id: string
  page: string
  referrer: string
  user_agent: string
  ip: string
  country: string
  city: string
  entered_at: string
  last_active_at: string
  duration_seconds: number
}

interface Stats {
  todayVisitors: number
  todayViews: number
  avgDuration: number
  totalVisitors: number
  topPages: { page: string; count: number }[]
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}m ${sec}s`
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

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<Stats>({ todayVisitors: 0, todayViews: 0, avgDuration: 0, totalVisitors: 0, topPages: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<"entered_at" | "duration_seconds">("entered_at")
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc")

  async function loadData() {
    setLoading(true)
    try {
      const sb = getSupabase()
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: all } = await sb
        .from("visitors")
        .select("*")
        .order(sortField, { ascending: sortDir === "asc" })
        .limit(200)

      if (!all) return

      setVisitors(all as Visitor[])

      const todayRecords = all.filter((v: any) => new Date(v.entered_at) >= today)
      const todaySessions = new Set(todayRecords.map((v: any) => v.session_id))
      const totalDuration = all.reduce((sum: number, v: any) => sum + (v.duration_seconds || 0), 0)
      const totalSessions = new Set(all.map((v: any) => v.session_id))

      const pageCounts: Record<string, number> = {}
      for (const v of all) {
        pageCounts[v.page] = (pageCounts[v.page] || 0) + 1
      }
      const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([page, count]) => ({ page, count }))

      setStats({
        todayVisitors: todaySessions.size,
        todayViews: todayRecords.length,
        avgDuration: totalSessions.size > 0 ? Math.round(totalDuration / totalSessions.size) : 0,
        totalVisitors: totalSessions.size,
        topPages,
      })
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [sortField, sortDir])

  const filtered = visitors.filter((v) => {
    if (!search) return true
    const q = search.toLowerCase()
    return v.page.toLowerCase().includes(q) || v.ip.includes(q) || v.country.toLowerCase().includes(q) || v.session_id.toLowerCase().includes(q)
  })

  function toggleSort(field: "entered_at" | "duration_seconds") {
    if (sortField === field) setSortDir((d) => (d === "desc" ? "asc" : "desc"))
    else { setSortField(field); setSortDir("desc") }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-violet-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Visitor Analytics</h1>
              <p className="text-sm text-slate-400">Track site visitors and page views</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5" />Today
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{stats.todayVisitors}</p>
          <p className="text-xs text-slate-400">unique visitors</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Eye className="w-3.5 h-3.5" />Today
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{stats.todayViews}</p>
          <p className="text-xs text-slate-400">page views</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5" />Avg Session
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{formatDuration(stats.avgDuration)}</p>
          <p className="text-xs text-slate-400">per visitor</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Globe className="w-3.5 h-3.5" />All Time
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{stats.totalVisitors}</p>
          <p className="text-xs text-slate-400">unique visitors</p>
        </motion.div>
      </div>

      {/* Top Pages + Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-500" />Top Pages
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

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />Recent Visits
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Last 200 page views</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..." className="h-8 pl-8 text-xs w-40" />
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={loadData}>
                <RefreshCw className="w-3 h-3 mr-1" />Refresh
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No visits recorded yet</p>
              <p className="text-xs mt-1">Visit data will appear once visitors browse the site</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left font-medium text-slate-500 pb-2 pr-2">Page</th>
                    <th className="text-left font-medium text-slate-500 pb-2 pr-2">IP / Location</th>
                    <th className="text-left font-medium text-slate-500 pb-2 pr-2 hidden md:table-cell">Referrer</th>
                    <th className="text-right font-medium text-slate-500 pb-2 pr-2 cursor-pointer select-none" onClick={() => toggleSort("duration_seconds")}>
                      <span className="flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />Duration <ArrowUpDown className="w-2.5 h-2.5" /></span>
                    </th>
                    <th className="text-right font-medium text-slate-500 pb-2 cursor-pointer select-none" onClick={() => toggleSort("entered_at")}>
                      <span className="flex items-center gap-1 justify-end">Time <ArrowUpDown className="w-2.5 h-2.5" /></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((v, i) => (
                      <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                        className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 pr-2">
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{v.page || "/"}</span>
                        </td>
                        <td className="py-2.5 pr-2">
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">{v.ip || "—"}</span>
                            {(v.country || v.city) && (
                              <span className="text-slate-400 ml-1">({[v.city, v.country].filter(Boolean).join(", ")})</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 pr-2 hidden md:table-cell">
                          <span className="text-slate-400 truncate block max-w-[150px]">{v.referrer ? new URL(v.referrer).hostname : "—"}</span>
                        </td>
                        <td className="py-2.5 pr-2 text-right">
                          <span className="text-slate-600 dark:text-slate-400 tabular-nums">{formatDuration(v.duration_seconds)}</span>
                        </td>
                        <td className="py-2.5 text-right">
                          <span className="text-slate-400 tabular-nums">{timeAgo(v.entered_at)}</span>
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
