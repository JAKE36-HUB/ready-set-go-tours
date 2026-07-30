import { requireUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const sortField = searchParams.get("sortField") || "entered_at"
  const sortDir = searchParams.get("sortDir") || "desc"
  const limit = parseInt(searchParams.get("limit") || "200")

  const sb = getSupabaseAdmin()

  const { data: all, error } = await sb
    .from("visitors")
    .select("*")
    .order(sortField, { ascending: sortDir === "asc" })
    .limit(Math.min(limit, 500))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayRecords = (all || []).filter((v: any) => new Date(v.entered_at) >= today)
  const todaySessions = new Set(todayRecords.map((v: any) => v.session_id))
  const totalDuration = (all || []).reduce((sum: number, v: any) => sum + (v.duration_seconds || 0), 0)
  const totalSessions = new Set((all || []).map((v: any) => v.session_id))

  const pageCounts: Record<string, number> = {}
  for (const v of all || []) {
    pageCounts[v.page] = (pageCounts[v.page] || 0) + 1
  }
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }))

  return NextResponse.json({
    visitors: all || [],
    stats: {
      todayVisitors: todaySessions.size,
      todayViews: todayRecords.length,
      avgDuration: totalSessions.size > 0 ? Math.round(totalDuration / totalSessions.size) : 0,
      totalVisitors: totalSessions.size,
      topPages,
    },
  })
}
