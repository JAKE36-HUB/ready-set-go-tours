"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/motion/Magnetic"
import { PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants"

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const whatsappUrl = whatsappLink()

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#06101C] py-28 sm:py-32">
      <div className="absolute inset-0">
        <Image
          src="/images/local/pin_cef6d689ef0cdfd6df6180dee63f669c.jpg"
          alt="African sunset silhouette"
          fill
          sizes="100vw"
          className="object-cover brightness-[0.8]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06101C]/95 via-[#06101C]/80 to-[#06101C]/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F7CE84]">Ready when you are</span>
          <h2 className="mb-6 mt-4 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
            Ready to start planning?
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-white/60">
            Tell us what you want to experience, and we&apos;ll design the trip around you. No templates, no pressure — just honest advice from real safari people.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link href={PLAN_SAFARI_ROUTE}>
                <Button className="h-14 rounded-full bg-[#F8D79A] px-10 text-base font-semibold text-[#0B2A4A] shadow-none hover:bg-[#FFB627]">
                  Plan My Safari <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic>
              <Button
                variant="outline"
                onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
                className="h-14 rounded-full border-white/20 bg-white/5 px-10 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp a Safari Expert
              </Button>
            </Magnetic>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Private itineraries</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Honest, local advice</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Reply within 24 hours</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}