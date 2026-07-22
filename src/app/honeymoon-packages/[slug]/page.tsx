"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { COMPANY, USD_TO_KES } from "@/lib/constants"
import { getSupabase } from "@/lib/supabase"
import {
  Heart, Star, Clock, MapPin, Check, ArrowLeft, Shield, Gift, Sparkles, MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/layout/BookingModal"
import AnimatedSection from "@/components/AnimatedSection"

export default function HoneymoonDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getSupabase().from("honeymoon_packages").select("*").eq("slug", slug).single();
        if (data) setPkg({ ...data, priceKES: (data as any).price_kes });
      } catch {}
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
    </main>
  );
  if (!pkg) notFound();

  return (
    <main className="min-h-screen">
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
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/40 via-transparent to-rose-950/40" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-10">
          <Link
            href="/honeymoon-packages"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Honeymoon Packages
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-rose-500/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/30">
              <Heart className="size-3 fill-rose-400" />
              Honeymoon
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/60 bg-white/10 px-3 py-1.5 rounded-full">
              <Clock className="size-3" />
              {pkg.duration}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">{pkg.name}</h1>
        </div>
      </section>

      <section className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Non-resident</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">${pkg.price.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">/ couple</span>
              </div>
            </div>
            <div className="pl-3 border-l border-foreground/10">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Citizen / Resident</span>
              <div className="text-sm font-semibold text-foreground">KES {(pkg.priceKES ?? pkg.price * USD_TO_KES).toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setBookingOpen(true)}
              className="h-10 px-5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-semibold shadow-lg"
            >
              Book Now
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

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <AnimatedSection>
                <h2 className="text-2xl font-bold text-foreground mb-4">About This Package</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{pkg.description}</p>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="text-2xl font-bold text-foreground mb-4">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h: any) => (
                    <div key={h} className="flex items-start gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5">
                      <Star className="size-5 text-rose-500 shrink-0 mt-0.5 fill-rose-500/20" />
                      <span className="text-sm text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="text-2xl font-bold text-foreground mb-4">Activities</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.activities.map((a: any) => (
                    <span key={a} className="inline-flex items-center gap-1.5 text-sm bg-card ring-1 ring-foreground/10 text-foreground px-4 py-2 rounded-full">
                      <Sparkles className="size-4 text-rose-500 shrink-0" />
                      {a}
                    </span>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            <div className="space-y-6">
              <AnimatedSection>
                <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6 space-y-5">
                  <h3 className="font-semibold text-foreground">Trip Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Accommodation</p>
                        <p className="text-sm text-muted-foreground">{pkg.accommodation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Gift className="size-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Meals</p>
                        <p className="text-sm text-muted-foreground">{pkg.meals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="size-5 text-rose-500 shrink-0 mt-0.5" />
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
                    {pkg.included.map((item: any) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 ring-1 ring-rose-100 dark:ring-rose-900/50 p-6 text-center">
                  <Heart className="size-8 text-rose-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground mb-2">Plan Your Honeymoon</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Reserve your romantic escape now.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setBookingOpen(true)}
                      className="w-full h-11 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold shadow-lg"
                    >
                      Book Now
                    </Button>
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp}?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(pkg.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-card ring-1 ring-foreground/10 hover:ring-rose-500/30 text-foreground text-sm font-medium transition-all"
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
  )
}
