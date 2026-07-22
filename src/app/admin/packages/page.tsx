"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, ExternalLink, Package, Search } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface TourPackage {
  id: number
  name: string
  slug: string
  type: string
  price: number
  duration: string
  image: string
}

const TYPE_COLORS: Record<string, string> = {
  safari: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  luxury: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  group: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  mountain: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
}

export default function PackagesPage() {
  const router = useRouter()
  const [packages, setPackages] = useState<TourPackage[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const { data } = await getSupabase().from("tour_packages").select("*").order("name")
      if (data) setPackages(data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this package?")) return
    const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" })
    if (res.ok) setPackages((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tour Packages</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{packages.length} packages</p>
          </div>
        </div>
        <Button onClick={() => router.push("/admin/packages/new")}
          className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-0 hover:shadow-lg hover:shadow-sky-500/25 transition-all h-9">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Package
        </Button>
      </motion.div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-2 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="h-8 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      ) : packages.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-sky-400" />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">No packages yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Get started by adding your first tour package</p>
          <Button onClick={() => router.push("/admin/packages/new")}
            className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-0">
            <Plus className="w-4 h-4 mr-1.5" /> Add Package
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Duration</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price (USD)</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {packages.map((pkg, i) => (
                  <motion.tr key={pkg.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {pkg.image ? (
                          <img src={pkg.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ring-1 ring-slate-200 dark:ring-slate-700">
                            <Package className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{pkg.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <Badge className={cn("text-xs font-medium", TYPE_COLORS[pkg.type] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400")}>
                        {pkg.type}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">{pkg.duration}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-900 dark:text-white text-right font-medium tabular-nums">
                      ${pkg.price?.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => window.open(`/holiday-packages/${pkg.slug}`, "_blank")}
                          className="hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-sky-600" aria-label="View on site">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/packages/${pkg.id}/edit`)}
                          className="hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600" aria-label="Edit package">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(pkg.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Delete package">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <p className="text-xs text-slate-400">{packages.length} package{packages.length !== 1 ? "s" : ""} total</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
