"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const COOKIE_CONSENT_KEY = "readysetgo-cookie-consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-6xl">
            <div className="relative rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-900/10 dark:ring-slate-700/50 p-5 sm:p-6">
              <button
                onClick={decline}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row items-start gap-4 pr-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 shrink-0">
                  <Cookie className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                    Cookie Notice
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    We use cookies to enhance your browsing experience, analyze site traffic, and
                    personalize content. By clicking &ldquo;Accept All&rdquo;, you consent to our use of
                    cookies. See our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-sky-600 dark:text-sky-400 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>{" "}
                    for more details.
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <Button
                    variant="outline"
                    onClick={decline}
                    className="text-sm h-9 px-4"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={accept}
                    className="text-sm h-9 px-5 bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-0 hover:shadow-lg transition-all"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
