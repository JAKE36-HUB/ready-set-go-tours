"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FeaturedPkg {
  name: string
  slug: string
  type: string
  image: string
  price: number
  duration: string
  highlights: string[]
  description: string
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
        <div className="h-80 md:h-72 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
      </div>
    )
  }

  if (!resp?.pkg) return null

  const pkg = resp.pkg
  const highlights = (pkg.highlights || []).slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col min-h-[300px] md:min-h-[280px] justify-center">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge className="gap-1.5 bg-amber-400 text-stone-900 border-transparent text-xs font-semibold px-3 py-1.5">
              <Sparkles className="size-3.5" />
              {resp.label}
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 text-xs font-semibold px-3 py-1.5 capitalize">
              {typeLabel[pkg.type] || pkg.type || "Safari"}
            </Badge>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-tight max-w-3xl">
            {pkg.name}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" />
              {pkg.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-white/60">From</span>
              <span className="text-lg font-semibold text-amber-300">
                ${pkg.price.toLocaleString()}
              </span>
              <span className="text-white/60">/person</span>
            </span>
          </div>

          {highlights.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2 max-w-2xl">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="text-xs text-white/85 bg-white/10 border border-white/15 rounded-full px-3 py-1"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <Link href={`/holiday-packages/${pkg.slug}`}>
              <Button size="lg">
                View Package <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}