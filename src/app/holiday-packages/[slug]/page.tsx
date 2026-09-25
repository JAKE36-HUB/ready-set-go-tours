import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPANY, PLAN_SAFARI_ROUTE, whatsappPackageLink } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { TourPackageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  Clock, Check, X, ArrowLeft,
  Hotel, Utensils, Car, Compass, MessageCircle, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { PaymentPolicy } from "@/components/PaymentPolicy";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

function buildDescription(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const cta = "Get a free quote today.";
  const maxMain = 135;
  const main = cleaned.slice(0, maxMain - 1).trimEnd() + "…";
  return `${main} ${cta}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let row: { name: string; description: string; image: string; price: number } | null = null;
  try {
    const { data } = await getSupabase()
      .from("tour_packages")
      .select("name, description, image, price")
      .eq("slug", slug)
      .single();
    if (data) row = data;
  } catch {}
  if (!row) return {};

  const base = /safari/i.test(row.name) ? row.name : `${row.name} Safari`;
  const title = `${base} from $${row.price} | ${COMPANY.name}`;
  const description = buildDescription(row.description);

  return {
    title,
    description,
    alternates: { canonical: `/holiday-packages/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: row.image, width: 1200, height: 630, alt: row.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [row.image],
    },
  };
}

const typeColors: Record<string, string> = {
  safari: "bg-white/90 text-stone-900 border-transparent",
  group: "bg-white/90 text-stone-900 border-transparent",
  luxury: "bg-white/90 text-stone-900 border-transparent",
  mountain: "bg-white/90 text-stone-900 border-transparent",
};

interface PackageRow {
  name: string;
  description: string;
  image: string;
  price: number;
  priceKES: number | null;
  duration: string;
  type: string;
  accommodation: string;
  meals: string;
  transport: string;
  highlights: string[];
  activities: string[];
  included: string[];
  excluded: string[];
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let pkg: PackageRow | null = null;
  try {
    const { data } = await getSupabase()
      .from("tour_packages")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) pkg = { ...data, priceKES: data.price_kes };
  } catch {}
  if (!pkg) notFound();

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
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-3 leading-tight">{pkg.name}</h1>
          <p className="text-sm text-white/60">{COMPANY.tagline}</p>
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
            <a
              href={whatsappPackageLink(pkg.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground text-sm font-medium transition-all"
            >
              <MessageCircle className="size-4 text-primary dark:text-burgundy-400" />
              WhatsApp a Safari Expert
            </a>
            <Link
              href={PLAN_SAFARI_ROUTE}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl gradient-primary text-white text-sm font-semibold shadow-premium hover:shadow-premium transition-all"
            >
              Plan This Safari <ArrowRight className="size-4" />
            </Link>
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
                <h2 className="font-display text-2xl font-medium text-foreground mb-4">About This Safari</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{pkg.description}</p>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="font-display text-2xl font-medium text-foreground mb-4">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h: string) => (
                    <div key={h} className="flex items-start gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5">
                      <Compass className="size-5 text-primary dark:text-burgundy-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="font-display text-2xl font-medium text-foreground mb-4">Activities</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.activities.map((a: string) => (
                    <span key={a} className="inline-flex items-center gap-1.5 text-sm bg-card ring-1 ring-foreground/10 text-foreground px-4 py-2 rounded-full">
                      <Compass className="size-4 text-primary dark:text-burgundy-400 shrink-0" />
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
                      <Clock className="size-5 text-primary dark:text-burgundy-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hotel className="size-5 text-primary dark:text-burgundy-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Accommodation</p>
                        <p className="text-sm text-muted-foreground">{pkg.accommodation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Utensils className="size-5 text-primary dark:text-burgundy-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Meals</p>
                        <p className="text-sm text-muted-foreground">{pkg.meals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Car className="size-5 text-primary dark:text-burgundy-400 shrink-0 mt-0.5" />
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
                    {pkg.included.map((item: string) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="size-4 text-primary dark:text-burgundy-400 shrink-0 mt-0.5" />
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
                    {pkg.excluded.map((item: string) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <X className="size-4 text-rose-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <PaymentPolicy />

              <AnimatedSection>
                <div className="rounded-3xl p-8 text-center gradient-primary text-white shadow-premium">
                  <h3 className="font-display text-xl font-medium mb-2">Ready to plan this safari?</h3>
                  <p className="text-sm text-white/80 mb-6">
                    Tell us your dates, and we&apos;ll shape this itinerary exactly around you. No templates, no pressure.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href={PLAN_SAFARI_ROUTE}
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white text-stone-900 font-semibold hover:bg-stone-100 transition-all"
                    >
                      Plan My Safari <ArrowRight className="size-4" />
                    </Link>
                    <a
                      href={whatsappPackageLink(pkg.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium ring-1 ring-white/25 transition-all"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp a Safari Expert
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
