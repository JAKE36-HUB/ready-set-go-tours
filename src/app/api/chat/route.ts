import { NextResponse } from "next/server"

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
    const { messages } = await request.json()
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      )
    }

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
          ...messages.slice(-10),
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `OpenRouter API error: ${error}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ content: data.choices[0].message.content })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
