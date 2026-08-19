"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { USD_TO_KES } from "@/lib/constants";
import { Heart, Star, MapPin, Clock, Plane, ArrowRight, Check, Sparkles } from "lucide-react";

const PdfItinerary = dynamic(() => import("@/components/PdfItinerary"), { ssr: false });

const typeDefs = [
  { key: "all", label: "All Packages", icon: Sparkles },
  { key: "safari-beach", label: "Safari & Beach", icon: Plane },
  { key: "mountain", label: "Mountain Retreat", icon: MapPin },
  { key: "beach", label: "Beach Only", icon: Heart },
];

export interface HoneymoonCard {
  id: number;
  slug: string;
  name: string;
  image: string;
  description: string;
  price: number;
  priceKES: number | null;
  duration: string;
  accommodation: string;
  meals: string;
  transport: string;
  highlights: string[];
  activities: string[];
  included: string[];
}

export default function HoneymoonGrid({ packages }: { packages: HoneymoonCard[] }) {
  const [selected, setSelected] = useState<string>("all");

  const filtered = selected === "all"
    ? packages
    : packages.filter((p) => p.slug.includes(selected));

  return (
    <>
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
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              No packages match this filter yet.
            </div>
          ) : (
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
                          {pkg.highlights.map((h: string) => (
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
                          {pkg.included.map((i: string) => (
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
                          View Safari <ArrowRight className="size-4" />
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
          )}
        </div>
      </section>
    </>
  );
}
