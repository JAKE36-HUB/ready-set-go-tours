"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Deal {
  id: number
  title: string
  slug: string
  type: string
  deal_price: number
  original_price: number
  duration: string
  image: string
  featured: boolean
}

const TYPE_COLORS: Record<string, string> = {
  "early-bird": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "last-minute": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  group: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  seasonal: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  combo: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  special: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
}

export default function DealsPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const { data } = await getSupabase().from("deals").select("*").order("title")
      if (data) setDeals(data)
    } catch {
      // table may not exist
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this deal?")) return
    const res = await fetch(`/api/admin/deals/${id}`, { method: "DELETE" })
    if (res.ok) setDeals((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Deals</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{deals.length} deals</p>
        </div>
        <Button onClick={() => router.push("/admin/deals/new")}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Deal
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <p className="text-sm">No deals yet. Click "Add Deal" to create one.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Type</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Duration</th>
                <th className="text-right px-5 py-3">Deal Price</th>
                <th className="text-right px-5 py-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {deal.image && <img src={deal.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                      <div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{deal.title}</span>
                        {deal.featured && <Badge className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs">Featured</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <Badge className={cn("text-xs font-medium", TYPE_COLORS[deal.type] || "bg-slate-100 text-slate-700")}>
                      {deal.type}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">{deal.duration}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">${deal.deal_price?.toLocaleString()}</span>
                    {deal.original_price > 0 && (
                      <span className="text-xs text-slate-400 line-through ml-1.5">${deal.original_price?.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/deals/${deal.slug}`, "_blank")} aria-label="View on site">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/deals/${deal.id}/edit`)} aria-label="Edit deal">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(deal.id)} aria-label="Delete deal" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
