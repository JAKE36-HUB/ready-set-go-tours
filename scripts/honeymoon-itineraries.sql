-- Day-by-day itineraries for the honeymoon packages that were missing one.
-- The honeymoon detail page renders honeymoon_packages.itinerary, so this adds
-- the day-by-day section for each. Safe to re-run.
--
-- Packages updated here:
--   romantic-safari-beach, mount-kenya-romance, zanzibar-honeymoon,
--   tanzania-safari-zanzibar, diani-beach-honeymoon
-- (the ultra-luxury honeymoon already has an itinerary from its own migration.)

-- Romantic Safari & Beach (12 Days / 11 Nights) ------------------------
update honeymoon_packages
set itinerary = $$[
  {"day":"Day 1","title":"Arrival in Nairobi","description":"Arrive at Jomo Kenyatta International Airport and be met by your private host for the transfer to a boutique Nairobi hotel. Enjoy a relaxed evening and dinner at leisure as you settle into your East African honeymoon."},
  {"day":"Day 2","title":"Nairobi to the Masai Mara","description":"Fly by light aircraft to the Masai Mara and transfer to your private luxury tented camp. After lunch, set out on your first private game drive with your dedicated guide and vehicle as the plains come alive in the afternoon light."},
  {"day":"Day 3","title":"Masai Mara - Full Day of Private Game Drives","description":"Spend a full day on private game drives tracking the Big Five, breaking for a gourmet picnic on the savannah. As the sun lowers, toast your honeymoon with a champagne sundowner on the plains before returning to camp for dinner."},
  {"day":"Day 4","title":"Masai Mara - Balloon Safari & Bush Dinner","description":"Rise before dawn for an optional hot air balloon safari over the Mara, landing to a champagne breakfast. Rest through the middle of the day, enjoy an afternoon game drive, and end with a candlelit bush dinner for two under the stars."},
  {"day":"Day 5","title":"Masai Mara to Zanzibar","description":"A final morning game drive before your flight to Zanzibar. Transfer to your beachfront villa with a private plunge pool and a welcome dinner overlooking the Indian Ocean."},
  {"day":"Day 6","title":"Zanzibar - Beach at Leisure","description":"A full day to unwind together. Enjoy a floating breakfast in your private pool, wander the powder-white sand, and let the rhythms of island life set the pace."},
  {"day":"Day 7","title":"Couples Spa & Sunset Dhow Cruise","description":"Treat yourselves to a side-by-side couples massage in the morning, then set sail on a traditional dhow at sunset, gliding along the coast with drinks in hand as the sun slips into the sea."},
  {"day":"Day 8","title":"Snorkeling the Coral Reefs","description":"Take a boat trip out to the reefs for a day of snorkeling among vibrant coral and tropical fish, with time to swim and relax on a sandbank before returning to your villa."},
  {"day":"Day 9","title":"Island at Leisure","description":"A free day to enjoy Zanzibar your way - more time on the beach, a spa treatment, or an optional excursion. Your concierge can arrange anything you would like."},
  {"day":"Day 10","title":"Beach Day & Romantic Dinner","description":"Spend a slow morning by the pool, then a relaxed afternoon on the sand. In the evening, enjoy a private candlelit dinner on the beach as the tide comes in."},
  {"day":"Day 11","title":"Final Full Day in Paradise","description":"Your last full day on the island. Revisit a favourite spot, take a final swim, or simply do nothing at all - a perfect close to your honeymoon."},
  {"day":"Day 12","title":"Departure","description":"After a leisurely breakfast, transfer to Zanzibar International Airport for your onward flight home, carrying with you memories of safari and sea."}
]$$::jsonb,
updated_at = now()
where slug = 'romantic-safari-beach';

