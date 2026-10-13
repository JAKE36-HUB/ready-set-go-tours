export interface ItineraryDay {
  day: string
  title: string
  description: string
  meals?: string
  accommodation?: string
  activities?: string[]
  highlights?: string[]
}

export interface OptionalActivity {
  name: string
  price?: number | null
  price_text?: string | null
}

export interface TourPackagePayload {
  itinerary: ItineraryDay[]
  optional_activities: OptionalActivity[]
  notes: string
}

export const EMPTY_ITINERARY: ItineraryDay[] = []
export const EMPTY_OPTIONAL_ACTIVITIES: OptionalActivity[] = []
export const EMPTY_NOTES = ""