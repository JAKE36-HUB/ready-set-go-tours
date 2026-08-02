import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { rateLimit, tooManyRequests, badRequest, sanitizeString } from "@/lib/security"

export const dynamic = "force-dynamic"

const VALID_EVENTS = ["impression", "click", "dismiss", "conversion", "whatsapp"]

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`popup-ev:${ip}`, 120, 60_000)) {
      return tooManyRequests()
    }

    const body = await req.json()
    const {
      popup_id,
      variant,
      event_type,
      cta_index,
      cta_label,
      page,
      session_id,
      source,
      utm_campaign,
      duration_ms,
    } = body

    if (!popup_id || !VALID_EVENTS.includes(event_type || "")) {
      return badRequest("Missing or invalid fields")
    }

    const sb = getSupabaseAdmin()

    await sb.from("popup_events").insert({
      popup_id: Number(popup_id),
      variant: sanitizeString(variant || "A", 10),
      event_type: event_type,
      cta_index: typeof cta_index === "number" ? cta_index : null,
      cta_label: sanitizeString(cta_label, 200),
      page: sanitizeString(page, 500),
      session_id: sanitizeString(session_id, 100),
      device: sanitizeString(body.device, 20),
      country: req.headers.get("x-vercel-ip-country") || sanitizeString(body.country, 10),
      source: sanitizeString(source, 200),
      utm_campaign: sanitizeString(utm_campaign, 200),
      duration_ms: typeof duration_ms === "number" ? Math.min(duration_ms, 3_600_000) : 0,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
