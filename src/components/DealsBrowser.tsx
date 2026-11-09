"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { DealUrgency } from "@/components/DealUrgency";
import { USD_TO_KES, PLAN_SAFARI_ROUTE } from "@/lib/constants";
import { Tag, ArrowRight } from "lucide-react";

export interface DealCard {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  type: string;
  discount: string;
  validUntil: string;
  code: string;
  featured: boolean;
  dealPrice: number;
  originalPrice: number;
  priceKES: number | null;
  highlights: string[];
}

function DealCardView({ deal }: { deal: DealCard }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
          <Tag className="size-3" />
          {deal.discount}
        </div>
        <div className="absolute bottom-3 right-3 rounded-2xl bg-[#06101C]/70 px-3 py-2 text-white ring-1 ring-white/15 backdrop-blur">
          <span className="text-[10px] uppercase tracking-wider text-white/60 block">Was</span>
          <span className="text-sm font-semibold line-through text-white/60">${deal.originalPrice.toLocaleString()}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-xl font-normal leading-snug text-white">{deal.title}</h3>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="text-[10px] uppercase tracking-wider">Valid until</span>
          <span className="font-medium text-foreground">{deal.validUntil}</span>
          <span className="text-muted-foreground/40">|</span>
          <span className="capitalize">{deal.type.replace("-", " ")}</span>
        </div>
        <DealUrgency dealId={deal.id} validUntil={deal.validUntil} compact />

        <div className="mt-4 mb-1 flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-foreground">${deal.dealPrice.toLocaleString()}</span>
          <span className="text-sm font-medium text-primary">per person</span>
        </div>
        {deal.priceKES && (
          <div className="mb-4 text-xs text-muted-foreground">
            <span className="text-[10px] uppercase tracking-wider">Citizen / Resident: </span>
            <span className="font-semibold text-foreground">KES {(deal.priceKES ?? deal.dealPrice * USD_TO_KES).toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 mb-4">
          Use code: <span className="font-mono font-bold text-foreground">{deal.code}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-5 flex-1">{deal.description}</p>

        <div className="flex gap-3 border-t border-border pt-4">
          <Link
            href={`/deals/${deal.slug}`}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
          >
            View Deal <ArrowRight className="size-4" />
          </Link>
          <Link
            href={PLAN_SAFARI_ROUTE}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
          >
            Plan This Safari
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DealsBrowser({ deals }: { deals: DealCard[] }) {
  const [filter, setFilter] = useState<string>("all");

  const featuredDeals = deals.filter((d) => d.featured);
  const filteredDeals = filter === "all" ? deals : deals.filter((d) => d.type === filter);

  return (
    <>
      {/* Featured Deals */}
      {featuredDeals.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-14 max-w-2xl mx-auto">
                <span className="eyebrow">Top picks</span>
                <h2 className="mb-4 mt-4 font-display text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-5xl">
                  Featured offers
                </h2>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">
                  Hand-picked safaris at their best value right now — limited availability.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDeals.map((deal) => (
                <AnimatedSection key={deal.id}>
                  <DealCardView deal={deal} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Deals */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="eyebrow">Browse all</span>
              <h2 className="mb-4 mt-4 font-display text-3xl font-normal leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Every deal & offer
              </h2>
              <p className="text-base text-muted-foreground max-w-xl mx-auto">
                Planning ahead or booking last minute — there&apos;s a deal for every kind of traveller.
              </p>
            </div>
          </AnimatedSection>

          {/* Filters */}
          <AnimatedSection>
            <div className="flex flex-wrap gap-2 justify-center mb-12">
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
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                    filter === f.value
                      ? "border-transparent bg-primary text-primary-foreground shadow-card"
                      : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Deal Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <AnimatedSection key={deal.id}>
                <DealCardView deal={deal} />
              </AnimatedSection>
            ))}
          </div>

          {filteredDeals.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No deals in this category right now. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}