-- Mount Kenya Romantic Retreat (8 Days / 7 Nights) ---------------------
update honeymoon_packages
set itinerary = $$[
  {"day":"Day 1","title":"Arrival & Transfer to Nanyuki","description":"Arrive in Nairobi and meet your private chauffeur for the scenic drive to Nanyuki at the foot of Mount Kenya. Check in to your mountain lodge and enjoy dinner with views over the highlands."},
  {"day":"Day 2","title":"Mount Kenya Scenic Hike","description":"Head out with a private guide on a scenic hike on the lower slopes of Mount Kenya, walking through forest and moorland with sweeping views of the peaks. Return to the lodge for a relaxing afternoon."},
  {"day":"Day 3","title":"Ol Pejeta Conservancy Game Drive","description":"Spend the day in Ol Pejeta Conservancy on a private game drive, home to rhinos, lions and the Sweetwaters chimpanzee sanctuary. Enjoy a picnic lunch in the bush before returning to your lodge."},
  {"day":"Day 4","title":"Equator Experience & Bush Breakfast","description":"Visit the Equator line for a private ceremony and photo stop, followed by a bush breakfast served on the savannah. The afternoon is yours to relax at the lodge."},
  {"day":"Day 5","title":"Couples Spa & Treehouse Dinner","description":"Indulge in a couples spa treatment in the morning, then spend the afternoon at leisure. In the evening, dine privately at an exclusive treehouse above the bush, with a cocktail as the sun sets."},
  {"day":"Day 6","title":"Highlands at Leisure","description":"A full day to enjoy the lodge and its surroundings - horse riding, a garden walk, or simply the view of Mount Kenya from your suite. Optional activities can be arranged on request."},
  {"day":"Day 7","title":"Final Day in the Highlands","description":"Enjoy a gentle morning game drive or hike, then a farewell dinner prepared with farm-to-table ingredients. Savour your last night beneath the mountain."},
  {"day":"Day 8","title":"Return to Nairobi","description":"After breakfast, drive back to Nairobi with your chauffeur for your onward flight, bringing your Mount Kenya romance to a close."}
]$$::jsonb,
updated_at = now()
where slug = 'mount-kenya-romance';

-- Zanzibar Honeymoon Paradise (7 Days / 6 Nights) ----------------------
update honeymoon_packages
set itinerary = $$[
  {"day":"Day 1","title":"Arrival in Zanzibar","description":"Arrive at Zanzibar International Airport and transfer to your private beach villa with an infinity pool. Settle in and enjoy a welcome dinner as the sun sets over the Indian Ocean."},
  {"day":"Day 2","title":"Stone Town & Spice Plantation Tour","description":"Explore the historic lanes of Stone Town on a guided walk, visiting the old fort, markets and ornate doors, then continue to a spice plantation to smell and taste Zanzibar's famous spices."},
  {"day":"Day 3","title":"Prison Island & Snorkeling","description":"Take a boat to Prison Island to meet its giant Aldabra tortoises, then snorkel the surrounding reefs among colourful coral and tropical fish before returning to your villa."},
  {"day":"Day 4","title":"Beach Day & Beachside Massage","description":"A relaxed day on the powder-white sand with a beachside massage for two in the afternoon. Dinner is served barefoot on the beach as the tide comes in."},
  {"day":"Day 5","title":"Sunset Dhow Cruise","description":"Spend the morning at leisure, then board a traditional dhow for a sunset cruise along the coast, with drinks and canapes on board as the sun sinks into the sea."},
  {"day":"Day 6","title":"Zanzibar Cooking Class","description":"Join a hands-on Swahili cooking class and learn to prepare local dishes using fresh island ingredients, then enjoy your creations for lunch. The rest of the day is yours to relax."},
  {"day":"Day 7","title":"Departure","description":"After a final breakfast by the pool, transfer to the airport for your onward flight, bringing your Zanzibar honeymoon to a close."}
]$$::jsonb,
updated_at = now()
where slug = 'zanzibar-honeymoon';

