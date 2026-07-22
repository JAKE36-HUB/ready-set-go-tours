import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("deals")
    .select("*")
    .order("title")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { title, slug, description, discount, code, image, type, original_price, deal_price, price_kes, valid_until, highlights, featured, duration, accommodation, meals, included, itinerary } = body

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 })
  }

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("deals")
    .insert({
      title,
      slug,
      description: description || "",
      discount: discount || "",
      code: code || "",
      image: image || "",
      type: type || "special",
      original_price: original_price || 0,
      deal_price: deal_price || 0,
      price_kes: price_kes || null,
      valid_until: valid_until || "",
      highlights: highlights || [],
      featured: featured || false,
      duration: duration || "",
      accommodation: accommodation || "",
      meals: meals || "",
      included: included || [],
      itinerary: itinerary || [],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
