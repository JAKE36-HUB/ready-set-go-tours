import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { rateLimit, badRequest, tooManyRequests, sanitizeString } from "@/lib/security"

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`track-conversion:${ip}`, 60, 60_000)) {
      return tooManyRequests()
    }

    const body = await req.json()
    const { session_id, type, label, details, page } = body

    if (!type || !session_id) {
      return badRequest("Missing required fields")
    }

    const cleanSessionId = sanitizeString(session_id, 100)
    const cleanType = sanitizeString(type, 50).toLowerCase().replace(/[^a-z0-9_-]/g, "") || "lead"
    const cleanLabel = sanitizeString(label, 200)
    const cleanDetails = sanitizeString(details, 1000)
    const cleanPage = sanitizeString(page, 500)

    const country = req.headers.get("x-vercel-ip-country") || ""
    const city = req.headers.get("x-vercel-ip-city") || ""

    const sb = getSupabaseAdmin()

    const { error } = await sb.from("conversions").insert({
      session_id: cleanSessionId,
      type: cleanType,
      label: cleanLabel,
      details: cleanDetails,
      page: cleanPage,
      ip,
      country,
      city,
      created_at: new Date().toISOString(),
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}