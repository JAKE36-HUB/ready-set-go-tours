import { requireUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("tour_packages")
    .select("*")
    .order("name")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { name, slug, type, image, price, price_kes, duration, accommodation, meals, transport, activities, description, highlights, included, excluded } = body

  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
  }

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("tour_packages")
    .insert({
      name,
      slug,
      type: type || "safari",
      image: image || "",
      price: price || 0,
      price_kes: price_kes || null,
      duration: duration || "",
      accommodation: accommodation || "",
      meals: meals || "",
      transport: transport || "",
      activities: activities || [],
      description: description || "",
      highlights: highlights || [],
      included: included || [],
      excluded: excluded || [],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
