"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useSupabase } from "@/lib/supabase-auth"
import { createBrowserClient } from "@supabase/ssr"
import {
  LayoutDashboard,
  Package,
  Tag,
  Heart,
  MapPin,
  Images,
  FileText,
  Menu,
  X,
  ExternalLink,
  LogOut,
  ChevronRight,
  User,
  Sparkles,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Tour Packages", icon: Package },
  { href: "/admin/deals", label: "Deals", icon: Tag },
  { href: "/admin/honeymoon-packages", label: "Honeymoon", icon: Heart },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/visitors", label: "Visitors", icon: Activity },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useSupabase()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
              <span className="text-white font-bold text-sm">RS</span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Admin Panel</p>
              <p className="text-[10px] text-slate-400 leading-tight">Ready Set Go Tours</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-sky-500/15 text-sky-400 shadow-sm shadow-sky-500/5"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0 text-sky-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-4 border-t border-slate-800/80 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Website
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
              {pathname === "/admin"
                ? "Dashboard"
                : pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || ""}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="hidden sm:inline truncate max-w-[150px]">{user.email}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
