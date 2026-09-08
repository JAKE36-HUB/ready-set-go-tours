import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { badRequest, sanitizeString } from "@/lib/security"
import { setAiActive } from "@/lib/chat"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const sessionId = sanitizeString(body.session_id, 100)
    const aiActive = body.ai_active === true

    if (!sessionId) return badRequest("session_id required")

    const sb = getSupabaseAdmin()
    await setAiActive(sb, sessionId, aiActive)

    return NextResponse.json({ ok: true, ai_active: aiActive })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Internal error" }, { status: 500 })
  }
}