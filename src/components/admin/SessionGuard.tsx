"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { createBrowserClient } from "@supabase/ssr"
import { useSupabase } from "@/lib/supabase-auth"

const LOGIN_AT_KEY = "rsgt_admin_login_at"
const LAST_ACTIVITY_KEY = "rsgt_admin_last_activity"

const IDLE_MS = (Number(process.env.NEXT_PUBLIC_ADMIN_IDLE_MINUTES) || 30) * 60_000
const MAX_SESSION_MS = (Number(process.env.NEXT_PUBLIC_ADMIN_SESSION_HOURS) || 24) * 60 * 60_000
const IDLE_WARN_MS = 60_000

function now() {
  return Date.now()
}

export function SessionGuard() {
  const { user } = useSupabase()
  const lastActivity = useRef<number>(now())
  const warned = useRef(false)
  const signingOut = useRef(false)

  useEffect(() => {
    if (!user) return

    const storedLogin = Number(localStorage.getItem(LOGIN_AT_KEY))
    if (!storedLogin || Number.isNaN(storedLogin)) {
      localStorage.setItem(LOGIN_AT_KEY, String(now()))
    }
    const storedActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY))
    if (storedActivity && !Number.isNaN(storedActivity)) {
      lastActivity.current = Math.max(lastActivity.current, storedActivity)
    }

    const markActivity = () => {
      const t = now()
      lastActivity.current = t
      warned.current = false
      try { localStorage.setItem(LAST_ACTIVITY_KEY, String(t)) } catch { /* ignore */ }
    }

    const events: (keyof WindowEventMap)[] = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"]
    let throttleTimer: ReturnType<typeof setTimeout> | null = null
    const onActivity = () => {
      if (throttleTimer) return
      throttleTimer = setTimeout(() => { throttleTimer = null }, 3000)
      markActivity()
    }
    events.forEach((evt) => window.addEventListener(evt, onActivity, { passive: true }))

    const signOut = async (reason: "idle" | "max") => {
      if (signingOut.current) return
      signingOut.current = true
      try {
        localStorage.removeItem(LOGIN_AT_KEY)
        localStorage.removeItem(LAST_ACTIVITY_KEY)
      } catch { /* ignore */ }
      toast.info(reason === "idle" ? "Signed out due to inactivity." : "Session expired. Please sign in again.")
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      try { await supabase.auth.signOut() } catch { /* ignore */ }
    }

    const check = () => {
      try {
        const storedActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY))
        if (storedActivity && !Number.isNaN(storedActivity)) {
          lastActivity.current = Math.max(lastActivity.current, storedActivity)
        }
      } catch { /* ignore */ }

      const loginAt = Number(localStorage.getItem(LOGIN_AT_KEY)) || now()
      if (now() - loginAt >= MAX_SESSION_MS) {
        void signOut("max")
        return
      }

      const idleMs = now() - lastActivity.current
      if (idleMs >= IDLE_MS) {
        void signOut("idle")
        return
      }
      if (idleMs >= IDLE_MS - IDLE_WARN_MS && !warned.current) {
        warned.current = true
        toast.warning("You'll be signed out in 1 minute due to inactivity.")
      }
    }

    const interval = setInterval(check, 15_000)
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") markActivity()
    }
    document.addEventListener("visibilitychange", visibilityHandler)

    check()

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, onActivity))
      if (throttleTimer) clearTimeout(throttleTimer)
      clearInterval(interval)
      document.removeEventListener("visibilitychange", visibilityHandler)
    }
  }, [user])

  return null
}