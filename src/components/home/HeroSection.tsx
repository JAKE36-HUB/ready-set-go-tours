"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants"

const HERO_IMAGES = [
  "/images/local/pin_212b2433f246414a170ec177d76168f2.jpg",
  "/images/local/pin_1156825aa06be3206b2a1454ada4af1b.jpg",
  "/images/local/pin_9866ec45a7a8400d3fdc9e0642ff1e99.jpg",
]

const SLIDE_DURATION = 7000

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
    }, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [paused, currentImage])

  useEffect(() => {
    if (paused) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0)
    const start = Date.now()
    const interval = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / SLIDE_DURATION) * 100)
      setProgress(pct)
      if (pct >= 100) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [paused, currentImage])

  const whatsappUrl = whatsappLink()

  return (
    <section
      className="relative flex h-[100svh] min-h-[680px] items-end overflow-hidden bg-[#06101C] sm:items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 scale-[1.06]">
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
      </div>

      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06101C]/85 via-[#06101C]/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(248,197,102,0.16),transparent_42%)]" />

      <div className="relative z-10 w-full pb-28 pt-32 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="hero-rise hero-rise-1 mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#F8C566]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 sm:text-[11px]">
                Private safaris · Kenya &amp; Tanzania
              </span>
            </div>

            <h1 className="hero-rise hero-rise-2 font-display text-[clamp(3.25rem,9vw,7.5rem)] font-normal leading-[0.92] tracking-[-0.035em] text-white">
              Wild by nature.
              <span className="mt-1 block italic text-[#F7CE84]">Yours by design.</span>
            </h1>

            <p className="hero-rise hero-rise-3 mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Tailor-made journeys through Kenya and Tanzania — designed around your pace, your people
              and the moments you&apos;ll remember.
            </p>

            <div className="hero-rise hero-rise-4 mt-9 flex flex-wrap gap-3">
              <Link href={PLAN_SAFARI_ROUTE}>
                <Button className="h-14 rounded-full bg-[#F8D79A] px-8 text-base font-semibold text-[#0B2A4A] shadow-none hover:bg-[#FFB627]">
                  Start planning
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
                className="h-14 rounded-full border-white/25 bg-white/5 px-7 text-base font-medium text-white backdrop-blur-md hover:border-white/45 hover:bg-white/10 hover:text-white"
              >
                <MessageCircle className="mr-2 size-4" />
                WhatsApp an expert
              </Button>
            </div>

            <div className="hero-fade mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50 sm:text-[11px]">
              <span>Tailor-made itineraries</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
              <span>Local safari guides</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
              <span>Reply within 24 hours</span>
            </div>
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
