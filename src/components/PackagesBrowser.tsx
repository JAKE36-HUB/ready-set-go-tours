"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { PACKAGE_FILTERS, PLAN_SAFARI_ROUTE } from "@/lib/constants";
import { parseSeasonPricing, stripSeasonRates } from "@/lib/season-pricing";
import { SeasonPriceRows } from "@/components/SeasonPricing";
import { Clock, Bed, Utensils, Car, ArrowUpDown, ArrowRight } from "lucide-react";

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration", label: "Duration" },
  { value: "name", label: "Name" },
] as const;

const typeLabel: Record<string, string> = {
  safari: "Safari",
  group: "Group Safari",
  luxury: "Luxury",
  mountain: "Trek",
  beach: "Beach",
  cultural: "Cultural",
};

export interface PackageCard {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  price: number;
  duration: string;
  type: string;
  accommodation: string;
  meals: string;
  transport: string;
  activities: string[];
  highlights: string[];
  priceKES: number | null;
  notes?: string | null;
}

export default function PackagesBrowser({
  packages,
  initialType,
}: {
  packages: PackageCard[];
  initialType?: string;
}) {
  const [activeFilter, setActiveFilter] = useState(
    initialType ? initialType.charAt(0).toUpperCase() + initialType.slice(1) : "All"
  );
  const [sortBy, setSortBy] = useState<string>("price-asc");

  const enriched = useMemo(
    () =>
      packages.map((p) => ({
        ...p,
        season: parseSeasonPricing({
          notes: p.notes,
          description: p.description,
          price: p.price,
        }),
      })),
    [packages]
  );

  const filtered = useMemo(() => {
    let pkgs = [...enriched];

    if (activeFilter !== "All") {
      pkgs = pkgs.filter(
        (p) => p.type.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    switch (sortBy) {
      case "price-asc":
        pkgs.sort(
          (a, b) =>
            (a.season?.fromPrice ?? a.price) - (b.season?.fromPrice ?? b.price)
        );
        break;
      case "price-desc":
        pkgs.sort(
          (a, b) =>
            (b.season?.fromPrice ?? b.price) - (a.season?.fromPrice ?? a.price)
        );
        break;
      case "duration":
        pkgs.sort(
          (a, b) =>
            parseInt(a.duration) - parseInt(b.duration)
        );
        break;
      case "name":
        pkgs.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return pkgs;
  }, [activeFilter, sortBy, enriched]);

  return (
    <>
      {/* Filters & Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Filters Bar */}
          <AnimatedSection>
            <div className="flex flex-col gap-4 mb-10">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {PACKAGE_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                      activeFilter === f
                        ? "gradient-primary text-white border-transparent shadow-premium"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="size-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-card border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary"
                  aria-label="Sort packages"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </AnimatedSection>

          {/* Packages Grid */}
          <h2 className="sr-only">Safari and holiday packages</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg, i) => (
              <AnimatedSection key={pkg.id} delay={i * 0.05}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className="border-0 bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur hover:bg-background/90">
                        {typeLabel[pkg.type] || "Safari"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-2xl bg-[#06101C]/70 px-3 py-2 text-white ring-1 ring-white/15 backdrop-blur">
                      <span className="text-[10px] uppercase tracking-wider text-white/60 block">
                        {pkg.season?.hasComparison ? "From · low season" : "From"}
                      </span>
                      <span className="text-lg font-semibold leading-none">
                        ${(pkg.season?.fromPrice ?? pkg.price).toLocaleString()}
                        <span className="text-xs font-normal text-white/60"> /pp</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="mb-3 font-display text-xl font-normal leading-snug text-foreground">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-5 flex-1">
                      {stripSeasonRates(pkg.description)}
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3.5 shrink-0 text-accent" />
                        {pkg.duration}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Bed className="size-3.5 shrink-0 text-accent" />
                        <span className="line-clamp-1">{pkg.accommodation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Utensils className="size-3.5 shrink-0 text-accent" />
                        {pkg.meals}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Car className="size-3.5 shrink-0 text-accent" />
                        {pkg.transport}
                      </div>
                    </div>

                    <SeasonPriceRows pricing={pkg.season} className="mb-4" />

                    {pkg.priceKES && (
                      <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="text-[10px] uppercase tracking-wider">Citizen / Resident:</span>
                        <span className="font-semibold text-foreground">KES {pkg.priceKES.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex gap-3 border-t border-border pt-2">
                      <Link
                        href={`/holiday-packages/${pkg.slug}`}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
                      >
                        View Safari <ArrowRight className="size-4" />
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
              </AnimatedSection>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No packages found for this category. Try a different filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}