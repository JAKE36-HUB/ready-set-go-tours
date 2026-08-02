"use client"

import dynamic from "next/dynamic"

const WhatsAppButton = dynamic(() => import("@/components/layout/WhatsAppButton").then(m => m.WhatsAppButton), { ssr: false })
const AiChat = dynamic(() => import("@/components/layout/AiChat").then(m => m.AiChat), { ssr: false })
const CookieConsent = dynamic(() => import("@/components/layout/CookieConsent").then(m => m.CookieConsent), { ssr: false })
const ScrollToTop = dynamic(() => import("@/components/layout/ScrollToTop").then(m => m.ScrollToTop), { ssr: false })
const VisitorTracker = dynamic(() => import("@/components/admin/VisitorTracker"), { ssr: false })
const PopupEngine = dynamic(() => import("@/components/popups/PopupEngine").then(m => m.PopupEngine), { ssr: false })

export function ClientWidgets() {
  return (
    <>
      <VisitorTracker />
      <AiChat />
      <WhatsAppButton />
      <ScrollToTop />
      <CookieConsent />
      <PopupEngine />
    </>
  )
}
