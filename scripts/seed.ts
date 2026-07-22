import { createClient } from "@supabase/supabase-js"
import {
  TOUR_PACKAGES,
  DEALS,
  HONEYMOON_PACKAGES,
  DESTINATIONS,
  GALLERY,
  BLOG_POSTS,
} from "../src/lib/constants"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log("Seeding tour_packages...")
  const packages = TOUR_PACKAGES.map((p) => ({
    name: p.name,
    slug: p.slug,
    type: p.type,
    image: p.image || "",
    price: p.price,
    price_kes: p.priceKES || null,
    duration: p.duration,
    accommodation: p.accommodation || "",
    meals: p.meals || "",
    transport: p.transport || "",
    activities: p.activities || [],
    description: p.description || "",
    highlights: p.highlights || [],
    included: p.included || [],
    excluded: p.excluded || [],
  }))
  const { error: pkgErr } = await supabase.from("tour_packages").upsert(packages, { onConflict: "slug" })
  if (pkgErr) console.error("  Error:", pkgErr.message)
  else console.log(`  Inserted ${packages.length} packages`)

  console.log("Seeding deals...")
  const deals = DEALS.map((d) => ({
    title: d.title,
    slug: d.slug,
    description: d.description || "",
    discount: d.discount || "",
    code: d.code || "",
    image: d.image || "",
    type: d.type,
    original_price: d.originalPrice,
    deal_price: d.dealPrice,
    price_kes: d.priceKES || null,
    valid_until: d.validUntil || "",
    highlights: d.highlights || [],
    featured: d.featured || false,
    duration: d.duration || "",
    accommodation: d.accommodation || "",
    meals: d.meals || "",
    included: d.included || [],
    itinerary: d.itinerary || [],
  }))
  const { error: dealErr } = await supabase.from("deals").upsert(deals, { onConflict: "slug" })
  if (dealErr) console.error("  Error:", dealErr.message)
  else console.log(`  Inserted ${deals.length} deals`)

  console.log("Seeding honeymoon_packages...")
  const honeymoon = HONEYMOON_PACKAGES.map((h) => ({
    name: h.name,
    slug: h.slug,
    image: h.image || "",
    price: h.price,
    price_kes: h.priceKES || null,
    duration: h.duration,
    accommodation: h.accommodation || "",
    meals: h.meals || "",
    transport: h.transport || "",
    activities: h.activities || [],
    description: h.description || "",
    highlights: h.highlights || [],
    included: h.included || [],
  }))
  const { error: hmErr } = await supabase.from("honeymoon_packages").upsert(honeymoon, { onConflict: "slug" })
  if (hmErr) console.error("  Error:", hmErr.message)
  else console.log(`  Inserted ${honeymoon.length} honeymoon packages`)

  console.log("Seeding destinations...")
  const allDests = [...(DESTINATIONS.kenya || []), ...(DESTINATIONS.tanzania || [])]
  const dests = allDests.map((d) => ({
    name: d.name,
    slug: d.slug,
    image: d.image || "",
    description: d.description || "",
    rating: d.rating || 0,
    best_time: d.bestTime || "",
    duration: d.duration || "",
    starting_price: d.startingPrice || 0,
    highlights: d.highlights || [],
    region: (DESTINATIONS.kenya?.includes(d) ? "kenya" : "tanzania"),
  }))
  const { error: destErr } = await supabase.from("destinations").upsert(dests, { onConflict: "slug" })
  if (destErr) console.error("  Error:", destErr.message)
  else console.log(`  Inserted ${dests.length} destinations`)

  console.log("Seeding gallery...")
  const images = GALLERY.images.map((img) => ({
    src: img.src,
    alt: img.alt || "",
    category: img.category || "uncategorized",
    width: img.width || 800,
    height: img.height || 600,
  }))
  const { error: galErr } = await supabase.from("gallery").insert(images)
  if (galErr) console.error("  Error:", galErr.message)
  else console.log(`  Inserted ${images.length} gallery images`)

  console.log("Seeding blog_posts...")
  const posts = BLOG_POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    content: p.content || [],
    image: p.image || "",
    author: p.author || "",
    date: p.date || "",
    category: p.category || "",
  }))
  const { error: blogErr } = await supabase.from("blog_posts").upsert(posts, { onConflict: "slug" })
  if (blogErr) console.error("  Error:", blogErr.message)
  else console.log(`  Inserted ${posts.length} blog posts`)

  console.log("\nDone!")
}

seed().catch(console.error)