-- Tanzania Safari & Zanzibar (14 Days / 13 Nights) ---------------------
update honeymoon_packages
set itinerary = $$[
  {"day":"Day 1","title":"Arrival in Arusha","description":"Arrive at Kilimanjaro International Airport and transfer to your lodge in Arusha. Meet your guide over dinner and prepare for the safari ahead."},
  {"day":"Day 2","title":"Arusha to Tarangire National Park","description":"Drive to Tarangire National Park, famous for its ancient baobabs and large elephant herds, and enjoy an afternoon game drive before settling into your lodge."},
  {"day":"Day 3","title":"Tarangire to Lake Manyara","description":"Travel to Lake Manyara National Park and take an afternoon game drive along the lake shore, looking out for tree-climbing lions, flamingos and abundant birdlife."},
  {"day":"Day 4","title":"Lake Manyara to the Serengeti","description":"Cross the Ngorongoro highlands and descend into the vast plains of the Serengeti, game viewing along the way, to arrive at your camp in the late afternoon."},
  {"day":"Day 5","title":"Full Day in the Serengeti","description":"A full day of game drives on the endless plains, tracking lions, cheetahs and leopards, with a picnic lunch in the bush and time among the Great Migration herds in season."},
  {"day":"Day 6","title":"Serengeti Balloon Safari & Bush Dinner","description":"Optionally rise before dawn for a hot air balloon safari over the Serengeti, landing to a champagne breakfast. Enjoy a further game drive and, in the evening, a private bush dinner under the stars."},
  {"day":"Day 7","title":"Serengeti to Ngorongoro","description":"A morning game drive before transferring to the Ngorongoro Conservation Area to overnight on the crater rim, with sweeping views over the caldera."},
  {"day":"Day 8","title":"Ngorongoro Crater Tour","description":"Descend early into the Ngorongoro Crater, the world's largest intact volcanic caldera, for a half-day game drive among the Big Five and a picnic lunch on the crater floor."},
  {"day":"Day 9","title":"Ngorongoro to Arusha & Fly to Zanzibar","description":"Ascend from the crater and drive back to Arusha, then fly to Zanzibar. Transfer to your beach resort and unwind after the adventure."},
  {"day":"Day 10","title":"Zanzibar - Beach at Leisure","description":"Your first full day on the island. Relax by the pool and on the white sand, with a spa treatment for two available at your resort."},
  {"day":"Day 11","title":"Sunset Dhow Cruise","description":"Spend the morning at leisure, then take a traditional dhow cruise at sunset along the coast with drinks on board as the sky turns gold."},
  {"day":"Day 12","title":"Beach & Spa Day","description":"A day of pure relaxation - time on the beach, a couples massage at the spa, and a romantic dinner on the sand in the evening."},
  {"day":"Day 13","title":"Final Island Day","description":"Your last full day in Zanzibar. Take a final swim, revisit a favourite spot, or simply enjoy the villa before one last sunset."},
  {"day":"Day 14","title":"Departure","description":"After breakfast, transfer to Zanzibar International Airport for your onward flight, closing your safari-and-beach honeymoon."}
]$$::jsonb,
updated_at = now()
where slug = 'tanzania-safari-zanzibar';

-- Diani Beach Honeymoon Bliss (6 Days / 5 Nights) ----------------------
update honeymoon_packages
set itinerary = $$[
  {"day":"Day 1","title":"Arrival & Welcome to Diani Beach","description":"Arrive at Ukunda airstrip or Mombasa and meet your private driver for the transfer to your boutique beach resort at Diani. Check in to your room with its private pool, then spend the late afternoon strolling the powder-white sand. As evening falls, enjoy a welcome dinner by the ocean as the sun sets over the Indian Ocean."},
  {"day":"Day 2","title":"Dolphin Spotting & Kisite-Mpunguti Snorkeling","description":"After breakfast, drive to Shimoni and board a boat for the Kisite-Mpunguti Marine Park, one of the best snorkeling sites on the Kenyan coast. Swim among coral gardens and look out for dolphins, then enjoy a fresh seafood lunch on Wasini Island before returning to Diani in the afternoon. The evening is yours to relax together."},
  {"day":"Day 3","title":"Beach Day & Couples Massage","description":"A day to slow down. Enjoy breakfast at the resort, then time together by your private pool and on the beach. In the afternoon, unwind with a side-by-side couples massage at the spa, followed by a romantic candlelit dinner for two on the sand."},
  {"day":"Day 4","title":"Sunset Dhow Cruise & Ali Barbour Cave Dinner","description":"Spend a relaxed morning at leisure, then set sail on a private sunset dhow cruise along the coast, gliding past palm-fringed shores with drinks on board as the sun drops into the Indian Ocean. End the day with dinner at the Ali Barbour Cave Restaurant, set inside a natural coral cave."},
  {"day":"Day 5","title":"Free Day on the Coast","description":"A full day at leisure to enjoy Diani exactly as you wish. Optional extras include kite surfing, horseback riding along the beach, a visit to the Colobus Conservation Centre, or simply more time relaxing poolside. Your concierge can arrange anything you would like."},
  {"day":"Day 6","title":"Departure","description":"Enjoy a final breakfast by the beach and some free time before checking out. Transfer to Ukunda airstrip or Mombasa for your onward flight, bringing your Diani honeymoon bliss to a close."}
]$$::jsonb,
updated_at = now()
where slug = 'diani-beach-honeymoon';

-- Verify: every honeymoon package should have at least one itinerary day.
select slug, jsonb_array_length(itinerary) as days
from honeymoon_packages
order by slug;
