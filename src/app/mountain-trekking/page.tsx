"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/layout/BookingModal";
import AnimatedSection from "@/components/AnimatedSection";
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
  const [bookingTour, setBookingTour] = useState<string | null>(null);

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
          src="https://i.pinimg.com/736x/61/e8/92/61e8923ec26b470919fa45a28c07e44c.jpg"
          alt="Hikers trekking on a mountain trail"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <Mountain className="size-4" />
              Summit Africa
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Mountain{" "}
              <span className="bg-gradient-to-r from-violet-300 to-slate-200 bg-clip-text text-transparent">
                Trekking
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
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
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Our Trekking{" "}
                <span className="bg-gradient-to-r from-violet-500 to-slate-500 bg-clip-text text-transparent">
                  Packages
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                {packages.length} mountain trek{packages.length !== 1 ? "s" : ""} available
              </p>
            </AnimatedSection>
            <AnimatedSection>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="size-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-violet-500 text-slate-700 dark:text-slate-300"
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
              <Compass className="size-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No mountain trekking packages available yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, idx) => (
                <AnimatedSection key={pkg.id} delay={idx * 0.1}>
                  <div className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div className="relative h-56 overflow-hidden">
                      <Image src={pkg.image} alt={pkg.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-violet-500 text-white text-xs font-semibold px-3 py-1 border-0">
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
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {pkg.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                          {pkg.duration}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Hotel className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                          <span className="truncate">{pkg.accommodation}</span>
                        </div>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mb-5">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                          {pkg.activities.slice(0, 4).map((a) => (
                            <span key={a} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                              {a}
                            </span>
                          ))}
                          {pkg.activities.length > 4 && (
                            <span className="text-xs text-violet-600 dark:text-violet-400 ml-5">
                              +{pkg.activities.length - 4} more
                            </span>
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
                        <Button
                          onClick={() => setBookingTour(pkg.name)}
                          className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-violet-500 to-slate-600 hover:from-violet-600 hover:to-slate-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Book Now
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

      <BookingModal
        open={bookingTour !== null}
        onOpenChange={(o) => { if (!o) setBookingTour(null); }}
      />
    </main>
  );
}
