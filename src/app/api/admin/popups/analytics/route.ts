import { requireUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { configFromRecord, type PopupRecord } from "@/lib/popups/types"

interface EventRow {
  popup_id: number
  variant: string
  event_type: string
  cta_index: number | null
  cta_label: string
  duration_ms: number
  created_at: string
}

export async function GET(request: NextRequest) {
  const user = await requireUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sb = getSupabaseAdmin()

  const { data: popups, error: pErr } = await sb.from("popups").select("*").order("created_at", { ascending: false })
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })

  const { data: events, error: eErr } = await sb.from("popup_events").select("*").limit(50000)
  if (eErr) return NextResponse.json({ error: eErr.message }, { status: 500 })

  const { data: leads, error: lErr } = await sb.from("popup_leads").select("popup_id, variant, id")
  if (lErr) return NextResponse.json({ error: lErr.message }, { status: 500 })

  const rows = (events || []) as EventRow[]

  const byPopup = new Map<number, Map<string, EventRow[]>>()
  for (const ev of rows) {
    if (!byPopup.has(ev.popup_id)) byPopup.set(ev.popup_id, new Map())
    const variants = byPopup.get(ev.popup_id)!
    if (!variants.has(ev.variant || "A")) variants.set(ev.variant || "A", [])
    variants.get(ev.variant || "A")!.push(ev)
  }

  const leadCounts = new Map<number, { A: number; B: number }>()
  for (const lead of leads || []) {
    const cur = leadCounts.get(lead.popup_id) || { A: 0, B: 0 }
    cur[lead.variant === "B" ? "B" : "A"]++
    leadCounts.set(lead.popup_id, cur)
  }

  interface PopupStat {
    id: number
    name: string
    type: string
    status: string
    variant: string
    priority: number
    variantOf: number | null
    impressions: number
    clicks: number
    whatsappClicks: number
    conversions: number
    dismisses: number
    avgDuration: number
    ctr: number
    dismissRate: number
    revenue: number
  }

  const stats: PopupStat[] = []

  for (const p of (popups || []) as unknown as PopupRecord[]) {
    const cfg = configFromRecord(p)
    const variants = byPopup.get(p.id)
    const keys = variants ? [...variants.keys()] : ["A"]

    for (const v of keys) {
      const evs = variants?.get(v) || []
      const impressions = evs.filter((e) => e.event_type === "impression").length
      const clicks = evs.filter((e) => e.event_type === "click").length
      const whatsappClicks = evs.filter((e) => e.event_type === "whatsapp").length
      const dismisses = evs.filter((e) => e.event_type === "dismiss").length
      const conversions = (leadCounts.get(p.id)?.[v === "B" ? "B" : "A"] || 0) + evs.filter((e) => e.event_type === "conversion").length
      const durRows = evs.filter((e) => e.duration_ms > 0)
      const avgDuration = durRows.length ? Math.round(durRows.reduce((s, e) => s + e.duration_ms, 0) / durRows.length) : 0
      const totalActions = clicks + whatsappClicks

      stats.push({
        id: p.id,
        name: cfg.name || `Popup #${p.id}`,
        type: p.type || cfg.type || "modal",
        status: p.status || cfg.status || "draft",
        variant: p.variant_of ? (v === "B" ? "B" : v) : "A",
        priority: p.priority ?? cfg.priority ?? 5,
        variantOf: p.variant_of || null,
        impressions,
        clicks,
        whatsappClicks,
        conversions,
        dismisses,
        avgDuration,
        ctr: impressions > 0 ? Math.round((totalActions / impressions) * 1000) / 10 : 0,
        dismissRate: impressions > 0 ? Math.round((dismisses / impressions) * 1000) / 10 : 0,
        revenue: Math.round((conversions * (cfg.conversionValue || 0) + Number.EPSILON) * 100) / 100,
      })
    }
  }

  stats.sort((a, b) => b.priority - a.priority)

  const active = stats.filter((s) => s.impressions > 0 && s.status !== "draft")
  const best =
    active.length > 0
      ? active.reduce((a, b) => (b.ctr > a.ctr ? b : a))
      : null
  const worst =
    active.length > 0
      ? active.reduce((a, b) => (b.ctr < a.ctr ? b : a))
      : null

  const abGroups: { id: number; name: string; variants: PopupStat[] }[] = []
  for (const s of stats) {
    if (!s.variantOf) continue
    let group = abGroups.find((g) => g.id === s.variantOf)
    if (!group) {
      const parent = stats.find((x) => x.id === s.variantOf) || { id: s.variantOf, name: `Popup #${s.variantOf}`, variants: [] as PopupStat[] }
      group = { id: parent.id, name: parent.name, variants: [] }
      const parentStat = stats.find((x) => x.id === s.variantOf)
      if (parentStat) group.variants.push(parentStat)
      abGroups.push(group)
    }
    group.variants.push(s)
  }

  const totals = stats.reduce(
    (acc, s) => ({
      impressions: acc.impressions + s.impressions,
      clicks: acc.clicks + s.clicks,
      whatsappClicks: acc.whatsappClicks + s.whatsappClicks,
      conversions: acc.conversions + s.conversions,
      revenue: Math.round((acc.revenue + s.revenue) * 100) / 100,
    }),
    { impressions: 0, clicks: 0, whatsappClicks: 0, conversions: 0, revenue: 0 }
  )

  return NextResponse.json({ popups: stats, abGroups, best, worst, totals })
}
