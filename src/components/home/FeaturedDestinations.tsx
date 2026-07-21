"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Star, Clock, MapPin, Calendar, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DESTINATIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function FeaturedDestinations() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const allDestinations = [...DESTINATIONS.kenya, ...DESTINATIONS.tanzania]

  return (
    <section className="relative py-28 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6"
        >
          <div>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">
              Destinations
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
              Where to Go
            </h2>
          </div>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
            From Kenya&apos;s Masai Mara to Tanzania&apos;s Serengeti — explore East Africa&apos;s finest destinations.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-2 lg:mt-0 lg:mb-1">
            <span className="flex -space-x-1.5">
              {[1,2,3,4].map((i) => (
                <span key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 ring-2 ring-white dark:ring-slate-950" />
              ))}
            </span>
            <span><span className="font-semibold text-amber-500">2,400+</span> happy travelers</span>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {allDestinations.map((dest, idx) => {
            const isKenya = dest.id <= 8
            return (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-black/30 transition-all duration-700"
              >
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-md rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-800 border border-white/20 shadow-sm">
                      <MapPin className="w-3 h-3" />
                      {isKenya ? "Kenya" : "Tanzania"}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("w-3.5 h-3.5", i < Math.round(dest.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700")} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{dest.rating}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{dest.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{dest.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" />{dest.duration}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-500" />{dest.bestTime}</span>
                    </div>
                  <Link
                    href={isKenya ? "/kenya-tours" : "/tanzania-tours"}
                    className="inline-flex items-center justify-center gap-1.5 w-full h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all duration-300 border border-slate-200 dark:border-slate-700"
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
          className="text-center mt-10"
        >
          <Link href="/kenya-tours">
            <Button variant="outline" className="h-12 px-8 text-sm font-semibold border-slate-300 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500 transition-all">
              Explore All Destinations <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
