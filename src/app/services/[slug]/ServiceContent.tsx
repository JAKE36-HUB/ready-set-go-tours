"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight, Check, Star, Hotel, Plane, Heart, Shield, HeadphonesIcon, Award, Sparkles, Compass, Phone,
} from "lucide-react"
import type { Service } from "@/lib/constants"
import { COMPANY, TESTIMONIALS } from "@/lib/constants"
import AnimatedSection from "@/components/AnimatedSection"
import { BookingModal } from "@/components/layout/BookingModal"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const iconMap: Record<string, typeof Hotel> = {
  Hotel, Plane, Heart, Shield, HeadphonesIcon, Award, Sparkles, Compass,
}

const serviceConfig: Record<string, { accent: string; accentBg: string; accentText: string; gradient: string; gradient2: string; icon: typeof Hotel }> = {
  "hotel-bookings": {
    accent: "sky",
    accentBg: "bg-sky-50 dark:bg-sky-950/30",
    accentText: "text-sky-600 dark:text-sky-400",
    gradient: "from-sky-500 to-blue-600",
    gradient2: "from-sky-900 via-blue-900 to-slate-900",
    icon: Hotel,
  },
  "air-ticketing": {
    accent: "emerald",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
    accentText: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500 to-teal-600",
    gradient2: "from-emerald-900 via-teal-900 to-slate-900",
    icon: Plane,
  },
  "massage-wellness": {
    accent: "violet",
    accentBg: "bg-violet-50 dark:bg-violet-950/30",
    accentText: "text-violet-600 dark:text-violet-400",
    gradient: "from-violet-500 to-purple-600",
    gradient2: "from-violet-900 via-purple-900 to-slate-900",
    icon: Heart,
  },
}

const HOW_IT_WORKS: Record<string, { step: string; title: string; desc: string }[]> = {
  "hotel-bookings": [
    { step: "01", title: "Tell Us Your Needs", desc: "Share your destination, dates, group size, and preferences. We'll curate a shortlist of the best-matching properties." },
    { step: "02", title: "Compare & Choose", desc: "Review our hand-picked options with exclusive rates and perks not available on public booking sites." },
    { step: "03", title: "We Book & Confirm", desc: "We handle the reservation, negotiate extras, and send you a confirmed itinerary — at no cost to you." },
  ],
  "air-ticketing": [
    { step: "01", title: "Share Your Route", desc: "Tell us your departure city, destination, travel dates, and preferences. We'll search all available carriers." },
    { step: "02", title: "Get the Best Options", desc: "We present you with the best routes, fares, and schedules — including fares not visible on public platforms." },
    { step: "03", title: "We Ticket & Monitor", desc: "We issue your tickets and monitor the booking for schedule changes, proactively re-accommodating if needed." },
  ],
  "massage-wellness": [
    { step: "01", title: "Choose Your Experience", desc: "Browse our spa and wellness menu — from in-room massage to full-day spa retreats and wellness programs." },
    { step: "02", title: "Tell Us When & Where", desc: "Let us know your lodge or hotel, preferred dates and times, and any specific treatments you're interested in." },
    { step: "03", title: "Relax & Unwind", desc: "We coordinate with the spa, arrange your booking, and ensure everything is ready for your arrival." },
  ],
}

const TRUST_STATS: Record<string, { value: string; label: string }[]> = {
  "hotel-bookings": [
    { value: "200+", label: "Vetted Properties" },
    { value: "4,200+", label: "Bookings Completed" },
    { value: "4.9", label: "Guest Rating" },
    { value: "15+", label: "Years Experience" },
  ],
  "air-ticketing": [
    { value: "50+", label: "Airline Partners" },
    { value: "3,800+", label: "Tickets Issued" },
    { value: "4.8", label: "Customer Rating" },
    { value: "24/7", label: "Support" },
  ],
  "massage-wellness": [
    { value: "50+", label: "Partner Spas" },
    { value: "1,900+", label: "Treatments Booked" },
    { value: "4.9", label: "Wellness Rating" },
    { value: "Certified", label: "Therapists" },
  ],
}

interface Props {
  service: Service
}

