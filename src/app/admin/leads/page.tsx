"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  Search, FileSpreadsheet, FileText, FileType2, Filter, RefreshCw,
  ArrowUpDown,
} from "lucide-react"
import type { Lead, LeadDetail, LeadFilters } from "@/lib/leads/types"
import {
  LEAD_STATUSES, LEAD_SOURCES, RANGE_PRESETS, formatDateTime, timeAgo, initials,
} from "@/lib/leads/types"
import LeadDetailPanel from "@/components/admin/leads/LeadDetailPanel"
import { exportCSV, exportExcel, exportPDF } from "@/components/admin/leads/exportLeads"
import { cn } from "@/lib/utils"

const BUDGET_BANDS = ["", "Under 1000", "1000 - 2000", "2000 - 3000", "3000 - 5000", "5000+", "Flexible"]

function inBudgetBand(lead: Lead, band: string): boolean {
  if (!band) return true
  const b = lead.budget || ""
  const nums = b.match(/\d[\d,.]*/g)?.map((n) => Number(n.replace(/,/g, ""))) || []
  const max = nums.length ? Math.max(...nums) : 0
  const min = nums.length ? Math.min(...nums) : 0
  switch (band) {
    case "Under 1000": return max > 0 && max < 1000
    case "1000 - 2000": return max >= 1000 && min < 2000
    case "2000 - 3000": return max >= 2000 && min < 3000
    case "3000 - 5000": return max >= 3000 && min < 5000
    case "5000+": return max >= 5000
    case "Flexible": return /flexible|negoti|varies|any/i.test(b)
    default: return true
  }
}

const inputCls =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"

