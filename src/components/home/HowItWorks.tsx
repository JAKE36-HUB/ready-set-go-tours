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
    <section className="relative overflow-hidden bg-background py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="eyebrow">
            How it works
          </span>
          <h2 className="mb-4 mt-4 font-display text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-5xl">
            From dream to departure
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            Five simple steps between &ldquo;what if&rdquo; and boarding your safari.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              {idx < steps.length - 1 && (
                <div className="absolute left-[calc(50%+2.5rem)] top-7 hidden h-px w-[calc(100%-5rem)] bg-gradient-to-r from-border to-transparent lg:block" />
              )}
              <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-card">
                <step.Icon className="h-6 w-6 text-primary" />
              </div>
              <span className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">
                Step {step.number}
              </span>
              <h3 className="mb-2 font-display text-lg font-normal text-foreground">
                {step.title}
              </h3>
              <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <Link href={PLAN_SAFARI_ROUTE}>
            <Button className="h-14 bg-primary px-10 text-base font-semibold text-primary-foreground hover:bg-primary/90">
              Start Planning Your Safari <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">No commitment required. Get a custom quote from our team.</p>
        </motion.div>
      </div>
    </section>
  )
}