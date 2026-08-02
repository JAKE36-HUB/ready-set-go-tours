"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bell, BellOff, Check, CheckCheck, Trash2, Archive, Volume2, VolumeX, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRealtime } from "./RealtimeProvider"
import { NOTIFICATION_TYPES, timeAgo } from "@/lib/leads/types"
import { soundEnabled, setSoundEnabled } from "@/lib/sounds"
import { cn } from "@/lib/utils"

export default function NotificationCenter() {
  const router = useRouter()
  const { notifications, unreadCount, refresh, markAllRead } = useRealtime()
  const [open, setOpen] = useState(false)
  const [soundOn, setSound] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSound(soundEnabled())
  }, [])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  async function toggleRead(id: number, read: boolean) {
    await fetch(`/api/admin/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    })
    refresh()
  }

  async function toggleArchived(id: number, archived: boolean) {
    await fetch(`/api/admin/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived }),
    })
    refresh()
  }

  async function remove(id: number) {
    await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" })
    refresh()
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        aria-label="Notifications"
      >
        {soundOn ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-[200] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm">Notifications</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const next = !soundOn
                    setSound(next)
                    setSoundEnabled(next)
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  title={soundOn ? "Sound on" : "Sound off"}
                >
                  {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => markAllRead()}
                  className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all
                </button>
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">No notifications yet</div>
              ) : (
                notifications.map((n) => {
                  const meta = NOTIFICATION_TYPES[n.type]
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "px-4 py-3 border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors",
                        !n.read && "bg-amber-50/50 dark:bg-amber-950/10"
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { if (n.lead_id) router.push(`/admin/leads?lead=${n.lead_id}`); setOpen(false) }}>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", meta?.cls || "bg-slate-100 text-slate-600")}>
                              {meta?.label || n.type.replaceAll("_", " ")}
                            </span>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                          </div>
                          <p className="text-sm font-semibold mt-1 truncate">{n.title}</p>
                          {n.body && <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{n.body}</p>}
                          <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {n.lead_id && (
                            <button
                              onClick={() => { router.push(`/admin/leads?lead=${n.lead_id}`); setOpen(false) }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              title="Open lead"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {!n.read && (
                            <button
                              onClick={() => toggleRead(n.id, true)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {!n.archived && (
                            <button
                              onClick={() => toggleArchived(n.id, true)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-600"
                              title="Archive"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => remove(n.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
