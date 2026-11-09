/**
 * Season pricing extraction.
 *
 * Tour packages store their high/low season rates in the free-text `notes`
 * field (see the package admin form), in a line such as:
 *
 *   Rates & seasons
 *   High/peak season (1 June - 15 October 2026): $6,400 per person sharing, $7,900 solo traveller.
 *   Low/shoulder season (16 October - 19 December 2026): $4,890 per person sharing, $6,300 solo traveller.
 *
 * Rather than forcing a schema migration, the public pages read that text back
 * into a structured shape and render a proper comparison. The parser is
 * tolerant: it accepts "peak"/"shoulder" wording, optional solo rates, and
 * multiple date ranges separated by "&".
 *
 * This module is intentionally dependency-free so it can run on the server and
 * in client components (package cards, package of the day, filters).
 */

export type SeasonKind = "high" | "low" | "other"

export interface SeasonRate {
  kind: SeasonKind
  /** Display name, e.g. "High season". */
  label: string
  /** Human-friendly date range, e.g. "1 Jun – 15 Oct 2026". */
  dates: string
  /** Rate per person sharing, in USD. */
  price: number
  /** Optional solo traveller rate, in USD. */
  soloPrice: number | null
}

export interface SeasonPricing {
  seasons: SeasonRate[]
  /** Cheapest per-person rate across all seasons. */
  fromPrice: number
  /** The season that supplies `fromPrice`. */
  fromSeason: SeasonRate
  high: SeasonRate | null
  low: SeasonRate | null
  /** Absolute saving per person when choosing low over high season. */
  savings: number | null
  /** Saving as a whole percentage of the high-season rate. */
  savingsPercent: number | null
  /** True when both a high and a low season were found. */
  hasComparison: boolean
}

export interface SeasonSource {
  notes?: string | null
  description?: string | null
  price?: number | null
}

const MONTHS: Record<string, string> = {
  january: "Jan",
  february: "Feb",
  march: "Mar",
  april: "Apr",
  may: "May",
  june: "Jun",
  july: "Jul",
  august: "Aug",
  september: "Sep",
  october: "Oct",
  november: "Nov",
  december: "Dec",
}

const monthPattern = new RegExp(`\\b(${Object.keys(MONTHS).join("|")})\\b`, "gi")

const formatDates = (raw: string) =>
  raw
    .replace(/\s+-\s+/g, " – ")
    .replace(monthPattern, (month) => MONTHS[month.toLowerCase()] ?? month)
    .replace(/\s+/g, " ")
    .trim()

const toAmount = (value: string) => Number(value.replace(/[^\d]/g, ""))

const SEASON_BLOCK =
  /(high(?:\s*\/\s*peak)?|peak|low(?:\s*\/\s*shoulder)?|shoulder)\s*season\s*\(([^)]{3,140})\)\s*:\s*([^\n]*?)(?=\s*(?:high|peak|low|shoulder)[^()]{0,30}\(|\n|$)/gi

function parseSeasonRates(text: string): SeasonRate[] {
  const found = new Map<string, SeasonRate>()

  for (const match of text.matchAll(SEASON_BLOCK)) {
    const rawName = match[1].toLowerCase()
    const kind: SeasonKind = /high|peak/.test(rawName)
      ? "high"
      : /low|shoulder/.test(rawName)
        ? "low"
        : "other"

    const detail = match[3]
    const sharing = detail.match(
      /\$\s*([\d,]+)\s*(?:per\s+person\s+sharing|pp\s+sharing|per\s+person|sharing)/i
    )
    const solo = detail.match(/\$\s*([\d,]+)\s*(?:solo|single)/i)
    const anyPrice = detail.match(/\$\s*([\d,]+)/)

    const priceSource = sharing?.[1] ?? anyPrice?.[1]
    if (!priceSource) continue

    const price = toAmount(priceSource)
    if (!Number.isFinite(price) || price <= 0) continue

    const dates = formatDates(match[2])
    const key = `${kind}|${dates}|${price}`
    if (found.has(key)) continue

    found.set(key, {
      kind,
      label:
        kind === "high"
          ? "High season"
          : kind === "low"
            ? "Low season"
            : "Season",
      dates,
      price,
      soloPrice: solo ? toAmount(solo[1]) : null,
    })
  }

  const order: Record<SeasonKind, number> = { high: 0, low: 1, other: 2 }
  return [...found.values()].sort(
    (a, b) => order[a.kind] - order[b.kind] || a.price - b.price
  )
}

export function parseSeasonPricing(
  source: SeasonSource
): SeasonPricing | null {
  const text = [source.notes, source.description]
    .filter((value): value is string => Boolean(value && value.trim()))
    .join("\n\n")

  if (!text) return null

  const seasons = parseSeasonRates(text)
  if (seasons.length === 0) return null

  const high = seasons.find((season) => season.kind === "high") ?? null
  const low = seasons.find((season) => season.kind === "low") ?? null
  const fromSeason = seasons.reduce((cheapest, season) =>
    season.price < cheapest.price ? season : cheapest
  )

  const hasComparison = Boolean(high && low && high.price !== low.price)
  const savings =
    hasComparison && high && low ? high.price - low.price : null
  const savingsPercent =
    savings && high ? Math.round((savings / high.price) * 100) : null

  return {
    seasons,
    fromPrice: fromSeason.price,
    fromSeason,
    high,
    low,
    savings,
    savingsPercent,
    hasComparison,
  }
}

/**
 * Removes the raw rate passage from display copy so the structured season
 * panel is the only place the prices appear.
 */
export function stripSeasonRates(text: string | null | undefined): string {
  if (!text) return ""

  return text
    .replace(/\bRates?\s+are\s+per\s+person\s+in\s+USD\.?/gi, " ")
    .replace(SEASON_BLOCK, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\.\s*\./g, ".")
    .replace(/\s+([.,;:])/g, "$1")
    .trim()
}

