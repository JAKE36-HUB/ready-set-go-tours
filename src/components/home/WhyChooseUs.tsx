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
              <motion.div
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
              </motion.div>
            )
          })}
        </div>

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