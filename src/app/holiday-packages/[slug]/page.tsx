"use client"

import { useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { TOUR_PACKAGES, COMPANY } from "@/lib/constants"
import { TourPackageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd"
import {
  Clock, Users, MapPin, Star, Check, X, ArrowLeft,
  Hotel, Utensils, Car, Compass, Shield, MessageCircle, Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingModal } from "@/components/layout/BookingModal"
import AnimatedSection from "@/components/AnimatedSection"

const typeColors: Record<string, string> = {
  safari: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  group: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  luxury: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  mountain: "bg-violet-500/15 text-violet-300 border-violet-500/30",
}

export default function PackageDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const pkg = TOUR_PACKAGES.find((p) => p.slug === slug)
  if (!pkg) notFound()

  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Holiday Packages", item: "/holiday-packages" },
        { name: pkg.name, item: `/holiday-packages/${slug}` },
      ]} />
      <TourPackageJsonLd
        name={pkg.name}
        description={pkg.description.slice(0, 160)}
        image={pkg.image}
        price={pkg.price}
        duration={pkg.duration}
        url={`/holiday-packages/${slug}`}
      />
      <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end justify-center overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-10">
          <Link
            href="/holiday-packages"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Packages
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <Badge className={`capitalize text-xs font-semibold px-3 py-1 border ${typeColors[pkg.type] || "bg-white/10 text-white"}`}>
              {pkg.type === "group" ? "Group Safari" : pkg.type === "luxury" ? "Luxury" : pkg.type === "mountain" ? "Mountain" : "Safari"}
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/60 bg-white/10 px-3 py-1.5 rounded-full">
              <Clock className="size-3" />
              {pkg.duration}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">{pkg.name}</h1>
          <div className="flex flex-wrap items-center gap-1 text-sm text-white/50">
            <span>Scenic game drive through the wilderness</span>
          </div>
        </div>
      </section>

      {/* Pricing Bar */}
      <section className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Non-resident</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">${pkg.price.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">/ person</span>
              </div>
            </div>
            {pkg.priceKES && (
              <div className="pl-3 border-l border-foreground/10">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Citizen / Resident</span>
                <div className="text-sm font-semibold text-foreground">KES {pkg.priceKES.toLocaleString()}</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setBookingOpen(true)}
              className="h-10 px-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold shadow-lg"
            >
              Reserve Now
            </Button>
            <a
              href={`https://wa.me/${COMPANY.whatsapp}?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(pkg.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-foreground text-sm font-medium transition-all ring-1 ring-foreground/10"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main */}
            <div className="lg:col-span-2 space-y-12">
              <AnimatedSection>
                <h2 className="text-2xl font-bold text-foreground mb-4">About This Safari</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{pkg.description}</p>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="text-2xl font-bold text-foreground mb-4">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5">
                      <Star className="size-5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-500/20" />
                      <span className="text-sm text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="text-2xl font-bold text-foreground mb-4">Activities</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.activities.map((a) => (
                    <span key={a} className="inline-flex items-center gap-1.5 text-sm bg-card ring-1 ring-foreground/10 text-foreground px-4 py-2 rounded-full">
                      <Compass className="size-4 text-emerald-500 shrink-0" />
                      {a}
                    </span>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AnimatedSection>
                <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6 space-y-5">
                  <h3 className="font-semibold text-foreground">Trip Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hotel className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Accommodation</p>
                        <p className="text-sm text-muted-foreground">{pkg.accommodation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Utensils className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Meals</p>
                        <p className="text-sm text-muted-foreground">{pkg.meals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Car className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Transport</p>
                        <p className="text-sm text-muted-foreground">{pkg.transport}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
                  <h3 className="font-semibold text-foreground mb-4">What&apos;s Included</h3>
                  <ul className="space-y-3">
                    {pkg.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
                  <h3 className="font-semibold text-foreground mb-4">Not Included</h3>
                  <ul className="space-y-3">
                    {pkg.excluded.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <X className="size-4 text-rose-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 ring-1 ring-emerald-100 dark:ring-emerald-900/50 p-6 text-center">
                  <h3 className="font-semibold text-foreground mb-2">Ready to Book?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Reserve your spot now. Group joining safaris fill up fast!
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setBookingOpen(true)}
                      className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg"
                    >
                      Reserve Now
                    </Button>
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp}?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(pkg.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-card ring-1 ring-foreground/10 hover:ring-emerald-500/30 text-foreground text-sm font-medium transition-all"
                    >
                      <MessageCircle className="size-4" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialPackage={pkg.name}
      />
    </main>
    </>
  )
}
