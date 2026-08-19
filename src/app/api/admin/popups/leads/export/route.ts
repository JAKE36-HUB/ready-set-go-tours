import { requireUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const popupId = searchParams.get("popup_id")

  let query = getSupabaseAdmin().from("popup_leads").select("*").order("created_at", { ascending: false }).limit(5000)
  if (popupId) query = query.eq("popup_id", Number(popupId))

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = data || []
  const headers = ["ID", "Date", "Popup", "Variant", "Name", "Phone", "Email", "Country", "Destination", "Travel Date", "Budget", "Adults", "Children", "Message", "Source", "UTM Campaign", "Page"]

  const esc = (v: unknown) => {
    const s = String(v ?? "").replace(/"/g, '""')
    return `"${s}"`
  }

  const lines = [
    headers.join(","),
    ...rows.map((r: Record<string, unknown>) =>
      [
        r.id,
        new Date(r.created_at as string).toISOString(),
        r.popup_name,
        r.variant,
        r.name,
        r.phone,
        r.email,
        r.country,
        r.destination,
        r.travel_date,
        r.budget,
        r.adults,
        r.children,
        r.message,
        r.source,
        r.utm_campaign,
        r.page,
      ]
        .map(esc)
        .join(",")
    ),
  ]

  const csv = "\uFEFF" + lines.join("\r\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="popup-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
