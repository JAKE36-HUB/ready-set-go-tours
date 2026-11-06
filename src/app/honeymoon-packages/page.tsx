import Image from "next/image";
import Link from "next/link";
import { Heart, Quote, Star, Shield, Gift, MessageCircle, ArrowRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import AnimatedSection from "@/components/AnimatedSection";
import HoneymoonGrid, { type HoneymoonCard } from "@/components/HoneymoonGrid";

export const revalidate = 3600;

export default async function HoneymoonPage() {
  let packages: HoneymoonCard[] = [];
  try {
    const { data } = await getSupabase()
      .from("honeymoon_packages")
      .select("*")
      .order("name");
    if (data) {
      packages = data.map((p: Record<string, unknown>) => ({
        ...p,
        priceKES: p.price_kes,
        priceBasis: p.price_basis === "person" ? "person" : "couple",
      })) as HoneymoonCard[];
    }
  } catch {}

  return (
    <main className="min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Tours", item: "/holiday-packages" },
          { name: "Honeymoon Packages", item: "/honeymoon-packages" },
        ]}
      />
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/local/pin_18e88ff822350751cb10a878ba3edc71.jpg"
          alt="Couple on dock overlooking overwater bungalows"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08130E]/65 via-[#08130E]/40 to-[#08130E]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08130E]/45 via-transparent to-[#08130E]/45" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <AnimatedSection>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E4C9A3]">Honeymoons</span>
            <h1 className="mb-5 mt-4 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
              Travel as a couple.{" "}
              <span className="block italic text-[#E4C9A3]">
                Not as tourists.
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-white/60">
              Handcrafted romantic escapes across East Africa. From private safari adventures to
              secluded beachfront villas — your dream honeymoon begins here.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <h2 className="sr-only">Honeymoon safari and beach packages</h2>
      <HoneymoonGrid packages={packages} />

      {/* Why Honeymoon With Us */}
      <section className="bg-secondary/40 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <h2 className="mb-4 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
              Why couple up for your{" "}
              <span className="italic text-accent">Honeymoon</span>{" "}
              with us
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14">
              We believe your honeymoon should be as unique as your love story. Every detail is crafted
              with romance in mind.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Romance Curated", desc: "Every package is designed by experts who understand the art of romance." },
              { icon: Shield, title: "Private & Exclusive", desc: "Private vehicles, private tables, private moments — just the two of you." },
              { icon: Gift, title: "Surprise Touches", desc: "Champagne on arrival, rose petal turndowns, and other thoughtful extras." },
              { icon: Star, title: "Flexible Planning", desc: "Customize every detail from accommodation to activities. Your honeymoon, your way." },
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

      {/* Testimonial */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="relative rounded-3xl bg-secondary/60 p-10 text-center ring-1 ring-border">
              <Quote className="mx-auto mb-6 size-10 text-accent/40" />
              <blockquote className="mb-6 font-display text-xl font-normal italic leading-relaxed text-foreground sm:text-2xl">
                &ldquo;Our honeymoon in Kenya was absolutely perfect. Every detail was thought of —
                from the champagne sundowner in the Mara to the private dinner on the beach in Diani.
                We will treasure these memories forever.&rdquo;
              </blockquote>
              <p className="font-semibold text-foreground">James & Emily Chen</p>
              <p className="text-sm text-muted-foreground">Honeymoon Safari & Beach, 2025</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="rounded-3xl bg-[#08130E] p-10 text-center text-white ring-1 ring-white/10">
              <Heart className="mx-auto mb-4 size-10 text-accent" />
              <h2 className="mb-3 font-display text-2xl font-normal">Ready to Plan Your Romantic Escape?</h2>
              <p className="mx-auto mb-6 max-w-md text-white/60">
                Tell us your dates and we&apos;ll shape the rest — candlelit dinners, sunrise drives and a beach to melt into.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={PLAN_SAFARI_ROUTE}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-all hover:bg-accent/90"
                >
                  Design Our Honeymoon <ArrowRight className="size-4" />
                </Link>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-6 text-sm font-medium text-white ring-1 ring-white/20 transition-all hover:bg-white/20"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp a Safari Expert
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
