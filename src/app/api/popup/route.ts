import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { rateLimit, tooManyRequests } from "@/lib/security"
import { configFromRecord, type PopupRecord } from "@/lib/popups/types"

export const dynamic = "force-dynamic"

function detectDevice(ua: string | null): string {
  if (!ua) return "desktop"
  if (/android/i.test(ua) && !/mobile/i.test(ua)) return "tablet"
  if (/ipad|tablet/i.test(ua)) return "tablet"
  if (/mobi|iphone|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile"
  return "desktop"
}

function detectLanguage(acceptLang: string | null): string {
  if (!acceptLang) return ""
  return acceptLang.split(",")[0]?.split("-")[0]?.toLowerCase() || ""
}

function hashStr(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`popup:${ip}`, 120, 60_000)) {
      return tooManyRequests()
    }

    const sessionId =
      req.headers.get("x-rsgt-session") ||
      req.nextUrl.searchParams.get("session") ||
      `anon-${ip}`

    const country = req.headers.get("x-vercel-ip-country") || ""
    const device = detectDevice(req.headers.get("user-agent"))
    const language = detectLanguage(req.headers.get("accept-language"))

    const sb = getSupabaseAdmin()
    const { data, error } = await sb
      .from("popups")
      .select("*")
      .limit(100)

    if (error) return NextResponse.json({ popups: [], meta: { country, device, language } })

    const now = new Date()
    const sessionHash = hashStr(sessionId)

    const valid = (data as unknown as PopupRecord[]).filter((p) => {
      const cfg = configFromRecord(p)
      const status = p.status || (p.is_active ? "active" : "draft")
      if (!["active", "scheduled"].includes(status)) return false

      if (p.status === "scheduled" && p.start_date && new Date(p.start_date) > now) return false
      if (p.start_date && new Date(p.start_date) > now) return false
      if (p.end_date && new Date(p.end_date) < now) return false

      const t = cfg.targeting
      if (t.countries.length > 0 && !t.countries.includes(country)) return false
      if (t.devices.length > 0 && !t.devices.includes(device)) return false
      if (t.languages.length > 0 && !t.languages.includes(language)) return false

      return true
    })

    const parents = valid.filter((p) => !p.variant_of)
    const variants = valid.filter((p) => p.variant_of)

    const chosen: PopupRecord[] = [...parents]

    for (const v of variants) {
      const parent = parents.find((p) => p.id === v.variant_of)
      if (!parent) continue
      const split = typeof parent.traffic_split === "number" ? parent.traffic_split : 50
      const showVariant = sessionHash % 100 < split
      if (showVariant) {
        const idx = chosen.findIndex((p) => p.id === parent.id)
        if (idx >= 0) chosen[idx] = v
      }
    }

    const sorted = chosen.sort(
      (a, b) =>
        (typeof b.priority === "number" ? b.priority : 0) -
        (typeof a.priority === "number" ? a.priority : 0)
    )

    const popups = sorted.slice(0, 4).map((p) => {
      const cfg = configFromRecord(p)
      return {
        id: p.id,
        variant: p.variant_of ? "B" : "A",
        type: p.type || cfg.type || "modal",
        priority: p.priority ?? cfg.priority ?? 5,
        name: cfg.name,
        config: cfg,
      }
    })

    return NextResponse.json({
      popups,
      meta: { country, device, language, sessionHash },
    })
  } catch {
    return NextResponse.json({ popups: [], meta: { country: "", device: "desktop", language: "" } })
  }
}
