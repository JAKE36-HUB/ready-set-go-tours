"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { COMPANY, PLAN_SAFARI_ROUTE } from "@/lib/constants"

const HERO_IMAGES = [
  "/images/local/pin_212b2433f246414a170ec177d76168f2.jpg",
  "/images/local/pin_1156825aa06be3206b2a1454ada4af1b.jpg",
  "/images/local/pin_9866ec45a7a8400d3fdc9e0642ff1e99.jpg",
]

const SLIDE_DURATION = 7000

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || paused) return
    const timer = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
    }, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [mounted, paused, currentImage])

  useEffect(() => {
    if (!mounted || paused) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0)
    const start = Date.now()
    const interval = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / SLIDE_DURATION) * 100)
      setProgress(pct)
      if (pct >= 100) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [mounted, paused, currentImage])

  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi! I'd like to plan a safari with Ready Set Go Safaris.")}`

  return (
    <section
      className="relative h-screen min-h-[640px] flex items-center overflow-hidden bg-stone-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === currentImage ? 1 : 0 }}
          >
            <Image
              src={img}
              alt={`African safari landscape ${i + 1}`}
              fill
              sizes="100vw"
              className="object-cover scale-110 brightness-[0.9] contrast-[1.05]"
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {HERO_IMAGES.map((img, i) => (
          <button
            key={img}
            onClick={() => setCurrentImage(i)}
            aria-label={`Image ${i + 1}`}
            className={`h-1 rounded-full overflow-hidden transition-all duration-300 ${
              i === currentImage
                ? "w-16 bg-white/25 cursor-default"
                : "w-7 bg-white/30 hover:bg-white/50"
            }`}
          >
            {i === currentImage && (
              <div
                className="h-full bg-amber-400/90 rounded-full"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 ring-1 ring-white/15"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
              </span>
              <span className="text-xs font-medium text-white/70 tracking-[0.2em] uppercase">
                {COMPANY.tagline}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-white leading-[1.02] mb-4 tracking-tight"
            >
              Kenya is{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-orange-200">
                waiting.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="font-display text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 leading-snug"
            >
              Let&apos;s build your safari.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed font-light tracking-wide"
            >
              Tell us what you want to experience. We&apos;ll design the trip around you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link href={PLAN_SAFARI_ROUTE}>
                <Button className="group relative h-14 px-8 text-base font-semibold gradient-primary text-white border-0 shadow-2xl shadow-amber-900/30 hover:scale-105 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Plan My Safari
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
                className="h-14 px-8 text-base font-medium bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp a Safari Expert
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-white/60 tracking-wide"
            >
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                Private Safaris
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                Custom Itineraries
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                Local Safari Experts
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}