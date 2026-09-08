import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { badRequest, rateLimit, sanitizeString, tooManyRequests } from "@/lib/security"
import { cleanChatContent, insertChatMessage, setAiActive, touchChatSession } from "@/lib/chat"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!rateLimit(`admin-chat-reply:${user.id}`, 30, 60_000)) {
    return tooManyRequests()
  }

  try {
    const body = await request.json()
    const sessionId = sanitizeString(body.session_id, 100)
    const content = cleanChatContent(body.content)

    if (!sessionId || !content) return badRequest("session_id and content are required")

    const sb = getSupabaseAdmin()

    // Replying is a takeover — AI yields to the human
    await setAiActive(sb, sessionId, false)
    const message = await insertChatMessage(sb, sessionId, "owner", content)
    await touchChatSession(sb, sessionId)

    if (!message) return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    return NextResponse.json({ message }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Internal error" }, { status: 500 })
  }
}