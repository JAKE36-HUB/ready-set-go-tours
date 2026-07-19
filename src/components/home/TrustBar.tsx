"use client"

import { motion } from "framer-motion"
import {
  Shield, Award, HeadphonesIcon, Package, Star, Heart, Hotel, Users,
  type LucideIcon
} from "lucide-react"

import { TRUST_ITEMS } from "@/lib/constants"

const iconMap: Record<string, LucideIcon> = {
  Shield, Award, HeadphonesIcon, Package, Star, Heart, Hotel, Users,
}

export function TrustBar() {
  return (
    <section className="relative py-6 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-amber-950/20 border-y border-amber-100 dark:border-amber-900/30 overflow-hidden">
      <div className="flex overflow-hidden select-none">
        <motion.div
          className="flex shrink-0 gap-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...Array(2)].map((_, loopIdx) =>
            TRUST_ITEMS.map((item, idx) => {
              const IconComponent = iconMap[item.icon]
              return (
                <div
                  key={`${loopIdx}-${idx}`}
                  className="flex items-center gap-3 shrink-0"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                    {IconComponent && (
                      <IconComponent className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              )
            })
          )}
        </motion.div>
      </div>
    </section>
  )
}
