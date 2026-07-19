"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/layout/BookingModal";
import AnimatedSection from "@/components/AnimatedSection";
import { BEACH_DESTINATIONS, USD_TO_KES } from "@/lib/constants";
import { MapPin, Star, Waves, Palmtree, Anchor, Compass, Clock, Hotel } from "lucide-react";

const RESORTS = [
  { name: "Almanara Luxury Resort", location: "Diani Beach", rating: 4.9, type: "Ultra-Luxury" },
  { name: "Zuri Zanzibar", location: "Kendwa, Zanzibar", rating: 4.8, type: "Eco-Luxury" },
  { name: "Watamu Treehouse", location: "Watamu", rating: 4.7, type: "Boutique" },
  { name: "Lamu House", location: "Lamu Island", rating: 4.8, type: "Heritage Luxury" },
  { name: "Baraza Resort & Spa", location: "Diani Beach", rating: 4.9, type: "All-Inclusive" },
  { name: "Matemwe Retreat", location: "Zanzibar", rating: 4.7, type: "Boutique" },
];

export default function BeachHolidaysPage() {
  const [bookingTour, setBookingTour] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg"
          alt="Turquoise waters of a tropical beach"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-transparent to-sky-900/60" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <Waves className="size-4" />
              Coastal Paradise
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Beach{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent">
                Holidays
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Crystal-clear waters, powdery white sands, and world-class resorts along the Indian
              Ocean coastline of Kenya and Tanzania.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Your Dream{" "}
              <span className="text-sky-500">Coastal Escape</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From the legendary Diani Beach to the spice-scented shores of Zanzibar, the East
              African coastline offers some of the world&apos;s most beautiful beaches. Combine
              luxury accommodation with snorkeling, dhow cruises, and vibrant marine life for the
              ultimate tropical escape.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Beach Destinations Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
              Coastal Destinations
            </h2>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {BEACH_DESTINATIONS.map((beach, i) => (
              <AnimatedSection key={beach.id} delay={i * 0.05}>
                <div className="group flex flex-col bg-card rounded-2xl ring-1 ring-foreground/10 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={beach.image}
                      alt={beach.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                        <Star className="size-3 text-amber-400 fill-amber-400" />
                        {beach.rating}
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1 text-white/90 text-xs">
                        <MapPin className="size-3" />
                        {beach.location}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-lg font-bold text-foreground mb-2">{beach.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                      {beach.description}
                    </p>

                    <div className="space-y-1.5 mb-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Hotel className="size-3.5 text-sky-500" />
                        <span>{beach.accommodation}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-sky-500" />
                        <span>{beach.duration}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {beach.highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/30 text-[10px] text-sky-600 dark:text-sky-400"
                        >
                          <Compass className="size-2.5" />
                          {h}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-foreground">
                          ${beach.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-xs ml-1">/ person</span>
                        <div className="text-xs text-muted-foreground">
                          KES {(beach.price * USD_TO_KES).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setBookingTour(beach.name)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white"
                    >
                      <Waves className="size-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Resort Suggestions */}
      <section className="py-20 px-6 bg-gradient-to-b from-sky-50/50 to-transparent dark:from-sky-950/20">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Recommended <span className="text-sky-500">Resorts & Stays</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Handpicked accommodations for the ultimate beach experience.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RESORTS.map((resort, i) => (
              <AnimatedSection key={resort.name} delay={i * 0.05}>
                <div className="flex items-start gap-4 p-5 bg-card rounded-2xl ring-1 ring-foreground/10 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
                    <Palmtree className="size-6 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{resort.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3" />
                      {resort.location}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {resort.type}
                      </Badge>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500">
                        <Star className="size-3 fill-amber-500" />
                        {resort.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-cyan-900 via-sky-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.15),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <Anchor className="size-10 text-cyan-300 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Plan Your Beach Escape
            </h2>
            <p className="text-cyan-200/80 text-lg max-w-2xl mx-auto mb-8">
              Combine a wildlife safari with a beach holiday for the ultimate East African
              experience. We handle all transfers and logistics.
            </p>
            <Button
              onClick={() => setBookingTour("Beach Holiday Package")}
              className="bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-white px-8 h-11 shadow-lg shadow-cyan-500/25"
            >
              Start Planning
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <BookingModal
        open={bookingTour !== null}
        onOpenChange={(o) => { if (!o) setBookingTour(null); }}
      />
    </main>
  );
}
