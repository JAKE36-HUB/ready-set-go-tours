import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { USD_TO_KES, PLAN_SAFARI_ROUTE, whatsappPackageLink } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { buildMetaDescription, tourMetaTitle } from "@/lib/seo";
import { TourPackageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { Tag, Clock, Users, Gift, Percent, Star, Shield, Check, ArrowLeft, Calendar, Hotel, Utensils, MessageCircle, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { PaymentPolicy } from "@/components/PaymentPolicy";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

function buildDescription(text: string): string {
  return buildMetaDescription(text, 158, "Get a free quote today.");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let row: { title: string; description: string; image: string | null; dealPrice: number } | null = null;
  try {
    const { data } = await getSupabase()
      .from("deals")
      .select("title, description, image, deal_price")
      .eq("slug", slug)
      .single();
    if (data) row = { ...data, dealPrice: data.deal_price };
  } catch {}
  if (!row) return {};

  const base = /safari/i.test(row.title) ? row.title : `${row.title} Safari`;
  const title = tourMetaTitle(slug, base, row.dealPrice);
  const description = buildDescription(row.description);
  const image = row.image ?? "/opengraph-image";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/deals/${slug}` },
    openGraph: {
      url: `https://www.readysetgosafaris.com/deals/${slug}`,
      title,
      description,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: row.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const DEAL_ICONS: Record<string, React.ElementType> = {
  "early-bird": Clock,
  "last-minute": Clock,
  group: Users,
  seasonal: Star,
  combo: Gift,
  special: Star,
};

interface DealRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  type: string;
  image: string | null;
  discount: string | null;
  duration: string;
  accommodation: string;
  meals: string;
  code: string;
  highlights: string[];
  itinerary: { day: string; description: string }[];
  included: string[];
  originalPrice: number;
  dealPrice: number;
  priceKES: number | null;
  validUntil: string | null;
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let deal: DealRow | null = null;
  let related: DealRow[] = [];
  try {
    const { data } = await getSupabase()
      .from("deals")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) deal = { ...data, originalPrice: data.original_price, dealPrice: data.deal_price, priceKES: data.price_kes, validUntil: data.valid_until };

    const { data: relatedData } = await getSupabase()
      .from("deals")
      .select("*")
      .eq("featured", true)
      .neq("slug", slug)
      .limit(3);
    if (relatedData) related = relatedData.map((d: Record<string, unknown>) => ({ ...d, originalPrice: d.original_price, dealPrice: d.deal_price, priceKES: d.price_kes, validUntil: d.valid_until }) as DealRow);
  } catch {}
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
        description={deal.description}
        image={deal.image ?? ""}
        price={deal.dealPrice}
        duration={deal.duration}
        url={`/deals/${slug}`}
      />
      <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end justify-center overflow-hidden">
        <Image
          src={deal.image ?? ""}
          alt={deal.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08130E]/85 via-[#08130E]/45 to-[#08130E]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08130E]/45 via-transparent to-[#08130E]/45" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10">
          <Link
            href="/deals"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Deals
          </Link>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4C9A3] px-3 py-1.5 text-xs font-bold text-[#1F4A38] backdrop-blur">
              <Percent className="size-3" />
              {deal.discount}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/70">
              <Icon className="size-3" />
              <span className="capitalize">{deal.type.replace("-", " ")}</span>
            </span>
          </div>
          <h1 className="mb-2 font-display text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-5xl">{deal.title}</h1>
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
      <section className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">${deal.dealPrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground line-through">${deal.originalPrice.toLocaleString()}</span>
            <span className="text-xs font-medium text-accent">per person</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Non-resident</div>
          <div className="text-xs text-muted-foreground">
            <span className="text-[10px] uppercase tracking-wider">Resident: </span>
            KES {(deal.priceKES ?? deal.dealPrice * USD_TO_KES).toLocaleString()}
          </div>
          <div className="flex items-center gap-3">
            <a
              href={whatsappPackageLink(deal.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-all hover:border-accent/40 hover:bg-accent/5"
            >
              <MessageCircle className="size-4 text-accent" />
              WhatsApp a Safari Expert
            </a>
            <Link
              href={PLAN_SAFARI_ROUTE}
              className="inline-flex h-11 items-center gap-2 rounded-full gradient-primary px-6 text-sm font-semibold text-white shadow-premium transition-all"
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
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <AnimatedSection>
                <h2 className="font-display text-2xl font-normal text-foreground mb-4">About This Deal</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{deal.description}</p>
              </AnimatedSection>

              {/* Highlights */}
              <AnimatedSection>
                <h2 className="font-display text-2xl font-normal text-foreground mb-4">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {deal.highlights.map((h: string) => (
                    <div key={h} className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
                      <Star className="mt-0.5 size-5 shrink-0 fill-accent/20 text-accent" />
                      <span className="text-sm text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Itinerary */}
              <AnimatedSection>
                <h2 className="font-display text-2xl font-normal text-foreground mb-4">Your Itinerary</h2>
                <div className="space-y-0">
                  {deal.itinerary.map((item: { day: string; description: string }, idx: number) => (
                    <div key={idx} className="relative flex gap-6 pb-8 last:pb-0">
                      {/* Timeline line */}
                      {idx < deal.itinerary.length - 1 && (
                        <div className="absolute bottom-0 left-[19px] top-10 w-0.5 bg-border" />
                      )}
                      {/* Timeline dot */}
                      <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent ring-1 ring-accent/20">
                        {idx + 1}
                      </div>
                      {/* Content */}
                      <div className="min-w-0 pt-1">
                        <p className="mb-1 text-sm font-semibold text-accent">{item.day}</p>
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
                <div className="space-y-5 rounded-2xl bg-card p-6 ring-1 ring-border">
                  <h3 className="font-semibold text-foreground">Deal Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Duration</p>
                        <p className="text-sm text-muted-foreground">{deal.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hotel className="size-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Accommodation</p>
                        <p className="text-sm text-muted-foreground">{deal.accommodation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Utensils className="size-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Meals</p>
                        <p className="text-sm text-muted-foreground">{deal.meals}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="size-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Promo Code</p>
                        <p className="font-mono text-sm font-bold text-accent">{deal.code}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* What's Included */}
              <AnimatedSection>
                <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                  <h3 className="font-semibold text-foreground mb-4">What&apos;s Included</h3>
                  <ul className="space-y-3">
                    {deal.included.map((item: string) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="size-4 text-accent shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <PaymentPolicy />

              {/* CTA */}
              <AnimatedSection>
                <div className="rounded-3xl gradient-primary p-8 text-center text-white shadow-premium">
                  <h3 className="mb-2 font-display text-xl font-normal">Want in on this deal?</h3>
                  <p className="mb-6 text-sm text-white/80">
                    Tell us your dates and we&apos;ll hold your spot at this price.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href={PLAN_SAFARI_ROUTE}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white font-semibold text-primary transition-all hover:bg-white/90"
                    >
                      Plan My Safari <ArrowRight className="size-4" />
                    </Link>
                    <a
                      href={whatsappPackageLink(deal.title)}
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

      {/* Related Deals */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">More Deals</span>
              <h2 className="mb-2 mt-3 font-display text-2xl font-normal text-foreground sm:text-3xl">
                You might also like
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((related: DealRow) => (
                <AnimatedSection key={related.id}>
                  <Link href={`/deals/${related.slug}`} className="group block h-full rounded-3xl overflow-hidden bg-card border border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={related.image ?? ""}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#E4C9A3] px-2.5 py-1 text-xs font-semibold text-[#1F4A38] backdrop-blur">
                        <Percent className="size-3" />
                        {related.discount}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-display text-lg font-normal leading-snug text-white">{related.title}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-semibold text-foreground">${related.dealPrice.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground line-through">${related.originalPrice.toLocaleString()}</span>
                        <span className="text-xs text-foreground">per person</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Non-resident</div>
                      <div className="text-[10px] text-muted-foreground mb-2">
                        <span className="uppercase">Citizen / Resident: </span>
                        <span className="font-semibold text-foreground">KES {(related.priceKES ?? related.dealPrice * USD_TO_KES).toLocaleString()}</span>
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
