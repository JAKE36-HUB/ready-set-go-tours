import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Calendar, Star, Compass, Hotel, Check } from "lucide-react";
import { KENYA_DESTINATIONS_INFO, COMPANY } from "@/lib/constants";
import AnimatedSection from "@/components/AnimatedSection";
import KenyaTourInteractive from "./Interactive";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Kenya Tours & Safaris",
  description:
    "Discover Kenya's iconic wildlife destinations with Ready Set Go Tours & Travel. Masai Mara, Amboseli, Samburu and more on luxury guided safaris from Nairobi.",
  openGraph: {
    url: "https://www.readysetgosafaris.com/kenya-tours",
    title: `Kenya Tours & Safaris | ${COMPANY.name}`,
    description:
      "Explore Kenya's world-renowned wildlife reserves. Luxury safaris with expert guides, stunning lodges, and unforgettable encounters.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Kenya Tours & Safaris - Ready Set Go Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Kenya Tours & Safaris | ${COMPANY.name}`,
    description: "Explore Kenya's world-renowned wildlife reserves. Luxury safaris with expert guides, stunning lodges, and unforgettable encounters.",
    images: ["/opengraph-image"],
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
          src="/images/local/pin_5ed9e7896df91ef4ad2acdc3d37b0b21.jpg"
          alt="Kenya savanna safari landscape"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08130E]/65 via-[#08130E]/40 to-[#08130E]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08130E]/50 via-transparent to-[#08130E]/50" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection direction="none">
            <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.24em] text-[#E4C9A3]">
              Expertly Curated Safari Experiences
            </span>
            <h1 className="mb-6 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-7xl">
              Explore{" "}
              <span className="italic text-[#E4C9A3]">Kenya</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
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
            <h2 className="mb-6 font-display text-3xl font-normal text-foreground sm:text-4xl">
              Kenya: The <span className="italic text-accent">Heart of Safari</span>
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
              <h2 className="mb-4 font-display text-3xl font-normal text-foreground sm:text-4xl">
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
                    <h3 className="font-display text-2xl font-normal text-foreground sm:text-3xl">
                      {dest.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {dest.description}
                    </p>

                    {/* Best Time */}
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/50 p-4">
                      <Calendar className="mt-0.5 size-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
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
                            <Star className="mt-1 size-3.5 shrink-0 text-accent" />
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
                            <Compass className="mt-1 size-3.5 shrink-0 text-accent" />
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
      <section className="relative overflow-hidden bg-[#08130E] px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(184,100,58,0.18),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <h2 className="mb-4 font-display text-3xl font-normal text-white sm:text-4xl">
              Plan Your Kenya Adventure
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/60">
              Let our expert consultants craft a bespoke Kenya safari tailored to your interests,
              budget, and travel dates. Every itinerary is unique.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <KenyaTourInteractive tourName="Custom Kenya Safari" isCTA />
              <a
                href="/contact"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
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
