import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { unauthorized } from "@/lib/security"
import { parseBudget } from "@/lib/leads/types"

export const dynamic = "force-dynamic"

function dayStart(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
}

function monthStart(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}

export async function GET(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return unauthorized()

  const sb = getSupabaseAdmin()
  const todayStart = dayStart()
  const mStart = monthStart()

  const [newToday, unread, bookedToday, monthLeads, waEvents, events, reminders] = await Promise.all([
    sb.from("leads").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    sb.from("leads").select("id", { count: "exact", head: true }).eq("status", "new").eq("archived", false),
    sb
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "booked")
      .gte("updated_at", todayStart),
    sb.from("leads").select("budget,status").gte("created_at", mStart).limit(1000),
    sb
      .from("popup_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "whatsapp")
      .gte("created_at", todayStart),
    sb
      .from("lead_events")
      .select("lead_id,created_at")
      .eq("event_type", "status_change")
      .order("created_at", { ascending: true })
      .limit(5000),
    sb
      .from("reminders")
      .select("id", { count: "exact", head: true })
      .eq("done", false)
      .lt("due_at", new Date(Date.now() + 24 * 3600000).toISOString()),
  ])

  const monthRows = monthLeads.data || []
  const totalMonth = monthRows.length
  const closed = monthRows.filter((l) => l.status === "booked" || l.status === "completed").length
  const revenue = monthRows
    .filter((l) => ["booked", "completed", "payment_pending"].includes(l.status))
    .reduce((sum, l) => sum + parseBudget(String(l.budget || "")), 0)

  let responseMs = 0
  let responseCount = 0
  const seen = new Set<number>()
  if (events.data) {
    for (const ev of events.data) {
      if (seen.has(ev.lead_id)) continue
      const { data: lead } = await sb.from("leads").select("created_at").eq("id", ev.lead_id).single()
      if (lead) {
        responseMs += new Date(ev.created_at).getTime() - new Date(lead.created_at).getTime()
        responseCount++
      }
      seen.add(ev.lead_id)
    }
  }
  const avgResponseHours = responseCount > 0 ? Math.round(responseMs / responseCount / 3600000) : 0

  return NextResponse.json({
    new_today: newToday.count || 0,
    unread: unread.count || 0,
    bookings_today: bookedToday.count || 0,
    revenue,
    whatsapp_clicks: waEvents.count || 0,
    conversion_rate: totalMonth > 0 ? Math.round((closed / totalMonth) * 100) : 0,
    avg_response_time: avgResponseHours,
    overdue_reminders: reminders.count || 0,
  })
}
