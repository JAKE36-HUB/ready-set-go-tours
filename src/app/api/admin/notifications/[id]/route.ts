import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { unauthorized, badRequest } from "@/lib/security"

export const dynamic = "force-dynamic"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const body = await req.json()
  const patch: Record<string, unknown> = {}
  if ("read" in body) patch.read = Boolean(body.read)
  if ("archived" in body) patch.archived = Boolean(body.archived)
  if (Object.keys(patch).length === 0) return badRequest("Nothing to update")

  const { error } = await getSupabaseAdmin().from("notifications").update(patch).eq("id", Number(id))
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(req)
  if (!user) return unauthorized()
  const { id } = await params

  const { error } = await getSupabaseAdmin().from("notifications").delete().eq("id", Number(id))
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
