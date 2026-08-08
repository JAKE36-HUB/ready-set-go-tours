import { NextRequest, NextResponse } from "next/server"
import { badRequest } from "@/lib/security"

export const dynamic = "force-dynamic"

export async function DELETE(req: NextRequest) {
  let body: { userId?: string; factorId?: string }
  try {
    body = await req.json()
  } catch {
    return badRequest()
  }

  const userId = (body.userId || "").trim()
  const factorId = (body.factorId || "").trim()
  if (!userId || !factorId) return badRequest("userId and factorId are required")

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
  }

  const res = await fetch(`${url}/auth/v1/admin/users/${userId}/factors/${factorId}`, {
    method: "DELETE",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: `Could not remove the factor (${res.status})` },
      { status: res.status }
    )
  }

  return NextResponse.json({ ok: true })
}
