"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Shield, Car, Users, HeadphonesIcon, Package, MapPin, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { WHY_CHOOSE_US, PLAN_SAFARI_ROUTE } from "@/lib/constants"

const whyIconMap: Record<string, LucideIcon> = { Shield, Car, Users, HeadphonesIcon, Package, MapPin }

export function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="why-readysetgo" className="relative py-24 sm:py-28 bg-background dark:bg-stone-950 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-amber-400">Why Ready Set Go</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground mt-4 mb-4 leading-tight">
            Why plan your safari with Ready Set Go?
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            We keep it simple: you share what you want to experience, and we design the trip around you.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {WHY_CHOOSE_US.map((item, idx) => {
            const IconComponent = whyIconMap[item.icon] || Shield
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative bg-card rounded-3xl p-7 border border-border hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20 group-hover:scale-110 group-hover:shadow-amber-500/30 transition-all duration-300">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href={PLAN_SAFARI_ROUTE}>
            <Button className="h-12 px-8 text-base font-semibold gradient-primary text-white border-0 shadow-premium hover:shadow-premium hover:scale-105 transition-all duration-300">
              Plan My Safari
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}