import { NextRequest, NextResponse } from "next/server"

import { rateLimit, tooManyRequests, serverError } from "@/lib/security"
import {
  SEARCH_CATEGORIES,
  type SearchCategory,
  type SearchCategoryFilter,
  type SearchItem,
} from "@/lib/search-shared"
import { searchSite } from "@/lib/site-search"
import { getSupabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const CACHE_TTL = 5 * 60_000

let indexCache: { items: SearchItem[]; expiresAt: number } | null = null

const asText = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string")
  }
  return typeof value === "string" ? [value] : []
}

const asString = (value: unknown): string =>
  typeof value === "string" ? value : ""

/**
 * Add admin-created packages and deals to the static index so new inventory is
 * searchable without a redeploy. Cached for five minutes and fully optional —
 * if Supabase is unavailable the static content still answers every query.
 */
async function getDynamicSearchItems(): Promise<SearchItem[]> {
  if (indexCache && indexCache.expiresAt > Date.now()) {
    return indexCache.items
  }

  const items: SearchItem[] = []

  try {
    const supabase = getSupabase()
    const [packages, honeymoons, deals] = await Promise.all([
      supabase
        .from("tour_packages")
        .select("name, slug, type, description, duration, accommodation, highlights, activities"),
      supabase
        .from("honeymoon_packages")
        .select("name, slug, description, duration, accommodation, highlights, activities"),
      supabase
        .from("deals")
        .select("title, slug, description, discount, duration, highlights"),
    ])

    for (const row of (packages.data ?? []) as Record<string, unknown>[]) {
      const name = asString(row.name)
      const slug = asString(row.slug)
      if (!name || !slug) continue
      items.push({
        id: `db-tour:${slug}`,
        title: name,
        href: `/holiday-packages/${slug}`,
        category: "Safaris",
        description: [asString(row.duration), asString(row.accommodation)]
          .filter(Boolean)
          .join(" · "),
        keywords: [
          asString(row.type),
          asString(row.description),
          ...asText(row.activities),
          ...asText(row.highlights),
        ].filter(Boolean),
        weight: 57,
      })
    }

    for (const row of (honeymoons.data ?? []) as Record<string, unknown>[]) {
      const name = asString(row.name)
      const slug = asString(row.slug)
      if (!name || !slug) continue
      items.push({
        id: `db-honeymoon:${slug}`,
        title: name,
        href: `/honeymoon-packages/${slug}`,
        category: "Honeymoons",
        description: [asString(row.duration), asString(row.accommodation)]
          .filter(Boolean)
          .join(" · "),
        keywords: [
          "honeymoon",
          "romantic",
          asString(row.description),
          ...asText(row.activities),
          ...asText(row.highlights),
        ].filter(Boolean),
        weight: 55,
      })
    }

    for (const row of (deals.data ?? []) as Record<string, unknown>[]) {
      const title = asString(row.title)
      const slug = asString(row.slug)
      if (!title || !slug) continue
      items.push({
        id: `db-deal:${slug}`,
        title,
        href: `/deals/${slug}`,
        category: "Safaris",
        description: [asString(row.discount), asString(row.duration)]
          .filter(Boolean)
          .join(" · "),
        keywords: [
          "deal",
          "offer",
          "discount",
          asString(row.description),
          ...asText(row.highlights),
        ].filter(Boolean),
        weight: 49,
      })
    }
  } catch {
    // The static index is enough when Supabase is not configured.
  }

  indexCache = { items, expiresAt: Date.now() + CACHE_TTL }
  return items
}

function normalizeCategory(value: string | null): SearchCategoryFilter {
  if (value && (SEARCH_CATEGORIES as readonly string[]).includes(value)) {
    return value as SearchCategory
  }
  return "All"
}

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (!rateLimit(`search:${ip}`, 240, 60_000)) {
      return tooManyRequests()
    }

    const params = req.nextUrl.searchParams
    const query = (params.get("q") ?? "").slice(0, 120)
    const category = normalizeCategory(params.get("category"))

    if (!query.trim()) {
      return NextResponse.json({ results: [], total: 0, query, category })
    }

    const extraItems = await getDynamicSearchItems()
    const { results, total } = searchSite(query, category, extraItems, 24)

    return NextResponse.json(
      { results, total, query, category },
      { headers: { "Cache-Control": "private, max-age=30" } }
    )
  } catch {
    return serverError()
  }
}
