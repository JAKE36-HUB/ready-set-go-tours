"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Calendar, Users, MapPin, ArrowRight, Star, Quote,
  Shield, Award, Heart, Phone, Check, Clock, Compass,
  MessageCircle,
  ClipboardCheck, FileCheck, Plane, X, ChevronRight, Bed, Hotel, Car, HeadphonesIcon, Package, Globe, Percent,
  Send, Loader2, ChevronLeft, CheckCircle2, Sparkles, type LucideIcon
} from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import emailjs from "@emailjs/browser"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DESTINATIONS, TOUR_PACKAGES, BEACH_DESTINATIONS,
  WHY_CHOOSE_US, STATISTICS, TESTIMONIALS, BLOG_POSTS, BOOKING_STEPS,
  COMPANY, GALLERY, TRUST_ITEMS, DEALS, USD_TO_KES
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import { BookingModal } from "@/components/layout/BookingModal"
import { SafariPlanner } from "@/components/safari-planner/SafariPlanner"

// ─── HERO ───────────────────────────────────────────────────────────────────

const HERO_IMAGES = [
  "https://i.pinimg.com/originals/21/2b/24/212b2433f246414a170ec177d76168f2.jpg",
  "https://i.pinimg.com/originals/11/56/82/1156825aa06be3206b2a1454ada4af1b.jpg",
  "https://i.pinimg.com/originals/98/66/ec/9866ec45a7a8400d3fdc9e0642ff1e99.jpg",
  "https://i.pinimg.com/originals/83/3d/29/833d2927fbfa457ee52f221b05df57c1.jpg",
  "https://i.pinimg.com/originals/c0/0c/f7/c00cf734544618ee6da72490b328a66e.jpg",
  "https://i.pinimg.com/originals/f5/e3/99/f5e3997c40125ec8b26b9e3687de6d36.jpg",
]

