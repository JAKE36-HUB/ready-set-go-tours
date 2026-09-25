"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants"

export function StickyMobileCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const whatsappUrl = whatsappLink()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-border p-3 md:hidden transition-transform duration-300 ease-out"
      style={{ transform: show ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <Button
          className="flex-1 h-11 text-sm font-semibold bg-[#25D366] hover:bg-[#1fb857] text-white border-0"
          onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>
        <Link href={PLAN_SAFARI_ROUTE} className="flex-[2]">
          <Button className="w-full h-11 text-sm font-semibold gradient-primary text-white border-0 shadow-lg shadow-amber-900/20">
            Plan My Safari
          </Button>
        </Link>
      </div>
    </div>
  )
}