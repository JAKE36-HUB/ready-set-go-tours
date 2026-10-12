import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { rateLimit, tooManyRequests } from "@/lib/security"

export const dynamic = "force-dynamic"

const FREQUENCIES = {
  day: 86_400_000,
  week: 7 * 86_400_000,
  month: 30 * 86_400_000,
} as const

export type FeaturedFrequency = keyof typeof FREQUENCIES

export function bucketFor(freq: FeaturedFrequency, at: number): number {
  return Math.floor(at / FREQUENCIES[freq])
}

export function pickFeatured<T>(items: T[], freq: FeaturedFrequency, at = Date.now(), key: (t: T) => string): T | null {
  if (items.length === 0) return null
  const sorted = [...items].sort((a, b) => key(a).localeCompare(key(b)))
  const idx = bucketFor(freq, at) % sorted.length
  return sorted[idx]
}

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`featured:${ip}`, 240, 60_000)) {
      return tooManyRequests()
    }

    const freqParam = (req.nextUrl.searchParams.get("freq") || "day") as FeaturedFrequency
    const freq: FeaturedFrequency = FREQUENCIES[freqParam] ? freqParam : "day"

    const { data, error } = await getSupabaseAdmin()
      .from("tour_packages")
      .select("name, slug, type, image, price, duration, highlights, description")

    if (error) {
      return NextResponse.json({ pkg: null, freq, label: "Package of the Day", bucketId: 0 })
    }

    const pkg = pickFeatured(data, freq, Date.now(), (p: { slug: string }) => p.slug)

    const label =
      freq === "month" ? "Package of the Month" : freq === "week" ? "Package of the Week" : "Package of the Day"

    return NextResponse.json({
      pkg,
      freq,
      label,
      bucketId: bucketFor(freq, Date.now()),
      total: data.length,
    })
  } catch {
    return NextResponse.json({ pkg: null, freq: "day", label: "Package of the Day", bucketId: 0 })
  }
}