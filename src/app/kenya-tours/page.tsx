import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Calendar, Star, Compass, Hotel, Check } from "lucide-react";
import { KENYA_DESTINATIONS_INFO, COMPANY } from "@/lib/constants";
import AnimatedSection from "@/components/AnimatedSection";
import KenyaTourInteractive from "./Interactive";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: `Kenya Tours & Safaris | ${COMPANY.name}`,
  description:
    "Discover Kenya's iconic wildlife destinations with Ready Set Go Tours & Travel. Explore Masai Mara, Amboseli, Samburu, and more on luxury guided safaris from Nairobi.",
  keywords: [
    "Kenya safari tours",
    "Masai Mara safari",
    "Amboseli National Park",
    "Kenya wildlife",
    "luxury safari Kenya",
    "Kenya tour operator",
    "Ready Set Go Tours",
  ],
  openGraph: {
    title: `Kenya Tours & Safaris | ${COMPANY.name}`,
    description:
      "Explore Kenya's world-renowned wildlife reserves. Luxury safaris with expert guides, stunning lodges, and unforgettable encounters.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kenya Tours & Safaris - Ready Set Go Tours",
      },
    ],
  },
  alternates: {
    canonical: "/kenya-tours",
  },
};

export default function KenyaToursPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Destinations", item: "/kenya-tours" },
        { name: "Kenya", item: "/kenya-tours" },
      ]} />
      <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/5e/d9/e7/5ed9e7896df91ef4ad2acdc3d37b0b21.jpg"
          alt="Kenya savanna safari landscape"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/30 to-orange-900/20" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <span className="inline-block px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-sm font-medium mb-6 backdrop-blur-sm">
              Expertly Curated Safari Experiences
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Explore{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-300 bg-clip-text text-transparent">
                Kenya
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-sky-100/80 max-w-2xl mx-auto leading-relaxed">
              From the rolling savannahs of the Masai Mara to the elephant herds beneath
              Kilimanjaro — discover why Kenya is Africa&apos;s most celebrated safari
              destination.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Kenya: The{" "}
              <span className="text-sky-500">Heart of Safari</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Kenya offers an unparalleled safari experience, from the world-famous Great Migration
              in the Masai Mara to the majestic elephant herds of Amboseli set against the
              snow-capped peak of Mount Kilimanjaro. Our expertly guided tours take you into the
              heart of East Africa&apos;s most iconic landscapes, where every moment promises a new
              encounter with the wild.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Kenya&apos;s Premier Destinations
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each destination offers a unique window into Kenya&apos;s extraordinary wildlife
                and landscapes.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-20">
            {KENYA_DESTINATIONS_INFO.map((dest, index) => (
              <AnimatedSection key={dest.name} delay={0.1}>
                <div
                  className={`flex flex-col gap-10 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } items-start`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2 relative group">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium">
                          <MapPin className="size-3" />
                          Kenya
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {dest.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {dest.description}
                    </p>

                    {/* Best Time */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
                      <Calendar className="size-5 text-sky-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                          Best Time to Visit
                        </p>
                        <p className="text-sm text-foreground mt-0.5">{dest.bestTime}</p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70 mb-3">
                        Highlights
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dest.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Star className="size-3.5 text-amber-500 mt-1 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Activities */}
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70 mb-3">
                        Activities
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dest.activities.map((a) => (
                          <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Compass className="size-3.5 text-orange-500 mt-1 shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Accommodation */}
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70 mb-3">
                        Recommended Accommodation
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dest.accommodation.map((acc) => (
                          <span
                            key={acc}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground"
                          >
                            <Hotel className="size-3" />
                            {acc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Book Button (client interactive part) */}
                    <KenyaTourInteractive tourName={dest.name} />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trip Planner CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,146,60,0.12),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Plan Your Kenya Adventure
            </h2>
            <p className="text-sky-200/80 text-lg max-w-2xl mx-auto mb-8">
              Let our expert consultants craft a bespoke Kenya safari tailored to your interests,
              budget, and travel dates. Every itinerary is unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <KenyaTourInteractive tourName="Custom Kenya Safari" isCTA />
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Contact Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
    </>
  );
}
