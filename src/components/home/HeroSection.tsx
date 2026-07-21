"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Percent } from "lucide-react"

import { Button } from "@/components/ui/button"

const HERO_IMAGES = [
  "https://i.pinimg.com/736x/21/2b/24/212b2433f246414a170ec177d76168f2.jpg",
  "https://i.pinimg.com/736x/11/56/82/1156825aa06be3206b2a1454ada4af1b.jpg",
  "https://i.pinimg.com/736x/98/66/ec/9866ec45a7a8400d3fdc9e0642ff1e99.jpg",
  "https://i.pinimg.com/736x/83/3d/29/833d2927fbfa457ee52f221b05df57c1.jpg",
  "https://i.pinimg.com/736x/c0/0c/f7/c00cf734544618ee6da72490b328a66e.jpg",
  "https://i.pinimg.com/736x/f5/e3/99/f5e3997c40125ec8b26b9e3687de6d36.jpg",
]

export function HeroSection() {
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
              sizes="100vw"
              className="object-cover scale-110 brightness-[1.15] contrast-[1.05]"
              priority={i < 2}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[200px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "50px 50px" }} />

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

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg text-white/50 max-w-xl mb-10 leading-relaxed font-light tracking-wide"
            >
              Curated safaris across Kenya and Tanzania. Every detail, every moment — crafted around you.
            </motion.p>

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
