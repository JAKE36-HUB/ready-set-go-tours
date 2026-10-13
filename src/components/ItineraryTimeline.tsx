import { Utensils, Hotel, Compass, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import type { ItineraryDay, OptionalActivity } from "@/lib/tour";

export function ItineraryTimeline({ itinerary }: { itinerary: ItineraryDay[] }) {
  const days = itinerary.filter(
    (d) => d.title || d.description || (d.activities && d.activities.length)
  );
  if (days.length === 0) return null;

  return (
    <AnimatedSection>
      <h2 className="font-display text-2xl font-medium text-foreground mb-2">
        Day-by-Day Itinerary
      </h2>
      <p className="text-muted-foreground mb-8">
        A detailed programme of your safari, day by day.
      </p>

      <div className="relative">
        <div
          className="absolute left-[13px] top-3 bottom-3 w-px bg-foreground/10"
          aria-hidden
        />
        <div className="space-y-6">
          {days.map((d, i) => (
            <div key={i} className="relative pl-12">
              <div className="absolute left-0 top-1.5 w-[27px] h-[27px] rounded-full bg-primary/10 dark:bg-amber-400/10 ring-1 ring-primary/30 dark:ring-amber-400/30 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-primary dark:bg-amber-400" />
              </div>

              <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400 px-3 py-1 text-xs font-semibold">
                    {d.day || `Day ${i + 1}`}
                  </span>
                  {d.title && (
                    <h3 className="font-display text-lg font-medium text-foreground leading-snug">
                      {d.title}
                    </h3>
                  )}
                </div>

                {d.description && (
                  <p className="text-muted-foreground leading-relaxed text-[15px] whitespace-pre-line">
                    {d.description}
                  </p>
                )}

                {(d.meals || d.accommodation) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {d.meals && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-card ring-1 ring-foreground/10 text-foreground px-3 py-1.5 rounded-full">
                        <Utensils className="size-3.5 text-primary dark:text-amber-400" />
                        {d.meals}
                      </span>
                    )}
                    {d.accommodation && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-card ring-1 ring-foreground/10 text-foreground px-3 py-1.5 rounded-full">
                        <Hotel className="size-3.5 text-primary dark:text-amber-400" />
                        {d.accommodation}
                      </span>
                    )}
                  </div>
                )}

                {(d.activities && d.activities.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-foreground/5">
                    <div className="flex flex-wrap gap-2">
                      {d.activities.map((a) => (
                        <span key={a} className="inline-flex items-center gap-1.5 text-xs bg-card ring-1 ring-foreground/10 text-muted-foreground px-3 py-1.5 rounded-full">
                          <Compass className="size-3.5 text-primary dark:text-amber-400" />
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(d.highlights && d.highlights.length > 0) && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {d.highlights.map((h) => (
                        <span key={h} className="inline-flex items-center gap-1 text-[11px] text-primary dark:text-amber-400/90">
                          <Sparkles className="size-3" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

export function OptionalActivitiesCard({
  activities,
}: {
  activities: OptionalActivity[];
}) {
  if (!activities || activities.length === 0) return null;
  return (
    <AnimatedSection>
      <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Compass className="size-5 text-primary dark:text-amber-400" />
          Optional Activities
        </h3>
        <ul className="space-y-3">
          {activities.map((a, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{a.name}</span>
              {a.price != null && a.price > 0 ? (
                <span className="text-foreground font-medium whitespace-nowrap">
                  From ${a.price.toLocaleString()}
                </span>
              ) : a.price_text ? (
                <span className="text-muted-foreground whitespace-nowrap">{a.price_text}</span>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground/80">
          Prices are per person and subject to availability. Bookable on request.
        </p>
      </div>
    </AnimatedSection>
  );
}

export function PackageNotesCard({ notes }: { notes: string }) {
  if (!notes) return null;
  const sections = notes
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <AnimatedSection>
      <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-primary dark:text-amber-400" />
          Important Travel Information
        </h3>
        <div className="space-y-4">
          {sections.map((s, i) => {
            const [head, ...rest] = s.split("\n").map((x) => x.trim());
            return (
              <div key={i}>
                {head && (
                  <p className="text-sm font-semibold text-foreground mb-1">{head}</p>
                )}
                {rest.map((line, j) => (
                  <p key={j} className="text-sm text-muted-foreground leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}