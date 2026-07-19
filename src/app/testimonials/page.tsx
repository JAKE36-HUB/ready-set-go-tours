"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { TESTIMONIALS, STATISTICS } from "@/lib/constants";
import { Star, Play, ChevronLeft, ChevronRight, Quote, MapPin } from "lucide-react";

const VIDEO_TESTIMONIALS = [
  { id: 1, name: "Mark & Jennifer Adams", location: "Chicago, USA", thumbnail: "https://i.pinimg.com/736x/5e/d9/e7/5ed9e7896df91ef4ad2acdc3d37b0b21.jpg", duration: "3:45" },
  { id: 2, name: "Sophie Laurent", location: "Paris, France", thumbnail: "https://i.pinimg.com/736x/5e/d9/e7/5ed9e7896df91ef4ad2acdc3d37b0b21.jpg", duration: "4:12" },
  { id: 3, name: "The Nakamura Family", location: "Tokyo, Japan", thumbnail: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg", duration: "5:20" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const featured = TESTIMONIALS.slice(0, 5);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featured.length);
  }, [featured.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + featured.length) % featured.length);
  }, [featured.length]);

  useEffect(() => {
    autoplayRef.current = setInterval(nextSlide, 5000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [nextSlide]);

  const resetAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(nextSlide, 5000);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/5e/d9/e7/5ed9e7896df91ef4ad2acdc3d37b0b21.jpg"
          alt="Safari experience in Africa"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Traveler{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Reviews
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Don&apos;t just take our word for it. Hear from the travelers who&apos;ve
              experienced the magic of East Africa with us.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Carousel */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 p-8 sm:p-12 min-h-[280px] flex flex-col justify-center">
                <Quote className="size-10 text-sky-500/20 mb-4" />
                <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-6 italic">
                  &ldquo;{featured[currentSlide]?.text}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-sky-500/20">
                    <Image
                      src={featured[currentSlide]?.image || ""}
                      alt={featured[currentSlide]?.name || ""}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{featured[currentSlide]?.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3" />
                      {featured[currentSlide]?.location}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <StarRating rating={featured[currentSlide]?.rating || 5} />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-2">
                  {featured.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentSlide(i); resetAutoplay(); }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentSlide ? "bg-sky-500 w-8" : "bg-muted hover:bg-muted/80"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { prevSlide(); resetAutoplay(); }}
                    className="w-9 h-9 rounded-full border border-input flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={() => { nextSlide(); resetAutoplay(); }}
                    className="w-9 h-9 rounded-full border border-input flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
              All Reviews
            </h2>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={t.id} delay={i * 0.04}>
                <div className="flex flex-col h-full p-6 rounded-2xl bg-card ring-1 ring-foreground/10 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-2.5" />
                        {t.location}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={t.rating} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-4">{t.date}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
              Video Stories
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Watch our travelers share their incredible East African experiences.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-6">
            {VIDEO_TESTIMONIALS.map((v, i) => (
              <AnimatedSection key={v.id} delay={i * 0.1}>
                <div className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer ring-1 ring-foreground/10">
                  <Image
                    src={v.thumbnail}
                    alt={v.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="size-6 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white font-semibold text-sm">{v.name}</p>
                    <p className="text-white/60 text-xs flex items-center gap-2">
                      <MapPin className="size-2.5" />
                      {v.location} &middot; {v.duration}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews Placeholder */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center p-10 rounded-2xl bg-card ring-1 ring-foreground/10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg className="size-8" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-xl font-bold text-foreground">Google Reviews</span>
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <StarRating rating={5} />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">4.9 / 5.0</p>
              <p className="text-muted-foreground text-sm mb-6">Based on 850+ Google Reviews</p>
              <Button variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50">
                View on Google
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-6 bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATISTICS.slice(0, 4).map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.05}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-sky-200/70">{stat.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  );
}
