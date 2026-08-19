import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { rateLimit, verifyOrigin, badRequest } from "@/lib/security"

export const dynamic = "force-dynamic"

const MAX_ATTEMPTS_PER_IP = 10
const IP_WINDOW_MS = 15 * 60 * 1000

function friendlyError(code: string | undefined | null, fallback: string): string {
  switch (code) {
    case "otp_expired":
      return "That code expired — use the current code shown in your authenticator app."
    case "otp_rejected":
    case "verification_failed":
      return "Invalid code. Check your authenticator app and try the latest code."
    case "over_request_rate_limit":
      return "Too many attempts from this device. Wait a few minutes and try a fresh code."
    default:
      return fallback
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  if (!verifyOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: { factorId?: string; code?: string }
  try {
    body = await req.json()
  } catch {
    return badRequest()
  }

  const factorId = (body.factorId || "").trim()
  const code = (body.code || "").trim()

  if (!factorId || !/^\d{6}$/.test(code)) {
    return badRequest("A valid 6-digit code is required")
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

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Session expired — sign in again." }, { status: 401 })
  }

  const limitKey = `mfa:${ip}:${user.id}`
  if (!rateLimit(limitKey, MAX_ATTEMPTS_PER_IP, IP_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait 15 minutes, then use a fresh code." },
      { status: 429 }
    )
  }

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code })
  if (error) {
    return NextResponse.json({ error: friendlyError(error.code, "Invalid code. Try again.") }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
