import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { COMPANY, PLAN_SAFARI_ROUTE } from "@/lib/constants";
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Deals & Offers</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white mt-4 mb-5 leading-tight">
              Great safaris, at a smarter price
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
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-center text-foreground mb-4">
              Why book a{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">
                deal
              </span>{" "}
              with us
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
          <div className="text-center p-10 rounded-3xl gradient-primary text-white shadow-premium">
            <h2 className="font-display text-2xl font-medium mb-3">
              Don&apos;t Miss Out on These Deals
            </h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              These offers are limited and subject to availability. Tell us which one you like and we&apos;ll hold it for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={PLAN_SAFARI_ROUTE}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white text-stone-900 font-semibold hover:bg-stone-100 transition-all"
              >
                Plan My Safari <ArrowRight className="size-4" />
              </Link>
              <a
                href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi! I'd like to know more about the current Ready Set Go Safaris deals.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium ring-1 ring-white/25 transition-all"
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
