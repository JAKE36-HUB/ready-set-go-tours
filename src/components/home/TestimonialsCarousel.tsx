"use client"

import { useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Star, Quote } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

import { TESTIMONIALS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function TestimonialsCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="relative py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Real experiences from real travelers. Discover why guests choose us for their African adventures.
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="shrink-0 w-full sm:w-[420px] lg:w-[480px]"
                >
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 h-full">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-200 dark:ring-amber-800">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                      <Quote className="w-6 h-6 text-amber-300/50 dark:text-amber-600/50 shrink-0" />
                    </div>

                    <div className="flex items-center gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < testimonial.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200 dark:text-slate-700"
                          )}
                        />
                      ))}
                    </div>

                    <blockquote className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-4">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>

                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {testimonial.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:shadow-md"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:shadow-md"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
