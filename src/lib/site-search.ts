import type { ArticleBlock } from "@/lib/articles/types"
import {
  BEACH_DESTINATIONS,
  BLOG_POSTS,
  DEALS,
  DESTINATIONS,
  FAQ_ITEMS,
  HONEYMOON_PACKAGES,
  NAV_ITEMS,
  SERVICES,
  TOUR_PACKAGES,
} from "@/lib/constants"
import type {
  SearchCategory,
  SearchCategoryFilter,
  SearchItem,
  SearchResult,
} from "@/lib/search-shared"

/**
 * Server-side site search.
 *
 * Builds a single index from the same content that powers the public pages,
 * then scores matches so exact titles and keyword hits rise above loose body
 * text matches. This module imports the content constants, so it must only be
 * used on the server (the `/api/search` route handles that).
 */

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const text = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string")
  }
  return typeof value === "string" ? [value] : []
}

const flattenBlocks = (blocks?: ArticleBlock[]): string[] => {
  if (!blocks) return []
  return blocks.flatMap((block) => {
    if (block.type === "ul") return block.items
    if (block.type === "faq") return []
    return [block.text]
  })
}

const categoryForHref = (href: string): SearchCategory => {
  if (href.includes("honeymoon")) return "Honeymoons"
  if (href.includes("travel-guide") || href.includes("blog")) return "Travel Guide"
  if (
    href.includes("holiday-packages") ||
    href.includes("mountain") ||
    href.includes("deals")
  ) {
    return "Safaris"
  }
  if (
    href.includes("kenya-tours") ||
    href.includes("tanzania-tours") ||
    href.includes("beach")
  ) {
    return "Destinations"
  }
  return "Pages & Help"
}

const PAGES: SearchItem[] = [
  {
    id: "page-home",
    title: "Home",
    href: "/",
    category: "Pages & Help",
    description: "Private Kenya and Tanzania safaris, tailored to the way you travel.",
    keywords: ["home", "homepage", "ready set go", "safari company", "nairobi"],
    weight: 6,
  },
  {
    id: "page-packages",
    title: "Holiday Packages",
    href: "/holiday-packages",
    category: "Safaris",
    description: "Browse every safari, beach and adventure package we run.",
    keywords: [
      "all safaris",
      "packages",
      "holiday",
      "tours",
      "itineraries",
      "budget",
      "affordable",
      "cheap",
      "family",
      "family friendly",
    ],
    weight: 34,
  },
  {
    id: "page-mountain",
    title: "Mountain Trekking",
    href: "/mountain-trekking",
    category: "Safaris",
    description: "Mount Kenya and Kilimanjaro treks with licensed mountain guides.",
    keywords: ["mountain", "trek", "hiking", "kilimanjaro", "mount kenya", "summit"],
    weight: 32,
  },
  {
    id: "page-deals",
    title: "Safari Deals & Offers",
    href: "/deals",
    category: "Safaris",
    description: "Seasonal offers, group rates and last-minute safari savings.",
    keywords: [
      "deals",
      "offers",
      "discount",
      "save",
      "special",
      "promotion",
      "budget",
      "affordable",
      "cheap",
      "value",
    ],
    weight: 32,
  },
  {
    id: "page-kenya",
    title: "Kenya Safari Destinations",
    href: "/kenya-tours",
    category: "Destinations",
    description: "The Mara, Amboseli, Samburu, Tsavo, Laikipia and the Kenyan coast.",
    keywords: ["kenya", "kenya tours", "national parks", "reserves", "wildlife"],
    weight: 32,
  },
  {
    id: "page-tanzania",
    title: "Tanzania Safari Destinations",
    href: "/tanzania-tours",
    category: "Destinations",
    description: "Serengeti, Ngorongoro, Tarangire, Kilimanjaro and Zanzibar.",
    keywords: ["tanzania", "tanzania tours", "serengeti", "ngorongoro", "zanzibar"],
    weight: 32,
  },
  {
    id: "page-beach",
    title: "Beach Holidays",
    href: "/beach-holidays",
    category: "Destinations",
    description: "Barefoot beach escapes in Diani, Zanzibar, Watamu and the coast.",
    keywords: ["beach", "coast", "ocean", "island", "diani", "zanzibar", "watamu"],
    weight: 30,
  },
  {
    id: "page-honeymoons",
    title: "Honeymoon Packages",
    href: "/honeymoon-packages",
    category: "Honeymoons",
    description: "Romantic safari and beach honeymoons designed for two.",
    keywords: ["honeymoon", "romantic", "couples", "newlywed", "anniversary"],
    weight: 34,
  },
  {
    id: "page-guide",
    title: "Travel Guide & Blog",
    href: "/travel-guide",
    category: "Travel Guide",
    description: "Expert safari advice, destination guides and planning tips.",
    keywords: ["travel guide", "blog", "articles", "tips", "advice", "guide"],
    weight: 20,
  },
  {
    id: "page-services",
    title: "Travel Services",
    href: "/services",
    category: "Pages & Help",
    description: "Safaris, flights, visas, hotels, transfers and corporate travel.",
    keywords: ["services", "flights", "visa", "hotels", "transfers", "corporate"],
    weight: 18,
  },
  {
    id: "page-plan",
    title: "Plan My Safari",
    href: "/plan-my-safari",
    category: "Pages & Help",
    description: "Tell us your dates and interests and we will build your itinerary.",
    keywords: ["plan", "enquiry", "quote", "custom safari", "tailor made", "book"],
    weight: 24,
  },
  {
    id: "page-about",
    title: "About Ready Set Go Safaris",
    href: "/about",
    category: "Pages & Help",
    description: "Meet the Nairobi team behind your safari.",
    keywords: ["about", "team", "company", "story", "why us", "nairobi"],
    weight: 12,
  },
  {
    id: "page-contact",
    title: "Contact Us",
    href: "/contact",
    category: "Pages & Help",
    description: "Talk to a safari expert by phone, email or WhatsApp.",
    keywords: ["contact", "phone", "email", "whatsapp", "office", "hours"],
    weight: 16,
  },
  {
    id: "page-faq",
    title: "Frequently Asked Questions",
    href: "/faq",
    category: "Pages & Help",
    description: "Visa, safety, packing, payment and safari planning answers.",
    keywords: ["faq", "questions", "help", "answers", "visa", "safety"],
    weight: 16,
  },
  {
    id: "page-gallery",
    title: "Safari Gallery",
    href: "/gallery",
    category: "Pages & Help",
    description: "Photos from the parks, camps and coast we plan trips to.",
    keywords: ["gallery", "photos", "pictures", "images", "wildlife"],
    weight: 10,
  },
  {
    id: "page-testimonials",
    title: "Traveller Reviews",
    href: "/testimonials",
    category: "Pages & Help",
    description: "Stories and reviews from travellers we have hosted.",
    keywords: ["reviews", "testimonials", "ratings", "travellers", "feedback"],
    weight: 10,
  },
  {
    id: "page-privacy",
    title: "Privacy Policy",
    href: "/privacy-policy",
    category: "Pages & Help",
    description: "How we collect, use and protect your personal information.",
    keywords: ["privacy", "data", "cookies", "policy"],
    weight: 4,
  },
]

