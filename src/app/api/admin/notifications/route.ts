import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { unauthorized } from "@/lib/security"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return unauthorized()

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("notifications")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ notifications: data || [] })
}

export async function POST(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return unauthorized()

  const { error } = await getSupabaseAdmin()
    .from("notifications")
    .update({ read: true })
    .eq("read", false)
    .eq("archived", false)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
