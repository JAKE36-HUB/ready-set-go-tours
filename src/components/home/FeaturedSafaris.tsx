"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Clock, Bed, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TiltCard } from "@/components/motion/TiltCard"
import { TOUR_PACKAGES, PLAN_SAFARI_ROUTE } from "@/lib/constants"

const FEATURED_SLUGS = [
  "maasai-mara-3-days-group",
  "kenya-tanzania-combo",
  "tanzania-northern-circuit",
  "masai-mara-luxury-safari-4-days",
  "ultimate-kenya-safari",
  "amboseli-tsavo-gateway",
]

const typeLabel: Record<string, string> = {
  safari: "Safari",
  group: "Group Safari",
  luxury: "Luxury",
  mountain: "Trek",
  beach: "Beach",
  cultural: "Cultural",
}

export function FeaturedSafaris() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const packages = FEATURED_SLUGS
    .map((slug) => TOUR_PACKAGES.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="eyebrow">Find your safari</span>
          <h2 className="mb-4 mt-4 font-display text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Safaris worth planning a trip around
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            Private and group journeys across Kenya and Tanzania — each one fully customisable.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {packages.map((pkg, idx) => (
            <TiltCard
              key={pkg.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="border-0 bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur hover:bg-background/90">
                    {typeLabel[pkg.type] || "Safari"}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 rounded-2xl bg-[#06101C]/70 px-3 py-2 text-white ring-1 ring-white/15 backdrop-blur">
                  <span className="block text-[10px] uppercase tracking-wider text-white/60">From</span>
                  <span className="text-lg font-semibold leading-none">${pkg.price.toLocaleString()}<span className="text-xs font-normal text-white/60"> /pp</span></span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-3 font-display text-xl font-normal leading-snug text-foreground">
                  {pkg.name}
                </h3>
                <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 shrink-0 text-accent" />{pkg.duration}</span>
                  <span className="flex min-w-0 items-center gap-1.5"><Bed className="h-3.5 w-3.5 shrink-0 text-accent" /><span className="truncate">{pkg.accommodation}</span></span>
                </div>
                <div className="mt-auto flex items-center gap-3">
                  <Link
                    href={`/holiday-packages/${pkg.slug}`}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
                  >
                    View Safari <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href={PLAN_SAFARI_ROUTE}
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
                  >
                    Plan This Safari
                  </Link>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/holiday-packages">
            <Button variant="outline" className="h-12 border-border px-8 text-sm font-semibold transition-all hover:border-primary hover:text-primary">
              Explore All Safaris <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}