function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [mounted])

  const titleWords = ["Where", "the", "Wilderness", "Speaks"]

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-black">
      {/* Rotating background images with crossfade */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {HERO_IMAGES.map((img, i) => (
          <motion.div
            key={img}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === currentImage ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <Image
              src={img}
              alt={`African safari landscape ${i + 1}`}
              fill
              className="object-cover scale-110 brightness-[1.15] contrast-[1.05]"
              priority={i === 0}
            />
          </motion.div>
        ))}

      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* Decorative glass orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[200px]" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "50px 50px" }} />

      {/* Image indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`transition-all duration-500 rounded-full ${
              i === currentImage
                ? "w-8 h-1.5 bg-white/80"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>

      <motion.div style={{ opacity }} className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 ring-1 ring-white/10"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-white/60 tracking-wider uppercase">
                Ready for your next adventure?
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6 tracking-tight"
            >
              {titleWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 40 }}
                  animate={mounted ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                  className={`inline-block mr-[0.15em] ${
                    word === "Wilderness"
                      ? "bg-gradient-to-r from-emerald-300 via-emerald-200 to-teal-200 bg-clip-text text-transparent"
                      : "text-white"
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg text-white/50 max-w-xl mb-10 leading-relaxed font-light tracking-wide"
            >
              Curated safaris across Kenya and Tanzania. Every detail, every moment — crafted around you.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link href="/deals">
                <Button className="group relative h-14 px-8 text-base font-semibold bg-white text-slate-900 hover:bg-emerald-50 border-0 shadow-2xl shadow-white/10 hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    View Limited Deals
                    <Percent className="w-4 h-4" />
                  </span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="h-14 px-8 text-base font-medium bg-transparent border-white/20 text-white/80 hover:bg-white/5 hover:text-white hover:border-white/40 transition-all duration-300">
                  Plan Your Trip
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-0 left-0 right-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-t border-white/10 py-5">
            <div className="flex items-center gap-6 text-xs text-white/30">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Private Guides
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Custom Itineraries
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                24/7 Support
              </span>
            </div>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="hidden sm:flex items-center gap-2 text-xs text-white/20"
            >
              <span>Scroll to explore</span>
              <div className="w-4 h-6 rounded-full border border-white/20 flex items-start justify-center pt-1">
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-0.5 h-1.5 rounded-full bg-white/40"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ─── FEATURED DESTINATIONS ─────────────────────────────────────────────────

function FeaturedDestinations() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const allDestinations = [...DESTINATIONS.kenya, ...DESTINATIONS.tanzania]

  return (
    <section className="relative py-28 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6"
        >
          <div>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">
              Destinations
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
              Where to Go
            </h2>
          </div>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
            From Kenya&apos;s Masai Mara to Tanzania&apos;s Serengeti — explore East Africa&apos;s finest destinations.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-2 lg:mt-0 lg:mb-1">
            <span className="flex -space-x-1.5">
              {[1,2,3,4].map((i) => (
                <span key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 ring-2 ring-white dark:ring-slate-950" />
              ))}
            </span>
            <span><span className="font-semibold text-amber-500">2,400+</span> happy travelers</span>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {allDestinations.map((dest, idx) => {
            const isKenya = dest.id <= 8
            return (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-black/30 transition-all duration-700"
              >
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-md rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-800 border border-white/20 shadow-sm">
                      <MapPin className="w-3 h-3" />
                      {isKenya ? "Kenya" : "Tanzania"}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("w-3.5 h-3.5", i < Math.round(dest.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700")} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{dest.rating}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{dest.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{dest.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" />{dest.duration}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-500" />{dest.bestTime}</span>
                    </div>
                  <Link
                    href={isKenya ? "/kenya-tours" : "/tanzania-tours"}
                    className="inline-flex items-center justify-center gap-1.5 w-full h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all duration-300 border border-slate-200 dark:border-slate-700"
                  >
                    Explore Destination <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link href="/kenya-tours">
            <Button variant="outline" className="h-12 px-8 text-sm font-semibold border-slate-300 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500 transition-all">
              Explore All Destinations <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── TOUR PACKAGES ─────────────────────────────────────────────────────────

const badgeColors: Record<string, string> = {
  luxury: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0",
  safari: "bg-emerald-500 text-white border-0",
  group: "bg-gradient-to-r from-sky-500 to-teal-500 text-white border-0",
  beach: "bg-sky-500 text-white border-0",
  cultural: "bg-violet-500 text-white border-0",
  mountain: "bg-slate-700 text-white border-0",
}

function TourPackages({ onReserve }: { onReserve?: (name: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const safariPackages = TOUR_PACKAGES.filter((p) => p.type === "safari" || p.type === "group")

  return (
    <section className="relative py-28 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">
            Tours
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Safari & Group Packages
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Hand-crafted private safaris and daily joining group tours — see Africa your way.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {safariPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 left-3">
                    <Badge className={cn("text-xs font-semibold px-3 py-1", badgeColors[pkg.type] || "bg-slate-700 text-white")}>
                      {pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Non-resident</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">${pkg.price.toLocaleString()}</span>
                      <span className="text-sm text-slate-500">/ person</span>
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Resident</div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">KES {(pkg.priceKES ?? pkg.price * 130).toLocaleString()}</div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {pkg.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />{pkg.duration}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Bed className="w-3.5 h-3.5 text-amber-500 shrink-0" /><span className="truncate">{pkg.accommodation}</span></div>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mb-5">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                      {pkg.activities.slice(0, 4).map((a) => (
                        <span key={a} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />{a}
                        </span>
                      ))}
                      {pkg.activities.length > 4 && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 ml-5">+{pkg.activities.length - 4} more</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/holiday-packages/${pkg.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all duration-300"
                    >
                      View Details <ArrowRight className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onReserve?.(pkg.name)}
                      className="flex-1 inline-flex items-center justify-center h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
      </div>
    </section>
  )
}

// ─── MORE SERVICES ──────────────────────────────────────────────────────────

const HOME_SERVICES = [
  {
    image: "https://i.pinimg.com/736x/28/31/b4/2831b4de089bea29cccc93985a7bd032.jpg",
    icon: Hotel,
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
    icon: Globe,
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
    icon: Sparkles,
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

function MoreServices({ onReserve }: { onReserve?: (name: string) => void }) {
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
                {/* Image header */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Badge ribbon */}
                  <div className="absolute top-0 right-0 z-20">
                    <div className={cn("bg-gradient-to-r text-white text-[10px] font-bold px-3.5 py-1.5 rounded-bl-xl shadow-lg", service.badge === "Most Popular" ? "from-amber-500 to-orange-500" : service.badge === "Best Value" ? "from-emerald-500 to-teal-500" : "from-violet-500 to-purple-500")}>
                      {service.badge}
                    </div>
                    <div className={cn("absolute -bottom-1 right-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px]", service.badge === "Most Popular" ? "border-t-amber-700" : service.badge === "Best Value" ? "border-t-emerald-700" : "border-t-violet-700")} />
                  </div>

                  {/* Icon overlay */}
                  <div className="absolute bottom-3 left-4">
                    <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg ring-2 ring-white/20", c.from, c.to)}>
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Rating + Bookings bar */}
                <div className="flex items-center justify-between px-6 pt-4 pb-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-3 h-3", i < Math.round(service.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700")} />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">{service.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{service.bookings}</span>
                </div>

                {/* Title */}
                <div className="px-6 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{service.description}</p>
                </div>

                {/* Price */}
                <div className="px-6 pb-4">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Starting at</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white">{service.priceFrom}</div>
                </div>

                {/* Features */}
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

                {/* CTAs */}
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
                    >
                      Learn More <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
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

// ─── HOW IT WORKS ───────────────────────────────────────────────────────────

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const steps = BOOKING_STEPS.map((step, i) => ({
    ...step,
    number: i + 1,
    Icon: step.icon === "MessageCircle" ? MessageCircle
      : step.icon === "ClipboardCheck" ? ClipboardCheck
      : step.icon === "FileCheck" ? FileCheck
      : step.icon === "Plane" ? Plane
      : Heart,
  }))

  return (
    <section className="relative py-28 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
            How It{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-4">
            From your first inquiry to returning home with unforgettable memories — we make it seamless.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute top-12 left-[28px] lg:left-1/2 lg:-translate-x-1/2 w-0.5 h-[calc(100%-6rem)] bg-gradient-to-b from-emerald-200 via-teal-200 to-emerald-200 dark:from-emerald-800 dark:via-teal-800 dark:to-emerald-800 hidden lg:block" />

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-100 dark:ring-emerald-900/50 mb-5">
                  <step.Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">
                  Step {step.number}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-16"
        >
          <Link href="/contact">
            <Button className="h-14 px-10 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300">
              Start Planning — Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">No commitment required. Get a custom quote in 24 hours.</p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── TRUST STRIP ────────────────────────────────────────────────────────────

function TrustStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const topStats = STATISTICS.slice(0, 4)

  function Counter({ value }: { value: string }) {
    const [count, setCount] = useState(0)
    const num = parseInt(value.replace(/[^0-9]/g, ""))
    const suffix = value.replace(/[0-9,+]/g, "")
    const isK = value.toLowerCase().includes("k")
    useEffect(() => {
      if (!isInView) return
      let s = 0
      const end = isK ? 12 : num
      const step = Math.max(Math.floor(2000 / end), 16)
      const t = setInterval(() => { s += 1; setCount(s); if (s >= end) clearInterval(t) }, step)
      return () => clearInterval(t)
    }, [isInView, num, isK])
    return <>{isK ? count : count.toLocaleString()}{suffix}</>
  }

  return (
    <section ref={ref} className="relative py-10 sm:py-14 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {topStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-amber-500 tabular-nums">
                <Counter value={stat.value} />
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/60"
        >
          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-1.5">
            {TRUST_ITEMS.slice(0, 5).map((item, idx) => {
              const IconComponent = ({ Shield, Award, HeadphonesIcon, Package, Star, Heart, Hotel, Users } as Record<string, LucideIcon>)[item.icon]
              return (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
                  {IconComponent && <IconComponent className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  <span>{item.label}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── WHY CHOOSE US ────────────────────────────────────────────────────────

const whyIconMap: Record<string, LucideIcon> = { Shield: Shield, Award: Award, Users: Users, Heart: Heart, Package: Package, HeadphonesIcon: HeadphonesIcon, Car: Car, MapPin: MapPin }

function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">Why Us</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Why Choose Us
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            We don&apos;t just plan trips — we craft transformative experiences.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_US.map((item, idx) => {
            const IconComponent = whyIconMap[item.icon]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-800 hover:-translate-y-1 transition-all duration-400"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/30 group-hover:scale-110 transition-all duration-300">
                  {IconComponent && <IconComponent className="w-7 h-7 text-white" />}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────

function TestimonialsCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })])

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
                        <Image src={t.image} alt={t.name} fill className="object-cover brightness-[1.1]" />
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

// ─── FEATURED DEALS ────────────────────────────────────────────────────────

function FeaturedDeals() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const deals = DEALS.slice(0, 5)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "center", loop: true, skipSnaps: false, containScroll: false, slidesToScroll: 1 },
    [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  useEffect(() => {
    if (!emblaApi) return
    /* eslint-disable react-hooks/set-state-in-effect */
    setScrollSnaps(emblaApi.scrollSnapList())
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi])

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ring-1 ring-emerald-500/20 mb-4">
            <Percent className="size-3.5" />
            Limited Time Offers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Best Deals
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/15 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-rose-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />Limited Spots
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-amber-500/30">
              Save Up to 30%
            </span>
          </div>
        </motion.div>

        {/* Embla viewport */}
        <div className="overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8" ref={emblaRef}>
          <div className="flex">
            {deals.map((deal) => (
              <div key={deal.id} className="min-w-0 shrink-0 grow-0 basis-[70%] sm:basis-[45%] lg:basis-[34%] pl-4 sm:pl-6 lg:pl-8">
                <div className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10 transition-all duration-300 h-full">
                  <Link href={`/deals/${deal.slug}`}>
                    <div className="relative h-44 sm:h-48 overflow-hidden">
                      <Image src={deal.image} alt={deal.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 34vw" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{deal.discount}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2">{deal.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="size-3" />{deal.duration}</span>
                        <span className="flex items-center gap-1"><Hotel className="size-3" />{deal.accommodation.split("|")[0].trim()}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === selectedIndex ? "w-8 bg-emerald-500" : "w-2 bg-white/20 hover:bg-white/40"}`}
              aria-label={`Show deal ${i + 1}`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <Link href="/deals" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            See All Deals & Offers <ChevronRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── BLOG PREVIEW ─────────────────────────────────────────────────────────

function BlogPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const posts = BLOG_POSTS.slice(0, 3)

  return (
    <section className="relative py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6"
        >
          <div>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">Journal</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mt-3 tracking-tight">
              Travel Guide
            </h2>
          </div>
          <Link href="/travel-guide">
            <Button variant="outline" className="h-12 px-8 text-sm font-semibold border-slate-300 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500 transition-all">
              Read Our Guides <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={`/travel-guide/${post.slug}`} className="group block">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{post.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 text-sm font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read Guide <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────

function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 500], [0, 100])

  return (
    <section className="relative py-32 overflow-hidden bg-slate-950">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="https://i.pinimg.com/736x/ce/f6/d6/cef6d689ef0cdfd6df6180dee63f669c.jpg?w=1920&q=90"
          alt="African sunset silhouette"
          fill
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

// ─── FLOATING WHATSAPP ─────────────────────────────────────────────────────

function FloatingWhatsApp() {
  return (
    <Link
      href={`https://wa.me/${COMPANY.whatsapp}?text=Hi!%20I'm%20interested%20in%20planning%20a%20safari`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 hover:shadow-emerald-500/60 transition-all duration-300"
    >
      <MessageCircle className="w-6 h-6" />
    </Link>
  )
}

// ─── STICKY MOBILE CTA ─────────────────────────────────────────────────────

function StickyMobileCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: show ? 0 : 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-3 md:hidden"
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <Link href="/deals" className="flex-1">
          <Button className="w-full h-11 text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-0">
            View Deals
          </Button>
        </Link>
        <Link href="/contact" className="flex-[2]">
          <Button className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 border-0 shadow-lg shadow-emerald-500/25">
            Plan Your Safari
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingPackage, setBookingPackage] = useState<string | undefined>()

  const handleReserve = (name: string) => {
    setBookingPackage(name)
    setBookingOpen(true)
  }

  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedDeals />
      <FeaturedDestinations />
      <HowItWorks />
      <TourPackages onReserve={handleReserve} />
      <WhyChooseUs />
      <TestimonialsCarousel />
      <MoreServices onReserve={handleReserve} />
      <BlogPreview />
      <FinalCTA />
      <FloatingWhatsApp />
      <StickyMobileCTA />
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} initialPackage={bookingPackage} />
    </>
  )
}
