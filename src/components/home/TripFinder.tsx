import Link from "next/link"
import { Compass, Sun, Mountain, Heart, ArrowRight, ShieldCheck } from "lucide-react"

const TRIPS = [
  {
    href: "/deals",
    icon: Compass,
    title: "Safari & Wildlife",
    caption: "Masai Mara · Serengeti · Amboseli",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    hover: "hover:ring-emerald-500/40 hover:bg-emerald-500/15",
  },
  {
    href: "/beach-holidays",
    icon: Sun,
    title: "Beach Holidays",
    caption: "Diani · Zanzibar · Mombasa",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
    hover: "hover:ring-sky-500/40 hover:bg-sky-500/15",
  },
  {
    href: "/mountain-trekking",
    icon: Mountain,
    title: "Mountains & Trekking",
    caption: "Kilimanjaro · Mt Kenya",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    hover: "hover:ring-amber-500/40 hover:bg-amber-500/15",
  },
  {
    href: "/honeymoon-packages",
    icon: Heart,
    title: "Honeymoons",
    caption: "Safari & beach escapes",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    hover: "hover:ring-rose-500/40 hover:bg-rose-500/15",
  },
]

export function TripFinder() {
  return (
    <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white dark:bg-slate-900 ring-1 ring-slate-200/60 dark:ring-slate-800 shadow-2xl shadow-slate-900/10 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Where shall we take you?
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Private Guides
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Custom Itineraries
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                24/7 Support
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {TRIPS.map((trip) => {
              const Icon = trip.icon
              return (
                <Link
                  key={trip.href}
                  href={trip.href}
                  className={`group flex flex-col gap-3 rounded-2xl p-4 sm:p-5 ring-1 ring-slate-100 dark:ring-slate-800 transition-all duration-300 ${trip.bg} ${trip.hover}`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`w-11 h-11 rounded-xl bg-gradient-to-br from-white/90 to-white/60 dark:from-slate-800 dark:to-slate-700 shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center`}>
                      <Icon className={`size-5 ${trip.color}`} />
                    </span>
                    <ArrowRight className={`size-4 ${trip.color} opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {trip.caption}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}