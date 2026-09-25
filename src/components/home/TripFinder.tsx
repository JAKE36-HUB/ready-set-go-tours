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
        <div className="rounded-3xl bg-background dark:bg-stone-900 ring-1 ring-border shadow-2xl shadow-stone-950/10 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-burgundy-400 mb-2">
                Start your journey
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-medium text-foreground">
                What kind of safari is calling you?
              </h2>
            </div>
            <p className="hidden sm:block text-sm text-muted-foreground max-w-xs leading-relaxed">
              Every trip starts with a conversation. Pick where your safari begins.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {TRIPS.map((trip, i) => (
              <Link
                key={trip.title}
                href={trip.href}
                className={`group relative rounded-2xl overflow-hidden h-52 sm:h-64 ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-stone-950/10 ${
                  trip.wide ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-medium text-white leading-tight">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5">{trip.caption}</p>
                  </div>
                  <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm text-white transition-all duration-300 group-hover:bg-primary group-hover:translate-x-0.5">
                    <ArrowRight className="w-4 h-4" />
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