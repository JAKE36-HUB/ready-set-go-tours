import { NextResponse } from "next/server"
import { rateLimit, badRequest, tooManyRequests, serverError } from "@/lib/security"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import {
  cleanChatContent,
  detectEmail,
  ensureChatLead,
  insertChatMessage,
  notifyOwner,
  setAiActive,
  touchChatSession,
  upsertChatSession,
} from "@/lib/chat"
import { notifyChatEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`chat:${ip}`, 20, 60_000)) {
      return tooManyRequests()
    }

    const body = await request.json()
    const { messages, session_id, visitor_name, visitor_email, page } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return badRequest("Invalid messages")
    }

    const sb = getSupabaseAdmin()

    const sessionId = cleanChatContent(session_id) || "anonym-" + Math.random().toString(36).slice(2, 12)

    const userMessages = messages.filter((m: { role?: string }) => m?.role === "user")
    const lastUserContent = userMessages.length > 0 ? cleanChatContent(userMessages[userMessages.length - 1]?.content) : ""
    if (!lastUserContent) return badRequest("Empty message")

    // Identity: prefer explicit fields; fall back to an email mentioned in the message
    const detectedEmail = detectEmail(lastUserContent)
    const visitorEmail = cleanChatContent(visitor_email).toLowerCase() || detectedEmail
    const visitorName = cleanChatContent(visitor_name) || (visitorEmail ? visitorEmail.split("@")[0] : "")

    await upsertChatSession(sb, { session_id: sessionId, visitor_name: visitorName, visitor_email: visitorEmail, page })

    const userMsg = await insertChatMessage(sb, sessionId, "user", lastUserContent)
    const firstNewId = Number(userMsg?.id) || 0
    await touchChatSession(sb, sessionId)
    await notifyOwner(sb, sessionId, visitorName, lastUserContent)
    await notifyChatEmail({ name: visitorName, email: visitorEmail, message: lastUserContent, page: cleanChatContent(page) })
    await ensureChatLead(sb, { session_id: sessionId, name: visitorName, email: visitorEmail, page: cleanChatContent(page), message: lastUserContent })

    // AI auto-replies are disabled — staff responds manually.
    await setAiActive(sb, sessionId, false)

    return NextResponse.json({ content: null, takenOver: true, first_new_id: firstNewId })
  } catch {
    return serverError()
  }
}