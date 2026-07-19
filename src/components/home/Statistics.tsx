"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import {
  Users, MapPin, Star, Award, Car, Globe, Hotel, Heart,
  type LucideIcon
} from "lucide-react"

import { STATISTICS } from "@/lib/constants"

const iconMap: Record<string, LucideIcon> = {
  Users, MapPin, Star, Award, Car, Globe, Hotel, Heart,
}

function AnimatedCounter({ value, isInView }: { value: string; isInView: boolean }) {
  const [count, setCount] = useState(0)
  const num = parseInt(value.replace(/[^0-9]/g, ""))
  const suffix = value.replace(/[0-9,+]/g, "")
  const isPercent = value.includes("%")
  const isThousands = value.includes("+")
  const isK = value.toLowerCase().includes("k")

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = isPercent ? num : isK ? 12 : num
    const duration = 2000
    const stepTime = Math.max(Math.floor(duration / end), 16)
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, stepTime)
    return () => clearInterval(timer)
  }, [isInView, num, isPercent, isK])

  if (isPercent) {
    const displayCount = Math.min(count, num)
    return <>{displayCount}{suffix}</>
  }

  if (isThousands) {
    const formatted = count >= 1000 ? count.toLocaleString() : count
    return <>{formatted}{suffix}</>
  }

  return <>{count > 0 ? count : 0}{suffix}</>
}

export function Statistics() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://i.pinimg.com/736x/5e/d9/e7/5ed9e7896df91ef4ad2acdc3d37b0b21.jpg"
          alt="African landscape"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            By the Numbers
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Our track record speaks for itself. Here&apos;s what we&apos;ve achieved in over 15 years of delivering exceptional travel experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
          {STATISTICS.map((stat, idx) => {
            const IconComponent = iconMap[stat.icon]
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="text-center group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all duration-300">
                  {IconComponent && <IconComponent className="w-7 h-7 text-amber-400" />}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 tabular-nums">
                  <AnimatedCounter value={stat.value} isInView={isInView} />
                </div>
                <div className="text-sm text-white/60 font-medium">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
