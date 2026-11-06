"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Hotel, Plane, Heart, Compass, Sparkles, Shield, HeadphonesIcon, Award, Star } from "lucide-react"
import { SERVICES, whatsappLink } from "@/lib/constants"
import AnimatedSection from "@/components/AnimatedSection"
import { BreadcrumbJsonLd } from "@/components/JsonLd"

const iconMap: Record<string, typeof Hotel> = { Compass, Hotel, Plane, Heart, Shield, HeadphonesIcon, Award, Sparkles }

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Services", item: "/services" },
        ]}
      />
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-32">
        <Image
          src="/images/local/pin_5ed9e7896df91ef4ad2acdc3d37b0b21.jpg"
          alt="Services hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08130E]/65 via-[#08130E]/45 to-[#08130E]/85" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <AnimatedSection direction="none">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <Compass className="size-4" />
              Beyond the Safari
            </span>
            <h1 className="mb-6 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-7xl">
              Our <span className="italic text-[#E4C9A3]">Services</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
              From flights and accommodation to wellness and relaxation — we handle every detail
              of your East African journey.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
                <span className="h-px w-8 bg-accent/60" />
                Full-Service Travel
              </span>
              <h2 className="mb-4 font-display text-3xl font-normal text-foreground sm:text-4xl lg:text-5xl">
                Everything You Need,{" "}
                <span className="italic text-accent">One Call Away</span>
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Whether you need a room for the night, a flight across the continent, or deep
                relaxation after a week on safari — our team has you covered.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-16">
            {SERVICES.map((service, index) => {
              const Icon = iconMap[service.benefits[0].icon] || Compass
              return (
                <AnimatedSection key={service.id} delay={0.1}>
                  <div className={`flex flex-col gap-10 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-start`}>
                    {/* Image */}
                    <div className="group relative w-full lg:w-1/2">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                        <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08130E]/60 via-transparent to-transparent" />
                        <div className="absolute left-4 top-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                            <Icon className="size-3" />
                            {service.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full space-y-5 lg:w-1/2">
                      <h3 className="font-display text-2xl font-normal text-foreground sm:text-3xl">{service.title}</h3>
                      <p className="leading-relaxed text-muted-foreground">{service.description}</p>

                      {/* Benefits */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        {service.benefits.map((b) => {
                          const BIcon = iconMap[b.icon] || Compass
                          return (
                            <div key={b.title} className="rounded-xl border border-border bg-secondary/40 p-3">
                              <BIcon className="mb-1.5 size-5 text-accent" />
                              <p className="mb-0.5 text-xs font-semibold text-foreground">{b.title}</p>
                              <p className="text-xs text-muted-foreground">{b.desc}</p>
                            </div>
                          )
                        })}
                      </div>

                      {/* Features Preview */}
                      <ul className="space-y-1.5">
                        {service.features.slice(0, 4).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Star className="mt-0.5 size-3.5 shrink-0 text-accent" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90"
                      >
                        Learn More <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#08130E] px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(184,100,58,0.18),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <h2 className="mb-4 font-display text-3xl font-normal text-white sm:text-4xl">
              Need Help Planning?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/60">
              Whatever you need — a hotel booking, a flight, or a spa day — our team is ready to help.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink()}
                target="_blank"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E4C9A3] px-8 font-semibold text-[#1F4A38] shadow-lg shadow-black/20 transition-all hover:bg-[#F0DDC0]"
              >
                WhatsApp Us
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  )
}
