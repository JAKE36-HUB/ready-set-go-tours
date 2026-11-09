"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/motion/Magnetic"
import { PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants"

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

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 22, mass: 0.6 })
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 22, mass: 0.6 })
  const imageX = useTransform(smoothX, [-0.5, 0.5], ["-1.6%", "1.6%"])
  const imageY = useTransform(smoothY, [-0.5, 0.5], ["-1.6%", "1.6%"])

  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

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

  const whatsappUrl = whatsappLink()

  return (
    <section
      className="relative flex h-[100svh] min-h-[680px] items-end overflow-hidden bg-[#06101C] sm:items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseMove={handlePointerMove}
      onMouseLeave={() => {
        setPaused(false)
        resetPointer()
      }}
    >
      <motion.div className="absolute inset-0" style={{ x: imageX, y: imageY, scale: 1.06 }}>
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
              className="object-cover scale-105 brightness-[0.82] contrast-[1.04]"
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </motion.div>

      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06101C]/85 via-[#06101C]/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(248,197,102,0.16),transparent_42%)]" />

      <div className="relative z-10 w-full pb-28 pt-32 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-7 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-[#F8C566]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 sm:text-[11px]">
                Private safaris · Kenya &amp; Tanzania
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-display text-[clamp(3.25rem,9vw,7.5rem)] font-normal leading-[0.92] tracking-[-0.035em] text-white"
            >
              Wild by nature.
              <span className="mt-1 block italic text-[#F7CE84]">Yours by design.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
            >
              Tailor-made journeys through Kenya and Tanzania — designed around your pace, your people
              and the moments you&apos;ll remember.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Magnetic>
                <Link href={PLAN_SAFARI_ROUTE}>
                  <Button className="h-14 rounded-full bg-[#F8D79A] px-8 text-base font-semibold text-[#0B2A4A] shadow-none hover:bg-[#FFB627]">
                    Start planning
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic>
                <Button
                  variant="outline"
                  onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
                  className="h-14 rounded-full border-white/25 bg-white/5 px-7 text-base font-medium text-white backdrop-blur-md hover:border-white/45 hover:bg-white/10 hover:text-white"
                >
                  <MessageCircle className="mr-2 size-4" />
                  WhatsApp an expert
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50 sm:text-[11px]"
            >
              <span>Tailor-made itineraries</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
              <span>Local safari guides</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
              <span>Reply within 24 hours</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            {HERO_IMAGES.map((img, i) => (
              <button
                key={img}
                onClick={() => setCurrentImage(i)}
                aria-label={`Image ${i + 1}`}
                className={`h-[3px] overflow-hidden rounded-full transition-all duration-300 ${
                  i === currentImage ? "w-16 bg-white/20" : "w-8 bg-white/20 hover:bg-white/35"
                }`}
              >
                {i === currentImage && (
                  <div
                    className="h-full rounded-full bg-[#F7CE84]"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/40 lg:flex">
            <span>Scroll to explore</span>
            <span className="h-px w-12 bg-white/25" />
          </div>
        </div>
      </div>
    </section>
  )
}
