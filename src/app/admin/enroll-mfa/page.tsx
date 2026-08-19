"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2, ShieldCheck, KeyRound, QrCode, Copy, Check, Trash2, LogOut } from "lucide-react"

export default function EnrollMfaPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [factorId, setFactorId] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [starting, setStarting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [copied, setCopied] = useState(false)

  function client() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      const supabase = client()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!active) return
      if (!session) {
        router.replace("/sign-in")
        return
      }
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const verified = factors?.totp.find((f) => f.status === "verified")
      if (verified) {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
        router.replace(aal?.currentLevel === "aal2" ? "/admin" : "/admin/verify-mfa")
        return
      }
      const pending = factors?.totp.find((f) => f.status !== "verified")
      if (pending?.id) setFactorId(pending.id)
      if (!active) return
      setChecking(false)
    })()
    return () => {
      active = false
    }
  }, [router])

  async function startSetup() {
    setStarting(true)
    setError("")
    try {
      const { data, error: err } = await client().auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Google Authenticator",
      })
      if (err) {
        setError(err.message || "Could not start setup")
        return
      }
      setFactorId(data.id)
      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
    } catch {
      setError("Could not start setup - is 2FA enabled in the Supabase dashboard?")
    } finally {
      setStarting(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setVerifying(true)
    setError("")
    try {
      const { error: err } = await client().auth.mfa.challengeAndVerify({
        factorId,
        code: code.trim(),
      })
      if (err) {
        setError(err.message || "Invalid code. Try again.")
        setCode("")
        return
      }
      router.replace("/admin")
      router.refresh()
    } catch {
      setError("Network error - please try again.")
    } finally {
      setVerifying(false)
    }
  }

  async function cancelSetup() {
    if (!factorId) return
    if (!confirm("Cancel this unfinished 2FA setup? You can then start fresh.")) return
    setCancelling(true)
    setError("")
    try {
      const supabase = client()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const res = await fetch("/api/admin/mfa-factor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, factorId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Could not cancel setup")
        return
      }
      setFactorId("")
      setQrCode("")
      setSecret("")
      setCode("")
    } catch {
      setError("Network error - please try again.")
    } finally {
      setCancelling(false)
    }
  }

  async function copySecret() {
    try {
      await navigator.clipboard.writeText(secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
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
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              Secure Your Admin Account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Two-factor authentication is required for admin access
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {qrCode ? (
          <form onSubmit={handleVerify} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-sky-500" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Scan this QR code with your authenticator app
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="mx-auto sm:mx-0 w-44 h-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCode} alt="2FA setup QR code" className="w-full h-full" />
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Enter this code manually if you cannot scan:
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
                  <label htmlFor="setup-code" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Then enter the 6-digit code shown in the app
                  </label>
                  <input
                    id="setup-code"
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
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying || code.length !== 6}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {verifying ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
              {verifying ? "Verifying..." : "Enable 2FA"}
            </button>
          </form>
        ) : factorId ? (
          <form onSubmit={handleVerify} className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/30 p-5 space-y-4">
            <div className="text-sm font-semibold text-amber-700 dark:text-amber-300">Setup in progress</div>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
              A 2FA setup was started but not finished. If the QR code is already in your authenticator
              app, enter the 6-digit code below to finish. Otherwise cancel and start over.
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              required
              className="w-full h-11 px-4 text-center text-2xl tracking-[0.5em] font-mono rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={verifying || code.length !== 6}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {verifying && <Loader2 className="size-4 animate-spin" />}
                {verifying ? "Verifying..." : "Finish setup"}
              </button>
              <button
                type="button"
                onClick={cancelSetup}
                disabled={cancelling}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/40 disabled:opacity-50 transition-colors"
              >
                {cancelling ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                Cancel setup
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              The admin panel now requires two-factor authentication on every administrator account.
              Use Google Authenticator, Authy, or any TOTP app to protect this account.
            </p>
            <button
              onClick={startSetup}
              disabled={starting}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {starting ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
              {starting ? "Starting..." : "Set up 2FA"}
            </button>
          </div>
        )}

        <button
          onClick={async () => {
            await client().auth.signOut()
            window.location.href = "/"
          }}
          className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </div>
  )
}