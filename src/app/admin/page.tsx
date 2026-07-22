"use client"

import { useEffect, useState } from "react"
import { Package, Tag, Heart, MapPin, TrendingUp, Plus, ArrowRight, Sparkles, ExternalLink, Clock } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Stat {
  label: string
  count: number
  icon: React.ElementType
  href: string
  gradient: string
  iconBg: string
}

interface RecentItem {
  id: number
  name: string
  slug: string
  type: string
  image: string | null
  updated_at: string
  section: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stat[]>([
    { label: "Tour Packages", count: 0, icon: Package, href: "/admin/packages", gradient: "from-sky-500 to-cyan-400", iconBg: "bg-sky-100 dark:bg-sky-500/10" },
    { label: "Deals", count: 0, icon: Tag, href: "/admin/deals", gradient: "from-amber-500 to-orange-400", iconBg: "bg-amber-100 dark:bg-amber-500/10" },
    { label: "Honeymoon", count: 0, icon: Heart, href: "/admin/honeymoon-packages", gradient: "from-rose-500 to-pink-400", iconBg: "bg-rose-100 dark:bg-rose-500/10" },
    { label: "Destinations", count: 0, icon: MapPin, href: "/admin/destinations", gradient: "from-emerald-500 to-teal-400", iconBg: "bg-emerald-100 dark:bg-emerald-500/10" },
  ])
  const [loading, setLoading] = useState(true)
  const [recent, setRecent] = useState<RecentItem[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const sb = getSupabase()
        const [pkgCount, dealCount, hmCount, destCount, pkgData, dealData, hmData] = await Promise.all([
          sb.from("tour_packages").select("id", { count: "exact", head: true }),
          sb.from("deals").select("id", { count: "exact", head: true }),
          sb.from("honeymoon_packages").select("id", { count: "exact", head: true }),
          sb.from("destinations").select("id", { count: "exact", head: true }),
          sb.from("tour_packages").select("id,name,slug,type,image,updated_at").order("updated_at", { ascending: false }).limit(3),
          sb.from("deals").select("id,title,slug,type,image,updated_at").order("updated_at", { ascending: false }).limit(3),
          sb.from("honeymoon_packages").select("id,name,slug,image,updated_at").order("updated_at", { ascending: false }).limit(3),
        ])

        setStats((prev) =>
          prev.map((s, i) => ({
            ...s,
            count: [pkgCount.count ?? 0, dealCount.count ?? 0, hmCount.count ?? 0, destCount.count ?? 0][i],
          }))
        )

        const all: RecentItem[] = [
          ...(pkgData.data || []).map((p: any) => ({ ...p, name: p.name, section: "tour_packages", type: p.type })),
          ...(dealData.data || []).map((d: any) => ({ ...d, name: d.title, section: "deals", type: d.type })),
          ...(hmData.data || []).map((h: any) => ({ ...h, name: h.name, section: "honeymoon_packages", type: "honeymoon" })),
        ]
        all.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        setRecent(all.slice(0, 5))
      } catch {
        // tables may not exist yet
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const total = stats.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-slate-400">{total} total items across your site</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              onClick={() => router.push("/admin/packages/new")}
              className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-0 hover:shadow-lg hover:shadow-sky-500/20 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Package
            </Button>
            <Button
              onClick={() => router.push("/admin/deals/new")}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Tag className="w-4 h-4 mr-1.5" />
              New Deal
            </Button>
            <Button
              onClick={() => router.push("/admin/honeymoon-packages/new")}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Heart className="w-4 h-4 mr-1.5" />
              New Honeymoon
            </Button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => router.push(stat.href)}
            className="group relative text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.iconBg)}>
                <stat.icon className={cn("w-5 h-5", stat.gradient.replace("from-", "text-").split(" ")[0].replace("to-", "text-"))} />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {loading ? <span className="text-slate-300 dark:text-slate-700">--</span> : stat.count}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-sky-500" />
            Quick Actions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Common tasks to manage your content</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/admin/packages")}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 border border-transparent hover:border-sky-200 dark:hover:border-sky-800 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Manage Packages</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stats[0].count} items</p>
              </div>
            </button>
            <button
              onClick={() => router.push("/admin/deals")}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-transparent hover:border-amber-200 dark:hover:border-amber-800 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Manage Deals</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stats[1].count} items</p>
              </div>
            </button>
            <button
              onClick={() => router.push("/admin/honeymoon-packages")}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Manage Honeymoons</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stats[2].count} items</p>
              </div>
            </button>
            <button
              onClick={() => window.open("/", "_blank")}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">View Site</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Open live website</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-sky-500" />
            Recent Activity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Latest updates across your content</p>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              <p className="text-sm">No activity yet</p>
              <p className="text-xs mt-1">Add your first package or deal to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((item) => (
                <button
                  key={`${item.section}-${item.id}`}
                  onClick={() => {
                    const path = item.section === "tour_packages"
                      ? `/admin/packages/${item.id}/edit`
                      : item.section === "deals"
                      ? `/admin/deals/${item.id}/edit`
                      : `/admin/honeymoon-packages/${item.id}/edit`
                    router.push(path)
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    item.section === "tour_packages" ? "bg-sky-100 dark:bg-sky-500/10" :
                    item.section === "deals" ? "bg-amber-100 dark:bg-amber-500/10" :
                    "bg-rose-100 dark:bg-rose-500/10"
                  )}>
                    {item.section === "tour_packages" ? <Package className="w-4 h-4 text-sky-600 dark:text-sky-400" /> :
                     item.section === "deals" ? <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" /> :
                     <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{item.section.replace("_", " ")}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