export default function ServiceContent({ service }: Props) {
  const cfg = serviceConfig[service.slug] || serviceConfig["hotel-bookings"]
  const HeroIcon = cfg.icon || Compass
  const steps = HOW_IT_WORKS[service.slug] || []
  const trustStats = TRUST_STATS[service.slug] || []
  const serviceTestimonials = TESTIMONIALS.filter((t) => t.rating >= 4.9).slice(0, 2)
  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <Image src={service.image} alt={service.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <HeroIcon className="size-4" />
              {service.title}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {service.tagline}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              {service.description.slice(0, 150)}...
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust Stats */}
      {trustStats.length > 0 && (
        <section className="relative -mt-12 z-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              {trustStats.map((stat, i) => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 p-5 text-center">
                  <div className={`text-2xl sm:text-3xl font-bold ${cfg.accentText}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Description */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-8">
              About Our{" "}
              <span className={`bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                {service.title}
              </span>{" "}
              Service
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{service.description}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className={`py-20 px-6 ${cfg.accentBg}`}>
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
              What We Offer
            </h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">
              Everything included with our {service.title.toLowerCase()} service.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-4">
            {service.features.map((f, i) => (
              <AnimatedSection key={f} delay={i * 0.05}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-5 rounded-xl bg-card border border-foreground/10 hover:shadow-md transition-shadow"
                >
                  <div className={`w-8 h-8 rounded-lg ${cfg.accentBg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Check className={`size-4 ${cfg.accentText}`} />
                  </div>
                  <span className="text-[15px] text-foreground leading-relaxed">{f}</span>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      {steps.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
                How It{" "}
                <span className={`bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                  Works
                </span>
              </h2>
              <p className="text-muted-foreground text-center max-w-lg mx-auto mb-14">
                Booking your {service.title.toLowerCase()} with us is simple and stress-free.
              </p>
            </AnimatedSection>
            <div className="grid sm:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <AnimatedSection key={step.step} delay={i * 0.1}>
                  <div className="text-center p-6 rounded-2xl bg-card ring-1 ring-foreground/10 hover:shadow-lg transition-shadow h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Decorative Image */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <Image src={service.image} alt={service.title} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
              Why Book With Us
            </h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">
              Here&apos;s what sets our {service.title.toLowerCase()} service apart.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-3 gap-6">
            {service.benefits.map((b, i) => {
              const BIcon = iconMap[b.icon] || Compass
              return (
                <AnimatedSection key={b.title} delay={i * 0.08}>
                  <div className={`h-full p-6 rounded-2xl ${cfg.accentBg} ring-1 ring-${cfg.accent}-200 dark:ring-${cfg.accent}-800/30 text-center hover:shadow-lg transition-shadow`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <BIcon className="size-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {serviceTestimonials.length > 0 && (
        <section className={`py-20 px-6 ${cfg.accentBg}`}>
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
                What Our{" "}
                <span className={`bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                  Guests Say
                </span>
              </h2>
              <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">
                Real feedback from travelers who used our {service.title.toLowerCase()} service.
              </p>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 gap-6">
              {serviceTestimonials.map((t) => (
                <AnimatedSection key={t.id}>
                  <div className="p-6 rounded-2xl bg-card ring-1 ring-foreground/10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-foreground/10">
                        <Image src={t.image} alt={t.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-3 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                      &ldquo;{t.text.slice(0, 200)}{t.text.length > 200 ? "..." : ""}&rdquo;
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Us */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
              Why Choose {COMPANY.shortName}
            </h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">
              What makes us different when it comes to {service.title.toLowerCase()}.
            </p>
          </AnimatedSection>
          <div className="space-y-4">
            {service.whyUs.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-card border border-foreground/10 hover:shadow-md transition-shadow">
                  <div className={`w-8 h-8 rounded-full ${cfg.accentBg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Star className={`size-4 ${cfg.accentText} fill-current`} />
                  </div>
                  <p className="text-[15px] text-foreground leading-relaxed">{item}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Image */}
      <section className="relative h-[35vh] min-h-[260px] overflow-hidden">
        <Image src={service.image} alt={service.title} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent" />
      </section>

      {/* FAQs */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">
              Quick answers to common questions about our {service.title.toLowerCase()} service.
            </p>
          </AnimatedSection>
          <Accordion className="ring-1 ring-foreground/10 rounded-2xl bg-card p-2">
            {service.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border/50 last:border-0">
                <AccordionTrigger className="px-4 py-4 text-left text-foreground hover:no-underline text-sm font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-20 px-6 bg-gradient-to-br ${cfg.gradient2} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              Reach out today and let us take care of the details. We&apos;re here to help
              with every step of your {service.title.toLowerCase()} booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all"
              >
                Book Now
              </button>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(service.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="size-4" />
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialPackage={service.title}
      />
    </main>
  )
}
