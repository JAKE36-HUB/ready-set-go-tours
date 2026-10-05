-- Adds the 5-day Kenya Honeymoon Ultra-Luxury Safari package.
--
-- Run once in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- Safe to re-run: ADD COLUMN IF NOT EXISTS + ON CONFLICT DO UPDATE.
--
-- Notes:
--   * price_kes is left NULL on purpose so the site always converts at the
--     current USD_TO_KES rate (130) instead of freezing a stale one.
--   * price_basis = 'person' makes the card read "$10,900 / person sharing"
--     instead of the default "/ couple".
--   * itinerary is stored as JSONB so the day-by-day renders on the page.
--   * image is self-hosted at public/images/kenya-honeymoon-ultra-luxury.jpg
--     (sourced from a Pinterest pin) rather than hotlinked from Pinterest.

-- 1. Schema additions (existing packages default to 'couple', unchanged).
ALTER TABLE honeymoon_packages ADD COLUMN IF NOT EXISTS price_basis TEXT DEFAULT 'couple';
ALTER TABLE honeymoon_packages ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;

UPDATE honeymoon_packages
SET price_basis = 'couple'
WHERE price_basis IS NULL OR price_basis = '';

-- 2. The package itself.
INSERT INTO honeymoon_packages (
  name,
  slug,
  image,
  price,
  price_kes,
  price_basis,
  duration,
  accommodation,
  meals,
  transport,
  activities,
  description,
  highlights,
  included,
  itinerary
)
VALUES (
  '5 Days Enchanting Kenya Honeymoon Ultra-Luxury Safari',
  '5-days-enchanting-kenya-honeymoon-ultra-luxury-safari',
  '/images/kenya-honeymoon-ultra-luxury.jpg',
  10900,
  NULL,
  'person',
  '5 Days / 4 Nights',
  'Loldia House, Lake Naivasha & The Ritz-Carlton, Masai Mara Safari Camp',
  'Full board as per the selected lodge meal plan',
  'Private 4x4 safari vehicle with dedicated guide and driver',
  ARRAY[
    'Lake Naivasha boat excursion',
    'Private Maasai Mara game drives',
    'Sundowner on the savannah',
    'Nairobi airport transfers'
  ],
  'Five unforgettable days of Kenyan romance at the very top end of luxury. Your journey begins in Nairobi and continues to Lake Naivasha, where Loldia House provides a tranquil lakeside base for two nights. You then move on to the Maasai Mara for two nights of private game drives from The Ritz-Carlton, Masai Mara Safari Camp, before returning to Nairobi for your onward departure.',
  ARRAY[
    'Loldia House on Lake Naivasha',
    'The Ritz-Carlton, Masai Mara Safari Camp',
    'Private 4x4 and dedicated guide',
    'Private game drives in the Maasai Mara',
    'Private airport transfers'
  ],
  ARRAY[
    '2 nights at Loldia House, Lake Naivasha',
    '2 nights at The Ritz-Carlton, Masai Mara Safari Camp',
    'Private 4x4 vehicle and dedicated guide',
    'Park and conservancy fees',
    'Meals as per the selected lodge plan'
  ],
  $$[
    {
      "day": "Day 1",
      "title": "Nairobi to Lake Naivasha",
      "description": "Arrival in Nairobi and private transfer to Lake Naivasha. Settle into Loldia House and enjoy the remainder of the day at leisure on the lake."
    },
    {
      "day": "Day 2",
      "title": "Lake Naivasha \u2014 Full Day",
      "description": "A full day at Lake Naivasha with your private guide and vehicle, including time on the water and at your own pace in one of Africa's most beautiful rift-valley lakes."
    },
    {
      "day": "Day 3",
      "title": "Lake Naivasha to Maasai Mara",
      "description": "Depart Naivasha after breakfast and travel to the Maasai Mara. Check in to The Ritz-Carlton, Masai Mara Safari Camp and take your first game drives in the reserve."
    },
    {
      "day": "Day 4",
      "title": "Maasai Mara \u2014 Full Day",
      "description": "A full day on private game drives in the Maasai Mara with your dedicated guide, at whatever pace suits you, with time in the reserve's open savannah."
    },
    {
      "day": "Day 5",
      "title": "Maasai Mara to Nairobi",
      "description": "A final morning in the Mara followed by your return journey to Nairobi (NBO) for your onward flight."
    }
  ]$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  price = EXCLUDED.price,
  price_kes = EXCLUDED.price_kes,
  price_basis = EXCLUDED.price_basis,
  duration = EXCLUDED.duration,
  accommodation = EXCLUDED.accommodation,
  meals = EXCLUDED.meals,
  transport = EXCLUDED.transport,
  activities = EXCLUDED.activities,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  included = EXCLUDED.included,
  itinerary = EXCLUDED.itinerary,
  updated_at = NOW();