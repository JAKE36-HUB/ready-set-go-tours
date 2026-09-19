import { NextResponse } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { getUnreadCount } from "@/lib/chat"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const sb = getSupabaseAdmin()
    const total = await getUnreadCount(sb)
    return NextResponse.json({ total })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}