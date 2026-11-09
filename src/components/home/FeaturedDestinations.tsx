"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Clock, Calendar, ArrowRight, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TiltCard } from "@/components/motion/TiltCard"
import { DESTINATIONS } from "@/lib/constants"

export function FeaturedDestinations() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const allDestinations = [...DESTINATIONS.kenya, ...DESTINATIONS.tanzania].slice(0, 6)

  return (
    <section ref={ref} className="relative overflow-hidden bg-muted/40 py-24 sm:py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <span className="eyebrow">Destinations</span>
            <h2 className="mt-4 font-display text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Kenya & Tanzania, park by park
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            From the Masai Mara to the Serengeti, Amboseli&apos;s elephants to the Ngorongoro Crater — start deciding where your story happens.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {allDestinations.map((dest, idx) => {
            const isKenya = dest.id <= 8
            return (
              <TiltCard
                key={dest.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
                      <MapPin className="h-3 w-3" />
                      {isKenya ? "Kenya" : "Tanzania"}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <h3 className="mb-2 font-display text-xl font-normal text-foreground transition-colors group-hover:text-primary">
                    {dest.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{dest.description}</p>
                  <div className="mb-5 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-accent" />{dest.duration}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-accent" />{dest.bestTime}</span>
                  </div>
                  <Link
                    href={isKenya ? "/kenya-tours" : "/tanzania-tours"}
                    className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-border bg-card text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
                  >
                    Explore Destination <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </TiltCard>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link href="/kenya-tours">
            <Button variant="outline" className="h-12 border-border px-8 text-sm font-semibold transition-all hover:border-primary hover:text-primary">
              Explore All Destinations <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}