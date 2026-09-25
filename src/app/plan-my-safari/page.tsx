import type { Metadata } from "next"

import { PlanMySafari } from "@/components/planner/PlanMySafari"

export const metadata: Metadata = {
  title: "Plan My Safari",
  description:
    "Tell us when you want to travel, who's coming and what you want to experience. We'll design your private Kenya or Tanzania safari around you.",
}

export default function PlanMySafariPage() {
  return (
    <main className="min-h-screen bg-background">
      <PlanMySafari />
    </main>
  )
}