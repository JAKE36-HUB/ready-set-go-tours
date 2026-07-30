"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, ExternalLink, Megaphone, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Popup {
  id: number
  title: string
  position: string
  is_active: boolean
  delay_seconds: number
  start_date: string | null
  end_date: string | null
  show_once: boolean
  created_at: string
}

export default function PopupsPage() {
  const router = useRouter()
  const [popups, setPopups] = useState<Popup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/popups")
      if (!res.ok) { setError(`Failed to load: ${res.status}`); return }
      const json = await res.json()
      if (json.data) setPopups(json.data)
    } catch { setError("Network error") } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm("Delete this popup?")) return
    const res = await fetch(`/api/admin/popups/${id}`, { method: "DELETE" })
    if (res.ok) setPopups((prev) => prev.filter((p) => p.id !== id))
  }

  function isExpired(p: Popup) {
    if (!p.end_date) return false
    return new Date(p.end_date) < new Date()
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-400 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popups</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{popups.length} popups</p>
          </div>
        </div>
        <Button onClick={() => router.push("/admin/popups/new")}
          className="bg-gradient-to-r from-fuchsia-500 to-pink-400 text-white border-0 hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all h-9">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Popup
        </Button>
      </motion.div>

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
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No popups yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Create your first promotional popup</p>
          <Button onClick={() => router.push("/admin/popups/new")}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-400 text-white border-0">
            <Plus className="w-4 h-4 mr-1.5" />Create Popup
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left font-medium text-slate-500 px-4 py-3">Title</th>
                  <th className="text-left font-medium text-slate-500 px-4 py-3 hidden sm:table-cell">Position</th>
                  <th className="text-left font-medium text-slate-500 px-4 py-3 hidden md:table-cell">Schedule</th>
                  <th className="text-left font-medium text-slate-500 px-4 py-3">Status</th>
                  <th className="text-right font-medium text-slate-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {popups.map((popup, i) => (
                  <motion.tr key={popup.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 flex items-center justify-center">
                          <Megaphone className="w-4 h-4 text-fuchsia-500" />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{popup.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-slate-500 capitalize">{popup.position}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-400">
                        {popup.start_date ? new Date(popup.start_date).toLocaleDateString() : "Any"} &rarr; {popup.end_date ? new Date(popup.end_date).toLocaleDateString() : "Any"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        isExpired(popup) ? "border-red-200 text-red-600 dark:border-red-900 dark:text-red-400" :
                        popup.is_active ? "border-emerald-200 text-emerald-600 dark:border-emerald-900 dark:text-emerald-400" :
                        "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"
                      )}>
                        {isExpired(popup) ? "Expired" : popup.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8"
                          onClick={() => router.push(`/admin/popups/${popup.id}/edit`)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(popup.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            {popups.filter((p) => p.is_active && !isExpired(p)).length} active &middot; {popups.filter((p) => !p.is_active && !isExpired(p)).length} inactive &middot; {popups.filter((p) => isExpired(p)).length} expired
          </div>
        </motion.div>
      )}
    </div>
  )
}
