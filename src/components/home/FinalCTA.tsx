"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { ArrowRight, MessageCircle, Shield, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 500], [0, 100])

  return (
    <section className="relative py-32 overflow-hidden bg-slate-950">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="https://i.pinimg.com/736x/ce/f6/d6/cef6d689ef0cdfd6df6180dee63f669c.jpg"
          alt="African sunset silhouette"
          fill
          sizes="100vw"
          className="object-cover brightness-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-sm font-semibold text-amber-400 uppercase tracking-[0.2em]">Start Your Journey</span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mt-4 mb-6 leading-tight tracking-tight">
            Your African Dream<br />
            <span className="text-amber-400">Awaits</span>
          </h2>
          <p className="text-lg text-white/60 max-w-lg mx-auto mb-10 leading-relaxed">
            Let our experts craft your perfect East African experience. Every detail, tailored to you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-emerald-500/30">
              <CheckCircle2 className="size-3.5" />
              100% Tailored for You
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-amber-500/30">
              <Shield className="size-3.5" />
              Best Price Guarantee
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/holiday-packages">
              <Button className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105">
                Explore Tours <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="h-14 px-8 text-base font-semibold bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white hover:border-white/30 transition-all duration-300">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with an Expert
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Free consultation</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Custom itineraries</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />24/7 support</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Best price guarantee</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
