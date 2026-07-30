import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sb = getSupabaseAdmin()
    const { data } = await sb
      .from("popups")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (!data || data.length === 0) {
      return NextResponse.json({ popup: null })
    }

    const now = new Date()
    const valid = data.filter((p: any) => {
      if (p.start_date && new Date(p.start_date) > now) return false
      if (p.end_date && new Date(p.end_date) < now) return false
      return true
    })

    return NextResponse.json({ popup: valid[0] || null })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
