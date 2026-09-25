"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  KeyRound,
  ChevronLeft,
  Mail,
  Lock,
  Sparkles,
  QrCode,
} from "lucide-react"

const BRAND = "Ready Set Go Tours"

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
    <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-gradient-to-br from-burgundy-50 via-white to-burgundy-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 px-4 py-10">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-burgundy-400/20 dark:bg-burgundy-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[30rem] w-[30rem] rounded-full bg-burgundy-400/20 dark:bg-burgundy-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-[8%] h-72 w-72 rounded-full bg-burgundy-300/20 dark:bg-burgundy-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_80%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#2E0A0C_80%)] opacity-60" />

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-burgundy-900/10 dark:shadow-black/40">
          {/* Header */}
          <div className="pt-10 px-8 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-burgundy-500 to-burgundy-400 flex items-center justify-center shadow-lg shadow-burgundy-500/30">
              {mfaRequired ? (
                <QrCode className="w-7 h-7 text-white" />
              ) : (
                <span className="text-white font-bold text-xl">RS</span>
              )}
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {mfaRequired ? "Two-Factor Authentication" : "Welcome back"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mfaRequired
                  ? "Enter the 6-digit code from your authenticator app"
                  : "Sign in to the admin panel"}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-burgundy-500/10 dark:bg-burgundy-500/15 border border-burgundy-200/60 dark:border-burgundy-500/20 px-3 py-1 text-[11px] font-medium text-burgundy-700 dark:text-burgundy-300">
              <Sparkles className="size-3" />
              {BRAND}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-8 my-6 border-t border-slate-200/70 dark:border-slate-800" />

          {/* Body */}
          <div className="px-8 pb-10">
            {!mfaRequired ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      autoComplete="username"
                      required
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/30 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/30 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-burgundy-500 to-burgundy-400 hover:from-burgundy-600 hover:to-burgundy-500 text-white text-sm font-semibold shadow-md shadow-burgundy-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMfaSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
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
                    className="w-full h-12 px-4 text-center text-2xl tracking-[0.5em] font-mono rounded-xl border border-burgundy-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/30 outline-none transition-all"
                  />
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    Open your authenticator app and enter the current 6-digit code for{" "}
                    <span className="font-medium text-slate-500 dark:text-slate-400">{BRAND}</span>.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={mfaLoading || code.length !== 6}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-burgundy-500 to-burgundy-400 hover:from-burgundy-600 hover:to-burgundy-500 text-white text-sm font-semibold shadow-md shadow-burgundy-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
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

            {!mfaRequired && (
              <div className="mt-8 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 px-2 py-3 text-center">
                  <ShieldCheck className="mx-auto size-4 text-burgundy-500 mb-1" />
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Password protected</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 px-2 py-3 text-center">
                  <KeyRound className="mx-auto size-4 text-burgundy-500 mb-1" />
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">2FA ready</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 px-2 py-3 text-center">
                  <Lock className="mx-auto size-4 text-burgundy-500 mb-1" />
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Secure access</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
          Protected access for authorized team members only
        </p>
      </div>
    </div>
  )
}