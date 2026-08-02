"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { PopupCTA } from "@/lib/popups/types"
import { ActivePopup, PopupShell } from "./PopupShell"
import { Confetti } from "./Confetti"
import {
  canShow,
  getSession,
  markConverted,
  markShown,
  markWhatsApp,
  matchesTargeting,
  setupTrigger,
} from "@/lib/popups/engine"

interface ApiPopup {
  id: number
  variant: string
  type: string
  name: string
  priority: number
  config: any
}

function sendEvent(body: Record<string, unknown>) {
  try {
    fetch("/api/popup/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {})
  } catch {}
}

export function PopupEngine() {
  const [popups, setPopups] = useState<ApiPopup[]>([])
  const [current, setCurrent] = useState<ActivePopup | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [pendingCTA, setPendingCTA] = useState<{ cta: PopupCTA; index: number } | null>(null)
  const openedAtRef = useRef(0)
  const shownIdsRef = useRef(new Set<number>())
  const pendingCTARef = useRef<{ cta: PopupCTA; index: number } | null>(null)
  const sessionRef = useRef(getSession())

  useEffect(() => {
    const session = sessionRef.current
    const ctrl = new AbortController()

    fetch(`/api/popup?session=${session.id}`, {
      headers: { "x-rsgt-session": session.id },
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((json) => {
        if (json?.meta?.country && typeof window !== "undefined") {
          try {
            window.localStorage.setItem("rsgt_country", json.meta.country)
          } catch {}
        }
        const eligible = (json.popups || [])
          .filter((p: ApiPopup) => matchesTargeting(p.config, sessionRef.current))
          .sort((a: ApiPopup, b: ApiPopup) => b.priority - a.priority)
        setPopups(eligible)
      })
      .catch(() => {})

    return () => ctrl.abort()
  }, [])

  const dismiss = useCallback(() => {
    setCurrent(null)
  }, [])

  useEffect(() => {
    if (current || popups.length === 0) return
    const p = popups[0]
    if (!canShow(p.config.frequency, p.id)) {
      shownIdsRef.current.add(p.id)
      setPopups((prev) => prev.filter((x) => x.id !== p.id))
      return
    }

    const cfg = p.config
    let fired = false
    let cleanup: (() => void) | null = null

    const fire = () => {
      if (fired) return
      fired = true
      if (cleanup) cleanup()
      shownIdsRef.current.add(p.id)
      markShown(p.id)
      openedAtRef.current = Date.now()
      setCurrent({
        id: p.id,
        variant: p.variant,
        type: p.type || cfg.type || "modal",
        name: p.name,
        config: cfg,
      })
      sendEvent({
        popup_id: p.id,
        variant: p.variant,
        event_type: "impression",
        page: window.location.pathname,
        session_id: sessionRef.current.id,
        device: sessionRef.current.device,
        source: sessionRef.current.referrer ? "referral" : "direct",
        utm_campaign: sessionRef.current.utmCampaign,
      })
    }

    cleanup = setupTrigger(cfg, fire)
    return cleanup
  }, [current, popups])

  const trackClose = useCallback(
    (eventType: "dismiss" | "click" | "whatsapp" | "conversion") => {
      if (!current) return
      sendEvent({
        popup_id: current.id,
        variant: current.variant,
        event_type: eventType,
        page: window.location.pathname,
        session_id: sessionRef.current.id,
        device: sessionRef.current.device,
        duration_ms: Date.now() - openedAtRef.current,
      })
    },
    [current]
  )

  const handleCTA = useCallback(
    (cta: PopupCTA, index: number) => {
      if (!current) return
      const isWhatsApp = cta.type === "whatsapp" || cta.url.startsWith("https://wa.me")

      sendEvent({
        popup_id: current.id,
        variant: current.variant,
        event_type: isWhatsApp ? "whatsapp" : "click",
        cta_index: index,
        cta_label: cta.label,
        page: window.location.pathname,
        session_id: sessionRef.current.id,
        device: sessionRef.current.device,
        duration_ms: Date.now() - openedAtRef.current,
      })

      if (isWhatsApp) markWhatsApp(current.id)
      if (cta.type === "close") {
        dismiss()
        return
      }

      if (cta.type === "whatsapp" && current.config.leadForm.enabled) {
        markConverted(current.id)
        trackClose("conversion")
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3000)
        dismiss()
        window.open(cta.url, "_blank", "noopener")
        return
      }

      if (cta.formSubmit) {
        pendingCTARef.current = { cta, index }
        return
      }

      if (cta.url) {
        if (cta.newTab) {
          window.open(cta.url, "_blank", "noopener,noreferrer")
        } else {
          window.location.href = cta.url
        }
      }
      dismiss()
    },
    [current, dismiss, trackClose]
  )

  const handleLeadSuccess = useCallback(() => {
    if (!current) return
    markConverted(current.id)
    trackClose("conversion")
    const pcta = pendingCTARef.current
    if (pcta?.cta.url) {
      if (pcta.cta.newTab) window.open(pcta.cta.url, "_blank", "noopener")
      else window.location.href = pcta.cta.url
    }
    pendingCTARef.current = null
    setConfetti(true)
    setTimeout(() => setConfetti(false), 3000)
    setTimeout(() => {
      dismiss()
      setPopups((prev) => prev.filter((x) => x.id !== current.id))
    }, 2200)
  }, [current, dismiss, trackClose])

  return (
    <>
      <Confetti active={confetti} />
      <AnimatePresence>
        {current && (
          <PopupShell
            popup={current}
            onClose={() => {
              trackClose("dismiss")
              dismiss()
            }}
            onCTA={handleCTA}
            onLeadSuccess={handleLeadSuccess}
          />
        )}
      </AnimatePresence>
    </>
  )
}
