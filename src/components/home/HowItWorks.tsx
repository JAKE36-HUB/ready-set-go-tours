"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, MessageCircle, ClipboardCheck, FileCheck, Plane, Heart, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BOOKING_STEPS, PLAN_SAFARI_ROUTE } from "@/lib/constants"

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
    <section className="relative py-24 sm:py-28 bg-muted/70 dark:bg-stone-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-burgundy-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-burgundy-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-burgundy-400">
            How it works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground mt-4 mb-4 leading-tight">
            From dream to departure
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Five simple steps between &ldquo;what if&rdquo; and boarding your safari.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gradient-to-r from-burgundy-300/60 to-burgundy-300/20" />
              )}
              <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl bg-card shadow-lg shadow-burgundy-500/10 ring-1 ring-border mb-5">
                <step.Icon className="w-6 h-6 text-primary dark:text-burgundy-400" />
              </div>
              <span className="text-xs font-bold text-primary dark:text-burgundy-400 uppercase tracking-widest mb-1">
                Step {step.number}
              </span>
              <h3 className="font-display text-lg font-medium text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-16"
        >
          <Link href={PLAN_SAFARI_ROUTE}>
            <Button className="h-14 px-10 text-base font-semibold gradient-primary text-white shadow-xl shadow-burgundy-900/20 hover:scale-105 transition-all duration-300">
              Start Planning Your Safari <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3">No commitment required. Get a custom quote from our team.</p>
        </motion.div>
      </div>
    </section>
  )
}