"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AppNotification, Lead } from "@/lib/leads/types"
import { playChime } from "@/lib/sounds"

interface RealtimeContextValue {
  notifications: AppNotification[]
  unreadCount: number
  latestLeads: Lead[]
  refresh: () => void
  markAllRead: () => Promise<void>
}

const RealtimeContext = createContext<RealtimeContextValue>({
  notifications: [],
  unreadCount: 0,
  latestLeads: [],
  refresh: () => {},
  markAllRead: async () => {},
})

export function useRealtime() {
  return useContext(RealtimeContext)
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [latestLeads, setLatestLeads] = useState<Lead[]>([])
  const notifiedIds = useRef<Set<number>>(new Set())
  const soundOn = useRef(true)

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["leads"] })
    queryClient.invalidateQueries({ queryKey: ["lead-stats"] })
  }, [queryClient])

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications)
        data.notifications.forEach((n: AppNotification) => notifiedIds.current.add(n.id))
      }
      invalidate()
    } catch {
      /* offline */
    }
  }, [invalidate])

  const handleNewLead = useCallback(
    (lead: Lead) => {
      setLatestLeads((prev) => [lead, ...prev.filter((l) => l.id !== lead.id)].slice(0, 30))
      invalidate()
    },
    [invalidate]
  )

  const handleNewNotification = useCallback(
    (n: AppNotification) => {
      if (notifiedIds.current.has(n.id)) return
      notifiedIds.current.add(n.id)
      setNotifications((prev) => [n, ...prev.filter((x) => x.id !== n.id)].slice(0, 50))
      playChime()
      if (n.lead_id) {
        toast(n.title, {
          description: n.body || n.type.replaceAll("_", " "),
          action: {
            label: "Open",
            onClick: () => router.push(`/admin/leads?lead=${n.lead_id}`),
          },
          duration: 6000,
        })
      } else {
        toast(n.title, { description: n.body || n.type.replaceAll("_", " ") })
      }
    },
    [router]
  )

  useEffect(() => {
    soundOn.current = localStorage.getItem("rsgt_sound_enabled") !== "false"
    refresh()

    let es: EventSource | null = null
    try {
      es = new EventSource("/api/admin/realtime/stream")
      es.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data)
          if (msg.table === "leads" && msg.payload) {
            handleNewLead(msg.payload)
          } else if (msg.table === "notifications" && msg.payload) {
            handleNewNotification(msg.payload)
          }
        } catch {
          /* malformed */
        }
      }
      es.onerror = () => {
        es?.close()
      }
    } catch {
      es = null
    }

    const poll = setInterval(refresh, 60000)
    return () => {
      es?.close()
      clearInterval(poll)
    }
  }, [refresh, handleNewLead, handleNewNotification])

  const markAllRead = useCallback(async () => {
    await fetch("/api/admin/notifications", { method: "POST" })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <RealtimeContext.Provider value={{ notifications, unreadCount, latestLeads, refresh, markAllRead }}>
      {children}
    </RealtimeContext.Provider>
  )
}