export default function LeadsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filters, setFilters] = useState<LeadFilters>({
    range: "", q: "", country: "", destination: "", status: "", budget: "", source: "", archived: false,
  })
  const [selectedId, setSelectedId] = useState<number | null>(searchParams.get("lead") ? Number(searchParams.get("lead")) : null)
  const [budgetBands, setBudgetBands] = useState<string[]>([])

  const params = useMemo(() => {
    const p = new URLSearchParams()
    if (filters.range) p.set("range", filters.range)
    if (filters.q) p.set("q", filters.q)
    if (filters.country) p.set("country", filters.country)
    if (filters.destination) p.set("destination", filters.destination)
    if (filters.status) p.set("status", filters.status)
    if (filters.source) p.set("source", filters.source)
    if (filters.archived) p.set("archived", "1")
    return p.toString()
  }, [filters])

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["leads", params],
    queryFn: async () => {
      const res = await fetch(`/api/admin/leads?${params}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load leads")
      return (await res.json()) as { leads: Lead[] }
    },
  })

  const leads = useMemo(() => {
    let list = data?.leads || []
    if (filters.budget) list = list.filter((l) => inBudgetBand(l, filters.budget))
    return list
  }, [data, filters.budget])

  useEffect(() => {
    const bands = new Set<string>()
    for (const b of budgetBands) bands.add(b)
    ;(data?.leads || []).forEach((l) => {
      const num = l.budget?.match(/\d[\d,.]*/g)
      if (num) {
        const max = Math.max(...num.map((n) => Number(n.replace(/,/g, ""))))
        if (max >= 5000) bands.add("5000+")
        else if (max >= 3000) bands.add("3000 - 5000")
        else if (max >= 2000) bands.add("2000 - 3000")
        else if (max >= 1000) bands.add("1000 - 2000")
        else bands.add("Under 1000")
      } else {
        bands.add("Flexible")
      }
    })
    setBudgetBands([...bands].sort())
  }, [data])

  const { data: detailData } = useQuery({
    queryKey: ["lead", selectedId],
    queryFn: async () => {
      if (!selectedId) return null
      const res = await fetch(`/api/admin/leads/${selectedId}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load lead")
      return (await res.json()) as { lead: LeadDetail; events: any[]; reminders: any[] }
    },
    enabled: !!selectedId,
  })

  const selectedLead: LeadDetail | null = detailData
    ? { ...detailData.lead, events: detailData.events, reminders: detailData.reminders }
    : null

  const countries = useMemo(() => [...new Set((data?.leads || []).map((l) => l.country).filter(Boolean))].sort(), [data])
  const destinations = useMemo(() => [...new Set((data?.leads || []).map((l) => l.destination).filter(Boolean))].sort(), [data])

  const refreshDetail = useCallback(async () => {
    await refetch()
  }, [refetch])

  const statusMeta = (s: string) => LEAD_STATUSES.find((x) => x.value === s)

  const unreadCount = useMemo(() => (data?.leads || []).filter((l) => l.status === "new").length, [data])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Lead Inbox</h2>
          <p className="text-sm text-slate-500">{leads.length} leads{unreadCount > 0 && <span className="text-amber-500"> · {unreadCount} new</span>}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a href="/api/admin/leads/export" download className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <FileText className="w-3.5 h-3.5" /> CSV
          </a>
          <button onClick={() => exportExcel(leads)} className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </button>
          <button onClick={() => exportPDF(leads)} className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <FileType2 className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={() => refetch()} disabled={isFetching} className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
            <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} /> Refresh
          </button>
          <button onClick={() => setSelectedId(null)} className="hidden" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                placeholder="Search name, email, phone, message…"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-9 pr-3 py-2 text-sm"
              />
            </div>
            <select value={filters.range} onChange={(e) => setFilters((f) => ({ ...f, range: e.target.value }))} className={inputCls + " w-auto"}>
              {RANGE_PRESETS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className={inputCls + " w-auto"}>
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select value={filters.source} onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))} className={inputCls + " w-auto"}>
              <option value="">All Sources</option>
              {LEAD_SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select value={filters.country} onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))} className={inputCls + " w-auto"}>
              <option value="">All Countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filters.destination} onChange={(e) => setFilters((f) => ({ ...f, destination: e.target.value }))} className={inputCls + " w-auto"}>
              <option value="">All Destinations</option>
              {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filters.budget} onChange={(e) => setFilters((f) => ({ ...f, budget: e.target.value }))} className={inputCls + " w-auto"}>
              <option value="">All Budgets</option>
              {BUDGET_BANDS.filter((b) => !b || budgetBands.includes(b)).map((b) => <option key={b} value={b}>{b || "All Budgets"}</option>)}
            </select>
            <button
              onClick={() => setFilters((f) => ({ ...f, archived: !f.archived }))}
              className={cn("rounded-xl px-3 py-2 text-xs font-semibold border transition-colors", filters.archived ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-600" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800")}
            >
              {filters.archived ? "Archived" : "Active"}
            </button>
            <button onClick={() => setFilters({ range: "", q: "", country: "", destination: "", status: "", budget: "", source: "", archived: false })} className="text-xs text-slate-400 hover:text-slate-600 underline-offset-2 hover:underline">
              Clear filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Country</th>
                <th className="px-4 py-3 font-semibold">Package</th>
                <th className="px-4 py-3 font-semibold">Travel Date</th>
                <th className="px-4 py-3 font-semibold">Budget</th>
                <th className="px-4 py-3 font-semibold">Travelers</th>
                <th className="px-4 py-3 font-semibold">Inquiry Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Assigned</th>
                <th className="px-4 py-3 font-semibold"><ArrowUpDown className="w-3 h-3" /></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-400">Loading leads…</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-400">No leads match your filters</td></tr>
              ) : (
                leads.map((lead, i) => {
                  const sm = statusMeta(lead.status)
                  const isNew = lead.status === "new"
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.4) }}
                      onClick={() => setSelectedId(lead.id)}
                      className={cn(
                        "border-b border-slate-50 dark:border-slate-800/60 cursor-pointer transition-colors hover:bg-amber-50/40 dark:hover:bg-slate-800/40",
                        selectedId === lead.id && "bg-amber-50/70 dark:bg-amber-950/20",
                        isNew && "bg-sky-50/40 dark:bg-sky-950/10"
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {initials(lead.name || "?")}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold truncate max-w-[160px]">{lead.name || "Visitor"}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {lead.email || lead.phone || <span className="capitalize">{lead.source.replaceAll("_", " ")}</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{lead.country || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 truncate max-w-[140px]">{lead.destination || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{lead.travel_date || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">{lead.budget || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {[lead.adults, lead.children].filter(Boolean).join(" + ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap" title={formatDateTime(lead.created_at)}>
                        {timeAgo(lead.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", sm?.cls)}>
                          {sm?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 truncate max-w-[110px]">{lead.assigned_to || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-300">{lead.id}</td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeadDetailPanel
        lead={selectedLead}
        onClose={() => setSelectedId(null)}
        onChanged={refreshDetail}
        onDeleted={(id) => { setSelectedId(null); refetch() }}
      />
    </div>
  )
}
