"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, MessageCircle, ClipboardCheck, FileCheck, Plane, Heart, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BOOKING_STEPS } from "@/lib/constants"

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const iconMap: Record<string, LucideIcon> = {
    MessageCircle, ClipboardCheck, FileCheck, Plane, Heart,
  }

  const steps = BOOKING_STEPS.map((step, i) => ({
    ...step,
    number: i + 1,
    Icon: iconMap[step.icon] || Heart,
  }))

  return (
    <section className="relative py-28 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
            How It{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-4">
            From your first inquiry to returning home with unforgettable memories — we make it seamless.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute top-12 left-[28px] lg:left-1/2 lg:-translate-x-1/2 w-0.5 h-[calc(100%-6rem)] bg-gradient-to-b from-emerald-200 via-teal-200 to-emerald-200 dark:from-emerald-800 dark:via-teal-800 dark:to-emerald-800 hidden lg:block" />

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-100 dark:ring-emerald-900/50 mb-5">
                  <step.Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">
                  Step {step.number}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-16"
        >
          <Link href="/contact">
            <Button className="h-14 px-10 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300">
              Start Planning — Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">No commitment required. Get a custom quote in 24 hours.</p>
        </motion.div>
      </div>
    </section>
  )
}
