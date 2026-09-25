"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2, KeyRound, ShieldCheck, LogOut } from "lucide-react"

export default function VerifyMfaPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [factorId, setFactorId] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    let active = true
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return
      if (!session) {
        router.replace("/sign-in")
        return
      }
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aal?.currentLevel === "aal2") {
        router.replace("/admin")
        return
      }
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const verified = factors?.totp.find((f) => f.status === "verified")
      if (!active) return
      if (!verified) {
        setError(
          "No verified authenticator was found on this account. Sign out, then finish your 2FA setup in Admin → Security."
        )
      } else {
        setFactorId(verified.id)
      }
      setChecking(false)
    })
    return () => {
      active = false
    }
  }, [router])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setVerifying(true)
    try {
      const res = await fetch("/api/auth/mfa-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factorId, code }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || "Invalid code. Please try again.")
        setCode("")
        return
      }
      router.replace("/admin")
      router.refresh()
    } catch {
      setError("Network error — please try again.")
    } finally {
      setVerifying(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
        <p className="text-sm text-slate-500">Checking your session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
        </div>

        {error && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={async () => {
                const supabase = createBrowserClient(
                  process.env.NEXT_PUBLIC_SUPABASE_URL!,
                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                )
                await supabase.auth.signOut()
                window.location.href = "/"
              }}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        )}

        {factorId && (
          <form onSubmit={handleVerify} className="space-y-5">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              required
              className="w-full h-11 px-4 text-center text-2xl tracking-[0.5em] font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={verifying || code.length !== 6}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {verifying ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
              {verifying ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
