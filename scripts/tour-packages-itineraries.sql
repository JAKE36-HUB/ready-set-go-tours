-- =====================================================================
-- Tour package itineraries: schema + backfill for all existing packages
-- Run this in the Supabase SQL editor (copy the WHOLE file content).
-- Idempotent: safe to run more than once.
-- =====================================================================

-- 1. Schema -----------------------------------------------------------
ALTER TABLE tour_packages
  ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS optional_activities JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Backfill ---------------------------------------------------------

-- 3 Days Maasai Mara Group Safari ------------------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to the Maasai Mara","description":"Meet your driver-guide at your Nairobi hotel in the morning and set off for the Maasai Mara, driving down into the Great Rift Valley with a scenic stop at the escarpment viewpoint. Continue through Narok and arrive at your camp in time for a hot lunch, then head out on your first afternoon game drive as the plains come alive in the golden light. Return to camp for dinner and your first night in the Mara.","meals":"Lunch & Dinner","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning pickup from your Nairobi hotel","Scenic drive through the Great Rift Valley with an escarpment viewpoint stop","Hot lunch on arrival at the Maasai Mara camp","Afternoon game drive searching for lions, elephants and giraffes","Dinner and overnight at camp"],"highlights":["First wildlife sightings","Great Rift Valley escarpment views"]},
  {"day":"Day 2","title":"Full-Day Game Drives in the Mara","description":"Spend a full day exploring the rolling plains of the Maasai Mara in search of the Big Five and the reserve's abundant wildlife. Your guide carries a packed picnic lunch so you can stay deep in the reserve at midday, when the big cats are often most active. Between July and October the Great Migration herds may be crossing the Mara River, and an optional sunrise hot air balloon safari or Maasai village visit can be arranged at extra cost.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Early morning game drive while predators are still active","Mid-morning picnic game drive deep in the reserve","Afternoon game drive tracking lions, cheetahs and leopards","Great Migration river crossings (July to October)","Optional Maasai village visit (extra cost)","Optional sunrise hot air balloon safari (extra cost)"],"highlights":["Big Five spotting","Great Migration river crossings (seasonal)","Big cat photography"]},
  {"day":"Day 3","title":"Maasai Village Visit, Lake Nakuru Boat Ride & Return to Nairobi","description":"After breakfast, enjoy an optional visit to a Maasai village to experience the local culture, songs and traditional homestead way of life (available at an extra cost). Depart the Maasai Mara and drive to Lake Nakuru, where you take a relaxing boat ride on the lake. Please note there is no game drive in Lake Nakuru on this day. Afterwards, continue to Nairobi, arriving in the evening where the safari ends.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Optional Maasai village and cultural visit (extra cost)","Scenic drive from the Mara to Lake Nakuru","Boat ride on Lake Nakuru","Return transfer to Nairobi arriving in the evening"],"highlights":["Maasai cultural experience","Lake Nakuru boat ride"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Mara","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Best time to travel
This daily group joining safari operates in high season (July to December). The Great Migration is typically in the Maasai Mara between July and October, but wildlife viewing is excellent throughout these months.

Group safari details
Group joining tour with up to 6 guests per vehicle so every traveller gets a window seat. Actual departure dates depend on minimum group numbers and are confirmed at the time of booking.

Getting there
Road transfer from Nairobi takes approximately 5 to 6 hours via Narok, including a stop for lunch.
$notes$
WHERE slug = 'maasai-mara-3-days-group';

-- 4 Days Mara & Lake Nakuru Group Safari -----------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to the Maasai Mara","description":"Depart Nairobi in the morning and drive down through the Great Rift Valley to the Maasai Mara, pausing at the escarpment viewpoint for photos along the way. Arrive at your camp in time for lunch, then set out on an afternoon game drive across the reserve before returning for dinner.","meals":"Lunch & Dinner","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning departure from Nairobi","Scenic drive through the Great Rift Valley with a viewpoint stop","Lunch on arrival at the Mara camp","Afternoon game drive across the reserve"],"highlights":["First wildlife sightings","Rift Valley escarpment views"]},
  {"day":"Day 2","title":"Full-Day Game Drives in the Mara","description":"Enjoy a full day of game viewing in the Maasai Mara, with a picnic lunch served on the plains so you can spend maximum time out in the reserve. Your guide tracks the Big Five and, between July and October, the Great Migration herds that cross the Mara River.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning game drive in search of the Big Five","Picnic lunch served on the plains","Afternoon game drive tracking predators","Great Migration river crossings (July to October)"],"highlights":["Big Five spotting","Great Migration (seasonal)"]},
  {"day":"Day 3","title":"Maasai Village Visit, Lake Nakuru Boat Ride & Overnight at Lake Nakuru","description":"After breakfast, enjoy an optional visit to a Maasai village to experience the local culture, songs and traditional homestead way of life (available at an extra cost). Then depart the Maasai Mara and drive to Lake Nakuru National Park via Narok, with lunch en route. On arrival, take a relaxing boat ride on the lake. Please note there is no game drive in Lake Nakuru on this day. Dinner and overnight at your camp beside the lake.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp at Lake Nakuru","activities":["Optional Maasai village and cultural visit (extra cost)","Scenic drive from the Mara to Lake Nakuru via Narok","Lunch en route","Relaxing boat ride on Lake Nakuru","Dinner and overnight at camp beside the lake"],"highlights":["Maasai cultural experience","Lake Nakuru boat ride"]},
  {"day":"Day 4","title":"Lake Nakuru & Return to Nairobi","description":"An early morning game drive at Lake Nakuru offers the best chance of seeing the park's black and white rhinos and the famous flamingo-lined shores. Return to camp for a full breakfast, then depart for Nairobi, arriving in the late afternoon where the safari ends.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early morning game drive at Lake Nakuru","Full breakfast back at camp","Drive back to Nairobi","Safari ends on arrival in Nairobi"],"highlights":["Rhino viewing","Flamingos at sunrise"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Mara","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Best time to travel
This daily group joining safari operates in high season (July to December). The Great Migration is typically in the Maasai Mara between July and October.

Group safari details
Group joining tour with up to 6 guests per vehicle. Actual departure dates depend on minimum group numbers and are confirmed at the time of booking.

Getting there
Road transfers between parks take approximately 5 to 6 hours on each leg, with stops along the way.
$notes$
WHERE slug = 'mara-nakuru-4-days-group';

-- 5 Days Mara, Lake Nakuru & Naivasha Group Safari -------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to the Maasai Mara","description":"Depart Nairobi in the morning, crossing the Great Rift Valley on the way to the Maasai Mara with a brief stop at the escarpment viewpoint. Arrive in time for lunch, then head out on an afternoon game drive to meet the wildlife before dinner at camp.","meals":"Lunch & Dinner","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning departure from Nairobi","Scenic drive through the Great Rift Valley viewpoint","Lunch on arrival at the Mara camp","Afternoon game drive across the reserve"],"highlights":["First wildlife sightings","Rift Valley escarpment views"]},
  {"day":"Day 2","title":"Full-Day Game Drives in the Mara","description":"A full day dedicated to game viewing in the Maasai Mara, including a picnic lunch out on the open plains. Between July and October the Great Migration may be seen massing and crossing the Mara River, while lions, cheetahs and leopards are tracked year round.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning game drive tracking the Big Five","Picnic lunch on the plains","Afternoon game drive","Great Migration crossings (July to October)"],"highlights":["Big Five spotting","Great Migration (seasonal)"]},
  {"day":"Day 3","title":"Maasai Village Visit, Lake Nakuru Boat Ride & Overnight at Lake Nakuru","description":"After breakfast, enjoy an optional visit to a Maasai village to experience the local culture, songs and traditional homestead way of life (available at an extra cost). Then depart the Maasai Mara and drive to Lake Nakuru National Park via Narok, with lunch en route. On arrival, take a relaxing boat ride on the lake. Please note there is no game drive in Lake Nakuru on this day. Dinner and overnight at your camp beside the lake.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp at Lake Nakuru","activities":["Optional Maasai village and cultural visit (extra cost)","Scenic drive from the Mara to Lake Nakuru via Narok","Lunch en route","Relaxing boat ride on Lake Nakuru","Dinner and overnight at camp beside the lake"],"highlights":["Maasai cultural experience","Lake Nakuru boat ride"]},
  {"day":"Day 4","title":"Nakuru to Lake Naivasha & Boat Safari","description":"Start with an early morning game drive at Lake Nakuru, then continue to Lake Naivasha, arriving around midday. In the afternoon, enjoy a boat safari on the lake among pods of hippos and darting fish eagles; a guided walking safari on Crescent Island can be arranged at an extra cost.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp at Lake Naivasha","activities":["Early morning game drive at Lake Nakuru","Drive to Lake Naivasha","Afternoon boat safari among hippos and fish eagles","Optional guided Crescent Island walking safari (extra cost)"],"highlights":["Hippo viewing","Boat safari on Lake Naivasha"]},
  {"day":"Day 5","title":"Lake Naivasha to Nairobi","description":"After a relaxed breakfast, enjoy a quiet morning on the shores of Lake Naivasha before the short drive back to Nairobi, where the safari ends around midday.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Leisurely breakfast at the lodge","Morning at leisure on the lake shore","Short drive back to Nairobi","Safari ends on arrival in Nairobi"],"highlights":["Lake Naivasha views"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Mara","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"},
  {"name":"Crescent Island walking safari","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Best time to travel
This daily group joining safari operates in high season (July to December). The Great Migration is typically in the Maasai Mara between July and October.

Group safari details
Group joining tour with up to 6 guests per vehicle. Actual departure dates depend on minimum group numbers and are confirmed at the time of booking.
$notes$
WHERE slug = 'mara-nakuru-naivasha-5-days-group';

-- 6 Days Mara, Nakuru & Amboseli Group Safari ------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to the Maasai Mara","description":"Depart Nairobi in the morning and drive via the Great Rift Valley to the Maasai Mara, stopping at the escarpment viewpoint on the way. Arrive in time for lunch, followed by an afternoon game drive across the reserve before dinner at camp.","meals":"Lunch & Dinner","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning departure from Nairobi","Scenic drive through the Great Rift Valley viewpoint","Lunch on arrival at the Mara camp","Afternoon game drive across the reserve"],"highlights":["First wildlife sightings","Rift Valley views"]},
  {"day":"Day 2","title":"Full-Day Game Drives in the Mara","description":"A full day of game viewing in the Maasai Mara with a picnic lunch on the plains. Your guide tracks the Big Five and, between July and October, the Great Migration herds that cross the Mara River.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning game drive in search of the Big Five","Picnic lunch served on the plains","Afternoon game drive tracking predators","Great Migration river crossings (July to October)"],"highlights":["Big Five spotting","Great Migration (seasonal)"]},
  {"day":"Day 3","title":"Maasai Village Visit, Lake Nakuru Boat Ride & Overnight at Lake Nakuru","description":"After breakfast, enjoy an optional visit to a Maasai village to experience the local culture, songs and traditional homestead way of life (available at an extra cost). Then depart the Maasai Mara and drive to Lake Nakuru National Park via Narok, with lunch en route. On arrival, take a relaxing boat ride on the lake. Please note there is no game drive in Lake Nakuru on this day. Dinner and overnight at your camp beside the lake.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp at Lake Nakuru","activities":["Optional Maasai village and cultural visit (extra cost)","Scenic drive from the Mara to Lake Nakuru via Narok","Lunch en route","Relaxing boat ride on Lake Nakuru","Dinner and overnight at camp beside the lake"],"highlights":["Maasai cultural experience","Lake Nakuru boat ride"]},
  {"day":"Day 4","title":"Nakuru to Amboseli","description":"Take an early morning game drive at Lake Nakuru, then travel south towards Amboseli National Park, passing through Nairobi on the way. Arrive in the late afternoon in time for a short game drive beneath the snow-capped peak of Mount Kilimanjaro.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Amboseli","activities":["Early morning game drive at Lake Nakuru","Long drive south to Amboseli via Nairobi","Lunch en route","Late afternoon game drive beneath Mount Kilimanjaro"],"highlights":["Elephant herds","Mount Kilimanjaro views"]},
  {"day":"Day 5","title":"Full-Day Game Drives in Amboseli","description":"Enjoy a full day in Amboseli National Park, home to some of Africa's largest elephant herds, and keep an eye out for the clear views of snow-capped Mount Kilimanjaro that the park is famous for. A Maasai village visit can be arranged at an extra cost.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Amboseli","activities":["Sunrise game drive for the clearest Kilimanjaro views","Midday picnic game drive","Afternoon game drive among elephant herds","Optional Maasai village visit (extra cost)"],"highlights":["Elephant herds against Kilimanjaro","Birdlife in the swamps"]},
  {"day":"Day 6","title":"Amboseli to Nairobi","description":"An early morning game drive in Amboseli gives a final chance to photograph Mount Kilimanjaro at sunrise. Return to camp for breakfast, then drive back to Nairobi where the safari ends in the late afternoon.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early morning game drive at sunrise","Breakfast back at camp","Drive back to Nairobi","Safari ends on arrival in Nairobi"],"highlights":["Kilimanjaro at sunrise"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Mara","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Best time to travel
This daily group joining safari operates in high season (July to December). The Great Migration is typically in the Maasai Mara between July and October.

Group safari details
Group joining tour with up to 6 guests per vehicle. Actual departure dates depend on minimum group numbers and are confirmed at the time of booking.
$notes$
WHERE slug = 'mara-nakuru-amboseli-6-days-group';

-- 7 Days Mara, Nakuru, Naivasha & Amboseli Group Safari --------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to the Maasai Mara","description":"Depart Nairobi in the morning and drive via the Great Rift Valley to the Maasai Mara, pausing at the escarpment viewpoint along the way. Arrive in time for lunch, followed by an afternoon game drive across the reserve.","meals":"Lunch & Dinner","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning departure from Nairobi","Scenic drive through the Great Rift Valley viewpoint","Lunch on arrival at the Mara camp","Afternoon game drive across the reserve"],"highlights":["First wildlife sightings","Rift Valley views"]},
  {"day":"Day 2","title":"Full-Day Game Drives in the Mara","description":"A full day of game viewing in the Maasai Mara, breaking on the plains between morning and afternoon drives for a picnic lunch. Predators are tracked throughout the day, and between July and October the Great Migration herds may cross the Mara River.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning game drive tracking the Big Five","Picnic lunch on the plains","Afternoon game drive","Great Migration crossings (July to October)"],"highlights":["Big Five spotting","Great Migration (seasonal)"]},
  {"day":"Day 3","title":"Maasai Village Visit, Lake Nakuru Boat Ride & Overnight at Lake Nakuru","description":"After breakfast, enjoy an optional visit to a Maasai village to experience the local culture, songs and traditional homestead way of life (available at an extra cost). Then depart the Maasai Mara and drive to Lake Nakuru National Park via Narok, with lunch en route. On arrival, take a relaxing boat ride on the lake. Please note there is no game drive in Lake Nakuru on this day. Dinner and overnight at your camp beside the lake.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp at Lake Nakuru","activities":["Optional Maasai village and cultural visit (extra cost)","Scenic drive from the Mara to Lake Nakuru via Narok","Lunch en route","Relaxing boat ride on Lake Nakuru","Dinner and overnight at camp beside the lake"],"highlights":["Maasai cultural experience","Lake Nakuru boat ride"]},
  {"day":"Day 4","title":"Nakuru to Naivasha & Boat Safari","description":"Start with an early morning game drive at Lake Nakuru, then continue to Lake Naivasha where an afternoon boat safari cruises past pods of hippos and darting fish eagles.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp at Lake Naivasha","activities":["Early morning game drive at Lake Nakuru","Drive to Lake Naivasha","Afternoon boat safari among hippos and fish eagles"],"highlights":["Hippo viewing","Boat safari on Lake Naivasha"]},
  {"day":"Day 5","title":"Naivasha to Amboseli","description":"Travel from the lake district south through Nairobi to Amboseli National Park, arriving in the late afternoon in time for a first game drive beneath the towering peak of Mount Kilimanjaro.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Amboseli","activities":["Drive south through Nairobi to Amboseli","Lunch en route","Late afternoon game drive beneath Mount Kilimanjaro"],"highlights":["Elephant herds","Mount Kilimanjaro views"]},
  {"day":"Day 6","title":"Full-Day Game Drives in Amboseli","description":"A full day exploring Amboseli, famous for its huge elephant herds set against the backdrop of Kilimanjaro. Morning and afternoon game drives are broken by a picnic lunch in the park.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Amboseli","activities":["Sunrise game drive for the clearest Kilimanjaro views","Midday picnic lunch in the park","Afternoon game drive among elephant herds"],"highlights":["Elephants and Kilimanjaro","Birdlife in the swamps"]},
  {"day":"Day 7","title":"Amboseli to Nairobi","description":"An early morning game drive at sunrise is followed by breakfast and the drive back to Nairobi, where the safari ends in the late afternoon.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early morning game drive at sunrise","Breakfast at camp","Drive back to Nairobi","Safari ends on arrival in Nairobi"],"highlights":["Kilimanjaro at sunrise"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Mara","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Best time to travel
This daily group joining safari operates in high season (July to December). The Great Migration is typically in the Maasai Mara between July and October.

Group safari details
Group joining tour with up to 6 guests per vehicle. Actual departure dates depend on minimum group numbers and are confirmed at the time of booking.
$notes$
WHERE slug = 'mara-nakuru-naivasha-amboseli-7-days-group';

-- 8 Days Mara, Nakuru, Naivasha & Amboseli Group Safari --------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to the Maasai Mara","description":"Depart Nairobi in the morning and drive via the Great Rift Valley to the Maasai Mara, pausing at the escarpment viewpoint along the way. Arrive in time for lunch, followed by an afternoon game drive across the reserve.","meals":"Lunch & Dinner","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning departure from Nairobi","Scenic drive through the Great Rift Valley viewpoint","Lunch on arrival at the Mara camp","Afternoon game drive across the reserve"],"highlights":["First wildlife sightings","Rift Valley views"]},
  {"day":"Day 2","title":"Full-Day Game Drives in the Mara","description":"The first of two full days in the Maasai Mara, with morning and afternoon game drives and a picnic lunch out on the open plains. Predators are tracked throughout the day.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Morning game drive tracking the Big Five","Picnic lunch on the plains","Afternoon game drive"],"highlights":["Big Five spotting"]},
  {"day":"Day 3","title":"Full-Day Game Drives in the Mara","description":"Maximum game viewing time in the Maasai Mara. Between July and October the Great Migration may be witnessed crossing the Mara River in dramatic numbers, with predators never far behind.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Maasai Mara","activities":["Early morning game drive","Midday picnic game drive","Afternoon game drive along the Mara River","Great Migration river crossings (July to October)"],"highlights":["Great Migration (seasonal)","River crossings (seasonal)"]},
  {"day":"Day 4","title":"Maasai Village Visit, Lake Nakuru Boat Ride & Overnight at Lake Nakuru","description":"After breakfast, enjoy an optional visit to a Maasai village to experience the local culture, songs and traditional homestead way of life (available at an extra cost). Then depart the Maasai Mara and drive to Lake Nakuru National Park via Narok, with lunch en route. On arrival, take a relaxing boat ride on the lake. Please note there is no game drive in Lake Nakuru on this day. Dinner and overnight at your camp beside the lake.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp at Lake Nakuru","activities":["Optional Maasai village and cultural visit (extra cost)","Scenic drive from the Mara to Lake Nakuru via Narok","Lunch en route","Relaxing boat ride on Lake Nakuru","Dinner and overnight at camp beside the lake"],"highlights":["Maasai cultural experience","Lake Nakuru boat ride"]},
  {"day":"Day 5","title":"Nakuru to Naivasha & Boat Safari","description":"Start with an early morning game drive at Lake Nakuru, then continue to Lake Naivasha for an afternoon boat safari among hippos and birds.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp at Lake Naivasha","activities":["Early morning game drive at Lake Nakuru","Drive to Lake Naivasha","Afternoon boat safari among hippos and fish eagles"],"highlights":["Hippo viewing","Boat safari on Lake Naivasha"]},
  {"day":"Day 6","title":"Naivasha to Amboseli","description":"Travel south through Nairobi to Amboseli National Park, arriving in the late afternoon in time for a first game drive beneath Mount Kilimanjaro.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Amboseli","activities":["Drive south through Nairobi to Amboseli","Lunch en route","Late afternoon game drive beneath Mount Kilimanjaro"],"highlights":["Elephant herds","Mount Kilimanjaro views"]},
  {"day":"Day 7","title":"Full-Day Game Drives in Amboseli","description":"Spend a full day watching Amboseli's renowned elephant herds against the Kilimanjaro backdrop, with a picnic lunch in the park between game drives.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Budget-friendly camp in Amboseli","activities":["Sunrise game drive for the clearest Kilimanjaro views","Midday picnic lunch in the park","Afternoon game drive among elephant herds"],"highlights":["Elephants and Kilimanjaro","Birdlife in the swamps"]},
  {"day":"Day 8","title":"Amboseli to Nairobi","description":"An early morning game drive at sunrise, breakfast, then the drive back to Nairobi where the safari ends in the late afternoon.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early morning game drive at sunrise","Breakfast at camp","Drive back to Nairobi","Safari ends on arrival in Nairobi"],"highlights":["Kilimanjaro at sunrise"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Mara","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Best time to travel
This daily group joining safari operates in high season (July to December). The Great Migration is typically in the Maasai Mara between July and October.

Group safari details
Group joining tour with up to 6 guests per vehicle. Actual departure dates depend on minimum group numbers and are confirmed at the time of booking.
$notes$
WHERE slug = 'mara-nakuru-naivasha-amboseli-8-days-group';

-- 7 Days Ultimate Kenya Safari ---------------------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to the Maasai Mara","description":"Depart Nairobi in the morning and travel through the Great Rift Valley to the Maasai Mara, arriving at your lodge in time for lunch. After settling in, head out on your first afternoon game drive on the plains before dinner.","meals":"Lunch & Dinner","accommodation":"Maasai Mara - Mara Sopa Lodge","activities":["Scenic drive through the Great Rift Valley","Lunch and check-in at Mara Sopa Lodge","Afternoon game drive in the Maasai Mara"],"highlights":["Rift Valley views","First game drive"]},
  {"day":"Day 2","title":"Full-Day Game Drives in the Mara","description":"Spend the day exploring the Maasai Mara with a picnic lunch on the plains. Between July and October focus on the Mara River for Great Migration crossings; a Maasai cultural visit can be arranged at extra cost.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Maasai Mara - Mara Sopa Lodge","activities":["Morning game drive tracking the Big Five","Picnic lunch on the plains","Afternoon game drive along the Mara River","Great Migration crossings (July to October)","Optional Maasai village visit (extra cost)"],"highlights":["Great Migration (seasonal)","Big Five"]},
  {"day":"Day 3","title":"Mara to Lake Nakuru","description":"Transfer to Lake Nakuru National Park and enjoy an afternoon game drive along the lake shore, looking out for flamingos, pelicans and the park's protected white and black rhinos.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"L. Nakuru - Lake Nakuru Lodge","activities":["Drive to Lake Nakuru National Park","Lunch at Lake Nakuru Lodge","Afternoon game drive along the lake shore","Flamingo and rhino spotting"],"highlights":["Flamingo viewing","Rhino sightings"]},
  {"day":"Day 4","title":"Nakuru to Naivasha & Hippo Boat Ride","description":"After an early game drive at Lake Nakuru, continue to Lake Naivasha for a boat safari among hippos and fish eagles, followed by a relaxed lakeside lunch.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"L. Naivasha - Naivasha Sopa Lodge","activities":["Early morning game drive at Lake Nakuru","Drive to Lake Naivasha","Hippo and fish eagle boat ride","Lakeside lunch and afternoon at leisure"],"highlights":["Hippo viewing","Birdlife"]},
  {"day":"Day 5","title":"Naivasha to Amboseli","description":"Travel south through Nairobi to Amboseli National Park, arriving in the late afternoon in time for a game drive beneath Mount Kilimanjaro.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Amboseli - Penety Resort","activities":["Drive south through Nairobi to Amboseli","Lunch en route","Late afternoon game drive beneath Mount Kilimanjaro"],"highlights":["Elephant herds","Mount Kilimanjaro views"]},
  {"day":"Day 6","title":"Full-Day Game Drives in Amboseli","description":"A full day in Amboseli with its large elephant herds and iconic Kilimanjaro backdrop. Nature walks and further cultural visits can be arranged at an extra cost.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Amboseli - Penety Resort","activities":["Sunrise game drive for the clearest Kilimanjaro views","Midday picnic lunch in the park","Afternoon game drive among elephant herds","Optional guided nature walk (extra cost)"],"highlights":["Elephants and Kilimanjaro","Birdlife"]},
  {"day":"Day 7","title":"Amboseli to Nairobi","description":"An early morning game drive and a final view of Kilimanjaro at sunrise, followed by breakfast and the drive back to Nairobi, where the safari ends in the late afternoon.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early morning game drive at sunrise","Breakfast at the lodge","Drive back to Nairobi","Safari ends on arrival in Nairobi"],"highlights":["Kilimanjaro sunrise"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Mara","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"},
  {"name":"Nature walks","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Best time to travel
The Great Migration is typically in the Maasai Mara between July and October, when game viewing is at its most dramatic. Wildlife viewing is rewarding all year round.

Road travel
Road transfers between parks range from 1 to 6 hours. The Mara leg from Nairobi takes approximately 5 to 6 hours, while the Amboseli return takes around 4 hours.
$notes$
WHERE slug = 'ultimate-kenya-safari';

-- 6 Days Tanzania Northern Circuit Safari ----------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Arusha to Tarangire National Park","description":"Depart Arusha in the morning and drive to Tarangire National Park, famous for its ancient baobab trees, large elephant herds and rolling acacia woodland. Enjoy an afternoon game drive before settling into your lodge near the park for dinner.","meals":"Lunch & Dinner","accommodation":"Tarangire - Ngare Lodge","activities":["Morning drive from Arusha to Tarangire National Park","Afternoon game drive among baobabs and elephants","Elephant herd and baobab photography"],"highlights":["Baobab trees","Elephant herds"]},
  {"day":"Day 2","title":"Lake Manyara Game Drive","description":"Travel to Lake Manyara National Park and spend the afternoon on game drives along the lake shore, looking out for the park's famous tree-climbing lions, pink flamingos and more than 400 species of birds.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Manyara - Kankari","activities":["Drive to Lake Manyara National Park","Afternoon game drive along the lake shore","Look out for tree-climbing lions and flamingos"],"highlights":["Tree-climbing lions","Flamingos and birdlife"]},
  {"day":"Day 3","title":"Manyara to the Serengeti","description":"Cross the Ngorongoro Conservation Area highlands and descend into the vast plains of the Serengeti, game viewing along the way. Arrive at camp in the late afternoon in time for an evening game drive.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Serengeti - Engiterata Adventure Camp","activities":["Scenic drive through the Ngorongoro highlands","Game viewing en route to the Serengeti","Evening game drive on the plains"],"highlights":["First Serengeti views","Game viewing en route"]},
  {"day":"Day 4","title":"Full-Day Serengeti Game Drives","description":"A full day exploring the endless plains of the Serengeti. Between roughly June and October this is prime Great Migration territory, and lions, cheetahs and leopards are regularly found trailing the herds.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Serengeti - Engiterata Adventure Camp","activities":["Sunrise game drive on the Serengeti plains","Picnic lunch in the bush","Afternoon game drive tracking predators","Great Migration viewing (June to October)"],"highlights":["Great Migration (seasonal)","Big Five"]},
  {"day":"Day 5","title":"Serengeti to Ngorongoro Conservation Area","description":"After a morning game drive, transfer to the Ngorongoro Conservation Area and overnight at camp on the crater rim, enjoying the cooler highland air and sweeping views over the caldera.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Ngorongoro - Ngorongoro Wild Camp","activities":["Morning game drive in the Serengeti","Drive to the Ngorongoro Conservation Area","Crater rim sunset views"],"highlights":["Crater rim views"]},
  {"day":"Day 6","title":"Ngorongoro Crater & Return to Arusha","description":"Descend early into the Ngorongoro Crater, the world's largest intact volcanic caldera, for a half-day game drive on the crater floor, home to the Big Five and an extraordinary concentration of wildlife. Ascend after a crater-side picnic lunch and drive back to Arusha, where the safari ends in the late afternoon.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early descent onto the Ngorongoro Crater floor","Half-day game drive among the Big Five","Crater-side picnic lunch","Return transfer to Arusha"],"highlights":["Ngorongoro Crater floor","Big Five"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Serengeti","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"},
  {"name":"Nature walks","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Best time to travel
The Great Migration is in the Serengeti around April to June and again late in the year depending on the rains. Lake Manyara birdlife peaks during the wet months. Northern Circuit safaris work well year-round.

Getting there
Safari begins and ends in Arusha. Direct international flights arrive at Kilimanjaro International Airport (JRO) close to Arusha. The Crater descent involves rough roads and dust.

Visa
Tanzania visa is not included for this package and must be obtained before travel.
$notes$
WHERE slug = 'tanzania-northern-circuit';

-- Kenya & Tanzania Combo Package -------------------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to the Maasai Mara","description":"Depart Nairobi through the Great Rift Valley to the Maasai Mara, pausing at the escarpment viewpoint. Arrive in time for lunch and take an afternoon game drive on the plains.","meals":"Lunch & Dinner","accommodation":"Maasai Mara - Jambo Mara Lodge","activities":["Scenic drive through the Great Rift Valley","Lunch and check-in at Jambo Mara Lodge","Afternoon game drive in the Maasai Mara"],"highlights":["First wildlife sightings"]},
  {"day":"Day 2","title":"Full-Day Game Drives in the Mara","description":"Spend the day in the Maasai Mara with a picnic lunch on the plains. Between July and October look for Great Migration crossings on the Mara River, with lions and cheetahs tracking the herds.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Maasai Mara - Jambo Mara Lodge","activities":["Morning game drive tracking the Big Five","Picnic lunch on the plains","Afternoon game drive along the Mara River","Great Migration crossings (July to October)"],"highlights":["Great Migration (seasonal)","Big Five"]},
  {"day":"Day 3","title":"Mara to Lake Nakuru","description":"Transfer to Lake Nakuru National Park and enjoy an afternoon game drive along the lake among flamingos and the park's protected rhinos.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"L. Nakuru - Sarova Woodlands","activities":["Drive from the Mara to Lake Nakuru via Narok","Lunch on arrival","Afternoon game drive along the lake shore","Flamingo and rhino spotting"],"highlights":["Flamingo viewing","Rhino sightings"]},
  {"day":"Day 4","title":"Nakuru to Naivasha & Boat Ride","description":"Early morning game drive at Lake Nakuru, then continue to Lake Naivasha for an afternoon boat safari among hippos and fish eagles.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"L. Naivasha - Lake Naivasha Resort","activities":["Early morning game drive at Lake Nakuru","Drive to Lake Naivasha","Afternoon boat safari among hippos and fish eagles"],"highlights":["Hippo viewing","Boat safari"]},
  {"day":"Day 5","title":"Naivasha to Amboseli","description":"Travel south through Nairobi to Amboseli National Park for an afternoon game drive beneath Mount Kilimanjaro.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Amboseli - Amboseli Sopa Lodge","activities":["Drive south through Nairobi to Amboseli","Lunch en route","Late afternoon game drive beneath Mount Kilimanjaro"],"highlights":["Elephant herds","Mount Kilimanjaro views"]},
  {"day":"Day 6","title":"Full-Day Game Drives in Amboseli","description":"A full day in Amboseli watching elephant herds against the Kilimanjaro backdrop, with a picnic lunch in the park and optional balloon safaris and cultural visits.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Amboseli - Amboseli Sopa Lodge","activities":["Sunrise game drive for the clearest Kilimanjaro views","Midday picnic lunch in the park","Afternoon game drive among elephant herds","Optional hot air balloon safari (extra cost)"],"highlights":["Elephants and Kilimanjaro","Birdlife"]},
  {"day":"Day 7","title":"Amboseli to Arusha","description":"An early morning game drive, then cross the border into Tanzania and continue to Arusha, the safari capital, for an overnight stay.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Arusha - Tulia Boutique Hotel","activities":["Early morning game drive in Amboseli","Border crossing into Tanzania","Transfer to Arusha and overnight"],"highlights":["Cross-border journey"]},
  {"day":"Day 8","title":"Arusha to Tarangire National Park","description":"Drive from Arusha to Tarangire National Park, famous for its baobabs and elephant families, for an afternoon game drive.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Tarangire - Ngare Lodge","activities":["Drive from Arusha to Tarangire National Park","Afternoon game drive among baobabs and elephants"],"highlights":["Baobab trees","Elephant herds"]},
  {"day":"Day 9","title":"Lake Manyara Game Drive","description":"Head to Lake Manyara National Park for game drives along the lake shore, searching for tree-climbing lions and vast birdlife.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Manyara - Kankari","activities":["Drive to Lake Manyara National Park","Afternoon game drive along the lake shore","Look out for tree-climbing lions and flamingos"],"highlights":["Tree-climbing lions","Flamingos and birds"]},
  {"day":"Day 10","title":"Manyara to the Serengeti","description":"Cross the Ngorongoro highlands into the Serengeti with game viewing en route, arriving at camp in time for an evening game drive.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Serengeti - Engiterata Adventure Camp","activities":["Scenic drive through the Ngorongoro highlands","Game viewing en route to the Serengeti","Evening game drive on the plains"],"highlights":["First Serengeti views"]},
  {"day":"Day 11","title":"Full-Day Serengeti Game Drives","description":"A full day on the endless Serengeti plains, prime Great Migration and predator viewing between roughly June and October.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Serengeti - Engiterata Adventure Camp","activities":["Sunrise game drive on the Serengeti plains","Picnic lunch in the bush","Afternoon game drive tracking predators"],"highlights":["Great Migration (seasonal)","Big Five"]},
  {"day":"Day 12","title":"Ngorongoro Crater & Return to Arusha","description":"Descend into the Ngorongoro Crater for a half-day game drive on the crater floor, then ascend and return to Arusha in the late afternoon, where the safari ends.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early descent onto the Ngorongoro Crater floor","Half-day game drive among the Big Five","Crater-side picnic lunch","Return transfer to Arusha"],"highlights":["Ngorongoro Crater floor","Big Five"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari (Mara or Serengeti)","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"},
  {"name":"Nature walks","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Visa
Both the Kenya and Tanzania visas are included in this package, covering the cross-border element of the itinerary.

Best time to travel
The Great Migration is in the Masai Mara around July to October and in the Serengeti at other times of the year depending on the rains, making the combo a strong choice in most months.

Getting there
The safari begins in Nairobi and ends in Arusha. Please plan international flights accordingly, or ask us to advise the best route.
$notes$
WHERE slug = 'kenya-tanzania-combo';

-- Amboseli Tsavo Gateway Luxury Safari -------------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to Amboseli","description":"Depart Nairobi and drive south to Amboseli National Park, arriving at the lodge in time for lunch. In the afternoon, set out on a game drive among Amboseli's elephant herds with Mount Kilimanjaro rising as the backdrop.","meals":"Lunch & Dinner","accommodation":"Amboseli - Penety Resort","activities":["Drive south from Nairobi to Amboseli","Lunch and check-in at the lodge","Afternoon game drive among elephant herds","Mount Kilimanjaro photography"],"highlights":["Elephant herds","Mount Kilimanjaro views"]},
  {"day":"Day 2","title":"Full-Day Game Drives in Amboseli","description":"A full day in Amboseli, famous for its large elephant herds and the views of Kilimanjaro. Game drives at dawn and dusk give the best light for photography, with a picnic lunch in the park.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Amboseli - Penety Resort","activities":["Sunrise game drive for Kilimanjaro views","Midday picnic lunch in the park","Afternoon game drive among elephants and birdlife"],"highlights":["Elephants and Kilimanjaro","Birdlife"]},
  {"day":"Day 3","title":"Amboseli to Tsavo East","description":"After a morning game drive in Amboseli, transfer to Tsavo East National Park and enjoy an afternoon game drive across its vast red plains, home to the iconic red elephants and Lugard Falls.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Tsavo East - Voi Safari Lodge","activities":["Morning game drive in Amboseli","Drive to Tsavo East National Park","Afternoon game drive among red elephants","Lugard Falls and Galana River views"],"highlights":["Red elephants","Lugard Falls"]},
  {"day":"Day 4","title":"Tsavo East to Tsavo West","description":"Morning game drive in Tsavo East, then transfer to Tsavo West National Park for an afternoon game drive, including a visit to the crystal-clear Mzima Springs where hippos and fish can be watched from an underwater viewing chamber.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Tsavo West - Ngulia Safari Lodge","activities":["Morning game drive in Tsavo East","Drive to Tsavo West National Park","Mzima Springs underwater viewing chamber","Afternoon game drive"],"highlights":["Mzima Springs","Hippo viewing"]},
  {"day":"Day 5","title":"Tsavo West to Nairobi","description":"An early morning game drive in Tsavo West, breakfast at the lodge, then the drive back to Nairobi where the safari ends in the afternoon.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early morning game drive in Tsavo West","Breakfast at the lodge","Drive back to Nairobi","Safari ends on arrival in Nairobi"],"highlights":["Final wildlife sightings"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Maasai village visit","price":null,"price_text":"On request"},
  {"name":"Nature walks","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Important
Amboseli National Park entrance fees are NOT included in the package price and must be paid directly at the gate. Tsavo park fees are included.

Road travel
Road transfers between the parks range from about 1 to 3 hours. The Nairobi leg each way takes approximately 4 hours.

When to go
Dry months (June to October) offer the clearest Kilimanjaro views over Amboseli.
$notes$
WHERE slug = 'amboseli-tsavo-gateway';

-- Hells Gate & Lake Naivasha Luxury Safari ---------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Hells Gate Cycling Safari & Lake Naivasha","description":"Depart Nairobi and head into the Great Rift Valley to Hells Gate National Park, where you cycle among zebras, giraffes and warthogs on the included mountain bikes, hike up to Fischer's Tower and explore the dramatic gorges and geothermal steam plumes. In the afternoon, transfer to Lake Naivasha and enjoy an included sunset boat ride to spot hippos and fish eagles.","meals":"Lunch & Dinner","accommodation":"Lake Naivasha Sopa Resort","activities":["Drive from Nairobi to Hells Gate National Park","Guided cycling safari among wildlife","Fischer's Tower hike","Gorge and geothermal steam exploration","Sunset boat ride on Lake Naivasha (included)"],"highlights":["Cycling through wildlife","Volcanic gorges","Hippo viewing at sunset"]},
  {"day":"Day 2","title":"Morning Lake Activity & Return to Nairobi","description":"Start the day with a morning nature or birdwatching activity around the lake before breakfast, then return to Nairobi where the tour ends around midday.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Morning nature or birdwatching walk around the lake","Breakfast at the resort","Drive back to Nairobi","Tour ends on arrival in Nairobi"],"highlights":["Lake Naivasha views"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Crescent Island walking safari","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Included
Bicycle hire at Hells Gate and the Lake Naivasha boat ride are both included in the package. The Lake Naivasha Sopa Resort (or similar) provides the overnight stay.

What to bring
Sturdy walking shoes, sunhat and sunscreen for the cycling and hiking sections of Hells Gate.

Pace
Perfect as a short escape from Nairobi; transfers are around 1.5 to 2 hours each way.
$notes$
WHERE slug = 'hells-gate-naivasha';

-- 3 Days Mount Kenya Trekking Adventure ------------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to Sirimon Gate & Old Moses Camp","description":"Depart Nairobi early by public shared shuttle van, travelling north through Nanyuki to the Sirimon Gate on the dry western side of Mount Kenya. After park registration, begin trekking through montane forest and bamboo into the alpine zone, arriving at Old Moses Camp (3,300m) in the afternoon for dinner and your first night on the mountain.","meals":"Lunch & Dinner","accommodation":"Old Moses Camp","activities":["Public shared shuttle van from Nairobi to Sirimon Gate","Park registration and briefing at the gate","Forest and bamboo trekking into the alpine zone","Arrival and overnight at Old Moses Camp (3,300m)"],"highlights":["Equator crossing en route","Bamboo forest and giant heather"]},
  {"day":"Day 2","title":"Old Moses Camp to Shipton's Camp","description":"A full trekking day through dramatic alpine valleys and open moorland to Shipton's Camp (4,200m), with magnificent views of the peaks, the Mackinder Valley and the glacier-carved ridges above. Arrive in the afternoon and rest at altitude.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Shipton's Hut","activities":["Full-day alpine valley trekking","Climb high and sleep low acclimatisation","Mackinder Valley and summit views","Overnight at Shipton's Camp (4,200m)"],"highlights":["Mackinder Valley views","Giant lobelia and groundsel"]},
  {"day":"Day 3","title":"Summit Point Lenana & Return to Nairobi","description":"Begin before dawn for the final climb to Point Lenana (4,985m), reaching the summit in time for sunrise over the peaks and the Great Rift Valley beyond. Descend back through the moorland towards the Sirimon route, then return to Nairobi by private shuttle, arriving in the evening.","meals":"Breakfast & Lunch (packed)","accommodation":"-","activities":["Pre-dawn summit ascent to Point Lenana (4,985m)","Sunrise at the summit","Descent to the Sirimon Gate","Return transfer to Nairobi"],"highlights":["Sunrise at Point Lenana (4,985m)","Views across the Great Rift Valley"]}
]$$::jsonb,
optional_activities = $$[]$$::jsonb,
notes = $notes$
Fitness & altitude
This is a demanding high-altitude trek. We recommend prior hiking experience and good fitness. Speak to your doctor about altitude sickness prevention before travel.

Gear
Personal clothing and individual climbing gear are not included. Bring or hire appropriate boots, warm layers and a sleeping bag.

Summit success
The summit attempt depends on weather and group acclimatisation. A professional guide monitors the group throughout.
$notes$
WHERE slug = 'mount-kenya-trekking-3-days';

-- 4 Days Mount Kenya Trek: Lake Rutundu - Alice - Ellis --------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nanyuki to Lake Rutundu","description":"Travel from Nairobi to Nanyuki by public shared shuttle van, where you meet your mountain guide. Continue by private 4x4 to the trailhead, then trek up through forest and moorland to Lake Rutundu (3,059m), one of Mount Kenya's most beautiful glacial lakes, and set up camp for the night.","meals":"Lunch & Dinner","accommodation":"Campsite at Lake Rutundu","activities":["Public shared shuttle van from Nairobi to Nanyuki","Meet your guide in Nanyuki","Private 4x4 transfer to the trailhead","Trek to Lake Rutundu (3,059m) and camp setup"],"highlights":["Lake Rutundu scenery"]},
  {"day":"Day 2","title":"Lake Rutundu to Lake Alice","description":"Trek across the high moorland to the secluded crater lake of Lake Alice, passing the Mugi Hill viewpoint for panoramic views of the mountain's peaks. Overnight in a lakeside campsite under the stars.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Campsite at Lake Alice","activities":["Alpine moorland trekking","Mugi Hill panoramic viewpoint","Arrival and overnight at Lake Alice campsite"],"highlights":["Lake Alice crater lake","Mugi Hill panorama"]},
  {"day":"Day 3","title":"Lake Alice to Lake Ellis","description":"Continue through dramatic highland scenery to Lake Ellis, pausing to admire the Nithi Waterfall en route. Settle into the evening campsite beside the lake.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Campsite at Lake Ellis","activities":["Alpine trekking across the highland plateau","Nithi Waterfall visit","Arrival and overnight at Lake Ellis campsite"],"highlights":["Lake Ellis panoramic views","Nithi Waterfall"]},
  {"day":"Day 4","title":"Descent & Return to Nanyuki","description":"Descend through forest and moorland to the trailhead, where your 4x4 transfers you back to Nanyuki for onward connections.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Descent trek to the trailhead","Private 4x4 transfer back to Nanyuki","Onward connections"],"highlights":["Final mountain views"]}
]$$::jsonb,
optional_activities = $$[]$$::jsonb,
notes = $notes$
Route
This trek visits the tranquil lakes of the Sirimon and Burguret areas and does not summit the main peaks. It suits travellers who prefer scenic mountain hiking without a technical summit.

Gear
Personal hiking apparel and gear are not included. A 4x4 is needed for some approach sections and is arranged as part of the trip.

Best season
The drier months of June to March generally offer the most settled highland weather.
$notes$
WHERE slug = 'mount-kenya-lakes-trek-4-days';

-- 5 Days Mount Kenya Trek: Sirimon Up, Chogoria Down -----------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to Sirimon Gate & Old Moses Camp","description":"Depart Nairobi early by public shared shuttle van to the Sirimon Gate. After registration, trek through forest and bamboo into the alpine zone, arriving at Old Moses Camp (3,300m) in the afternoon.","meals":"Lunch & Dinner","accommodation":"Old Moses Camp","activities":["Public shared shuttle van from Nairobi to Sirimon Gate","Park registration at the gate","Forest and bamboo trekking","Overnight at Old Moses Camp (3,300m)"],"highlights":["Equator crossing en route"]},
  {"day":"Day 2","title":"Old Moses Camp to Shipton's Camp","description":"Trek up through the magnificent Mackinder Valley to Shipton's Camp (4,200m), taking a leisurely pace to acclimatise before the summit attempt.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Shipton's Camp","activities":["Full-day trek through the Mackinder Valley","Altitude acclimatisation at Shipton's Camp","Overnight at Shipton's Camp (4,200m)"],"highlights":["Mackinder Valley views","Giant lobelia and groundsel"]},
  {"day":"Day 3","title":"Summit Point Lenana & Gorges Valley Descent","description":"Pre-dawn summit push to Point Lenana (4,985m) for sunrise, then descend into the magnificent Gorges Valley past Lake Michaelson on the wild Chogoria side of the mountain, before transferring to the Mt Kenya Bandas.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Mt. Kenya Bandas","activities":["Pre-dawn summit ascent to Point Lenana (4,985m)","Sunrise at the summit","Gorges Valley descent past Lake Michaelson","Transfer to Mt Kenya Bandas"],"highlights":["Point Lenana sunrise","Gorges Valley views","Lake Michaelson"]},
  {"day":"Day 4","title":"Chogoria Route Descent","description":"Continue down the Chogoria route through bamboo forest, waterfalls and river valleys, overnighting again at the Mt Kenya Bandas.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Mt. Kenya Bandas","activities":["Bamboo forest and waterfall trekking","Nithi Waterfall visit","Wildlife and bird spotting","Overnight at Mt Kenya Bandas"],"highlights":["Waterfalls","Scenic valleys"]},
  {"day":"Day 5","title":"Return to Nairobi","description":"Final descent through the forest to the Chogoria Gate and transfer back to Nairobi, arriving in the afternoon where the trek ends.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Descent to Chogoria Gate","Return transfer to Nairobi","Trek ends on arrival in Nairobi"],"highlights":["Final views"]}
]$$::jsonb,
optional_activities = $$[]$$::jsonb,
notes = $notes$
Route
This is a classic traverse combining the Sirimon ascent with the dramatic Chogoria descent, widely regarded as the most scenic crossing of Mount Kenya.

Gear
Personal hiking gear and clothing are not included. Warm layers, rain gear and a suitable sleeping bag are essential.

Fitness
This is a demanding high-altitude trek; come prepared with good fitness and speak to a doctor about altitude precautions in advance.
$notes$
WHERE slug = 'mount-kenka-sirimon-chogoria-5-days';

-- 4 Days Masai Mara Luxury Safari -------------------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Nairobi to the Masai Mara","description":"Depart Nairobi and travel to the Masai Mara by road, arriving at your luxury camp in time for lunch. Settle in and enjoy your first afternoon game drive on the plains, with an optional sundowner served in the bush before dinner.","meals":"Lunch & Dinner","accommodation":"&Beyond Kichwa Tembo Tented Camp / Mara Bush Tops Luxury Camp / PrideInn Mara Camp","activities":["Scenic drive through the Great Rift Valley","Lunch and check-in at your luxury camp","Afternoon game drive on the plains","Optional bush sundowner"],"highlights":["First game drive","Luxury camp arrival"]},
  {"day":"Day 2","title":"Full-Day Game Drives in the Mara","description":"A full day of exclusive game viewing focused on the Big Five, with a gourmet bush breakfast or picnic lunch on the plains. Between July and October the Great Migration may be crossing the Mara River.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"&Beyond Kichwa Tembo Tented Camp / Mara Bush Tops Luxury Camp / PrideInn Mara Camp","activities":["Morning game drive in search of the Big Five","Gourmet bush breakfast or picnic lunch","Afternoon game drive","Great Migration river crossings (July to October)"],"highlights":["Big Five sightings","Great Migration (seasonal)","Photography"]},
  {"day":"Day 3","title":"Game Drives & Camp Experiences","description":"Continue with morning and afternoon game drives on the private concession and reserve. Use the day for optional extras such as a Maasai village visit, a guided nature walk or a hot air balloon safari at dawn.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"&Beyond Kichwa Tembo Tented Camp / Mara Bush Tops Luxury Camp / PrideInn Mara Camp","activities":["Morning game drive on the private concession","Optional Maasai village visit (extra cost)","Optional guided nature walk (extra cost)","Optional hot air balloon safari at dawn (extra cost)","Afternoon game drive"],"highlights":["Big Five","Camp luxuries"]},
  {"day":"Day 4","title":"Morning Game Drive & Return to Nairobi","description":"An early morning game drive followed by breakfast, then the journey back to Nairobi where the safari ends in the late afternoon.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early morning game drive","Breakfast at camp","Drive back to Nairobi","Safari ends on arrival in Nairobi"],"highlights":["Sunrise wildlife viewing"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Mara","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"},
  {"name":"Nature walks","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Camp selection
Accommodation is at &Beyond Kichwa Tembo Tented Camp or one of the other listed luxury options, subject to availability at the time of booking. The camp is set on a private concession overlooking the Mara plains.

Visa
Kenya visa is included in this package.

Optional extras
Hot air balloon safari, Maasai village visits and nature walks are available at an additional cost and can be arranged on site.
$notes$
WHERE slug = 'masai-mara-luxury-safari-4-days';

-- Tanzania Luxury Safari - Serengeti & Ngorongoro ---------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Arusha to the Serengeti","description":"Depart Arusha and travel to the Serengeti, crossing the Ngorongoro highlands, and arrive at your luxury camp in the late afternoon in time for a first game drive on the endless plains.","meals":"Lunch & Dinner","accommodation":"Serengeti - Mayo Luxury Camp / Serengeti Serena Safari Lodge","activities":["Scenic drive from Arusha through the Ngorongoro highlands","Arrival and check-in at your luxury Serengeti camp","Late afternoon game drive on the plains"],"highlights":["First Serengeti views"]},
  {"day":"Day 2","title":"Full-Day Serengeti Game Drives","description":"A full day exploring the Serengeti with sunrise and late-afternoon game drives. Between roughly June and October this is prime Great Migration and predator territory, with sunset sundowners back at camp.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Serengeti - Mayo Luxury Camp / Serengeti Serena Safari Lodge","activities":["Sunrise game drive on the Serengeti plains","Midday rest and lunch at camp","Afternoon game drive tracking predators","Sundowners at camp"],"highlights":["Great Migration (seasonal)","Big Five","Sundowners"]},
  {"day":"Day 3","title":"Serengeti to Ngorongoro","description":"Morning game drive, then transfer to the Ngorongoro Conservation Area and overnight at your lodge on the crater rim, watching the sun set over the crater floor below.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Ngorongoro - Acacia Farm Lodge / Ngorongoro Serena Lodge","activities":["Morning game drive in the Serengeti","Drive to the Ngorongoro Conservation Area","Crater rim sunset views"],"highlights":["Crater rim views"]},
  {"day":"Day 4","title":"Ngorongoro Crater & Return to Arusha","description":"Descend early into the Ngorongoro Crater for a half-day game drive on the crater floor, the best place in Africa to see the Big Five in a single day. Ascend mid-morning and drive back to Arusha, where the safari ends in the late afternoon.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Early descent onto the crater floor","Half-day game drive in the Ngorongoro Crater","Crater-side picnic lunch","Return transfer to Arusha"],"highlights":["Ngorongoro Crater floor","Big Five"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Hot air balloon safari over the Serengeti","price":null,"price_text":"On request"},
  {"name":"Maasai village visit","price":null,"price_text":"On request"}
]$$::jsonb,
notes = $notes$
Visa
Tanzania visa is included in this package.

Best time to travel
The Great Migration is in the Serengeti for much of the year, moving through the park in phases depending on the rains. Ngorongoro Crater offers resident game throughout the year.

Getting there
Safari begins and ends in Arusha. Kilimanjaro International Airport (JRO) is the closest gateway.
$notes$
WHERE slug = 'tanzania-luxury-serengeti-ngorongoro';

-- 6 Days Machame Route - Mount Kilimanjaro ----------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Arusha to Machame Gate & Machame Camp","description":"Take a public shared shuttle van transfer from Arusha to the Machame Gate (1,800m) and complete your park registration. Begin the climb through lush montane rainforest, keeping an eye out for colobus monkeys and colourful birds, to reach Machame Camp (2,980m) after about 5 to 6 hours of trekking.","meals":"Lunch & Dinner","accommodation":"Machame Camp","activities":["Public shared shuttle van transfer from Arusha to Machame Gate","Park registration and briefing","Rainforest trekking to Machame Camp (2,980m)","Colobus monkey and bird spotting"],"highlights":["Rainforest hike","Colobus monkeys"]},
  {"day":"Day 2","title":"Machame Camp to Shira Camp","description":"Trek out of the rainforest and across open heath and moorland to Shira Camp (3,840m), with vast views across the Shira Plateau and a spectacular sunset over the plains.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Shira Camp","activities":["Heath and moorland trekking","Shira Plateau views","Overnight at Shira Camp (3,840m)"],"highlights":["Shira Plateau views","Sunset over the plains"]},
  {"day":"Day 3","title":"Shira Camp to Barranco Camp via Lava Tower","description":"Acclimatisation day: climb high to Lava Tower (4,600m) then descend to Barranco Camp (3,960m), following the golden rule of climb high, sleep low amid alpine desert scenery.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Barranco Camp","activities":["Climb to Lava Tower (4,600m) for acclimatisation","Descend to Barranco Camp (3,960m)","Alpine desert trekking"],"highlights":["Lava Tower (4,600m)","Alpine desert landscape"]},
  {"day":"Day 4","title":"Barranco Camp to Barafu Camp","description":"Scramble up the dramatic Barranco Wall before crossing the Karanga Valley to reach Barafu Camp (4,600m), the base for the final summit push.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Barafu Camp","activities":["Barranco Wall scramble","Karanga Valley crossing","Overnight at Barafu Camp (4,600m)"],"highlights":["Barranco Wall","Views of the southern glaciers"]},
  {"day":"Day 5","title":"Summit Uhuru Peak & Descend to Mweka Camp","description":"Start before midnight for the summit ascent, passing Stella Point (5,756m) and reaching Uhuru Peak (5,895m) for sunrise, then descend to Mweka Camp (3,080m) for the night.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Mweka Camp","activities":["Midnight summit ascent","Uhuru Peak (5,895m) at sunrise","Stella Point (5,756m)","Descent to Mweka Camp (3,080m)"],"highlights":["Uhuru Peak (5,895m)","Stella Point","Glacier views"]},
  {"day":"Day 6","title":"Mweka Camp to Mweka Gate & Arusha","description":"Final descent through rainforest to Mweka Gate, where you receive your certificate of achievement, then transfer back to Arusha where the trek ends.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Rainforest descent to Mweka Gate","Certificate of Achievement ceremony","Transfer to Arusha"],"highlights":["Completion ceremony"]}
]$$::jsonb,
optional_activities = $$[]$$::jsonb,
notes = $notes$
Gear
Personal trekking gear (sleeping bag, hiking poles, boots, warm layers) is not included. Rentals can be arranged in Arusha.

Fitness & altitude
This is a challenging high-altitude climb. The 6-day Machame route has a slightly lower success rate than longer routes because of less acclimatisation time. Discuss altitude precautions with your doctor before travelling.

Included
Park fees, professional guides, cook and porters, mountain accommodation, meals and the certificate are all included.
$notes$
WHERE slug = 'kilimanjaro-machame-6-days';

-- 7 Days Mount Kilimanjaro Trek - Machame Route -----------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Arusha to Machame Gate & Machame Camp","description":"Take a public shared shuttle van transfer from Arusha to the Machame Gate (1,800m) and complete your park registration. Begin the climb through lush montane rainforest, watching for colobus monkeys and colourful birds, to reach Machame Camp (2,980m) after about 5 to 6 hours of trekking.","meals":"Lunch & Dinner","accommodation":"Machame Camp","activities":["Public shared shuttle van transfer from Arusha to Machame Gate","Park registration and briefing","Rainforest trekking to Machame Camp (2,980m)","Colobus monkey and bird spotting"],"highlights":["Rainforest hike"]},
  {"day":"Day 2","title":"Machame Camp to Shira Camp","description":"Trek out of the forest and across heath and moorland to Shira Camp (3,840m) with its vast plateau views.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Shira Camp","activities":["Heath and moorland trekking","Shira Plateau views","Overnight at Shira Camp (3,840m)"],"highlights":["Shira Plateau views"]},
  {"day":"Day 3","title":"Shira Camp to Barranco Camp via Lava Tower","description":"Climb high to Lava Tower (4,600m) for acclimatisation, then descend to Barranco Camp (3,960m) to help your body adjust to the altitude.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Barranco Camp","activities":["Lava Tower (4,600m) acclimatisation climb","Descend to Barranco Camp (3,960m)"],"highlights":["Lava Tower (4,600m)"]},
  {"day":"Day 4","title":"Barranco Camp to Karanga Camp","description":"Scramble the Barranco Wall and cross the Karanga Valley to Karanga Camp (4,000m), adding an extra night at altitude for better acclimatisation.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Karanga Camp","activities":["Barranco Wall scramble","Karanga Valley crossing","Overnight at Karanga Camp (4,000m)"],"highlights":["Barranco Wall"]},
  {"day":"Day 5","title":"Karanga Camp to Barafu Camp","description":"Continue through the alpine desert to Barafu Camp (4,600m), the base for the summit night. Rest early ahead of the midnight climb.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Barafu Camp","activities":["Alpine desert trekking","Arrival and rest at Barafu Camp (4,600m)"],"highlights":["Southern glacier views"]},
  {"day":"Day 6","title":"Summit Uhuru Peak & Descend to Mweka Camp","description":"Start before midnight, pass Stella Point (5,756m) and reach Uhuru Peak (5,895m) at sunrise. Descend to Mweka Camp (3,080m) for the night.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Mweka Camp","activities":["Midnight summit ascent","Uhuru Peak (5,895m) at sunrise","Stella Point (5,756m)","Descent to Mweka Camp (3,080m)"],"highlights":["Uhuru Peak (5,895m)","Stella Point sunrise"]},
  {"day":"Day 7","title":"Mweka Camp to Mweka Gate & Arusha","description":"Final descent through rainforest to Mweka Gate, receive the certificate of achievement, and transfer back to Arusha.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Rainforest descent to Mweka Gate","Certificate of Achievement ceremony","Transfer to Arusha"],"highlights":["Completion ceremony"]}
]$$::jsonb,
optional_activities = $$[]$$::jsonb,
notes = $notes$
Why 7 days
The extra acclimatisation night at Karanga gives this Machame route a higher summit success rate than the 6-day version while following the same scenic trail.

Gear
Personal climbing gear (boots, sleeping bag, poles, warm layers) is not included and can be hired in Arusha.

Fitness & altitude
This is a demanding high-altitude climb. Speak to your doctor about altitude sickness prevention well before departure.
$notes$
WHERE slug = 'kilimanjaro-machame-7-days';

-- 8 Days Kilimanjaro Climb via Lemosho Route --------------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Arrival in Arusha","description":"Meet and greet at Kilimanjaro International Airport and transfer to your hotel in Arusha by public shared shuttle van. A full briefing covers the route, gear check and the team that will accompany you.","meals":"Breakfast","accommodation":"Hotel in Arusha","activities":["Public shared shuttle van transfer from Kilimanjaro International Airport","Arrival and check-in at your Arusha hotel","Pre-climb briefing","Gear check with your mountain team"],"highlights":["Arusha base"]},
  {"day":"Day 2","title":"Londorossi Gate to Mti Mkubwa Camp","description":"Drive to the Londorossi Gate and start the climb through pristine montane forest to Mti Mkubwa Camp (2,780m), watching for monkeys and forest birds along the trail.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Mti Mkubwa Camp","activities":["Transfer to the Londorossi Gate","Park registration","Montane forest trekking","Overnight at Mti Mkubwa Camp (2,780m)"],"highlights":["Forest wildlife"]},
  {"day":"Day 3","title":"Mti Mkubwa Camp to Shira Camp","description":"Trek onto the vast Shira Plateau, crossing open moorland to the camp at around 3,500m with superb views back towards the mountain.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Shira Camp (Shira 1)","activities":["Shira Plateau crossing","Moorland trekking","Overnight at Shira Camp (Shira 1)"],"highlights":["Shira Plateau views"]},
  {"day":"Day 4","title":"Shira Camp to Barranco Camp via Lava Tower","description":"Acclimatisation day: climb high to Lava Tower (4,600m) then descend to Barranco Camp (3,960m) to help your body adjust to the altitude.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Barranco Camp","activities":["Lava Tower (4,600m) acclimatisation climb","Descend to Barranco Camp (3,960m)"],"highlights":["Lava Tower (4,600m)"]},
  {"day":"Day 5","title":"Barranco Camp to Karanga Camp","description":"Scramble up the Barranco Wall and descend into the Karanga Valley, overnighting at Karanga Camp (4,000m).","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Karanga Camp","activities":["Barranco Wall scramble","Karanga Valley crossing","Overnight at Karanga Camp (4,000m)"],"highlights":["Barranco Wall"]},
  {"day":"Day 6","title":"Karanga Camp to Barafu Camp","description":"Climb through the alpine desert to Barafu Camp (4,600m), the base for the summit attempt, and rest ahead of the midnight start.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Barafu Camp","activities":["Alpine desert trekking","Arrival and rest at Barafu Camp (4,600m)"],"highlights":["Glacier views"]},
  {"day":"Day 7","title":"Summit Uhuru Peak & Descend to Mweka Camp","description":"Start before midnight, reach the crater rim at Stella Point (5,756m) and continue to Uhuru Peak (5,895m) for sunrise. Descend to Mweka Camp (3,080m) for the night.","meals":"Breakfast, Lunch & Dinner (full board)","accommodation":"Mweka Camp","activities":["Midnight summit ascent","Stella Point (5,756m) on the crater rim","Uhuru Peak (5,895m) at sunrise","Descent to Mweka Camp (3,080m)"],"highlights":["Uhuru Peak (5,895m)","Stella Point sunrise"]},
  {"day":"Day 8","title":"Mweka Camp to Mweka Gate & Arusha","description":"Final descent through rainforest to Mweka Gate, celebrate with your certificate, and transfer back to Arusha or the airport.","meals":"Breakfast & Lunch","accommodation":"-","activities":["Rainforest descent to Mweka Gate","Certificate of Achievement ceremony","Transfer to Arusha or the airport"],"highlights":["Completion ceremony"]}
]$$::jsonb,
optional_activities = $$[]$$::jsonb,
notes = $notes$
Route & success
The Lemosho Route begins on the quiet western slopes and is widely regarded as the most scenic and has among the highest summit success rates, thanks to its longer itinerary.

Fitness & altitude
This is a demanding multi-day high-altitude climb. Prepare with regular endurance training and consult your doctor about altitude medicine before travel.

Included
All park fees and government taxes, professional English-speaking guides, cook and porters, full-board meals, tents, water, rescue fees and airport transfers are included. Visa fees and personal gear are not.
$notes$
WHERE slug = 'kilimanjaro-lemosho-8-days';

-- 3 Days Ritz-Carlton Masai Mara Flying Package -----------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Fly to the Masai Mara & Arrival","description":"Board your scheduled light-aircraft flight from Nairobi to the Masai Mara (about 45 minutes) and transfer to The Ritz-Carlton, Masai Mara. After a welcome and orientation, enjoy your first exclusive game drive in a private luxury open safari land cruiser, followed by an evening sundowner and boma dining experience.","meals":"Lunch & Dinner","accommodation":"The Ritz-Carlton, Masai Mara - luxury tented suite with butler service","activities":["Scheduled flight from Nairobi to the Masai Mara","Transfer and welcome at The Ritz-Carlton, Masai Mara","Private luxury game drive in an open land cruiser","Sundowner and boma dinner"],"highlights":["First private game drive","Ritz-Carlton arrival"]},
  {"day":"Day 2","title":"Full Day of Exclusive Experiences","description":"A full day at The Ritz-Carlton, beginning with a champagne breakfast or sunrise coffee glide, morning and afternoon private game drives with refreshments, high tea with exotic teas and edible flowers, and time at the wellness hub with its signature open-air pool. The evening can include a chef's table experience in the wine cellar with wine pairing.","meals":"Breakfast, Lunch & Dinner (full board with butler service)","accommodation":"The Ritz-Carlton, Masai Mara - luxury tented suite with butler service","activities":["Champagne breakfast or sunrise coffee glide","Morning private game drive","High tea with exotic teas","Afternoon private game drive","Wellness hub and open-air pool","Chef's table and wine pairing (evening)"],"highlights":["Big Five game drives","Champagne breakfast","Chef's table"]},
  {"day":"Day 3","title":"Morning Game Drive & Return Flight","description":"An early morning game drive, a leisurely breakfast, then transfer to the airstrip for your scheduled return flight to Nairobi, where the package ends.","meals":"Breakfast","accommodation":"-","activities":["Early morning private game drive","Leisurely breakfast at the lodge","Transfer to the airstrip","Return flight to Nairobi"],"highlights":["Final wildlife sightings"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Spa treatments","price":null,"price_text":"On request"},
  {"name":"Rhino Sanctuary visit (entrance fees payable directly)","price":null,"price_text":"On request"},
  {"name":"Lazizi Welfare Foundation fee","price":15,"price_text":"USD 15 per person"}
]$$::jsonb,
notes = $notes$
Rates & seasons
Rates are per person in USD. High/peak season (1 June - 15 October 2026 & 20 December 2026 - 5 January 2027): $6,400 per person sharing, $7,900 solo traveller. Low/shoulder season (16 October - 19 December 2026): $4,890 per person sharing, $6,300 solo traveller.

What is included
Return flights and airstrip transfers, exclusive private game drives in a luxury open land cruiser, full board dining with butler service, premium beverages, champagne breakfast, sundowners, boma dining, chef's table, high tea, photo studio, wellness hub access, cultural village visit, laundry, wi-fi and all statutory taxes. Spa treatments, items of a personal nature and gratuities are extra. The Lazizi Welfare Foundation fee of USD 15 per person is payable directly.

Packing
Flights use a light-aircraft schedule, so pack light in soft-sided luggage and confirm included weight with your consultant before departure.
$notes$
WHERE slug = '3-days-ritz-carlton-masai-mara-flying-package';

-- 4 Days Ritz-Carlton Masai Mara Flying Package -----------------------
UPDATE tour_packages SET itinerary = $$[
  {"day":"Day 1","title":"Fly to the Masai Mara & Arrival","description":"Board your scheduled light-aircraft flight from Nairobi to the Masai Mara (about 45 minutes) and transfer to The Ritz-Carlton, Masai Mara. After a welcome and orientation, enjoy your first exclusive game drive in a private luxury open safari land cruiser, followed by a sundowner and boma dining experience.","meals":"Lunch & Dinner","accommodation":"The Ritz-Carlton, Masai Mara - luxury tented suite with butler service","activities":["Scheduled flight from Nairobi to the Masai Mara","Transfer and welcome at The Ritz-Carlton, Masai Mara","Private luxury game drive in an open land cruiser","Sundowner and boma dinner"],"highlights":["First private game drive","Ritz-Carlton arrival"]},
  {"day":"Day 2","title":"Full Day of Exclusive Experiences","description":"Champagne breakfast or sunrise coffee glide, morning and afternoon private game drives with refreshments, high tea, and time at the wellness hub. The evening can feature a chef's table experience in the wine cellar with wine pairing.","meals":"Breakfast, Lunch & Dinner (full board with butler service)","accommodation":"The Ritz-Carlton, Masai Mara - luxury tented suite with butler service","activities":["Champagne breakfast or sunrise coffee glide","Morning private game drive","High tea with exotic teas","Afternoon private game drive","Wellness hub and open-air pool"],"highlights":["Big Five game drives","Champagne breakfast"]},
  {"day":"Day 3","title":"Culture & Conservation Day","description":"A second full day offering a Maasai cultural village visit and a visit to the Rhino Sanctuary (entrance payable directly), plus further game drives, the photo studio with Canon professional cameras, and a chef's table dinner to close the stay in style.","meals":"Breakfast, Lunch & Dinner (full board with butler service)","accommodation":"The Ritz-Carlton, Masai Mara - luxury tented suite with butler service","activities":["Morning private game drive","Maasai cultural village visit","Rhino Sanctuary visit (entrance payable directly)","Photo studio with Canon cameras","Afternoon at leisure by the pool"],"highlights":["Cultural village","Rhino Sanctuary","Chef's table"]},
  {"day":"Day 4","title":"Morning Game Drive & Return Flight","description":"An early morning game drive, a leisurely breakfast, then transfer to the airstrip for your scheduled return flight to Nairobi, where the package ends.","meals":"Breakfast","accommodation":"-","activities":["Early morning private game drive","Leisurely breakfast at the lodge","Transfer to the airstrip","Return flight to Nairobi"],"highlights":["Final wildlife sightings"]}
]$$::jsonb,
optional_activities = $$[
  {"name":"Spa treatments","price":null,"price_text":"On request"},
  {"name":"Rhino Sanctuary visit (entrance fees payable directly)","price":null,"price_text":"On request"},
  {"name":"Lazizi Welfare Foundation fee","price":15,"price_text":"USD 15 per person"}
]$$::jsonb,
notes = $notes$
Rates & seasons
Rates are per person in USD. High/peak season (1 June - 15 October 2026 & 20 December 2026 - 5 January 2027): $9,200 per person sharing, $10,500 solo traveller. Low/shoulder season (16 October - 19 December 2026): $6,900 per person sharing, $8,600 solo traveller.

What is included
Return flights and airstrip transfers, exclusive private game drives in a luxury open land cruiser, full board dining with butler service, premium beverages, champagne breakfast, sundowners, boma dining, chef's table, high tea, photo studio, wellness hub access, cultural village visit, laundry, wi-fi and all statutory taxes. Spa treatments, items of a personal nature and gratuities are extra. The Lazizi Welfare Foundation fee of USD 15 per person is payable directly.

Packing
Flights use a light-aircraft schedule, so pack light in soft-sided luggage and confirm included weight with your consultant before departure.
$notes$
WHERE slug = '4-days-ritz-carlton-masai-mara-flying-package';

-- 3. Verification -------------------------------------------------------
SELECT slug,
       jsonb_array_length(coalesce(itinerary, '[]'::jsonb)) AS itinerary_days,
       jsonb_array_length(coalesce(optional_activities, '[]'::jsonb)) AS optional_activities,
       (notes IS NOT NULL AND btrim(notes) <> '') AS has_notes
FROM tour_packages
ORDER BY slug;
