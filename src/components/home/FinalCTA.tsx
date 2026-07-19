"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { COMPANY } from "@/lib/constants"

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://i.pinimg.com/736x/02/c9/06/02c90620487e4570c02435efdb485639.jpg"
          alt="African sunset over savanna plains with wildlife silhouettes"
          fill
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="text-sm font-semibold text-amber-400 uppercase tracking-widest">
            Start Your Journey
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 leading-tight tracking-tight">
            Your Next Adventure<br />
            <span className="text-amber-400">Starts Today</span>
          </h2>
          <p className="text-lg text-white/70 max-w-lg mb-8 leading-relaxed">
            Let our experts craft your perfect East African experience. From luxury safaris to beach escapes, every detail is tailored to you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/holiday-packages">
              <Button className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105">
                Book Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="h-14 px-8 text-base font-semibold bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact an Expert
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Free consultation
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Custom itineraries
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              24/7 support
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
