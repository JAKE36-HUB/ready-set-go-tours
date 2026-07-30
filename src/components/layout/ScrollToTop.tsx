"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-40 transition-all duration-300 ease-out",
        visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-50 translate-y-5 pointer-events-none"
      )}
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className={cn(
          "w-11 h-11 rounded-full",
          "bg-gradient-to-br from-sky-500 to-cyan-400",
          "text-white border-0 shadow-lg shadow-sky-500/25",
          "hover:shadow-xl hover:shadow-sky-500/30 hover:scale-110",
          "transition-all duration-300"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </div>
  )
}
