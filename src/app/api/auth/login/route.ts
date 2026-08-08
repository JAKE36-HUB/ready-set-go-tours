import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { rateLimit, verifyOrigin, badRequest } from "@/lib/security"
import { isAdminEmail } from "@/lib/admin-access"

export const dynamic = "force-dynamic"

const MAX_ATTEMPTS_PER_IP = 5
const IP_WINDOW_MS = 5 * 60 * 1000
const MAX_ATTEMPTS_PER_EMAIL = 5
const EMAIL_WINDOW_MS = 15 * 60 * 1000

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  if (!verifyOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (!rateLimit(`login:${ip}`, MAX_ATTEMPTS_PER_IP, IP_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please wait a few minutes and try again." },
      { status: 429 }
    )
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

  if (!rateLimit(`login-email:${email}`, MAX_ATTEMPTS_PER_EMAIL, EMAIL_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many sign-in attempts for this account. Please wait 15 minutes." },
      { status: 429 }
    )
  }

  if (!isAdminEmail(email)) {
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
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
  }

  // If the user has 2FA enrolled, require the authenticator step before granting admin access
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (aal?.nextLevel === "aal2") {
    return NextResponse.json({ ok: true, mfaRequired: true })
  }

  return NextResponse.json({ ok: true })
}
