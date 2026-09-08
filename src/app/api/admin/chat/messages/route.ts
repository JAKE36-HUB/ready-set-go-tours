import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { getSessionTranscript, markSessionRead, getChatSession } from "@/lib/chat"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const sessionId = request.nextUrl.searchParams.get("session_id") || ""
    if (!sessionId) return NextResponse.json({ error: "session_id required" }, { status: 400 })

    const sb = getSupabaseAdmin()
    const [messages, session] = await Promise.all([
      getSessionTranscript(sb, sessionId),
      getChatSession(sb, sessionId),
    ])

    // Viewing the transcript counts as read for the owner
    await markSessionRead(sb, sessionId)

    return NextResponse.json({ messages, session })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Internal error" }, { status: 500 })
  }
}