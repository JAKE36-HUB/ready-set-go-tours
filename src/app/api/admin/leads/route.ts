import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { unauthorized, badRequest, sanitizeString } from "@/lib/security"
import { createLead } from "@/lib/leads/create"

export const dynamic = "force-dynamic"

const VALID_STATUSES = ["new", "contacted", "quote_sent", "negotiating", "payment_pending", "booked", "completed", "lost"]

function rangeFilter(range: string): { key: string; value: string } | null {
  const now = new Date()
  switch (range) {
    case "today": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return { key: "gte", value: start.toISOString() }
    }
    case "yesterday": {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return { key: "gte", value: start.toISOString() }
    }
    case "7d":
      return { key: "gte", value: new Date(Date.now() - 7 * 86400000).toISOString() }
    case "month":
      return { key: "gte", value: new Date(now.getFullYear(), now.getMonth(), 1).toISOString() }
    default:
      return null
  }
}

export async function GET(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return unauthorized()

  const params = req.nextUrl.searchParams
  const range = sanitizeString(params.get("range"), 20)
  const q = sanitizeString(params.get("q"), 200).trim()
  const country = sanitizeString(params.get("country"), 100)
  const destination = sanitizeString(params.get("destination"), 100)
  const status = sanitizeString(params.get("status"), 50)
  const source = sanitizeString(params.get("source"), 50)
  const archived = sanitizeString(params.get("archived"), 5) === "1"

  const sb = getSupabaseAdmin()
  let query = sb.from("leads").select("*")

  const r = rangeFilter(range)
  if (r) query = query.gte("created_at", r.value)
  if (country) query = query.eq("country", country)
  if (destination) query = query.ilike("destination", `%${destination}%`)
  if (status && VALID_STATUSES.includes(status)) query = query.eq("status", status)
  if (source) query = query.eq("source", source)
  query = query.eq("archived", archived)
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,message.ilike.%${q}%`)

  const { data, error } = await query.order("created_at", { ascending: false }).limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ leads: data || [] })
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return unauthorized()

  const body = await req.json()
  const s = (v: unknown) => sanitizeString(v, 500)
  const name = s(body.name)
  const email = s(body.email)
  const phone = s(body.phone)
  if (!name && !email && !phone) return badRequest("Name, email or phone required")

  try {
    await createLead(getSupabaseAdmin(), {
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
      source: "contact_form",
      page: "manual",
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Insert failed" }, { status: 500 })
  }
}
