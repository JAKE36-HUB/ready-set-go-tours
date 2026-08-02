"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Users, Download, Trash2, RefreshCw, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Lead {
  id: number
  popup_id: number | null
  popup_name: string
  variant: string
  name: string
  phone: string
  email: string
  country: string
  destination: string
  travel_date: string
  budget: string
  adults: string
  children: string
  message: string
  source: string
  utm_campaign: string
  page: string
  created_at: string
}

export default function PopupLeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [popupFilter, setPopupFilter] = useState("")
  const [popupNames, setPopupNames] = useState<{ id: number; title: string }[]>([])

  async function load() {
    setLoading(true)
    try {
      const [leadRes, popRes] = await Promise.all([
        fetch("/api/admin/popups/leads"),
        fetch("/api/admin/popups"),
      ])
      const j = await leadRes.json()
      const pj = await popRes.json()
      setLeads(j.data || [])
      setPopupNames((pj.data || []).map((p: any) => ({ id: p.id, title: p.title })))
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm("Delete this lead?")) return
    const res = await fetch(`/api/admin/popups/leads?id=${id}`, { method: "DELETE" })
    if (res.ok) setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  const filtered = leads.filter((l) => {
    if (popupFilter && l.popup_id !== Number(popupFilter)) return false
    if (!search) return true
    const q = search.toLowerCase()
    return [l.name, l.email, l.phone, l.country, l.destination, l.popup_name].some((v) => (v || "").toLowerCase().includes(q))
  })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popup Leads</h2>
              <p className="text-xs text-slate-500">{leads.length} captured leads</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/api/admin/popups/leads/export" download className="inline-flex items-center h-9 px-3 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <Download className="w-3.5 h-3.5 mr-1.5" />Export CSV
          </a>
          <Button variant="outline" size="sm" className="h-9" onClick={load}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" />Refresh
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-emerald-500/40 text-slate-900 dark:text-white"
          />
        </div>
        <select
          value={popupFilter}
          onChange={(e) => setPopupFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none text-slate-900 dark:text-white"
        >
          <option value="">All popups</option>
          {popupNames.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No leads yet</p>
          <p className="text-xs text-slate-400 mt-1">Enable the lead form on a popup to start capturing inquiries</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left font-medium text-slate-500 px-4 py-3">Lead</th>
                  <th className="text-left font-medium text-slate-500 px-3 py-3 hidden md:table-cell">Contact</th>
                  <th className="text-left font-medium text-slate-500 px-3 py-3 hidden lg:table-cell">Trip Details</th>
                  <th className="text-left font-medium text-slate-500 px-3 py-3 hidden lg:table-cell">Popup</th>
                  <th className="text-left font-medium text-slate-500 px-3 py-3">Date</th>
                  <th className="text-right font-medium text-slate-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{lead.name || "—"}</p>
                      <p className="text-[11px] text-slate-400">{[lead.country, lead.source].filter(Boolean).join(" · ") || "—"}</p>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <p className="text-slate-600 dark:text-slate-300">{lead.email || "—"}</p>
                      <p className="text-[11px] text-slate-400">{lead.phone || ""}</p>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <p className="text-slate-600 dark:text-slate-300">{lead.destination || "—"}</p>
                      <p className="text-[11px] text-slate-400">
                        {[lead.travel_date && `📅 ${lead.travel_date}`, lead.budget && `💵 ${lead.budget}`, [lead.adults && `👤 ${lead.adults}`, lead.children && `👶 ${lead.children}`].filter(Boolean).join(" ")].filter(Boolean).join(" · ")}
                      </p>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <span className="text-slate-500 dark:text-slate-400">{lead.popup_name || "—"}</span>
                      {lead.variant === "B" && (
                        <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400">B</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-slate-400 tabular-nums">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(lead.id)} className="text-red-400 hover:text-red-500 transition p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            {filtered.length} of {leads.length} leads · exportable as CSV
          </div>
        </motion.div>
      )}
    </div>
  )
}
