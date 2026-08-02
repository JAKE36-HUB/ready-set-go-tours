import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { unauthorized } from "@/lib/security"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return unauthorized()

  const scope = req.nextUrl.searchParams.get("scope") || "upcoming"
  const sb = getSupabaseAdmin()
  let query = sb.from("reminders").select("*").eq("done", false).order("due_at", { ascending: true })

  if (scope === "overdue") {
    query = query.lt("due_at", new Date().toISOString())
  } else if (scope === "today") {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    query = query.lte("due_at", end.toISOString())
  } else if (scope === "upcoming") {
    const end = new Date(Date.now() + 7 * 86400000)
    end.setHours(23, 59, 59, 999)
    query = query.lte("due_at", end.toISOString())
  }

  const { data, error } = await query.limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const reminders = data || []
  const leadIds = [...new Set(reminders.map((r) => r.lead_id).filter(Boolean))] as number[]
  let leadNames: Record<number, string> = {}
  if (leadIds.length > 0) {
    const { data: leads } = await sb.from("leads").select("id,name").in("id", leadIds)
    if (leads) leadNames = Object.fromEntries(leads.map((l) => [l.id as number, l.name as string]))
  }

  return NextResponse.json({
    reminders: reminders.map((r) => ({
      ...r,
      lead_name: r.lead_id ? leadNames[r.lead_id as number] || "" : "",
    })),
  })
}
