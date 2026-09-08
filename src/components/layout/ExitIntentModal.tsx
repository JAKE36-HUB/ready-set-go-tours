"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Gift, Send, Loader2, CheckCircle2 } from "lucide-react"
import { getClientSessionId } from "@/lib/session"

const STORAGE_KEY = "rsgt_exit_guide_shown"

function isEnabledDevice() {
  if (typeof window === "undefined") return false
  try {
    if (window.matchMedia("(pointer: fine)").matches && !navigator.maxTouchPoints) return true
  } catch {}
  return false
}

export function ExitIntentModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const armedRef = useRef(false)

  useEffect(() => {
    if (!isEnabledDevice()) return
    let shown = false
    try {
      shown = localStorage.getItem(STORAGE_KEY) === "1"
    } catch {}
    if (shown) return

    const armTimer = setTimeout(() => {
      armedRef.current = true
    }, 4000)

    const onMouseOut = (e: MouseEvent) => {
      if (!armedRef.current || open) return
      if (e.clientY <= 0 && !e.relatedTarget) {
        armedRef.current = false
        setOpen(true)
        try {
          localStorage.setItem(STORAGE_KEY, "1")
        } catch {}
      }
    }

    document.addEventListener("mouseout", onMouseOut)
    return () => {
      clearTimeout(armTimer)
      document.removeEventListener("mouseout", onMouseOut)
    }
  }, [open])

  const handleSubmit = async () => {
    if (!email.includes("@")) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "exit_intent",
          name,
          email,
          page: window.location.pathname,
          session_id: getClientSessionId(),
        }),
      })
      if (!res.ok) throw new Error("failed")
      setDone(true)
      setTimeout(() => setOpen(false), 3500)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Free safari guide"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 ring-1 ring-white/10 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {done ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">See You Inside!</h3>
                <p className="text-sm text-white/60">
                  Your free safari guide is on its way to <span className="text-emerald-400 font-medium">{email}</span>.
                </p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-5">
                  <Gift className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Wait — Grab Our Free Safari Guide First!</h3>
                <p className="text-sm text-white/60 mb-6">
                  Before you go, download our insider guide to the best East Africa safaris — packed with routes,
                  prices and packing tips.
                </p>

                <div className="space-y-3 mb-5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 text-sm"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 text-sm"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2.5 mb-4 ring-1 ring-red-500/20">{error}</p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !email.includes("@")}
                  className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? "Sending..." : "Send Me the Free Guide"}
                </button>

                <button type="button" onClick={() => setOpen(false)} className="w-full text-center text-xs text-white/40 hover:text-white/70 mt-4 transition-colors">
                  No thanks, I&apos;ll keep planning
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}