"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Percent, Clock, Hotel, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

import { DEALS } from "@/lib/constants"

export function FeaturedDeals() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const deals = DEALS.slice(0, 5)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "center", loop: true, skipSnaps: false, containScroll: false, slidesToScroll: 1 },
    [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  useEffect(() => {
    if (!emblaApi) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrollSnaps(emblaApi.scrollSnapList())
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi])

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ring-1 ring-emerald-500/20 mb-4">
            <Percent className="size-3.5" />
            Limited Time Offers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Best Deals
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/15 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-rose-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />Limited Spots
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-amber-500/30">
              Save Up to 30%
            </span>
          </div>
        </motion.div>

        <div className="overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8" ref={emblaRef}>
          <div className="flex">
            {deals.map((deal) => (
              <div key={deal.id} className="min-w-0 shrink-0 grow-0 basis-[70%] sm:basis-[45%] lg:basis-[34%] pl-4 sm:pl-6 lg:pl-8">
                <div className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10 transition-all duration-300 h-full">
                  <Link href={`/deals/${deal.slug}`}>
                    <div className="relative h-44 sm:h-48 overflow-hidden">
                      <Image src={deal.image} alt={deal.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 34vw" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{deal.discount}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2">{deal.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="size-3" />{deal.duration}</span>
                        <span className="flex items-center gap-1"><Hotel className="size-3" />{deal.accommodation.split("|")[0].trim()}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === selectedIndex ? "w-8 bg-emerald-500" : "w-2 bg-white/20 hover:bg-white/40"}`}
              aria-label={`Show deal ${i + 1}`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <Link href="/deals" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            See All Deals & Offers <ChevronRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
