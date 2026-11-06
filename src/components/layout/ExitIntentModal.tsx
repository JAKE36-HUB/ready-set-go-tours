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
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#08130E] p-8 ring-1 ring-white/10 shadow-2xl"
          >
            <span className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
            <span className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-[#E4C9A3]/10 blur-3xl" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 text-white/40 transition-colors hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {done ? (
              <div className="relative py-4 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4C9A3]/15 ring-1 ring-[#E4C9A3]/30">
                  <CheckCircle2 className="h-8 w-8 text-[#E4C9A3]" />
                </div>
                <h3 className="mb-2 font-display text-2xl font-normal text-white">See You Inside!</h3>
                <p className="text-sm text-white/60">
                  Your free safari guide is on its way to{" "}
                  <span className="font-medium text-[#E4C9A3]">{email}</span>.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 ring-1 ring-accent/30">
                  <Gift className="h-6 w-6 text-[#E4C9A3]" />
                </div>
                <h3 className="mb-2 font-display text-2xl font-normal leading-tight text-white">
                  Wait — Grab Our Free Safari Guide First!
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-white/60">
                  Before you go, download our insider guide to the best East Africa safaris — packed with routes,
                  prices and packing tips.
                </p>

                <div className="mb-5 space-y-3">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#E4C9A3]/50 focus:outline-none focus:ring-1 focus:ring-[#E4C9A3]/30"
                    />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-[#E4C9A3]/50 focus:outline-none focus:ring-1 focus:ring-[#E4C9A3]/30"
                  />
                </div>

                {error && (
                  <p className="mb-4 rounded-lg bg-destructive/15 px-4 py-2.5 text-sm text-[#FCA5A5] ring-1 ring-destructive/30">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !email.includes("@")}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E4C9A3] text-sm font-semibold text-[#1F4A38] shadow-lg shadow-black/25 transition-all hover:bg-[#F0DDC0] disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {submitting ? "Sending..." : "Send Me the Free Guide"}
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-4 w-full text-center text-xs text-white/40 transition-colors hover:text-white/70"
                >
                  No thanks, I&apos;ll keep planning
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
