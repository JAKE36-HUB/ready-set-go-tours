import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { COMPANY } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import { Tag, Shield, Users, Gift, Star } from "lucide-react";
import DealsBrowser, { type DealCard } from "@/components/DealsBrowser";

export const revalidate = 3600;

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <Tag className="size-12 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Best{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Deals
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Exclusive offers on safaris, Mount Kenya adventures, beach holidays, and group packages.
              Don&apos;t miss your chance to experience East Africa for less.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <DealsBrowser deals={deals} />

      {/* Why Book With Us */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-emerald-950/5">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">
              Why Book a{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Deal
              </span>{" "}
              With Us?
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-14">
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
                <div className="text-center p-6 rounded-xl bg-card ring-1 ring-foreground/10">
                  <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="size-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
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
          <div className="text-center p-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 ring-1 ring-emerald-100 dark:ring-emerald-900/50">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Don&apos;t Miss Out on These Deals
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              These offers are limited and subject to availability. Contact our team to secure your
              spot at the best price.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
              >
                Get a Free Quote
              </a>
              <a
                href="tel:+254712345678"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-card ring-1 ring-foreground/10 hover:ring-emerald-500/30 text-foreground text-sm font-medium transition-all"
              >
                Call {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
