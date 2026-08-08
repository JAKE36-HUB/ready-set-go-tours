import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { rateLimit, verifyOrigin, badRequest } from "@/lib/security"

export const dynamic = "force-dynamic"

const MAX_ATTEMPTS_PER_IP = 5
const IP_WINDOW_MS = 5 * 60 * 1000

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  if (!verifyOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (!rateLimit(`mfa:${ip}`, MAX_ATTEMPTS_PER_IP, IP_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 }
    )
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

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code })
  if (error) {
    return NextResponse.json({ error: "Invalid code. Try again." }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
