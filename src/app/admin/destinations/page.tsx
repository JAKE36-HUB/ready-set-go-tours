"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Destination {
  id: number
  name: string
  slug: string
  image: string
  region: string
  rating: number
  starting_price: number
}

const REGION_COLORS: Record<string, string> = {
  kenya: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  tanzania: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  uganda: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

export default function DestinationsPage() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const { data } = await getSupabase().from("destinations").select("*").order("name")
      if (data) setDestinations(data)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this destination?")) return
    const res = await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" })
    if (res.ok) setDestinations((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Destinations</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{destinations.length} destinations</p>
        </div>
        <Button onClick={() => router.push("/admin/destinations/new")}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Destination
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <p className="text-sm">No destinations yet. Click "Add Destination" to create one.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Region</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Rating</th>
                <th className="text-right px-5 py-3">Starting Price</th>
                <th className="text-right px-5 py-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((dest) => (
                <tr key={dest.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {dest.image && <img src={dest.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{dest.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <Badge className={cn("text-xs font-medium", REGION_COLORS[dest.region] || "bg-slate-100 text-slate-700")}>
                      {dest.region}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                    {dest.rating > 0 ? "★".repeat(Math.round(dest.rating)) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-900 dark:text-white text-right font-medium">
                    {dest.starting_price > 0 ? `$${dest.starting_price.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/${dest.region}-tours`, "_blank")} aria-label="View on site">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/destinations/${dest.id}/edit`)} aria-label="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(dest.id)} aria-label="Delete" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
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
