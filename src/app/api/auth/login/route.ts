import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import {
  verifyOrigin,
  badRequest,
  isBlocked,
  recordFailure,
  resetRateLimit,
  retryAfterSeconds,
} from "@/lib/security"
import { isAdminEmail } from "@/lib/admin-access"

export const dynamic = "force-dynamic"

const MAX_ATTEMPTS_PER_IP = 5
const IP_WINDOW_MS = 5 * 60 * 1000
const MAX_ATTEMPTS_PER_EMAIL = 5
const EMAIL_WINDOW_MS = 15 * 60 * 1000

function tooMany(message: string, key: string): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds(key)) } }
  )
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  if (!verifyOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const ipKey = `login:${ip}`
  if (isBlocked(ipKey, MAX_ATTEMPTS_PER_IP)) {
    return tooMany("Too many sign-in attempts. Please wait a few minutes and try again.", ipKey)
  }

  let body: { email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return badRequest()
  }

  const email = (body.email || "").trim().toLowerCase()
  const password = body.password || ""

  if (!email.includes("@") || !password) {
    return badRequest("Email and password are required")
  }

  const emailKey = `login-email:${email}`
  if (isBlocked(emailKey, MAX_ATTEMPTS_PER_EMAIL)) {
    return tooMany("Too many sign-in attempts for this account. Please wait 15 minutes.", emailKey)
  }

  // Only charge the attempt once we know it is going to fail, so a
  // successful sign-in (or a few honest typos before one) never locks
  // the owner out of their own panel.
  const charge = () => {
    recordFailure(ipKey, MAX_ATTEMPTS_PER_IP, IP_WINDOW_MS)
    recordFailure(emailKey, MAX_ATTEMPTS_PER_EMAIL, EMAIL_WINDOW_MS)
  }

  if (!isAdminEmail(email)) {
    charge()
    return NextResponse.json(
      { error: "This email is not authorized to access the admin panel." },
      { status: 403 }
    )
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) => {
          cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    charge()
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
  }

  // Credential is good — forgive the failures logged against this address.
  // The IP bucket is intentionally left alone so a valid credential on a
  // shared NAT cannot hand a fresh budget to someone else attacking it.
  resetRateLimit(emailKey)

  // Ask for an authenticator code if the account has 2FA set up. Return the
  // factor id directly so the client does not need a second round trip to
  // list factors while the new cookie is still settling.
  const { data: factors } = await supabase.auth.mfa.listFactors()
  const verified = factors?.totp.find((f) => f.status === "verified")
  if (verified) {
    return NextResponse.json({ ok: true, mfaRequired: true, factorId: verified.id })
  }

  return NextResponse.json({ ok: true })
}
