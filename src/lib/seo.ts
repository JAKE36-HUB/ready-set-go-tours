export const SITE_URL = "https://www.readysetgosafaris.com";

/** Turn a site-relative path into an absolute URL for structured data and metadata. */
export function absoluteUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return `${SITE_URL}/opengraph-image`;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * Trim text to a word boundary at or below `max` characters. Appends an
 * ellipsis only when something was actually removed, so short copy stays
 * untouched instead of ending in a dangling "…".
 */
export function truncateAtWord(text: string, max: number): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;

  const slice = cleaned.slice(0, max + 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.5 ? slice.slice(0, lastSpace) : cleaned.slice(0, max);
  return `${cut.replace(/[\s,;:–—-]+$/, "")}…`;
}

/** Build a meta description that ends on a whole word and optionally adds a CTA. */
export function buildMetaDescription(text: string, max = 158, cta?: string): string {
  if (!cta) return truncateAtWord(text, max);
  const main = truncateAtWord(text, max - cta.length - 1);
  return `${main} ${cta}`;
}

/**
 * Short, keyword-first names for tour detail pages. The database names are
 * written for humans browsing the site ("5 Days Mara, Lake Nakuru & Naivasha
 * Group Safari"), which run past the ~60 character SERP title limit once the
 * price and brand are appended.
 */
const TOUR_TITLES: Record<string, string> = {
  // Holiday packages
  "mount-kenya-trekking-3-days": "3-Day Mount Kenya Trek",
  "mount-kenya-lakes-trek-4-days": "4-Day Mount Kenya Lakes Trek",
  "mount-kenka-sirimon-chogoria-5-days": "5-Day Mount Kenya Trek: Sirimon–Chogoria",
  "mara-nakuru-4-days-group": "4-Day Mara & Nakuru Group Safari",
  "kilimanjaro-machame-6-days": "6-Day Kilimanjaro Machame Route",
  "kilimanjaro-lemosho-8-days": "8-Day Kilimanjaro Lemosho Route",
  "amboseli-tsavo-gateway": "Amboseli & Tsavo Safari",
  "maasai-mara-3-days-group": "3-Day Maasai Mara Group Safari",
  "mara-nakuru-naivasha-5-days-group": "5-Day Mara, Nakuru & Naivasha Safari",
  "mara-nakuru-naivasha-amboseli-8-days-group": "8-Day Mara, Nakuru, Naivasha & Amboseli",
  "kenya-tanzania-combo": "Kenya & Tanzania Combo Safari",
  "kilimanjaro-machame-7-days": "7-Day Kilimanjaro Machame Route",
  "tanzania-luxury-serengeti-ngorongoro": "Serengeti & Ngorongoro Luxury Safari",
  "mara-nakuru-amboseli-6-days-group": "6-Day Mara, Nakuru & Amboseli Safari",
  "mara-nakuru-naivasha-amboseli-7-days-group": "7-Day Mara, Nakuru, Naivasha & Amboseli",
  "ultimate-kenya-safari": "7-Day Ultimate Kenya Safari",
  "tanzania-northern-circuit": "6-Day Tanzania Northern Circuit Safari",
  "hells-gate-naivasha": "Hell's Gate & Lake Naivasha Safari",
  "masai-mara-luxury-safari-4-days": "4-Day Masai Mara Luxury Safari",
  "3-days-ritz-carlton-masai-mara-flying-package": "3-Day Ritz-Carlton Masai Mara Fly-in",
  "4-days-ritz-carlton-masai-mara-flying-package": "4-Day Ritz-Carlton Masai Mara Fly-in",
  "diani-beach": "Diani Beach Holiday",
  "zanzibar-island": "Zanzibar Island Holiday",
  // Deals
  "great-wildebeest-migration": "3-Day Great Migration Safari",
  "7-days-kenyas-magnificent-safari": "7-Day Kenya's Magnificent Safari",
  "3-days-amboseli-safari": "3-Day Amboseli Safari",
  "7-days-fly-in-amboseli": "7-Day Fly-in Amboseli Safari",
  // Honeymoons
  "romantic-safari-beach": "Romantic Safari & Beach Escape",
  "mount-kenya-romance": "Mount Kenya Romantic Retreat",
  "zanzibar-honeymoon": "Zanzibar Honeymoon Paradise",
  "tanzania-safari-zanzibar": "Tanzania Safari & Zanzibar Honeymoon",
  "5-days-enchanting-kenya-honeymoon-ultra-luxury-safari": "5-Day Ultra-Luxury Kenya Honeymoon",
  "diani-beach-honeymoon": "Diani Beach Honeymoon",
};

/**
 * `Title from $price`, kept under ~60 characters. Unknown slugs fall back to
 * the database name, shortened at a word boundary.
 */
export function tourMetaTitle(slug: string, fallbackName: string, price: number): string {
  const name = TOUR_TITLES[slug] ?? fallbackName.replace(/\s+/g, " ").trim();
  const suffix = ` from $${price.toLocaleString("en-US")}`;
  if (name.length + suffix.length <= 60) return `${name}${suffix}`;
  return truncateAtWord(name, 60 - suffix.length).replace(/…$/, "") || name;
}

/** Short SERP titles for the travel guides that are long enough to get cut off. */
const GUIDE_TITLES: Record<string, string> = {
  "best-time-to-visit-masai-mara": "Best Time to Visit the Masai Mara (Month by Month)",
  "kilimanjaro-climbing-tips": "Kilimanjaro Climbing Tips for First-Time Climbers",
  "zanzibar-travel-guide": "Zanzibar Travel Guide: Beaches, Culture & Stone Town",
  "kenya-safari-packing-list": "Kenya Safari Packing List: What to Pack & Wear",
  "great-migration-facts": "Great Migration Facts: Nature's Greatest Spectacle",
  "maasai-culture-guide": "Maasai Culture Guide: Traditions & Visiting Etiquette",
  "diani-beach-guide": "Diani Beach Guide: Kenya's Tropical Paradise",
  "amboseli-vs-masai-mara": "Amboseli vs Masai Mara: Which Safari Is Right for You?",
  "sustainable-tourism-kenya": "Sustainable Tourism in Kenya: How to Travel Responsibly",
};

export function guideMetaTitle(slug: string, fallbackTitle: string, metaTitle?: string): string {
  return metaTitle || GUIDE_TITLES[slug] || fallbackTitle;
}
