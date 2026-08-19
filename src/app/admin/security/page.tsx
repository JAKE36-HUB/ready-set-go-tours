"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Factor } from "@supabase/supabase-js"
import { ShieldCheck, ShieldAlert, QrCode, Loader2, KeyRound, Trash2, Copy, Check } from "lucide-react"
import { toast } from "sonner"

export default function SecurityPage() {
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)
  const [factor, setFactor] = useState<Factor | null>(null)
  const [aal2, setAal2] = useState(false)

  const [enrolling, setEnrolling] = useState(false)
  const [pendingFactorId, setPendingFactorId] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [verifyCode, setVerifyCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [removing, setRemoving] = useState(false)

  async function refresh() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: factors } = await supabase.auth.mfa.listFactors()
    const verified = factors?.totp.find((f) => f.status === "verified")
    if (verified) {
      setEnrolled(true)
      setFactor(verified)
      setPendingFactorId("")
    } else {
      setEnrolled(false)
      setFactor(null)
      // A pending (unverified) factor blocks re-enrollment — offer to finish or cancel it
      const pending = factors?.totp.find((f) => f.status !== "verified")
      setPendingFactorId(pending?.id ?? "")
      if (pending?.id) {
        setQrCode("")
        setSecret("")
      }
    }
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    setAal2(aal?.currentLevel === "aal2")
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await refresh()
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  async function startEnroll() {
    setEnrolling(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Google Authenticator",
      })
      if (error) {
        if (error.message?.toLowerCase().includes("already")) {
          await refresh()
          setEnrolling(false)
          return
        }
        toast.error(error.message || "Could not start setup")
        return
      }
      setPendingFactorId(data.id)
      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
    } catch {
      toast.error("Could not start setup — is 2FA enabled in the Supabase dashboard?")
    } finally {
      setEnrolling(false)
    }
  }

  async function verifyEnroll(e: React.FormEvent) {
    e.preventDefault()
    setVerifying(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: pendingFactorId,
        code: verifyCode.trim(),
      })
      if (error) {
        toast.error(error.message || "Invalid code. Try again.")
        setVerifyCode("")
        return
      }
      toast.success("Two-factor authentication enabled")
      setQrCode("")
      setSecret("")
      setVerifyCode("")
      setPendingFactorId("")
      await refresh()
    } finally {
      setVerifying(false)
    }
  }

  async function remove2FA() {
    if (!factor) return
    if (!confirm("Disable two-factor authentication on this account?")) return
    setRemoving(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id })
      if (error) {
        toast.error(error.message || "Could not disable 2FA")
        return
      }
      toast.success("Two-factor authentication disabled")
      await refresh()
    } finally {
      setRemoving(false)
    }
  }

  async function copySecret() {
    try {
      await navigator.clipboard.writeText(secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  async function cancelPending() {
    if (!pendingFactorId) return
    if (!confirm("Cancel this unfinished 2FA setup? You can then start fresh.")) return
    setRemoving(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      const res = await fetch("/api/admin/mfa-factor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, factorId: pendingFactorId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || "Could not cancel setup")
        return
      }
      toast.success("Setup cancelled")
      setPendingFactorId("")
      await refresh()
    } catch {
      toast.error("Network error — please try again.")
    } finally {
      setRemoving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-sky-500/10 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-sky-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Extra protection using an authenticator app (Google Authenticator, Authy, etc.)
          </p>
        </div>
      </div>

      {enrolled ? (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Enabled</p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                {aal2 ? "This session is fully verified (level 2)." : "Authenticator app is connected."}
              </p>
            </div>
          </div>
          {factor && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              App: <span className="font-mono">{factor.friendly_name ?? "Authenticator"}</span> — added on this account
            </div>
          )}
          <button
            onClick={remove2FA}
            disabled={removing}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-950/60 disabled:opacity-50 transition-colors"
          >
            {removing ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Disable 2FA
          </button>
        </div>
      ) : qrCode ? (
        <form onSubmit={verifyEnroll} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-sky-500" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Scan this QR code with your authenticator app
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="mx-auto sm:mx-0 w-48 h-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="2FA setup QR code" className="w-full h-full" />
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Can&apos;t scan? Enter this code manually:
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 block font-mono text-xs break-all bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300">
                    {secret}
                  </code>
                  <button
                    type="button"
                    onClick={copySecret}
                    className="shrink-0 w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label="Copy secret"
                  >
                    {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="verify-code" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Then enter the 6-digit code shown in the app
                </label>
                <input
                  id="verify-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  required
                  className="w-full h-11 px-4 text-center text-2xl tracking-[0.5em] font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={verifying || verifyCode.length !== 6}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {verifying && <Loader2 className="size-4 animate-spin" />}
              {verifying ? "Verifying..." : "Enable 2FA"}
            </button>
            <button
              type="button"
              onClick={() => {
                setQrCode("")
                setSecret("")
                setVerifyCode("")
                setPendingFactorId("")
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : pendingFactorId ? (
        <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/30 p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <p className="text-sm font-semibold">Setup in progress</p>
          </div>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
            A 2FA setup was started but not finished. If you already scanned the QR code into your
            authenticator app, enter the 6-digit code below to finish. Otherwise cancel it and start
            over.
          </p>
          <form onSubmit={verifyEnroll} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              required
              className="w-full h-11 px-4 text-center text-2xl tracking-[0.5em] font-mono rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={verifying || verifyCode.length !== 6}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {verifying && <Loader2 className="size-4 animate-spin" />}
                {verifying ? "Verifying..." : "Finish setup"}
              </button>
              <button
                type="button"
                onClick={cancelPending}
                disabled={removing}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 disabled:opacity-50 transition-colors"
              >
                {removing ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                Cancel setup
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <p className="text-sm font-semibold">Not enabled yet</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            When enabled, signing in to the admin panel will require your password <em>plus</em> a 6-digit
            code from your authenticator app. Use Google Authenticator, Authy, 1Password, or any TOTP app.
          </p>
          <button
            onClick={startEnroll}
            disabled={enrolling}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {enrolling ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
            Set up 2FA
          </button>
        </div>
      )}
    </div>
  )
}
