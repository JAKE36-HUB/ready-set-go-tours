"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { openBookingModal } from "@/lib/booking-store";
import { TOUR_PACKAGES, USD_TO_KES } from "@/lib/constants";
import { Clock, Hotel, Check, ArrowRight, Mountain, Compass, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration", label: "Duration" },
  { value: "name", label: "Name" },
] as const;

export default function MountainTrekkingPage() {
  const [sortBy, setSortBy] = useState<string>("price-asc");

  const packages = [...TOUR_PACKAGES.filter((p) => p.type === "mountain")].sort((a, b) => {
    switch (sortBy) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "duration": return parseInt(a.duration) - parseInt(b.duration);
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/local/pin_61e8923ec26b470919fa45a28c07e44c.jpg"
          alt="Hikers trekking on a mountain trail"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08130E]/65 via-[#08130E]/40 to-[#08130E]/85" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection direction="none">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <Mountain className="size-4" />
              Summit Africa
            </span>
            <h1 className="mb-6 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-7xl">
              Mountain <span className="italic text-[#E4C9A3]">Trekking</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
              Conquer Africa&apos;s highest peaks with expert guides. From Mount Kenya to Kilimanjaro,
              our treks deliver adventure, endurance, and breathtaking summit views.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <AnimatedSection>
              <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl">
                Our Trekking <span className="italic text-accent">Packages</span>
              </h2>
              <p className="mt-2 text-muted-foreground">
                {packages.length} mountain trek{packages.length !== 1 ? "s" : ""} available
              </p>
            </AnimatedSection>
            <AnimatedSection>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="size-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-border bg-transparent px-3 py-1.5 text-sm text-foreground outline-none focus:border-accent"
                  aria-label="Sort mountain treks"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </AnimatedSection>
          </div>

          {/* Card Grid */}
          {packages.length === 0 ? (
            <div className="text-center py-20">
              <Compass className="mx-auto mb-4 size-16 text-muted-foreground/40" />
              <p className="text-lg text-muted-foreground">No mountain trekking packages available yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, idx) => (
                <AnimatedSection key={pkg.id} delay={idx * 0.1}>
                  <div className="group relative overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative h-56 overflow-hidden">
                      <Image src={pkg.image} alt={pkg.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08130E]/70 to-transparent" />
                      <div className="absolute left-3 top-3">
                        <Badge className="rounded-full border-0 bg-[#E4C9A3] px-3 py-1 text-xs font-semibold text-[#1F4A38]">
                          Mountain Trek
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-white">
                          <div className="text-[10px] text-white/50 uppercase tracking-wider">Non-resident</div>
                          <span className="text-3xl font-bold">${pkg.price.toLocaleString()}</span>
                          <span className="text-sm text-white/70 ml-1">/ person</span>
                          <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">Resident</div>
                          <div className="text-white/60 text-xs">KES {(pkg.priceKES ?? pkg.price * USD_TO_KES).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-3 text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                        {pkg.name}
                      </h3>
                      <div className="mb-4 grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="size-3.5 shrink-0 text-accent" />
                          {pkg.duration}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Hotel className="size-3.5 shrink-0 text-accent" />
                          <span className="truncate">{pkg.accommodation}</span>
                        </div>
                      </div>
                      <div className="mb-5 border-t border-border pt-4">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                          {pkg.activities.slice(0, 4).map((a) => (
                            <span key={a} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Check className="size-3 shrink-0 text-accent" />
                              {a}
                            </span>
                          ))}
                          {pkg.activities.length > 4 && (
                            <span className="ml-5 text-xs text-accent">
                              +{pkg.activities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/holiday-packages/${pkg.slug}`}
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-secondary text-sm font-medium text-foreground transition-all duration-300 hover:bg-secondary/70"
                        >
                          View Safari <ArrowRight className="size-4" />
                        </Link>
                        <Button
                          onClick={() => openBookingModal(pkg.name)}
                          className="h-11 flex-1 border-0 bg-primary text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
                        >
                          Get a Free Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
