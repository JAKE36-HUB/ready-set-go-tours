"use client"

import { useEffect, useRef } from "react"
import { RefreshCw } from "lucide-react"

export default function FetchRetry({ label, onRetry }: { label: string; onRetry: () => void }) {
  const autoRetried = useRef(false)

  useEffect(() => {
    if (autoRetried.current) return
    const t = setTimeout(() => {
      autoRetried.current = true
      onRetry()
    }, 2500)
    return () => clearTimeout(t)
  }, [onRetry])

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
          <RefreshCw className="w-7 h-7 text-amber-500 animate-pulse" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Could not load this {label}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          A temporary connection problem. We&apos;re retrying automatically — if it still fails, click
          below.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="size-4" /> Try again
        </button>
      </div>
    </main>
  )
}
