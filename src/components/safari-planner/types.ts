export type DestinationSelection = {
  id: number
  name: string
  country: "kenya" | "tanzania" | "other"
  custom?: boolean
}

export interface PlannerData {
  destinations: DestinationSelection[]
  activities: string[]
  accommodation: string
  startDate: string
  endDate: string
  adults: number
  children: number
  fullName: string
  email: string
  phone: string
  country: string
  notes: string
}

export type UpdatePlannerData = <K extends keyof PlannerData>(key: K, value: PlannerData[K]) => void

export const ACCOMMODATION_TIERS = [
  { value: "budget" as const, label: "Budget", desc: "Basic comfort, best value", priceMultiplier: 0.6, icon: "💰" },
  { value: "mid" as const, label: "Mid-Range", desc: "Great comfort & service", priceMultiplier: 1.0, icon: "⭐" },
  { value: "luxury" as const, label: "Luxury", desc: "Premium lodges & camps", priceMultiplier: 1.6, icon: "✨" },
  { value: "premium" as const, label: "Premium", desc: "Ultra-luxe exclusive", priceMultiplier: 2.4, icon: "👑" },
]

export const ACTIVITY_CATEGORIES = [
  { value: "Game drives", icon: "🦁", category: "Wildlife" },
  { value: "Great Migration viewing", icon: "🦓", category: "Wildlife" },
  { value: "Hot air balloon safari", icon: "🎈", category: "Adventure" },
  { value: "Walking safaris", icon: "🥾", category: "Adventure" },
  { value: "Night game drives", icon: "🌙", category: "Wildlife" },
  { value: "Photography", icon: "📸", category: "Experience" },
  { value: "Birdwatching", icon: "🐦", category: "Nature" },
  { value: "Bush dining", icon: "🍽️", category: "Experience" },
  { value: "Maasai cultural visit", icon: "🎭", category: "Culture" },
  { value: "Spice tours", icon: "🌿", category: "Culture" },
  { value: "Horseback safaris", icon: "🐴", category: "Adventure" },
  { value: "Snorkeling / diving", icon: "🤿", category: "Beach" },
  { value: "Dhow sunset cruises", icon: "⛵", category: "Beach" },
  { value: "Mountain trekking", icon: "⛰️", category: "Adventure" },
  { value: "Deep-sea fishing", icon: "🎣", category: "Beach" },
]

export const STEPS = [
  { label: "Destinations", sublabel: "Where to go" },
  { label: "Activities", sublabel: "What to do" },
  { label: "Accommodation", sublabel: "How to stay" },
  { label: "Dates & Group", sublabel: "When & who" },
  { label: "Your Info", sublabel: "Contact details" },
  { label: "Quote", sublabel: "Your itinerary" },
]
