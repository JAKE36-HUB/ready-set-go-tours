"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight, Check, Star, Hotel, Plane, Heart, Shield, HeadphonesIcon, Award, Sparkles, Compass, Phone,
} from "lucide-react"
import type { Service } from "@/lib/constants"
import { COMPANY, TESTIMONIALS, whatsappPackageLink } from "@/lib/constants"
import { truncateAtWord } from "@/lib/seo"
import AnimatedSection from "@/components/AnimatedSection"
import { openBookingModal } from "@/lib/booking-store"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const iconMap: Record<string, typeof Hotel> = {
  Hotel, Plane, Heart, Shield, HeadphonesIcon, Award, Sparkles, Compass,
}

const serviceConfig: Record<string, { icon: typeof Hotel }> = {
  "safaris-guided-tours": { icon: Compass },
  "hotel-bookings": { icon: Hotel },
  "air-ticketing": { icon: Plane },
  "massage-wellness": { icon: Heart },
}

const HOW_IT_WORKS: Record<string, { step: string; title: string; desc: string }[]> = {
  "safaris-guided-tours": [
    { step: "01", title: "Share Your Dream", desc: "Tell us your dates, group size, interests, and budget. We'll start shaping the perfect safari around you." },
    { step: "02", title: "We Design It Together", desc: "Review a bespoke itinerary with hand-picked parks, lodges, and experiences — refined until it's exactly right." },
    { step: "03", title: "Travel & Explore", desc: "We handle every detail — guides, vehicles, parks, and permits — so you simply sit back and watch Africa unfold." },
  ],
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
  "safaris-guided-tours": [
    { value: "100+", label: "Safari Packages" },
    { value: "2,500+", label: "Travelers Guided" },
    { value: "4.9", label: "Safari Rating" },
    { value: "15+", label: "Years Experience" },
  ],
  "hotel-bookings": [
    { value: "200+", label: "Vetted Properties" },
    { value: "4,200+", label: "Bookings Completed" },
    { value: "4.9", label: "Guest Rating" },
    { value: "3+", label: "Years Experience" },
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

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex h-[60vh] min-h-[480px] items-center justify-center overflow-hidden">
        <Image src={service.image} alt={service.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08130E]/65 via-[#08130E]/40 to-[#08130E]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08130E]/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection direction="none">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <HeroIcon className="size-4" />
              {service.title}
            </span>
            <h1 className="mb-6 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-7xl">
              {service.tagline}
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
              {truncateAtWord(service.description, 180)}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust Stats */}
      {trustStats.length > 0 && (
        <section className="relative z-20 -mt-12 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border shadow-2xl ring-1 ring-border md:grid-cols-4">
              {trustStats.map((stat) => (
                <div key={stat.label} className="bg-card p-5 text-center">
                  <div className="font-display text-2xl font-normal text-accent sm:text-3xl">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Description */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <h2 className="mb-8 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
              About Our{" "}
              <span className="italic text-accent">{service.title}</span>{" "}
              Service
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{service.description}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/40 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <AnimatedSection>
            <h2 className="mb-4 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
              What We Offer
            </h2>
            <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Everything included with our {service.title.toLowerCase()} service.
            </p>
          </AnimatedSection>
          <div className="grid gap-4 sm:grid-cols-2">
            {service.features.map((f, i) => (
              <AnimatedSection key={f} delay={i * 0.05}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Check className="size-4 text-accent" />
                  </div>
                  <span className="text-[15px] leading-relaxed text-foreground">{f}</span>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      {steps.length > 0 && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <AnimatedSection>
              <h2 className="mb-4 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
                How It <span className="italic text-accent">Works</span>
              </h2>
              <p className="mx-auto mb-14 max-w-lg text-center text-muted-foreground">
                Booking your {service.title.toLowerCase()} with us is simple and stress-free.
              </p>
            </AnimatedSection>
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((step, i) => (
                <AnimatedSection key={step.step} delay={i * 0.1}>
                  <div className="h-full rounded-2xl bg-card p-6 text-center ring-1 ring-border transition-shadow hover:shadow-lg">
                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                      <span className="font-display text-lg text-primary-foreground">{step.step}</span>
                    </div>
                    <h3 className="mb-3 font-display text-lg font-normal text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#08130E]/60 to-transparent" />
      </section>

      {/* Benefits */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <AnimatedSection>
            <h2 className="mb-4 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
              Why Book With Us
            </h2>
            <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Here&apos;s what sets our {service.title.toLowerCase()} service apart.
            </p>
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-3">
            {service.benefits.map((b, i) => {
              const BIcon = iconMap[b.icon] || Compass
              return (
                <AnimatedSection key={b.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl bg-secondary/40 p-6 text-center ring-1 ring-border transition-shadow hover:shadow-lg">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                      <BIcon className="size-6 text-primary-foreground" />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-normal text-foreground">{b.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {serviceTestimonials.length > 0 && (
        <section className="bg-secondary/40 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <AnimatedSection>
              <h2 className="mb-4 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
                What Our <span className="italic text-accent">Guests Say</span>
              </h2>
              <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
                Real feedback from travelers who used our {service.title.toLowerCase()} service.
              </p>
            </AnimatedSection>
            <div className="grid gap-6 sm:grid-cols-2">
              {serviceTestimonials.map((t) => (
                <AnimatedSection key={t.id}>
                  <div className="flex h-full flex-col rounded-2xl bg-card p-6 ring-1 ring-border">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="relative size-10 overflow-hidden rounded-full ring-2 ring-border">
                        <Image src={t.image} alt={t.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <div className="mt-0.5 flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-3 ${i < t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="flex-1 text-sm italic leading-relaxed text-muted-foreground">
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
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <h2 className="mb-4 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
              Why Choose {COMPANY.shortName}
            </h2>
            <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              What makes us different when it comes to {service.title.toLowerCase()}.
            </p>
          </AnimatedSection>
          <div className="space-y-4">
            {service.whyUs.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Star className="size-4 fill-current text-accent" />
                  </div>
                  <p className="text-[15px] leading-relaxed text-foreground">{item}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Image */}
      <section className="relative h-[35vh] min-h-[260px] overflow-hidden">
        <Image src={service.image} alt={service.title} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#08130E]/50 to-transparent" />
      </section>

      {/* FAQs */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <h2 className="mb-4 text-center font-display text-3xl font-normal text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
              Quick answers to common questions about our {service.title.toLowerCase()} service.
            </p>
          </AnimatedSection>
          <Accordion className="rounded-2xl bg-card p-2 ring-1 ring-border">
            {service.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border/50 last:border-0">
                <AccordionTrigger className="px-4 py-4 text-left text-sm font-medium text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#08130E] px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(184,100,58,0.18),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="mb-4 font-display text-3xl font-normal text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-white/60">
              Reach out today and let us take care of the details. We&apos;re here to help
              with every step of your {service.title.toLowerCase()} booking.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => openBookingModal(service.title)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E4C9A3] px-8 font-semibold text-[#1F4A38] shadow-lg shadow-black/20 transition-all hover:bg-[#F0DDC0]"
              >
                Get a Free Quote
              </button>
              <a
                href={whatsappPackageLink(service.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-8 text-white transition-colors hover:bg-white/10"
              >
                <Phone className="size-4" />
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  )
}
