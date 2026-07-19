"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import {
  Sunrise, Utensils, Compass, Wind, Ship, Users, Mountain, Camera,
  Coffee, TreePine, type LucideIcon
} from "lucide-react"

import { EXPERIENCES } from "@/lib/constants"

const iconMap: Record<string, LucideIcon> = {
  Sunrise,
  Utensils,
  Compass,
  Wind,
  Ship,
  Users,
  Mountain,
  Camera,
  Coffee,
  TreePine,
}

export function Experiences() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
            Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Extraordinary Experiences
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Beyond the ordinary safari—immersive encounters that connect you with the soul of Africa.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {EXPERIENCES.map((exp, idx) => {
            const IconComponent = iconMap[exp.icon]
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={exp.image}
                    alt={exp.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                </div>

                <div className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 -mt-9 relative z-10 shadow-lg">
                    {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{exp.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{exp.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
