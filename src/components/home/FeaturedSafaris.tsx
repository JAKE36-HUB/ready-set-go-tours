"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Clock, Bed, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    <section ref={ref} className="relative py-24 sm:py-28 bg-background dark:bg-stone-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-burgundy-400">Find Your Safari</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground mt-4 mb-4 leading-tight">
            Safaris worth planning a trip around
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Private and group journeys across Kenya and Tanzania — each one fully customisable.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative bg-card rounded-3xl overflow-hidden border border-border hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 backdrop-blur text-stone-900 text-xs font-semibold px-3 py-1 hover:bg-white/90 border-0">
                    {typeLabel[pkg.type] || "Safari"}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 rounded-xl bg-stone-950/70 backdrop-blur px-3 py-2 text-white ring-1 ring-white/15">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 block">From</span>
                  <span className="text-lg font-semibold leading-none">${pkg.price.toLocaleString()}<span className="text-xs font-normal text-white/60"> /pp</span></span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-medium text-foreground mb-3 leading-snug">
                  {pkg.name}
                </h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary dark:text-burgundy-400 shrink-0" />{pkg.duration}</span>
                  <span className="flex items-center gap-1.5 truncate"><Bed className="w-3.5 h-3.5 text-primary dark:text-burgundy-400 shrink-0" />{pkg.accommodation}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/holiday-packages/${pkg.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 text-foreground text-sm font-medium transition-all duration-300"
                  >
                    View Safari <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href={PLAN_SAFARI_ROUTE}
                    className="flex-1 inline-flex items-center justify-center h-11 rounded-xl gradient-primary text-white text-sm font-semibold shadow-premium hover:shadow-premium transition-all duration-300"
                  >
                    Plan This Safari
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/holiday-packages">
            <Button variant="outline" className="h-12 px-8 text-sm font-semibold border-border hover:border-primary hover:text-primary dark:hover:text-burgundy-400 transition-all">
              Explore All Safaris <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}