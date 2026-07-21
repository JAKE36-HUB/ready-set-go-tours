"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Star, Check, Compass, ArrowRight, Hotel, Globe, Sparkles, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const HOME_SERVICES = [
  {
    image: "https://i.pinimg.com/736x/28/31/b4/2831b4de089bea29cccc93985a7bd032.jpg",
    icon: Hotel as LucideIcon,
    title: "Hotel Bookings",
    slug: "hotel-bookings",
    description: "We secure exclusive rates at 200+ hand-picked properties across East Africa — from luxury safari camps to beachfront resorts and city hotels.",
    features: ["Best rate guarantee", "200+ vetted properties", "Luxury camps & lodges", "Beach & city hotels", "Honeymoon packages", "Free booking service"],
    priceFrom: "From $80 / night",
    badge: "Most Popular",
    bookings: "4,200+ bookings",
    rating: 4.9,
    color: "sky",
  },
  {
    image: "https://i.pinimg.com/736x/72/1a/8a/721a8a7ea0c339e50b674b2db40e125a.jpg",
    icon: Globe as LucideIcon,
    title: "Air Ticketing",
    slug: "air-ticketing",
    description: "International flights, domestic connections, and bush flights to remote safari airstrips — all at preferred airline rates with 24/7 support.",
    features: ["International flights", "Bush & domestic flights", "Preferred airline rates", "Group fare negotiation", "Flexible ticket options", "Meet-and-assist service"],
    priceFrom: "From $299",
    badge: "Best Value",
    bookings: "3,800+ bookings",
    rating: 4.8,
    color: "emerald",
  },
  {
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    icon: Sparkles as LucideIcon,
    title: "Massage & Wellness",
    slug: "massage-wellness",
    description: "Professional in-room massage, spa days, and wellness retreats using natural African ingredients. Perfect post-safari recovery or honeymoon indulgence.",
    features: ["In-room massage", "Spa packages & facials", "Couples treatments", "Wellness retreats", "Post-safari recovery", "Certified therapists"],
    priceFrom: "From $60 / session",
    badge: "Premium",
    bookings: "1,900+ bookings",
    rating: 4.9,
    color: "violet",
  },
]

const serviceColorMap: Record<string, { from: string; to: string; text: string; ring: string; bg: string; grad: string }> = {
  sky: { from: "from-sky-500", to: "to-blue-600", text: "text-sky-600 dark:text-sky-400", ring: "hover:border-sky-300 dark:hover:border-sky-700", bg: "bg-sky-50 dark:bg-sky-950/30", grad: "from-sky-500/10 to-blue-600/5" },
  emerald: { from: "from-emerald-500", to: "to-teal-600", text: "text-emerald-600 dark:text-emerald-400", ring: "hover:border-emerald-300 dark:hover:border-emerald-700", bg: "bg-emerald-50 dark:bg-emerald-950/30", grad: "from-emerald-500/10 to-teal-600/5" },
  violet: { from: "from-violet-500", to: "to-purple-600", text: "text-violet-600 dark:text-violet-400", ring: "hover:border-violet-300 dark:hover:border-violet-700", bg: "bg-violet-50 dark:bg-violet-950/30", grad: "from-violet-500/10 to-purple-600/5" },
}

export function MoreServices({ onReserve }: { onReserve?: (name: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative py-28 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ring-1 ring-amber-500/20 mb-5">
            <Compass className="size-3.5" />
            Additional Services
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Everything You Need,{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">
              One Call Away
            </span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            From flights and accommodation to relaxation — we handle every detail so you just enjoy the journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {HOME_SERVICES.map((service, idx) => {
            const c = serviceColorMap[service.color]
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute top-0 right-0 z-20">
                    <div className={cn("bg-gradient-to-r text-white text-[10px] font-bold px-3.5 py-1.5 rounded-bl-xl shadow-lg", service.badge === "Most Popular" ? "from-amber-500 to-orange-500" : service.badge === "Best Value" ? "from-emerald-500 to-teal-500" : "from-violet-500 to-purple-500")}>
                      {service.badge}
                    </div>
                    <div className={cn("absolute -bottom-1 right-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px]", service.badge === "Most Popular" ? "border-t-amber-700" : service.badge === "Best Value" ? "border-t-emerald-700" : "border-t-violet-700")} />
                  </div>

                  <div className="absolute bottom-3 left-4">
                    <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg ring-2 ring-white/20", c.from, c.to)}>
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-6 pt-4 pb-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-3 h-3", i < Math.round(service.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700")} />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">{service.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{service.bookings}</span>
                </div>

                <div className="px-6 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{service.description}</p>
                </div>

                <div className="px-6 pb-4">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Starting at</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white">{service.priceFrom}</div>
                </div>

                <div className="px-6 pb-4">
                  <ul className="space-y-1.5">
                    {service.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <Check className={cn("w-3.5 h-3.5 shrink-0", c.text)} />
                        {f}
                      </li>
                    ))}
                    {service.features.length > 4 && (
                      <li className="text-xs text-amber-600 dark:text-amber-400 ml-5.5">+{service.features.length - 4} more</li>
                    )}
                  </ul>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onReserve?.(service.title)}
                      className={cn("flex-1 h-10 rounded-xl text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r", c.from, c.to)}
                    >
                      Book Now
                    </button>
                    <Link
                      href={`/services/${service.slug}`}
                      className={cn("flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all")}
                      aria-label={`Learn more about ${service.title}`}
                    >
                      Learn More <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/services">
            <Button className="h-12 px-8 text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all">
              View All Services <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
