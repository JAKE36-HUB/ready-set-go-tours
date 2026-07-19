"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  MessageCircle, ClipboardCheck, FileCheck, Plane, Heart,
  type LucideIcon
} from "lucide-react"

import { BOOKING_STEPS } from "@/lib/constants"

const iconMap: Record<string, LucideIcon> = {
  MessageCircle: MessageCircle,
  ClipboardCheck: ClipboardCheck,
  FileCheck: FileCheck,
  Plane: Plane,
  Heart: Heart,
}

export function BookingProcess() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Your Journey Starts Here
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From your first inquiry to returning home with unforgettable memories, we make booking seamless.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400" />

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-6">
            {BOOKING_STEPS.map((step, idx) => {
              const IconComponent = iconMap[step.icon]
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                      {IconComponent && <IconComponent className="w-7 h-7 text-white" />}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-slate-950 border-2 border-amber-400 flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {idx + 1}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
