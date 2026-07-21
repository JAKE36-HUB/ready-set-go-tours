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
    <section ref={ref} className="relative py-10 sm:py-14 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {topStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-amber-500 tabular-nums">
                <Counter value={stat.value} isInView={isInView} />
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/60"
        >
          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-1.5">
            {TRUST_ITEMS.slice(0, 5).map((item, idx) => {
              const IconComponent = iconMap[item.icon]
              return (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
                  {IconComponent && <IconComponent className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
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
