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
    <section ref={ref} className="relative overflow-hidden bg-muted/50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-card lg:aspect-auto lg:h-[520px]"
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
            <span className="eyebrow">Custom safaris</span>
            <h2 className="mb-5 mt-4 font-display text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Can&apos;t find exactly what you&apos;re looking for?
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              You don&apos;t have to choose from a list. Tell us what you want to experience — the parks you love, the pace you prefer, the places you&apos;ve always dreamed of. If you can dream it, we can build it.
            </p>
            <ul className="mb-8 space-y-3">
              {REASONS.map((reason) => (
                <li key={reason} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link href={PLAN_SAFARI_ROUTE}>
                <Button className="h-13 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                  Build My Safari <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
                className="h-13 border-border px-8 text-base font-medium transition-all hover:border-primary/40 hover:text-primary"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}