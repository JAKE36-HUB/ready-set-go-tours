import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { rateLimit, tooManyRequests, badRequest, sanitizeString } from "@/lib/security"

export const dynamic = "force-dynamic"

const MAX_FIELD = 500

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`popup-lead:${ip}`, 10, 60_000)) {
      return tooManyRequests()
    }

    const body = await req.json()
    const { popup_id, popup_name, variant, name, phone, email, country, destination, travel_date, budget, adults, children, message, source, utm_campaign, page } = body

    if (!popup_id) return badRequest("Missing popup_id")

    const s = (v: any) => sanitizeString(v, MAX_FIELD)

    const sb = getSupabaseAdmin()

    const { error } = await sb.from("popup_leads").insert({
      popup_id: Number(popup_id),
      popup_name: s(popup_name),
      variant: s(variant) || "A",
      name: s(name),
      phone: s(phone),
      email: s(email),
      country: s(country),
      destination: s(destination),
      travel_date: s(travel_date),
      budget: s(budget),
      adults: s(adults),
      children: s(children),
      message: s(message),
      source: s(source),
      utm_campaign: s(utm_campaign),
      page: s(page),
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await sb.from("popup_events").insert({
      popup_id: Number(popup_id),
      variant: s(variant) || "A",
      event_type: "conversion",
      page: s(page),
      session_id: s(body.session_id),
      source: s(source),
      utm_campaign: s(utm_campaign),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
