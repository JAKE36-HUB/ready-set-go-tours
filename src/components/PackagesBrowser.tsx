"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { PACKAGE_FILTERS, PLAN_SAFARI_ROUTE } from "@/lib/constants";
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

  const filtered = useMemo(() => {
    let pkgs = [...packages];

    if (activeFilter !== "All") {
      pkgs = pkgs.filter(
        (p) => p.type.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    switch (sortBy) {
      case "price-asc":
        pkgs.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        pkgs.sort((a, b) => b.price - a.price);
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
  }, [activeFilter, sortBy, packages]);

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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg, i) => (
              <AnimatedSection key={pkg.id} delay={i * 0.05}>
                <div className="group relative flex flex-col h-full bg-card rounded-3xl overflow-hidden border border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
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
                      <Badge className="bg-white/90 backdrop-blur text-stone-900 text-xs font-semibold px-3 py-1 hover:bg-white/90 border-0">
                        {typeLabel[pkg.type] || "Safari"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-xl bg-stone-950/70 backdrop-blur px-3 py-2 text-white ring-1 ring-white/15">
                      <span className="text-[10px] uppercase tracking-wider text-white/60 block">From</span>
                      <span className="text-lg font-semibold leading-none">
                        ${pkg.price.toLocaleString()}
                        <span className="text-xs font-normal text-white/60"> /pp</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-display text-xl font-medium text-foreground mb-3 leading-snug">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-5 flex-1">
                      {pkg.description}
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3.5 text-primary dark:text-amber-400 shrink-0" />
                        {pkg.duration}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Bed className="size-3.5 text-primary dark:text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{pkg.accommodation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Utensils className="size-3.5 text-primary dark:text-amber-400 shrink-0" />
                        {pkg.meals}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Car className="size-3.5 text-primary dark:text-amber-400 shrink-0" />
                        {pkg.transport}
                      </div>
                    </div>

                    {pkg.priceKES && (
                      <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="text-[10px] uppercase tracking-wider">Citizen / Resident:</span>
                        <span className="font-semibold text-foreground">KES {pkg.priceKES.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2 border-t border-border">
                      <Link
                        href={`/holiday-packages/${pkg.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 text-foreground text-sm font-medium transition-all duration-300"
                      >
                        View Safari <ArrowRight className="size-4" />
                      </Link>
                      <Link
                        href={PLAN_SAFARI_ROUTE}
                        className="flex-1 inline-flex items-center justify-center h-11 rounded-xl gradient-primary text-white text-sm font-semibold shadow-premium hover:shadow-premium transition-all duration-300"
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