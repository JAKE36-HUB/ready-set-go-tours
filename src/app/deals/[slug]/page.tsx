"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { COMPANY, USD_TO_KES } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { TourPackageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { Tag, Clock, Users, Gift, Percent, Star, Shield, ChevronRight, Check, ArrowLeft, Calendar, Hotel, Utensils, MapPin, Phone } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const DEAL_ICONS: Record<string, React.ElementType> = {
  "early-bird": Clock,
  "last-minute": Clock,
  group: Users,
  seasonal: Star,
  combo: Gift,
  special: Star,
};

export default function DealDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getSupabase().from("deals").select("*").eq("slug", slug).single();
        if (data) setDeal({ ...data, originalPrice: (data as any).original_price, dealPrice: (data as any).deal_price, priceKES: (data as any).price_kes, validUntil: (data as any).valid_until });
      } catch {}
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    (async () => {
      try {
        const currentSlug = slug;
        const { data } = await getSupabase().from("deals").select("*").eq("featured", true).neq("slug", currentSlug).limit(3);
        if (data) setRelated(data.map((d: any) => ({ ...d, originalPrice: d.original_price, dealPrice: d.deal_price, priceKES: d.price_kes, validUntil: d.valid_until })));
      } catch {}
    })();
  }, [slug]);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </main>
  );
  if (!deal) notFound();

  const Icon = DEAL_ICONS[deal.type] || Tag;

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Deals", item: "/deals" },
        { name: deal.title, item: `/deals/${slug}` },
      ]} />
      <TourPackageJsonLd
        name={deal.title}
        description={deal.description.slice(0, 160)}
        image={deal.image}
        price={deal.dealPrice}
        duration={deal.duration}
        url={`/deals/${slug}`}
      />
      <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end justify-center overflow-hidden">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-10">
          <Link
            href="/deals"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Deals
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <Percent className="size-3" />
              {deal.discount}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full">
              <Icon className="size-3" />
              <span className="capitalize">{deal.type.replace("-", " ")}</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{deal.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              Valid {deal.validUntil}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {deal.duration}
            </span>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">${deal.dealPrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground line-through">${deal.originalPrice.toLocaleString()}</span>
            <span className="text-xs font-medium text-emerald-500">per person</span>
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Non-resident</div>
          <div className="text-xs text-muted-foreground">
            <span className="text-[10px] uppercase tracking-wider">Resident: </span>
            KES {(deal.priceKES ?? deal.dealPrice * USD_TO_KES).toLocaleString()}
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${COMPANY.whatsapp}?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(deal.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
            >
              Book This Deal
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-card ring-1 ring-foreground/10 hover:ring-emerald-500/30 text-foreground text-sm font-medium transition-all"
            >
              Enquire
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <AnimatedSection>
                <h2 className="text-2xl font-bold text-foreground mb-4">About This Deal</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{deal.description}</p>
              </AnimatedSection>

              {/* Highlights */}
              <AnimatedSection>
                <h2 className="text-2xl font-bold text-foreground mb-4">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {deal.highlights.map((h: any) => (
                    <div key={h} className="flex items-start gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5">
                      <Star className="size-5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-500/20" />
                      <span className="text-sm text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Itinerary */}
              <AnimatedSection>
                <h2 className="text-2xl font-bold text-foreground mb-4">Your Itinerary</h2>
                <div className="space-y-0">
                  {deal.itinerary.map((item: any, idx: number) => (
                    <div key={idx} className="relative flex gap-6 pb-8 last:pb-0">
                      {/* Timeline line */}
                      {idx < deal.itinerary.length - 1 && (
                        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-900" />
                      )}
                      {/* Timeline dot */}
                      <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        {idx + 1}
                      </div>
                      {/* Content */}
                      <div className="min-w-0 pt-1">
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">{item.day}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Details Card */}
              <AnimatedSection>
                <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6 space-y-5">
                  <h3 className="font-semibold text-foreground">Deal Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground">{deal.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hotel className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Accommodation</p>
                        <p className="text-sm text-muted-foreground">{deal.accommodation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Utensils className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Meals</p>
                        <p className="text-sm text-muted-foreground">{deal.meals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Promo Code</p>
                        <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{deal.code}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* What's Included */}
              <AnimatedSection>
                <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
                  <h3 className="font-semibold text-foreground mb-4">What&apos;s Included</h3>
                  <ul className="space-y-3">
                    {deal.included.map((item: any) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              {/* CTA */}
              <AnimatedSection>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 ring-1 ring-emerald-100 dark:ring-emerald-900/50 p-6 text-center">
                  <h3 className="font-semibold text-foreground mb-2">Ready to Book?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contact our team to secure this deal. Limited availability.
                  </p>
                  <div className="space-y-3">
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp}?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(deal.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
                    >
                      Book via WhatsApp
                    </a>
                    <a
                      href={`tel:${COMPANY.phone}`}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-card ring-1 ring-foreground/10 hover:ring-emerald-500/30 text-foreground text-sm font-medium transition-all"
                    >
                      <Phone className="size-4" />
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Related Deals */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-emerald-950/5">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-foreground mb-8">
              More{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Deals
              </span>{" "}
              You Might Like
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((related: any) => (
                <AnimatedSection key={related.id}>
                  <Link href={`/deals/${related.slug}`} className="group block rounded-xl overflow-hidden bg-card ring-1 ring-foreground/10 hover:ring-emerald-500/30 transition-all duration-500">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <Percent className="size-3" />
                        {related.discount}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-bold text-white">{related.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-bold text-foreground">${related.dealPrice.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground line-through">${related.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Non-resident</div>
                      <div className="text-[10px] text-muted-foreground mb-2">
                        <span className="uppercase">Resident: </span>
                        KES {(related.priceKES ?? related.dealPrice * USD_TO_KES).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{related.description}</p>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
