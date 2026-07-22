"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Tag, Heart, MapPin, Images, FileText, TrendingUp, Plus, ArrowRight, Sparkles, ExternalLink, Clock, Zap, BarChart3, PieChart, Globe, Users, RefreshCw, ChevronRight, Eye, Edit3, Layers, Target, AlertCircle, CheckCircle2 } from "lucide-react"
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
  lightBg: string
}

interface RecentItem {
  id: number
  name: string
  slug: string
  type: string
  image: string | null
  updated_at: string
  created_at?: string
  section: string
}

function timeAgo(date: string) {
  const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (sec < 60) return "just now"
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  return `${days}d ago`
}

const sectionIcons: Record<string, React.ElementType> = {
  tour_packages: Package, deals: Tag, honeymoon_packages: Heart,
  destinations: MapPin, gallery: Images, blog_posts: FileText,
}

const sectionColors: Record<string, string> = {
  tour_packages: "from-sky-500 to-cyan-400",
  deals: "from-amber-500 to-orange-400",
  honeymoon_packages: "from-rose-500 to-pink-400",
  destinations: "from-emerald-500 to-teal-400",
  gallery: "from-purple-500 to-violet-400",
  blog_posts: "from-blue-500 to-indigo-400",
}

const sectionLightBg: Record<string, string> = {
  tour_packages: "bg-sky-50 dark:bg-sky-500/10",
  deals: "bg-amber-50 dark:bg-amber-500/10",
  honeymoon_packages: "bg-rose-50 dark:bg-rose-500/10",
  destinations: "bg-emerald-50 dark:bg-emerald-500/10",
  gallery: "bg-purple-50 dark:bg-purple-500/10",
  blog_posts: "bg-blue-50 dark:bg-blue-500/10",
}

