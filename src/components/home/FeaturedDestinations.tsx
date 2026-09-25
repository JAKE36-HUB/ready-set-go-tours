"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Clock, Calendar, ArrowRight, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DESTINATIONS } from "@/lib/constants"

export function FeaturedDestinations() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const allDestinations = [...DESTINATIONS.kenya, ...DESTINATIONS.tanzania].slice(0, 6)

  return (
    <section ref={ref} className="relative py-24 sm:py-28 bg-background dark:bg-stone-950 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-burgundy-300/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-burgundy-400">Destinations</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground mt-4 leading-tight">
              Kenya & Tanzania, park by park
            </h2>
          </div>
          <p className="text-base text-muted-foreground max-w-md leading-relaxed">
            From the Masai Mara to the Serengeti, Amboseli&apos;s elephants to the Ngorongoro Crater — start deciding where your story happens.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {allDestinations.map((dest, idx) => {
            const isKenya = dest.id <= 8
            return (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-3xl bg-card border border-border hover:shadow-2xl hover:shadow-stone-950/10 dark:hover:shadow-black/30 transition-all duration-500"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-stone-800 shadow-sm">
                      <MapPin className="w-3 h-3" />
                      {isKenya ? "Kenya" : "Tanzania"}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <h3 className="font-display text-xl font-medium text-foreground mb-2 group-hover:text-primary dark:group-hover:text-burgundy-400 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{dest.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary dark:text-burgundy-400" />{dest.duration}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary dark:text-burgundy-400" />{dest.bestTime}</span>
                  </div>
                  <Link
                    href={isKenya ? "/kenya-tours" : "/tanzania-tours"}
                    className="inline-flex items-center justify-center gap-1.5 w-full h-11 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 text-foreground text-sm font-medium transition-all duration-300"
                  >
                    Explore Destination <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/kenya-tours">
            <Button variant="outline" className="h-12 px-8 text-sm font-semibold border-border hover:border-primary hover:text-primary dark:hover:text-burgundy-400 transition-all">
              Explore All Destinations <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}