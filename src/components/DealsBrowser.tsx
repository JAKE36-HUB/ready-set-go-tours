"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { USD_TO_KES } from "@/lib/constants";
import { Tag, Clock, Users, Gift, Percent, Star, Shield, ChevronRight, Sparkles, Zap } from "lucide-react";

const DEAL_ICONS: Record<string, React.ElementType> = {
  "early-bird": Clock,
  "last-minute": Zap,
  group: Users,
  seasonal: Sparkles,
  combo: Gift,
  special: Star,
};

export default function DealsBrowser({ deals }: { deals: any[] }) {
  const [filter, setFilter] = useState<string>("all");

  const featuredDeals = deals.filter((d) => d.featured);
  const filteredDeals = filter === "all" ? deals : deals.filter((d) => d.type === filter);

  return (
    <>
      {/* Featured Deals */}
      <section className="py-20 px-6 bg-gradient-to-b from-emerald-950/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="size-5 text-emerald-500" />
              <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Top Picks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
              Featured{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Offers
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDeals.map((deal) => {
              const Icon = DEAL_ICONS[deal.type] || Tag;
              return (
                <AnimatedSection key={deal.id}>
                  <Link href={`/deals/${deal.slug}`} className="group block rounded-2xl overflow-hidden bg-card ring-1 ring-foreground/10 hover:ring-emerald-500/30 transition-all duration-500">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        <Percent className="size-3" />
                        {deal.discount}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{deal.title}</h3>
                        <p className="text-sm text-white/70 line-clamp-1">{deal.description}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Icon className="size-4" />
                        <span className="capitalize">{deal.type.replace("-", " ")}</span>
                        <span className="text-muted-foreground/40">|</span>
                        <Clock className="size-4" />
                        <span>Valid {deal.validUntil}</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-foreground">${deal.dealPrice}</span>
                        <span className="text-lg text-muted-foreground line-through">${deal.originalPrice}</span>
                        <span className="text-sm font-semibold text-emerald-500">per person</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Non-resident</div>
                      <div className="text-xs text-muted-foreground mb-4">
                        <span className="text-[10px] uppercase tracking-wider">Resident: </span>
                        KES {(deal.priceKES ?? deal.dealPrice * USD_TO_KES).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 mb-4">
                        <Shield className="size-3.5 text-emerald-500" />
                        Use code: <span className="font-mono font-bold text-foreground">{deal.code}</span>
                      </div>
                      <ul className="space-y-1.5 mb-6">
                        {deal.highlights.slice(0, 3).map((h: any) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-emerald-500 text-white text-sm font-medium">
                        View Details <ChevronRight className="size-4" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Deals */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-2">
              <Percent className="size-5 text-sky-500" />
              <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">Browse All</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Every{" "}
              <span className="bg-gradient-to-r from-sky-500 to-blue-400 bg-clip-text text-transparent">
                Deal & Offer
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mb-10">
              Whether you&apos;re planning ahead or booking last minute, traveling solo or with family,
              there&apos;s a deal for every kind of adventurer.
            </p>
          </AnimatedSection>

          {/* Filters */}
          <AnimatedSection>
            <div className="flex flex-wrap gap-2 mb-12">
              {[
                { value: "all", label: "All Deals" },
                { value: "early-bird", label: "Early Bird" },
                { value: "last-minute", label: "Last Minute" },
                { value: "group", label: "Group" },
                { value: "seasonal", label: "Seasonal" },
                { value: "combo", label: "Combo" },
                { value: "special", label: "Special" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f.value
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Deal Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => {
              const Icon = DEAL_ICONS[deal.type] || Tag;
              return (
                <AnimatedSection key={deal.id}>
                  <Link href={`/deals/${deal.slug}`} className="group block rounded-xl overflow-hidden bg-card ring-1 ring-foreground/10 hover:ring-sky-500/30 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-sky-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <Percent className="size-3" />
                        {deal.discount}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-bold text-white">{deal.title}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Icon className="size-3.5" />
                        <span className="capitalize">{deal.type.replace("-", " ")}</span>
                        <span className="text-muted-foreground/40">|</span>
                        <Clock className="size-3.5" />
                        <span>{deal.validUntil}</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-foreground">${deal.dealPrice}</span>
                        <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Non-resident</div>
                      <div className="text-xs text-muted-foreground mb-3">
                        <span className="text-[10px] uppercase tracking-wider">Resident: </span>
                        KES {(deal.priceKES ?? deal.dealPrice * USD_TO_KES).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-1.5 mb-3">
                        <Shield className="size-3 text-sky-500" />
                        Code: <span className="font-mono font-bold text-foreground">{deal.code}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{deal.description}</p>
                      <div className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-sky-500 text-white text-sm font-medium">
                        View Details
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
