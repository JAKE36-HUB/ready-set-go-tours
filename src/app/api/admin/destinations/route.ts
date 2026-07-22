import { requireUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("destinations")
    .select("*")
    .order("name")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { name, slug, image, description, rating, best_time, duration, starting_price, highlights, region } = body

  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
  }

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("destinations")
    .insert({
      name, slug,
      image: image || "",
      description: description || "",
      rating: rating || 0,
      best_time: best_time || "",
      duration: duration || "",
      starting_price: starting_price || 0,
      highlights: highlights || [],
      region: region || "kenya",
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
