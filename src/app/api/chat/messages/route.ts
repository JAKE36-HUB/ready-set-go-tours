import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit, tooManyRequests, serverError } from "@/lib/security"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { getChatSession, getSessionTranscript } from "@/lib/chat"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id") || ""
    if (!sessionId) return NextResponse.json({ messages: [], takenOver: false })

    if (!rateLimit(`chat-sync:${sessionId}`, 60, 60_000)) {
      return tooManyRequests()
    }

    const afterId = Number(request.nextUrl.searchParams.get("after_id") || 0) || 0
    const sb = getSupabaseAdmin()

    const [messages, session] = await Promise.all([
      getSessionTranscript(sb, sessionId, afterId),
      getChatSession(sb, sessionId),
    ])

    return NextResponse.json({ messages, takenOver: session?.ai_active === false })
  } catch {
    return serverError()
  }
}