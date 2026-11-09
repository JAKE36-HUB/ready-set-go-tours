import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { USD_TO_KES, PLAN_SAFARI_ROUTE, whatsappPackageLink, honeymoonPriceSuffix, type HoneymoonPriceBasis, type HoneymoonItineraryDay } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { buildMetaDescription, tourMetaTitle } from "@/lib/seo";
import { TourPackageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  Heart, Clock, MapPin, Check, ArrowLeft, Shield, Gift, Sparkles, MessageCircle, ArrowRight,
} from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection";
import { PaymentPolicy } from "@/components/PaymentPolicy";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

function buildDescription(text: string): string {
  return buildMetaDescription(text, 158, "Get a free quote today.");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let row: { name: string; description: string; image: string; price: number } | null = null;
  try {
    const { data } = await getSupabase()
      .from("honeymoon_packages")
      .select("name, description, image, price")
      .eq("slug", slug)
      .single();
    if (data) row = data;
  } catch {}
  if (!row) return {};

  const base = /safari/i.test(row.name) ? row.name : `${row.name} Safari`;
  const title = tourMetaTitle(slug, base, row.price);
  const description = buildDescription(row.description);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/honeymoon-packages/${slug}` },
    openGraph: {
      url: `https://www.readysetgosafaris.com/honeymoon-packages/${slug}`,
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

interface HoneymoonRow {
  name: string;
  description: string;
  image: string;
  price: number;
  priceKES: number | null;
  priceBasis?: HoneymoonPriceBasis;
  duration: string;
  accommodation: string;
  meals: string;
  transport: string;
  highlights: string[];
  activities: string[];
  included: string[];
  itinerary?: HoneymoonItineraryDay[];
}

export default async function HoneymoonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let pkg: HoneymoonRow | null = null;
  try {
    const { data } = await getSupabase()
      .from("honeymoon_packages")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) {
      const row = data as unknown as Record<string, unknown>;
      const basis = row.price_basis;
      const itin = row.itinerary;
      pkg = {
        ...(row as unknown as HoneymoonRow),
        priceKES: (row.price_kes as number | null) ?? null,
        priceBasis: basis === "person" ? "person" : "couple",
        itinerary: Array.isArray(itin) ? (itin as HoneymoonItineraryDay[]) : undefined,
      };
    }
  } catch {}
  if (!pkg) notFound();

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Honeymoon Packages", item: "/honeymoon-packages" },
        { name: pkg.name, item: `/honeymoon-packages/${slug}` },
      ]} />
      <TourPackageJsonLd
        name={pkg.name}
        description={pkg.description}
        image={pkg.image}
        price={pkg.price}
        duration={pkg.duration}
        url={`/honeymoon-packages/${slug}`}
      />
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#06101C]/85 via-[#06101C]/45 to-[#06101C]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06101C]/45 via-transparent to-[#06101C]/45" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10">
          <Link
            href="/honeymoon-packages"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Honeymoon Packages
          </Link>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/20 px-3 py-1 text-xs font-semibold text-[#F7CE84] backdrop-blur-sm">
              <Heart className="size-3 fill-current" />
              Honeymoon
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/70">
              <Clock className="size-3" />
              {pkg.duration}
            </span>
          </div>
          <h1 className="mb-3 font-display text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-5xl">{pkg.name}</h1>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Non-resident</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">${pkg.price.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">{honeymoonPriceSuffix(pkg.priceBasis)}</span>
              </div>
            </div>
            <div className="border-l border-border pl-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Citizen / Resident</span>
              <div className="text-sm font-semibold text-foreground">KES {(pkg.priceKES ?? pkg.price * USD_TO_KES).toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={whatsappPackageLink(pkg.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-all hover:border-accent/40 hover:bg-accent/5"
            >
              <MessageCircle className="size-4 text-accent" />
              WhatsApp a Safari Expert
            </a>
            <Link
              href={PLAN_SAFARI_ROUTE}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Design Our Honeymoon <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <AnimatedSection>
                <h2 className="font-display text-2xl font-normal text-foreground mb-4">About This Package</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{pkg.description}</p>
              </AnimatedSection>

              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <AnimatedSection>
                  <h2 className="font-display text-2xl font-normal text-foreground mb-4">Day-by-Day Itinerary</h2>
                  <ol className="space-y-3">
                    {pkg.itinerary.map((step, i) => (
                      <li
                        key={`${step.day}-${i}`}
                        className="flex gap-4 rounded-xl bg-card p-4 ring-1 ring-border sm:p-5"
                      >
                        <span
                          aria-hidden
                          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent ring-1 ring-accent/20"
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                            {step.day}
                          </p>
                          <h3 className="font-semibold text-foreground mt-0.5">{step.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </AnimatedSection>
              )}

              <AnimatedSection>
                <h2 className="font-display text-2xl font-normal text-foreground mb-4">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h: string) => (
                    <div key={h} className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
                      <Heart className="mt-0.5 size-5 shrink-0 fill-accent/20 text-accent" />
                      <span className="text-sm text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="font-display text-2xl font-normal text-foreground mb-4">Activities</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.activities.map((a: string) => (
                    <span key={a} className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-sm text-foreground ring-1 ring-border">
                      <Sparkles className="size-4 shrink-0 text-accent" />
                      {a}
                    </span>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            <div className="space-y-6">
              <AnimatedSection>
                <div className="space-y-5 rounded-2xl bg-card p-6 ring-1 ring-border">
                  <h3 className="font-semibold text-foreground">Trip Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 size-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Accommodation</p>
                        <p className="text-sm text-muted-foreground">{pkg.accommodation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Gift className="mt-0.5 size-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Meals</p>
                        <p className="text-sm text-muted-foreground">{pkg.meals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="mt-0.5 size-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Transport</p>
                        <p className="text-sm text-muted-foreground">{pkg.transport}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                  <h3 className="font-semibold text-foreground mb-4">What&apos;s Included</h3>
                  <ul className="space-y-3">
                    {pkg.included.map((item: string) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <PaymentPolicy />

              <AnimatedSection>
                <div className="rounded-3xl bg-[#06101C] p-8 text-center text-white ring-1 ring-white/10">
                  <Heart className="mx-auto mb-2 size-8 fill-accent/30 text-accent" />
                  <h3 className="mb-2 font-display text-xl font-normal">Design your honeymoon</h3>
                  <p className="mb-6 text-sm text-white/70">
                    Tell us your dates, and we&apos;ll shape the itinerary around you both.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href={PLAN_SAFARI_ROUTE}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent font-semibold text-white transition-all hover:bg-accent/90"
                    >
                      Plan My Safari <ArrowRight className="size-4" />
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
    </main>
    </>
  )
}
