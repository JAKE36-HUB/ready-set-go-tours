"use client"

import { useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { motion, Reorder, AnimatePresence } from "framer-motion"
import { GripVertical, Filter, X } from "lucide-react"
import type { Lead } from "@/lib/leads/types"
import { LEAD_STATUSES, initials, timeAgo } from "@/lib/leads/types"
import { cn } from "@/lib/utils"

const inputCls =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"

export default function PipelinePage() {
  const qc = useQueryClient()
  const [query, setQuery] = useState("")
  const [draggingId, setDraggingId] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["leads", "pipeline"],
    queryFn: async () => {
      const res = await fetch("/api/admin/leads", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load leads")
      return (await res.json()) as { leads: Lead[] }
    },
  })

  const all = useMemo(() => (data?.leads || []).filter((l) => !l.archived), [data])

  const filtered = useMemo(() => {
    if (!query.trim()) return all
    const q = query.toLowerCase()
    return all.filter((l) =>
      [l.name, l.email, l.phone, l.country, l.destination].some((v) => v && v.toLowerCase().includes(q))
    )
  }, [all, query])

  const columns = LEAD_STATUSES.map((s) => ({
    ...s,
    leads: filtered.filter((l) => l.status === s.value).sort((a, b) => (a.assigned_to || "").localeCompare(b.assigned_to || "")),
  }))

  async function moveLead(leadId: number, status: string) {
    await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    qc.invalidateQueries({ queryKey: ["leads"] })
  }

  async function dropOnColumn(status: string) {
    if (draggingId === null) return
    await moveLead(draggingId, status)
    setDraggingId(null)
  }

  const leadCard = (lead: Lead) => (
    <motion.div
      layout
      key={lead.id}
      layoutId={`lead-${lead.id}`}
      draggable
      onDragStart={() => setDraggingId(lead.id)}
      onDragEnd={() => setDraggingId(null)}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-2">
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
          {initials(lead.name || "?")}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">{lead.name || "Visitor"}</p>
          <p className="text-[10px] text-slate-400 truncate">{lead.destination || lead.email || lead.country || "—"}</p>
        </div>
        <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0" />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-slate-400">
          {lead.country ? `${lead.country} · ` : ""}{timeAgo(lead.created_at)}
        </span>
        {lead.budget && <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">{lead.budget}</span>}
      </div>
      {lead.assigned_to && (
        <span className="mt-2 inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-medium text-slate-500 truncate max-w-full">
          👤 {lead.assigned_to}
        </span>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Lead Pipeline</h2>
          <p className="text-sm text-slate-500">Drag cards between stages to update the pipeline</p>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter pipeline…"
            className="w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-8 py-2 text-sm"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Loading pipeline…</div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 items-start">
          {columns.map((col) => (
            <div key={col.value} className="w-[260px] shrink-0 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 p-2.5 flex flex-col max-h-[calc(100vh-220px)]">
              <div className="flex items-center justify-between px-1.5 py-1.5">
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", col.dot)} />
                  <span className="text-xs font-bold">{col.label}</span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/70 dark:bg-slate-700/60 rounded-full px-1.5 py-0.5">{col.leads.length}</span>
                </div>
              </div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dropOnColumn(col.value)}
                className={cn(
                  "flex-1 overflow-y-auto min-h-[80px] space-y-2 rounded-xl p-1 transition-colors",
                  draggingId !== null && "ring-2 ring-amber-400/50 ring-dashed ring-offset-1 ring-offset-transparent"
                )}
              >
                <Reorder.Group values={col.leads} onReorder={() => {}} axis="y" className="space-y-2">
                  {col.leads.map((lead) => leadCard(lead))}
                </Reorder.Group>
                {col.leads.length === 0 && (
                  <div className="flex items-center justify-center h-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-[10px] text-slate-400">
                    Drop leads here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
