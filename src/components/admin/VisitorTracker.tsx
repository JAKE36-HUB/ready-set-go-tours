"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("rsgt_session_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("rsgt_session_id", id)
  }
  return id
}

export default function VisitorTracker() {
  const pathname = usePathname()
  const startTime = useRef(Date.now())
  const sessionId = useRef("")
  const isAdmin = useRef(false)

  useEffect(() => {
    sessionId.current = getSessionId()
    if (!sessionId.current) return

    isAdmin.current = pathname.startsWith("/admin")

    const track = async () => {
      const duration = Math.floor((Date.now() - startTime.current) / 1000)
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId.current,
            page: pathname,
            referrer: document.referrer || "",
            user_agent: navigator.userAgent,
            duration,
          }),
        })
      } catch {}
    }

    track()

    const heartbeat = setInterval(track, 30000)

    const handleUnload = () => {
      const duration = Math.floor((Date.now() - startTime.current) / 1000)
      navigator.sendBeacon(
        "/api/track",
        JSON.stringify({
          session_id: sessionId.current,
          page: pathname,
          referrer: document.referrer || "",
          user_agent: navigator.userAgent,
          duration,
        })
      )
    }
    window.addEventListener("beforeunload", handleUnload)

    return () => {
      clearInterval(heartbeat)
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [pathname])

  return null
}
