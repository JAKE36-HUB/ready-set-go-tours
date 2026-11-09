import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  Compass, Eye, Target, Heart, Shield, Globe, ArrowRight, Trees, Users, Star, HeadphonesIcon,
} from "lucide-react";
import { STATISTICS, COMPANY } from "@/lib/constants";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${COMPANY.name} — Kenya's premier luxury tour operator crafting bespoke safaris and travel experiences across East Africa.`,
  openGraph: {
    url: "https://www.readysetgosafaris.com/about",
    title: `About Us | ${COMPANY.name}`,
    description: COMPANY.description,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "About Ready Set Go Tours & Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us | ${COMPANY.name}`,
    description: COMPANY.description,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/about",
  },
};

const VALUES = [
  { icon: Shield, title: "Integrity", desc: "We operate with honesty and transparency in every booking, ensuring you get exactly what you pay for — no hidden fees, no surprises." },
  { icon: Heart, title: "Passion for Africa", desc: "Every itinerary is crafted with genuine love for East Africa's wildlife, landscapes, and cultures. We share what moves us." },
  { icon: Globe, title: "Sustainability", desc: "We are committed to responsible tourism — protecting ecosystems, supporting communities, and preserving Africa's wild heritage for generations to come." },
  { icon: Users, title: "Community First", desc: "We employ local guides, partner with community-run lodges, and reinvest in Maasai and Samburu communities across Kenya and Tanzania." },
]

const IMPACT_STATS = [
  { value: "12", label: "Conservation Projects", icon: Trees },
  { value: "200+", label: "Community Jobs Created", icon: Users },
  { value: "5%", label: "Profits to Conservation", icon: Heart },
  { value: "50K+", label: "Trees Planted", icon: Globe },
]

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "About", item: "/about" },
      ]} />
      <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#06101C] px-6 py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,166,35,0.18),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <AnimatedSection direction="none">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <Compass className="size-4" />
              East Africa Safari Experts
            </span>
            <h1 className="mb-6 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-7xl">
              We Turn <span className="italic text-[#F7CE84]">Wanderlust</span>
              <br />
              {" "}into Safari
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
              We craft unforgettable East African adventures — one
              thoughtfully planned itinerary at a time.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8">
            <AnimatedSection direction="left">
              <div className="h-full rounded-2xl bg-card p-8 ring-1 ring-border sm:p-10">
                <Eye className="mb-5 size-10 text-accent" />
                <h2 className="mb-4 font-display text-2xl font-normal text-foreground sm:text-3xl">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  To be East Africa&apos;s most trusted and transformative travel company — connecting
                  the world with the wild heart of Africa through authentic, responsible, and
                  unforgettable safari experiences.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="h-full rounded-2xl bg-secondary/50 p-8 ring-1 ring-border sm:p-10">
                <Target className="mb-5 size-10 text-accent" />
                <h2 className="mb-4 font-display text-2xl font-normal text-foreground sm:text-3xl">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  To craft bespoke safaris that immerse travelers in East Africa&apos;s breathtaking
                  landscapes, wildlife, and cultures — while driving positive change for
                  conservation, communities, and sustainable tourism.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
                <Star className="size-4" />
                What We Stand For
              </span>
              <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl lg:text-5xl">
                Our Core Values
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.08}>
                <div className="group relative h-full rounded-2xl bg-card p-7 ring-1 ring-border transition-all duration-300 hover:shadow-xl hover:ring-accent/20">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-accent/10">
                    <v.icon className="size-6 text-accent" />
                  </div>
                  <h3 className="mb-3 font-display text-lg font-normal text-foreground">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Community & Conservation Impact */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#06101C]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,166,35,0.16),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="mb-14 text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F7CE84] ring-1 ring-accent/20">
                <Heart className="size-3.5" />
                Our Impact
              </span>
              <h2 className="font-display text-3xl font-normal text-white sm:text-4xl lg:text-5xl">
                Travel That Gives Back
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-white/55">
                Every safari with us supports conservation, empowers communities, and protects
                Africa&apos;s wild places.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {IMPACT_STATS.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/10">
                  <s.icon className="mx-auto mb-3 size-8 text-accent" />
                  <div className="mb-1 font-display text-3xl font-normal text-white sm:text-4xl">{s.value}</div>
                  <div className="text-sm text-white/55">{s.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:p-10">
                <span className="mb-4 block font-display text-5xl text-accent/40">&ldquo;</span>
                <blockquote className="mb-4 font-display text-lg font-normal italic leading-relaxed text-white/75 sm:text-xl">
                  Travel is the only thing you buy that makes you richer. But a safari — that stays
                  with you forever. The red dust, the golden light, the silence of the savannah at
                  dawn — it changes something deep inside you.
                </blockquote>
                <p className="text-sm font-medium tracking-wide text-[#F7CE84]/70">
                  &mdash; Ready Set Go Tours & Travel
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-[#06101C] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <h2 className="mb-14 text-center font-display text-3xl font-normal text-white sm:text-4xl">
              By the Numbers
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATISTICS.slice(0, 8).map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.05}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                  <div className="mb-1 font-display text-3xl font-normal text-white sm:text-4xl">{stat.value}</div>
                  <div className="text-sm text-white/55">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="mb-4 font-display text-3xl font-normal text-foreground sm:text-4xl">
              Ready to Start Your Safari?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
              Let our experts craft a personalized East African adventure that fits your style,
              budget, and dreams.
            </p>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90"
            >
              <HeadphonesIcon className="size-4" />
              Get a Free Quote
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
    </>
  );
}