function buildStaticIndex(): SearchItem[] {
  const items: SearchItem[] = []
  const seen = new Set<string>()

  const add = (item: SearchItem) => {
    const key = `${item.href}|${normalize(item.title)}`
    if (seen.has(key)) return
    seen.add(key)
    items.push(item)
  }

  // Core landing pages first, so nav duplicates below are skipped by href.
  PAGES.forEach(add)

  TOUR_PACKAGES.forEach((pkg) => {
    const isMountain = pkg.type === "mountain"
    add({
      id: `tour:${pkg.slug}`,
      title: pkg.name,
      href: `/holiday-packages/${pkg.slug}`,
      category: "Safaris",
      description: `${pkg.duration} · ${pkg.accommodation}`,
      keywords: [
        pkg.type,
        isMountain ? "mountain trek hiking climb kilimanjaro mount kenya summit" : "family family friendly families children kids solo private",
        pkg.type === "group" ? "group joining budget affordable cheap" : "",
        pkg.type === "luxury" ? "luxury premium exclusive" : "",
        pkg.description,
        pkg.duration,
        pkg.accommodation,
        pkg.meals,
        pkg.transport,
        ...text(pkg.activities),
        ...text(pkg.highlights),
      ].filter(Boolean),
      weight: 56,
    })
  })

  HONEYMOON_PACKAGES.forEach((pkg) => {
    add({
      id: `honeymoon:${pkg.slug}`,
      title: pkg.name,
      href: `/honeymoon-packages/${pkg.slug}`,
      category: "Honeymoons",
      description: `${pkg.duration} · ${pkg.accommodation}`,
      keywords: [
        "honeymoon",
        "romantic",
        "couple",
        "newlywed",
        "anniversary",
        pkg.description,
        pkg.duration,
        pkg.accommodation,
        pkg.meals,
        pkg.transport,
        ...text(pkg.activities),
        ...text(pkg.highlights),
        ...(pkg.itinerary ?? []).flatMap((day) => [day.title, day.description]),
      ],
      weight: 54,
    })
  })

  DESTINATIONS.kenya.forEach((destination) => {
    add({
      id: `kenya:${destination.slug}`,
      title: destination.name,
      href: "/kenya-tours",
      category: "Destinations",
      description: destination.description,
      keywords: [
        "kenya",
        destination.bestTime,
        destination.duration,
        ...text(destination.highlights),
      ],
      weight: 46,
    })
  })

  DESTINATIONS.tanzania.forEach((destination) => {
    add({
      id: `tanzania:${destination.slug}`,
      title: destination.name,
      href: "/tanzania-tours",
      category: "Destinations",
      description: destination.description,
      keywords: [
        "tanzania",
        destination.bestTime,
        destination.duration,
        ...text(destination.highlights),
      ],
      weight: 46,
    })
  })

  BEACH_DESTINATIONS.forEach((destination) => {
    add({
      id: `beach:${destination.slug}`,
      title: destination.name,
      href: "/beach-holidays",
      category: "Destinations",
      description: destination.description,
      keywords: [
        "beach",
        "coast",
        "island",
        destination.location,
        destination.duration,
        ...text(destination.highlights),
      ],
      weight: 42,
    })
  })

  DEALS.forEach((deal) => {
    add({
      id: `deal:${deal.slug}`,
      title: deal.title,
      href: `/deals/${deal.slug}`,
      category: "Safaris",
      description: `${deal.discount} · ${deal.duration}`,
      keywords: [
        "deal",
        "offer",
        "discount",
        "save",
        deal.type,
        deal.description,
        deal.duration,
        deal.accommodation,
        ...text(deal.highlights),
      ],
      weight: 48,
    })
  })

  BLOG_POSTS.forEach((post) => {
    add({
      id: `guide:${post.slug}`,
      title: post.title,
      href: `/travel-guide/${post.slug}`,
      category: "Travel Guide",
      description: post.excerpt,
      keywords: [
        post.category,
        post.author,
        post.excerpt,
        ...text(post.content),
        ...flattenBlocks(post.sections),
        ...(post.faqs ?? []).flatMap((faq) => [faq.q, faq.a]),
      ],
      weight: 26,
    })
  })

  SERVICES.forEach((service) => {
    add({
      id: `service:${service.slug}`,
      title: service.title,
      href: `/services/${service.slug}`,
      category: "Pages & Help",
      description: service.tagline,
      keywords: [
        "service",
        service.tagline,
        service.description,
        ...text(service.features),
        ...text(service.whyUs),
        ...(service.faqs ?? []).flatMap((faq) => [faq.q, faq.a]),
      ],
      weight: 28,
    })
  })

  FAQ_ITEMS.forEach((faq) => {
    const mentionsFamily = /child|kid|family/i.test(`${faq.question} ${faq.answer}`)
    add({
      id: `faq:${faq.id}`,
      title: faq.question,
      href: "/faq",
      category: "Pages & Help",
      description: faq.answer,
      keywords: [
        faq.answer,
        "faq",
        "question",
        "answer",
        ...(mentionsFamily ? ["family", "children", "kids"] : []),
      ],
      weight: 14,
    })
  })

  const existingHrefs = new Set(items.map((item) => item.href))

  NAV_ITEMS.forEach((navItem) => {
    if (!existingHrefs.has(navItem.href)) {
      add({
        id: `nav:${navItem.href}`,
        title: navItem.label,
        href: navItem.href,
        category: categoryForHref(navItem.href),
        description: "Browse this section of the site.",
        weight: 8,
      })
    }

    ;(navItem.children ?? []).forEach((child) => {
      if (existingHrefs.has(child.href)) return
      add({
        id: `nav:${child.href}`,
        title: child.label,
        href: child.href,
        category: categoryForHref(child.href),
        description: navItem.label,
        keywords: [navItem.label],
        weight: 10,
      })
    })
  })

  return items
}

