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
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur-lg transition-transform duration-300 ease-out md:hidden"
      style={{ transform: show ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <Button
          className="h-11 flex-1 border-0 bg-[#25D366] text-sm font-semibold text-white hover:bg-[#1fb857]"
          onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
        <Link href={PLAN_SAFARI_ROUTE} className="flex-[2]">
          <Button className="h-11 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Plan My Safari
          </Button>
        </Link>
      </div>
    </div>
  )
}