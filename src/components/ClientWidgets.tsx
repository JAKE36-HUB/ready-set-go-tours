"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const WhatsAppButton = dynamic(() => import("@/components/layout/WhatsAppButton").then(m => m.WhatsAppButton), { ssr: false })
const AiChat = dynamic(() => import("@/components/layout/AiChat").then(m => m.AiChat), { ssr: false })
const CookieConsent = dynamic(() => import("@/components/layout/CookieConsent").then(m => m.CookieConsent), { ssr: false })
const ScrollToTop = dynamic(() => import("@/components/layout/ScrollToTop").then(m => m.ScrollToTop), { ssr: false })
const ScrollToTopOnNavigate = dynamic(() => import("@/components/layout/ScrollToTopOnNavigate").then(m => m.ScrollToTopOnNavigate), { ssr: false })
const VisitorTracker = dynamic(() => import("@/components/admin/VisitorTracker"), { ssr: false })
const PopupEngine = dynamic(() => import("@/components/popups/PopupEngine").then(m => m.PopupEngine), { ssr: false })
const ExitIntentModal = dynamic(() => import("@/components/layout/ExitIntentModal").then(m => m.ExitIntentModal), { ssr: false })
const BookingModalHost = dynamic(() => import("@/components/layout/BookingModalHost").then(m => m.BookingModalHost), { ssr: false })
const ScrollProgress = dynamic(() => import("@/components/motion/ScrollProgress").then(m => m.ScrollProgress), { ssr: false })

/**
 * Heavy, non-above-the-fold widgets (chat, popups, booking form, tracking)
 * are mounted only after the page has settled. On mobile this keeps the main
 * thread free during LCP and dramatically reduces Total Blocking Time.
 */
function useDeferredMount(delay: number): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const idle = (window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }).requestIdleCallback

    let idleId: number | undefined
    let timeoutId: number | undefined

    if (idle) {
      idleId = idle(() => setReady(true), { timeout: delay + 1500 })
    } else {
      timeoutId = window.setTimeout(() => setReady(true), delay)
    }

    // Fallback timer in case requestIdleCallback never fires.
    timeoutId = window.setTimeout(() => setReady(true), delay + 2000)

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [delay])

  return ready
}

export function ClientWidgets() {
  const deferred = useDeferredMount(2200)

  return (
    <>
      <WhatsAppButton />
      <ScrollToTop />
      <ScrollToTopOnNavigate />
      <CookieConsent />
      <BookingModalHost />
      {deferred && (
        <>
          <ScrollProgress />
          <VisitorTracker />
          <AiChat />
          <PopupEngine />
          <ExitIntentModal />
        </>
      )}
    </>
  )
}
