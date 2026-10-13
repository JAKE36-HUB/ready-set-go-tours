-- =====================================================================
-- Beach holiday packages: seed 8 coastal destinations into tour_packages
-- Run this in the Supabase SQL editor (copy the WHOLE file content).
-- Idempotent: safe to run more than once (ON CONFLICT slug DO UPDATE).
-- These rows power the /holiday-packages/[slug] detail pages linked from
-- the /beach-holidays listing.
-- =====================================================================

-- 1. Schema (safe if the itinerary migration has not been run yet) -----
ALTER TABLE tour_packages
  ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS optional_activities JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Beach packages ----------------------------------------------------

-- Diani Beach ---------------------------------------------------------
INSERT INTO tour_packages
  (name, slug, type, image, price, price_kes, duration, accommodation, meals, transport, activities, description, highlights, included, excluded, itinerary, optional_activities, notes)
VALUES (
  'Diani Beach',
  'diani-beach',
  'beach',
  '/images/local/pin_d6386bfb23f6e51f7d020e0e4546def5.jpg',
  2200, 286000,
  '5 Days / 4 Nights',
  'Almanara Luxury Resort or similar',
  'Breakfast & dinner (half board)',
  'Return transfers from Ukunda airstrip or Mombasa',
  ARRAY['Snorkeling','Kite surfing','Dhow cruise','Colobus monkey sanctuary','Deep-sea fishing','Beach relaxation'],
  'Kenya''s premier beach destination with 17km of powdery white sand, turquoise waters, and lush tropical vegetation. Rated among Africa''s best beaches.',
  ARRAY['White sand beaches','Coral reefs','Kite surfing','Deep-sea fishing','Colobus monkeys'],
  ARRAY['4 nights at a luxury beach resort','Meals as specified in the itinerary','Return airstrip or airport transfers','Snorkeling excursion to Kisite-Mpunguti Marine Park','Sunset dhow cruise','Professional driver-guide','All government taxes and park fees'],
  ARRAY['International and domestic flights','Travel insurance','Visa fees','Drinks and items of a personal nature','Optional activities','Gratuities'],
  $$[
    {"day":"Day 1","title":"Arrival on the South Coast","description":"Arrive at Ukunda airstrip or Mombasa and meet your driver for the transfer to your beach resort at Diani. Check in and settle into your room, then spend the late afternoon at leisure on the white sand. Enjoy a welcome dinner by the ocean as the sun sets over the Indian Ocean.","meals":"Dinner","accommodation":"Almanara Luxury Resort or similar","activities":["Resort transfer","Beach at leisure"],"highlights":["First glimpse of Diani Beach","Sunset over the Indian Ocean"]},
    {"day":"Day 2","title":"Snorkeling at Kisite-Mpunguti and Wasini Island","description":"After breakfast, drive to Shimoni and board a boat for Kisite-Mpunguti Marine Park, one of the best snorkeling sites on the Kenyan coast. Swim among coral gardens and look out for dolphins, then enjoy a fresh seafood lunch on Wasini Island before returning to Diani in the afternoon.","meals":"Breakfast, Lunch & Dinner","accommodation":"Almanara Luxury Resort or similar","activities":["Boat trip to Kisite-Mpunguti Marine Park","Snorkeling","Wasini Island seafood lunch"],"highlights":["Coral gardens","Dolphin sightings"]},
    {"day":"Day 3","title":"Colobus Conservation and Beach Leisure","description":"Visit the Colobus Conservation centre to learn about the endangered Angolan colobus monkeys that live in the coastal forest, then return to the resort for an afternoon at leisure. Kite surfing lessons and a spa treatment can be arranged on request.","meals":"Breakfast & Dinner","accommodation":"Almanara Luxury Resort or similar","activities":["Colobus Conservation visit","Beach at leisure","Optional kite surfing lesson (extra cost)"],"highlights":["Colobus monkeys","Coastal forest"]},
    {"day":"Day 4","title":"Blue Safari or Deep-Sea Fishing","description":"Choose a relaxing beach day or an optional deep-sea fishing charter in search of sailfish and marlin. In the late afternoon enjoy a sunset dhow cruise along the reef before dinner at the resort.","meals":"Breakfast & Dinner","accommodation":"Almanara Luxury Resort or similar","activities":["Beach at leisure","Optional deep-sea fishing (extra cost)","Sunset dhow cruise"],"highlights":["Reef sunset","Indian Ocean sailing"]},
    {"day":"Day 5","title":"Departure","description":"Enjoy a final breakfast by the beach and some free time before checking out. Transfer to Ukunda airstrip or Mombasa for your onward flight, bringing your Diani beach holiday to a close.","meals":"Breakfast","accommodation":"-","activities":["Check out","Return transfer to airstrip or airport"],"highlights":["Final morning by the sea"]}
  ]$$::jsonb,
  $$[
    {"name":"Snorkeling at Kisite-Mpunguti Marine Park","price":null,"price_text":"On request"},
    {"name":"Wasini Island dhow lunch","price":null,"price_text":"On request"},
    {"name":"Deep-sea fishing charter","price":null,"price_text":"On request"},
    {"name":"Kite surfing lesson","price":null,"price_text":"On request"}
  ]$$::jsonb,
  $notes$
Best time to travel
Diani is a year-round destination. The driest and sunniest months are January to March and July to October. The long rains fall in April and May, with short rains in November.

Getting there
Ukunda airstrip is a 15-minute flight from Mombasa or about 30 minutes from Nairobi Wilson. Road transfers from Mombasa take around 1 hour 30 minutes.

What to bring
Light clothing, swimwear, reef-safe sunscreen, a hat, and a light rain jacket for the shoulder seasons.
  $notes$
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, image = EXCLUDED.image,
  price = EXCLUDED.price, price_kes = EXCLUDED.price_kes, duration = EXCLUDED.duration,
  accommodation = EXCLUDED.accommodation, meals = EXCLUDED.meals, transport = EXCLUDED.transport,
  activities = EXCLUDED.activities, description = EXCLUDED.description,
  highlights = EXCLUDED.highlights, included = EXCLUDED.included, excluded = EXCLUDED.excluded,
  itinerary = EXCLUDED.itinerary, optional_activities = EXCLUDED.optional_activities,
  notes = EXCLUDED.notes, updated_at = NOW();

-- Zanzibar Island -----------------------------------------------------
INSERT INTO tour_packages
  (name, slug, type, image, price, price_kes, duration, accommodation, meals, transport, activities, description, highlights, included, excluded, itinerary, optional_activities, notes)
VALUES (
  'Zanzibar Island',
  'zanzibar-island',
  'beach',
  '/images/local/pin_ecf9c45a7a976f4151b88235e8396c06.jpg',
  2500, 325000,
  '6 Days / 5 Nights',
  'Zuri Zanzibar or similar',
  'Breakfast & dinner (half board)',
  'Return airport transfers and inter-resort transfers',
  ARRAY['Stone Town tour','Spice plantation tour','Mnemba Atoll snorkeling','Sunset dhow cruise','Prison Island','Beach relaxation'],
  'The Spice Island offers crystal-clear waters, historic Stone Town, and pristine beaches like Nungwi and Kendwa. A perfect cultural-beach fusion.',
  ARRAY['Stone Town UNESCO','Spice plantations','Mnemba Atoll','Sunset dhow cruises','Prison Island'],
  ARRAY['5 nights in Stone Town and a beach resort','Meals as specified in the itinerary','Return airport transfers','Guided Stone Town walking tour','Spice plantation tour','Mnemba Atoll snorkeling excursion','All government taxes and marine park fees'],
  ARRAY['International and domestic flights','Travel insurance','Visa fees','Drinks and items of a personal nature','Optional activities','Gratuities'],
  $$[
    {"day":"Day 1","title":"Arrival in Stone Town","description":"Arrive at Abeid Amani Karume International Airport and meet your guide for the transfer to your Stone Town hotel. After checking in, take an evening stroll along the seafront promenade and watch the dhows sail past.","meals":"Dinner","accommodation":"Boutique hotel in Stone Town","activities":["Airport transfer","Seafront evening walk"],"highlights":["Stone Town waterfront","Zanzibar sunset"]},
    {"day":"Day 2","title":"Stone Town and Spice Farm","description":"Explore the UNESCO World Heritage Site of Stone Town on a guided walking tour, visiting the Old Fort, the House of Wonders, and the bustling Darajani market. In the afternoon, tour a spice plantation to see and smell cloves, cinnamon, nutmeg and vanilla.","meals":"Breakfast, Lunch & Dinner","accommodation":"Boutique hotel in Stone Town","activities":["Guided Stone Town walking tour","Spice plantation tour"],"highlights":["UNESCO Stone Town","Spice Island heritage"]},
    {"day":"Day 3","title":"Transfer to the North Beaches","description":"After a leisurely breakfast, drive north to the beaches of Nungwi or Kendwa, known for their wide white sands and calm turquoise water. Spend the afternoon at leisure and watch one of Zanzibar's famous sunsets.","meals":"Breakfast & Dinner","accommodation":"Zuri Zanzibar or similar","activities":["Transfer to the north coast","Beach at leisure"],"highlights":["Nungwi and Kendwa beaches","Sunset views"]},
    {"day":"Day 4","title":"Mnemba Atoll Snorkeling and Dhow Cruise","description":"Board a dhow for a snorkeling trip to Mnemba Atoll, a protected reef with exceptional visibility and rich marine life including turtles and reef fish. A seafood lunch is served on board before you return to the resort.","meals":"Breakfast, Lunch & Dinner","accommodation":"Zuri Zanzibar or similar","activities":["Dhow trip to Mnemba Atoll","Snorkeling","Lunch on board"],"highlights":["Mnemba Atoll reef","Turtle sightings"]},
    {"day":"Day 5","title":"Prison Island and Beach Time","description":"Take a short boat ride to Changuu Island, also known as Prison Island, to meet its giant Aldabra tortoises. Snorkel in the surrounding shallows, then return to the resort for a relaxed afternoon on the beach.","meals":"Breakfast & Dinner","accommodation":"Zuri Zanzibar or similar","activities":["Boat trip to Prison Island","Giant tortoise visit","Snorkeling","Beach at leisure"],"highlights":["Giant tortoises","Reef snorkeling"]},
    {"day":"Day 6","title":"Departure","description":"Enjoy breakfast with a view of the ocean before checking out. Transfer to the airport for your departure flight, ending your Zanzibar holiday.","meals":"Breakfast","accommodation":"-","activities":["Check out","Return airport transfer"],"highlights":["Final morning on the beach"]}
  ]$$::jsonb,
  $$[
    {"name":"Safari Blue full-day dhow cruise","price":null,"price_text":"On request"},
    {"name":"Scuba diving","price":null,"price_text":"On request"},
    {"name":"Jozani Forest red colobus tour","price":null,"price_text":"On request"},
    {"name":"Sunset dhow cruise","price":null,"price_text":"On request"}
  ]$$::jsonb,
  $notes$
Best time to travel
Zanzibar is warm year-round. The best conditions are June to October and December to February. The long rains fall in April and May.

Getting there
Abeid Amani Karume International Airport has direct flights from Nairobi, Dar es Salaam and several international cities. Ferries also run from Dar es Salaam.

Local customs
Zanzibar is predominantly Muslim. Modest dress is appreciated away from the beach, and during Ramadan some restaurants and shops operate reduced hours.
  $notes$
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, image = EXCLUDED.image,
  price = EXCLUDED.price, price_kes = EXCLUDED.price_kes, duration = EXCLUDED.duration,
  accommodation = EXCLUDED.accommodation, meals = EXCLUDED.meals, transport = EXCLUDED.transport,
  activities = EXCLUDED.activities, description = EXCLUDED.description,
  highlights = EXCLUDED.highlights, included = EXCLUDED.included, excluded = EXCLUDED.excluded,
  itinerary = EXCLUDED.itinerary, optional_activities = EXCLUDED.optional_activities,
  notes = EXCLUDED.notes, updated_at = NOW();

-- Watamu Marine Park --------------------------------------------------
INSERT INTO tour_packages
  (name, slug, type, image, price, price_kes, duration, accommodation, meals, transport, activities, description, highlights, included, excluded, itinerary, optional_activities, notes)
VALUES (
  'Watamu Marine Park',
  'watamu-marine-park',
  'beach',
  '/images/local/pin_563fb5f6b888c428e9063ed8bfb86128.jpg',
  1800, 234000,
  '4 Days / 3 Nights',
  'Watamu Treehouse or similar',
  'Breakfast & dinner (half board)',
  'Return transfers from Malindi airstrip or Mombasa',
  ARRAY['Snorkeling in the marine park','Glass-bottom boat','Mida Creek boardwalk','Gede Ruins','Sea turtle watching','Birdwatching'],
  'A protected marine reserve with pristine coral gardens, sea turtles, and the famous Mida Creek. One of Kenya''s best snorkeling destinations.',
  ARRAY['Coral gardens','Sea turtles','Mida Creek','Snorkeling','Birdwatching'],
  ARRAY['3 nights at a boutique beach hotel','Meals as specified in the itinerary','Return airstrip or airport transfers','Snorkeling or glass-bottom boat trip in Watamu Marine Park','Gede Ruins guided visit','All government taxes and marine park fees'],
  ARRAY['International and domestic flights','Travel insurance','Visa fees','Drinks and items of a personal nature','Optional activities','Gratuities'],
  $$[
    {"day":"Day 1","title":"Arrival at Watamu","description":"Meet your driver at Malindi airstrip or Mombasa for the transfer to Watamu. Check in to your hotel and settle in, then take an afternoon walk along the beach as the tide recedes over the reef.","meals":"Dinner","accommodation":"Watamu Treehouse or similar","activities":["Resort transfer","Beach walk"],"highlights":["Watamu shoreline","Reef at low tide"]},
    {"day":"Day 2","title":"Watamu Marine Park Snorkeling","description":"Spend the morning exploring Watamu Marine National Park by glass-bottom boat or on a snorkeling trip over the coral gardens, home to colourful reef fish and green sea turtles. In the afternoon, visit the nearby Gede Ruins, a mysterious abandoned Swahili town.","meals":"Breakfast, Lunch & Dinner","accommodation":"Watamu Treehouse or similar","activities":["Snorkeling in Watamu Marine Park","Glass-bottom boat trip","Gede Ruins visit"],"highlights":["Coral gardens","Sea turtles","Gede Ruins"]},
    {"day":"Day 3","title":"Mida Creek and Turtle Watching","description":"Discover Mida Creek on its famous boardwalk, a haven for mangroves, crabs and wading birds such as flamingos and egrets. In the evening, join an optional guided turtle watch as nesting turtles come ashore (seasonal).","meals":"Breakfast & Dinner","accommodation":"Watamu Treehouse or similar","activities":["Mida Creek boardwalk","Birdwatching","Optional turtle nesting watch (seasonal)"],"highlights":["Mangrove creek","Turtle nesting (seasonal)"]},
    {"day":"Day 4","title":"Departure","description":"After a relaxed breakfast and some final time on the beach, check out and transfer to Malindi airstrip or Mombasa for your onward journey.","meals":"Breakfast","accommodation":"-","activities":["Check out","Return transfer to airstrip or airport"],"highlights":["Final morning by the reef"]}
  ]$$::jsonb,
  $$[
    {"name":"Scuba diving course","price":null,"price_text":"On request"},
    {"name":"Deep-sea fishing","price":null,"price_text":"On request"},
    {"name":"Arabuko Sokoke forest walk","price":null,"price_text":"On request"},
    {"name":"Mida Creek canoe safari","price":null,"price_text":"On request"}
  ]$$::jsonb,
  $notes$
Best time to travel
Watamu is a good year-round destination. The clearest water for snorkeling is usually January to March and October to December. The long rains fall in April and May.

Getting there
Malindi airstrip is a short flight from Nairobi Wilson or Mombasa. Road transfers from Mombasa take about 2 hours.

Marine park rules
Watamu Marine National Park is a protected reserve. Please do not touch coral, stand on the reef, or collect shells, and always use reef-safe sunscreen.
  $notes$
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, image = EXCLUDED.image,
  price = EXCLUDED.price, price_kes = EXCLUDED.price_kes, duration = EXCLUDED.duration,
  accommodation = EXCLUDED.accommodation, meals = EXCLUDED.meals, transport = EXCLUDED.transport,
  activities = EXCLUDED.activities, description = EXCLUDED.description,
  highlights = EXCLUDED.highlights, included = EXCLUDED.included, excluded = EXCLUDED.excluded,
  itinerary = EXCLUDED.itinerary, optional_activities = EXCLUDED.optional_activities,
  notes = EXCLUDED.notes, updated_at = NOW();

-- Mombasa North Coast -------------------------------------------------
INSERT INTO tour_packages
  (name, slug, type, image, price, price_kes, duration, accommodation, meals, transport, activities, description, highlights, included, excluded, itinerary, optional_activities, notes)
VALUES (
  'Mombasa North Coast',
  'mombasa-north-coast',
  'beach',
  '/images/local/pin_ecf9c45a7a976f4151b88235e8396c06.jpg',
  1600, 208000,
  '4 Days / 3 Nights',
  'PrideInn Paradise Beach Resort or similar',
  'Breakfast & dinner (half board)',
  'Return transfers from Moi International Airport',
  ARRAY['Water sports','Fort Jesus tour','Old Town walk','Haller Park','Beach relaxation','Nightlife'],
  'Vibrant beach resorts along Nyali, Bamburi, and Shanzu beaches. Close to Mombasa''s historic Old Town and Fort Jesus with excellent water sports.',
  ARRAY['Water sports','Fort Jesus','Haller Park','Nightlife','Beach resorts'],
  ARRAY['3 nights at a beach resort','Meals as specified in the itinerary','Return airport transfers','Guided Mombasa city tour including Fort Jesus','Haller Park visit','All government taxes and entry fees'],
  ARRAY['International and domestic flights','Travel insurance','Visa fees','Drinks and items of a personal nature','Optional activities','Gratuities'],
  $$[
    {"day":"Day 1","title":"Arrival in Mombasa","description":"Arrive at Moi International Airport and transfer to your resort on the north coast at Nyali, Bamburi or Shanzu. Check in, settle into your room and spend the afternoon relaxing by the pool or on the beach.","meals":"Dinner","accommodation":"PrideInn Paradise Beach Resort or similar","activities":["Airport transfer","Beach and pool at leisure"],"highlights":["North coast beaches","Indian Ocean views"]},
    {"day":"Day 2","title":"Mombasa Old Town and Fort Jesus","description":"Enjoy a guided tour of Mombasa's historic Old Town and the UNESCO-listed Fort Jesus, built by the Portuguese in the 16th century. In the afternoon, visit Haller Park to see giraffes, hippos and giant tortoises up close.","meals":"Breakfast, Lunch & Dinner","accommodation":"PrideInn Paradise Beach Resort or similar","activities":["Guided Old Town walk","Fort Jesus tour","Haller Park visit"],"highlights":["UNESCO Fort Jesus","Haller Park wildlife"]},
    {"day":"Day 3","title":"Water Sports and Beach Leisure","description":"Spend the day on the water trying jet skiing, kitesurfing, parasailing or a glass-bottom boat trip over the reef. The afternoon is free for the beach, and an optional dhow dinner cruise is available in the evening.","meals":"Breakfast & Dinner","accommodation":"PrideInn Paradise Beach Resort or similar","activities":["Water sports","Beach at leisure","Optional dhow dinner cruise (extra cost)"],"highlights":["Reef and water sports","Coastal nightlife"]},
    {"day":"Day 4","title":"Departure","description":"Enjoy a final breakfast and free time before checking out. Transfer to Moi International Airport for your departure flight.","meals":"Breakfast","accommodation":"-","activities":["Check out","Return airport transfer"],"highlights":["Final morning on the coast"]}
  ]$$::jsonb,
  $$[
    {"name":"Dhow dinner cruise","price":null,"price_text":"On request"},
    {"name":"Go-karting at Mombasa","price":null,"price_text":"On request"},
    {"name":"Tamarind evening dhow cruise","price":null,"price_text":"On request"}
  ]$$::jsonb,
  $notes$
Best time to travel
Mombasa is warm and humid year-round. The most comfortable months are June to October and December to March. The long rains fall in April and May.

Getting there
Moi International Airport is served by direct flights from Nairobi and other regional hubs. The north coast resorts are 30 to 45 minutes by road from the airport.

City tour note
Mombasa Old Town is a living neighbourhood. Dress modestly when visiting, and ask before photographing people.
  $notes$
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, image = EXCLUDED.image,
  price = EXCLUDED.price, price_kes = EXCLUDED.price_kes, duration = EXCLUDED.duration,
  accommodation = EXCLUDED.accommodation, meals = EXCLUDED.meals, transport = EXCLUDED.transport,
  activities = EXCLUDED.activities, description = EXCLUDED.description,
  highlights = EXCLUDED.highlights, included = EXCLUDED.included, excluded = EXCLUDED.excluded,
  itinerary = EXCLUDED.itinerary, optional_activities = EXCLUDED.optional_activities,
  notes = EXCLUDED.notes, updated_at = NOW();

-- Malindi & Watamu ----------------------------------------------------
INSERT INTO tour_packages
  (name, slug, type, image, price, price_kes, duration, accommodation, meals, transport, activities, description, highlights, included, excluded, itinerary, optional_activities, notes)
VALUES (
  'Malindi & Watamu',
  'malindi-watamu',
  'beach',
  '/images/local/pin_563fb5f6b888c428e9063ed8bfb86128.jpg',
  1700, 221000,
  '5 Days / 4 Nights',
  'Malaika Beach Resort or similar',
  'Breakfast & dinner (half board)',
  'Return transfers from Malindi airstrip or Mombasa',
  ARRAY['Malindi Marine Park','Snorkeling','Vasco da Gama pillar','Arabuko Sokoke forest','Italian cuisine dining','Deep-sea fishing'],
  'Historic Swahili town with Italian flair, offering beautiful beaches, the Malindi Marine Park, and the stunning Arabuko Sokoke Forest.',
  ARRAY['Malindi Marine Park','Vasco da Gama pillar','Arabuko Sokoke','Italian cuisine','Deep-sea fishing'],
  ARRAY['4 nights at a beach resort','Meals as specified in the itinerary','Return airstrip or airport transfers','Snorkeling trip in Malindi Marine Park','Guided Arabuko Sokoke Forest walk','All government taxes and park fees'],
  ARRAY['International and domestic flights','Travel insurance','Visa fees','Drinks and items of a personal nature','Optional activities','Gratuities'],
  $$[
    {"day":"Day 1","title":"Arrival in Malindi","description":"Meet your driver at Malindi airstrip or Mombasa and transfer to your resort. After checking in, take an evening stroll through the historic Swahili town and enjoy dinner at your hotel.","meals":"Dinner","accommodation":"Malaika Beach Resort or similar","activities":["Resort transfer","Evening town stroll"],"highlights":["Malindi coastline","Swahili and Italian heritage"]},
    {"day":"Day 2","title":"Malindi Marine Park and Vasco da Gama Pillar","description":"Take a snorkeling or glass-bottom boat trip in Malindi Marine National Park, home to coral gardens, turtles and colourful reef fish. Afterwards, visit the Vasco da Gama Pillar and the Malindi Museum to learn about the town's long trading history.","meals":"Breakfast, Lunch & Dinner","accommodation":"Malaika Beach Resort or similar","activities":["Snorkeling in Malindi Marine Park","Glass-bottom boat trip","Vasco da Gama Pillar and Museum visit"],"highlights":["Coral gardens","Vasco da Gama Pillar"]},
    {"day":"Day 3","title":"Arabuko Sokoke Forest","description":"Discover Arabuko Sokoke Forest on a guided walk through one of the last remaining coastal forests in East Africa, home to rare birds, butterflies and the golden-rumped elephant shrew. Return to the coast for a relaxed afternoon on the beach.","meals":"Breakfast & Dinner","accommodation":"Malaika Beach Resort or similar","activities":["Guided Arabuko Sokoke Forest walk","Beach at leisure"],"highlights":["Rare coastal forest","Endemic birdlife"]},
    {"day":"Day 4","title":"Deep-Sea Fishing or Watamu Day Trip","description":"Choose an optional deep-sea fishing charter off the Malindi coast, or a day trip to neighbouring Watamu and the Gede Ruins. Spend your final evening enjoying Malindi's Italian-influenced restaurants.","meals":"Breakfast & Dinner","accommodation":"Malaika Beach Resort or similar","activities":["Optional deep-sea fishing (extra cost)","Optional Watamu and Gede Ruins day trip (extra cost)","Evening at leisure"],"highlights":["Deep-sea fishing","Malindi dining scene"]},
    {"day":"Day 5","title":"Departure","description":"After breakfast and some free time by the pool, check out and transfer to Malindi airstrip or Mombasa for your onward journey.","meals":"Breakfast","accommodation":"-","activities":["Check out","Return transfer to airstrip or airport"],"highlights":["Final morning by the beach"]}
  ]$$::jsonb,
  $$[
    {"name":"Deep-sea fishing charter","price":null,"price_text":"On request"},
    {"name":"Marafa Hell's Kitchen day trip","price":null,"price_text":"On request"},
    {"name":"Gede Ruins guided tour","price":null,"price_text":"On request"}
  ]$$::jsonb,
  $notes$
Best time to travel
Malindi is pleasant year-round. The best snorkeling conditions are January to March and October to December. The long rains fall in April and May.

Getting there
Malindi airstrip is a short flight from Nairobi Wilson or Mombasa. Road transfers from Mombasa take about 2 hours.

Combining your trip
Malindi and Watamu sit close together, so you can easily combine marine parks, forest walks and history in one coastal stay.
  $notes$
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, image = EXCLUDED.image,
  price = EXCLUDED.price, price_kes = EXCLUDED.price_kes, duration = EXCLUDED.duration,
  accommodation = EXCLUDED.accommodation, meals = EXCLUDED.meals, transport = EXCLUDED.transport,
  activities = EXCLUDED.activities, description = EXCLUDED.description,
  highlights = EXCLUDED.highlights, included = EXCLUDED.included, excluded = EXCLUDED.excluded,
  itinerary = EXCLUDED.itinerary, optional_activities = EXCLUDED.optional_activities,
  notes = EXCLUDED.notes, updated_at = NOW();

-- Lamu Archipelago ----------------------------------------------------
INSERT INTO tour_packages
  (name, slug, type, image, price, price_kes, duration, accommodation, meals, transport, activities, description, highlights, included, excluded, itinerary, optional_activities, notes)
VALUES (
  'Lamu Archipelago',
  'lamu-archipelago',
  'beach',
  '/images/local/pin_ecf9c45a7a976f4151b88235e8396c06.jpg',
  2600, 338000,
  '5 Days / 4 Nights',
  'Peponi Hotel or The Majlis',
  'Breakfast & dinner (half board)',
  'Return flights from Nairobi to Lamu plus boat transfers',
  ARRAY['Lamu Old Town walk','Dhow sailing','Shela Beach','Swahili culture tour','Lamu Fort museum','Sunset dhow cruise'],
  'A UNESCO World Heritage Site, Lamu is Kenya''s oldest living town with winding streets, dhows, and car-free tranquility. Shela Beach is world-class.',
  ARRAY['Lamu Old Town','Dhow safaris','Shela Beach','Swahili culture','Lamu Fort'],
  ARRAY['4 nights at a heritage beach hotel','Meals as specified in the itinerary','Return flights from Nairobi to Lamu','Airport and boat transfers','Guided Lamu Old Town walking tour','Full-day dhow sailing excursion with lunch','All government taxes and entry fees'],
  ARRAY['International flights','Travel insurance','Visa fees','Drinks and items of a personal nature','Optional activities','Gratuities'],
  $$[
    {"day":"Day 1","title":"Arrival in Lamu","description":"Fly into Manda Airport and transfer by boat to Shela or Lamu town. Check in to your hotel, then enjoy a sundowner on the terrace as dhows drift across the channel and the call to prayer echoes over the town.","meals":"Dinner","accommodation":"Peponi Hotel or The Majlis","activities":["Flight to Lamu","Boat transfer","Sundowner at leisure"],"highlights":["Lamu channel","Traditional dhow traffic"]},
    {"day":"Day 2","title":"Lamu Old Town and Museum","description":"Explore the UNESCO World Heritage Site of Lamu Old Town on foot with a local guide, wandering its narrow alleys, carved Swahili doors and markets. Visit Lamu Fort and the Lamu Museum to understand the island's Swahili, Arab and Portuguese history.","meals":"Breakfast, Lunch & Dinner","accommodation":"Peponi Hotel or The Majlis","activities":["Guided Old Town walking tour","Lamu Fort and Museum visit"],"highlights":["UNESCO Old Town","Carved Swahili doors"]},
    {"day":"Day 3","title":"Dhow Sailing and Shela Beach","description":"Spend the day on a traditional dhow, sailing the calm waters of the archipelago with stops for swimming and snorkeling. A fresh seafood lunch is served on board, and the afternoon ends with time to relax on the world-class sands of Shela Beach.","meals":"Breakfast, Lunch & Dinner","accommodation":"Peponi Hotel or The Majlis","activities":["Full-day dhow sail","Swimming and snorkeling","Shela Beach relaxation"],"highlights":["Sailing the archipelago","Shela Beach"]},
    {"day":"Day 4","title":"Swahili Culture and Leisure","description":"Visit a Swahili cultural centre to learn about henna art, traditional crafts and dhow building, then enjoy a free afternoon. An optional sunset sail or visit to the Takwa ruins can be arranged.","meals":"Breakfast & Dinner","accommodation":"Peponi Hotel or The Majlis","activities":["Swahili cultural centre visit","Afternoon at leisure","Optional sunset sail (extra cost)"],"highlights":["Swahili crafts","Island pace of life"]},
    {"day":"Day 5","title":"Departure","description":"Enjoy a final breakfast before the boat transfer to Manda Airport for your flight back to Nairobi, ending your Lamu holiday.","meals":"Breakfast","accommodation":"-","activities":["Boat transfer","Return flight to Nairobi"],"highlights":["Final morning on the island"]}
  ]$$::jsonb,
  $$[
    {"name":"Sunset dhow sail","price":null,"price_text":"On request"},
    {"name":"Takwa ruins trip","price":null,"price_text":"On request"},
    {"name":"Swahili cooking class","price":null,"price_text":"On request"}
  ]$$::jsonb,
  $notes$
Best time to travel
Lamu is warm year-round. The most pleasant months are June to October and December to March. The long rains fall in April and May.

Getting there
Lamu is served by direct flights from Nairobi Wilson to Manda Airport, followed by a short boat transfer. There are no cars on Lamu island, so travel is on foot, by boat or by donkey.

Local customs
Lamu is a conservative Muslim community. Dress modestly in town, and during Ramadan some restaurants are closed during daylight hours.
  $notes$
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, image = EXCLUDED.image,
  price = EXCLUDED.price, price_kes = EXCLUDED.price_kes, duration = EXCLUDED.duration,
  accommodation = EXCLUDED.accommodation, meals = EXCLUDED.meals, transport = EXCLUDED.transport,
  activities = EXCLUDED.activities, description = EXCLUDED.description,
  highlights = EXCLUDED.highlights, included = EXCLUDED.included, excluded = EXCLUDED.excluded,
  itinerary = EXCLUDED.itinerary, optional_activities = EXCLUDED.optional_activities,
  notes = EXCLUDED.notes, updated_at = NOW();

-- Pemba Island --------------------------------------------------------
INSERT INTO tour_packages
  (name, slug, type, image, price, price_kes, duration, accommodation, meals, transport, activities, description, highlights, included, excluded, itinerary, optional_activities, notes)
VALUES (
  'Pemba Island',
  'pemba-island',
  'beach',
  '/images/local/pin_ecf9c45a7a976f4151b88235e8396c06.jpg',
  2300, 299000,
  '5 Days / 4 Nights',
  'The Manta Resort or similar',
  'Breakfast, lunch & dinner (full board)',
  'Return flights from Zanzibar plus boat transfers',
  ARRAY['Pemba Channel diving','Clove plantation tour','Misali Island snorkeling','Ngezi Forest','Remote beach relaxation','Dhow sailing'],
  'Zanzibar''s quieter sister island with lush green hills, clove plantations, and world-class diving at the Pemba Channel. Undiscovered paradise.',
  ARRAY['Pemba Channel diving','Clove plantations','Misali Island','Snorkeling','Remote beaches'],
  ARRAY['4 nights at a beach resort','Full board meals as specified in the itinerary','Return flights from Zanzibar','Boat transfers and island transfers','Guided clove and spice plantation tour','Misali Island snorkeling trip','All government taxes and marine park fees'],
  ARRAY['International flights','Travel insurance','Visa fees','Drinks and items of a personal nature','Optional activities','Gratuities'],
  $$[
    {"day":"Day 1","title":"Arrival in Pemba","description":"Fly from Zanzibar to Pemba and transfer to your resort on the coast. Check in and unwind on the beach, watching the tide move across the reef as the sun goes down.","meals":"Dinner","accommodation":"The Manta Resort or similar","activities":["Flight to Pemba","Resort and boat transfer","Beach at leisure"],"highlights":["Pemba coastline","Quiet island atmosphere"]},
    {"day":"Day 2","title":"Pemba Channel Diving and Snorkeling","description":"Explore the world-famous Pemba Channel, where strong currents feed spectacular wall dives and coral gardens. Snorkelers can enjoy the shallower reefs while certified divers head to the drop-offs in search of turtles, rays and reef sharks.","meals":"Breakfast, Lunch & Dinner","accommodation":"The Manta Resort or similar","activities":["Diving or snorkeling in the Pemba Channel"],"highlights":["Wall diving","Turtles and rays"]},
    {"day":"Day 3","title":"Clove Plantations and Ngezi Forest","description":"Tour the island's historic clove and spice plantations to learn how cloves, vanilla and black pepper are grown and processed. In the afternoon, walk through the Ngezi Forest Reserve, home to the endemic Pemba flying fox and rare birds.","meals":"Breakfast, Lunch & Dinner","accommodation":"The Manta Resort or similar","activities":["Clove and spice plantation tour","Ngezi Forest Reserve walk"],"highlights":["Spice island heritage","Pemba flying fox"]},
    {"day":"Day 4","title":"Misali Island","description":"Boat to Misali Island, a protected marine conservation area with pristine beaches and rich reefs. Spend the day snorkeling, swimming and relaxing on the sand, with a picnic lunch on the island before returning to the resort.","meals":"Breakfast, Lunch & Dinner","accommodation":"The Manta Resort or similar","activities":["Boat trip to Misali Island","Snorkeling","Beach and picnic lunch"],"highlights":["Misali Island reefs","Untouched beaches"]},
    {"day":"Day 5","title":"Departure","description":"Enjoy a final breakfast before transferring by boat and road for your flight back to Zanzibar, ending your Pemba escape.","meals":"Breakfast","accommodation":"-","activities":["Check out","Return boat and flight to Zanzibar"],"highlights":["Final morning on Pemba"]}
  ]$$::jsonb,
  $$[
    {"name":"PADI dive course","price":null,"price_text":"On request"},
    {"name":"Ngezi Forest guided walk","price":null,"price_text":"On request"},
    {"name":"Spice farm lunch","price":null,"price_text":"On request"}
  ]$$::jsonb,
  $notes$
Best time to travel
Pemba is warm all year. The best diving visibility is December to March and June to October. The long rains fall in April and May.

Getting there
Pemba is a short flight from Zanzibar or Dar es Salaam, followed by a road and boat transfer to the resorts. The island is far quieter and less developed than Zanzibar.

Diving note
Some Pemba Channel dives are for certified divers only due to strong currents. Snorkeling trips are suitable for all levels.
  $notes$
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, image = EXCLUDED.image,
  price = EXCLUDED.price, price_kes = EXCLUDED.price_kes, duration = EXCLUDED.duration,
  accommodation = EXCLUDED.accommodation, meals = EXCLUDED.meals, transport = EXCLUDED.transport,
  activities = EXCLUDED.activities, description = EXCLUDED.description,
  highlights = EXCLUDED.highlights, included = EXCLUDED.included, excluded = EXCLUDED.excluded,
  itinerary = EXCLUDED.itinerary, optional_activities = EXCLUDED.optional_activities,
  notes = EXCLUDED.notes, updated_at = NOW();

-- Mafia Island --------------------------------------------------------
INSERT INTO tour_packages
  (name, slug, type, image, price, price_kes, duration, accommodation, meals, transport, activities, description, highlights, included, excluded, itinerary, optional_activities, notes)
VALUES (
  'Mafia Island',
  'mafia-island',
  'beach',
  '/images/local/pin_ecf9c45a7a976f4151b88235e8396c06.jpg',
  2400, 312000,
  '6 Days / 5 Nights',
  'Mafia Island Lodge or Kinasi Lodge',
  'Breakfast, lunch & dinner (full board)',
  'Return flights from Dar es Salaam plus transfers',
  ARRAY['Whale shark snorkeling','Mafia Island Marine Park','Chole Bay diving','Deep-sea fishing','Eco-tour','Beach relaxation'],
  'Tanzania''s best-kept secret with the Mafia Island Marine Park, whale sharks, and untouched coral reefs. A diver''s paradise.',
  ARRAY['Whale shark snorkeling','Mafia Marine Park','Chole Bay','Deep-sea fishing','Eco-lodges'],
  ARRAY['5 nights at an eco-lodge','Full board meals as specified in the itinerary','Return flights from Dar es Salaam','Airport and boat transfers','Snorkeling trip in the Mafia Island Marine Park','Chole Island cultural visit','All government taxes and marine park fees'],
  ARRAY['International flights','Travel insurance','Visa fees','Drinks and items of a personal nature','Optional activities','Gratuities'],
  $$[
    {"day":"Day 1","title":"Arrival in Mafia","description":"Fly from Dar es Salaam to Mafia Island and transfer to your lodge. Settle in and take a short sunset sail or a walk along the beach before dinner.","meals":"Dinner","accommodation":"Mafia Island Lodge or Kinasi Lodge","activities":["Flight to Mafia","Lodge transfer","Sunset sail or beach walk"],"highlights":["Mafia shoreline","Sunset over the channel"]},
    {"day":"Day 2","title":"Mafia Island Marine Park Snorkeling","description":"Spend the day exploring the Mafia Island Marine Park, one of the richest coral reef systems in the Indian Ocean. Snorkel in Chole Bay among colourful reef fish and corals, then relax on a sandbank before returning to the lodge.","meals":"Breakfast, Lunch & Dinner","accommodation":"Mafia Island Lodge or Kinasi Lodge","activities":["Snorkeling in Chole Bay","Sandbank visit","Beach at leisure"],"highlights":["Chole Bay reefs","Marine park"]},
    {"day":"Day 3","title":"Whale Shark Snorkeling","description":"Head out early for a chance to snorkel alongside whale sharks, which gather in Mafia's waters between October and March. The rest of the day is free for the beach, with an optional dive available in the afternoon.","meals":"Breakfast, Lunch & Dinner","accommodation":"Mafia Island Lodge or Kinasi Lodge","activities":["Whale shark snorkeling (seasonal)","Optional dive (extra cost)","Beach at leisure"],"highlights":["Whale sharks (seasonal)","Reef diving"]},
    {"day":"Day 4","title":"Chole Island and Diving","description":"Visit nearby Chole Island to see its historic ruins and traditional boat-building yards. Certified divers can take a boat out to the outer reef, while others relax on the beach or snorkel close to shore.","meals":"Breakfast, Lunch & Dinner","accommodation":"Mafia Island Lodge or Kinasi Lodge","activities":["Chole Island cultural visit","Optional outer reef dive (extra cost)","Snorkeling or beach at leisure"],"highlights":["Chole Island history","Outer reef diving"]},
    {"day":"Day 5","title":"Deep-Sea Fishing and Beaches","description":"Choose an optional deep-sea fishing charter in search of tuna, marlin or sailfish, or simply enjoy a full day of relaxation on Mafia's quiet beaches. End the day with dinner at the lodge overlooking the water.","meals":"Breakfast, Lunch & Dinner","accommodation":"Mafia Island Lodge or Kinasi Lodge","activities":["Optional deep-sea fishing (extra cost)","Beach relaxation"],"highlights":["Big game fishing","Unspoiled beaches"]},
    {"day":"Day 6","title":"Departure","description":"After breakfast, check out and transfer to the airstrip for your flight back to Dar es Salaam, bringing your Mafia Island holiday to an end.","meals":"Breakfast","accommodation":"-","activities":["Check out","Return flight to Dar es Salaam"],"highlights":["Final morning by the sea"]}
  ]$$::jsonb,
  $$[
    {"name":"Whale shark snorkeling excursion","price":null,"price_text":"On request"},
    {"name":"Discover scuba diving","price":null,"price_text":"On request"},
    {"name":"Chole Island cultural tour","price":null,"price_text":"On request"}
  ]$$::jsonb,
  $notes$
Best time to travel
Mafia Island is a year-round destination. Whale sharks are most reliably seen from October to March. The long rains fall in April and May.

Getting there
Mafia is reached by a short flight from Dar es Salaam, followed by a transfer to your lodge. Flights are limited, so early booking is recommended.

Eco note
The Mafia Island Marine Park protects the reef and its wildlife. Please snorkel and dive responsibly, avoid touching coral, and use reef-safe sunscreen.
  $notes$
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, type = EXCLUDED.type, image = EXCLUDED.image,
  price = EXCLUDED.price, price_kes = EXCLUDED.price_kes, duration = EXCLUDED.duration,
  accommodation = EXCLUDED.accommodation, meals = EXCLUDED.meals, transport = EXCLUDED.transport,
  activities = EXCLUDED.activities, description = EXCLUDED.description,
  highlights = EXCLUDED.highlights, included = EXCLUDED.included, excluded = EXCLUDED.excluded,
  itinerary = EXCLUDED.itinerary, optional_activities = EXCLUDED.optional_activities,
  notes = EXCLUDED.notes, updated_at = NOW();

-- 3. Verification ------------------------------------------------------
SELECT slug, type, duration, price, price_kes,
       jsonb_array_length(itinerary)  AS itinerary_days,
       jsonb_array_length(optional_activities) AS optional_count,
       (notes IS NOT NULL AND length(notes) > 0) AS has_notes
FROM tour_packages
WHERE type = 'beach'
ORDER BY name;
