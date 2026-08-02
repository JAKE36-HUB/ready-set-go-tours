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
  const detail = sanitizeString(body.detail, 2000).trim()
  if (!detail) return badRequest("Note required")

  const { error } = await getSupabaseAdmin().from("lead_events").insert({
    lead_id: Number(id),
    event_type: "note",
    detail,
    created_by: user.email || "",
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
