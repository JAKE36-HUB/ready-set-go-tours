import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { unauthorized, badRequest, sanitizeString } from "@/lib/security"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const body = await req.json()
  const title = sanitizeString(body.title, 300).trim()
  const dueAt = sanitizeString(body.due_at, 60)
  if (!title) return badRequest("Reminder title required")
  const ts = Date.parse(dueAt)
  if (!dueAt || isNaN(ts)) return badRequest("Valid due date required")

  const sb = getSupabaseAdmin()
  const { error } = await sb.from("reminders").insert({
    lead_id: Number(id),
    title,
    due_at: new Date(ts).toISOString(),
    created_by: user.email || "",
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await sb.from("lead_events").insert({
    lead_id: Number(id),
    event_type: "reminder_set",
    detail: `Reminder: ${title}`,
    created_by: user.email || "",
  })

  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const body = await req.json()
  const sb = getSupabaseAdmin()

  if (body.done !== undefined) {
    const { data: rem } = await sb.from("reminders").select("lead_id").eq("id", Number(id)).single()
    const { error } = await sb.from("reminders").update({ done: Boolean(body.done) }).eq("id", Number(id))
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (body.done && rem?.lead_id) {
      await sb.from("lead_events").insert({
        lead_id: rem.lead_id,
        event_type: "reminder_done",
        detail: "Follow-up reminder completed",
        created_by: user.email || "",
      })
    }
    return NextResponse.json({ ok: true })
  }

  return badRequest("Nothing to update")
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const { error } = await getSupabaseAdmin().from("reminders").delete().eq("id", Number(id))
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
