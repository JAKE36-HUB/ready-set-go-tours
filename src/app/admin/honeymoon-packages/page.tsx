"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Honeymoon {
  id: number
  name: string
  slug: string
  price: number
  duration: string
  image: string
}

export default function HoneymoonPage() {
  const router = useRouter()
  const [packages, setPackages] = useState<Honeymoon[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const { data } = await getSupabase().from("honeymoon_packages").select("*").order("name")
      if (data) setPackages(data)
    } catch { /* table may not exist */ }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return
    const res = await fetch(`/api/admin/honeymoon-packages/${id}`, { method: "DELETE" })
    if (res.ok) setPackages((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Honeymoon Packages</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{packages.length} packages</p>
        </div>
        <Button onClick={() => router.push("/admin/honeymoon-packages/new")}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Package
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" /></div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <p className="text-sm">No honeymoon packages yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Duration</th>
                <th className="text-right px-5 py-3">Price (USD)</th>
                <th className="text-right px-5 py-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {pkg.image && <img src={pkg.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{pkg.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 hidden md:table-cell">{pkg.duration}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-900 dark:text-white text-right font-medium">${pkg.price?.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/honeymoon-packages/${pkg.slug}`, "_blank")} aria-label="View on site">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/honeymoon-packages/${pkg.id}/edit`)} aria-label="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(pkg.id)} aria-label="Delete" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
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
