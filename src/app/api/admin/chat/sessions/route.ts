import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { listChatSessions } from "@/lib/chat"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const sb = getSupabaseAdmin()
    const sessions = await listChatSessions(sb)

    const ids = sessions.map((s) => s.session_id)
    const recent: Record<string, { role: string; content: string; created_at: string }> = {}
    const unread: Record<string, number> = {}

    if (ids.length > 0) {
      const { data, error } = await sb
        .from("chat_messages")
        .select("id, session_id, role, content, read_at, created_at")
        .in("session_id", ids)
        .order("id", { ascending: false })
        .limit(500)
      if (error) throw new Error(error.message)

      for (const m of data as { session_id: string; role: string; content: string; read_at: string | null; created_at: string }[]) {
        if (!recent[m.session_id]) {
          recent[m.session_id] = { role: m.role, content: m.content, created_at: m.created_at }
        }
        if (m.role === "user" && !m.read_at) {
          unread[m.session_id] = (unread[m.session_id] || 0) + 1
        }
      }
    }

    const list = sessions.map((s) => ({
      session_id: s.session_id,
      visitor_name: s.visitor_name,
      visitor_email: s.visitor_email,
      page: s.page,
      ai_active: s.ai_active,
      last_message_at: s.last_message_at,
      created_at: s.created_at,
      last_preview: recent[s.session_id] || null,
      unread: unread[s.session_id] || 0,
      total_unread: Object.values(unread).reduce((a, b) => a + b, 0),
    }))

    return NextResponse.json({ sessions: list })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Internal error" }, { status: 500 })
  }
}