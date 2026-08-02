import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { rateLimit, tooManyRequests, badRequest, sanitizeString } from "@/lib/security"
import { createLead } from "@/lib/leads/create"
import { browserLabel, deviceLabel } from "@/lib/leads/types"

export const dynamic = "force-dynamic"

const MAX_FIELD = 500
const ALLOWED_SOURCES = ["contact_form", "booking", "newsletter", "whatsapp", "popup_lead", "package_inquiry"]

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`lead:${ip}`, 20, 60_000)) {
      return tooManyRequests()
    }

    const body = await req.json()
    const s = (v: unknown) => sanitizeString(v, MAX_FIELD)

    const source = s(body.source) || "contact_form"
    if (!ALLOWED_SOURCES.includes(source)) return badRequest("Invalid source")

    const email = s(body.email).toLowerCase()
    const name = s(body.name)
    const phone = s(body.phone)

    if (source === "newsletter") {
      if (!email || !email.includes("@")) return badRequest("Email required")
    } else if (!name && !phone && !email) {
      return badRequest("At least a name, phone or email is required")
    }

    const sb = getSupabaseAdmin()

    if (source === "newsletter" && email) {
      const { data: existing } = await sb
        .from("leads")
        .select("id")
        .eq("source", "newsletter")
        .eq("email", email)
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1)
      if (existing && existing.length > 0) {
        return NextResponse.json({ ok: true, duplicate: true })
      }
    }

    const ua = req.headers.get("user-agent") || ""

    await createLead(sb, {
      name,
      email,
      phone,
      country: s(body.country),
      destination: s(body.destination),
      travel_date: s(body.travel_date),
      budget: s(body.budget),
      adults: s(body.adults),
      children: s(body.children),
      message: s(body.message),
      source,
      page: s(body.page),
      utm_source: s(body.utm_source),
      utm_medium: s(body.utm_medium),
      utm_campaign: s(body.utm_campaign),
      browser: browserLabel(ua),
      device: deviceLabel(ua),
      ip,
      ip_country: s(req.headers.get("x-vercel-ip-country")),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
