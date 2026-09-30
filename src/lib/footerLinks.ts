/**
 * Footer "Travel Resources" links.
 *
 * Kept separate from BLOG_POSTS on purpose: the footer is a client component, and
 * importing BLOG_POSTS here would ship every article's full body text to every
 * visitor. Only the slug and a short label are needed here.
 *
 * `GUIDE_SLUGS` is the source of truth for which guides appear in the sitewide
 * footer, and `node scripts/check-footer-links.js` asserts it against the guides
 * actually rendered on /travel-guide, so a new guide cannot be silently left out
 * of the footer.
 */
export const GUIDE_SLUGS = [
  "luxury-safari-lodges-kenya",
  "best-time-to-visit-masai-mara",
  "amboseli-vs-masai-mara",
  "great-migration-facts",
  "maasai-culture-guide",
  "kenya-safari-packing-list",
  "sustainable-tourism-kenya",
  "diani-beach-guide",
  "zanzibar-travel-guide",
  "kilimanjaro-climbing-tips",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

const GUIDE_LABELS: Record<GuideSlug, string> = {
  "luxury-safari-lodges-kenya": "Luxury Safari Lodges",
  "best-time-to-visit-masai-mara": "Best Time to Visit Masai Mara",
  "amboseli-vs-masai-mara": "Amboseli vs Masai Mara",
  "great-migration-facts": "Great Migration Facts",
  "maasai-culture-guide": "Maasai Culture & Etiquette",
  "kenya-safari-packing-list": "Safari Packing List",
  "sustainable-tourism-kenya": "Sustainable Tourism",
  "diani-beach-guide": "Diani Beach Guide",
  "zanzibar-travel-guide": "Zanzibar Travel Guide",
  "kilimanjaro-climbing-tips": "Kilimanjaro Climbing Tips",
};

export const FOOTER_GUIDE_LINKS: { label: string; href: string }[] = GUIDE_SLUGS.map(
  (slug) => ({ label: GUIDE_LABELS[slug], href: `/travel-guide/${slug}` }),
);
