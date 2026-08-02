import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { unauthorized } from "@/lib/security"

export const dynamic = "force-dynamic"

const esc = (v: string | null | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`

export async function GET(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) return unauthorized()

  const sb = getSupabaseAdmin()
  const { data, error } = await sb
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const headers = [
    "ID", "Name", "Phone", "Email", "Country", "Destination", "Travel Date", "Budget",
    "Adults", "Children", "Message", "Source", "Page", "Status", "Assigned To",
    "UTM Source", "UTM Medium", "UTM Campaign", "Browser", "Device", "IP", "IP Country",
    "Created At", "Updated At", "Archived",
  ]

  const rows = (data || []).map((l: any) => [
    l.id, l.name, l.phone, l.email, l.country, l.destination, l.travel_date, l.budget,
    l.adults, l.children, l.message, l.source, l.page, l.status, l.assigned_to,
    l.utm_source, l.utm_medium, l.utm_campaign, l.browser, l.device, l.ip, l.ip_country,
    l.created_at, l.updated_at, l.archived ? "Yes" : "No",
  ])

  const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map(esc).join(",")).join("\r\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
