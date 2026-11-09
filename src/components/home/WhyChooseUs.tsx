"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Shield, Car, Users, HeadphonesIcon, Package, MapPin, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TiltCard } from "@/components/motion/TiltCard"
import { AnimatedCounter } from "@/components/motion/AnimatedCounter"
import { WHY_CHOOSE_US, PLAN_SAFARI_ROUTE, TOUR_PACKAGES, DESTINATIONS } from "@/lib/constants"

const whyIconMap: Record<string, LucideIcon> = { Shield, Car, Users, HeadphonesIcon, Package, MapPin }

export function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const totalDestinations = DESTINATIONS.kenya.length + DESTINATIONS.tanzania.length
  const stats = [
    { value: TOUR_PACKAGES.length, suffix: "+", label: "Safari itineraries" },
    { value: totalDestinations, suffix: "", label: "Parks & destinations" },
    { value: 24, suffix: "h", label: "Average reply time" },
    { value: 2, suffix: "", label: "Countries covered" },
  ]

  return (
    <section id="why-readysetgo" className="relative scroll-mt-24 bg-muted/50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="eyebrow">Why Ready Set Go</span>
          <h2 className="mb-4 mt-4 font-display text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Why plan your safari with Ready Set Go?
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            We keep it simple: you share what you want to experience, and we design the trip around you.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {WHY_CHOOSE_US.map((item, idx) => {
            const IconComponent = whyIconMap[item.icon] || Shield
            return (
              <TiltCard
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-[1.75rem] border border-border bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${
                    idx % 2 === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-display text-lg font-normal text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </TiltCard>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-border bg-border lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card px-6 py-8 text-center">
              <div className="font-display text-4xl font-normal text-foreground sm:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href={PLAN_SAFARI_ROUTE}>
            <Button className="h-12 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90">
              Plan My Safari
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}