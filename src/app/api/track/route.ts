import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, page, referrer, user_agent, duration } = body

    if (!session_id || !page) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || ""
    const country = req.headers.get("x-vercel-ip-country") || ""
    const city = req.headers.get("x-vercel-ip-city") || ""

    const sb = getSupabaseAdmin()

    const { data: existing } = await sb
      .from("visitors")
      .select("id, duration_seconds")
      .eq("session_id", session_id)
      .eq("page", page)
      .single()

    if (existing) {
      await sb
        .from("visitors")
        .update({
          last_active_at: new Date().toISOString(),
          duration_seconds: Math.max(existing.duration_seconds, duration),
        })
        .eq("id", existing.id)
    } else {
      await sb
        .from("visitors")
        .insert({
          session_id,
          page,
          referrer,
          user_agent,
          ip,
          country,
          city,
          entered_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
          duration_seconds: duration,
        })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
