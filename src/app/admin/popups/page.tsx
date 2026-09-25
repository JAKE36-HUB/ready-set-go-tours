"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Megaphone, AlertCircle, BarChart3, Users, Eye, MousePointerClick, Trophy, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { TEMPLATE_EMOJIS } from "@/lib/popups/templates"

interface Popup {
  id: number
  title: string
  position: string
  is_active: boolean
  delay_seconds: number
  start_date: string | null
  end_date: string | null
  show_once: boolean
  status: string | null
  priority: number | null
  type: string | null
  template: string | null
  variant_of: number | null
  created_at: string
}

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

export default function PopupsPage() {
  const router = useRouter()
  const [popups, setPopups] = useState<Popup[]>([])
  const [stats, setStats] = useState<PopupStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    try {
      const [res, statRes] = await Promise.all([fetch("/api/admin/popups"), fetch("/api/admin/popups/analytics")])
      const json = await res.json()
      const statJson = await statRes.json()
      if (json.data) setPopups(json.data)
      if (statJson.popups) setStats(statJson.popups)
    } catch { setError("Network error") } finally { setLoading(false) }
  }

  useEffect(() => {
    ;(async () => { await load() })()
  }, [])

  async function handleDuplicate(popup: Popup) {
    const res = await fetch(`/api/admin/popups/${popup.id}`)
    const json = await res.json()
    if (!json.data) return
    const d = json.data
    const dupRes = await fetch("/api/admin/popups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config: { ...(d.config || {}), name: `${d.title} (Copy)`, status: "draft" },
        variant_of: null,
        traffic_split: null,
      }),
    })
    if (dupRes.ok) load()
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this popup? Its analytics and leads history will be kept.")) return
    const res = await fetch(`/api/admin/popups/${id}`, { method: "DELETE" })
    if (res.ok) {
      setPopups((prev) => prev.filter((p) => p.id !== id))
      setStats((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const statFor = (id: number): PopupStat | undefined => stats.find((s) => s.id === id && s.variant === "A")

  const totalImpressions = stats.reduce((a, s) => a + s.impressions, 0)
  const totalClicks = stats.reduce((a, s) => a + s.clicks + s.whatsappClicks, 0)
  const totalConversions = stats.reduce((a, s) => a + s.conversions, 0)
  const totalRevenue = stats.reduce((a, s) => a + s.revenue, 0)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-400 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popup Marketing Engine</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{popups.length} campaigns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => router.push("/admin/popups/leads")}>
            <Users className="w-3.5 h-3.5 mr-1.5" />Leads
          </Button>
          <Button variant="outline" size="sm" className="h-9" onClick={() => router.push("/admin/popups/analytics")}>
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />Analytics
          </Button>
          <Button onClick={() => router.push("/admin/popups/new")}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-400 text-white border-0 hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all h-9">
            <Plus className="w-4 h-4 mr-1.5" />
            New Campaign
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Impressions", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-sky-500" },
          { label: "Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-amber-500" },
          { label: "Conversions", value: totalConversions.toLocaleString(), icon: Trophy, color: "text-emerald-500" },
          { label: "Est. Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: BarChart3, color: "text-fuchsia-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <s.icon className={cn("w-3.5 h-3.5", s.color)} />{s.label}
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      ) : popups.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Megaphone className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No campaigns yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Create your first conversion-optimized popup from a tourism template</p>
          <Button onClick={() => router.push("/admin/popups/new")}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-400 text-white border-0">
            <Plus className="w-4 h-4 mr-1.5" />Create Campaign
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left font-medium text-slate-500 px-4 py-3">Campaign</th>
                  <th className="text-left font-medium text-slate-500 px-4 py-3 hidden md:table-cell">Impressions</th>
                  <th className="text-left font-medium text-slate-500 px-4 py-3 hidden md:table-cell">Clicks</th>
                  <th className="text-left font-medium text-slate-500 px-4 py-3 hidden md:table-cell">CTR</th>
                  <th className="text-left font-medium text-slate-500 px-4 py-3 hidden lg:table-cell">Conv.</th>
                  <th className="text-left font-medium text-slate-500 px-4 py-3">Status</th>
                  <th className="text-right font-medium text-slate-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {popups.map((popup, i) => {
                  const s = statFor(popup.id)
                  const expired = popup.end_date ? new Date(popup.end_date) < new Date() : false
                  const status = popup.status || (popup.is_active ? "active" : "draft")
                  return (
                    <motion.tr key={popup.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 flex items-center justify-center text-base">
                            {popup.template ? TEMPLATE_EMOJIS[popup.template] || "🎯" : "📢"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{popup.title}</span>
                              {popup.variant_of && (
                                <Badge variant="outline" className="text-[10px] border-violet-300 text-violet-600 dark:border-violet-800 dark:text-violet-400">
                                  A/B
                                </Badge>
                              )}
                              {typeof popup.priority === "number" && popup.priority >= 8 && (
                                <span className="text-xs">🔥</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 capitalize truncate">
                              {(popup.type || popup.position || "modal").replace(/-/g, " ")} {s && s.variant !== "A" ? `· Variant ${s.variant}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-600 dark:text-slate-300 tabular-nums">{s?.impressions ?? 0}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-600 dark:text-slate-300 tabular-nums">
                          {(s?.clicks ?? 0) + (s?.whatsappClicks ?? 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={cn("text-xs font-semibold tabular-nums", (s?.ctr ?? 0) >= 5 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400")}>
                          {s ? `${s.ctr.toFixed(1)}%` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-slate-600 dark:text-slate-300 tabular-nums">{s?.conversions ?? 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          expired || status === "expired" ? "border-red-200 text-red-600 dark:border-red-900 dark:text-red-400" :
                          status === "active" ? "border-emerald-200 text-emerald-600 dark:border-emerald-900 dark:text-emerald-400" :
                          status === "scheduled" ? "border-sky-200 text-sky-600 dark:border-sky-900 dark:text-sky-400" :
                          "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"
                        )}>
                          {expired ? "Expired" : status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8"
                            onClick={() => router.push(`/admin/popups/${popup.id}/edit`)}>
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8"
                            title="Duplicate campaign"
                            onClick={() => handleDuplicate(popup)}>
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(popup.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            {popups.filter((p) => (p.status || (p.is_active ? "active" : "draft")) === "active").length} active &middot;{" "}
            {popups.filter((p) => (p.status || (p.is_active ? "active" : "draft")) === "scheduled").length} scheduled &middot;{" "}
            {popups.filter((p) => (p.status || (p.is_active ? "active" : "draft")) === "draft").length} drafts
          </div>
        </motion.div>
      )}
    </div>
  )
}