const sectionTextColor: Record<string, string> = {
  tour_packages: "text-sky-600 dark:text-sky-400",
  deals: "text-amber-600 dark:text-amber-400",
  honeymoon_packages: "text-rose-600 dark:text-rose-400",
  destinations: "text-emerald-600 dark:text-emerald-400",
  gallery: "text-purple-600 dark:text-purple-400",
  blog_posts: "text-blue-600 dark:text-blue-400",
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <div className="flex items-center justify-center h-40 text-xs text-slate-400">No data</div>
  let cumulative = 0
  const segments = data.map((d) => {
    const start = cumulative
    cumulative += (d.value / total) * 360
    return { ...d, start, end: cumulative }
  })
  const r = 36, cx = 40, cy = 40, circ = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {segments.map((s, i) => {
        const offset = circ - (s.end / 360) * circ
        const dashLen = ((s.end - s.start) / 360) * circ
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={8}
            strokeDasharray={`${dashLen} ${circ - dashLen}`} strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-700"
          />
        )
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        className="fill-slate-900 dark:fill-white text-[10px] font-bold">{total}</text>
    </svg>
  )
}

function MiniBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-[2px] h-8">
      {values.map((v, i) => (
        <div key={i} className={`w-[6px] rounded-t-sm transition-all duration-500 ${color}`}
          style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stat[]>([
    { label: "Tour Packages", count: 0, icon: Package, href: "/admin/packages", gradient: "from-sky-500 to-cyan-400", iconBg: "bg-sky-100 dark:bg-sky-500/10", lightBg: "bg-sky-50 dark:bg-sky-500/10" },
    { label: "Deals", count: 0, icon: Tag, href: "/admin/deals", gradient: "from-amber-500 to-orange-400", iconBg: "bg-amber-100 dark:bg-amber-500/10", lightBg: "bg-amber-50 dark:bg-amber-500/10" },
    { label: "Honeymoon", count: 0, icon: Heart, href: "/admin/honeymoon-packages", gradient: "from-rose-500 to-pink-400", iconBg: "bg-rose-100 dark:bg-rose-500/10", lightBg: "bg-rose-50 dark:bg-rose-500/10" },
    { label: "Destinations", count: 0, icon: MapPin, href: "/admin/destinations", gradient: "from-emerald-500 to-teal-400", iconBg: "bg-emerald-100 dark:bg-emerald-500/10", lightBg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { label: "Gallery", count: 0, icon: Images, href: "/admin/gallery", gradient: "from-purple-500 to-violet-400", iconBg: "bg-purple-100 dark:bg-purple-500/10", lightBg: "bg-purple-50 dark:bg-purple-500/10" },
    { label: "Blog Posts", count: 0, icon: FileText, href: "/admin/blog", gradient: "from-blue-500 to-indigo-400", iconBg: "bg-blue-100 dark:bg-blue-500/10", lightBg: "bg-blue-50 dark:bg-blue-500/10" },
  ])
  const [loading, setLoading] = useState(true)
  const [recent, setRecent] = useState<RecentItem[]>([])
  const [greeting, setGreeting] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting("Good morning")
    else if (h < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  useEffect(() => {
    async function loadData() {
      try {
        const sb = getSupabase()
        const [pkgC, dealC, hmC, destC, galC, blogC, pkgD, dealD, hmD, destD, galD, blogD] = await Promise.all([
          sb.from("tour_packages").select("id", { count: "exact", head: true }),
          sb.from("deals").select("id", { count: "exact", head: true }),
          sb.from("honeymoon_packages").select("id", { count: "exact", head: true }),
          sb.from("destinations").select("id", { count: "exact", head: true }),
          sb.from("gallery").select("id", { count: "exact", head: true }),
          sb.from("blog_posts").select("id", { count: "exact", head: true }),
          sb.from("tour_packages").select("id,name,slug,type,image,updated_at").order("updated_at", { ascending: false }).limit(3),
          sb.from("deals").select("id,title,slug,type,image,updated_at").order("updated_at", { ascending: false }).limit(3),
          sb.from("honeymoon_packages").select("id,name,slug,image,updated_at").order("updated_at", { ascending: false }).limit(3),
          sb.from("destinations").select("id,name,slug,image,updated_at").order("updated_at", { ascending: false }).limit(3),
          sb.from("gallery").select("id,alt,src,category,created_at").order("created_at", { ascending: false }).limit(3),
          sb.from("blog_posts").select("id,title,slug,author,image,updated_at").order("updated_at", { ascending: false }).limit(3),
        ])

        const counts = [pkgC.count ?? 0, dealC.count ?? 0, hmC.count ?? 0, destC.count ?? 0, galC.count ?? 0, blogC.count ?? 0]
        setStats((prev) => prev.map((s, i) => ({ ...s, count: counts[i] })))

        const all: RecentItem[] = [
          ...(pkgD.data || []).map((p: any) => ({ ...p, name: p.name, section: "tour_packages", type: p.type })),
          ...(dealD.data || []).map((d: any) => ({ ...d, name: d.title, section: "deals", type: d.type })),
          ...(hmD.data || []).map((h: any) => ({ ...h, name: h.name, section: "honeymoon_packages", type: "honeymoon" })),
          ...(destD.data || []).map((d: any) => ({ ...d, name: d.name, section: "destinations", type: "destination" })),
          ...(galD.data || []).map((g: any) => ({ ...g, name: g.alt || "Untitled", section: "gallery", type: "gallery" })),
          ...(blogD.data || []).map((b: any) => ({ ...b, name: b.title, section: "blog_posts", type: "blog" })),
        ]
        all.sort((a, b) => new Date(b.updated_at ?? b.created_at ?? "").getTime() - new Date(a.updated_at ?? a.created_at ?? "").getTime())
        setRecent(all.slice(0, 8))
      } catch {} finally { setLoading(false) }
    }
    loadData()
  }, [])

  const total = stats.reduce((sum, s) => sum + s.count, 0)
  const barValues = useMemo(() => stats.map((s) => s.count), [stats])
  const donutData = useMemo(() => stats.map((s, i) => ({
    label: s.label, value: s.count,
    color: ["#0ea5e9", "#f59e0b", "#f43f5e", "#10b981", "#a855f7", "#3b82f6"][i],
  })), [stats])

  const quickActions = [
    { label: "Add Package", icon: Package, href: "/admin/packages/new", gradient: "from-sky-500 to-cyan-400", desc: "Create a new tour package" },
    { label: "Add Deal", icon: Tag, href: "/admin/deals/new", gradient: "from-amber-500 to-orange-400", desc: "Create a promotional deal" },
    { label: "Add Honeymoon", icon: Heart, href: "/admin/honeymoon-packages/new", gradient: "from-rose-500 to-pink-400", desc: "Create a honeymoon package" },
    { label: "Add Image", icon: Images, href: "/admin/gallery/new", gradient: "from-purple-500 to-violet-400", desc: "Upload a gallery image" },
    { label: "Add Blog Post", icon: FileText, href: "/admin/blog/new", gradient: "from-blue-500 to-indigo-400", desc: "Write a blog post" },
    { label: "View Site", icon: ExternalLink, href: "/", gradient: "from-emerald-500 to-teal-400", desc: "View live website", external: true },
  ]

  const tips = [
    { icon: Target, text: "Update your featured deals to keep content fresh", color: "text-amber-500" },
    { icon: Eye, text: "High-quality images improve booking conversion", color: "text-purple-500" },
    { icon: Edit3, text: "Regular blog posts boost SEO rankings", color: "text-blue-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Animated Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-blue-500/5 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="text-lg sm:text-xl font-bold text-white">
                  {greeting}, Admin
                </motion.h1>
                <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="text-sm text-slate-400">
                  {total} total items across your site
                  <span className="hidden sm:inline"> &middot; Ready Set Go Tours</span>
                </motion.p>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="flex gap-2">
              <Button onClick={() => router.push("/admin/packages/new")}
                className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-0 hover:shadow-lg hover:shadow-sky-500/25 hover:scale-105 transition-all text-sm h-9 px-4">
                <Plus className="w-3.5 h-3.5 mr-1.5" />New Package
              </Button>
              <Button onClick={() => router.push("/admin/deals/new")}
                variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 text-sm h-9 px-4">
                <Tag className="w-3.5 h-3.5 mr-1.5" />New Deal
              </Button>
            </motion.div>
          </div>
          {/* Mini activity bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-6 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" />{total} items managed</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3" />{recent.length} recent updates</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <motion.button key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
            onClick={() => router.push(stat.href)}
            className="group relative text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2">
              <stat.icon className="w-full h-full" />
            </div>
            <div className="relative z-10">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", stat.iconBg)}>
                <stat.icon className={cn("w-4 h-4", sectionTextColor[stat.label.toLowerCase().replace(" ", "_") as keyof typeof sectionTextColor] || "text-sky-500")} />
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={stat.count} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {loading ? <span className="inline-block w-8 h-6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" /> : stat.count}
                </motion.p>
              </AnimatePresence>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Content Analytics + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-sky-500" />Content Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Breakdown of all content types</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 shrink-0">
              <DonutChart data={donutData} />
            </div>
            <div className="flex-1 space-y-1.5 min-w-0">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full shrink-0`} style={{ backgroundColor: ["#0ea5e9", "#f59e0b", "#f43f5e", "#10b981", "#a855f7", "#3b82f6"][i] }} />
                  <span className="text-slate-500 dark:text-slate-400 truncate">{s.label}</span>
                  <span className="ml-auto font-medium text-slate-700 dark:text-slate-300 tabular-nums">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mini Activity Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />Content Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Items per section</p>
            </div>
          </div>
          <div className="space-y-4">
            {stats.map((s, i) => {
              const colors = ["bg-sky-500", "bg-amber-500", "bg-rose-500", "bg-emerald-500", "bg-purple-500", "bg-blue-500"]
              const pct = total > 0 ? (s.count / total) * 100 : 0
              return (
                <div key={s.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{s.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      className={`h-full rounded-full ${colors[i]}`} />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />Quick Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Frequently used admin tasks</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <motion.button key={action.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
                  onClick={() => action.external ? window.open(action.href, "_blank") : router.push(action.href)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-center group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (spans 2 cols) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-500" />Recent Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest updates across all content</p>
            </div>
            {recent.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs text-sky-500 hover:text-sky-600 h-7 px-2"
                onClick={() => router.push("/admin/packages")}>
                View All <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            )}
          </div>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-2 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <Layers className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No activity yet</p>
              <p className="text-xs mt-1">Add your first content to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((item, i) => {
                const Icon = sectionIcons[item.section] || Package
                const grad = sectionColors[item.section] || "from-sky-500 to-cyan-400"
                const bg = sectionLightBg[item.section] || "bg-sky-50 dark:bg-sky-500/10"
                const txt = sectionTextColor[item.section] || "text-sky-600 dark:text-sky-400"
                return (
                  <motion.button key={`${item.section}-${item.id}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => router.push(`/admin/${item.section.replace("_", "-")}/${item.id}/edit`)}
                    className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", bg)}>
                      <Icon className={cn("w-4 h-4", txt)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="capitalize">{item.section.replace("_", " ")}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span>{timeAgo(item.updated_at ?? item.created_at ?? "")}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </motion.button>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Tips / Insights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />Insights & Tips
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quick recommendations</p>
          </div>
          <div className="space-y-3">
            {tips.map((tip) => {
              const Icon = tip.icon
              return (
                <div key={tip.text} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", tip.color.replace("text-", "bg-").replace("500", "100 dark:bg-").replace("100", "500/10"))}>
                    <Icon className={cn("w-3.5 h-3.5", tip.color)} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{tip.text}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/20 dark:to-cyan-950/20 border border-sky-100 dark:border-sky-900/50">
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">All systems operational</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Supabase connected &middot; {total} items synced</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
