import type { Metadata } from "next"
import Link from "next/link"

import { PlanMySafari } from "@/components/planner/PlanMySafari"

export const metadata: Metadata = {
  title: "Plan My Safari",
  description:
    "Tell us when you want to travel, who's coming and what you want to experience. We'll design your private Kenya or Tanzania safari around you.",
  alternates: {
    canonical: "/plan-my-safari",
  },
}

export default function PlanMySafariPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border px-6 pt-12 pb-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Tailor-made safari planner
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Tell us your travel dates, who is coming and the kind of experience you
            are looking for. The short form below takes about two minutes. We use
            your answers to shortlist suitable Kenya and Tanzania itineraries,
            match you with the right camps and lodges, and send a personal,
            no-obligation quote with a suggested route and realistic budget.
          </p>
        </div>
      </section>

      <PlanMySafari />

      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-normal text-foreground sm:text-3xl">
            How your safari plan comes together
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Step 1</span>
              <h3 className="mt-2 font-medium text-foreground">Share your idea</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Give us a rough travel window, your group size and the wildlife,
                landscapes or experiences that matter most to you. Nothing is
                fixed at this stage.
              </p>
            </div>
            <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Step 2</span>
              <h3 className="mt-2 font-medium text-foreground">We shape the options</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A safari consultant compares routes, park combinations and
                accommodation, then builds an itinerary around your budget and
                the season you are travelling in.
              </p>
            </div>
            <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Step 3</span>
              <h3 className="mt-2 font-medium text-foreground">Refine and book</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Review the proposal, ask questions and adjust any detail. When
                you are happy, we secure the accommodation and park bookings and
                send your confirmed travel documents.
              </p>
            </div>
          </div>
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            Planning a private Kenya safari, a Tanzania migration trip, a beach
            and bush honeymoon or a family adventure? The same process applies.
            You can also browse our{" "}
            <Link className="text-primary hover:underline" href="/holiday-packages">
              holiday packages
            </Link>{" "}
            or{" "}
            <Link className="text-primary hover:underline" href="/travel-guide">
              travel guides
            </Link>{" "}
            first if you would like inspiration before you start.
          </p>
        </div>
      </section>
    </main>
  )
}