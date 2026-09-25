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

interface TrackPayload {
  session_id: string
  page: string
  referrer: string
  user_agent: string
  duration: number
}

function buildPayload(pathname: string, sessionId: string, startTime: number): TrackPayload {
  return {
    session_id: sessionId,
    page: pathname,
    referrer: document.referrer || "",
    user_agent: navigator.userAgent,
    duration: Math.floor((Date.now() - startTime) / 1000),
  }
}

export default function VisitorTracker() {
  const pathname = usePathname()
  const startTime = useRef(0)
  const sessionId = useRef("")

  useEffect(() => {
    sessionId.current = getSessionId()
    if (!sessionId.current) return

    startTime.current = Date.now()

    const send = async (payload: TrackPayload, beacon = false) => {
      try {
        const body = JSON.stringify(payload)
        if (beacon) {
          navigator.sendBeacon("/api/track", body)
        } else {
          await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          })
        }
      } catch {}
    }

    const track = (beacon = false) =>
      send(buildPayload(pathname, sessionId.current, startTime.current), beacon)

    // Create the visit row immediately (0s), then capture short sessions too.
    track(false)
    const early = setTimeout(() => track(false), 5_000)
    const heartbeat = setInterval(() => track(false), 15_000)

    const flush = () => track(true)

    // pagehide is more reliable than beforeunload (mobile, bfcache, navigation).
    window.addEventListener("pagehide", flush)
    window.addEventListener("beforeunload", flush)
    // When the tab/app is hidden (backgrounded phone tab), finalize the visit.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush()
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      clearTimeout(early)
      clearInterval(heartbeat)
      window.removeEventListener("pagehide", flush)
      window.removeEventListener("beforeunload", flush)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [pathname])

  return null
}