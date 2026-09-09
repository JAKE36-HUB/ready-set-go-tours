"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Quote, Star } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

import { TESTIMONIALS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function TestimonialsCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })])

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
    <section className="relative py-28 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">Testimonials</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Voices of the Wild
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Real stories from real travelers who embarked on the journey of a lifetime.
          </p>
          <div className="inline-flex items-center gap-2 mt-5 px-4 py-1.5 rounded-full bg-amber-500/10 ring-1 ring-amber-500/20">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              4.9/5 from 2,000+ travelers
            </span>
          </div>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="shrink-0 w-full sm:w-[420px] lg:w-[480px]">
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 h-full flex flex-col">
                    <Quote className="w-8 h-8 text-amber-300/30 dark:text-amber-600/30 mb-4" />
                    <blockquote className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 flex-1">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-200 dark:ring-amber-800 shrink-0">
                        <Image src={t.image} alt={t.name} fill sizes="48px" className="object-cover brightness-[1.1]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.location}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("w-3.5 h-3.5", i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700")} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === selectedIndex ? "w-8 bg-amber-500" : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"}`}
              aria-label={`Show testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
