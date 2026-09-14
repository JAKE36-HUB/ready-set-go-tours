import { NextRequest, NextResponse } from "next/server"
import { badRequest } from "@/lib/security"

export const dynamic = "force-dynamic"

export async function DELETE(req: NextRequest) {
  let body: { userId?: string; factorId?: string; all?: boolean }
  try {
    body = await req.json()
  } catch {
    return badRequest()
  }

  const userId = (body.userId || "").trim()
  const factorId = (body.factorId || "").trim()
  const all = body.all === true
  if (!userId || (!all && !factorId)) return badRequest("userId and factorId are required")

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
  }

  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  }

  if (all) {
    const listRes = await fetch(`${url}/auth/v1/admin/users/${userId}/factors`, { headers })
    if (!listRes.ok) {
      return NextResponse.json(
        { error: `Could not list factors (${listRes.status})` },
        { status: listRes.status }
      )
    }
    const payload = await listRes.json().catch(() => ({}))
    const factors = Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.factors)
        ? payload.factors
        : []
    for (const factor of factors) {
      if (!factor?.id) continue
      const delRes = await fetch(`${url}/auth/v1/admin/users/${userId}/factors/${factor.id}`, {
        method: "DELETE",
        headers,
      })
      if (!delRes.ok) {
        return NextResponse.json(
          { error: `Could not remove the factor (${delRes.status})` },
          { status: delRes.status }
        )
      }
    }
    return NextResponse.json({ ok: true })
  }

  const res = await fetch(`${url}/auth/v1/admin/users/${userId}/factors/${factorId}`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: `Could not remove the factor (${res.status})` },
      { status: res.status }
    )
  }

  return NextResponse.json({ ok: true })
}
