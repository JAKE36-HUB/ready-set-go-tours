import { NextRequest, NextResponse } from "next/server"
import { rateLimit, tooManyRequests, badRequest, serverError, sanitizeString } from "@/lib/security"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { cleanChatContent, ensureChatLead, upsertChatSession } from "@/lib/chat"
import { identifyVisitor } from "@/lib/leads/create"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`chat-identity:${ip}`, 20, 60_000)) {
      return tooManyRequests()
    }

    const body = await request.json()
    const sessionId = sanitizeString(body.session_id, 100)
    const name = cleanChatContent(body.name)
    const email = cleanChatContent(body.email).toLowerCase()
    const phone = cleanChatContent(body.phone)

    if (!sessionId) return badRequest("session_id required")
    if (!name && !email && !phone) return badRequest("Provide at least a name, email or phone")

    const sb = getSupabaseAdmin()

    await upsertChatSession(sb, {
      session_id: sessionId,
      visitor_name: name,
      visitor_email: email,
      page: cleanChatContent(body.page),
    })

    await ensureChatLead(sb, {
      session_id: sessionId,
      name,
      email,
      page: cleanChatContent(body.page),
      message: [name && `Name: ${name}`, email && `Email: ${email}`, phone && `Phone: ${phone}`].filter(Boolean).join(" · "),
    })

    if (email) {
      await identifyVisitor(sb, sessionId, email)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return serverError()
  }
}