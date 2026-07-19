"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Shield, Award, Users, Heart, Package, HeadphonesIcon, Car, MapPin,
  type LucideIcon
} from "lucide-react"

import { WHY_CHOOSE_US } from "@/lib/constants"

const iconMap: Record<string, LucideIcon> = {
  Shield, Award, Users, Heart, Package, HeadphonesIcon, Car, MapPin,
}

export function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
            Why Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Why Ready Set Go
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We don&apos;t just plan trips—we craft transformative travel experiences that leave lasting impressions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_US.map((item, idx) => {
            const IconComponent = iconMap[item.icon]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative bg-slate-50 dark:bg-slate-900 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-800 hover:-translate-y-1 transition-all duration-400"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/30 group-hover:scale-110 transition-all duration-300">
                  {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
