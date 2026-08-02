import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { unauthorized, badRequest, sanitizeString } from "@/lib/security"

export const dynamic = "force-dynamic"

const VALID_STATUSES = ["new", "contacted", "quote_sent", "negotiating", "payment_pending", "booked", "completed", "lost"]

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const sb = getSupabaseAdmin()
  const [lead, events, reminders] = await Promise.all([
    sb.from("leads").select("*").eq("id", Number(id)).single(),
    sb.from("lead_events").select("*").eq("lead_id", Number(id)).order("created_at", { ascending: false }).limit(200),
    sb.from("reminders").select("*").eq("lead_id", Number(id)).eq("done", false).order("due_at", { ascending: true }),
  ])

  if (lead.error || !lead.data) return NextResponse.json({ error: "Lead not found" }, { status: 404 })
  return NextResponse.json({ lead: lead.data, events: events.data || [], reminders: reminders.data || [] })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const body = await req.json()
  const patch: Record<string, unknown> = {}
  const s = (v: unknown, max = 500) => sanitizeString(v, max)

  const changed: string[] = []

  if ("status" in body) {
    if (!VALID_STATUSES.includes(s(body.status))) return badRequest("Invalid status")
    if (body.status !== undefined) {
      patch.status = s(body.status)
      changed.push(`Status → ${s(body.status).replaceAll("_", " ")}`)
    }
  }
  if ("assigned_to" in body) patch.assigned_to = s(body.assigned_to, 200)
  if ("archived" in body) patch.archived = Boolean(body.archived)
  if ("name" in body) patch.name = s(body.name, 200)
  if ("phone" in body) patch.phone = s(body.phone, 100)
  if ("email" in body) patch.email = s(body.email, 200)
  if ("country" in body) patch.country = s(body.country, 100)
  if ("destination" in body) patch.destination = s(body.destination, 200)
  if ("travel_date" in body) patch.travel_date = s(body.travel_date, 100)
  if ("budget" in body) patch.budget = s(body.budget, 100)
  if ("adults" in body) patch.adults = s(body.adults, 50)
  if ("children" in body) patch.children = s(body.children, 50)

  if (Object.keys(patch).length === 0) return badRequest("Nothing to update")

  const sb = getSupabaseAdmin()
  const { data: before } = await sb.from("leads").select("status,archived").eq("id", Number(id)).single()

  const { error } = await sb.from("leads").update(patch).eq("id", Number(id))
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (changed.length > 0) {
    await sb.from("lead_events").insert({
      lead_id: Number(id),
      event_type: "status_change",
      detail: changed.join(", "),
      created_by: user.email || "",
    })
  }
  if ("assigned_to" in body && body.assigned_to && before?.archived === false) {
    await sb.from("lead_events").insert({
      lead_id: Number(id),
      event_type: "note",
      detail: `Assigned to ${s(body.assigned_to, 200)}`,
      created_by: user.email || "",
    })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const { error } = await getSupabaseAdmin().from("leads").delete().eq("id", Number(id))
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
