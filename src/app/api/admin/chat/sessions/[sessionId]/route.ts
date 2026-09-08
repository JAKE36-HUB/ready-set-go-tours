import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { renameChatSession, deleteChatSession } from "@/lib/chat"

export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { sessionId } = await params
  if (!sessionId) return NextResponse.json({ error: "Missing session_id" }, { status: 400 })

  let body: { label?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  if (!body.label || typeof body.label !== "string") {
    return NextResponse.json({ error: "label is required" }, { status: 400 })
  }

  try {
    const sb = getSupabaseAdmin()
    const session = await renameChatSession(sb, sessionId, body.label)
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 })
    return NextResponse.json({ session })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Internal error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { sessionId } = await params
  if (!sessionId) return NextResponse.json({ error: "Missing session_id" }, { status: 400 })

  try {
    const sb = getSupabaseAdmin()
    await deleteChatSession(sb, sessionId)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Internal error" }, { status: 500 })
  }
}