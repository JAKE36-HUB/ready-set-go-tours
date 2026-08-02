import { requireUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { recordFromConfig, type PopupConfig } from "@/lib/popups/types"

export async function GET(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("popups")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const config = body.config as PopupConfig | undefined

  if (!config?.name && !body.title) {
    return NextResponse.json({ error: "Popup name is required" }, { status: 400 })
  }

  const base = recordFromConfig(config || { name: body.title, content: { title: body.title } } as PopupConfig)

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("popups")
    .insert({
      ...base,
      variant_of: body.variant_of || null,
      traffic_split: typeof body.traffic_split === "number" ? body.traffic_split : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
