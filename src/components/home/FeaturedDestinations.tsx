"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Star, Clock, MapPin, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DESTINATIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "kenya", label: "Kenya" },
  { id: "tanzania", label: "Tanzania" },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"
          )}
        />
      ))}
      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{rating}</span>
    </div>
  )
}

export function FeaturedDestinations() {
  const [activeTab, setActiveTab] = useState<"kenya" | "tanzania">("kenya")
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const currentDestinations = DESTINATIONS[activeTab]

  return (
    <section className="relative py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Explore Africa
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Featured Destinations
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover the most breathtaking destinations East Africa has to offer, from iconic savannahs to pristine coastlines.
          </p>
        </motion.div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "kenya" | "tanzania")}
                className={cn(
                  "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid sm:grid-cols-2 gap-6 lg:gap-8"
        >
          {currentDestinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/20 transition-all duration-500"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white">
                    <MapPin className="w-3 h-3" />
                    {activeTab === "kenya" ? "Kenya" : "Tanzania"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {dest.name}
                  </h3>
                  <div className="shrink-0">
                    <StarRating rating={dest.rating} />
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {dest.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {dest.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    Best: {dest.bestTime}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">From</span>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      ${dest.startingPrice.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400">/person</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={activeTab === "kenya" ? `/kenya-tours` : `/tanzania-tours`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/holiday-packages`}>
                      <Button size="sm" className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
