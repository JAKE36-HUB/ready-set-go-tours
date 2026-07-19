"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/layout/BookingModal";
import AnimatedSection from "@/components/AnimatedSection";
import { TOUR_PACKAGES, PACKAGE_FILTERS, USD_TO_KES } from "@/lib/constants";
import {
  Clock,
  Hotel,
  Utensils,
  Car,
  Compass,
  DollarSign,
  ArrowUpDown,
  Eye,
  Check,
  X,
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration", label: "Duration" },
  { value: "name", label: "Name" },
] as const;

const typeColors: Record<string, string> = {
  safari: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  beach: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  luxury: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  mountain: "bg-violet-500/10 text-violet-600 border-violet-500/20",

  group: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  honeymoon: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

function HolidayPackagesContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type");
  const [activeFilter, setActiveFilter] = useState(initialType ? initialType.charAt(0).toUpperCase() + initialType.slice(1) : "All");
  const [sortBy, setSortBy] = useState<string>("price-asc");
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [bookingTour, setBookingTour] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let pkgs = [...TOUR_PACKAGES];

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
  }, [activeFilter, sortBy]);

  const toggleCompare = (id: number) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const compared = TOUR_PACKAGES.filter((p) => compareIds.includes(p.id));

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/6c/17/81/6c1781159da9a07da57937cc49282cf9.jpg"
          alt="Safari experience"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Holiday{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
                Packages
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Curated safari, beach, and adventure packages designed for every type of traveler.
            </p>
          </AnimatedSection>
        </div>
      </section>

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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeFilter === f
                        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Sort & Compare */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="size-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm bg-transparent border border-input rounded-lg px-3 py-1.5 outline-none focus:border-sky-500"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {compareIds.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCompare(true)}
                    className="border-sky-200 text-sky-600 hover:bg-sky-50"
                  >
                    <Eye className="size-3.5 mr-1.5" />
                    Compare ({compareIds.length})
                  </Button>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Packages Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg, i) => (
              <AnimatedSection key={pkg.id} delay={i * 0.05}>
                <div className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 h-full ${
                  pkg.type === "luxury"
                    ? "bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1"
                    : "bg-card ring-1 ring-foreground/10 hover:shadow-xl"
                }`}>
                  {/* Luxury ribbon */}
                  {pkg.type === "luxury" && (
                    <div className="absolute top-0 left-0 z-20">
                      <div className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-semibold px-4 py-1.5 rounded-br-xl shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        Curated
                      </div>
                    </div>
                  )}

                  {/* Compare checkbox */}
                  <button
                    onClick={() => toggleCompare(pkg.id)}
                    className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      pkg.type === "luxury" ? "top-10" : "top-3"
                    } ${
                      compareIds.includes(pkg.id)
                        ? "bg-sky-500 text-white"
                        : "bg-white/80 backdrop-blur-sm text-muted-foreground hover:bg-white"
                    }`}
                    title="Add to compare"
                  >
                    {compareIds.includes(pkg.id) ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </button>

                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className={`capitalize border backdrop-blur-sm ${
                          pkg.type === "luxury"
                            ? "bg-white/20 text-white border-white/30"
                            : typeColors[pkg.type] || ""
                        }`}
                      >
                        {pkg.type === "luxury" ? "Luxury" : pkg.type === "group" ? "Group" : pkg.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-24" />
                    <div className="absolute bottom-3 left-3">
                        <div>
                          <div className="text-[10px] text-white/50 uppercase tracking-wider">Non-resident</div>
                          <span className="text-2xl font-bold text-white drop-shadow-lg">
                            ${pkg.price.toLocaleString()}
                          </span>
                          <span className="text-white/70 text-xs ml-1">/ person</span>
                          {pkg.priceKES && (
                            <>
                              <div className="text-xs text-white/70 uppercase tracking-wider mt-1 font-semibold">Citizen</div>
                              <div className="text-white font-bold text-sm">KES {pkg.priceKES.toLocaleString()}</div>
                            </>
                          )}
                        </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`font-bold ${pkg.type === "luxury" ? "text-xl text-foreground" : "text-lg text-foreground"}`}>
                        {pkg.name}
                      </h3>
                    </div>
                    <p className={`text-sm mb-4 line-clamp-2 flex-1 ${
                      pkg.type === "luxury" ? "text-muted-foreground/80" : "text-muted-foreground"
                    }`}>
                      {pkg.description}
                    </p>

                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3.5 text-sky-500" />
                        {pkg.duration}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Hotel className="size-3.5 text-amber-500" />
                        <span className="line-clamp-1">{pkg.accommodation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Utensils className="size-3.5 text-orange-500" />
                        {pkg.meals}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Car className="size-3.5 text-emerald-500" />
                        {pkg.transport}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {pkg.activities.slice(0, 4).map((act) => (
                        <span
                          key={act}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                            pkg.type === "luxury"
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Compass className="size-2.5" />
                          {act}
                        </span>
                      ))}
                      {pkg.activities.length > 4 && (
                        <span className="text-[10px] text-muted-foreground/50">
                          +{pkg.activities.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-foreground/10">
                      <Link
                        href={`/holiday-packages/${pkg.slug}`}
                        className="flex-1 inline-flex items-center justify-center h-11 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-all"
                      >
                        View Details
                      </Link>
                      <Button
                        onClick={() => setBookingTour(pkg.name)}
                        variant="default"
                        size="sm"
                        className="flex-1"
                      >
                        {pkg.type === "luxury" ? "Inquire Now" : "Book Now"}
                      </Button>
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

      {/* Compare Modal */}
      {showCompare && compared.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background rounded-2xl ring-1 ring-foreground/10 max-w-4xl w-full max-h-[85vh] overflow-auto">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold">Compare Packages</h3>
              <button
                onClick={() => setShowCompare(false)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 text-muted-foreground font-medium w-36">Feature</th>
                    {compared.map((p) => (
                      <th key={p.id} className="text-left p-4 font-semibold min-w-[180px]">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Price", getValue: (p: typeof compared[0]) => `$${p.price.toLocaleString()}` },
                    { label: "Duration", getValue: (p: typeof compared[0]) => p.duration },
                    { label: "Type", getValue: (p: typeof compared[0]) => p.type },
                    { label: "Accommodation", getValue: (p: typeof compared[0]) => p.accommodation },
                    { label: "Meals", getValue: (p: typeof compared[0]) => p.meals },
                    { label: "Transport", getValue: (p: typeof compared[0]) => p.transport },
                    { label: "Activities", getValue: (p: typeof compared[0]) => p.activities.join(", ") },
                  ].map((row) => (
                    <tr key={row.label} className="border-b last:border-0">
                      <td className="p-4 text-muted-foreground font-medium">{row.label}</td>
                      {compared.map((p) => (
                        <td key={p.id} className="p-4 text-foreground">
                          {row.getValue(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4" />
                    {compared.map((p) => (
                      <td key={p.id} className="p-4">
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowCompare(false);
                            setBookingTour(p.name);
                          }}
                          className="bg-sky-500 hover:bg-sky-600 text-white"
                        >
                          Book Now
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <BookingModal
        open={bookingTour !== null}
        onOpenChange={(o) => { if (!o) setBookingTour(null); }}
      />
    </main>
  );
}

export default function HolidayPackagesPage() {
  return (
    <Suspense fallback={null}>
      <HolidayPackagesContent />
    </Suspense>
  );
}
