import { NextResponse } from "next/server"
import { rateLimit, badRequest, tooManyRequests, serverError } from "@/lib/security"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import {
  cleanChatContent,
  getChatSession,
  insertChatMessage,
  notifyOwner,
  setAiActive,
  touchChatSession,
  upsertChatSession,
} from "@/lib/chat"

const SYSTEM_PROMPT = `You are a helpful travel assistant for Ready Set Go Tours & Travel, a premier luxury tour operator based in Nairobi, Kenya. You specialize in bespoke safaris and travel experiences across Kenya and Tanzania.

COMPANY INFO:
- Name: Ready Set Go Tours & Travel
- Phone: +254 797 867 411
- Email: readysetgotoursandtravel43@gmail.com
- Location: Nairobi, Kenya
- Hours: Mon-Sat 8:00 AM - 6:00 PM (EAT)

SERVICES OFFERED:
- Safari tour packages (group and private)
- Honeymoon packages
- Beach holidays (Diani, Zanzibar)
- Mountain trekking (Kilimanjaro, Mount Kenya)
- Hotel bookings at 200+ properties
- Air ticketing (international, domestic, bush flights)
- Massage & wellness services
- Custom itinerary planning

DESTINATIONS:
- Kenya: Masai Mara, Amboseli, Samburu, Lake Nakuru, Tsavo, Laikipia, Nairobi, Mount Kenya
- Tanzania: Serengeti, Ngorongoro Crater, Kilimanjaro, Tarangire, Lake Manyara, Selous, Zanzibar

TRAVEL STYLES: Group safaris, Luxury safaris, Private guided tours, Beach holidays, Honeymoons, Family safaris, Photography safaris, Cultural experiences, Mountain trekking

Keep responses friendly, informative, and concise. If asked about pricing, mention rates start from $650 per person for group safaris and vary based on package. For bookings or custom quotes, encourage contacting via phone or email. Do not make up specific pricing — direct users to contact the team for current rates and availability.`

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
    await upsertChatSession(sb, { session_id: sessionId, visitor_name, visitor_email, page })

    const userMessages = messages.filter((m: { role?: string }) => m?.role === "user")
    const lastUserContent = userMessages.length > 0 ? cleanChatContent(userMessages[userMessages.length - 1]?.content) : ""
    if (!lastUserContent) return badRequest("Empty message")

    const userMsg = await insertChatMessage(sb, sessionId, "user", lastUserContent)
    const firstNewId = Number(userMsg?.id) || 0
    await touchChatSession(sb, sessionId)
    await notifyOwner(sb, sessionId, String(visitor_name || ""), lastUserContent)

    const session = await getChatSession(sb, sessionId)
    const aiActive = session?.ai_active !== false

    if (!aiActive) {
      return NextResponse.json({ content: null, takenOver: true, first_new_id: firstNewId })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      await setAiActive(sb, sessionId, false)
      return NextResponse.json({ content: null, takenOver: true, first_new_id: firstNewId })
    }

    const sanitizedMessages = messages.slice(-10).map((m: { role?: string; content?: string }) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: cleanChatContent(m.content),
    }))

    let reply: string | null = null
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://readysetgosafaris.com",
          "X-Title": "Ready Set Go Tours & Travel",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...sanitizedMessages,
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        reply = data?.choices?.[0]?.message?.content ?? null
      }
    } catch {
      reply = null
    }

    if (!reply) {
      await setAiActive(sb, sessionId, false)
      return NextResponse.json({ content: null, takenOver: true, first_new_id: firstNewId })
    }

    const assistantMsg = await insertChatMessage(sb, sessionId, "assistant", reply)
    await touchChatSession(sb, sessionId)

    return NextResponse.json({ content: reply, first_new_id: firstNewId, last_id: Number(assistantMsg?.id) || 0 })
  } catch {
    return serverError()
  }
}