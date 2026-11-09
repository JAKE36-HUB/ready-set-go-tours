/**
 * Shared search types and lightweight constants.
 *
 * Kept separate from `site-search.ts` so client components can import the
 * category list, popular queries and result types without pulling the full
 * site content index (packages, articles, FAQs) into the browser bundle.
 */

export const SEARCH_CATEGORIES = [
  "All",
  "Safaris",
  "Destinations",
  "Honeymoons",
  "Travel Guide",
  "Pages & Help",
] as const

export type SearchCategoryFilter = (typeof SEARCH_CATEGORIES)[number]
export type SearchCategory = Exclude<SearchCategoryFilter, "All">

export interface SearchItem {
  id: string
  title: string
  href: string
  category: SearchCategory
  description?: string
  keywords?: string[]
  /** Base relevance used to break ties between similar matches. */
  weight?: number
}

export interface SearchResult extends SearchItem {
  score: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  category: SearchCategoryFilter
}

export const POPULAR_SEARCHES = [
  "Masai Mara",
  "Great Migration",
  "Honeymoon",
  "Zanzibar",
  "Kilimanjaro",
  "Family safari",
  "Beach holiday",
  "Budget safari",
] as const
