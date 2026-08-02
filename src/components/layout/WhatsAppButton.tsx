"use client"

import { MessageCircle } from "lucide-react"
import { COMPANY } from "@/lib/constants"

const TRACKED_KEY = "rsgt_wa_clicked"

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp}?text=Hello%21%20I%27d%20like%20to%20inquire%20about%20your%20travel%20services.`

  function handleClick() {
    try {
      if (!localStorage.getItem(TRACKED_KEY)) {
        localStorage.setItem(TRACKED_KEY, "1")
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "whatsapp",
            message: "WhatsApp chat request",
            page: window.location.pathname,
          }),
        }).catch(() => {})
      }
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 group animate-[wiggle_1s_ease-in-out_1s_1]">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
        <MessageCircle className="w-6 h-6 relative z-10" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full z-10">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
        </span>
      </a>

      <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          Chat with us
          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
        </div>
      </div>
    </div>
  )
}
