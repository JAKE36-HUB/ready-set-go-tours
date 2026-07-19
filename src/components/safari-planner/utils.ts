import type { PlannerData } from "./types"
import { TOUR_PACKAGES } from "@/lib/constants"

export function getDefaultPlannerData(): PlannerData {
  return {
    destinations: [],
    activities: [],
    accommodation: "",
    startDate: "",
    endDate: "",
    adults: 2,
    children: 0,
    fullName: "",
    email: "",
    phone: "",
    country: "",
    notes: "",
  }
}

export function getMatchingPackage(data: PlannerData) {
  const types = data.activities.some((a) => ["Game drives", "Great Migration viewing", "Night game drives"].includes(a))
    ? ["safari"]
    : data.activities.some((a) => ["Mountain trekking"].includes(a))
      ? ["mountain"]
      : data.activities.some((a) => ["Snorkeling / diving", "Dhow sunset cruises", "Deep-sea fishing"].includes(a))
        ? ["beach"]
        : ["safari"]

  const matches = TOUR_PACKAGES.filter((p) => types.includes(p.type))
  return matches.length > 0 ? matches[0] : TOUR_PACKAGES[0]
}
