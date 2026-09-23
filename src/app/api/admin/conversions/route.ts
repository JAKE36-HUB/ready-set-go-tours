import { requireUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "200")

  const sb = getSupabaseAdmin()

  const { data: all, error } = await sb
    .from("conversions")
    .select("id, session_id, type, label, details, page, country, city, created_at")
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 500))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const now = new Date()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  interface ConversionRow {
    type: string
    created_at: string
    page: string
  }

  const rows = (all || []) as ConversionRow[]
  const todayCount = rows.filter((c) => new Date(c.created_at) >= today).length
  const weekCount = rows.filter((c) => new Date(c.created_at) >= weekAgo).length

  const typeCounts: Record<string, number> = {}
  for (const c of rows) {
    typeCounts[c.type] = (typeCounts[c.type] || 0) + 1
  }
  const byType = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count }))

  const pageCounts: Record<string, number> = {}
  for (const c of rows) {
    pageCounts[c.page] = (pageCounts[c.page] || 0) + 1
  }
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }))

  return NextResponse.json({
    conversions: all || [],
    stats: {
      todayCount,
      weekCount,
      total: rows.length,
      byType,
      topPages,
    },
  })
}