"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, Award, HeadphonesIcon, Package, Star, Heart, Hotel, Users, type LucideIcon } from "lucide-react"

import { STATISTICS, TRUST_ITEMS } from "@/lib/constants"

function Counter({ value, isInView }: { value: string; isInView: boolean }) {
  const [count, setCount] = useState(0)
  const num = parseInt(value.replace(/[^0-9]/g, ""))
  const suffix = value.replace(/[0-9,+]/g, "")
  const isK = value.toLowerCase().includes("k")
  useEffect(() => {
    if (!isInView) return
    let s = 0
    const end = isK ? 12 : num
    const step = Math.max(Math.floor(2000 / end), 16)
    const t = setInterval(() => { s += 1; setCount(s); if (s >= end) clearInterval(t) }, step)
    return () => clearInterval(t)
  }, [isInView, num, isK])
  return <>{isK ? count : count.toLocaleString()}{suffix}</>
}

const iconMap: Record<string, LucideIcon> = { Shield, Award, HeadphonesIcon, Package, Star, Heart, Hotel, Users }

export function TrustStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const topStats = STATISTICS.slice(0, 4)

  return (
    <section ref={ref} className="relative border-b border-border bg-background py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {topStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="text-center"
            >
              <div className="whitespace-nowrap font-display text-2xl font-normal tabular-nums text-primary sm:text-3xl">
                <Counter value={stat.value} isInView={isInView} />
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-5 border-t border-border pt-5"
        >
          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-1.5">
            {TRUST_ITEMS.slice(0, 5).map((item, idx) => {
              const IconComponent = iconMap[item.icon]
              return (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
                  {IconComponent && <IconComponent className="h-3.5 w-3.5 shrink-0 text-accent" />}
                  <span>{item.label}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
