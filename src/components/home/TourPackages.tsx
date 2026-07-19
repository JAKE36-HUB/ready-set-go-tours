"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Clock, Bed, Utensils, Car, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TOUR_PACKAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const FILTERS = ["All", "Luxury", "Safari", "Beach", "Group"]

const badgeColors: Record<string, string> = {
  luxury: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0",
  safari: "bg-emerald-500 text-white border-0",
  beach: "bg-sky-500 text-white border-0",
  mountain: "bg-slate-700 text-white border-0",
  group: "bg-rose-500 text-white border-0",
}

export function TourPackages() {
  const [activeFilter, setActiveFilter] = useState("All")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const filtered =
    activeFilter === "All"
      ? TOUR_PACKAGES
      : TOUR_PACKAGES.filter((p) => p.type.toLowerCase() === activeFilter.toLowerCase())

  return (
    <section className="relative py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Tour Packages
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Curated Safari Packages
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Hand-picked tours designed for every travel style, from luxury escapes to budget-friendly adventures.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeFilter === filter
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {filtered.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge className={cn("text-xs font-semibold px-3 py-1", badgeColors[pkg.type] || "bg-slate-700 text-white")}>
                    {pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white">
                    <span className="text-2xl font-bold">${pkg.price.toLocaleString()}</span>
                    <span className="text-sm text-white/70 ml-1">/person</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {pkg.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Bed className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="line-clamp-1">{pkg.accommodation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Utensils className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="line-clamp-1">{pkg.meals}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Car className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="line-clamp-1">{pkg.transport}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mb-5">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Activities</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                    {pkg.activities.slice(0, 4).map((activity) => (
                      <span key={activity} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        {activity}
                      </span>
                    ))}
                    {pkg.activities.length > 4 && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 ml-5">
                        +{pkg.activities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <Link href={`/holiday-packages`}>
                  <Button className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    Book Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
