import Image from "next/image";
import Link from "next/link";
import { Heart, Phone, Star, Quote, Shield, Gift } from "lucide-react";
import { COMPANY } from "@/lib/constants";
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
    if (data) packages = data.map((p: Record<string, unknown>) => ({ ...p, priceKES: p.price_kes }) as HoneymoonCard);
  } catch {}

  return (
    <main className="min-h-screen">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/40 via-transparent to-rose-950/40" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <AnimatedSection>
            <Heart className="size-10 text-rose-400 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Honeymoon{" "}
              <span className="bg-gradient-to-r from-rose-300 via-rose-200 to-pink-200 bg-clip-text text-transparent">
                Packages
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Handcrafted romantic escapes across East Africa. From private safari adventures to
              secluded beachfront villas â€” your dream honeymoon begins here.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <HoneymoonGrid packages={packages} />

      {/* Why Honeymoon With Us */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-rose-50/50 dark:to-rose-950/10">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">
              Why Choose Us for Your{" "}
              <span className="bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent">
                Honeymoon
              </span>
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14">
              We believe your honeymoon should be as unique as your love story. Every detail is crafted
              with romance in mind.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Romance Curated", desc: "Every package is designed by experts who understand the art of romance." },
              { icon: Shield, title: "Private & Exclusive", desc: "Private vehicles, private tables, private moments â€” just the two of you." },
              { icon: Gift, title: "Surprise Touches", desc: "Champagne on arrival, rose petal turndowns, and other thoughtful extras." },
              { icon: Star, title: "Flexible Planning", desc: "Customize every detail from accommodation to activities. Your honeymoon, your way." },
            ].map((item) => (
              <AnimatedSection key={item.title}>
                <div className="text-center p-6 rounded-xl bg-card ring-1 ring-foreground/10">
                  <div className="size-12 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="size-6 text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
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
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 ring-1 ring-rose-100 dark:ring-rose-900/30 text-center">
              <Quote className="size-10 text-rose-300/50 mx-auto mb-6" />
              <blockquote className="text-xl sm:text-2xl text-slate-700 dark:text-slate-200 font-medium italic leading-relaxed mb-6">
                &ldquo;Our honeymoon in Kenya was absolutely perfect. Every detail was thought of â€”
                from the champagne sundowner in the Mara to the private dinner on the beach in Diani.
                We will treasure these memories forever.&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
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
            <div className="text-center p-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 ring-1 ring-slate-700 text-white">
              <Heart className="size-10 text-rose-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Ready to Plan Your Romantic Escape?</h2>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Let our honeymoon specialists craft the perfect itinerary for your love story.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors shadow-lg shadow-rose-500/25"
                >
                  <Heart className="size-4" />
                  Get a Free Quote
                </Link>
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all ring-1 ring-white/20"
                >
                  <Phone className="size-4" />
                  {COMPANY.phone}
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
