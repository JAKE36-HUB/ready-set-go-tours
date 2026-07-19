"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Hotel, Plane, Heart, Compass, Sparkles, Shield, HeadphonesIcon, Award, Star } from "lucide-react"
import { SERVICES, COMPANY } from "@/lib/constants"
import AnimatedSection from "@/components/AnimatedSection"

const iconMap: Record<string, typeof Hotel> = { Hotel, Plane, Heart, Shield, HeadphonesIcon, Award, Sparkles }

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/5e/d9/e7/5ed9e7896df91ef4ad2acdc3d37b0b21.jpg"
          alt="Services hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 via-blue-900/80 to-slate-900/90" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedSection direction="none">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <Compass className="size-4" />
              Beyond the Safari
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Our{" "}
              <span className="bg-gradient-to-r from-sky-300 to-blue-200 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              From flights and accommodation to wellness and relaxation — we handle every detail
              of your East African journey.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Everything You Need,{" "}
                <span className="text-sky-500">One Call Away</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
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
                    <div className="w-full lg:w-1/2 relative group">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                        <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                            <Icon className="size-3" />
                            {service.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2 space-y-5">
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>

                      {/* Benefits */}
                      <div className="grid sm:grid-cols-3 gap-3">
                        {service.benefits.map((b) => {
                          const BIcon = iconMap[b.icon] || Compass
                          return (
                            <div key={b.title} className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
                              <BIcon className="size-5 text-sky-500 mb-1.5" />
                              <p className="text-xs font-semibold text-foreground mb-0.5">{b.title}</p>
                              <p className="text-xs text-muted-foreground">{b.desc}</p>
                            </div>
                          )
                        })}
                      </div>

                      {/* Features Preview */}
                      <ul className="space-y-1.5">
                        {service.features.slice(0, 4).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Star className="size-3.5 text-sky-500 mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all duration-200"
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
      <section className="py-20 px-6 bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,146,60,0.12),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Need Help Planning?
            </h2>
            <p className="text-sky-200/80 text-lg max-w-2xl mx-auto mb-8">
              Whatever you need — a hotel booking, a flight, or a spa day — our team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all"
              >
                Chat on WhatsApp
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-medium"
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
