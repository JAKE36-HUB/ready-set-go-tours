"use client"

import { useEffect, useState } from "react"
import { Package, Tag, Heart, MapPin } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Stat {
  label: string
  count: number
  icon: React.ElementType
  href: string
  color: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stat[]>([
    { label: "Tour Packages", count: 0, icon: Package, href: "/admin/packages", color: "text-sky-500 bg-sky-50 dark:bg-sky-500/10" },
    { label: "Deals", count: 0, icon: Tag, href: "/admin/deals", color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
    { label: "Honeymoon Packages", count: 0, icon: Heart, href: "/admin/honeymoon-packages", color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10" },
    { label: "Destinations", count: 0, icon: MapPin, href: "/admin/destinations", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [packages, deals, honeymoon, destinations] = await Promise.all([
          getSupabase().from("tour_packages").select("id", { count: "exact", head: true }),
          getSupabase().from("deals").select("id", { count: "exact", head: true }),
          getSupabase().from("honeymoon_packages").select("id", { count: "exact", head: true }),
          getSupabase().from("destinations").select("id", { count: "exact", head: true }),
        ])
        setStats((prev) =>
          prev.map((s, i) => ({
            ...s,
            count: [packages.count ?? 0, deals.count ?? 0, honeymoon.count ?? 0, destinations.count ?? 0][i],
          }))
        )
      } catch {
        // Tables may not exist yet -- show 0s
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Welcome back</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your website content from here. Use the sidebar to navigate.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                {loading ? "-" : stat.count}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push("/admin/packages/new")}>Add Tour Package</Button>
          <Button variant="outline" onClick={() => router.push("/admin/deals/new")}>Add Deal</Button>
          <Button variant="outline" onClick={() => router.push("/admin/honeymoon-packages/new")}>Add Honeymoon Package</Button>
        </div>
      </div>
    </div>
  )
}
