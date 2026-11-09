"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { parseSeasonPricing } from "@/lib/season-pricing"
import { SeasonPriceInline } from "@/components/SeasonPricing"

interface FeaturedPkg {
  name: string
  slug: string
  type: string
  image: string
  price: number
  duration: string
  highlights: string[]
  description: string
  notes?: string | null
}

interface FeaturedResp {
  pkg: FeaturedPkg | null
  freq: "day" | "week" | "month"
  label: string
  bucketId: number
}

const typeLabel: Record<string, string> = {
  safari: "Safari",
  group: "Group Safari",
  luxury: "Luxury",
  mountain: "Trek",
  beach: "Beach",
  cultural: "Cultural",
}

function cachedPick(key: string): FeaturedResp | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return null
    const val = JSON.parse(raw) as { bucketId: number; resp: FeaturedResp }
    if (val.bucketId === val.resp.bucketId) return val.resp
    return null
  } catch {
    return null
  }
}

function savePick(key: string, resp: FeaturedResp) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify({ bucketId: resp.bucketId, resp }))
  } catch {}
}

export function PackageOfTheDay({ frequency = "day" }: { frequency?: "day" | "week" | "month" }) {
  const [resp, setResp] = useState<FeaturedResp | null>(() => cachedPick(`rsgt_fod_${frequency}`))
  const [loaded, setLoaded] = useState(() => Boolean(cachedPick(`rsgt_fod_${frequency}`)))

  useEffect(() => {
    if (loaded) return

    const key = `rsgt_fod_${frequency}`
    const ctrl = new AbortController()

    fetch(`/api/packages/featured?freq=${frequency}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json: FeaturedResp | null) => {
        if (json && json.pkg) {
          savePick(key, json)
          setResp(json)
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))

    return () => ctrl.abort()
  }, [loaded, frequency])

  if (!loaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
        <div className="h-80 rounded-[1.75rem] bg-muted animate-pulse md:h-72" />
      </div>
    )
  }

  if (!resp?.pkg) return null

  const pkg = resp.pkg
  const highlights = (pkg.highlights || []).slice(0, 3)
  const season = parseSeasonPricing({
    notes: pkg.notes,
    description: pkg.description,
    price: pkg.price,
  })
  const fromPrice = season?.fromPrice ?? pkg.price

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-border/60"
      >
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06101C]/90 via-[#06101C]/65 to-[#06101C]/20" />
        <div className="relative z-10 flex min-h-[300px] flex-col justify-center p-6 sm:p-8 lg:p-10 md:min-h-[280px]">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Badge className="gap-1.5 border-transparent bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" />
              {resp.label}
            </Badge>
            <Badge className="border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold capitalize text-white">
              {typeLabel[pkg.type] || pkg.type || "Safari"}
            </Badge>
          </div>

          <h3 className="max-w-3xl font-display text-2xl font-normal leading-tight text-white sm:text-3xl lg:text-4xl">
            {pkg.name}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" />
              {pkg.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-white/60">
                From{season?.hasComparison ? " · low season" : ""}
              </span>
              <span className="text-lg font-semibold text-[#F7CE84]">
                ${fromPrice.toLocaleString()}
              </span>
              <span className="text-white/60">/person</span>
            </span>
            <SeasonPriceInline pricing={season} />
          </div>

          {highlights.length > 0 && (
            <ul className="mt-4 flex max-w-2xl flex-wrap gap-2">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <Link href={`/holiday-packages/${pkg.slug}`}>
              <Button size="lg" className="bg-[#F8D79A] text-[#0B2A4A] hover:bg-[#FFB627]">
                View Package <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}