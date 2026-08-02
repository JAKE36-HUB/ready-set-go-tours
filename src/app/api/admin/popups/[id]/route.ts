import { requireUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { sanitizeObject } from "@/lib/security"
import { recordFromConfig, type PopupConfig } from "@/lib/popups/types"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("popups")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const config = body.config as PopupConfig | undefined
  const sanitized = sanitizeObject(body, [
    "title", "content", "image", "link_url", "link_text", "position", "delay_seconds",
    "start_date", "end_date", "is_active", "show_once",
    "config", "type", "priority", "status", "template", "category", "notes",
    "variant_of", "traffic_split",
  ])

  let payload: Record<string, unknown> = { ...sanitized, updated_at: new Date().toISOString() }
  if (config && typeof config === "object") {
    payload = {
      ...payload,
      ...recordFromConfig(config),
      variant_of: body.variant_of || null,
      traffic_split: typeof body.traffic_split === "number" ? body.traffic_split : null,
    }
  }

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("popups")
    .update(payload)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ data })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const sb = getSupabaseAdmin()
  const { error } = await sb
    .from("popups")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
