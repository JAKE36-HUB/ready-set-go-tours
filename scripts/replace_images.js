/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "constants.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Map of entry identifiers -> new photo ID suffix
// Each entry: [searchString, photoId, type]
// type: "name" = match name:"..." field, "alt" = match alt:"..." field
const replacements = [
  // ===== KENYA DESTINATIONS =====
  { id: "Masai Mara National Reserve",         type: "name", photo: "O17rR0KwzfY" },
  { id: "Amboseli National Park",               type: "name", photo: "cKmOKLaNKU0" },
  { id: "Samburu National Reserve",             type: "name", photo: "2EjAS6rvP68" },
  { id: "Lake Nakuru National Park",            type: "name", photo: "L9vyXQbFJ2Q" },
  { id: "Tsavo National Park",                  type: "name", photo: "0V4thhIhESk" },
  { id: "Laikipia Plateau",                     type: "name", photo: "RKgC_y92rhQ" },
  { id: "Nairobi National Park",                type: "name", photo: "IwoOPriU39k" },
  { id: "Mount Kenya Region",                   type: "name", photo: "xGXBZGOywaY" },

  // ===== TANZANIA DESTINATIONS =====
  { id: "Serengeti National Park",              type: "name", photo: "xSbyDPqSZ-c" },
  { id: "Ngorongoro Crater",                    type: "name", photo: "uCtcE2T3jpQ" },
  { id: "Mount Kilimanjaro",                    type: "name", photo: "xU9m2eAkXjA" },
  { id: "Tarangire National Park",              type: "name", photo: "b9qgL8l4HqU" },
  { id: "Lake Manyara National Park",           type: "name", photo: "6YAvyXxCN0c" },
  { id: "Selous Game Reserve",                  type: "name", photo: "G_Cy10bkyiE" },

  // ===== TOUR PACKAGES =====
  { id: "Ultimate Kenya Safari",                type: "name", photo: "b_6c0-CYSdg" },
  { id: "Tanzania Northern Circuit",            type: "name", photo: "Y_i98yL5Q9s" },
  { id: "Kenya & Tanzania Combo",               type: "name", photo: "8Sjcc4vExpg" },
  { id: "Luxury Masai Mara Experience",         type: "name", photo: "JWoA1TmIEnk" },
  { id: "Kilimanjaro Climb - Machame Route",    type: "name", photo: "SF6uLVWwzPE" },
  { id: "Diani Beach Luxury Getaway",           type: "name", photo: "m_06_L3cKY0" },
  { id: "Zanzibar Beach Holiday",               type: "name", photo: "LiSiH49JHLQ" },
  { id: "Maasai Cultural Immersion",            type: "name", photo: "nayS2zjJpGw" },
  { id: "Great Migration Package",              type: "name", photo: "1pZJqQlgpsY" },
  { id: "Luxury Kenya Honeymoon",               type: "name", photo: "sqTXTCtdmIY" },
  { id: "Affordable Group Safari",              type: "name", photo: "sQ4T1pptMXw" },
  { id: "Laikipia Private Conservancy",         type: "name", photo: "rlr0oaz2nZQ" },
  { id: "Lake Naivasha Weekend Escape",         type: "name", photo: "q4OSqzk5QrE" },
  { id: "Amboseli & Tsavo Safari",              type: "name", photo: "PXr96f_622A" },
  { id: "Tanzania Luxury Safari",               type: "name", photo: "pZo2wyXQr-Q" },
  { id: "Hell's Gate & Naivasha Cycling Safari", type: "name", photo: "oHZxLHlb550" },

  // ===== BEACH DESTINATIONS =====
  { id: "Diani Beach",                          type: "name", photo: "m_06_L3cKY0" },
  { id: "Zanzibar Island",                      type: "name", photo: "Yjiwmw0pbuM" },
  { id: "Watamu Marine Park",                   type: "name", photo: "6F4v5ShIiLg" },
  { id: "Mombasa North Coast",                  type: "name", photo: "-H-RIdpeEno" },
  { id: "Malindi & Watamu",                     type: "name", photo: "88_hfUbp4g0" },
  { id: "Lamu Archipelago",                     type: "name", photo: "I2JrrXqxsu0" },
  { id: "Pemba Island",                         type: "name", photo: "OFLviU95E28" },
  { id: "Mafia Island",                         type: "name", photo: "pZo2wyXQr-Q" },

  // ===== EXPERIENCES =====
  { id: "Hot Air Balloon Safari",               type: "name", photo: "89IBtfoz3Vw" },
  { id: "Bush Dining Under the Stars",          type: "name", photo: "JWoA1TmIEnk" },
  { id: "Walking Safaris",                      type: "name", photo: "oH_BONGrgzU" },
  { id: "Horseback Safaris",                    type: "name", photo: "RKgC_y92rhQ" },
  { id: "Dhow Sunset Cruises",                  type: "name", photo: "88_hfUbp4g0" },
  { id: "Maasai Village Visits",                type: "name", photo: "DxMetrEVChM" },
  { id: "Mountain Trekking",                    type: "name", photo: "HJ1bmTePoGU" },
  { id: "Photography Safaris",                  type: "name", photo: "aejQcXWZlDU" },
  { id: "Spice Tours",                          type: "name", photo: "JXUkZmmGxHg" },
  { id: "Conservation Experiences",             type: "name", photo: "hLIZvmKp73U" },

  // ===== GALLERY (matched by alt text) =====
  { id: "Masai Mara golden sunset",             type: "alt",   photo: "O17rR0KwzfY" },
  { id: "Lioness in Serengeti",                 type: "alt",   photo: "mTPYSr_ce1A" },
  { id: "Safari vehicle in wilderness",         type: "alt",   photo: "oHZxLHlb550" },
  { id: "Tropical beach",                       type: "alt",   photo: "-H-RIdpeEno" },
  { id: "Maasai warriors dancing",              type: "alt",   photo: "nayS2zjJpGw" },
  { id: "Luxury safari lodge",                  type: "alt",   photo: "sqTXTCtdmIY" },
  { id: "Elephants in Amboseli",                type: "alt",   photo: "wAhWsuWmfoc" },
  { id: "Mount Kilimanjaro",                    type: "alt",   photo: "5dDDoDnV0c8" },
  { id: "Zanzibar beach",                       type: "alt",   photo: "pZo2wyXQr-Q" },
  { id: "Diani Beach",                          type: "alt",   photo: "m_06_L3cKY0" },
  { id: "Cheetah in Tsavo",                     type: "alt",   photo: "rZEAO_AlWrs" },
  { id: "Flamingos at Lake Nakuru",             type: "alt",   photo: "9Pq-_MKOL7A" },
  { id: "Horseback safari in Laikipia",         type: "alt",   photo: "2EjAS6rvP68" },
  { id: "Nairobi skyline",                      type: "alt",   photo: "7QK-EU6sOTw" },
  { id: "Maasai market",                        type: "alt",   photo: "JMz-UTimlu0" },
  { id: "Premium safari camp",                  type: "alt",   photo: "JWoA1TmIEnk" },

  // ===== BLOG POSTS =====
  { id: "Best Time to Visit Masai Mara: A Complete Month-by-Month Guide", type: "name", photo: "b_6c0-CYSdg" },
  { id: "Essential Kilimanjaro Climbing Tips for First-Time Summiteers", type: "name", photo: "xU9m2eAkXjA" },
  { id: "Zanzibar Travel Guide: Beaches, Culture & Spice Island Adventures", type: "name", photo: "LiSiH49JHLQ" },
  { id: "Ultimate Kenya Safari Packing List: What to Bring on Safari", type: "name", photo: "sQ4T1pptMXw" },
  { id: "The Great Migration: Fascinating Facts About Nature's Greatest Spectacle", type: "name", photo: "1pZJqQlgpsY" },
  { id: "Top 10 Luxury Safari Lodges in Kenya for an Unforgettable Stay", type: "name", photo: "sqTXTCtdmIY" },
  { id: "Maasai Culture: Traditions, Customs & Visiting Etiquette", type: "name", photo: "DxMetrEVChM" },
  { id: "Diani Beach Guide: Kenya's Tropical Paradise", type: "name", photo: "m_06_L3cKY0" },
  { id: "Amboseli vs Masai Mara: Which Kenyan Safari Destination Is Right for You?", type: "name", photo: "cKmOKLaNKU0" },
  { id: "How to Travel Responsibly: Sustainable Tourism in Kenya", type: "name", photo: "Lv7PRE8e_ew" },
];

