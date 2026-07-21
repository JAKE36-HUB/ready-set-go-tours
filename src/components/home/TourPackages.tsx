"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Clock, Bed, Check, ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { TOUR_PACKAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const badgeColors: Record<string, string> = {
  luxury: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0",
  safari: "bg-emerald-500 text-white border-0",
  group: "bg-gradient-to-r from-sky-500 to-teal-500 text-white border-0",
  beach: "bg-sky-500 text-white border-0",
  cultural: "bg-violet-500 text-white border-0",
  mountain: "bg-slate-700 text-white border-0",
}

export function TourPackages({ onReserve }: { onReserve?: (name: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const safariPackages = TOUR_PACKAGES.filter((p) => p.type === "safari" || p.type === "group")

  return (
    <section className="relative py-28 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">
            Tours
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Safari & Group Packages
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Hand-crafted private safaris and daily joining group tours — see Africa your way.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {safariPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image src={pkg.image} alt={pkg.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 left-3">
                    <Badge className={cn("text-xs font-semibold px-3 py-1", badgeColors[pkg.type] || "bg-slate-700 text-white")}>
                      {pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Non-resident</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">${pkg.price.toLocaleString()}</span>
                      <span className="text-sm text-slate-500">/ person</span>
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Resident</div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">KES {(pkg.priceKES ?? pkg.price * 130).toLocaleString()}</div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {pkg.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />{pkg.duration}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Bed className="w-3.5 h-3.5 text-amber-500 shrink-0" /><span className="truncate">{pkg.accommodation}</span></div>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mb-5">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                      {pkg.activities.slice(0, 4).map((a) => (
                        <span key={a} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />{a}
                        </span>
                      ))}
                      {pkg.activities.length > 4 && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 ml-5">+{pkg.activities.length - 4} more</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/holiday-packages/${pkg.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all duration-300"
                    >
                      View Details <ArrowRight className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onReserve?.(pkg.name)}
                      className="flex-1 inline-flex items-center justify-center h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
      </div>
    </section>
  )
}
