import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const TRIPS = [
  {
    href: "/honeymoon-packages",
    image: "/images/local/pin_fbfecc1741f23134a323bbc5bf57c414.jpg",
    title: "Honeymoon",
    caption: "Safari & beach escapes",
  },
  {
    href: "/holiday-packages",
    image: "/images/local/pin_6d3c9d0dfb8a372c96d1b1a4697e158f.jpg",
    title: "First Safari",
    caption: "Our most-loved itineraries",
  },
  {
    href: "/kenya-tours",
    image: "/images/local/pin_cc764a89a26b9322634b91a51d58248f.jpg",
    title: "Family",
    caption: "Safaris for every age",
  },
  {
    href: "/tanzania-tours",
    image: "/images/local/pin_5ed9e7896df91ef4ad2acdc3d37b0b21.jpg",
    title: "Photography",
    caption: "Big skies, endless light",
  },
  {
    href: "/holiday-packages",
    image: "/images/local/pin_144b48e269001cb629981818a2106848.jpg",
    title: "Kenya + Tanzania",
    caption: "Two countries, one trip",
    wide: true,
  },
]

export function TripFinder() {
  return (
    <section className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[2rem] border border-border/70 bg-background/95 p-6 shadow-[0_40px_100px_-50px_rgba(18,42,32,0.5)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow mb-2">
                Start your journey
              </p>
              <h2 className="font-display text-2xl font-normal text-foreground sm:text-3xl">
                What kind of safari is calling you?
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-relaxed text-muted-foreground sm:block">
              Every trip starts with a conversation. Pick where your safari begins.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
            {TRIPS.map((trip, i) => (
              <Link
                key={trip.title}
                href={trip.href}
                className={`group relative h-52 overflow-hidden rounded-[1.25rem] border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(18,42,32,0.45)] sm:h-64 ${
                  trip.wide ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover brightness-[0.95] transition-transform duration-700 group-hover:scale-105"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08130E]/90 via-[#08130E]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <div>
                    <h3 className="font-display text-lg font-normal leading-tight text-white">
                      {trip.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/65">{trip.caption}</p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-accent group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}