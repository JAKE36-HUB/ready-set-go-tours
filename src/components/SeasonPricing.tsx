import {
  BadgeDollarSign,
  BadgePercent,
  CalendarDays,
  Leaf,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SeasonKind, SeasonPricing, SeasonRate } from "@/lib/season-pricing";

const SEASON_STYLES: Record<
  SeasonKind,
  {
    icon: typeof Sun;
    border: string;
    ring: string;
    chip: string;
    label: string;
    dot: string;
  }
> = {
  high: {
    icon: Sun,
    border: "border-[#F5A623]/50",
    ring: "ring-[#F5A623]/20",
    chip: "bg-[#F5A623]/15",
    label: "text-[#8A5A00] dark:text-[#F5B84B]",
    dot: "bg-[#F5A623]",
  },
  low: {
    icon: Leaf,
    border: "border-[#6FBF8B]/50",
    ring: "ring-[#6FBF8B]/20",
    chip: "bg-[#6FBF8B]/15",
    label: "text-[#2F7D52] dark:text-[#8FD6A6]",
    dot: "bg-[#6FBF8B]",
  },
  other: {
    icon: CalendarDays,
    border: "border-border",
    ring: "ring-foreground/10",
    chip: "bg-muted",
    label: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

function SeasonCard({
  season,
  bestValue,
}: {
  season: SeasonRate;
  bestValue: boolean;
}) {
  const style = SEASON_STYLES[season.kind];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 ring-1",
        style.border,
        style.ring
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em]",
            style.chip,
            style.label
          )}
        >
          <Icon className="size-3.5" />
          {season.label}
        </span>
        {bestValue && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#6FBF8B]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2F7D52] dark:text-[#8FD6A6]">
            <BadgePercent className="size-3" />
            Best value
          </span>
        )}
      </div>

      <p className="mb-3 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
        <CalendarDays className="mt-0.5 size-3.5 shrink-0" />
        <span>{season.dates}</span>
      </p>

      <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
        <span className="font-display text-2xl font-semibold text-foreground">
          ${season.price.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">/ person sharing</span>
      </div>

      {season.soloPrice !== null && (
        <p className="mt-1 text-xs text-muted-foreground">
          Solo traveller:{" "}
          <span className="font-semibold text-foreground">
            ${season.soloPrice.toLocaleString()}
          </span>
        </p>
      )}
    </div>
  );
}

/** Full high/low comparison panel used on package detail pages. */
export function SeasonPricePanel({
  pricing,
  className,
  title = "Rates & seasons",
}: {
  pricing: SeasonPricing;
  className?: string;
  title?: string;
}) {
  const { seasons, hasComparison, savings, savingsPercent } = pricing;

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-primary/25 bg-primary/[0.04] p-5 sm:p-6",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <BadgeDollarSign className="size-5 shrink-0 text-primary" />
          {title}
        </h3>
        {hasComparison && savings !== null && savingsPercent !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#6FBF8B]/15 px-3 py-1 text-xs font-semibold text-[#2F7D52] dark:text-[#8FD6A6]">
            <BadgePercent className="size-3.5" />
            Save ${savings.toLocaleString()} ({savingsPercent}%) in low
            season
          </span>
        )}
      </div>

      <div
        className={cn(
          "grid gap-3",
          seasons.length > 1 && "sm:grid-cols-2"
        )}
      >
        {seasons.map((season) => (
          <SeasonCard
            key={`${season.kind}-${season.dates}-${season.price}`}
            season={season}
            bestValue={hasComparison && season === pricing.fromSeason}
          />
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Rates are per person in USD.{" "}
        {hasComparison
          ? "Low-season availability and exact travel dates are confirmed at the time of booking."
          : "Seasonal dates and availability are confirmed at the time of booking."}
      </p>
    </div>
  );
}

/** Compact high/low rows for package cards, similar packages and summaries. */
export function SeasonPriceRows({
  pricing,
  className,
}: {
  pricing: SeasonPricing | null | undefined;
  className?: string;
}) {
  if (!pricing?.hasComparison) return null;

  return (
    <div
      className={cn(
        "space-y-1.5 rounded-xl bg-muted/40 p-3 ring-1 ring-foreground/5",
        className
      )}
    >
      {pricing.seasons.map((season) => {
        const style = SEASON_STYLES[season.kind];
        return (
          <div
            key={`${season.kind}-${season.dates}-${season.price}`}
            className="flex items-center justify-between gap-3 text-xs"
            title={`${season.label}: ${season.dates}`}
          >
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <span
                className={cn("size-1.5 shrink-0 rounded-full", style.dot)}
              />
              <span className="shrink-0 font-medium text-foreground">
                {season.label}
              </span>
              <span className="truncate text-muted-foreground">
                {season.dates}
              </span>
            </span>
            <span className="shrink-0 font-semibold text-foreground">
              ${season.price.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Inline high/low summary for dark hero cards. */
export function SeasonPriceInline({
  pricing,
  className,
}: {
  pricing: SeasonPricing | null | undefined;
  className?: string;
}) {
  if (!pricing?.hasComparison) return null;

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/80",
        className
      )}
    >
      {pricing.seasons.map((season) => (
        <span
          key={`${season.kind}-${season.dates}-${season.price}`}
          className="inline-flex items-center gap-1.5"
          title={season.dates}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              SEASON_STYLES[season.kind].dot
            )}
          />
          <span className="text-white/60">{season.label}</span>
          <span className="font-semibold text-white">
            ${season.price.toLocaleString()}
          </span>
        </span>
      ))}
    </span>
  );
}
