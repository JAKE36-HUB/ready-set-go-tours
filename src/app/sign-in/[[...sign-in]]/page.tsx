"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Eye, EyeOff, Loader2, ShieldCheck, KeyRound, ChevronLeft } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [factorId, setFactorId] = useState("")
  const [code, setCode] = useState("")
  const [mfaLoading, setMfaLoading] = useState(false)
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active || !session) return
      // If a session exists but 2FA is enrolled and not yet verified, resume the code step
      // instead of redirecting (prevents a redirect loop with the middleware).
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
        const { data: factors } = await supabase.auth.mfa.listFactors()
        const verified = factors?.totp.find((f) => f.status === "verified")
        if (verified) {
          setFactorId(verified.id)
          setMfaRequired(true)
          return
        }
        setError("Your 2FA setup needs attention — open Admin → Security to finish it.")
        return
      }
      // Guard against redirect loops: never bounce back to /admin more than once per 15s
      try {
        const last = Number(sessionStorage.getItem("rsg-loop-guard") || 0)
        if (Date.now() - last < 15000) {
          setError("Still having trouble? Sign out and sign back in, or clear your browser cache.")
          return
        }
        sessionStorage.setItem("rsg-loop-guard", String(Date.now()))
      } catch {}
      if (active) window.location.href = "/admin"
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (mfaRequired) codeRef.current?.focus()
  }, [mfaRequired])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || "Unable to sign in. Please try again.")
        return
      }

      if (data.mfaRequired) {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: factors } = await supabase.auth.mfa.listFactors()
        const verified = factors?.totp.find((f) => f.status === "verified")
        if (!verified) {
          setError("Your 2FA setup is incomplete — finish it in Admin → Security, then sign in again.")
          setMfaRequired(false)
          return
        }
        setFactorId(verified.id)
        setMfaRequired(true)
        setCode("")
        return
      }

      window.location.href = "/admin"
    } catch {
      setError("Network error — please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleMfaSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMfaLoading(true)

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
        codeRef.current?.focus()
        return
      }

      window.location.href = "/admin"
    } catch {
      setError("Network error — please try again.")
    } finally {
      setMfaLoading(false)
    }
  }

  return (
    <div className="h-screen supports-[height:100dvh]:h-dvh flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/20">
            <span className="text-white font-bold text-lg">RS</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {mfaRequired ? "Two-Factor Authentication" : "Admin Sign In"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ready Set Go Tours & Travel</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 flex items-center justify-center gap-1">
            {mfaRequired ? (
              <>
                <KeyRound className="w-3 h-3" />
                Enter the 6-digit code from your authenticator app
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3" />
                Authorized admin emails only
              </>
            )}
          </p>
        </div>

        {!mfaRequired ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
                className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full h-11 px-4 pr-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="mfa-code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Authenticator code
              </label>
              <input
                id="mfa-code"
                ref={codeRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                required
                className="w-full h-11 px-4 text-center text-2xl tracking-[0.5em] font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={mfaLoading || code.length !== 6}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {mfaLoading && <Loader2 className="size-4 animate-spin" />}
              {mfaLoading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMfaRequired(false)
                setError("")
              }}
              className="w-full flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="size-3" />
              Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
