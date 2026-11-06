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
    <section ref={ref} className="relative overflow-hidden bg-[#0C1511] py-24 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-accent/12 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/25 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E4C9A3]">Honeymoons</span>
          <h2 className="mb-4 mt-4 font-display text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl">
            Your honeymoon should be more than a holiday.
          </h2>
          <p className="text-base leading-relaxed text-white/65">
            Safari by day. Romance by night. Candlelit bush dinners, sunrise game drives and a beach to melt into — we&apos;ll handle every detail.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={PLAN_SAFARI_ROUTE} className="group">
              <Button className="h-13 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90">
                <Heart className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Design Our Honeymoon
              </Button>
            </Link>
            <Link href="/honeymoon-packages" className="group">
              <Button
                variant="outline"
                className="h-13 rounded-full border-white/20 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                Explore All Honeymoons
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {honeymoons.map((hp, idx) => (
            <motion.div
              key={hp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={`/honeymoon-packages/${hp.slug}`} className="group relative block h-80 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 transition-all duration-500 hover:ring-accent/50">
                <Image
                  src={hp.image}
                  alt={hp.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08130E]/95 via-[#08130E]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="mb-2 flex items-center gap-3 text-xs text-white/70">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#E4C9A3]" />{hp.duration}</span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-accent" />
                      From ${hp.price.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-normal leading-snug text-white">
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