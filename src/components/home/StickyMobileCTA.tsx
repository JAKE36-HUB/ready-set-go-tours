"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

export function StickyMobileCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: show ? 0 : 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-3 md:hidden"
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <Link href="/deals" className="flex-1">
          <Button className="w-full h-11 text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-0">
            View Deals
          </Button>
        </Link>
        <Link href="/contact" className="flex-[2]">
          <Button className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 border-0 shadow-lg shadow-emerald-500/25">
            Plan Your Safari
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