// Check for duplicate photo IDs in our assignments
const usedPhotos = {};
for (const r of replacements) {
  if (usedPhotos[r.photo]) {
    console.log("DUPLICATE PHOTO " + r.photo + " for \"" + usedPhotos[r.photo] + "\" and \"" + r.id + "\"");
  }
  usedPhotos[r.photo] = r.id;
}

let ok = 0,
    notFound = 0;

// Process each replacement
for (const r of replacements) {
  const escaped = r.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let pattern;

  if (r.type === "name") {
    // Match: name: "Entry Name" ... image: "https://...photo-OLDID?..."
    pattern = new RegExp(
      '(name:\\s*"' + escaped + '"[\\s\\S]*?image:\\s*"https://images\\.unsplash\\.com/photo-)[\\w-]+',
      "g"
    );
  } else if (r.type === "alt") {
    // Match: alt: "Alt Text" ... src: "https://...photo-OLDID?..."
    pattern = new RegExp(
      '(alt:\\s*"' + escaped + '"[\\s\\S]*?src:\\s*"https://images\\.unsplash\\.com/photo-)[\\w-]+',
      "g"
    );
  }

  if (!pattern) {
    console.log("ERROR: Unknown type " + r.type + " for " + r.id);
    continue;
  }

  const match = content.match(pattern);
  if (match) {
    content = content.replace(pattern, (matched) => {
      return matched.replace(/photo-[\w-]+$/, "photo-" + r.photo);
    });
    ok++;
  } else {
    console.log("NOT FOUND: " + r.id);
    notFound++;
  }
}

console.log("\nResults: " + ok + " replaced, " + notFound + " not found");

// Write file back
fs.writeFileSync(filePath, content, "utf-8");
console.log("File saved!");
