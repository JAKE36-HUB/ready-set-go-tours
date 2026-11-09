import { DESTINATIONS } from "@/lib/constants"

/**
 * Endless destination ticker. Server-rendered, animated with CSS, and paused
 * on hover so names stay readable. Purely decorative — the real destination
 * links live in the Featured Destinations section below.
 */
export function DestinationMarquee() {
  const names = [...DESTINATIONS.kenya, ...DESTINATIONS.tanzania].map((destination) => destination.name)
  const loop = [...names, ...names]

  return (
    <section
      aria-label="Destinations we plan safaris to"
      className="relative overflow-hidden border-y border-white/5 bg-[#06101C] py-4 text-white/65"
    >
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {loop.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.24em]"
              aria-hidden={index >= names.length}
            >
              {name}
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
