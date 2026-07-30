import { NextResponse } from "next/server"
import { rateLimit, badRequest, tooManyRequests, serverError } from "@/lib/security"

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

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`chat:${ip}`, 20, 60_000)) {
      return tooManyRequests()
    }

    const { messages } = await request.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return badRequest("Invalid messages")
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return serverError()
    }

    const sanitizedMessages = messages.slice(-10).map((m: { role?: string; content?: string }) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: typeof m.content === "string" ? m.content.slice(0, 2000) : "",
    }))

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

    if (!response.ok) {
      return serverError()
    }

    const data = await response.json()
    return NextResponse.json({ content: data.choices[0].message.content })
  } catch {
    return serverError()
  }
}
