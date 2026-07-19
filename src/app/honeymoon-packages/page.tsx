"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic"
import { HONEYMOON_PACKAGES, COMPANY, USD_TO_KES } from "@/lib/constants";
import { Heart, Star, MapPin, Clock, Plane, ChevronRight, Sparkles, Gift, Shield, Check, ArrowRight, Phone, Quote, FileText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const PdfItinerary = dynamic(() => import("@/components/PdfItinerary"), { ssr: false })

const typeDefs = [
  { key: "all", label: "All Packages", icon: Sparkles },
  { key: "safari-beach", label: "Safari & Beach", icon: Plane },
  { key: "mountain", label: "Mountain Retreat", icon: MapPin },
  { key: "beach", label: "Beach Only", icon: Heart },
];

export default function HoneymoonPage() {
  const [selected, setSelected] = useState<string>("all");

  const filtered = selected === "all"
    ? HONEYMOON_PACKAGES
    : HONEYMOON_PACKAGES.filter((p) => p.slug.includes(selected));

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/18/e8/8f/18e88ff822350751cb10a878ba3edc71.jpg"
          alt="Couple on dock overlooking overwater bungalows"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/40 via-transparent to-rose-950/40" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heart className="size-10 text-rose-400 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Honeymoon{" "}
              <span className="bg-gradient-to-r from-rose-300 via-rose-200 to-pink-200 bg-clip-text text-transparent">
                Packages
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Handcrafted romantic escapes across East Africa. From private safari adventures to
              secluded beachfront villas — your dream honeymoon begins here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="py-10 px-6 bg-gradient-to-b from-rose-50/50 to-white dark:from-rose-950/10 dark:to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {typeDefs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setSelected(t.key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selected === t.key
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-rose-300"
                  }`}
                >
                  <Icon className="size-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {filtered.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden ring-1 ring-slate-100 dark:ring-slate-700 hover:ring-rose-300/50 dark:hover:ring-rose-500/30 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-500"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-rose-600">
                      <Heart className="size-3 fill-rose-500 text-rose-500" />
                      Honeymoon
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-white/70 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {pkg.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {pkg.accommodation}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                      {pkg.description}
                    </p>

                    <div className="mb-1">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Non-resident</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                          ${pkg.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-slate-400">/couple</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Citizen</div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        KES {(pkg.priceKES ?? pkg.price * USD_TO_KES).toLocaleString()}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Highlights</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {pkg.highlights.map((h) => (
                          <div key={h} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Star className="size-3.5 text-rose-400 shrink-0 mt-0.5 fill-rose-400" />
                            {h}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Included</h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {pkg.included.map((i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Check className="size-3 text-emerald-500 shrink-0" />
                            {i}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/honeymoon-packages/${pkg.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-white dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 hover:ring-rose-300 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all duration-300"
                      >
                        View Details <ArrowRight className="size-4" />
                      </Link>
                      <PdfItinerary
                        data={{
                          name: pkg.name,
                          description: pkg.description,
                          duration: pkg.duration,
                          price: pkg.price,
                          accommodation: pkg.accommodation,
                          meals: pkg.meals,
                          transport: pkg.transport,
                          highlights: pkg.highlights,
                          activities: pkg.activities,
                          included: pkg.included,
                        }}
                        buttonLabel="Download PDF"
                        className="h-12 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Why Honeymoon With Us */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-rose-50/50 dark:to-rose-950/10">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">
              Why Choose Us for Your{" "}
              <span className="bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent">
                Honeymoon
              </span>
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14">
              We believe your honeymoon should be as unique as your love story. Every detail is crafted
              with romance in mind.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Romance Curated", desc: "Every package is designed by experts who understand the art of romance." },
              { icon: Shield, title: "Private & Exclusive", desc: "Private vehicles, private tables, private moments — just the two of you." },
              { icon: Gift, title: "Surprise Touches", desc: "Champagne on arrival, rose petal turndowns, and other thoughtful extras." },
              { icon: Star, title: "Flexible Planning", desc: "Customize every detail from accommodation to activities. Your honeymoon, your way." },
            ].map((item) => (
              <AnimatedSection key={item.title}>
                <div className="text-center p-6 rounded-xl bg-card ring-1 ring-foreground/10">
                  <div className="size-12 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="size-6 text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 ring-1 ring-rose-100 dark:ring-rose-900/30 text-center">
              <Quote className="size-10 text-rose-300/50 mx-auto mb-6" />
              <blockquote className="text-xl sm:text-2xl text-slate-700 dark:text-slate-200 font-medium italic leading-relaxed mb-6">
                &ldquo;Our honeymoon in Kenya was absolutely perfect. Every detail was thought of —
                from the champagne sundowner in the Mara to the private dinner on the beach in Diani.
                We will treasure these memories forever.&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-semibold text-foreground">James & Emily Chen</p>
              <p className="text-sm text-muted-foreground">Honeymoon Safari & Beach, 2025</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center p-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 ring-1 ring-slate-700 text-white">
              <Heart className="size-10 text-rose-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Ready to Plan Your Romantic Escape?</h2>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Let our honeymoon specialists craft the perfect itinerary for your love story.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors shadow-lg shadow-rose-500/25"
                >
                  <Heart className="size-4" />
                  Plan My Honeymoon
                </Link>
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all ring-1 ring-white/20"
                >
                  <Phone className="size-4" />
                  {COMPANY.phone}
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
