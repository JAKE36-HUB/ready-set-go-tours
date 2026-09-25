"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { MessageCircle, ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants"

const REASONS = [
  "A specific park you have your heart set on",
  "A pace, length or budget that isn't in the brochures",
  "Safari and beach in one trip",
  "Lodge or tented camp — you decide",
]

export function CustomSafari() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const whatsappUrl = whatsappLink()

  return (
    <section ref={ref} className="relative py-24 sm:py-28 bg-muted/70 dark:bg-stone-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[520px] shadow-2xl"
          >
            <Image
              src="/images/local/pin_d21f86305bc5df0128814c1a93b7515a.jpg"
              alt="Custom private safari in Kenya"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-amber-400">Custom Safaris</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground mt-4 mb-5 leading-tight">
              Can&apos;t find exactly what you&apos;re looking for?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              You don&apos;t have to choose from a list. Tell us what you want to experience — the parks you love, the pace you prefer, the places you&apos;ve always dreamed of. If you can dream it, we can build it.
            </p>
            <ul className="space-y-3 mb-8">
              {REASONS.map((reason) => (
                <li key={reason} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary dark:text-amber-400 shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link href={PLAN_SAFARI_ROUTE}>
                <Button className="h-13 px-8 text-base font-semibold gradient-primary text-white border-0 shadow-premium hover:shadow-premium hover:scale-105 transition-all duration-300">
                  Build My Safari <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
                className="h-13 px-8 text-base font-medium border-border hover:border-primary/40 hover:text-primary dark:hover:text-amber-400 transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}