import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  Compass, Eye, Target, Heart, Shield, Globe, ArrowRight, Trees, Users, Star, HeadphonesIcon,
} from "lucide-react";
import { STATISTICS, COMPANY } from "@/lib/constants";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: `About Us | ${COMPANY.name}`,
  description: `Learn about ${COMPANY.name}, Kenya's premier luxury tour operator with over 15 years of experience crafting bespoke safari and travel experiences across East Africa.`,
  keywords: ["about Ready Set Go Tours", "Kenya tour operator", "safari company Nairobi", "East Africa travel experts"],
  openGraph: {
    title: `About Us | ${COMPANY.name}`,
    description: COMPANY.description,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Ready Set Go Tours & Travel",
      },
    ],
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
      <section className="relative py-32 px-6 bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedSection direction="none">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <Compass className="size-4" />
              East Africa Safari Experts
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              We Turn{" "}
              <span className="bg-gradient-to-r from-sky-300 to-amber-200 bg-clip-text text-transparent">
                Wanderlust
              </span>
              <br />into Safari
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
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
              <div className="h-full p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/20 dark:to-slate-900 ring-1 ring-sky-200 dark:ring-sky-800/30">
                <Eye className="size-10 text-sky-500 mb-5" />
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  To be East Africa&apos;s most trusted and transformative travel company — connecting
                  the world with the wild heart of Africa through authentic, responsible, and
                  unforgettable safari experiences.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="h-full p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 ring-1 ring-amber-200 dark:ring-amber-800/30">
                <Target className="size-10 text-amber-500 mb-5" />
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Mission</h2>
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
              <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sky-500 mb-3">
                <Star className="size-4" />
                What We Stand For
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                Our Core Values
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.08}>
                <div className="group relative h-full p-7 rounded-2xl bg-card ring-1 ring-foreground/10 hover:ring-sky-500/20 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center mb-5 shadow-lg shadow-sky-500/20">
                    <v.icon className="size-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Community & Conservation Impact */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ring-1 ring-emerald-500/20 mb-4">
                <Heart className="size-3.5" />
                Our Impact
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Travel That Gives Back
              </h2>
              <p className="text-emerald-200/60 mt-4 max-w-lg mx-auto">
                Every safari with us supports conservation, empowers communities, and protects
                Africa&apos;s wild places.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {IMPACT_STATS.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.08}>
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                  <s.icon className="size-8 text-emerald-400 mx-auto mb-3" />
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-sm text-emerald-200/60">{s.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="p-8 sm:p-10 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="text-5xl text-emerald-400/30 block mb-4">&ldquo;</span>
                <blockquote className="text-lg sm:text-xl text-emerald-100/80 leading-relaxed font-light italic mb-4">
                  Travel is the only thing you buy that makes you richer. But a safari — that stays
                  with you forever. The red dust, the golden light, the silence of the savannah at
                  dawn — it changes something deep inside you.
                </blockquote>
                <p className="text-sm text-emerald-300/50 font-medium tracking-wide">
                  &mdash; Ready Set Go Tours & Travel
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 px-6 bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">
              By the Numbers
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATISTICS.slice(0, 8).map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.05}>
                <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-sky-200/70">{stat.label}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Start Your Safari?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Let our experts craft a personalized East African adventure that fits your style,
              budget, and dreams.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all duration-200"
            >
              <HeadphonesIcon className="size-4" />
              Talk to an Expert
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
    </>
  );
}
