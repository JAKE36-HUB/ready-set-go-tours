"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Heart, Clock, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HONEYMOON_PACKAGES, PLAN_SAFARI_ROUTE } from "@/lib/constants"

export function HoneymoonSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const honeymoons = HONEYMOON_PACKAGES.slice(0, 3)

  return (
    <section ref={ref} className="relative py-24 sm:py-28 overflow-hidden bg-stone-950 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl text-center mx-auto mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">Honeymoons</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium mt-4 mb-4 leading-tight">
            Your honeymoon should be more than a holiday.
          </h2>
          <p className="text-base text-white/70 leading-relaxed">
            Safari by day. Romance by night. Candlelit bush dinners, sunrise game drives and a beach to melt into — we&apos;ll handle every detail.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href={PLAN_SAFARI_ROUTE}>
              <Button className="h-13 px-8 text-base font-semibold bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-rose-900/30 hover:scale-105 transition-all duration-300">
                <Heart className="w-4 h-4 mr-2" />
                Design Our Honeymoon
              </Button>
            </Link>
            <Link href="/honeymoon-packages">
              <Button variant="outline" className="h-13 px-8 text-base font-medium border-white/20 text-white/90 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all">
                Explore All Honeymoons <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {honeymoons.map((hp, idx) => (
            <motion.div
              key={hp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={`/honeymoon-packages/${hp.slug}`} className="group block relative rounded-3xl overflow-hidden h-80 ring-1 ring-white/10 hover:ring-rose-400/40 transition-all duration-500">
                <Image
                  src={hp.image}
                  alt={hp.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center gap-3 text-xs text-white/70 mb-2">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-rose-300" />{hp.duration}</span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      From ${hp.price.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-medium text-white leading-snug">
                    {hp.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}