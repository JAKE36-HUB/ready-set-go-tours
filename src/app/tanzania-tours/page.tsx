import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Calendar, Star, Compass, Hotel } from "lucide-react";
import { TANZANIA_DESTINATIONS_INFO, COMPANY } from "@/lib/constants";
import AnimatedSection from "@/components/AnimatedSection";
import TanzaniaTourInteractive from "./Interactive";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Tanzania Tours & Safaris",
  description:
    "Explore Tanzania's legendary Serengeti, Ngorongoro Crater, and Kilimanjaro with Ready Set Go Tours & Travel. Luxury safaris and bespoke adventures from Arusha.",
  openGraph: {
    url: "https://www.readysetgosafaris.com/tanzania-tours",
    title: `Tanzania Tours & Safaris | ${COMPANY.name}`,
    description:
      "Journey through Tanzania's iconic northern circuit. From the Serengeti's endless plains to the summit of Kilimanjaro.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Tanzania Tours & Safaris - Ready Set Go Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Tanzania Tours & Safaris | ${COMPANY.name}`,
    description: "Journey through Tanzania's iconic northern circuit. From the Serengeti's endless plains to the summit of Kilimanjaro.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/tanzania-tours",
  },
};

export default function TanzaniaToursPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Destinations", item: "/tanzania-tours" },
        { name: "Tanzania", item: "/tanzania-tours" },
      ]} />
      <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/local/pin_11d516e76812eb0d549cbc1ff0709d0b.jpg"
          alt="Cheetah walking across Tanzania plains at sunset"
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
              The Ultimate East African Safari
            </span>
            <h1 className="mb-6 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-7xl">
              Discover{" "}
              <span className="italic text-[#E4C9A3]">Tanzania</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
              Stand on the rim of the Ngorongoro Crater, watch wildebeest cross the Mara River,
              and summit Africa&apos;s highest peak — Tanzania is the stuff of legends.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="mb-6 font-display text-3xl font-normal text-foreground sm:text-4xl">
              Tanzania: Where <span className="italic text-accent">Wilderness Awaits</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tanzania is home to some of Africa&apos;s most iconic landscapes and wildlife
              spectacles. From the endless plains of the Serengeti to the lush forests of
              Kilimanjaro, every corner of this vast country offers a new adventure. Our expert
              guides will lead you through Tanzania&apos;s finest parks, ensuring an authentic
              and transformative experience.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Destinations */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="mb-4 font-display text-3xl font-normal text-foreground sm:text-4xl">
                Tanzania&apos;s Iconic Destinations
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From the Serengeti to Zanzibar, Tanzania is a land of extraordinary contrasts.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-20">
            {TANZANIA_DESTINATIONS_INFO.map((dest, index) => (
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
                          Tanzania
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

                    <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/50 p-4">
                      <Calendar className="mt-0.5 size-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                          Best Time to Visit
                        </p>
                        <p className="text-sm text-foreground mt-0.5">{dest.bestTime}</p>
                      </div>
                    </div>

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

                    <TanzaniaTourInteractive tourName={dest.name} />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#08130E] px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(184,100,58,0.18),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <h2 className="mb-4 font-display text-3xl font-normal text-white sm:text-4xl">
              Begin Your Tanzania Journey
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/60">
              From the Serengeti to Zanzibar, let us craft your perfect Tanzanian adventure.
              Bespoke itineraries designed around your dreams.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <TanzaniaTourInteractive tourName="Custom Tanzania Safari" isCTA />
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
