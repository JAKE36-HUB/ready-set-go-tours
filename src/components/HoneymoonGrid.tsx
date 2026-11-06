"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { USD_TO_KES, PLAN_SAFARI_ROUTE, honeymoonPriceSuffix, type HoneymoonPriceBasis } from "@/lib/constants";
import { Heart, MapPin, Clock, ArrowRight, Check, Sparkles } from "lucide-react";

const PdfItinerary = dynamic(() => import("@/components/PdfItinerary"), { ssr: false });

const typeDefs = [
  { key: "all", label: "All Packages", icon: Sparkles },
  { key: "safari-beach", label: "Safari & Beach", icon: ArrowRight },
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
  priceBasis?: HoneymoonPriceBasis;
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
      <section className="bg-gradient-to-b from-accent/5 to-transparent px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-2">
            {typeDefs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setSelected(t.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                    selected === t.key
                      ? "border-transparent bg-primary text-primary-foreground shadow-card"
                      : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground"
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
            <div className="text-center py-20 text-muted-foreground">
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
                    className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <div className="relative h-56 overflow-hidden sm:h-64">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-accent backdrop-blur">
                        <Heart className="size-3 fill-accent text-accent" />
                        Honeymoon
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display text-2xl font-normal text-white">{pkg.name}</h3>
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
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {pkg.description}
                      </p>

                      <div className="mb-1">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">From</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-semibold text-foreground">
                            ${pkg.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">{honeymoonPriceSuffix(pkg.priceBasis)}</span>
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Citizen</div>
                        <div className="text-sm font-semibold text-foreground">
                          KES {(pkg.priceKES ?? pkg.price * USD_TO_KES).toLocaleString()}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Highlights</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {pkg.highlights.map((h: string) => (
                            <div key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Heart className="mt-0.5 size-3.5 shrink-0 fill-accent text-accent" />
                              {h}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Included</h4>
                        <div className="grid grid-cols-2 gap-1.5">
                          {pkg.included.map((i: string) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Check className="size-3 shrink-0 text-accent" />
                              {i}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/honeymoon-packages/${pkg.slug}`}
                          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-medium text-foreground transition-all duration-300 hover:border-accent/40 hover:bg-accent/5"
                        >
                          View Safari <ArrowRight className="size-4" />
                        </Link>
                        <Link
                          href={PLAN_SAFARI_ROUTE}
                          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground transition-all duration-300 hover:bg-accent/90"
                        >
                          Design Our Honeymoon
                        </Link>
                      </div>
                      <div className="mt-3 text-center">
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
                          buttonLabel="Download itinerary PDF"
                          className="h-auto rounded-none bg-transparent p-0 text-xs font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent/80"
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