const STATIC_INDEX = buildStaticIndex()

/**
 * Alternate spellings and everyday intent words mapped onto the vocabulary
 * used in the index. This is what makes "maasai", "serengetti", "kids" and
 * "cheap" find the right content without adding noise to every item.
 */
const CANONICAL_TOKENS: Record<string, string> = {
  maasai: "masai",
  serengetti: "serengeti",
  serengheti: "serengeti",
  kilamanjaro: "kilimanjaro",
  kilimajaro: "kilimanjaro",
  amboselli: "amboseli",
  zanzibarr: "zanzibar",
  ngorogoro: "ngorongoro",
  tsavvo: "tsavo",
  dianni: "diani",
  honeymoons: "honeymoon",
  safaris: "safari",
  treks: "trek",
  beaches: "beach",
  cheap: "budget",
  affordable: "budget",
  kids: "family",
  children: "family",
  newlywed: "honeymoon",
  newlyweds: "honeymoon",
  romantic: "honeymoon",
}

const canonicalToken = (token: string) => CANONICAL_TOKENS[token] ?? token

const withinOneEdit = (a: string, b: string) => {
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0
  let j = 0
  let edits = 0

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1
      j += 1
      continue
    }

    edits += 1
    if (edits > 1) return false

    if (a.length > b.length) i += 1
    else if (a.length < b.length) j += 1
    else {
      i += 1
      j += 1
    }
  }

  if (i < a.length || j < b.length) edits += 1
  return edits <= 1
}

