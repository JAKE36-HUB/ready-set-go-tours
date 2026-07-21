"use client"

import { useRef } from "react"
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
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })])

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
      </div>
    </section>
  )
}
