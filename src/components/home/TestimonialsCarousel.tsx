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
    <section ref={ref} className="relative py-24 sm:py-28 bg-muted/70 dark:bg-stone-900 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-amber-400">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground mt-4 mb-4 leading-tight">
            Real trips. Real travellers.
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Stories from travellers who came for the wildlife and left with a whole lot more.
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="shrink-0 w-full sm:w-[420px] lg:w-[480px]">
                  <div className="bg-card rounded-3xl p-8 border border-border h-full flex flex-col">
                    <Quote className="w-8 h-8 text-amber-500/30 dark:text-amber-600/30 mb-4" />
                    <blockquote className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-400/40 shrink-0">
                        <Image src={t.image} alt={t.name} fill sizes="48px" className="object-cover brightness-[1.1]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                        <p className="text-xs text-muted-foreground">{t.location}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("w-3.5 h-3.5", i < t.rating ? "text-amber-400 fill-amber-400" : "text-stone-200 dark:text-stone-700")} />
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
              className={`h-2 rounded-full transition-all duration-300 ${i === selectedIndex ? "w-8 bg-primary dark:bg-amber-400" : "w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400 dark:hover:bg-stone-600"}`}
              aria-label={`Show testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}