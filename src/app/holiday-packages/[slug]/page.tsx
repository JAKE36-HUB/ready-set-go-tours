import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPANY, PLAN_SAFARI_ROUTE, whatsappPackageLink } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { buildMetaDescription, tourMetaTitle } from "@/lib/seo";
import { TourPackageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  Clock, Check, X, ArrowLeft, BadgeDollarSign,
  Hotel, Utensils, Car, Compass, MessageCircle, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { PaymentPolicy } from "@/components/PaymentPolicy";
import { OptionalActivitiesCard, PackageNotesCard } from "@/components/ItineraryTimeline";
import ItineraryAccordion from "@/components/ItineraryAccordion";
import PackageSectionNav from "@/components/PackageSectionNav";
import PackageStickyCTA from "@/components/PackageStickyCTA";
import SimilarPackages, { type SimilarPackage } from "@/components/SimilarPackages";
import type { ItineraryDay, OptionalActivity } from "@/lib/tour";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

function buildDescription(text: string): string {
  return buildMetaDescription(text, 158, "Get a free quote today.");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let row: { name: string; description: string; image: string; price: number; type: string } | null = null;
  try {
    const { data } = await getSupabase()
      .from("tour_packages")
      .select("name, description, image, price, type")
      .eq("slug", slug)
      .single();
    if (data) row = data;
  } catch {}
  if (!row) return {};

  const suffix = row.type === "beach" ? "Beach Holiday" : "Safari";
  const base = /safari|beach/i.test(row.name) ? row.name : `${row.name} ${suffix}`;
  const title = tourMetaTitle(slug, base, row.price);
  const description = buildDescription(row.description);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/holiday-packages/${slug}` },
    openGraph: {
      url: `https://www.readysetgosafaris.com/holiday-packages/${slug}`,
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
  safari: "bg-background/90 text-foreground border-transparent",
  group: "bg-background/90 text-foreground border-transparent",
  luxury: "bg-background/90 text-foreground border-transparent",
  mountain: "bg-background/90 text-foreground border-transparent",
  beach: "bg-background/90 text-foreground border-transparent",
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
  itinerary: ItineraryDay[];
  optionalActivities: OptionalActivity[];
  notes: string;
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
    if (data) pkg = {
      ...data,
      priceKES: data.price_kes,
      itinerary: data.itinerary || [],
      optionalActivities: data.optional_activities || [],
      notes: data.notes || "",
    };
  } catch {}
  if (!pkg) notFound();

  const noun = pkg.type === "beach" ? "Beach Holiday" : "Safari";

  // Rates & seasons live in the notes field. Pull them out so they can be shown
  // in a clearly visible callout instead of being buried in the small print.
  const noteSections = pkg.notes
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const ratesSection = noteSections.find((s) =>
    /^rates?\s*(&|and)?\s*seasons?/i.test(s)
  );
  const otherNotes = noteSections.filter((s) => s !== ratesSection).join("\n\n");
  const ratesLines = ratesSection
    ? ratesSection.split("\n").map((l) => l.trim()).filter(Boolean).slice(1)
    : [];

  const sections = [
    { id: "overview", label: "Overview" },
    ...(pkg.highlights.length ? [{ id: "highlights", label: "Highlights" }] : []),
    ...(pkg.activities.length ? [{ id: "activities", label: "Activities" }] : []),
    ...(pkg.itinerary.length ? [{ id: "itinerary", label: "Itinerary" }] : []),
    ...(pkg.included.length ? [{ id: "inclusions", label: "Inclusions" }] : []),
  ];

  let similar: SimilarPackage[] = [];
  try {
    const { data } = await getSupabase()
      .from("tour_packages")
      .select("name, slug, image, price, duration, description")
      .eq("type", pkg.type)
      .neq("slug", slug)
      .order("name")
      .limit(3);
    if (data) similar = data;
  } catch {}

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Holiday Packages", item: "/holiday-packages" },
        { name: pkg.name, item: `/holiday-packages/${slug}` },
      ]} />
      <TourPackageJsonLd
        name={pkg.name}
        description={pkg.description}
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
              {pkg.type === "group" ? "Group Safari" : pkg.type === "luxury" ? "Luxury" : pkg.type === "mountain" ? "Mountain" : pkg.type === "beach" ? "Beach Holiday" : "Safari"}
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/60 bg-white/10 px-3 py-1.5 rounded-full">
              <Clock className="size-3" />
              {pkg.duration}
            </span>
          </div>
          <h1 className="mb-3 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">{pkg.name}</h1>
          <p className="text-sm text-white/60">{COMPANY.tagline}</p>
        </div>
      </section>

      {/* Pricing Bar */}
      <section className="sticky top-0 z-30 border-b border-foreground/5 bg-background/90 backdrop-blur-xl">
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
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <MessageCircle className="size-4 text-primary" />
              WhatsApp a Safari Expert
            </a>
            <Link
              href={PLAN_SAFARI_ROUTE}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Plan This {noun} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <PackageSectionNav items={sections} />
      </section>
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main */}
            <div className="lg:col-span-2 space-y-12">
              <div id="overview" className="scroll-mt-28">
                <AnimatedSection>
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">About This {noun}</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">{pkg.description}</p>
                  {ratesLines.length > 0 && (
                    <div className="mt-6 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 shadow-sm">
                      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground mb-2">
                        <BadgeDollarSign className="size-5 text-primary shrink-0" />
                        Rates &amp; seasons
                      </h3>
                      {ratesLines.map((line, i) => (
                        <p key={i} className="text-sm text-foreground/90 leading-relaxed mb-1 last:mb-0">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </AnimatedSection>
              </div>

              <div id="highlights" className="scroll-mt-28">
                <AnimatedSection>
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">Highlights</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pkg.highlights.map((h: string) => (
                      <div key={h} className="flex items-start gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5">
                        <Compass className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{h}</span>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>

              <div id="activities" className="scroll-mt-28">
                <AnimatedSection>
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">Activities</h2>
                  <div className="flex flex-wrap gap-2">
                    {pkg.activities.map((a: string) => (
                      <span key={a} className="inline-flex items-center gap-1.5 text-sm bg-card ring-1 ring-foreground/10 text-foreground px-4 py-2 rounded-full">
                        <Compass className="size-4 text-primary shrink-0" />
                        {a}
                      </span>
                    ))}
                  </div>
                </AnimatedSection>
              </div>

              <div id="itinerary" className="scroll-mt-28">
                <ItineraryAccordion itinerary={pkg.itinerary} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AnimatedSection>
                <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6 space-y-5">
                  <h3 className="font-semibold text-foreground">Trip Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hotel className="size-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Accommodation</p>
                        <p className="text-sm text-muted-foreground">{pkg.accommodation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Utensils className="size-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Meals</p>
                        <p className="text-sm text-muted-foreground">{pkg.meals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Car className="size-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Transport</p>
                        <p className="text-sm text-muted-foreground">{pkg.transport}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <div id="inclusions" className="scroll-mt-28">
                <AnimatedSection>
                  <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
                    <h3 className="font-semibold text-foreground mb-4">What&apos;s Included</h3>
                    <ul className="space-y-3">
                      {pkg.included.map((item: string) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <Check className="size-4 text-primary shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              </div>

              <AnimatedSection>
                <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
                  <h3 className="font-semibold text-foreground mb-4">Not Included</h3>
                  <ul className="space-y-3">
                    {pkg.excluded.map((item: string) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <OptionalActivitiesCard activities={pkg.optionalActivities} />

              <PackageNotesCard notes={otherNotes} />

              <PaymentPolicy />

              <AnimatedSection>
                <div className="rounded-[1.75rem] p-8 text-center gradient-primary text-white shadow-premium">
                  <h3 className="mb-2 font-display text-xl font-normal">Ready to plan this {noun.toLowerCase()}?</h3>
                  <p className="mb-6 text-sm text-white/80">
                    Tell us your dates, and we&apos;ll shape this itinerary exactly around you. No templates, no pressure.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href={PLAN_SAFARI_ROUTE}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E8D5B5] font-semibold text-[#12251B] transition-all hover:bg-[#F1E2C8]"
                    >
                      Plan My {noun} <ArrowRight className="size-4" />
                    </Link>
                    <a
                      href={whatsappPackageLink(pkg.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white/10 text-sm font-medium text-white ring-1 ring-white/25 transition-all hover:bg-white/20"
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

      <SimilarPackages
        packages={similar}
        title={pkg.type === "beach" ? "Similar Beach Holidays" : "Similar Safaris"}
      />
    </main>

    <PackageStickyCTA
      name={pkg.name}
      price={pkg.price}
      priceKES={pkg.priceKES}
      noun={noun}
    />
    </>
  )
}
