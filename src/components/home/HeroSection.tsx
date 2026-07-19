"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Users, MapPin, Search, Compass, Navigation } from "lucide-react"

import { Button } from "@/components/ui/button"
import { COMPANY } from "@/lib/constants"

const destinations = [
  { value: "", label: "Select Destination" },
  { value: "masai-mara", label: "Masai Mara" },
  { value: "amboseli", label: "Amboseli" },
  { value: "serengeti", label: "Serengeti" },
  { value: "ngorongoro", label: "Ngorongoro Crater" },
  { value: "diani", label: "Diani Beach" },
  { value: "zanzibar", label: "Zanzibar" },
  { value: "kilimanjaro", label: "Mount Kilimanjaro" },
]

const budgets = [
  { value: "", label: "Select Budget" },
  { value: "budget", label: "Under $1,000" },
  { value: "mid", label: "$1,000 - $2,500" },
  { value: "premium", label: "$2,500 - $5,000" },
  { value: "luxury", label: "$5,000+" },
]

const travelStyles = [
  { value: "", label: "Travel Style" },
  { value: "safari", label: "Safari" },
  { value: "beach", label: "Beach Holiday" },
  { value: "luxury", label: "Luxury" },
  { value: "adventure", label: "Adventure" },
  { value: "family", label: "Family" },
]

const heroImages = [
  "https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg",
  "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg",
  "https://i.pinimg.com/736x/cc/76/4a/cc764a89a26b9322634b91a51d58248f.jpg",
  "https://i.pinimg.com/736x/f9/70/19/f97019de628aac44821bd272040ce313.jpg",
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [destination, setDestination] = useState("")
  const [travelDate, setTravelDate] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [budget, setBudget] = useState("")
  const [travelStyle, setTravelStyle] = useState("")

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [mounted])

  return (
    <section className="relative h-screen min-h-[750px] flex items-center overflow-hidden">
      {heroImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/80 to-slate-900/70" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-amber-500/15 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-amber-500/20"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold text-amber-300 tracking-wide uppercase">
                {COMPANY.shortName}
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-6 tracking-tight">
              Dare to
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 bg-clip-text text-transparent">
                Explore
              </span>
              <br />
              the Wild
            </h1>

            <p className="text-lg sm:text-xl text-white/70 max-w-lg mb-8 leading-relaxed">
              From thundering wildebeest crossings to the silent dawn of Kilimanjaro —
              East Africa&apos;s untamed wilderness awaits your footprint.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/holiday-packages">
                <Button className="group h-14 px-8 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300">
                  <Compass className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-45" />
                  Begin Expedition
                </Button>
              </Link>
              <Link href="/kenya-tours">
                <Button
                  variant="outline"
                  className="h-14 px-8 text-base font-semibold bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 hover:text-white hover:border-amber-400/50 transition-all duration-300"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  View Wilderness
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 to-orange-600/20 rounded-3xl blur-xl" />
              <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Plan Your Expedition</h3>
                    <p className="text-xs text-white/50">Custom safari itinerary</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-amber-400" /> Destination
                      </label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 appearance-none cursor-pointer focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      >
                        {destinations.map((d) => (
                          <option key={d.value} value={d.value} className="bg-slate-800 text-white">
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-amber-400" /> Travel Date
                      </label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-amber-400" /> Adventurers
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-amber-400" /> Young Explorers
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-amber-400" /> Budget
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 appearance-none cursor-pointer focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      >
                        {budgets.map((b) => (
                          <option key={b.value} value={b.value} className="bg-slate-800 text-white">
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-3 h-3 text-amber-400" /> Style
                      </label>
                      <select
                        value={travelStyle}
                        onChange={(e) => setTravelStyle(e.target.value)}
                        className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 appearance-none cursor-pointer focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      >
                        {travelStyles.map((s) => (
                          <option key={s.value} value={s.value} className="bg-slate-800 text-white">
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Link href="/holiday-packages">
                    <Button className="group w-full h-12 mt-2 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                      <Search className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                      Find Your Safari
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1.5 rounded-full bg-amber-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
