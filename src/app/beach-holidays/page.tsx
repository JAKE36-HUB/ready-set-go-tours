"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { openBookingModal } from "@/lib/booking-store";
import { BEACH_DESTINATIONS, USD_TO_KES } from "@/lib/constants";
import { MapPin, Star, Waves, Palmtree, Anchor, Compass, Clock, Hotel, ArrowRight } from "lucide-react";

// Beach destinations with a dedicated package page link straight there. The
// rest point at the filtered package listing so no internal link 404s.
const BEACH_PACKAGE_SLUGS = new Set(["diani-beach", "zanzibar-island"]);
const beachHref = (slug: string) =>
  BEACH_PACKAGE_SLUGS.has(slug) ? `/holiday-packages/${slug}` : "/holiday-packages?type=beach";

const RESORTS = [
  { name: "Almanara Luxury Resort", location: "Diani Beach", rating: 4.9, type: "Ultra-Luxury" },
  { name: "Zuri Zanzibar", location: "Kendwa, Zanzibar", rating: 4.8, type: "Eco-Luxury" },
  { name: "Watamu Treehouse", location: "Watamu", rating: 4.7, type: "Boutique" },
  { name: "Lamu House", location: "Lamu Island", rating: 4.8, type: "Heritage Luxury" },
  { name: "Baraza Resort & Spa", location: "Diani Beach", rating: 4.9, type: "All-Inclusive" },
  { name: "Matemwe Retreat", location: "Zanzibar", rating: 4.7, type: "Boutique" },
];

export default function BeachHolidaysPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/local/pin_ecf9c45a7a976f4151b88235e8396c06.jpg"
          alt="Turquoise waters of a tropical beach"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06101C]/65 via-[#06101C]/40 to-[#06101C]/85" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection direction="none">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <Waves className="size-4" />
              Coastal Paradise
            </span>
            <h1 className="mb-6 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-7xl">
              Beach <span className="italic text-[#F7CE84]">Holidays</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
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
            <h2 className="mb-6 font-display text-3xl font-normal text-foreground sm:text-4xl">
              Your Dream <span className="italic text-accent">Coastal Escape</span>
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
            <h2 className="mb-12 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
              Coastal Destinations
            </h2>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {BEACH_DESTINATIONS.map((beach, i) => (
              <AnimatedSection key={beach.id} delay={i * 0.05}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-all duration-300 hover:shadow-xl">
                  {/* Image */}
                  <Link href={beachHref(beach.slug)} className="relative aspect-[4/3] overflow-hidden block">
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
                        <Star className="size-3 fill-accent text-accent" />
                        {beach.rating}
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1 text-white/90 text-xs">
                        <MapPin className="size-3" />
                        {beach.location}
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      <Link href={beachHref(beach.slug)} className="transition-colors hover:text-accent">
                        {beach.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                      {beach.description}
                    </p>

                    <div className="space-y-1.5 mb-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Hotel className="size-3.5 text-accent" />
                        <span>{beach.accommodation}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-accent" />
                        <span>{beach.duration}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {beach.highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent"
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

                    <div className="space-y-2">
                      <Link
                        href={beachHref(beach.slug)}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                      >
                        View Details
                        <ArrowRight className="size-4" />
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => openBookingModal(beach.name)}
                        className="w-full h-10"
                      >
                        <Waves className="size-4 mr-2" />
                        Get a Free Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Resort Suggestions */}
      <section className="bg-secondary/40 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-display text-3xl font-normal text-foreground sm:text-4xl">
                Recommended <span className="italic text-accent">Resorts &amp; Stays</span>
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Handpicked accommodations for the ultimate beach experience.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RESORTS.map((resort, i) => (
              <AnimatedSection key={resort.name} delay={i * 0.05}>
                <div className="flex items-start gap-4 rounded-2xl bg-card p-5 ring-1 ring-border transition-shadow hover:shadow-lg">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Palmtree className="size-6 text-accent" />
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
                      <span className="flex items-center gap-0.5 text-xs text-accent">
                        <Star className="size-3 fill-accent" />
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
      <section className="relative overflow-hidden bg-[#06101C] px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,166,35,0.18),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <Anchor className="mx-auto mb-4 size-10 text-accent" />
            <h2 className="mb-4 font-display text-3xl font-normal text-white sm:text-4xl">
              Plan Your Beach Escape
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/60">
              Combine a wildlife safari with a beach holiday for the ultimate East African
              experience. We handle all transfers and logistics.
            </p>
            <Button
              onClick={() => openBookingModal("Beach Holiday Package")}
              className="h-11 bg-accent px-8 text-white shadow-lg shadow-accent/20 hover:bg-accent/90"
            >
              Get a Free Quote
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
