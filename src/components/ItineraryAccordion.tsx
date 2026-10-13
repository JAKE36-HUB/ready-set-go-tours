"use client";

import { useState } from "react";
import { Utensils, Hotel, Compass, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItineraryDay } from "@/lib/tour";

export default function ItineraryAccordion({
  itinerary,
}: {
  itinerary: ItineraryDay[];
}) {
  const days = itinerary.filter(
    (d) => d.title || d.description || (d.activities && d.activities.length)
  );
  const [open, setOpen] = useState<number | null>(0);

  if (days.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-2xl font-medium text-foreground mb-2">
        Day-by-Day Itinerary
      </h2>
      <p className="text-muted-foreground mb-8">
        Tap a day to see the full programme.
      </p>

      <div className="space-y-3">
        {days.map((d, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 p-4 sm:p-5 text-left hover:bg-foreground/[0.02] transition-colors"
              >
                <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400 px-3 py-1 text-xs font-semibold shrink-0">
                  {d.day || `Day ${i + 1}`}
                </span>
                <span className="font-display text-base sm:text-lg font-medium text-foreground leading-snug flex-1">
                  {d.title}
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 text-muted-foreground shrink-0 transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-4 sm:px-5 pb-5">
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

                    {d.activities && d.activities.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-foreground/5">
                        <div className="flex flex-wrap gap-2">
                          {d.activities.map((a) => (
                            <span
                              key={a}
                              className="inline-flex items-center gap-1.5 text-xs bg-card ring-1 ring-foreground/10 text-muted-foreground px-3 py-1.5 rounded-full"
                            >
                              <Compass className="size-3.5 text-primary dark:text-amber-400" />
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {d.highlights && d.highlights.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1.5">
                          {d.highlights.map((h) => (
                            <span
                              key={h}
                              className="inline-flex items-center gap-1 text-[11px] text-primary dark:text-amber-400/90"
                            >
                              <Sparkles className="size-3" />
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
