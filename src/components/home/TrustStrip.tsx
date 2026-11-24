import { Shield, Award, HeadphonesIcon, Package, Star, Heart, Hotel, Users, type LucideIcon } from "lucide-react"

import { STATISTICS, TRUST_ITEMS } from "@/lib/constants"
import { Reveal } from "@/components/Reveal"

const iconMap: Record<string, LucideIcon> = { Shield, Award, HeadphonesIcon, Package, Star, Heart, Hotel, Users }

export function TrustStrip() {
  const topStats = STATISTICS.slice(0, 4)

  return (
    <section className="relative border-b border-border bg-background py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {topStats.map((stat) => (
            <Reveal key={stat.label} className="text-center">
              <div className="whitespace-nowrap font-display text-2xl font-normal tabular-nums text-primary sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">{stat.label}</div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-5 border-t border-border pt-5">
          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-1.5">
            {TRUST_ITEMS.slice(0, 5).map((item, idx) => {
              const IconComponent = iconMap[item.icon]
              return (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
                  {IconComponent && <IconComponent className="h-3.5 w-3.5 shrink-0 text-accent" />}
                  <span>{item.label}</span>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
