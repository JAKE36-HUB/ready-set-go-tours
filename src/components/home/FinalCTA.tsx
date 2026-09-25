"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { COMPANY, PLAN_SAFARI_ROUTE } from "@/lib/constants"

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi! I'd like to plan a safari with Ready Set Go Safaris.")}`

  return (
    <section ref={ref} className="relative py-28 sm:py-32 overflow-hidden bg-stone-950">
      <div className="absolute inset-0">
        <Image
          src="/images/local/pin_cef6d689ef0cdfd6df6180dee63f669c.jpg"
          alt="African sunset silhouette"
          fill
          sizes="100vw"
          className="object-cover brightness-[0.85]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/75 to-stone-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-xs font-semibold text-amber-300 uppercase tracking-[0.2em]">Ready when you are</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white mt-4 mb-6 leading-tight">
            Ready to start planning?
          </h2>
          <p className="text-lg text-white/60 max-w-lg mx-auto mb-10 leading-relaxed">
            Tell us what you want to experience, and we&apos;ll design the trip around you. No templates, no pressure — just honest advice from real safari people.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={PLAN_SAFARI_ROUTE}>
              <Button className="h-14 px-10 text-base font-semibold gradient-primary text-white border-0 shadow-2xl shadow-amber-900/30 hover:scale-105 transition-all duration-300">
                Plan My Safari <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
              className="h-14 px-10 text-base font-semibold rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:text-white hover:border-white/30 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp a Safari Expert
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Private itineraries</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Honest, local advice</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Reply within 24 hours</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}