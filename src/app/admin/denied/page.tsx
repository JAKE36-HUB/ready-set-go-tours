"use client"

import { useRouter } from "next/navigation"
import { ShieldAlert, LogOut } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase-browser"

export default function AdminDeniedPage() {
  const router = useRouter()

  async function signOut() {
    await getBrowserClient().auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-rose-500" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Access Denied</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Your account is not authorized to access the admin panel.
            Contact the site owner if you believe this is a mistake.
          </p>
        </div>
        <button
          onClick={signOut}
          className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