const tokenMatchesWord = (token: string, word: string) => {
  if (word === token) return true
  if (token.length >= 4 && word.startsWith(token)) return true
  if (word.length >= 4 && token.startsWith(word)) return true
  if (token.length >= 5 && word.length >= 5) return withinOneEdit(token, word)
  return false
}

function scoreItem(item: SearchItem, term: string, tokens: string[]): number {
  const title = normalize(item.title)
  const description = normalize(item.description ?? "")
  const keywords = normalize((item.keywords ?? []).join(" "))
  const category = normalize(item.category)
  const href = normalize(item.href.replace(/[-/?=]/g, " "))
  const haystack = `${title} ${description} ${keywords} ${category} ${href}`
  const words = haystack.split(" ").filter(Boolean)

  const matched = tokens.filter(
    (token) => haystack.includes(token) || words.some((word) => tokenMatchesWord(token, word))
  )
  if (matched.length === 0) return -1

  let score = item.weight ?? 0

  if (title === term) score += 1600
  else if (title.startsWith(term)) score += 900
  else if (` ${title} `.includes(` ${term} `)) score += 720
  else if (title.includes(term)) score += 460

  const titleWords = title.split(" ").filter(Boolean)
  const keywordWords = keywords.split(" ").filter(Boolean)
  const descriptionWords = description.split(" ").filter(Boolean)

  if (keywords.includes(term)) score += 260
  if (description.includes(term)) score += 110
  if (category.includes(term)) score += 50
  if (href.includes(term)) score += 30

  for (const token of tokens) {
    if (titleWords.includes(token)) score += 320
    else if (titleWords.some((word) => tokenMatchesWord(token, word))) score += 240
    else if (title.includes(token)) score += 150
    else if (keywordWords.includes(token)) score += 130
    else if (keywordWords.some((word) => tokenMatchesWord(token, word))) score += 95
    else if (keywords.includes(token)) score += 65
    else if (descriptionWords.some((word) => tokenMatchesWord(token, word))) score += 40
    else if (description.includes(token)) score += 25
    else if (category.includes(token)) score += 15
    else if (href.includes(token)) score += 8
  }

  if (matched.length < tokens.length) {
    score -= 240 * (tokens.length - matched.length)
  }

  return score
}

/** De-duplicate by target + title, merging keywords from every source. */
export function dedupeSearchItems(items: SearchItem[]): SearchItem[] {
  const unique = new Map<string, SearchItem>()
  for (const item of items) {
    const key = `${item.href}|${normalize(item.title)}`
    const current = unique.get(key)
    if (!current) {
      unique.set(key, { ...item, keywords: [...(item.keywords ?? [])] })
      continue
    }

    unique.set(key, {
      ...current,
      description: current.description || item.description,
      keywords: [...new Set([...(current.keywords ?? []), ...(item.keywords ?? [])])],
      weight: Math.max(current.weight ?? 0, item.weight ?? 0),
    })
  }
  return [...unique.values()]
}

export function getStaticSearchIndex(): SearchItem[] {
  return STATIC_INDEX
}

export function searchSite(
  query: string,
  category: SearchCategoryFilter = "All",
  extraItems: SearchItem[] = [],
  limit = 24
): { results: SearchResult[]; total: number } {
  const term = normalize(query)
  if (!term) return { results: [], total: 0 }

  const tokens = term
    .split(" ")
    .filter((token) => token.length > 0)
    .map(canonicalToken)
  if (tokens.length === 0) return { results: [], total: 0 }

  const candidates = dedupeSearchItems([...extraItems, ...STATIC_INDEX]).filter(
    (item) => category === "All" || item.category === category
  )

  const scored = candidates
    .map((item) => ({ ...item, score: scoreItem(item, term, tokens) }))
    .filter((item) => item.score > 0)

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))

  return {
    results: scored.slice(0, limit),
    total: scored.length,
  }
}
