import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPANY, USD_TO_KES, PLAN_SAFARI_ROUTE, whatsappPackageLink } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
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
      .from("honeymoon_packages")
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
    alternates: { canonical: `/honeymoon-packages/${slug}` },
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

interface HoneymoonRow {
  name: string;
  description: string;
  image: string;
  price: number;
  priceKES: number | null;
  duration: string;
  accommodation: string;
  meals: string;
  transport: string;
  highlights: string[];
  activities: string[];
  included: string[];
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
    if (data) pkg = { ...data, priceKES: data.price_kes };
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
        description={pkg.description.slice(0, 160)}
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
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-3 leading-tight">{pkg.name}</h1>
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
            <a
              href={whatsappPackageLink(pkg.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-card border border-border hover:border-rose-300 dark:hover:border-rose-500/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-foreground text-sm font-medium transition-all"
            >
              <MessageCircle className="size-4 text-rose-500" />
              WhatsApp a Safari Expert
            </a>
            <Link
              href={PLAN_SAFARI_ROUTE}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white text-sm font-semibold shadow-lg shadow-rose-900/20 transition-all"
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
                <h2 className="font-display text-2xl font-medium text-foreground mb-4">About This Package</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{pkg.description}</p>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="font-display text-2xl font-medium text-foreground mb-4">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h: string) => (
                    <div key={h} className="flex items-start gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5">
                      <Heart className="size-5 text-rose-500 shrink-0 mt-0.5 fill-rose-500/20" />
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
                    {pkg.included.map((item: string) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="size-4 text-rose-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <PaymentPolicy />

              <AnimatedSection>
                <div className="rounded-3xl p-8 text-center bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-900/20">
                  <Heart className="size-8 text-white/90 mx-auto mb-2 fill-white/40" />
                  <h3 className="font-display text-xl font-medium mb-2">Design your honeymoon</h3>
                  <p className="text-sm text-white/80 mb-6">
                    Tell us your dates, and we&apos;ll shape the itinerary around you both.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href={PLAN_SAFARI_ROUTE}
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white text-rose-700 font-semibold hover:bg-rose-50 transition-all"
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
