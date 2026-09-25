import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { rateLimit, badRequest, tooManyRequests, sanitizeString } from "@/lib/security"

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`track:${ip}`, 60, 60_000)) {
      return tooManyRequests()
    }

    const body = await req.json()
    const { session_id, page, referrer, user_agent, duration } = body

    if (!session_id || !page) {
      return badRequest("Missing required fields")
    }

    const cleanSessionId = sanitizeString(session_id, 100)
    const cleanPage = sanitizeString(page, 500)
    const cleanReferrer = sanitizeString(referrer, 500)
    const cleanUserAgent = sanitizeString(user_agent, 500)
    const cleanDuration = typeof duration === "number" ? Math.min(duration, 86400) : 0

    const country = req.headers.get("x-vercel-ip-country") || ""
    const city = req.headers.get("x-vercel-ip-city") || ""

    const sb = getSupabaseAdmin()

    const { data: existing } = await sb
      .from("visitors")
      .select("id, duration_seconds")
      .eq("session_id", cleanSessionId)
      .eq("page", cleanPage)
      .single()

    if (existing) {
      await sb
        .from("visitors")
        .update({
          last_active_at: new Date().toISOString(),
          duration_seconds: Math.max(existing.duration_seconds, cleanDuration),
        })
        .eq("id", existing.id)
    } else {
      await sb
        .from("visitors")
        .insert({
          session_id: cleanSessionId,
          page: cleanPage,
          referrer: cleanReferrer,
          user_agent: cleanUserAgent,
          ip,
          country,
          city,
          entered_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
          duration_seconds: cleanDuration,
        })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
