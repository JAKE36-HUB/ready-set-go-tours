import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { Shield, Users, Gift, Star, MessageCircle, ArrowRight } from "lucide-react";
import DealsBrowser, { type DealCard } from "@/components/DealsBrowser";

export const revalidate = 60;

export default async function DealsPage() {
  let deals: DealCard[] = [];
  try {
    const { data } = await getSupabase()
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) deals = data.map((d: Record<string, unknown>) => ({
      ...d,
      originalPrice: d.original_price,
      dealPrice: d.deal_price,
      priceKES: d.price_kes,
      validUntil: d.valid_until,
    }) as DealCard);
  } catch {}

  return (
    <main className="min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Deals", item: "/deals" },
        ]}
      />
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/local/pin_6d3c9d0dfb8a372c96d1b1a4697e158f.jpg"
          alt="African savanna landscape"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08130E]/70 via-[#08130E]/45 to-[#08130E]/85" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection direction="none">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E4C9A3]">Deals & Offers</span>
            <h1 className="mb-5 mt-4 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
              Great safaris, at a smarter price
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/65">
              Exclusive offers on safaris, Mount Kenya adventures, beach holidays, and group packages.
              Don&apos;t miss your chance to experience East Africa for less.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <DealsBrowser deals={deals} />

      {/* Why Book With Us */}
      <section className="bg-secondary/40 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <h2 className="mb-4 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
              Why book a <span className="italic text-accent">deal</span> with us
            </h2>
            <p className="mx-auto mb-14 max-w-2xl text-center text-muted-foreground">
              Our deals are carefully curated to give you the best value without compromising on the
              quality and authenticity of your East African experience.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Best Price Guarantee", desc: "We match any legitimate price. If you find a better deal, we'll beat it." },
              { icon: Users, title: "Expert Local Guides", desc: "Every deal includes experienced, English-speaking guides with deep local knowledge." },
              { icon: Gift, title: "No Hidden Fees", desc: "The price you see is the price you pay. All taxes, park fees, and meals are included." },
              { icon: Star, title: "24/7 Support", desc: "From booking to return, our team is available around the clock to assist you." },
            ].map((item) => (
              <AnimatedSection key={item.title}>
                <div className="rounded-2xl bg-card p-6 text-center ring-1 ring-border">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent/10">
                    <item.icon className="size-6 text-accent" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="rounded-3xl gradient-primary p-10 text-center text-white shadow-premium">
            <h2 className="mb-3 font-display text-2xl font-normal">
              Don&apos;t Miss Out on These Deals
            </h2>
            <p className="mx-auto mb-6 max-w-md text-white/80">
              These offers are limited and subject to availability. Tell us which one you like and we&apos;ll hold it for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={PLAN_SAFARI_ROUTE}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-primary transition-all hover:bg-white/90"
              >
                Plan My Safari <ArrowRight className="size-4" />
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-6 text-sm font-medium text-white ring-1 ring-white/25 transition-all hover:bg-white/20"
              >
                <MessageCircle className="size-4" />
                WhatsApp a Safari Expert
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
